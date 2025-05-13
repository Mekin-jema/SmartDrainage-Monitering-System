import express from 'express';
import {
  createAlert,
  assignWorkerToAlert, // (optional, based on your usage)
  updateAlertStatus,
  getAlerts,
  addResolutionNotes,
  getRecentAlerts,
} from '../controllers/alert.controller.js';

const router = express.Router();

// @route   POST /api/alerts
// @desc    Create a new alert
router.post('/create-alert', createAlert);
// @route   GET /api/alerts
// @desc    Get alerts with optional filters
router.get('/', getAlerts);

// getRecentAlerts
router.get('/recent', getRecentAlerts);

// @route   PATCH /api/alets/:alertId/status
// @desc    Update alert status
router.put('/status/:alertId', updateAlertStatus);

// @route   PATCH /api/alerts/:alertId/notes
// @desc    Add resolution notes to an alert
router.put('/notes/:alertId', addResolutionNotes);

// Note: assignWorkerToAlert(alertId) is called internally during createAlert() for critical alerts,
// so you don't need to expose it separately unless you want a manual assignment route.

export default router;
