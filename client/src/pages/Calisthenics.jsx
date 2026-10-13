import React, { useState } from "react";
import {
  Flame,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Dumbbell,
  ArrowRight,
  LoaderCircle,
  Target,
  Zap,
  Trophy,
  Clock3,
  ShieldCheck,
  Sparkles,
  Activity,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const GOALS = [
  {
    name: "Strength",
    description: "Build raw bodyweight strength",
    icon: Dumbbell,
  },
  {
    name: "Muscle Building",
    description: "Develop muscle and definition",
    icon: Activity,
  },
  {
    name: "Fat Loss",
    description: "Improve conditioning and fitness",
    icon: Flame,
  },
  {
    name: "Skill Training",
    description: "Work toward advanced skills",
    icon: Trophy,
  },
  {
    name: "Mobility",
    description: "Improve flexibility and control",
    icon: Zap,
  },
];

const LEVELS = [
  {
    name: "Beginner",
    description: "Build your foundation",
    number: "01",
  },
  {
    name: "Intermediate",
    description: "Build on your progress",
    number: "02",
  },
  {
    name: "Advanced",
    description: "Challenge your limits",
    number: "03",
  },
];

const Calisthenics = () => {
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("");
  const [days, setDays] = useState(3);
  const [showPlan, setShowPlan] = useState(false);
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const generatePlan = async () => {
    if (!goal || !level || days < 3 || days > 6) {
      setError("Choose your goal, experience level, and training days.");
      return;
    }

    if (!localStorage.getItem("token")) {
      navigate("/login", {
        state: { redirectTo: "/calisthenics" },
      });
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.get("/workout/generate", {
        params: { goal, level, days },
      });

      const generatedPlan = res.data.plan || [];

      setPlan(generatedPlan);
      setShowPlan(true);

      if (generatedPlan.length === 0) {
        setError("No workouts were returned. Try generating your plan again.");
      }
    } catch (err) {
      console.error("Failed to generate workout plan:", err);
      setError(
        err.response?.data?.message ||
          "We couldn't generate your plan. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const totalExercises = plan.reduce(
    (total, day) => total + (day.exercises?.length || 0),
    0
  );

  return (
    <main className="min-h-screen bg-[#f6f7f9] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Hero */}
        <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#151515] px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <div className="absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full bg-red-600/25 blur-[90px]" />
          <div className="absolute -bottom-32 left-1/3 -z-10 h-64 w-64 rounded-full bg-orange-500/15 blur-[80px]" />

          <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_0.6fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-red-300">
                <Flame size={15} />
                Train beyond your limits
              </div>

              <h1 className="max-w-3xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Your body.
                <br />
                Your rules.
                <br />
                <span className="text-red-500">Your next level.</span>
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-gray-300 sm:text-base">
                Build your personalized calisthenics routine around your goals,
                experience, and schedule. Start where you are. Get stronger
                every week.
              </p>

              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("plan-builder")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="mt-8 inline-flex items-center gap-3 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Build my workout
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="hidden lg:block">
              <div className="relative mx-auto flex h-64 w-64 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                <div className="absolute inset-5 rounded-full border border-dashed border-red-500/40" />
                <div className="flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-600 shadow-2xl shadow-red-600/20">
                  <Dumbbell size={76} strokeWidth={1.5} />
                </div>
                <div className="absolute right-0 top-7 rounded-xl border border-white/10 bg-[#222] p-3 shadow-xl">
                  <Flame className="text-orange-400" size={23} />
                </div>
                <div className="absolute bottom-5 left-0 rounded-xl border border-white/10 bg-[#222] p-3 shadow-xl">
                  <Trophy className="text-yellow-400" size={23} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3 border-t border-white/10 pt-7 sm:gap-6">
            {[
              { value: "05", label: "Training goals" },
              { value: "03", label: "Experience levels" },
              { value: "03–06", label: "Days per week" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-xl font-black text-white sm:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Builder */}
        <section id="plan-builder" className="mt-10 scroll-mt-8">
          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
                Your training setup
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
                Build your training plan
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Customize your routine in three simple steps.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ShieldCheck size={17} className="text-emerald-600" />
              Personalized to your level
            </div>
          </div>

          <div className="space-y-7 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
            {/* Goal selection */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <Target size={19} />
                </span>
                <div>
                  <h3 className="font-bold text-gray-950">01. Choose your goal</h3>
                  <p className="text-xs text-gray-500">
                    What do you want to achieve?
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {GOALS.map((item) => {
                  const Icon = item.icon;
                  const selected = goal === item.name;

                  return (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => {
                        setGoal(item.name);
                        setError("");
                      }}
                      aria-pressed={selected}
                      className={`group relative flex min-h-[104px] items-start gap-3 rounded-2xl border p-4 text-left transition duration-200 ${
                        selected
                          ? "border-red-500 bg-red-50 ring-2 ring-red-100"
                          : "border-gray-200 bg-white hover:border-red-200 hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${
                          selected
                            ? "bg-red-600 text-white"
                            : "bg-gray-100 text-gray-600 group-hover:bg-red-100 group-hover:text-red-600"
                        }`}
                      >
                        <Icon size={21} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-gray-900">
                          {item.name}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-gray-500">
                          {item.description}
                        </span>
                      </span>

                      {selected && (
                        <CheckCircle2
                          size={18}
                          className="absolute right-3 top-3 text-red-600"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Level selection */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <BarChart3 size={19} />
                </span>
                <div>
                  <h3 className="font-bold text-gray-950">
                    02. Select your level
                  </h3>
                  <p className="text-xs text-gray-500">
                    Be honest about your current experience.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {LEVELS.map((item) => {
                  const selected = level === item.name;

                  return (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => {
                        setLevel(item.name);
                        setError("");
                      }}
                      aria-pressed={selected}
                      className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                        selected
                          ? "border-red-500 bg-red-50 ring-2 ring-red-100"
                          : "border-gray-200 hover:border-red-200 hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={`text-2xl font-black ${
                          selected ? "text-red-600" : "text-gray-300"
                        }`}
                      >
                        {item.number}
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-gray-900">
                          {item.name}
                        </span>
                        <span className="mt-1 block text-xs text-gray-500">
                          {item.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Days selection */}
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <CalendarDays size={19} />
                </span>
                <div>
                  <h3 className="font-bold text-gray-950">
                    03. Set your weekly schedule
                  </h3>
                  <p className="text-xs text-gray-500">
                    How often can you train consistently?
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-gray-50 p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Training days
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Choose between 3 and 6 days per week.
                    </p>
                  </div>
                  <div className="shrink-0 rounded-xl bg-gray-950 px-4 py-2 text-center text-white">
                    <span className="text-2xl font-black">{days}</span>
                    <span className="ml-1 text-xs text-gray-300">days</span>
                  </div>
                </div>

                <input
                  type="range"
                  min={3}
                  max={6}
                  step={1}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  aria-label="Training days per week"
                  className="h-2 w-full cursor-pointer appearance-none rounded-full accent-red-600"
                />

                <div className="mt-3 flex justify-between text-xs font-medium text-gray-500">
                  <span>3 days</span>
                  <span>4 days</span>
                  <span>5 days</span>
                  <span>6 days</span>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <AlertCircle size={19} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Generate */}
            <div className="flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm text-xs leading-5 text-gray-500">
                Your plan will be generated based on the goal, level, and
                schedule you selected.
              </p>

              <button
                type="button"
                disabled={!goal || !level || loading}
                onClick={generatePlan}
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-red-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={19} className="animate-spin" />
                    Generating plan...
                  </>
                ) : (
                  <>
                    <Sparkles size={19} />
                    Generate training plan
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Generated plan */}
        {showPlan && plan.length > 0 && (
          <section className="mt-14" aria-live="polite">
            <div className="mb-8 rounded-3xl bg-gray-950 p-6 text-white sm:p-8">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-red-400">
                    <CheckCircle2 size={16} />
                    Your plan is ready
                  </div>
                  <h2 className="text-2xl font-black sm:text-3xl">
                    {goal} <span className="text-red-500">/</span> {level}
                  </h2>
                  <p className="mt-2 text-sm text-gray-400">
                    Your personalized weekly training plan.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={generatePlan}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
                >
                  <RefreshCw size={16} />
                  Regenerate
                </button>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <CalendarDays size={19} className="text-red-400" />
                  <p className="mt-3 text-2xl font-black">{plan.length}</p>
                  <p className="mt-1 text-xs text-gray-400">Workout days</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <Dumbbell size={19} className="text-orange-400" />
                  <p className="mt-3 text-2xl font-black">{totalExercises}</p>
                  <p className="mt-1 text-xs text-gray-400">Total exercises</p>
                </div>
                <div className="col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4 sm:col-span-1">
                  <Target size={19} className="text-emerald-400" />
                  <p className="mt-3 text-lg font-black">{days} days / week</p>
                  <p className="mt-1 text-xs text-gray-400">Selected schedule</p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {plan.map((day, idx) => (
                <article
                  key={day._id || day.day || idx}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-4 border-b border-gray-100 p-5 sm:p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                        <CalendarDays size={22} />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-red-600">
                          Training day {idx + 1}
                        </p>
                        <h3 className="mt-1 text-lg font-extrabold text-gray-950">
                          {day.day || `Day ${idx + 1}`}
                        </h3>
                      </div>
                    </div>

                    <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
                      {day.exercises?.length || 0} exercises
                    </span>
                  </div>

                  <div className="space-y-3 p-5 sm:p-6">
                    {day.exercises?.map((item, i) => {
                      const exercise = item.exercise || item;

                      return (
                        <div
                          key={exercise._id || i}
                          className="flex items-center gap-3 rounded-xl bg-gray-50 p-3.5 transition hover:bg-red-50/60"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
                            <CheckCircle2 size={18} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="break-words text-sm font-bold text-gray-900">
                              {exercise.name || "Exercise"}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {exercise.sets ?? "—"} sets
                              <span className="mx-2 text-gray-300">•</span>
                              {exercise.reps ?? "—"} reps
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    {(!day.exercises || day.exercises.length === 0) && (
                      <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                        No exercises listed for this day.
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
              <Clock3 size={20} className="mt-0.5 shrink-0" />
              <p>
                <strong>Train smart:</strong> Warm up before each session, use
                proper form, and allow adequate recovery. Adjust the workout
                if you experience pain or excessive fatigue.
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default Calisthenics;