import React, { useCallback, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, LogOut, Menu, Search, User, X } from "lucide-react";

import { getNavItems } from "../../lib/navigation";
import { ROLES } from "../../lib/roles";
import { getStoredUser, clearSession } from "../../lib/session";
import { getNotifications } from "../../services/internApi";

// ============================================================
// INTERN LAYOUT
// The shell from the intern branch, with its menu now read from
// the shared navigation configuration instead of being declared
// inline, and its notification badge driven by the unified API.
// ============================================================

function InternLayout() {
  const navigate = useNavigate();

  const menuItems = getNavItems(ROLES.INTERN);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const user = getStoredUser() || { name: "Intern", role: ROLES.INTERN };

  const loadUnreadCount = useCallback(async () => {
    try {
      const { unreadCount: count } = await getNotifications();
      setUnreadCount(count);
    } catch {
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    loadUnreadCount();

    // Refresh the badge when other pages report a change.
    const handler = () => loadUnreadCount();

    window.addEventListener("intern:notifications-changed", handler);

    return () =>
      window.removeEventListener("intern:notifications-changed", handler);
  }, [loadUnreadCount]);

  const handleLogout = () => {
    clearSession();
    setProfileMenuOpen(false);
    setSidebarOpen(false);
    navigate("/login", { replace: true });
  };

  const handleSearch = (event) => {
    if (event.key !== "Enter") return;

    const query = searchQuery.trim().toLowerCase();

    if (!query) return;

    const matched = menuItems.find((item) =>
      item.name.toLowerCase().includes(query)
    );

    if (matched) {
      navigate(matched.path);
      setSearchQuery("");
    }
  };

  const initial = user.name?.charAt(0).toUpperCase() || "I";

  return (
    <div className="flex min-h-screen bg-[#071426] text-white">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ===============================
          SIDEBAR
      =============================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] transform flex-col overflow-hidden border-r border-white/10 bg-gradient-to-b from-[#0B2345]/95 via-[#081426]/95 to-[#050d1a]/95 text-white backdrop-blur-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-full w-[3px] bg-gradient-to-b from-[#22D3EE] via-[#2563EB] to-[#DC2626]" />

        <div className="relative border-b border-white/10 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#22D3EE] via-[#2563EB] to-[#DC2626] text-xl font-bold shadow-lg shadow-cyan-500/20">
              M
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-wide">MSN Academy</h1>
              <p className="mt-0.5 text-xs text-white/50">Internship Portal</p>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="ml-auto text-white/70 hover:text-white lg:hidden"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="relative flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-3 text-[10px] font-semibold tracking-[0.18em] text-cyan-300/60">
            INTERNSHIP PORTAL
          </p>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <SidebarLink
                key={item.path}
                item={item}
                onClick={() => setSidebarOpen(false)}
                unreadCount={unreadCount}
              />
            ))}
          </nav>
        </div>

        <div className="relative border-t border-white/10 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl border border-red-400/10 px-4 py-3 text-sm text-red-300 transition-all duration-300 hover:bg-red-500/10 hover:text-red-200"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ===============================
          MAIN
      =============================== */}

      <div className="min-w-0 flex-1">
        <header className="relative flex h-[82px] items-center justify-between border-b border-white/10 bg-[#0B2345]/90 px-4 text-white backdrop-blur-xl md:px-6 lg:px-8">
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#DC2626]" />

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 transition hover:bg-white/10 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-cyan-300">
                MSN ACADEMY
              </p>
              <h1 className="text-lg font-bold md:text-xl">Internship Portal</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 transition-all focus-within:border-cyan-400/60 focus-within:bg-white/[0.09] md:flex">
              <Search size={16} className="text-cyan-300/70" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search pages..."
                className="w-32 bg-transparent px-2 text-sm text-white outline-none placeholder:text-white/40 lg:w-48"
              />
            </div>

            <Link
              to="/intern/notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] transition-all hover:border-cyan-400/30 hover:bg-cyan-400/10"
            >
              <Bell size={18} />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#DC2626] px-1 text-[9px] font-bold">
                  {unreadCount}
                </span>
              )}
            </Link>

            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((open) => !open)}
                className="group ml-1 flex cursor-pointer items-center gap-2"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#22D3EE] via-[#2563EB] to-[#DC2626] text-sm font-bold">
                  {initial}
                </div>

                <div className="hidden text-left md:block">
                  <p className="text-xs font-medium leading-tight">{user.name}</p>
                  <p className="text-[10px] leading-tight text-white/50">Intern</p>
                </div>

                <ChevronDown
                  size={16}
                  className={`text-white/40 transition group-hover:text-white ${
                    profileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileMenuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setProfileMenuOpen(false)}
                    className="fixed inset-0 z-40"
                  />

                  <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-white/10 bg-[#0E2A52] py-2 text-white shadow-2xl">
                    <div className="border-b border-white/10 px-4 py-3">
                      <p className="text-sm font-semibold">{user.name}</p>

                      {user.email && (
                        <p className="mt-1 truncate text-xs text-white/50">
                          {user.email}
                        </p>
                      )}

                      <p className="mt-1 text-xs text-cyan-300/70">Intern</p>
                    </div>

                    <Link
                      to="/intern/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm transition hover:bg-white/10"
                    >
                      <User size={15} />
                      My Profile
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-300 transition hover:bg-red-500/10"
                    >
                      <LogOut size={15} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="portal-main min-h-[calc(100vh-82px)] bg-[#F3F6FB] p-4 text-[#172033] md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ item, onClick, unreadCount }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.end}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl border px-3.5 py-3 text-sm transition-all duration-300 ${
          isActive
            ? "border-cyan-300/30 bg-gradient-to-r from-[#22D3EE]/20 via-[#2563EB]/20 to-[#DC2626]/20 text-white shadow-lg shadow-cyan-500/5"
            : "border-transparent text-white/60 hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            className={
              isActive ? "text-cyan-300" : "text-white/50 group-hover:text-cyan-300"
            }
          />

          <span>{item.name}</span>

          {item.name === "Notifications" && unreadCount > 0 && (
            <span className="ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#DC2626] px-1 text-[9px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export default InternLayout;
