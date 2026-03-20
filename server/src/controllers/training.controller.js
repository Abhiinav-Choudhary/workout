import TrainingPlan from "../models/training.model.js";

export const getTrainingPlan = async (req, res) => {
  try {

    const { goal, level, days } = req.query;

    const plan = await TrainingPlan.findOne({
      goal,
      level,
      days: Number(days)
    });

    if (!plan) {
      return res.status(404).json({
        message: "Plan not found"
      });
    }

    res.json(plan);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};