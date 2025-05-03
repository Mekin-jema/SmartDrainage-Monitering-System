import express from 'express';
import {
  createManhole,
  getAllManholes,
  getManholesNearLocation,
  getManholesByZone,
  updateManholeStatus
} from '../controllers/manhole.controller.js';

const router = express.Router();

// POST /api/manholes - Create a new manhole
router.post('/', createManhole);

// GET /api/manholes - Get all manholes
router.get('/', getAllManholes);

// GET /api/manholes/nearby - Get manholes near location
router.get('/nearby', getManholesNearLocation);

// GET /api/manholes/zone/:zone - Get manholes by zone
router.get('/zone/:zone', getManholesByZone);

// PATCH /api/manholes/:id/status - Update manhole status
router.put('/:id/status', updateManholeStatus);

export default router;
