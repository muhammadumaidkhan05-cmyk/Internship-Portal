import { Link } from "react-router-dom";
import { IconBell, IconSearch, IconMenu } from "../shared/icons";

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
  rightSlot,
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#E2E8F0] bg-white">
      {/* Top dark bar */}
      <div className="flex items-center gap-3 bg-[#0E2A52] px-4 py-3 text-white sm:px-6">
        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={onOpenSidebar}
          className="grid h-9 w-9 place-items-center rounded-md text-white/80 hover:bg-white/10 hover:text-white lg:hidden"
        >
          <IconMenu size={20} />
        </button>

        <div className="flex items-center gap-2.5">
          <div
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-md text-sm font-bold"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",
            }}
          >
            M
          </div>
          <div className="text-sm font-semibold tracking-wide sm:text-[15px]">
            MSN ACADEMY | IMP
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {rightSlot}

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

          <div className="hidden items-center gap-2 sm:flex">
            <div className="text-right text-[11px] leading-tight">
              <div className="font-semibold text-white/90">{userRoleLabel}</div>
              <div className="text-white/55">{userName}</div>
            </div>
            <div
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-full text-sm font-bold"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",
              }}
            >
              {userInitial}
            </div>
          </div>
        </div>
      </div>

      {/* White content strip: eyebrow, title, subtitle, search */}
      <div className="flex flex-col gap-3 px-4 pt-5 pb-4 sm:px-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0891B2]">
            {eyebrow}
          </div>
          <h1 className="mt-1 text-[22px] font-semibold leading-tight text-[#172033] sm:text-2xl">
            {title}
          </h1>
          <p className="mt-0.5 text-sm text-[#64748B]">{subtitle}</p>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
            <IconSearch size={16} />
          </span>
          <input
            type="search"
            placeholder={searchPlaceholder}
            aria-label="Search"
            className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white pl-9 pr-3 text-sm text-[#172033] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
          />
        </div>
      </div>
    </header>
  );
}
