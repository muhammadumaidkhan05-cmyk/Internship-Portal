
import React from "react";
import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  UsersRound,
  UserRoundCheck,
  FolderKanban,
  BarChart3,
  Bell,
  UserCircle,
  LogOut,
} from "lucide-react";

// ============================================================
// NAVIGATION ITEMS
// ============================================================

const navigationItems = [
  {
    name: "Dashboard",
    path: "/program-manager",
    icon: LayoutDashboard,
  },
  {
    name: "Cohorts",
    path: "/program-manager/cohorts",
    icon: UsersRound,
  },
  {
    name: "Mentors",
    path: "/program-manager/mentors",
    icon: UserRoundCheck,
  },
  {
    name: "Projects Management",
    path: "/program-manager/projects",
    icon: FolderKanban,
  },
  {
    name: "Announcements",
    path: "/program-manager/announcements",
    icon: Bell,
  },
  {
    name: "Notifications",
    path: "/program-manager/notifications",
    icon: Bell,
  },
  {
    name: "Reports",
    path: "/program-manager/reports",
    icon: BarChart3,
  },
];

// ============================================================
// COMPONENT
// ============================================================

function ProgramManagerSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 overflow-hidden bg-[#0B2345] lg:block">

      {/* =========================
          SIDEBAR EDGE GRADIENT
      ========================== */}

      <div className="pointer-events-none absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-red-500 via-blue-500 to-cyan-400 opacity-90" />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-red-500 via-blue-500 to-cyan-400 opacity-90" />

      {/* =========================
          BRAND
      ========================== */}

      <div className="relative flex h-20 items-center gap-3 border-b border-white/10 px-5">

        {/* M Logo */}

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 via-blue-500 to-cyan-400 p-[2px] shadow-lg shadow-blue-500/10">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0B2345]">
            <span className="bg-gradient-to-br from-red-400 via-blue-400 to-cyan-300 bg-clip-text text-lg font-extrabold text-transparent">
              M
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-base font-bold text-white">
            MSN Academy
          </h2>

          <p className="truncate text-xs text-blue-200">
            Internship Portal
          </p>
        </div>
      </div>

      {/* =========================
          NAVIGATION
      ========================== */}

      <nav className="relative flex flex-col gap-2 px-3 py-5">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          /*
            Dashboard active on both:
            /program-manager
            /program-manager/dashboard
          */

          const isDashboard =
            item.name === "Dashboard";

          const isActive = isDashboard
            ? location.pathname ===
                "/program-manager" ||
              location.pathname ===
                "/program-manager/dashboard"
            : location.pathname === item.path ||
              location.pathname.startsWith(
                `${item.path}/`
              );

          return (
            <NavLink
              key={item.path}
              to={item.path}
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

                {/* =========================
                    ACTIVE GLASS BACKGROUND
                ========================== */}

                {isActive && (
                  <>
                    {/* Glass base */}

                    <span className="absolute inset-0 rounded-xl bg-white/[0.08] backdrop-blur-md" />

                    {/* Red Blue Cyan glass tint */}

                    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/[0.14] via-blue-500/[0.12] to-cyan-400/[0.14]" />

                    {/* Gradient border */}

                    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 via-blue-500 to-cyan-400 p-[1px]">
                      <span className="block h-full w-full rounded-[11px] bg-[#12345D]/70 backdrop-blur-md" />
                    </span>

                    {/* Glass highlight */}

                    <span className="absolute inset-[1px] rounded-[11px] border border-white/[0.10]" />

                    {/* Soft glow */}

                    <span className="pointer-events-none absolute inset-0 rounded-xl shadow-[0_6px_22px_rgba(37,99,235,0.18)]" />

                    {/* Left gradient accent */}

                    <span className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-red-500 via-blue-500 to-cyan-400" />
                  </>
                )}

                {/* Hover */}

                {!isActive && (
                  <span className="absolute inset-0 rounded-xl bg-white/[0.035] opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100" />
                )}

                {/* Icon */}

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

                {/* Text */}

                <span className="relative z-10">
                  {item.name}
                </span>
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* =========================
          BOTTOM SECTION
      ========================== */}

      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-3">

        {/* =========================
            PROFILE
        ========================== */}

        <NavLink
          to="/program-manager/profile"
          className="group relative block"
        >
          <div
            className={[
              "relative mb-2 flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
              location.pathname ===
                "/program-manager/profile"
                ? "text-white"
                : "text-blue-100 hover:text-white",
            ].join(" ")}
          >

            {location.pathname ===
              "/program-manager/profile" && (
              <>
                <span className="absolute inset-0 rounded-xl bg-white/[0.08] backdrop-blur-md" />

                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/[0.14] via-blue-500/[0.12] to-cyan-400/[0.14]" />

                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 via-blue-500 to-cyan-400 p-[1px]">
                  <span className="block h-full w-full rounded-[11px] bg-[#12345D]/70 backdrop-blur-md" />
                </span>

                <span className="absolute inset-[1px] rounded-[11px] border border-white/[0.10]" />

                <span className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-red-500 via-blue-500 to-cyan-400" />
              </>
            )}

            <UserCircle
              size={19}
              className="relative z-10 shrink-0"
            />

            <span className="relative z-10">
              Profile
            </span>
          </div>
        </NavLink>

        {/* =========================
            LOGOUT
        ========================== */}

        <button
          type="button"
          onClick={() =>
            navigate("/program-manager/logout")
          }
          className="group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-sm font-medium text-red-200 transition-all duration-300 hover:bg-red-500/10 hover:text-red-100"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-400/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <LogOut
            size={19}
            className="relative z-10 shrink-0"
          />

          <span className="relative z-10">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

export default ProgramManagerSidebar;

