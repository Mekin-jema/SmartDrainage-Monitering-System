import mongoose from 'mongoose';
import SensorReading from '../models/sensor.model.js';
import Manhole from '../models/manhole.model.js';
import { checkThresholds, determineStatus } from '../helpers/checkThreshold.js';

// 1. Create New Sensor Reading
const createReading = async (req, res) => {
  try {
    const {
      manholeId,
      sensors,
      thresholds,
      lastCalibration,
      timestamp,
      alertTypes: incomingAlerts,
    } = req.body;

    // Validate required fields
    if (!manholeId || !sensors) {
      return res.status(400).json({
        success: false,
        message: 'Manhole ID and sensor data are required',
      });
    }

    // Match manhole based on provided `id`
    const manhole = await Manhole.findOne({ id: manholeId });
    if (!manhole) {
      return res.status(404).json({
        success: false,
        message: 'Manhole not found',
      });
    }

    const defaultThresholds = {
      maxDistance: 90, // cm
      maxGas: 1000, // ppm
      minFlow: 5, // m/s
    };

    const activeThresholds = thresholds || defaultThresholds;

    const alertTypes = incomingAlerts || checkThresholds(sensors, activeThresholds);
    const status = determineStatus(alertTypes);

    const newReading = new SensorReading({
      manholeId,
      sensors,
      thresholds: activeThresholds,
      lastCalibration: lastCalibration || Date.now(),
      status,
      alertTypes,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    });

    await newReading.save();

    if (status === 'critical') {
      await Manhole.findOneAndUpdate(
        { id: manholeId },
        {
          lastInspection: Date.now(),
          status: 'needs_attention',
        }
      );
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('sensor-data', {
        manholeId,
        sensors,
        status,
        alertTypes,
        timestamp: newReading.timestamp,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Reading recorded successfully',
      data: {
        ...newReading.toObject(),
        manholeCode: manhole.code, // From sample data: "MH-001"
      },
    });
  } catch (error) {
    console.error('Create reading error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
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

    // Time
    // range filtering
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
      data: readings,
    });
  } catch (error) {
    console.error('Get readings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve readings',
    });
  }
};

