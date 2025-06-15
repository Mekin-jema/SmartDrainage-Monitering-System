import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    manholeId: {
      type: String,
      ref: "Manhole",
      required: true,
    },
    sensorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sensor",
      required: true,
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
