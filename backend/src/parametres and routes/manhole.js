import express from 'express';
import {
  createManhole,
  getAllManholes,
  getManholesNearLocation,
  getManholesByZone,
  updateManholeStatus
} from '../controllers/manhole.controller.js';

const router = express.Router();

// ------------------------------------------------------------------
// @route   POST /api/manholes
// @desc    Create a new manhole
// @body    { code, location: { coordinates, address, zone }, ... }
// ------------------------------------------------------------------
router.post('/', createManhole);

// ------------------------------------------------------------------
// @route   GET /api/manholes
// @desc    Get all manholes
// @query   [sortBy=installedDate], [order=desc]
// ------------------------------------------------------------------
router.get('/', getAllManholes);

// ------------------------------------------------------------------
// @route   GET /api/manholes/nearby
// @desc    Get manholes near location
// @query   longitude (required), latitude (required), [maxDistance=1000]
// ------------------------------------------------------------------
router.get('/nearby', getManholesNearLocation);

// ------------------------------------------------------------------
// @route   GET /api/manholes/zone/:zone
// @desc    Get manholes by zone
// @params  zone (required)
// ------------------------------------------------------------------
router.get('/zone/:zone', getManholesByZone);

// ------------------------------------------------------------------
// @route   PATCH /api/manholes/:id/status
// @desc    Update manhole status
// @params  id (required)
// @body    { status, notes? }
// ------------------------------------------------------------------
router.patch('/:id/status', updateManholeStatus);

export default router;