import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

import { homeForStoredRole, isAuthenticated } from "../lib/session";

// ============================================================
// 404
// ============================================================

function NotFound() {
  const target = isAuthenticated() ? homeForStoredRole() : "/login";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F6FB] px-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 gradient-stroke" />

        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF6FF]">
          <Compass size={26} className="text-[#2563EB]" />
        </div>

        <h1 className="text-3xl font-bold text-[#172033]">404</h1>

        <p className="mt-2 text-sm text-[#64748B]">
          We could not find the page you were looking for.
        </p>

        <Link
          to={target}
          className="mt-6 inline-block w-full rounded-xl bg-[#2563EB] py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
        >
          {isAuthenticated() ? "Back to my dashboard" : "Go to sign in"}
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
