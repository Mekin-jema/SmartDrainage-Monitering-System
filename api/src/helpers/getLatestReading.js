import Sensor from '../models/sensor.model.js';

const getLatestReading = async () => {
  try {
    const latestReadings = await Sensor.find()
      .sort({ createdAt: -1 })
      .lean();


    const processedReadings = latestReadings.map(reading => {
      const { alertTypes,status } = reading;



     

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