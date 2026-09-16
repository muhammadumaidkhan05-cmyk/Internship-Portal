import { Link, useLocation } from "react-router-dom";

export function Sidebar({
  navItems,
  bottomItems = [],
  activeMatchers = [],
  open,
  onClose,
  onLogout,
}) {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (href) => {
    if (pathname === href) return true;
    if (
      activeMatchers.includes(href) &&
      pathname?.startsWith(href) &&
      href !== "/" &&
      href !== "/super-admin"
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-white transition-transform duration-200 ease-out lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Primary navigation"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-6">
          <div
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-md font-bold text-white"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",
            }}
          >
            M
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-semibold tracking-wide">
              MSN ACADEMY | IMP
            </div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-white/55">
              Internship Portal
            </div>
          </div>
        </div>

        <div className="mx-5 mb-2 h-px bg-white/10" />

        {/* Primary nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
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
                    className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                      active
                        ? "bg-white/10 text-white"
                        : "text-white/75 hover:bg-white/5 hover:text-white"
                    }`}
                  >
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
                    <Icon size={18} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom: Profile + Logout */}
        {bottomItems.length > 0 && (
          <div className="border-t border-white/10 px-3 py-3">
            <ul className="space-y-1">
              {bottomItems.map((item) => {
                const Icon = item.icon;
                const isLogout = item.label.toLowerCase() === "logout";

                if (isLogout && onLogout) {
                  return (
                    <li key={item.href}>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onLogout();
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition text-[#FCA5A5] hover:bg-red/15 hover:text-white"
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                }

                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                        isLogout
                          ? "text-[#FCA5A5] hover:bg-red/15 hover:text-white"
                          : "text-white/75 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </aside>
    </>
  );
}
