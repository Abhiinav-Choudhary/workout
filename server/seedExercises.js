import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import Exercise from "./src/models/exerciseModel.js";

dotenv.config(); 

const exercises = [

/* PUSH */

{
  name: "Incline Push Ups",
  category: "push",
  level: "Beginner",
  goals: ["Strength","Muscle Building"],
  sets: 3,
  reps: "10-12"
},
{
  name: "Push Ups",
  category: "push",
  level: "Beginner",
  goals: ["Strength","Muscle Building","Fat Loss"],
  sets: 3,
  reps: "12"
},
{
  name: "Bench Dips",
  category: "push",
  level: "Beginner",
  goals: ["Strength","Muscle Building"],
  sets: 3,
  reps: "10"
},
{
  name: "Decline Push Ups",
  category: "push",
  level: "Intermediate",
  goals: ["Strength","Muscle Building"],
  sets: 4,
  reps: "12"
},
{
  name: "Pike Push Ups",
  category: "push",
  level: "Intermediate",
  goals: ["Strength","Skill Training"],
  sets: 4,
  reps: "10"
},
{
  name: "Archer Push Ups",
  category: "push",
  level: "Advanced",
  goals: ["Strength","Muscle Building"],
  sets: 4,
  reps: "8"
},
{
  name: "Handstand Push Ups",
  category: "push",
  level: "Advanced",
  goals: ["Strength","Skill Training"],
  sets: 4,
  reps: "6"
},

/* PULL */

{
  name: "Australian Pull Ups",
  category: "pull",
  level: "Beginner",
  goals: ["Strength","Muscle Building"],
  sets: 3,
  reps: "10"
},
{
  name: "Negative Pull Ups",
  category: "pull",
  level: "Beginner",
  goals: ["Strength"],
  sets: 3,
  reps: "6"
},
{
  name: "Dead Hang",
  category: "pull",
  level: "Beginner",
  goals: ["Strength","Mobility"],
  sets: 3,
  reps: "30 sec"
},
{
  name: "Pull Ups",
  category: "pull",
  level: "Intermediate",
  goals: ["Strength","Muscle Building"],
  sets: 4,
  reps: "6-8"
},
{
  name: "Chin Ups",
  category: "pull",
  level: "Intermediate",
  goals: ["Strength","Muscle Building"],
  sets: 4,
  reps: "8"
},
{
  name: "Archer Pull Ups",
  category: "pull",
  level: "Advanced",
  goals: ["Strength"],
  sets: 4,
  reps: "6"
},
{
  name: "Muscle Ups",
  category: "pull",
  level: "Advanced",
  goals: ["Strength","Skill Training"],
  sets: 4,
  reps: "5"
},

/* LEGS */

{
  name: "Bodyweight Squats",
  category: "legs",
  level: "Beginner",
  goals: ["Strength","Fat Loss"],
  sets: 3,
  reps: "15"
},
{
  name: "Lunges",
  category: "legs",
  level: "Beginner",
  goals: ["Strength","Fat Loss"],
  sets: 3,
  reps: "12"
},
{
  name: "Glute Bridges",
  category: "legs",
  level: "Beginner",
  goals: ["Strength"],
  sets: 3,
  reps: "12"
},
{
  name: "Jump Squats",
  category: "legs",
  level: "Intermediate",
  goals: ["Fat Loss","Strength"],
  sets: 4,
  reps: "10"
},
{
  name: "Bulgarian Split Squats",
  category: "legs",
  level: "Intermediate",
  goals: ["Strength","Muscle Building"],
  sets: 4,
  reps: "8"
},
{
  name: "Pistol Squats",
  category: "legs",
  level: "Advanced",
  goals: ["Strength"],
  sets: 4,
  reps: "6"
},

/* CORE */

{
  name: "Plank",
  category: "core",
  level: "Beginner",
  goals: ["Strength","Fat Loss"],
  sets: 3,
  reps: "30 sec"
},
{
  name: "Mountain Climbers",
  category: "core",
  level: "Beginner",
  goals: ["Fat Loss"],
  sets: 3,
  reps: "30 sec"
},
{
  name: "Russian Twists",
  category: "core",
  level: "Beginner",
  goals: ["Strength","Fat Loss"],
  sets: 3,
  reps: "20"
},
{
  name: "Hanging Knee Raises",
  category: "core",
  level: "Intermediate",
  goals: ["Strength"],
  sets: 3,
  reps: "12"
},
{
  name: "Hanging Leg Raises",
  category: "core",
  level: "Intermediate",
  goals: ["Strength"],
  sets: 4,
  reps: "10"
},
{
  name: "Dragon Flags",
  category: "core",
  level: "Advanced",
  goals: ["Strength"],
  sets: 4,
  reps: "6"
},

/* SKILLS */

{
  name: "Wall Handstand Hold",
  category: "skill",
  level: "Beginner",
  goals: ["Skill Training"],
  sets: 4,
  reps: "20 sec"
},
{
  name: "L-Sit",
  category: "skill",
  level: "Intermediate",
  goals: ["Skill Training","Strength"],
  sets: 4,
  reps: "20 sec"
},
{
  name: "Front Lever Tuck Hold",
  category: "skill",
  level: "Advanced",
  goals: ["Skill Training"],
  sets: 4,
  reps: "15 sec"
},
{
  name: "Planche Lean",
  category: "skill",
  level: "Advanced",
  goals: ["Skill Training"],
  sets: 4,
  reps: "15 sec"
},

/* MOBILITY */

{
  name: "Deep Squat Hold",
  category: "mobility",
  level: "Beginner",
  goals: ["Mobility"],
  sets: 3,
  reps: "30 sec"
},
{
  name: "Shoulder Mobility Drill",
  category: "mobility",
  level: "Beginner",
  goals: ["Mobility"],
  sets: 3,
  reps: "10"
},
{
  name: "Hip Flexor Stretch",
  category: "mobility",
  level: "Beginner",
  goals: ["Mobility"],
  sets: 3,
  reps: "30 sec"
}

];



const seedExercises = async () => {

  try {

    await connectDB();

    await Exercise.deleteMany(); // optional

    await Exercise.insertMany(exercises);

    console.log("Exercises inserted successfully");

    process.exit();

  } catch (error) {

    console.error(error);

    process.exit(1);

  }

};

seedExercises();
