import mongoose from 'mongoose';

const manholeSchema = new mongoose.Schema({
  id: String,
  code: String,
  elevation: Number,
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length === 2,
        message: 'Coordinates must be an array of [longitude, latitude]',
      },
    },
  },
  zone: String,  // Moved zone to top level to match mock data
  status: String,
  lastInspection: String,  // Changed to String to match mock data
  cover_status: String,
  overflow_level: String,
  connections: [String]
});

manholeSchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.model('Manhole', manholeSchema);