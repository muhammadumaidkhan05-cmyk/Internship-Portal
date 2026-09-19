import {
  LayoutDashboard,
  ClipboardCheck,
  CalendarCheck,
  FolderKanban,
  Upload,
  Award,
  Bell,
  User,
  Users,
  ListChecks,
  MessageSquare,
  GraduationCap,
  Layers,
  ShieldCheck,
} from "lucide-react";

import { ROLES, normalizeRole } from "./roles";

// ============================================================
// NAVIGATION CONFIGURATION
// One source of truth for the sidebar of every role. Layouts
// read from here instead of each page hard-coding its own menu.
// ============================================================

export const NAVIGATION = {
  [ROLES.INTERN]: {
    label: "Internship Portal",
    basePath: "/intern",
    items: [
      { name: "Dashboard", path: "/intern/dashboard", icon: LayoutDashboard },
      { name: "Daily Scrum", path: "/intern/daily-scrum", icon: ClipboardCheck },
      { name: "Attendance", path: "/intern/attendance", icon: CalendarCheck },
      { name: "My Projects", path: "/intern/projects", icon: FolderKanban },
      { name: "Submissions", path: "/intern/submissions", icon: Upload },
      { name: "Certificates", path: "/intern/certificates", icon: Award },
      { name: "Notifications", path: "/intern/notifications", icon: Bell },
      { name: "Profile", path: "/intern/profile", icon: User },
    ],
  },

  [ROLES.PROJECT_MANAGER]: {
    label: "Project Management",
    basePath: "/project-manager",
    items: [
      { name: "Dashboard", path: "/project-manager", icon: LayoutDashboard, end: true },
      { name: "Teams", path: "/project-manager/team", icon: Users },
      {
        name: "Projects & Tasks",
        path: "/project-manager/projects-tasks",
        icon: ListChecks,
      },
      {
        name: "Scrum Review",
        path: "/project-manager/scrum-review",
        icon: MessageSquare,
      },
      {
        name: "Notifications",
        path: "/project-manager/notifications",
        icon: Bell,
      },
      { name: "Profile", path: "/project-manager/profile", icon: User },
    ],
  },

  [ROLES.MENTOR]: {
    label: "Mentor Portal",
    basePath: "/mentor",
    items: [
      { name: "Dashboard", path: "/mentor", icon: LayoutDashboard, end: true },
      {
        name: "Submission Review",
        path: "/mentor/submission-review",
        icon: ClipboardCheck,
      },
      {
        name: "Performance Evaluation",
        path: "/mentor/performance-evaluation",
        icon: GraduationCap,
      },
      { name: "Notifications", path: "/mentor/notifications", icon: Bell },
      { name: "Profile", path: "/mentor/profile", icon: User },
    ],
  },

  [ROLES.PROGRAM_MANAGER]: {
    label: "Program Management",
    basePath: "/program-manager",
    items: [
      {
        name: "Dashboard",
        path: "/program-manager/dashboard",
        icon: LayoutDashboard,
      },
      { name: "Programs & Cohorts", path: "/program-manager/cohorts", icon: Layers },
      { name: "Mentors", path: "/program-manager/mentors", icon: Users },
      { name: "Reports", path: "/program-manager/reports", icon: ListChecks },
      {
        name: "Announcements",
        path: "/program-manager/announcements",
        icon: MessageSquare,
      },
      {
        name: "Notifications",
        path: "/program-manager/notifications",
        icon: Bell,
      },
      { name: "Profile", path: "/program-manager/profile", icon: User },
    ],
  },

  [ROLES.SUPER_ADMIN]: {
    label: "Administration",
    basePath: "/admin",
    items: [
      { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Users", path: "/admin/users", icon: Users },
      { name: "Programs", path: "/admin/programs", icon: Layers },
      { name: "Audit Logs", path: "/admin/audit", icon: ShieldCheck },
      { name: "Notifications", path: "/admin/notifications", icon: Bell },
      { name: "Settings", path: "/admin/settings", icon: ListChecks },
      { name: "Profile", path: "/admin/profile", icon: User },
    ],
  },
};

/** Sidebar items for a role, accepting any legacy spelling. */
export function getNavigation(role) {
  return NAVIGATION[normalizeRole(role)] || null;
}

export function getNavItems(role) {
  return getNavigation(role)?.items || [];
}
