import mongoose from 'mongoose';

const sensorReadingSchema = new mongoose.Schema(
  {
    manholeId: {
      type: String,
      ref: 'Manhole',
      required: true,
    },

    sensors: {
      sewageLevel: Number,
      methaneLevel: Number,
      flowRate: Number,
      temperature: Number,
      humidity: Number,
      batteryLevel: Number,
    },
    timestamp:{
      type:Date,
      default:new Date(),
    },
    thresholds: {
      maxDistance: Number,
      maxGas: Number,
      minFlow: Number,
    },
    lastCalibration: Date,
    alertTypes: [String],
  },
 
);

export default mongoose.model('SensorReading', sensorReadingSchema);
