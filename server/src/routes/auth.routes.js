import express from "express";
import { register, login, getMe, logout,getProfile ,updateProfile,googleAuth , forgotPassword,resetPassword} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { loginLimiter,forgotPasswordLimiter,
  resetPasswordLimiter,
 } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", register);
router.post("/login",loginLimiter, login);
router.get("/me",protect,  getMe);
router.post("/logout", logout);
router.put("/update-profile", protect, updateProfile);
router.get("/profile",getProfile)
router.post("/google", googleAuth);
router.post("/forgot-password",forgotPasswordLimiter, forgotPassword);
router.post("/reset-password/:token",resetPasswordLimiter, resetPassword);

export default router;