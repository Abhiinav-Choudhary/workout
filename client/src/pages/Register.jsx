
import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Dumbbell,
  Loader2,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain a number";
    return null;
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: "", color: "bg-gray-200" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { label: "Weak", color: "bg-red-500" },
      { label: "Weak", color: "bg-red-500" },
      { label: "Fair", color: "bg-yellow-500" },
      { label: "Good", color: "bg-blue-500" },
      { label: "Strong", color: "bg-green-500" },
      { label: "Strong", color: "bg-green-500" },
    ];

    return { strength, ...levels[strength] };
  };

  const pwStrength = passwordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Registration failed. Please try again.");
      }

      setSuccess(true);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setTimeout(() => {
        if (data.user.role === "admin") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/home";
        }
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const socialButtonClass =
    "flex items-center justify-center gap-2 rounded-md border border-gray-200 px-3 py-2.5 text-xs font-medium text-gray-600 transition hover:border-red-300 hover:bg-red-50";

  return (
    <main className="min-h-screen bg-[#101010] px-4 py-6 sm:px-8 lg:flex lg:items-center lg:justify-center lg:py-10">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[26px] border border-white/10 bg-[#171717] shadow-[0_25px_80px_rgba(0,0,0,0.45)] lg:min-h-[650px] lg:grid-cols-[0.9fr_1.1fr]">

        {/* LEFT BRAND PANEL */}
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#280b0b] via-[#171111] to-[#090909] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="pointer-events-none absolute -left-28 top-36 h-80 w-80 rounded-full bg-red-600/20 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-red-500/20 blur-[100px]" />

          <Link to="/home" className="relative z-10 inline-flex w-fit items-center gap-3">
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-2.5">
              <Dumbbell size={28} className="text-red-500" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">
              Flex<span className="text-red-500">Forge</span>
            </span>
          </Link>

          <div className="relative z-10 my-12">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium tracking-wide text-red-300">
              <Sparkles size={14} />
              YOUR FITNESS STARTS HERE
            </span>

            <h1 className="max-w-md text-4xl font-bold leading-tight xl:text-5xl">
              Build strength.
              <br />
              <span className="text-red-500">Forge your</span>
              <br />
              best self.
            </h1>

            <p className="mt-6 max-w-sm text-sm leading-7 text-gray-400">
              Gear up, stay consistent, and push beyond your limits. Your next
              fitness chapter starts with one simple step.
            </p>

            {/* Abstract fitness artwork made with CSS */}
            <div className="relative mt-12 flex h-48 items-center justify-center">
              <div className="absolute h-40 w-40 rounded-full border border-red-500/20" />
              <div className="absolute h-32 w-32 rounded-full border border-red-500/30" />
              <div className="absolute h-24 w-24 rounded-full bg-red-600/10 blur-xl" />

              <div className="relative flex items-center gap-1.5 -rotate-12">
                <div className="h-20 w-3 rounded-md bg-gradient-to-b from-red-300 to-red-700" />
                <div className="h-28 w-5 rounded-md bg-gradient-to-r from-gray-500 via-gray-200 to-gray-600 shadow-xl" />
                <div className="h-16 w-3 rounded-sm bg-red-500" />
                <div className="h-3 w-28 rounded-md bg-gradient-to-b from-gray-200 to-gray-500 shadow-lg" />
                <div className="h-16 w-3 rounded-sm bg-red-500" />
                <div className="h-28 w-5 rounded-md bg-gradient-to-r from-gray-500 via-gray-200 to-gray-600 shadow-xl" />
                <div className="h-20 w-3 rounded-md bg-gradient-to-b from-red-300 to-red-700" />
              </div>
            </div>
          </div>

          <p className="relative z-10 text-xs tracking-wide text-gray-500">
            TRAIN HARD. STAY HUMBLE. KEEP FORGING.
          </p>
        </section>

        {/* RIGHT FORM PANEL */}
        <section className="flex items-center justify-center bg-white px-5 py-8 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-between">
              <Link to="/home" className="inline-flex items-center gap-2 lg:hidden">
                <Dumbbell className="text-red-600" size={27} />
                <span className="text-xl font-extrabold text-gray-900">
                  Flex<span className="text-red-600">Forge</span>
                </span>
              </Link>

              <span className="ml-auto text-xs text-gray-400">
                Join the community
              </span>
            </div>

            <div className="mb-7">
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                Create Account
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Start building a stronger version of yourself.
              </p>
            </div>

            {/* Social buttons are visual only, matching the requested design.
                Existing Google login remains on the Login page. */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/login";
                }}
                className={socialButtonClass}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path fill="#4285F4" d="M21.6 12.23c0-.72-.06-1.42-.18-2.09H12v3.95h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.25c1.9-1.75 2.97-4.34 2.97-7.42Z"/>
                  <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.63-2.35l-3.25-2.54c-.9.6-2.05.97-3.38.97-2.6 0-4.8-1.75-5.6-4.1H3.04v2.62A10 10 0 0 0 12 22Z"/>
                  <path fill="#FBBC05" d="M6.4 13.98a6 6 0 0 1 0-3.96V7.4H3.04a10 10 0 0 0 0 9.2l3.36-2.62Z"/>
                  <path fill="#EA4335" d="M12 5.92c1.47 0 2.8.5 3.83 1.5l2.88-2.88A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.96 5.4L6.4 10c.8-2.35 3-4.08 5.6-4.08Z"/>
                </svg>
                Sign up with Google
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.href = "/login";
                }}
                className={socialButtonClass}
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1877F2] text-[10px] font-bold text-white">
                  f
                </span>
                Sign up with Facebook
              </button>
            </div>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-[10px] uppercase tracking-widest text-gray-400">
                or create with email
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {error && (
              <div role="alert" className="mb-5 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div role="status" className="mb-5 flex items-start gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                <CheckCircle size={18} className="mt-0.5 shrink-0" />
                <p>Account created! Redirecting you now...</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-gray-500">
                  Full Name
                </label>
                <div className="flex items-center border-b border-gray-200 transition focus-within:border-red-500">
                  <User size={17} className="mr-3 shrink-0 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-transparent py-3 text-sm text-gray-900 outline-none placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-gray-500">
                  Email Address
                </label>
                <div className="flex items-center border-b border-gray-200 transition focus-within:border-red-500">
                  <Mail size={17} className="mr-3 shrink-0 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full bg-transparent py-3 text-sm text-gray-900 outline-none placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-gray-500">
                  Password
                </label>
                <div className="flex items-center border-b border-gray-200 transition focus-within:border-red-500">
                  <Lock size={17} className="mr-3 shrink-0 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className="w-full bg-transparent py-3 text-sm text-gray-900 outline-none placeholder:text-gray-300"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((value) => !value)}
                    className="ml-2 text-gray-400 transition hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                {formData.password && (
                  <div className="mt-3">
                    <div className="mb-1.5 flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            level <= pwStrength.strength
                              ? pwStrength.color
                              : "bg-gray-100"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Password strength:{" "}
                      <span className="font-medium text-gray-600">
                        {pwStrength.label}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <label className="flex items-start gap-2.5 pt-1 text-xs leading-5 text-gray-500">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 shrink-0 accent-red-600"
                />
                <span>
                  I agree to the{" "}
                  <Link to="/terms" className="font-medium text-red-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="font-medium text-red-600 hover:underline">
                    Privacy Policy
                  </Link>.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading || success}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-red-700 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Creating account...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle size={17} />
                    Account created
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-red-700 transition hover:text-red-500">
                Log In
              </Link>
            </p>

            <p className="mt-8 text-center text-[10px] text-gray-400">
              TRAIN HARD. KEEP FORGING.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Register;
