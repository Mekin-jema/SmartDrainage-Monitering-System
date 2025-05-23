import mongoose from 'mongoose';
import MaintenanceLog from '../models/maintenance.model.js';
import Manhole from '../models/manhole.model.js';
import User from '../models/user.model.js';

const MAINTENANCE_STATUSES = ['scheduled', 'in_progress', 'completed', 'deferred', 'cancelled'];
const MAINTENANCE_TYPES = ['routine', 'repair', 'emergency', 'inspection'];

// Helper: resolve manhole by ID or code
const resolveManholeId = async (input) => {

  const manhole = await Manhole.findOne({id:input});
  return manhole ? manhole.id: null;
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
// 4. Get Maintenance Logs with Filtering
// 4. Get Maintenance Logs with Filtering
const getMaintenanceLogs = async (req, res) => {
  try {
    const { status, type, dateFrom, dateTo } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (dateFrom || dateTo) {
      filter.scheduledDate = {};
      if (dateFrom) filter.scheduledDate.$gte = new Date(dateFrom);
      if (dateTo) filter.scheduledDate.$lte = new Date(dateTo);
    }

    const logs = await MaintenanceLog.find(filter)
      .sort({ scheduledDate: -1 })
.populate('userId', 'fullname')

    // Technician who created the log
       // Assigned worker

    const maintenanceLogs = logs.map((log, index) => ({
    
      id: index + 1,
      code: log.code || `#MH-${String(index + 1).padStart(3, '0')}`,
      manholeId: log.manholeId,
      type: log.type,
      status: log.status,
      date: log.scheduledDate?.toISOString().split('T')[0] || 'N/A',
      description: log.description || '',
      assignedTo: log.userId?.fullname || 'Unassigned',
      createdBy: log.userId?.fullname || 'Unknown',
      createdAt: log.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: log.updatedAt?.toISOString() || new Date().toISOString(),
   actualStart: log.actualStart ? new Date(log.actualStart).toISOString() : null,
actualEnd: log.actualEnd ? new Date(log.actualEnd).toISOString() : null,
      partsReplaced: log.partsReplaced || [],
      notes: log.notes || ''
    }));

    return res.status(200).json({
      success: true,
      maintenanceLogs,
      count: maintenanceLogs.length
    });
  } catch (error) {
    console.error('Get maintenance logs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


export { createMaintenanceLog, updateMaintenanceStatus, addMaintenanceParts, getMaintenanceLogs };
