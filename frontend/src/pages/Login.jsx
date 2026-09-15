import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Clear login fields whenever Login page opens
  useEffect(() => {
    setEmail("");
    setPassword("");
    setError("");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError("Incorrect email or password, Please try again.");

        // Clear password after failed login
        setPassword("");

        return;
      }

      // Save JWT token
  // Save JWT token
localStorage.setItem("token", data.token);

// Save user information
localStorage.setItem("user", JSON.stringify(data.user));

// Clear login fields
setEmail("");
setPassword("");

console.log("Login successful:", data);

// Redirect according to user role
switch (data.user.role) {
  case "intern":
    navigate("/internship-dashboard");
    break;

  case "project_manager":
    navigate("/project-manager-dashboard");
    break;

  case "mentor":
    navigate("/mentor-dashboard");
    break;

  case "program_manager":
    navigate("/program-manager-dashboard");
    break;

  case "super_admin":
    navigate("/super-admin-dashboard");
    break;

  default:
    setError("Invalid user role");
}
    } catch (error) {
      console.error("Login error:", error);

      setError("Unable to connect to server");

      // Clear password if request fails
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-10">

      {/* Background Effects */}
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />

      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-orange-300/30 blur-3xl" />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="rounded-3xl border border-white/70 bg-white/80 p-8 shadow-2xl backdrop-blur-xl sm:p-10">

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
              Internship Management Portal
            </p>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleLogin}
            autoComplete="off"
            className="space-y-5"
          >

            {/* Login Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="animate-shake rounded-xl border border-red-200 bg-red-100 px-4 py-3 text-sm font-medium text-red-600"
              >
                Incorrect email or password, Please try again.
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
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
                  id="login-email"
                  name="login-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
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
                  id="login-password"
                  name="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-blue-900 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>
                {loading ? "Logging in..." : "Login"}
              </span>

              {!loading && (
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              )}
            </button>
          </form>

          {/* Register */}
          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 transition-colors hover:text-blue-800 hover:underline"
            >
              Register
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
}

export default Login;