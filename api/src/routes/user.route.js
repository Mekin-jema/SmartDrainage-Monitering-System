import express from "express";
import {
  checkAuth,
  deleteUser,
  forgotPassword,
  getAllUsers,
  getAssignedTasksForWorker,
  getUserOverview,
  login,
  logout,
  resetPassword,
  signup,
  updateUser,
  //  updateProfile
  verifyEmail,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/check-auth").get(isAuthenticated, checkAuth);
router.route("/get-all-users").get(getAllUsers);
router.get("/my-assignments", isAuthenticated, getAssignedTasksForWorker);
router.get("/overview", getUserOverview);
router.delete("/delete-user/:id", deleteUser);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/verify-email").post(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/update-user/:id").put(updateUser);
// router.route("/profile/update").put(isAuthenticated,updateProfile);

export default router;
