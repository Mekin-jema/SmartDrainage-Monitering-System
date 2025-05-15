import mongoose from 'mongoose';

const manholeSchema = new mongoose.Schema({
  id: {
    type: String, // "1", "2", etc.
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  elevation: Number,
  location: {
    type: {
      type: String, // NOT Number
      default: 'Point',
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  zone: String,
  status: String,
  lastInspection: String, // ISO date string like "2023-06-01"
  cover_status: String,
  overflow_level: String,
  connections: [String], // other manhole ids
});

// manholeSchema.index({ 'location.coordinates': '2dsphere' });

// manholeSchema.set('toJSON', {
//   transform: function (doc, ret) {
//     delete ret._id;
//     delete ret.__v;
//   },
// });

export default mongoose.model('Manhole', manholeSchema);
