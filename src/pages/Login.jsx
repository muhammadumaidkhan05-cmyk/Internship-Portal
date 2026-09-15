import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

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
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Save user ID separately
      localStorage.setItem(
        "userId",
        data.user._id || data.user.id
      );

      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F6FB] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6 md:p-8">

        <div className="text-center mb-7">
          <p className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
            MSN Internship Portal
          </p>

          <h1 className="text-2xl font-bold text-[#172033] mt-2">
            Welcome Back
          </h1>

          <p className="text-sm text-[#64748B] mt-1">
            Login to access your internship account.
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#172033] mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-[#E2E8F0] rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/15 focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#172033] mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-[#E2E8F0] rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/15 focus:border-[#2563EB]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563EB] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#1D4ED8] transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-[#64748B] mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#2563EB] font-semibold hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;