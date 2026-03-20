import express from "express";
import { getTrainingPlan } from "../controllers/training.controller.js";

const router = express.Router();

router.get("/plan", getTrainingPlan);

export default router;