import express from 'express';
import {
  createManhole,
  getAllManholes,
  getManholesNearLocation,
  getManholesByZone,
  updateManholeStatus,
  deleteManholeById,
  getSystemStatus,
} from '../controllers/manhole.controller.js';

const router = express.Router();

// POST /api/manholes - Create a new manhole
router.post('/create', createManhole);

// GET /api/manholes - Get all manholes
router.get('/', getAllManholes);
// get system status
router.get('/system-status', getSystemStatus);
// router.delete('/', deleteAllManholes);
router.delete('/:id', deleteManholeById);
// GET /api/manholes/nearby - Get manholes near location
router.get('/nearby', getManholesNearLocation);

// GET /api/manholes/zone/:zone - Get manholes by zone
router.get('/zone/:zone', getManholesByZone);

// PATCH /api/manholes/:id/status - Update manhole status
router.put('/status/:id', updateManholeStatus);

export default router;

// all the routes are tested and working fine.
// the routes are tested using postman and all the routes are working fine.
