import mongoose from 'mongoose';

const manholeSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  code: String,
  location: {
    coordinates: [Number],
    address: String,
    zone: String
  },
  installedDate: Date,
  lastInspection: Date,
  status: String,
  notes: String
});

export default mongoose.model('Manhole', manholeSchema);
