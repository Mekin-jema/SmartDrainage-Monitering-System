import express from 'express';
import {
  createMaintenanceLog,
  updateMaintenanceStatus,
  addMaintenanceParts,
  getMaintenanceLogs,
} from '../controllers/maintenance.controller.js';

const router = express.Router();

// POST /api/maintenance-logs - Create a new maintenance log
router.post('/create', createMaintenanceLog);
// GET /api/maintenance-logs - Get maintenance logs with optional filters
router.get('/get', getMaintenanceLogs);

// PATCH /api/maintenance-logs/:logId/status - Update maintenance status
router.put('/status/:logId', updateMaintenanceStatus);

// PATCH /api/maintenance-logs/:logId/parts - Add parts to a maintenance log
router.patch('/parts/:logId', addMaintenanceParts);

export default router;

// all routes are tested and working fine (except the last one)
