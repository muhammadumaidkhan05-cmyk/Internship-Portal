import React, { useState } from "react";

import {
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { getNavItems } from "../../lib/navigation";
import { ROLES } from "../../lib/roles";


import { clearSession } from "../../lib/session";
import {
  LayoutDashboard,
  ClipboardCheck,
  BarChart3,
  Bell,
  UserCircle,
  LogOut,
  X,
} from "lucide-react";

// ============================================================
// NAVIGATION ITEMS
// ============================================================

// Sourced from the shared role navigation configuration so the
// sidebar for every role is declared in exactly one place.
// Profile is rendered separately in the footer below.
const navigationItems = getNavItems(ROLES.MENTOR).filter(
  (item) => item.name !== "Profile"
);

// ============================================================
// COMPONENT
// ============================================================

function MentorSidebar({ sidebarOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = () => {
    clearSession();

    if (onClose) {
      onClose();
    }

    navigate("/mentor/logout", { replace: true });
  };

  return (
    <>
      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-64
          overflow-hidden
          bg-[#0B2345]
          text-white
          shadow-[8px_0_30px_rgba(11,35,69,0.18)]
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-red-500 via-blue-500 to-cyan-400 opacity-90" />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-red-500 via-blue-500 to-cyan-400 opacity-90" />

        {/* BRAND */}

        <div className="relative flex h-20 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 via-blue-500 to-cyan-400 p-[2px] shadow-lg shadow-blue-500/10">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0B2345]">
                <span className="bg-gradient-to-br from-red-400 via-blue-400 to-cyan-300 bg-clip-text text-lg font-extrabold text-transparent">
                  M
                </span>
              </div>
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-[15px] font-bold tracking-wide text-white">
                MSN Academy
              </h1>

              <p className="truncate text-[10px] font-medium uppercase tracking-[0.16em] text-blue-200">
                Internship Portal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-blue-200 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* NAVIGATION */}

        <nav className="relative flex flex-col gap-2 px-3 py-5">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            const isDashboard = item.path === "/mentor";

            const isActive = isDashboard
              ? location.pathname === "/mentor" ||
                location.pathname === "/mentor/dashboard"
              : location.pathname === item.path ||
                location.pathname.startsWith(`${item.path}/`);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="group relative block"
              >
                <div
                  className={[
                    "relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-sm font-medium",
                    "transition-all duration-300",
                    isActive
                      ? "text-white"
                      : "text-blue-100 hover:text-white",
                  ].join(" ")}
                >
                  {isActive && (
                    <>
                      <span className="absolute inset-0 rounded-xl bg-white/[0.08] backdrop-blur-md" />

                      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/[0.14] via-blue-500/[0.12] to-cyan-400/[0.14]" />

                      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 via-blue-500 to-cyan-400 p-[1px] opacity-95">
                        <span className="block h-full w-full rounded-[11px] bg-[#12345D]/70 backdrop-blur-md" />
                      </span>

                      <span className="absolute inset-[1px] rounded-[11px] border border-white/[0.10]" />

                      <span className="pointer-events-none absolute inset-0 rounded-xl shadow-[0_6px_22px_rgba(37,99,235,0.18)]" />

                      <span className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-red-500 via-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.35)]" />
                    </>
                  )}

                  {!isActive && (
                    <span className="absolute inset-0 rounded-xl bg-white/[0.035] opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100" />
                  )}

                  <Icon
                    size={19}
                    strokeWidth={2}
                    className={[
                      "relative z-10 shrink-0 transition-all duration-300",
                      isActive
                        ? "text-white"
                        : "text-blue-200 group-hover:text-white",
                    ].join(" ")}
                  />

                  <span className="relative z-10">{item.name}</span>

                  {isActive && (
                    <span className="relative z-10 ml-auto h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                  )}
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* BOTTOM SECTION */}

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-3">
          <NavLink
            to="/mentor/profile"
            onClick={onClose}
            className="group relative block"
          >
            {({ isActive }) => (
              <div
                className={[
                  "relative mb-2 flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-sm font-medium",
                  "transition-all duration-300",
                  isActive
                    ? "text-white"
                    : "text-blue-100 hover:text-white",
                ].join(" ")}
              >
                {isActive && (
                  <>
                    <span className="absolute inset-0 rounded-xl bg-white/[0.08] backdrop-blur-md" />

                    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/[0.14] via-blue-500/[0.12] to-cyan-400/[0.14]" />

                    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 via-blue-500 to-cyan-400 p-[1px] opacity-95">
                      <span className="block h-full w-full rounded-[11px] bg-[#12345D]/70 backdrop-blur-md" />
                    </span>

                    <span className="absolute inset-[1px] rounded-[11px] border border-white/[0.10]" />

                    <span className="pointer-events-none absolute inset-0 rounded-xl shadow-[0_6px_22px_rgba(37,99,235,0.18)]" />

                    <span className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-red-500 via-blue-500 to-cyan-400" />
                  </>
                )}

                {!isActive && (
                  <span className="absolute inset-0 rounded-xl bg-white/[0.035] opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100" />
                )}

                <span
                  className={[
                    "relative z-10 flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300",
                    isActive
                      ? "bg-gradient-to-br from-red-500/30 via-blue-500/25 to-cyan-400/30 text-white"
                      : "bg-white/[0.05] text-blue-200 group-hover:bg-white/[0.09] group-hover:text-cyan-300",
                  ].join(" ")}
                >
                  <UserCircle size={19} />
                </span>

                <span className="relative z-10">Profile</span>
              </div>
            )}
          </NavLink>

          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-sm font-medium text-red-200 transition-all duration-300 hover:text-red-100"
          >
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/10 via-red-400/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400 transition-all duration-300 group-hover:bg-red-500/15 group-hover:text-red-300">
              <LogOut size={18} />
            </span>

            <span className="relative z-10">Logout</span>
          </button>
        </div>
      </aside>

      {/* LOGOUT CONFIRMATION */}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111418] p-6 shadow-2xl">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
              <LogOut size={25} className="text-red-400" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-white">
                Logout
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Are you sure you want to logout from your Mentor
                account?
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-xl border border-[#343941] bg-[#191C20] px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-[#202328] hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MentorSidebar;
