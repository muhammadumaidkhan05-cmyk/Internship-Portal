// ============================================================
// CANONICAL ROLES
// Every branch used a slightly different spelling for the same
// five roles. This module is the single source of truth and the
// normaliser that maps every legacy spelling onto it.
// ============================================================

const ROLES = {
  INTERN: "intern",
  PROJECT_MANAGER: "project_manager",
  MENTOR: "mentor",
  PROGRAM_MANAGER: "program_manager",
  SUPER_ADMIN: "super_admin",
};

const ROLE_VALUES = Object.values(ROLES);

const ROLE_ALIASES = {
  intern: ROLES.INTERN,
  Intern: ROLES.INTERN,
  INTERN: ROLES.INTERN,

  mentor: ROLES.MENTOR,
  Mentor: ROLES.MENTOR,
  MENTOR: ROLES.MENTOR,

  "project-manager": ROLES.PROJECT_MANAGER,
  project_manager: ROLES.PROJECT_MANAGER,
  projectmanager: ROLES.PROJECT_MANAGER,
  "Project Manager": ROLES.PROJECT_MANAGER,

  "program-manager": ROLES.PROGRAM_MANAGER,
  program_manager: ROLES.PROGRAM_MANAGER,
  programmanager: ROLES.PROGRAM_MANAGER,
  "Program Manager": ROLES.PROGRAM_MANAGER,

  admin: ROLES.SUPER_ADMIN,
  Admin: ROLES.SUPER_ADMIN,
  "super-admin": ROLES.SUPER_ADMIN,
  super_admin: ROLES.SUPER_ADMIN,
  superadmin: ROLES.SUPER_ADMIN,
  "Super Admin": ROLES.SUPER_ADMIN,
};

/**
 * Normalise any legacy or user-supplied role spelling to a canonical role.
 * Returns null when the value cannot be mapped.
 */
const normalizeRole = (value) => {
  if (!value) return null;

  const raw = String(value).trim();

  if (ROLE_ALIASES[raw]) return ROLE_ALIASES[raw];

  const collapsed = raw.toLowerCase().replace(/[\s-]+/g, "_");

  if (ROLE_VALUES.includes(collapsed)) return collapsed;
  if (ROLE_ALIASES[collapsed]) return ROLE_ALIASES[collapsed];

  return null;
};

/** Human readable label used by notifications and audit records. */
const ROLE_LABELS = {
  [ROLES.INTERN]: "Intern",
  [ROLES.PROJECT_MANAGER]: "Project Manager",
  [ROLES.MENTOR]: "Mentor",
  [ROLES.PROGRAM_MANAGER]: "Program Manager",
  [ROLES.SUPER_ADMIN]: "Super Admin",
};

/** Landing route for each role, mirrored by the client router. */
const ROLE_HOME = {
  [ROLES.INTERN]: "/intern/dashboard",
  [ROLES.PROJECT_MANAGER]: "/project-manager",
  [ROLES.MENTOR]: "/mentor",
  [ROLES.PROGRAM_MANAGER]: "/program-manager/dashboard",
  [ROLES.SUPER_ADMIN]: "/admin/dashboard",
};

module.exports = {
  ROLES,
  ROLE_VALUES,
  ROLE_ALIASES,
  ROLE_LABELS,
  ROLE_HOME,
  normalizeRole,
};
