import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    manholeId: {
      type: String,
      ref: "Manhole",
      required: true,
    },
    location: {  // Simply added this field
      type: {
        type: String,
        default: "Point"
      },
      coordinates: [Number]  // [longitude, latitude]
    },
    alertType: String,
    alertLevel: String,
    description: String,
    status: String,
    assignedWorkerId: String,
    actions: [
      {
        workerId: String,
        action: String,
        notes: String,
        timestamp: Date,
      },
    ],
    resolutionNotes: String,
  },
  { timestamps: true }
);

export default mongoose.model("Alert", alertSchema);
