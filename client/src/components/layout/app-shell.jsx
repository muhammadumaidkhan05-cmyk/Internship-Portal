import { useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { useSignOut } from "../../api/useAuth";

const COLLAPSED_KEY = "msn_sidebar_collapsed";

function getInitialCollapsed() {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === "true";
  } catch {
    return false;
  }
}

export function AppShell({ navItems, bottomItems, navbar, children }) {
  const location = useLocation();

  // Mobile: open/close drawer
  const [open, setOpen] = useState(false);
  // Desktop: collapse to icon rail — persisted across refreshes
  const [collapsed, setCollapsed] = useState(getInitialCollapsed);

  const { mutate: signOut } = useSignOut();

  const handleToggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSED_KEY, String(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  const handleCloseMobile = useCallback(() => setOpen(false), []);
  const handleOpenMobile = useCallback(() => setOpen(true), []);

  return (
    <div className="flex min-h-screen bg-[#F3F6FB]">
      <Sidebar
        navItems={navItems}
        bottomItems={bottomItems}
        open={open}
        onClose={handleCloseMobile}
        activeMatchers={navItems.map((n) => n.href)}
        onLogout={() => signOut()}
        collapsed={collapsed}
      />

      {/*
        Main content area:
        - Transitions width alongside the sidebar so content never overlaps.
        - On mobile the sidebar is fixed/overlay so no offset needed (handled by lg: classes).
      */}
      <div
        className={`
          flex min-w-0 flex-1 flex-col
          transition-[margin] duration-200 ease-out
        `}
      >
        <Navbar
          eyebrow={navbar.eyebrow}
          title={navbar.title}
          subtitle={navbar.subtitle}
          userName={navbar.userName}
          userRoleLabel={navbar.userRoleLabel}
          userInitial={navbar.userInitial}
          notificationCount={navbar.notificationCount}
          searchPlaceholder={navbar.searchPlaceholder}
          notificationsHref={navbar.notificationsHref}
          rightSlot={navbar.rightSlot}
          onOpenSidebar={handleOpenMobile}
          sidebarCollapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
        />

        {/* Adding key={location.pathname} forces React to remount the main content
            on route change, triggering the premium-page animation (fade & slide up) */}
        <main
          key={location.pathname}
          className="premium-page flex-1 px-4 py-5 sm:px-6 sm:py-6"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
