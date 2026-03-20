import Exercise from "../models/exerciseModel.js";

const workoutSplits = {
  3: [
    ["push", "core"],
    ["pull"],
    ["legs"]
  ],
  4: [
    ["push"],
    ["pull"],
    ["legs"],
    ["core", "skill"]
  ],
  5: [
    ["push"],
    ["pull"],
    ["legs"],
    ["core"],
    ["skill"]
  ],
  6: [
    ["push"],
    ["pull"],
    ["legs"],
    ["push"],
    ["pull"],
    ["legs"]
  ]
};

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

export const generateWorkout = async (req, res) => {
  try {

    const { goal, level, days } = req.query;

    const split = workoutSplits[days] || workoutSplits[3];

    let plan = [];

    for (let i = 0; i < split.length; i++) {

      const categories = split[i];
      let dayExercises = [];

      for (const category of categories) {

        // strict filter
        let exercises = await Exercise.find({
          category,
          level,
          goals: goal
        });

        // fallback 1
        if (exercises.length === 0) {
          exercises = await Exercise.find({
            category,
            level
          });
        }

        // fallback 2
        if (exercises.length === 0) {
          exercises = await Exercise.find({
            category
          });
        }

        exercises = shuffle(exercises).slice(0,2);

        dayExercises.push(...exercises);
      }

      plan.push({
        day: `Day ${i + 1}`,
        exercises: dayExercises
      });

    }

    res.json({ plan });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};