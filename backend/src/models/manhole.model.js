import mongoose from 'mongoose';
const manholeSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  code: String,
  location: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length === 2,
        message: "Coordinates must be an array of [longitude, latitude]"
      }
    },
    address: String,
    zone: String
  },
  installedDate: Date,
  lastInspection: Date,
  status: String,
  notes: String
});

manholeSchema.index({ "location.coordinates": "2dsphere" });

export default mongoose.model('Manhole', manholeSchema);
