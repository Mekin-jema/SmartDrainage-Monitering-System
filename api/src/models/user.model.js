import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Never return password in queries
    },
    phone: {
      type: String,
      match: [/^[0-9]{10}$/, "Please enter a valid phone number"],
    },
    
    address: {
      type: String,
      default: "Update your address"
  },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    salary: {
      type: Number,
      min: [0, "Salary cannot be negative"],
    },
    role: {
      type: String,
      enum: ["admin", "worker", "manager"],
      default: "worker",
    },
    status: {
      availability: {
        type: String,
        enum: ["available", "busy", "offline"],
        default: "available",
      },

    },
    assignments: [
      {
        manholeId: String,
        task: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    profilePicture: {
      type: String,
      default: "",
    },
    admin: { type: Boolean, default: false },
    // advanced authentication
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordTokenExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);


const User = mongoose.model("User", userSchema);
export default User;
