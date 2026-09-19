
import React from "react";
import { useNavigate } from "react-router-dom";

import { clearSession } from "../../lib/session";
import {
  ShieldAlert,
  ArrowLeft,
  LogOut,
} from "lucide-react";

function Logout() {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/program-manager/dashboard", {
      replace: true,
    });
  };

  const handleLogout = () => {
    // Clear all session keys used by this app
    clearSession();

    // Navigate to sign-in
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F6FB] p-4">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-2xl border border-white bg-white/95 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">

          {/* Accent */}
          <div className="h-1 w-full bg-gradient-to-r from-red-500 via-blue-500 to-cyan-400" />

          <div className="p-7 text-center sm:p-9">

            {/* Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-600">
              <ShieldAlert size={30} />
            </div>

            {/* Heading */}
            <h1 className="mt-5 text-2xl font-black text-[#172033]">
              Confirm Logout
            </h1>

            {/* Message */}
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Are you sure you want to log out of your
              Program Manager account?
            </p>

            {/* Actions */}
            <div className="mt-7 grid gap-3 sm:grid-cols-2">

              {/* Stay Logged In */}
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
              >
                <ArrowLeft size={17} />
                Stay Logged In
              </button>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-black text-white shadow-[0_10px_25px_rgba(220,38,38,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-700"
              >
                <LogOut size={17} />
                Logout
              </button>

            </div>

            {/* Security note */}
            <div className="mt-6 text-xs text-slate-400">
              Your session will be securely ended.
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Logout;

