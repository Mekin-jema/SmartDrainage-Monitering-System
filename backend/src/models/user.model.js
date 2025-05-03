import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Never return password in queries
  },
  phone: {
    type: String,
    match: [/^[0-9]{10}$/, 'Please enter a valid phone number']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  salary: {
    type: Number,
    min: [0, 'Salary cannot be negative']
  },
  role: {
    type: String,
    enum: ['admin', 'worker', 'manager'],
    default: 'worker'
  },
  status: {
    availability: {
      type: String,
      enum: ['available', 'busy', 'offline'],
      default: 'available'
    },
    lastActive: {
      type: Date,
      default: Date.now
    }
  },
  assignments: [{
    manholeId: String,
    task: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });



// Update last active timestamp
userSchema.methods.updateLastActive = function() {
  this.status.lastActive = Date.now();
  return this.save();
};

const User = mongoose.model('User', userSchema);
export default User;