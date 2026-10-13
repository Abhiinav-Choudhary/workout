
import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Dumbbell,
  Loader2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { auth } from "../googleAuth/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/home";

  const googleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const token = await user.getIdToken(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Google login failed.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error("Google login error:", err);

      if (err.code === "auth/popup-closed-by-user") {
        setError("Google sign-in was cancelled.");
      } else {
        setError(err.message || "Unable to sign in with Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid email or password.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const socialButtonClass =
    "flex items-center justify-center gap-2 rounded-md border border-gray-200 px-3 py-2.5 text-xs font-medium text-gray-600 transition hover:border-red-300 hover:bg-red-50 disabled:opacity-60";

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
              WELCOME BACK
            </span>

            <h1 className="max-w-md text-4xl font-bold leading-tight xl:text-5xl">
              Stronger every day.
              <br />
              <span className="text-red-500">Your journey</span>
              <br />
              continues here.
            </h1>

            <p className="mt-6 max-w-sm text-sm leading-7 text-gray-400">
              Sign in to explore your fitness gear, track your progress, and
              keep moving toward your goals.
            </p>

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

        {/* RIGHT LOGIN PANEL */}
        <section className="flex items-center justify-center bg-white px-5 py-8 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-between">
              <Link to="/home" className="inline-flex items-center gap-2 lg:hidden">
                <Dumbbell className="text-red-600" size={27} />
                <span className="text-xl font-extrabold text-gray-900">
                  Flex<span className="text-red-600">Forge</span>
                </span>
              </Link>
              {/* <Link
                to="/register"
                className="ml-auto text-xs font-semibold text-red-700 transition hover:text-red-500"
              >
                Create account
              </Link> */}
            </div>

            <div className="mb-7">
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                Welcome Back
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Sign in to continue your fitness journey.
              </p>
            </div>

            {error && (
              <div role="alert" className="mb-5 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-gray-500">
                  Email Address
                </label>
                <div className="flex items-center border-b border-gray-200 transition focus-within:border-red-500">
                  <Mail size={17} className="mr-3 shrink-0 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    name="email"
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
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-medium text-gray-500">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-red-700 transition hover:text-red-500"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="flex items-center border-b border-gray-200 transition focus-within:border-red-500">
                  <Lock size={17} className="mr-3 shrink-0 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
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
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-red-700 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-[10px] uppercase tracking-widest text-gray-400">
                or continue with
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={googleLogin}
                disabled={loading}
                className={socialButtonClass}
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path fill="#4285F4" d="M21.6 12.23c0-.72-.06-1.42-.18-2.09H12v3.95h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.25c1.9-1.75 2.97-4.34 2.97-7.42Z"/>
                    <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.63-2.35l-3.25-2.54c-.9.6-2.05.97-3.38.97-2.6 0-4.8-1.75-5.6-4.1H3.04v2.62A10 10 0 0 0 12 22Z"/>
                    <path fill="#FBBC05" d="M6.4 13.98a6 6 0 0 1 0-3.96V7.4H3.04a10 10 0 0 0 0 9.2l3.36-2.62Z"/>
                    <path fill="#EA4335" d="M12 5.92c1.47 0 2.8.5 3.83 1.5l2.88-2.88A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.96 5.4L6.4 10c.8-2.35 3-4.08 5.6-4.08Z"/>
                  </svg>
                )}
                Google
              </button>

              <button
                type="button"
                disabled
                title="Facebook login is not configured yet"
                className={`${socialButtonClass} cursor-not-allowed opacity-60`}
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1877F2] text-[10px] font-bold text-white">
                  f
                </span>
                Facebook
              </button>
            </div>

            <p className="mt-7 text-center text-xs text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-red-700 transition hover:text-red-500"
              >
                Create Account
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

export default Login;
