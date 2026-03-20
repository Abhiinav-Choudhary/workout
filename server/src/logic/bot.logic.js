// ---------------- Session Memory ----------------
const sessions = {};

// ---------------- Helpers ----------------
const normalize = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const includesAny = (text, keywords) =>
  keywords.some((k) => text.includes(k));

// ---------------- Bot Logic ----------------
export const getBotResponse = (message, sessionId) => {
  const text = normalize(message);

  // Create session if not exists
  if (!sessions[sessionId]) {
    sessions[sessionId] = {
      goal: null,
      level: null
    };
  }

  const session = sessions[sessionId];

  /* ---------------- GREETING ---------------- */
  if (includesAny(text, ["hi", "hello", "hey", "hii", "yo"])) {
    return (
      "Hey! 👋 I’m your personal fitness guide.\n\n" +
      "I help you train smarter, eat better, and stay consistent — without confusion.\n\n" +
      "➡️ What’s your main fitness goal?\n" +
      "• Fat loss\n" +
      "• Muscle gain"
    );
  }

  /* ---------------- GOAL DETECTION ---------------- */
  if (
    includesAny(text, [
      "fat",
      "loss",
      "lose",
      "weight",
      "wait",
      "slim",
      "belly",
      "reduce"
    ])
  ) {
    session.goal = "fat_loss";
    return (
      "Got it 💪 You’re focusing on fat loss.\n\n" +
      "To guide you properly, tell me your experience level:\n" +
      "• Beginner\n" +
      "• Intermediate"
    );
  }

  if (
    includesAny(text, [
      "muscle",
      "gain",
      "bulk",
      "bulking",
      "strength",
      "mucle",
      "muscel"
    ])
  ) {
    session.goal = "muscle_gain";
    return (
      "Nice 🔥 You’re aiming to build muscle.\n\n" +
      "What’s your experience level?\n" +
      "• Beginner\n" +
      "• Intermediate"
    );
  }

  /* ---------------- LEVEL DETECTION ---------------- */
  if (
    includesAny(text, [
      "beginner",
      "begginer",
      "new",
      "starter",
      "first time"
    ])
  ) {
    session.level = "beginner";
  }

  if (
    includesAny(text, [
      "intermediate",
      "experienced",
      "regular",
      "advanced"
    ])
  ) {
    session.level = "intermediate";
  }

  /* ---------------- CONTEXTUAL RESPONSE ---------------- */
  if (session.goal && session.level) {
    // Beginner + Fat Loss
    if (session.goal === "fat_loss" && session.level === "beginner") {
      return (
        "Perfect 👍 Since you’re a beginner focusing on fat loss, simple and consistent training works best.\n\n" +
        "🏋️ BEGINNER FAT-LOSS PLAN\n" +
        "• Full-body workouts 3× per week\n" +
        "• Daily walking or light cardio\n" +
        "• Learn proper exercise form\n\n" +
        "⚠️ IMPORTANT\n" +
        "• Start light — consistency beats intensity\n\n" +
        "➡️ What would you like next?\n" +
        "• Workout routine\n" +
        "• Diet basics"
      );
    }

    // Beginner + Muscle Gain
    if (session.goal === "muscle_gain" && session.level === "beginner") {
      return (
        "Great choice 💪 As a beginner, muscle growth comes quickly with the right basics.\n\n" +
        "🏋️ BEGINNER MUSCLE-GAIN PLAN\n" +
        "• Train 3–4 days per week\n" +
        "• Focus on compound movements\n" +
        "• Eat enough protein & sleep well\n\n" +
        "⚠️ IMPORTANT\n" +
        "• Never sacrifice form for weight\n\n" +
        "➡️ What should we work on next?\n" +
        "• Workout routine\n" +
        "• Nutrition basics"
      );
    }

    // Intermediate + Fat Loss
    if (session.goal === "fat_loss" && session.level === "intermediate") {
      return (
        "Nice 🔥 Since you’re experienced, fat loss now depends on structure.\n\n" +
        "🏋️ INTERMEDIATE FAT-LOSS STRATEGY\n" +
        "• Structured training split\n" +
        "• Progressive overload\n" +
        "• Calorie awareness\n\n" +
        "➡️ What do you want help with?\n" +
        "• Training strategy\n" +
        "• Diet optimization"
      );
    }

    // Intermediate + Muscle Gain
    if (session.goal === "muscle_gain" && session.level === "intermediate") {
      return (
        "Excellent 💥 At this level, muscle gain is about precision.\n\n" +
        "🏋️ INTERMEDIATE MUSCLE-GAIN STRATEGY\n" +
        "• Track lifts and progress\n" +
        "• Optimize recovery\n" +
        "• Time nutrition properly\n\n" +
        "➡️ What’s your priority?\n" +
        "• Training split\n" +
        "• Nutrition planning"
      );
    }
  }

  /* ---------------- SMART FALLBACK ---------------- */
  return (
    "I want to help you properly 😊\n\n" +
    "So far I know:\n" +
    `• Goal: ${session.goal || "not set"}\n` +
    `• Level: ${session.level || "not set"}\n\n` +
    "You can say things like:\n" +
    "• Fat loss / Muscle gain\n" +
    "• Beginner / Intermediate\n" +
    "• Workout plan / Diet basics\n\n" +
    "➡️ Tell me what you want to work on next 💪"
  );
};


