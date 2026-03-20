import React, { useState } from "react";
import { Flame, BarChart, Calendar, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const GOALS = [
  "Strength",
  "Muscle Building",
  "Fat Loss",
  "Skill Training",
  "Mobility"
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const Calisthenics = () => {
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("");
  const [days, setDays] = useState(3);
  const [showPlan, setShowPlan] = useState(false);
  const [plan, setPlan] = useState([]);

  const navigate = useNavigate();

  const isLoggedIn = () => {
    return !!localStorage.getItem("token");
  };

  const generatePlan = async () => {
    if (!isLoggedIn()) {
      navigate("/login", {
        state: { redirectTo: "/calisthenics" }
      });
      return;
    }

    try {
      const res = await api.get("/workout/generate", {
  params: { goal, level, days }
});

console.log("API RESPONSE:", res.data);
console.log("PLAN:", res.data.plan);

setPlan(res.data.plan || []);
setShowPlan(true);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch training plan");
    }
  };
console.log("Current Plan:", plan);
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">

      {/* Title */}
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-red-600 mb-3">
          Calisthenics Training
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Build strength, skills, and endurance using bodyweight training.
        </p>
      </div>

      {/* Selection Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-14">

        {/* Goal */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-2 mb-4 text-red-500">
            <Flame size={22} />
            <h3 className="font-bold text-lg">Goal</h3>
          </div>

          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">Select Goal</option>
            {GOALS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-2 mb-4 text-red-500">
            <BarChart size={22} />
            <h3 className="font-bold text-lg">Level</h3>
          </div>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">Select Level</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Days */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-2 mb-4 text-red-500">
            <Calendar size={22} />
            <h3 className="font-bold text-lg">Days / Week</h3>
          </div>

          <input
            type="number"
            min={3}
            max={6}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

      </div>

      {/* Generate Button */}
      <div className="text-center mb-16">
        <button
          disabled={!goal || !level}
          onClick={generatePlan}
          className={`px-10 py-4 rounded-lg font-bold text-lg transition ${
            !goal || !level
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600 text-white shadow-lg"
          }`}
        >
          Generate Training Plan
        </button>
      </div>

      {/* Plan Preview */}
      {showPlan && (
        <div className="space-y-10">

          <h2 className="text-3xl font-bold text-center mb-8">
            {goal} • {level} Plan ({days} Days / Week)
          </h2>
 
          {plan.map((day, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <h3 className="text-xl font-bold mb-4 text-red-600">
                {day.day}
              </h3>

             <ul className="space-y-2">
 {day.exercises?.map((ex, i) => {

  const exercise = ex.exercise || ex;

  return (
    <li
      key={exercise._id || i}
      className="flex items-center gap-2 text-gray-700"
    >
      <CheckCircle size={18} className="text-green-500" />

      <span>
        {exercise.name} – {exercise.sets} x {exercise.reps}
      </span>

    </li>
  );
})}
</ul>
            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default Calisthenics;