import { z } from "zod";

// Roles & Labels
export const ROLES = ["super_admin", "program_manager", "mentor", "intern"];

export const ROLE_LABELS = {
  super_admin: "Super Admin",
  program_manager: "Program Manager",
  mentor: "Mentor",
  intern: "Intern",
};

// Status Enums
export const USER_STATUSES = ["active", "inactive", "suspended"];

export const PROGRAM_STATUSES = [
  "active",
  "in_progress",
  "completed",
  "archived",
];

export const NOTIFICATION_CATEGORIES = [
  "security",
  "approval",
  "system",
  "general",
];

export const AUDIT_ACTIONS = [
  "login",
  "logout",
  "approved_scrum",
  "created_user",
  "updated_role",
  "deleted_user",
  "updated_settings",
  "exported_audit_log",
];

// Entity Interfaces

// Pagination & API Response Types

// Zod Validation Schemas
export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().email("Invalid email address").max(160),
  role: z.enum(ROLES).default("intern"),
  status: z.enum(USER_STATUSES).default("active"),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  email: z.string().email().max(160).optional(),
  role: z.enum(ROLES).optional(),
  status: z.enum(USER_STATUSES).optional(),
});

export const createProgramSchema = z.object({
  name: z.string().min(2).max(160),
  cohortSize: z.coerce.number().int().nonnegative().default(0),
  programManager: z.string().min(2).max(120),
  status: z.enum(PROGRAM_STATUSES).default("active"),
  progress: z.coerce.number().min(0).max(100).default(0),
});

export const updateProgramSchema = z.object({
  name: z.string().min(2).max(160).optional(),
  cohortSize: z.coerce.number().int().nonnegative().optional(),
  programManager: z.string().min(2).max(120).optional(),
  status: z.enum(PROGRAM_STATUSES).optional(),
  progress: z.coerce.number().min(0).max(100).optional(),
});

export const updatePlatformSettingsSchema = z.object({
  platformName: z.string().min(1).max(160).optional(),
  supportEmail: z.string().email().max(160).optional(),
  maintenanceMode: z.boolean().optional(),
  sessionTimeoutMinutes: z.coerce.number().int().min(5).max(1440).optional(),
  allowSignups: z.boolean().optional(),
});

export const updateRolesMatrixSchema = z.object({
  permissions: z.record(z.string(), z.boolean()),
});

export const loginSchema = z.object({
  role: z.enum(ROLES).optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
});

export const userQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  role: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
  sort: z
    .enum(["id", "name", "email", "role", "status", "createdAt"])
    .default("id"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const auditLogQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  user: z.string().optional(),
  action: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});
