import express from 'express';
import {
  createAlert,
  updateAlertStatus,
  getAlerts,
  addResolutionNotes
} from '../controllers/alert.controller.js';

const router = express.Router();

// ------------------------------------------------------------------
// @route   POST /api/alerts
// @desc    Create a new alert
// @body    { 
//            manholeId: string (required),
//            alertType: string (required),
//            alertLevel: string (required),
//            [sensorId]: string,
//            [description]: string 
//          }
// ------------------------------------------------------------------
router.post('/', createAlert);

// ------------------------------------------------------------------
// @route   GET /api/alerts
// @desc    Get alerts with filtering
// @query   [status], [alertType], [alertLevel], [timeRange]
// ------------------------------------------------------------------
router.get('/', getAlerts);

// ------------------------------------------------------------------
// @route   PATCH /api/alerts/:alertId/status
// @desc    Update alert status
// @params  alertId (required)
// @body    { 
//            status: string (required),
//            [workerId]: string,
//            [notes]: string 
//          }
// ------------------------------------------------------------------
router.put('/:alertId/status', updateAlertStatus);

// ------------------------------------------------------------------
// @route   POST /api/alerts/:alertId/notes
// @desc    Add resolution notes to alert
// @params  alertId (required)
// @body    { 
//            notes: string (required),
//            [workerId]: string 
//          }
// ------------------------------------------------------------------
router.post('/:alertId/notes', addResolutionNotes);

export default router;