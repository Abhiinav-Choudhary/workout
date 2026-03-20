import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  day: String,
  exercises: [String]
});

const trainingPlanSchema = new mongoose.Schema({
  goal: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  days: {
    type: Number,
    required: true
  },
  plan: [exerciseSchema]
});

export default mongoose.model("TrainingPlan", trainingPlanSchema);