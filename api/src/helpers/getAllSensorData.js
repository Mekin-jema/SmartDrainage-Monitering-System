import SensorReading from '../models/sensor.model.js';

const getAllSensorReadings = async () => {
  try {
    const readings = await SensorReading.find().sort({ timestamp: -1 }).lean();

    const formattedManholes = readings.map((reading) => {
      const {
        manholeId,
        name,
        location,
        timestamp,
        sensors,
        thresholds,
        lastCalibration,
        createdAt
      } = reading;

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
        manholeId,
        name,
        location,
        timestamp: new Date(timestamp).toISOString(),
        createdAt: new Date(createdAt).toISOString(),
        sensors,
        thresholds,
        lastCalibration,
        batteryLevel: sensors.batteryLevel,
        status,
        alertTypes,
      };
    });

    // Sort by timestamp (in case formatting affected the order)
    formattedManholes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

console.log("Formatted Manholes:", formattedManholes);
    return {
      success: true,
      data: formattedManholes,
      count: formattedManholes.length
    };

  } catch (error) {
    console.error('Get all sensor readings error:', error);
    return {
      success: false,
      message: 'Failed to retrieve sensor readings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
  }
};



// // Example usage:
// const fetchAndProcessReadings = async () => {
//   const result = await getAllSensorReadings();
  
//   if (result.success) {
//     console.log(`Retrieved ${result.count} sensor readings:`);
//     result.data.forEach(reading => {
//       console.log(`Manhole ${reading.manholeId}:`);
//       console.log(`- Status: ${reading.status}`);
//       console.log(`- Alerts: ${reading.alertTypes.join(', ') || 'None'}`);
//       console.log(`- Sewage Level: ${reading.sensors.sewageLevel}cm`);
//     });
//   } else {
//     console.error('Error:', result.message);
//     return  null
    
//   }
// };

// // Call the function
// fetchAndProcessReadings();


export default getAllSensorReadings;