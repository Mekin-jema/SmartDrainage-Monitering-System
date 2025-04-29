import express from 'express';
import {
  createMaintenanceLog,
  updateMaintenanceStatus,
  addMaintenanceParts,
  getMaintenanceLogs
} from '../controllers/maintenance.controller.js';

const router = express.Router();

// POST /api/maintenance-logs - Create a new maintenance log
router.post('/', createMaintenanceLog);
// GET /api/maintenance-logs - Get maintenance logs with optional filters
router.get('/', getMaintenanceLogs);

// PATCH /api/maintenance-logs/:logId/status - Update maintenance status
router.patch('/:logId/status', updateMaintenanceStatus);

// PATCH /api/maintenance-logs/:logId/parts - Add parts to a maintenance log
router.patch('/:logId/parts', addMaintenanceParts);

export default router;
