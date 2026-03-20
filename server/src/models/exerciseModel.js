import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: String,
  category: String, // push, pull, legs, core, skill
  level: String, // Beginner, Intermediate, Advanced
  goals: [String], // Strength, Muscle Building, Fat Loss
  sets: Number,
  reps: String
});

export default mongoose.model("Exercise", exerciseSchema);