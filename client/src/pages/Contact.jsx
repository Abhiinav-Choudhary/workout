import React, { useState } from "react";
import {
  Dumbbell,
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  Clock3,
  Target,
  CheckCircle2,
  ArrowRight,
  LoaderCircle,
  AlertCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import api from "../api/axios";

const trainers = [
  {
    id: 1,
    name: "Rahul Sharma",
    specialty: "Weight Loss Coach",
    initials: "RS",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 2,
    name: "Ankit Verma",
    specialty: "Strength Trainer",
    initials: "AV",
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: 3,
    name: "Neha Kapoor",
    specialty: "Yoga Instructor",
    initials: "NK",
    color: "bg-purple-100 text-purple-700",
  },
];

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  trainer: "",
  date: "",
  time: "",
  message: "",
};

const inputClass = (hasError = false) =>
  `w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-4 ${
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
      : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-100"
  }`;

function Contact() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setNotice(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number.";
    }

    if (!formData.trainer) {
      newErrors.trainer = "Please choose your trainer.";
    }

    if (!formData.date) {
      newErrors.date = "Please select an appointment date.";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Parse the local calendar date without UTC conversion.
      const [year, month, day] = formData.date.split("-").map(Number);
      const selectedDate = new Date(year, month - 1, day);

      if (selectedDate < today) {
        newErrors.date = "Please choose today or a future date.";
      }
    }

    if (!formData.time) {
      newErrors.time = "Please select a preferred time.";
    }

    if (formData.message.trim() && formData.message.trim().length < 5) {
      newErrors.message = "Tell us a little more (at least 5 characters).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice(null);

    if (!validateForm()) return;

    try {
      setLoading(true);

      const res = await api.post("/appointments/book", {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      });

      setNotice({
        type: "success",
        message: res.data.message || "Your appointment has been booked successfully!",
      });

      setFormData(initialFormData);
      setErrors({});
    } catch (error) {
      setNotice({
        type: "error",
        message:
          error.response?.data?.message ||
          "We couldn't book your appointment. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-[#f5f7f5] px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gray-950 px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-14">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-lime-400/10 blur-3xl" />

          <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-emerald-300">
                <Sparkles size={14} />
                YOUR FITNESS JOURNEY STARTS HERE
              </div>

              <h1 className="max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">
                One session closer to your{" "}
                <span className="text-emerald-400">stronger self.</span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-gray-300 sm:text-base">
                Connect with experienced trainers, build a personalized plan,
                and take the next step toward your fitness goals.
              </p>

              <div className="mt-7 flex flex-wrap gap-4 text-sm text-gray-300">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-emerald-400" />
                  Personalized guidance
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-emerald-400" />
                  Flexible scheduling
                </span>
              </div>
            </div>

            <div className="hidden h-28 w-28 items-center justify-center rounded-3xl border border-white/10 bg-white/5 md:flex">
              <Dumbbell size={58} strokeWidth={1.3} className="text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid items-start gap-8 lg:grid-cols-[0.75fr_1.5fr]">
          {/* Sidebar */}
          <aside className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                Meet your coaches
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-gray-950">
                Find your perfect match.
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Choose a trainer whose expertise matches your goals.
              </p>
            </div>

            <div className="space-y-3">
              {trainers.map((trainer) => (
                <button
                  key={trainer.id}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      trainer: trainer.name,
                    }));
                    setErrors((prev) => ({
                      ...prev,
                      trainer: "",
                    }));
                    setNotice(null);
                  }}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition duration-200 ${
                    formData.trainer === trainer.name
                      ? "border-emerald-500 bg-emerald-50 shadow-sm ring-2 ring-emerald-100"
                      : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-extrabold ${trainer.color}`}
                  >
                    {trainer.initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-900">{trainer.name}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {trainer.specialty}
                    </p>
                  </div>

                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      formData.trainer === trainer.name
                        ? "border-emerald-600 bg-emerald-600"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.trainer === trainer.name && (
                      <CheckCircle2 size={15} className="text-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <ShieldCheck size={21} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Your details are safe</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Your information is used to manage your booking.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Form */}
          <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-6 sm:px-9">
              <p className="text-sm font-semibold text-emerald-700">
                BOOK A SESSION
              </p>
              <h2 className="mt-1 text-2xl font-extrabold text-gray-950">
                Appointment details
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Fill in your details and we'll help you get started.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-7 p-6 sm:p-9">
              {notice && (
                <div
                  role="status"
                  className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
                    notice.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {notice.type === "success" ? (
                    <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle size={19} className="mt-0.5 shrink-0" />
                  )}
                  <p>{notice.message}</p>
                </div>
              )}

              {/* Personal information */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
                  <UserRound size={17} className="text-emerald-600" />
                  Personal information
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                      Full name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <UserRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                      <input
                        id="name"
                        type="text"
                        name="name"
                        autoComplete="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        aria-invalid={!!errors.name}
                        className={inputClass(!!errors.name)}
                      />
                    </div>
                    {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                      <input
                        id="email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        aria-invalid={!!errors.email}
                        className={inputClass(!!errors.email)}
                      />
                    </div>
                    {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                      Mobile number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={handleChange}
                        aria-invalid={!!errors.phone}
                        className={inputClass(!!errors.phone)}
                      />
                    </div>
                    {errors.phone && <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Session details */}
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
                  <CalendarDays size={17} className="text-emerald-600" />
                  Session preferences
                </h3>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="trainer" className="mb-2 block text-sm font-medium text-gray-700">
                      Selected trainer <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Dumbbell className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                      <select
                        id="trainer"
                        name="trainer"
                        value={formData.trainer}
                        onChange={handleChange}
                        aria-invalid={!!errors.trainer}
                        className={`${inputClass(!!errors.trainer)} appearance-none`}
                      >
                        <option value="">Choose a trainer</option>
                        {trainers.map((trainer) => (
                          <option key={trainer.id} value={trainer.name}>
                            {trainer.name} — {trainer.specialty}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.trainer && <p className="mt-1.5 text-xs text-red-600">{errors.trainer}</p>}
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="date" className="mb-2 block text-sm font-medium text-gray-700">
                        Preferred date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                        <input
                          id="date"
                          type="date"
                          name="date"
                          min={minDate}
                          value={formData.date}
                          onChange={handleChange}
                          aria-invalid={!!errors.date}
                          className={inputClass(!!errors.date)}
                        />
                      </div>
                      {errors.date && <p className="mt-1.5 text-xs text-red-600">{errors.date}</p>}
                    </div>

                    <div>
                      <label htmlFor="time" className="mb-2 block text-sm font-medium text-gray-700">
                        Preferred time <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Clock3 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                        <input
                          id="time"
                          type="time"
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          aria-invalid={!!errors.time}
                          className={inputClass(!!errors.time)}
                        />
                      </div>
                      {errors.time && <p className="mt-1.5 text-xs text-red-600">{errors.time}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Goals */}
              <div>
                <label htmlFor="message" className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900">
                  <Target size={17} className="text-emerald-600" />
                  Your fitness goals
                  <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  maxLength={500}
                  placeholder="Tell your trainer what you want to achieve..."
                  value={formData.message}
                  onChange={handleChange}
                  aria-invalid={!!errors.message}
                  className={`w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-4 ${
                    errors.message
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-100"
                  }`}
                />
                <div className="mt-1.5 flex items-center justify-between gap-3">
                  {errors.message ? (
                    <p className="text-xs text-red-600">{errors.message}</p>
                  ) : (
                    <p className="text-xs text-gray-400">
                      Share your goals or any specific requirements.
                    </p>
                  )}
                  <span className="shrink-0 text-xs text-gray-400">
                    {formData.message.length}/500
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/20 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={19} className="animate-spin" />
                    Booking your session...
                  </>
                ) : (
                  <>
                    Book my appointment
                    <ArrowRight size={19} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <p className="text-center text-xs leading-5 text-gray-400">
                By booking, you agree to be contacted about your appointment.
                Your preferred slot may require confirmation.
              </p>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Contact;
