import mongoose from 'mongoose';
import MaintenanceLog from '../models/maintenance.model.js';
import Manhole from '../models/manhole.model.js';
import User from '../models/user.model.js';

const MAINTENANCE_STATUSES = ['scheduled', 'in_progress', 'completed', 'deferred', 'cancelled'];
const MAINTENANCE_TYPES = ['routine', 'repair', 'emergency', 'inspection'];

// Helper: resolve manhole by ID or code
const resolveManholeId = async (input) => {
  if (!mongoose.Types.ObjectId.isValid(input)) {
    const manhole = await Manhole.findOne({ id: input });
    return manhole ? manhole._id.toString() : null;
  }
  const manhole = await Manhole.findById(input);
  return manhole ? manhole._id.toString() : null;
};

// 1. Create Maintenance Log
const createMaintenanceLog = async (req, res) => {
  try {
    let { manholeId, userId, type, description, scheduledDate, partsReplaced } = req.body;

    if (!manholeId || !userId || !type || !scheduledDate) {
      return res.status(400).json({
        success: false,
        message: 'Manhole ID, User ID, type and scheduled date are required',
      });
    }

    const resolvedManholeId = await resolveManholeId(manholeId);
    const user = await User.findById(userId);

    if (!resolvedManholeId || !user) {
      return res.status(404).json({
        success: false,
        message: 'Manhole or User not found',
      });
    }

    if (!MAINTENANCE_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid type. Valid types: ${MAINTENANCE_TYPES.join(', ')}`,
      });
    }

    const newLog = new MaintenanceLog({
      _id: new mongoose.Types.ObjectId(),
      manholeId: resolvedManholeId,
      userId,
      type,
      description: description || `${type} maintenance`,
      status: 'scheduled',
      scheduledDate,
      partsReplaced: partsReplaced || [],
      createdAt: new Date(),
    });

    await newLog.save();

    if (user.role === 'worker') {
      user.assignments.push({
        manholeId: resolvedManholeId,
        task: `Maintenance: ${type}`,
        date: scheduledDate,
      });
      await user.save();
    }

    return res.status(201).json({
      success: true,
      message: 'Maintenance log created',
      data: newLog,
    });
  } catch (error) {
    console.error('Create maintenance error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// 2. Update Maintenance Status
const updateMaintenanceStatus = async (req, res) => {
  try {
    const { logId } = req.params;
    const { status, userId, actualStart, actualEnd, notes } = req.body;

    if (!MAINTENANCE_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid statuses: ${MAINTENANCE_STATUSES.join(', ')}`,
      });
    }

    const log = await MaintenanceLog.findById(logId);
    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance log not found',
      });
    }

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
      data: log,
    });
  } catch (error) {
    console.error('Update maintenance error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
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
        message: 'Parts array is required',
      });
    }

    const log = await MaintenanceLog.findById(logId);
    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance log not found',
      });
    }

    log.partsReplaced.push(...parts);
    log.updatedAt = new Date();
    await log.save();

    return res.status(200).json({
      success: true,
      message: 'Parts added to maintenance log',
      data: log.partsReplaced,
    });
  } catch (error) {
    console.error('Add parts error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// 4. Get Maintenance Logs with Filtering
const getMaintenanceLogs = async (req, res) => {
  try {
    let { manholeId, userId, status, type, fromDate, toDate } = req.query;
    const filter = {};

    if (manholeId) {
      const resolvedManholeId = await resolveManholeId(manholeId);
      if (!resolvedManholeId) {
        return res.status(404).json({
          success: false,
          message: 'Manhole not found',
        });
      }
      filter.manholeId = resolvedManholeId;
    }

    if (userId) filter.userId = userId;
    if (status) filter.status = status;
    if (type) filter.type = type;

    if (fromDate || toDate) {
      filter.scheduledDate = {};
      if (fromDate) filter.scheduledDate.$gte = new Date(fromDate);
      if (toDate) filter.scheduledDate.$lte = new Date(toDate);
    }

    const logs = await MaintenanceLog.find(filter)
      .sort({ scheduledDate: -1 })
      .populate('manholeId', 'code')
      .populate('userId', 'name');

    // Transform the logs to match the desired structure
    const maintenanceLogs = logs.map((log, index) => ({
      id: index + 1, // Assuming `id` is sequential in the response
      manhole: `#${log.manholeId.code}`,
      manholeId: log.manholeId._id,
      type: log.type,
      technician: log.userId.name,
      status: log.status,
      date: log.scheduledDate.toISOString().split('T')[0], // Formats the date as "YYYY-MM-DD"
    }));

    return res.status(200).json({
      success: true,
      maintenanceLogs,
    });
  } catch (error) {
    console.error('Get maintenance logs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export { createMaintenanceLog, updateMaintenanceStatus, addMaintenanceParts, getMaintenanceLogs };
