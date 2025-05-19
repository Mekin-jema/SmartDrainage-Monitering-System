import express from "express";
import {
  checkAuth,
  forgotPassword,
  getAllUsers,
  getAssignedTasksForWorker,
  getUserOverview,
  login,
  logout,
  resetPassword,
  signup,
  //  updateProfile
  verifyEmail,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/check-auth").get(isAuthenticated, checkAuth);
router.route("/get-all-users").get(getAllUsers);
router.get("/my-assignments", isAuthenticated, getAssignedTasksForWorker);
router.get("/overview",getUserOverview );

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/verify-email").post(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
// router.route("/profile/update").put(isAuthenticated,updateProfile);

export default router;
