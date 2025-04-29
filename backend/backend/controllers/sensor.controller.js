import mongoose from 'mongoose';
import SensorReading from '../models/sensor.model.js';
import Manhole from '../models/manhole.model.js';
import { checkThresholds, determineStatus } from '../helpers/checkThreshold.js';

// 1. Create New Sensor Reading
const createReading = async (req, res) => {
  try {
    const { manholeId, sensors, thresholds, lastCalibration } = req.body;

    // Validate required fields
    if (!manholeId || !sensors) {
      return res.status(400).json({
        success: false,
        message: 'Manhole ID and sensor data are required'
      });
    }

    // Verify manhole exists
    const manhole = await Manhole.findById(manholeId);
    if (!manhole) {
      return res.status(404).json({
        success: false,
        message: 'Manhole not found'
      });
    }

    // Check for alerts and determine status
    const alertTypes = checkThresholds(sensors, thresholds || {
      maxDistance: 2.5,
      maxGas: 1000,
      minFlow: 0.1
    });
    
    const status = determineStatus(alertTypes);

    // Create reading
    const newReading = new SensorReading({
      manholeId,
      sensors,
      thresholds: thresholds || {
        maxDistance: 2.5,  // Default thresholds (meters)
        maxGas: 1000,      // ppm
        minFlow: 0.1       // m/s
      },
      lastCalibration: lastCalibration || Date.now(),
      status,
      alertTypes,
      timestamp: new Date()
    });

    await newReading.save();

    // Update manhole status if critical
    if (status === 'critical') {
      await Manhole.findByIdAndUpdate(manholeId, {
        lastInspection: Date.now(),
        status: 'needs_attention'
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Reading recorded',
      data: {
        ...newReading.toObject(),
        manholeCode: manhole.code // Include manhole info in response
      }
    });

  } catch (error) {
    console.error('Create reading error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 2. Get Readings by Manhole (Optimized)
const getReadingsByManhole = async (req, res) => {
  try {
    const { manholeId } = req.params;
    const { limit = 100, timeRange = '24', status } = req.query;

    // Build query
    const query = { manholeId };
    if (status) query.status = status;
    
    // Time range filtering
    if (timeRange && !isNaN(timeRange)) {
      const hoursAgo = new Date();
      hoursAgo.setHours(hoursAgo.getHours() - parseInt(timeRange));
      query.timestamp = { $gte: hoursAgo };
    }

    const readings = await SensorReading.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .lean(); // Faster for read-only

    return res.status(200).json({
      success: true,
      count: readings.length,
      data: readings
    });

  } catch (error) {
    console.error('Get readings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve readings'
    });
  }
};

// 3. Get Critical Alerts (Enhanced)
const getCriticalReadings = async (req, res) => {
  try {
    const { hours = 24, limit = 50 } = req.query;
    const timeThreshold = new Date(Date.now() - hours * 60 * 60 * 1000);

    const readings = await SensorReading.find({
      status: 'critical',
      timestamp: { $gte: timeThreshold }
    })
    .sort({ timestamp: -1 })
    .limit(parseInt(limit))
    .populate({
      path: 'manholeId',
      select: 'code location zone',
      model: Manhole
    })
    .lean();

    return res.status(200).json({
      success: true,
      count: readings.length,
      data: readings.map(r => ({
        ...r,
        manhole: r.manholeId // Flatten populated field
      }))
    });

  } catch (error) {
    console.error('Get alerts error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve critical alerts'
    });
  }
};

// 4. Sensor Data Analytics (Improved)
const getSensorAnalytics = async (req, res) => {
  try {
    const { manholeId, metric, period = '24h', groupBy } = req.query;
    
    if (!metric || !['sewageLevel', 'methaneLevel', 'flowRate', 'temperature'].includes(metric)) {
      return res.status(400).json({
        success: false,
        message: 'Valid metric parameter is required'
      });
    }

    // Calculate time range
    const range = period.endsWith('h') 
      ? parseInt(period) * 60 * 60 * 1000 
      : parseInt(period) * 24 * 60 * 60 * 1000;
    
    const timeThreshold = new Date(Date.now() - range);

    // Build query
    const match = { 
      timestamp: { $gte: timeThreshold },
      [`sensors.${metric}`]: { $exists: true }
    };
    if (manholeId) match.manholeId = new mongoose.Types.ObjectId(manholeId);

    // Determine grouping interval
    const interval = groupBy || (range <= 86400000 ? 'hour' : 'day');
    
    const results = await SensorReading.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            ...(interval === 'hour' && { hour: { $hour: '$timestamp' } }),
            ...(interval === 'day' && { 
              day: { $dayOfMonth: '$timestamp' },
              month: { $month: '$timestamp' },
              year: { $year: '$timestamp' }
            }),
            ...(manholeId && { manholeId: '$manholeId' })
          },
          avgValue: { $avg: `$sensors.${metric}` },
          maxValue: { $max: `$sensors.${metric}` },
          minValue: { $min: `$sensors.${metric}` },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    return res.status(200).json({
      success: true,
      data: results.map(item => ({
        ...item._id,
        stats: {
          avg: parseFloat(item.avgValue.toFixed(2)),
          max: parseFloat(item.maxValue.toFixed(2)),
          min: parseFloat(item.minValue.toFixed(2)),
          count: item.count
        }
      }))
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate analytics'
    });
  }
};

export {
  createReading,
  getReadingsByManhole,
  getCriticalReadings,
  getSensorAnalytics
};