// 3. Get Critical Alerts (Enhanced)
const getCriticalReadings = async (req, res) => {
  try {
    const { hours = 24, limit = 50 } = req.query;

    // Validate query parameters
    const hoursNum = parseInt(hours);
    const limitNum = parseInt(limit);

    if (isNaN(hoursNum) || hoursNum <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Hours must be a positive number',
      });
    }

    if (isNaN(limitNum) || limitNum <= 0 || limitNum > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be a positive number and not exceed 1000',
      });
    }

    const timeThreshold = new Date(Date.now() - hoursNum * 60 * 60 * 1000);

    // Check if critical readings exist within the time frame
    const criticalExist = await SensorReading.exists({
      status: 'critical',
      timestamp: { $gte: timeThreshold },
    });

    if (!criticalExist) {
      return res.status(404).json({
        success: false,
        message: 'No critical alerts found in the specified time frame',
      });
    }

    const readings = await SensorReading.find({
      status: 'critical',
      timestamp: { $gte: timeThreshold },
    })
      .sort({ timestamp: -1 })
      .limit(limitNum)
      .populate({
        path: 'manholeId',
        select: 'code location zone',
        model: Manhole,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: readings.length,
      data: readings.map((r) => ({
        ...r,
        manhole: r.manholeId, // Flatten populated field
        manholeId: undefined, // Remove the original field
      })),
    });
  } catch (error) {
    console.error('Get critical readings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve critical alerts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// 4. Sensor Data Analytics (Improved)
const getSensorAnalytics = async (req, res) => {
  try {
    const { manholeId, metric, period = '24h', groupBy } = req.query;

    // Validate required parameters
    if (!metric || !['sewageLevel', 'methaneLevel', 'flowRate', 'temperature'].includes(metric)) {
      return res.status(400).json({
        success: false,
        message:
          'Valid metric parameter is required. Supported metrics: sewageLevel, methaneLevel, flowRate, temperature',
      });
    }

    // Validate and parse period
    const periodRegex = /^(\d+)(h|d)$/;
    if (!periodRegex.test(period)) {
      return res.status(400).json({
        success: false,
        message: 'Period must be in format like "24h" or "7d"',
      });
    }

    const [, periodValue, periodUnit] = period.match(periodRegex);
    const numericPeriod = parseInt(periodValue);

    if (isNaN(numericPeriod) || numericPeriod <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Period value must be a positive number',
      });
    }

    // Calculate time range with max limit (30 days)
    const maxPeriod = periodUnit === 'h' ? 720 : 30; // Max 720 hours (30 days) or 30 days
    if (numericPeriod > maxPeriod) {
      return res.status(400).json({
        success: false,
        message: `Period cannot exceed ${maxPeriod}${periodUnit}`,
      });
    }

    const range =
      periodUnit === 'h' ? numericPeriod * 60 * 60 * 1000 : numericPeriod * 24 * 60 * 60 * 1000;

    const timeThreshold = new Date(Date.now() - range);

    // Validate manholeId if provided
    let manholeObjectId;
    if (manholeId) {
      if (!mongoose.Types.ObjectId.isValid(manholeId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid manholeId format',
        });
      }
      manholeObjectId = new mongoose.Types.ObjectId(manholeId);
    }

    // Build query
    const match = {
      timestamp: { $gte: timeThreshold },
      [`sensors.${metric}`]: { $exists: true, $ne: null },
    };
    if (manholeId) match.manholeId = manholeObjectId;

    // Determine optimal grouping interval based on period
    let interval = groupBy;
    if (!groupBy) {
      interval = range <= 24 * 60 * 60 * 1000 ? 'hour' : 'day';
    } else if (!['hour', 'day'].includes(groupBy)) {
      return res.status(400).json({
        success: false,
        message: 'groupBy must be either "hour" or "day"',
      });
    }

    // Generate aggregation pipeline
    const aggregationPipeline = [
      { $match: match },
      {
        $group: {
          _id: {
            ...(interval === 'hour' && {
              hour: { $hour: '$timestamp' },
              day: { $dayOfMonth: '$timestamp' },
              month: { $month: '$timestamp' },
              year: { $year: '$timestamp' },
            }),
            ...(interval === 'day' && {
              day: { $dayOfMonth: '$timestamp' },
              month: { $month: '$timestamp' },
              year: { $year: '$timestamp' },
            }),
            ...(manholeId && { manholeId: '$manholeId' }),
          },
          avgValue: { $avg: `$sensors.${metric}` },
          maxValue: { $max: `$sensors.${metric}` },
          minValue: { $min: `$sensors.${metric}` },
          count: { $sum: 1 },
          firstTimestamp: { $min: '$timestamp' }, // For proper sorting
        },
      },
      { $sort: { firstTimestamp: 1 } },
      {
        $project: {
          _id: 0,
          timeGroup: '$_id',
          stats: {
            avg: { $round: ['$avgValue', 2] },
            max: { $round: ['$maxValue', 2] },
            min: { $round: ['$minValue', 2] },
            count: 1,
          },
        },
      },
    ];

    const results = await SensorReading.aggregate(aggregationPipeline);
    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No data found for the specified parameters',
      });
    }

    return res.status(200).json({
      success: true,
      period: {
        value: numericPeriod,
        unit: periodUnit,
        start: timeThreshold,
        end: new Date(),
      },
      metric,
      groupBy: interval,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error('Sensor analytics error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const getAllSensorReadings = async (req, res) => {
  try {
    const readings = await SensorReading.find().sort({ timestamp: -1 }).lean();

    const formattedManholes = readings.map((reading) => {
      const { manholeId, name, location, timestamp, sensors, thresholds, lastCalibration } =
        reading;

      // Determine alert types
      const alertTypes = [];

      if (sensors.sewageLevel > thresholds.maxDistance) {
        alertTypes.push('sewage_high');
      }

      if (sensors.methaneLevel > thresholds.maxGas) {
        alertTypes.push('gas_leak');
      }

      if (sensors.flowRate < thresholds.minFlow) {
        alertTypes.push('blockage');
      }

      if (sensors.batteryLevel < 70) {
        alertTypes.push('low_battery');
      }

      // Determine status based on alerts
      const status = alertTypes.length > 0 ? 'critical' : 'normal';

      return {
        manholeId,
        name,
        location,
        timestamp,
        sensors,
        thresholds,
        lastCalibration,
        batteryLevel: sensors.batteryLevel,
        status,
        alertTypes,
      };
    });

    return res.status(200).json({
      success: true,
      manholes: formattedManholes,
    });
  } catch (error) {
    console.error('Get all sensor readings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve all sensor readings',
    });
  }
};

const getSensorsTrend = async (req, res) => {
  try {
    // Use static mock manholeIds for now since the mock data uses '1', '2', etc.
    const manholeIds = ['1', '2', '3', '4', '5', '6'];

    const trends = await SensorReading.aggregate([
      {
        $match: {
          manholeId: { $in: manholeIds },
        },
      },
      {
        $group: {
          _id: {
            manholeId: '$manholeId',
            hour: { $hour: '$timestamp' },
          },
          avgWaterLevel: { $avg: '$sensors.sewageLevel' },
          avgGasLevel: { $avg: '$sensors.methaneLevel' },
          avgFlowRate: { $avg: '$sensors.flowRate' },
          avgTemperature: { $avg: '$sensors.temperature' },
        },
      },
      {
        $project: {
          _id: 0,
          manholeId: '$_id.manholeId',
          hour: {
            $concat: [
              { $cond: [{ $lt: ['$_id.hour', 10] }, '0', ''] },
              { $toString: '$_id.hour' },
              ':00',
            ],
          },
          waterLevel: { $round: ['$avgWaterLevel', 2] },
          gasLevel: { $round: ['$avgGasLevel', 2] },
          flowRate: { $round: ['$avgFlowRate', 2] },
          temperature: { $round: ['$avgTemperature', 2] },
        },
      },
      {
        $sort: {
          manholeId: 1,
          hour: 1,
        },
      },
    ]);

    res.json({ success: true, sensorTrends: trends });
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({ message: 'Error fetching trends data' });
  }
};

export {
  createReading,
  getReadingsByManhole,
  getCriticalReadings,
  getSensorAnalytics,
  getAllSensorReadings,
  getSensorsTrend,
};
