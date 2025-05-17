import Sensor from '../models/sensor.model.js';

const getLatestReading = async (limit = 10) => {
  try {
    const latestReadings = await Sensor.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    const processedReadings = latestReadings.map(reading => {
      const { manholeId, sensors, thresholds, timestamp } = reading;

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

      // Determine status
      const status = alertTypes.length > 0 ? 'critical' : 'normal';

      return {
        ...reading,
        status,
        alertTypes: alertTypes.length ? alertTypes : ['normal']
      };
    });

    return {
      success: true,
      data: processedReadings,
      count: processedReadings.length,
      message: `Retrieved ${processedReadings.length} latest readings`
    };

  } catch (error) {
    console.error('Error fetching latest readings:', error.message);
    return {
      success: false,
      data: [],
      count: 0,
      message: 'Failed to fetch latest readings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
  }
};

export default getLatestReading;