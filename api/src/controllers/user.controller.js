import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
// import cloudinary from "../utils/cloudinary.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateToken } from "../utils/generateToken.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/email.js";

export const signup = async (req, res) => {
  try {
    // await User.collection.dropIndex("username_1");

    const { fullname, email, password } = req.body;
    console.log(fullname, email, password);

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exist with this email",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationCode();

    user = await User.create({
      fullname,
      email,
      password: hashedPassword,
      // phone: Number(phone),
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    generateToken(res, user);

    // await sendVerificationEmail(email, verificationToken);

    const userWithoutPassword = await User.findOne({ email }).select(
      "-password"
    );
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const user = await User.findOne({ email }).select("+password");
    console.log(user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    generateToken(res, user);
    user.lastLogin = new Date();
    await user.save();

    // send user without passowrd
    const userWithoutPassword = await User.findOne({ email }).select(
      "-password"
    );
    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.fullname}`,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const verifyEmail = async (req, res) => {
  try {
    const { verificationCode } = req.body;

    const user = await User.findOne({
      verificationToken: verificationCode,
      verificationTokenExpiresAt: { $gt: Date.now() },
    }).select("-password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    // send welcome email
    await sendWelcomeEmail(user.email, user.fullname);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const logout = async (req, res) => {
  try {
    return res.clearCookie("token").status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist",
      });
    }

    const resetToken = crypto.randomBytes(40).toString("hex");
    const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
    await user.save();

    // send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.FRONTEND_URL}/otp/${resetToken}`
    );

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }
    //update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;
    await user.save();

    // send success reset email
    await sendResetSuccessEmail(user.email);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const checkAuth = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// export const updateProfile = async (req, res) => {
//   try {
//     const userId = req.id;
//     const { fullname, email, address, city, country, profilePicture } = req.body;
//     // upload image on cloudinary
//     let cloudResponse;
//     cloudResponse = await cloudinary.uploader.upload(profilePicture);
//     const updatedData = {fullname, email, address, city, country, profilePicture};

//     const user = await User.findByIdAndUpdate(userId, updatedData,{new:true}).select("-password");

//     return res.status(200).json({
//       success:true,
//       user,
//       message:"Profile updated successfully"
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// }

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// controllers/userController.js

export const getAssignedTasksForWorker = async (req, res) => {
  try {
    const userId = req.id; // Authenticated worker ID

    const worker = await User.findById(userId).select("fullname assignments");

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    if (!worker.assignments || worker.assignments.length === 0) {
      return res.status(200).json({
        message: "No assignments found",
        tasks: [],
      });
    }

    res.status(200).json({
      worker: worker.fullname,
      totalTasks: worker.assignments.length,
      tasks: worker.assignments,
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const activeWorkers = await User.countDocuments({
      role: "worker",
      "status.availability": "available",
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalUsersLabel: "All system users",
        activeWorkers,
        activeWorkersLabel: "Active Workers",
      },
    });
  } catch (error) {
    console.error("Error fetching user overview:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user overview",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id; // assuming you pass the user id in the route param
    const { fullname, email, address, city, country, phone, role, status } =
      req.body;

    const updatedFields = {
      ...(fullname && { fullname }),
      ...(email && { email }),
      ...(address && { address }),
      ...(city && { city }),
      ...(country && { country }),
      ...(phone && { phone }),
      ...(role && { role }),
      ...(status && { status }),
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createUser = async (req, res) => {
  try {
    const {
      fullname,
      email,
      password,
      phone,
      address,
      salary,
      role,
      status,
      // profilePicture,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      fullname,
      email,
      // password: hashedPassword,
      phone,
      address,
      salary,
      role,
      status,
      profilePicture,
      isVerified: true, // Optional: or false if you're doing email verification
    });

    // Optional: Send verification email if needed
    // await sendEmailVerification(newUser.email, newUser.verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        address: newUser.address,
        salary: newUser.salary,
        profilePicture: newUser.profilePicture,
        status: newUser.status,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
