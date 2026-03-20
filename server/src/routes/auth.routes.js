import express from "express";
import { register, login, getMe, logout,getProfile ,updateProfile,googleAuth} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me",protect,  getMe);
router.post("/logout", logout);
router.put("/update-profile", protect, updateProfile);
router.get("/profile",getProfile)
router.post("/google", googleAuth);

export default router;