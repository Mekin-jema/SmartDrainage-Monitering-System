import mongoose from 'mongoose';
import MaintenanceLog from '../models/maintenance.model.js';
import Manhole from '../models/manhole.model.js';
import User from '../models/user.model.js';

// Status workflow configuration
const MAINTENANCE_STATUSES = ['scheduled', 'in_progress', 'completed', 'deferred', 'cancelled'];
const MAINTENANCE_TYPES = ['routine', 'repair', 'emergency', 'inspection'];

// 1. Create Maintenance Log
const createMaintenanceLog = async (req, res) => {
  try {
    const { manholeId, userId, type, description, scheduledDate, partsReplaced } = req.body;

    // Validate required fields
    if (!manholeId || !userId || !type || !scheduledDate) {
      return res.status(400).json({
        success: false,
        message: 'Manhole ID, User ID, type and scheduled date are required'
      });
    }

    // Validate reference IDs
    const [manhole, user] = await Promise.all([
      Manhole.findById(manholeId),
      User.findById(userId)
    ]);

    if (!manhole || !user) {
      return res.status(404).json({
        success: false,
        message: 'Manhole or User not found'
      });
    }

    // Validate type and default status
    if (!MAINTENANCE_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid type. Valid types: ${MAINTENANCE_TYPES.join(', ')}`
      });
    }

    // Create new log
    const newLog = new MaintenanceLog({
      _id: new mongoose.Types.ObjectId(),
      manholeId,
      userId,
      type,
      description: description || `${type} maintenance`,
      status: 'scheduled',
      scheduledDate,
      partsReplaced: partsReplaced || [],
      createdAt: new Date()
    });

    await newLog.save();

    // Update worker's assignments if user is a worker
    if (user.role === 'worker') {
      user.assignments.push({
        manholeId,
        task: `Maintenance: ${type}`,
        date: scheduledDate
      });
      await user.save();
    }

    return res.status(201).json({
      success: true,
      message: 'Maintenance log created',
      data: newLog
    });

  } catch (error) {
    console.error('Create maintenance error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// 2. Update Maintenance Status
const updateMaintenanceStatus = async (req, res) => {
  try {
    const { logId } = req.params;
    const { status, userId, actualStart, actualEnd, notes } = req.body;

    // Validate status
    if (!MAINTENANCE_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid statuses: ${MAINTENANCE_STATUSES.join(', ')}`
      });
    }

    const log = await MaintenanceLog.findById(logId);
    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance log not found'
      });
    }

    // Status transition logic
    if (status === 'in_progress') {
      log.actualStart = actualStart || new Date();
    } else if (status === 'completed') {
      log.actualEnd = actualEnd || new Date();
    }

    log.status = status;
    log.updatedAt = new Date();
    if (notes) log.notes = notes;

    await log.save();

    return res.status(200).json({
      success: true,
      message: 'Maintenance status updated',
      data: log
    });

  } catch (error) {
    console.error('Update maintenance error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// 3. Add Parts to Maintenance Log
const addMaintenanceParts = async (req, res) => {
  try {
    const { logId } = req.params;
    const { parts } = req.body;

    if (!parts || !Array.isArray(parts)) {
      return res.status(400).json({
        success: false,
        message: 'Parts array is required'
      });
    }

    const log = await MaintenanceLog.findById(logId);
    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance log not found'
      });
    }

    log.partsReplaced.push(...parts);
    log.updatedAt = new Date();
    await log.save();

    return res.status(200).json({
      success: true,
      message: 'Parts added to maintenance log',
      data: log.partsReplaced
    });

  } catch (error) {
    console.error('Add parts error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// 4. Get Maintenance Logs with Filtering
const getMaintenanceLogs = async (req, res) => {
  try {
    const { manholeId, userId, status, type, fromDate, toDate } = req.query;

    const filter = {};
    if (manholeId) filter.manholeId = manholeId;
    if (userId) filter.userId = userId;
    if (status) filter.status = status;
    if (type) filter.type = type;

    // Date range filtering
    if (fromDate || toDate) {
      filter.scheduledDate = {};
      if (fromDate) filter.scheduledDate.$gte = new Date(fromDate);
      if (toDate) filter.scheduledDate.$lte = new Date(toDate);
    }

    const logs = await MaintenanceLog.find(filter)
      .sort({ scheduledDate: -1 })
      .populate('manholeId', 'code location')
      .populate('userId', 'name role');

    return res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });

  } catch (error) {
    console.error('Get maintenance logs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export {
  createMaintenanceLog,
  updateMaintenanceStatus,
  addMaintenanceParts,
  getMaintenanceLogs
};