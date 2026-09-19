
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { clearSession } from "../../lib/session";
import {
  CheckCircle2,
  LogOut,
} from "lucide-react";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all session keys used by this app
    clearSession();

    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#071426] flex items-center justify-center px-4">
      <div className="relative w-full max-w-md rounded-2xl p-px bg-linear-to-r from-red-500 via-blue-500 to-cyan-400 shadow-2xl">
        <div className="rounded-2xl bg-[#111418] px-8 py-10 text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10">
            <CheckCircle2
              size={32}
              className="text-green-400"
            />
          </div>

          <h1 className="text-2xl font-bold text-white">
            Successfully Logged Out
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            You have been securely logged out from the
            Project Manager module.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-300">
            <LogOut
              size={17}
              className="text-red-400"
            />
            Your session has ended.
          </div>

        </div>
      </div>
    </div>
  );
}

export default Logout;

