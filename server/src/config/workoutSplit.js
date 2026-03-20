export function getWorkoutSplit(days) {

  if (days === 3) {
    return [
      ["push","core"],
      ["pull"],
      ["legs","mobility"]
    ];
  }

  if (days === 4) {
    return [
      ["push"],
      ["pull"],
      ["legs"],
      ["core","skill"]
    ];
  }

  if (days === 5) {
    return [
      ["push"],
      ["pull"],
      ["legs"],
      ["core"],
      ["skill"]
    ];
  }

  if (days === 6) {
    return [
      ["push"],
      ["pull"],
      ["legs"],
      ["push"],
      ["pull"],
      ["legs"]
    ];
  }

}