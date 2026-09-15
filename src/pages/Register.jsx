import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.name ||
      !form.email ||
      !form.password
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            phone: form.phone,
            department: "Full Stack Development",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed"
        );
      }

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F6FB] flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6 md:p-8">

        <div className="text-center mb-7">
          <p className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
            MSN Internship Portal
          </p>

          <h1 className="text-2xl font-bold text-[#172033] mt-2">
            Create Account
          </h1>

          <p className="text-sm text-[#64748B] mt-1">
            Register your internship portal account.
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl px-4 py-3 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-[#172033] mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border border-[#E2E8F0] rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/15 focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#172033] mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-[#E2E8F0] rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/15 focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#172033] mb-2">
              Phone Number
            </label>

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="03xx-xxxxxxx"
              className="w-full border border-[#E2E8F0] rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/15 focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#172033] mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              className="w-full border border-[#E2E8F0] rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/15 focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#172033] mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className="w-full border border-[#E2E8F0] rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/15 focus:border-[#2563EB]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563EB] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#1D4ED8] transition disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <p className="text-center text-sm text-[#64748B] mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#2563EB] font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;