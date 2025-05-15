import mongoose from 'mongoose';

const maintenanceLogSchema = new mongoose.Schema({
  manholeId: {
    type: String,
    ref: 'Manhole',
    required: true,
  },
  userId: mongoose.Schema.Types.ObjectId,
  type: String,
  description: String,
  status: String,
  scheduledDate: Date,
  actualStart: Date,
  actualEnd: Date,
  partsReplaced: [
    {
      name: String,
      quantity: Number,
    },
  ],
  notes: String,
  createdAt: Date,
  updatedAt: Date,
});

export default mongoose.model('MaintenanceLog', maintenanceLogSchema);
