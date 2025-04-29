import express from 'express';
import {
  createMaintenanceLog,
  updateMaintenanceStatus,
  addMaintenanceParts,
  getMaintenanceLogs
} from '../controllers/maintenance.controller.js';

const router = express.Router();

// ------------------------------------------------------------------
// @route   POST /api/maintenance
// @desc    Create a new maintenance log
// @body    { manholeId, userId, type, scheduledDate, [description], [partsReplaced] }
// ------------------------------------------------------------------
router.post('/', createMaintenanceLog);

// ------------------------------------------------------------------
// @route   GET /api/maintenance
// @desc    Get maintenance logs with filtering
// @query   [manholeId], [userId], [status], [type], [fromDate], [toDate]
// ------------------------------------------------------------------
router.get('/', getMaintenanceLogs);

// ------------------------------------------------------------------
// @route   PATCH /api/maintenance/:logId/status
// @desc    Update maintenance status
// @params  logId (required)
// @body    { status, [userId], [actualStart], [actualEnd], [notes] }
// ------------------------------------------------------------------
router.patch('/:logId/status', updateMaintenanceStatus);

// ------------------------------------------------------------------
// @route   POST /api/maintenance/:logId/parts
// @desc    Add parts to maintenance log
// @params  logId (required)
// @body    { parts: [{ name, quantity }] }
// ------------------------------------------------------------------
router.post('/:logId/parts', addMaintenanceParts);

export default router;