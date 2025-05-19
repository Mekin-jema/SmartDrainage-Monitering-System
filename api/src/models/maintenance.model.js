
import mongoose from 'mongoose';

const maintenanceLogSchema = new mongoose.Schema({
  manholeId: {
    type: String,
    required: true,
  },
  code:{
    type: String,
   
  },
  userId: {
     type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  type: String,
  assignedTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
},
  description: String,
  status: String,
  scheduledDate: Date,
  actualStart: {
  type: Date,
},
actualEnd: {
  type: Date,
},
  partsReplaced: [
    {
      name: String,
      quantity: Number,
    },
  ],
  notes: String,

},{timestamps: true}); 

export default mongoose.model('MaintenanceLog', maintenanceLogSchema);
