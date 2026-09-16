import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { useSignOut } from "../../api/useAuth";

export function AppShell({ navItems, bottomItems, navbar, children }) {
  const [open, setOpen] = useState(false);
  const { mutate: signOut } = useSignOut();

  return (
    <div className="flex min-h-screen bg-[#F3F6FB]">
      <Sidebar
        navItems={navItems}
        bottomItems={bottomItems}
        open={open}
        onClose={() => setOpen(false)}
        activeMatchers={navItems.map((n) => n.href)}
        onLogout={() => signOut()}
      />

      <div className="flex min-w-0 flex-1 flex-col">
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
          onOpenSidebar={() => setOpen(true)}
        />

        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">{children}</main>
      </div>
    </div>
  );
}
