// ============================================================
// CANONICAL ROLES (client mirror of server/constants/roles.js)
// ============================================================

export const ROLES = {
  INTERN: "intern",
  PROJECT_MANAGER: "project_manager",
  MENTOR: "mentor",
  PROGRAM_MANAGER: "program_manager",
  SUPER_ADMIN: "super_admin",
};

export const ROLE_VALUES = Object.values(ROLES);

const ROLE_ALIASES = {
  intern: ROLES.INTERN,
  mentor: ROLES.MENTOR,
  "project-manager": ROLES.PROJECT_MANAGER,
  project_manager: ROLES.PROJECT_MANAGER,
  projectmanager: ROLES.PROJECT_MANAGER,
  "program-manager": ROLES.PROGRAM_MANAGER,
  program_manager: ROLES.PROGRAM_MANAGER,
  programmanager: ROLES.PROGRAM_MANAGER,
  admin: ROLES.SUPER_ADMIN,
  "super-admin": ROLES.SUPER_ADMIN,
  super_admin: ROLES.SUPER_ADMIN,
  superadmin: ROLES.SUPER_ADMIN,
};

/** Map any legacy spelling onto a canonical role. */
export function normalizeRole(value) {
  if (!value) return null;

  const raw = String(value).trim();
  const collapsed = raw.toLowerCase().replace(/[\s-]+/g, "_");

  if (ROLE_VALUES.includes(collapsed)) return collapsed;
  if (ROLE_ALIASES[collapsed]) return ROLE_ALIASES[collapsed];
  if (ROLE_ALIASES[raw]) return ROLE_ALIASES[raw];

  return null;
}

export const ROLE_LABELS = {
  [ROLES.INTERN]: "Intern",
  [ROLES.PROJECT_MANAGER]: "Project Manager",
  [ROLES.MENTOR]: "Mentor",
  [ROLES.PROGRAM_MANAGER]: "Program Manager",
  [ROLES.SUPER_ADMIN]: "Super Admin",
};

/** Where each role lands after signing in. */
export const ROLE_HOME = {
  [ROLES.INTERN]: "/intern/dashboard",
  [ROLES.PROJECT_MANAGER]: "/project-manager",
  [ROLES.MENTOR]: "/mentor",
  [ROLES.PROGRAM_MANAGER]: "/program-manager/dashboard",
  [ROLES.SUPER_ADMIN]: "/admin/dashboard",
};

/** Options rendered by the login / registration role selector. */
export const LOGIN_ROLE_OPTIONS = [
  { value: ROLES.INTERN, label: "Intern" },
  { value: ROLES.PROJECT_MANAGER, label: "Project Manager" },
  { value: ROLES.MENTOR, label: "Mentor" },
  { value: ROLES.PROGRAM_MANAGER, label: "Program Manager" },
  { value: ROLES.SUPER_ADMIN, label: "Super Admin" },
];

export const REGISTER_ROLE_OPTIONS = LOGIN_ROLE_OPTIONS.filter(
  (option) => option.value !== ROLES.SUPER_ADMIN
);

export function homeForRole(role) {
  return ROLE_HOME[normalizeRole(role)] || "/login";
}
