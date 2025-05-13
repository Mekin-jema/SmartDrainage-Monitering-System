import mongoose from 'mongoose';
import Alert from '../models/alert.model.js';
import User from '../models/user.model.js';
import assignWorkerToAlert from '../helpers/assignWork.js';
// Alert Levels and Types Configuration
const ALERT_LEVELS = ['low', 'medium', 'high', 'critical'];
const ALERT_TYPES = [
  'sewage_overflow',
  'gas_leak',
  'blockage',
  'sensor_failure',
  'maintenance_required',
];
const ALERT_STATUSES = ['open', 'assigned', 'in_progress', 'resolved', 'closed'];

// 1. Create New Alert
const createAlert = async (req, res) => {
  try {
    const { manholeId, sensorId, alertType, alertLevel, description } = req.body;

    // Validate input
    if (!manholeId || !alertType || !alertLevel) {
      return res.status(400).json({
        success: false,
        message: 'Manhole ID, alert type and level are required',
      });
    }

    if (!ALERT_TYPES.includes(alertType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid alert type. Valid types: ${ALERT_TYPES.join(', ')}`,
      });
    }

    if (!ALERT_LEVELS.includes(alertLevel)) {
      return res.status(400).json({
        success: false,
        message: `Invalid alert level. Valid levels: ${ALERT_LEVELS.join(', ')}`,
      });
    }

    // Create new alert
    const newAlert = new Alert({
      _id: new mongoose.Types.ObjectId(),
      manholeId,
      sensorId,
      alertType,
      alertLevel,
      description: description || `${alertType.replace('_', ' ')} detected`,
      timestamp: new Date(),
      status: 'open',
      actions: [],
    });

    await newAlert.save();

    // Automatically assign to available worker if critical
    if (alertLevel === 'critical') {
      await assignWorkerToAlert(newAlert._id);
    }

    return res.status(201).json({
      success: true,
      message: 'Alert created successfully',
      data: newAlert,
    });
  } catch (error) {
    console.error('Create alert error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
// 3. Update Alert Status
const updateAlertStatus = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { status, workerId, notes } = req.body;

    if (!ALERT_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid statuses: ${ALERT_STATUSES.join(', ')}`,
      });
    }

    const alert = await Alert.findById(alertId);
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    // Verify worker is assigned if trying to update
    if (status !== 'open' && !alert.assignedWorkerId) {
      return res.status(400).json({
        success: false,
        message: 'Alert must be assigned before status update',
      });
    }

    // Add action log
    alert.actions.push({
      workerId,
      action: 'status_update',
      notes: `Status changed to ${status}. ${notes || ''}`,
      timestamp: new Date(),
    });

    alert.status = status;

    // If resolved, update worker status
    if (status === 'resolved') {
      const worker = await User.findById(alert.assignedWorkerId);
      if (worker) {
        worker.status.availability = 'available';
        await worker.save();
      }
    }

    await alert.save();

    return res.status(200).json({
      success: true,
      message: 'Alert status updated',
      data: alert,
    });
  } catch (error) {
    console.error('Update alert error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// 4. Get Alerts with Filtering
const getAlerts = async (req, res) => {
  try {
    const { status, alertType, alertLevel, timeRange } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (alertType) filter.alertType = alertType;
    if (alertLevel) filter.alertLevel = alertLevel;

    if (timeRange) {
      const hoursAgo = new Date();
      hoursAgo.setHours(hoursAgo.getHours() - parseInt(timeRange));
      filter.timestamp = { $gte: hoursAgo };
    }

    const alerts = await Alert.find(filter)
      .sort({ timestamp: -1 })
      .populate('assignedWorkerId', 'name phone status')
      .populate('manholeId', 'code location');

    return res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// 5. Add Resolution Notes
const addResolutionNotes = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { notes, workerId } = req.body;

    if (!notes) {
      return res.status(400).json({
        success: false,
        message: 'Resolution notes are required',
      });
    }

    const alert = await Alert.findById(alertId);
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    alert.resolutionNotes = notes;
    alert.actions.push({
      workerId,
      action: 'resolution_notes',
      notes: `Resolution notes added`,
      timestamp: new Date(),
    });

    await alert.save();

    return res.status(200).json({
      success: true,
      message: 'Resolution notes added',
      data: alert,
    });
  } catch (error) {
    console.error('Add notes error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getRecentAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find()
      .sort({ createdAt: -1 }) // Most recent based on creation time
      .limit(5);

    const formattedAlerts = alerts.map((alert, index) => ({
      id: index + 1,
      type: alert.alertType?.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
      location: alert.manholeId ? `Manhole #${alert.manholeId}` : 'Unknown',
      manholeId: alert.manholeId || 'unknown',
      timestamp: alert.createdAt,
      status: alert.status,
      severity: alert.alertLevel,
    }));

    return res.status(200).json({
      success: true,
      recentAlerts: formattedAlerts,
    });
  } catch (error) {
    console.error('Error fetching recent alerts:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export {
  createAlert,
  assignWorkerToAlert,
  updateAlertStatus,
  getAlerts,
  addResolutionNotes,
  getRecentAlerts,
};

// Auto-assigns available workers to critical alerts
// await assignWorkerToAlert(alertId);
// Get all high/critical sewage alerts from last 24h
// GET /alerts?alertType=sewage_overflow&alertLevel=high,critical&timeRange=24
