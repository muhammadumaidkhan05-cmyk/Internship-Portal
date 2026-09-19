import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

import { homeForStoredRole, getStoredRole } from "../lib/session";
import { ROLE_LABELS } from "../lib/roles";

// ============================================================
// UNAUTHORIZED
// Shown when a signed-in user reaches a page their role cannot
// open through a link rather than a guarded route.
// ============================================================

function Unauthorized() {
  const role = getStoredRole();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F6FB] px-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 gradient-stroke" />

        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FEF2F2]">
          <ShieldAlert size={26} className="text-[#DC2626]" />
        </div>

        <h1 className="text-2xl font-bold text-[#172033]">Access Denied</h1>

        <p className="mt-2 text-sm text-[#64748B]">
          {role
            ? `Your ${ROLE_LABELS[role] || role} account does not have permission to open this page.`
            : "You need to sign in to open this page."}
        </p>

        <Link
          to={homeForStoredRole()}
          className="mt-6 inline-block w-full rounded-xl bg-[#2563EB] py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
        >
          Back to my dashboard
        </Link>
      </div>
    </div>
  );
}

export default Unauthorized;
