import SensorData from '../models/sensor.model.js';
async function deleteOldData(days = 30) {
    try{
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        await SensorData.deleteMany({ timestamp: { $lt: cutoffDate } });
        console.log(`Deleted data older than ${days} days`);
        return true;
    }catch(err){
        console.log('Error deleting old data:', err.message);
        return null;
    }
  }