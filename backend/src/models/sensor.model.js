import mongoose from 'mongoose';

const sensorReadingSchema = new mongoose.Schema(
  {
    manholeId: {
      type: String,
      ref: 'Manhole',
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    sensors: {
      sewageLevel: Number,
      methaneLevel: Number,
      flowRate: Number,
      temperature: Number,
      humidity: Number,
      batteryLevel: Number,
    },
    thresholds: {
      maxDistance: Number,
      maxGas: Number,
      minFlow: Number,
    },
    lastCalibration: Date,
    alertTypes: [String],
  },
  { timestamps: true }
);

export default mongoose.model('SensorReading', sensorReadingSchema);
