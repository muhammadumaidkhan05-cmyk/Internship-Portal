import { Link } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { IconBell, IconSearch, IconMenu } from "../shared/icons";
import { GlobalSearch } from "./global-search";

export function Navbar({
  eyebrow,
  title,
  subtitle,
  userName,
  userRoleLabel,
  userInitial,
  notificationCount = 0,
  searchPlaceholder = "Search...",
  notificationsHref = "/super-admin/notifications",
  onOpenSidebar,
  onToggleCollapse,
  sidebarCollapsed,
  rightSlot,
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#E2E8F0] bg-white">
      {/* ── Top dark bar ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 bg-[#0E2A52] px-4 py-3 text-white sm:gap-3 sm:px-6">

        {/* Mobile hamburger — opens the slide-in drawer */}
        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={onOpenSidebar}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-white/80 hover:bg-white/10 hover:text-white transition-colors lg:hidden"
        >
          <IconMenu size={20} />
        </button>

        {/* Desktop sidebar collapse/expand toggle */}
        <button
          type="button"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={onToggleCollapse}
          className="hidden lg:grid h-9 w-9 shrink-0 place-items-center rounded-md text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          {sidebarCollapsed
            ? <PanelLeftOpen size={18} />
            : <PanelLeftClose size={18} />
          }
        </button>

        {/* Brand mark */}
        <div className="flex items-center gap-2.5">
          <div
            aria-hidden
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-sm font-bold"
            style={{
              backgroundImage: "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",
            }}
          >
            M
          </div>
          <div className="text-sm font-semibold tracking-wide sm:text-[15px] whitespace-nowrap">
            MSN ACADEMY | IMP
          </div>
        </div>

        {/* Right-side controls */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {rightSlot}

          {/* Notifications bell */}
          <Link
            to={notificationsHref}
            aria-label="Notifications"
            className="relative grid h-9 w-9 place-items-center rounded-md text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <IconBell size={18} />
            {notificationCount > 0 && (
              <span
                aria-label={`${notificationCount} unread notifications`}
                className="absolute -top-0.5 -right-0.5 grid h-4 min-w-[16px] place-items-center rounded-full bg-[#F59E0B] px-1 text-[10px] font-bold text-[#172033]"
              >
                {notificationCount}
              </span>
            )}
          </Link>

          {/* User identity — desktop */}
          <div className="hidden items-center gap-2 sm:flex">
            <div className="text-right text-[11px] leading-tight">
              <div className="font-semibold text-white/90">{userRoleLabel}</div>
              <div className="text-white/55">{userName}</div>
            </div>
            <div
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-full text-sm font-bold shrink-0"
              style={{
                backgroundImage: "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",
              }}
            >
              {userInitial}
            </div>
          </div>
        </div>
      </div>

      {/* ── White content strip: eyebrow / title / subtitle / search ── */}
      <div className="flex flex-col gap-3 px-4 pt-5 pb-4 sm:px-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0891B2]">
            {eyebrow}
          </div>
          <h1 className="mt-1 truncate text-[22px] font-semibold leading-tight text-[#172033] sm:text-2xl">
            {title}
          </h1>
          <p className="mt-0.5 text-sm text-[#64748B] line-clamp-1">{subtitle}</p>
        </div>

        {/* Global search */}
        <GlobalSearch placeholder={searchPlaceholder} />
      </div>
    </header>
  );
}
