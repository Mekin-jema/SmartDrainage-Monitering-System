import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  manholeId: mongoose.Schema.Types.ObjectId,
  sensorId: mongoose.Schema.Types.ObjectId,
  alertType: String,
  alertLevel: String,
  description: String,
  timestamp: Date,
  status: String,
  assignedWorkerId: String,
  actions: [{
    workerId: String,
    action: String,
    notes: String,
    timestamp: Date
  }],
  resolutionNotes: String
});

export default mongoose.model('Alert', alertSchema);