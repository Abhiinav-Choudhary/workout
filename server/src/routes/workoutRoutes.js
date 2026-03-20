import express from "express";
import { generateWorkout } from "../controllers/workoutController.js";

const router = express.Router();

router.get("/generate", generateWorkout);

export default router;