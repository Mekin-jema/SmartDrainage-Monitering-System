import mongoose from 'mongoose';

const maintenanceLogSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  manholeId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  type: String,
  description: String,
  status: String,
  scheduledDate: Date,
  actualStart: Date,
  actualEnd: Date,
  partsReplaced: [{
    name: String,
    quantity: Number
  }],
  notes: String,
  createdAt: Date,
  updatedAt: Date
});

export default mongoose.model('MaintenanceLog', maintenanceLogSchema);