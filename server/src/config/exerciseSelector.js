export function getExercises(exercises, category, goal, level) {

  let filtered = exercises.filter(
    ex =>
      ex.category === category &&
      ex.level === level &&
      ex.goals.includes(goal)
  );

  // fallback 1
  if (filtered.length === 0) {
    filtered = exercises.filter(
      ex =>
        ex.category === category &&
        ex.level === level
    );
  }

  // fallback 2
  if (filtered.length === 0) {
    filtered = exercises.filter(
      ex => ex.category === category
    );
  }

  return filtered;
}