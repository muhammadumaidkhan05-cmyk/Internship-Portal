/**
 * Shared label maps and formatting utilities for the frontend.
 * Centralises constants that were previously duplicated across multiple pages.
 */

export const ROLE_LABEL = {
  super_admin: "Super Admin",
  program_manager: "Program Manager",
  mentor: "Mentor",
  intern: "Intern",
};

export const STATUS_LABEL = {
  // Capitalized — stored in DB as "Active" / "Inactive"
  Active: "Active",
  Inactive: "Inactive",
  // Lowercase aliases for backwards compat
  active: "Active",
  inactive: "Inactive",
  suspended: "Suspended",
  // Program statuses
  in_progress: "In Progress",
  completed: "Completed",
  archived: "Archived",
};

export const ACTION_LABEL = {
  all: "All actions",
  login: "Login",
  logout: "Logout",
  approved_scrum: "Approved Scrum",
  created_user: "Created User",
  updated_role: "Updated Role",
  deleted_user: "Deleted User",
  exported_audit_log: "Exported Audit Log",
  updated_settings: "Updated Settings",
};

/**
 * Formats a timestamp into a short human-readable string.
 * e.g. "Sep 16, 14:30"
 */
export function formatTimestamp(d) {
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/**
 * Formats a timestamp into a short dashboard-style string without the year.
 * e.g. "Sep 16, 14:30"
 */
export function formatTimestampShort(d) {
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/**
 * Returns a relative time label from a date.
 * e.g. "3m ago", "2h ago", "4d ago"
 */
export function relativeFrom(d) {
  const ms = Date.now() - new Date(d).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}

/**
 * Generates a CSV string from audit log rows.
 */
export function auditLogsToCsv(rows) {
  const header = ["Timestamp", "User", "Action", "IP Address", "Device"];
  const body = rows.map((r) => [
    formatTimestamp(r.timestamp),
    r.userName,
    ACTION_LABEL[r.action] ?? r.action,
    r.ipAddress ?? "",
    r.device ?? "",
  ]);
  return [header, ...body]
    .map((line) =>
      line.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");
}
