import Sensor from '../models/sensor.model.js'

const getLatestReading = async (limit = 20)=>{
    try{
        const latestReading = await Sensor.find().sort({ timestamp: -1 }).limit(limit);
        return latestReading;
    }catch(err){
        console.error('Error fetching latest readings:', err.message);
        throw new Error('Error fetching latest readings');
    }
}