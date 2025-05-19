import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  location: {
    type: String,
    required: true,
  },
  assignedDate: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  assignedTo: {
    type: String, // could be ObjectId ref 'User' if you have User model
    required: true,
    ref: 'User',
  },
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
