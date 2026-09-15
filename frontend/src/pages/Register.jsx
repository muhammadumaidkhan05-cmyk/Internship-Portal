import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  ChevronDown,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    track: "",
    cohort: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Clear all fields whenever Register page opens
  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      track: "",
      cohort: "",
    });

    setError("");
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    // Check password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");

      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            track: formData.track,
            cohort: formData.cohort,
            role: "intern",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");

        // Clear only password fields after failed registration
        setFormData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));

        return;
      }

      // Clear all fields after successful registration
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        track: "",
        cohort: "",
      });

      alert("Account created successfully!");

      // Go to Login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Registration error:", error);

      setError("Unable to connect to server");

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-10">

      {/* Background Effects */}
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />

      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-orange-300/30 blur-3xl" />

      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200/20 blur-3xl" />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="rounded-3xl border border-white/70 bg-white/85 p-8 shadow-2xl backdrop-blur-xl sm:p-10">

          {/* Logo + Heading */}
          <div className="mb-8 text-center">

            <motion.div
              whileHover={{ scale: 1.08, rotate: 4 }}
              transition={{ duration: 0.25 }}
              className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-3xl font-bold text-white shadow-lg shadow-orange-500/25"
            >
              M
            </motion.div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              MSN Academy
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Create your internship portal account
            </p>
          </div>

          {/* Register Form */}
          <form
            onSubmit={handleRegister}
            autoComplete="off"
            className="space-y-5"
          >

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="animate-shake rounded-xl border border-red-200 bg-red-100 px-4 py-3 text-sm font-medium text-red-600"
              >
                {error}
              </motion.div>
            )}

            {/* Name + Email */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Password + Confirm Password */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-11 text-sm text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500/50"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword ? "text" : "password"
                    }
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-11 text-sm text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500/50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Track + Cohort */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* Track */}
              <div>
                <label
                  htmlFor="track"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Track
                </label>

                <div className="relative">
                  <select
                    id="track"
                    name="track"
                    value={formData.track}
                    onChange={handleChange}
                    required
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-10 text-sm text-slate-800 outline-none transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="">Select Track</option>
                    <option value="Web Development">
                      Web Development
                    </option>
                    <option value="App Development">
                      App Development
                    </option>
                    <option value="Data Science">
                      Data Science
                    </option>
                    <option value="AI/ML">
                      AI / ML
                    </option>
                  </select>

                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              {/* Cohort */}
              <div>
                <label
                  htmlFor="cohort"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Cohort
                </label>

                <div className="relative">
                  <select
                    id="cohort"
                    name="cohort"
                    value={formData.cohort}
                    onChange={handleChange}
                    required
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-10 text-sm text-slate-800 outline-none transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="">Select Cohort</option>
                    <option value="Cohort 1">Cohort 1</option>
                    <option value="Cohort 2">Cohort 2</option>
                    <option value="Cohort 3">Cohort 3</option>
                    <option value="Cohort 4">Cohort 4</option>
                  </select>

                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-blue-900 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>
                {loading ? "Creating Account..." : "Create Account"}
              </span>

              {!loading && (
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 transition-colors hover:text-blue-800 hover:underline"
            >
              Login
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
}

export default Register;
