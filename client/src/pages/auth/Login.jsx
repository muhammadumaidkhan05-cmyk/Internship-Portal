import { useEffect, useState } from "react";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../../services/authApi";
import { LOGIN_ROLE_OPTIONS, ROLES } from "../../lib/roles";

// ============================================================
// LOGIN  (page 1)
// Email, password and a role selector. The selected role is
// verified against the stored role server-side, then the user
// is redirected to that role's dashboard.
// ============================================================

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLES.INTERN);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEmail("");
    setPassword("");
    setError("");
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const { redirectTo } = await login({
        email: email.trim(),
        password,
        role,
      });

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in. Please try again.");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F3F6FB] px-4 py-10">
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#2563EB]/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-[#22D3EE]/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          <div className="absolute inset-x-0 top-0 h-1 gradient-stroke" />

          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#22D3EE] to-[#DC2626] text-3xl font-bold text-white shadow-lg shadow-[#2563EB]/25">
              M
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#172033]">
              MSN Academy
            </h1>

            <p className="mt-2 text-sm text-[#64748B]">
              Internship Management Portal
            </p>
          </div>

          <form onSubmit={handleLogin} autoComplete="off" className="space-y-5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-[#DC2626]">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="mb-2 block text-sm font-medium text-[#172033]"
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]"
                />

                <input
                  id="login-email"
                  name="login-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="off"
                  required
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white py-3.5 pl-11 pr-4 text-sm text-[#172033] outline-none transition-all duration-300 placeholder:text-[#94A3B8] focus:border-transparent focus:ring-2 focus:ring-[#2563EB]/50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="mb-2 block text-sm font-medium text-[#172033]"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]"
                />

                <input
                  id="login-password"
                  name="login-password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white py-3.5 pl-11 pr-4 text-sm text-[#172033] outline-none transition-all duration-300 placeholder:text-[#94A3B8] focus:border-transparent focus:ring-2 focus:ring-[#2563EB]/50"
                />
              </div>
            </div>

            {/* Role selector */}
            <div>
              <label
                htmlFor="login-role"
                className="mb-2 block text-sm font-medium text-[#172033]"
              >
                Sign in as
              </label>

              <div className="relative">
                <ShieldCheck
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]"
                />

                <select
                  id="login-role"
                  name="login-role"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-[#E2E8F0] bg-white py-3.5 pl-11 pr-4 text-sm text-[#172033] outline-none transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-[#2563EB]/50"
                >
                  {LOGIN_ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-[#2563EB] transition-colors hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#0B2345] py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#2563EB] hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>{loading ? "Signing in..." : "Login"}</span>

              {!loading && (
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#64748B]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#2563EB] transition-colors hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
