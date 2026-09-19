import { Link, useLocation } from "react-router-dom";

export function Sidebar({
  navItems,
  bottomItems = [],
  activeMatchers = [],
  open,
  onClose,
  onLogout,
  collapsed,
}) {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (href) => {
    if (pathname === href) return true;
    if (
      activeMatchers.includes(href) &&
      pathname?.startsWith(href) &&
      href !== "/" &&
      href !== "/admin/dashboard"
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      {/* ── Mobile backdrop ──────────────────────────────────────────── */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden
      />

      {/* ── Sidebar panel ────────────────────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar text-white
          transition-[transform,width] duration-200 ease-out
          lg:sticky lg:top-0 lg:h-screen lg:self-start lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
          ${collapsed ? "lg:w-[68px]" : "lg:w-64"}
          w-64
        `}
        aria-label="Primary navigation"
      >
        {/* ── Logo ─────────────────────────────────────────────────── */}
        <div
          className={`flex shrink-0 items-center gap-3 px-4 pt-5 pb-4 transition-all duration-200 ${
            collapsed ? "lg:justify-center lg:px-0" : ""
          }`}
        >
          <div
            aria-hidden
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md font-bold text-white"
            style={{
              backgroundImage: "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",
            }}
          >
            M
          </div>
          <div
            className={`leading-tight transition-all duration-200 ${
              collapsed ? "lg:hidden" : ""
            }`}
          >
            <div className="whitespace-nowrap text-[15px] font-semibold tracking-wide">
              MSN ACADEMY | IMP
            </div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-white/55">
              Internship Portal
            </div>
          </div>
        </div>

        <div className="mx-4 mb-2 h-px shrink-0 bg-white/10" />

        {/* ── Primary nav — THIS IS THE ONLY SCROLLABLE ZONE ───────── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? item.label : undefined}
                    className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                      collapsed ? "lg:justify-center lg:px-0" : ""
                    } ${
                      active
                        ? "bg-white/10 text-white"
                        : "text-white/75 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {/* Active indicator bar */}
                    {active && (
                      <span
                        aria-hidden
                        className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full"
                        style={{
                          backgroundImage:
                            "linear-gradient(180deg, #2563EB 0%, #22D3EE 100%)",
                        }}
                      />
                    )}

                    <Icon size={18} className="shrink-0" />

                    <span
                      className={`truncate transition-all duration-200 ${
                        collapsed ? "lg:hidden" : ""
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Tooltip when collapsed on desktop */}
                    {collapsed && (
                      <span
                        aria-hidden
                        className="
                          pointer-events-none absolute left-full ml-3 hidden
                          whitespace-nowrap rounded-md bg-[#172033] px-2.5 py-1.5
                          text-xs font-semibold text-white opacity-0 shadow-lg
                          transition-opacity duration-150
                          group-hover:opacity-100 lg:block
                        "
                      >
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Bottom items — PINNED TO BOTTOM, never scrolls ───────── */}
        {bottomItems.length > 0 && (
          <div className="shrink-0 border-t border-white/10 px-2 py-3">
            <ul className="space-y-1">
              {bottomItems.map((item) => {
                const Icon = item.icon;
                const isLogout = item.label.toLowerCase() === "logout";

                if (isLogout && onLogout) {
                  return (
                    <li key={item.href}>
                      <button
                        type="button"
                        title={collapsed ? item.label : undefined}
                        onClick={() => {
                          onClose();
                          onLogout();
                        }}
                        className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition text-[#FCA5A5] hover:bg-white/5 hover:text-red-300 ${
                          collapsed ? "lg:justify-center lg:px-0" : ""
                        }`}
                      >
                        <Icon size={18} className="shrink-0" />
                        <span
                          className={`transition-all duration-200 ${
                            collapsed ? "lg:hidden" : ""
                          }`}
                        >
                          {item.label}
                        </span>
                        {collapsed && (
                          <span
                            aria-hidden
                            className="
                              pointer-events-none absolute left-full ml-3 hidden
                              whitespace-nowrap rounded-md bg-[#172033] px-2.5 py-1.5
                              text-xs font-semibold text-white opacity-0 shadow-lg
                              transition-opacity duration-150
                              group-hover:opacity-100 lg:block
                            "
                          >
                            {item.label}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                }

                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={onClose}
                      title={collapsed ? item.label : undefined}
                      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                        collapsed ? "lg:justify-center lg:px-0" : ""
                      } ${
                        isLogout
                          ? "text-[#FCA5A5] hover:bg-white/5 hover:text-red-300"
                          : "text-white/75 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon size={18} className="shrink-0" />
                      <span
                        className={`transition-all duration-200 ${
                          collapsed ? "lg:hidden" : ""
                        }`}
                      >
                        {item.label}
                      </span>
                      {collapsed && (
                        <span
                          aria-hidden
                          className="
                            pointer-events-none absolute left-full ml-3 hidden
                            whitespace-nowrap rounded-md bg-[#172033] px-2.5 py-1.5
                            text-xs font-semibold text-white opacity-0 shadow-lg
                            transition-opacity duration-150
                            group-hover:opacity-100 lg:block
                          "
                        >
                          {item.label}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {/* ── NO collapse button here — use the navbar toggle instead ─ */}
      </aside>
    </>
  );
}
