import express from 'express';
import {
  createReading,
  getReadingsByManhole,
  getCriticalReadings,
  getSensorAnalytics,
  getAllSensorReadings,
  getSensorsTrend,
} from '../controllers/sensor.controller.js';

const router = express.Router();

// POST /api/sensors - Create new sensor reading (body: { manholeId: string (required), sensors: object (required), thresholds?: object, lastCalibration?: Date })
router.post('/', createReading);
// get all sensors trendings
router.get('/trends', getSensorsTrend);
// get all sensor readings
router.get('/get-all-sernsor-readings', getAllSensorReadings);
// GET /api/sensors/manhole/:manholeId - Get readings by manhole ID (query: { limit?: number (default: 100), timeRange?: number (hours, default: 24), status?: string })
router.get('/manhole/:manholeId', getReadingsByManhole);

// GET /api/sensors/critical - Get critical alerts (query: { hours?: number (default: 24), limit?: number (default: 50) })
router.get('/critical', getCriticalReadings);

// GET /api/sensors/analytics - Get sensor analytics (query: { metric: string (required), manholeId?: string, period?: string (default: '24h'), groupBy?: string })
router.get('/analytics', getSensorAnalytics);

export default router;

// all the routes are tested and working fine.
