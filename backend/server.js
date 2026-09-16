
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

// ============================================================
// EXISTING ROUTES
// ============================================================

const authRoutes = require("./routes/authRoutes");
const cohortRoutes = require("./routes/cohortRoutes");
const projectRoutes = require("./routes/projectRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reportRoutes = require("./routes/reportRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const announcementRoutes = require("./routes/announcementRoutes");

// Program Manager Profile
const programManagerProfileRoutes =
  require("./routes/programManagerProfileRoutes");

// ============================================================
// SUPER ADMIN ROUTES
// ============================================================

const superAdminUsersRoutes = require("./routes/superAdmin/usersRoutes");
const superAdminProgramsRoutes = require("./routes/superAdmin/programsRoutes");
const superAdminAuditLogsRoutes = require("./routes/superAdmin/auditLogsRoutes");
const superAdminNotificationsRoutes = require("./routes/superAdmin/notificationsRoutes");
const superAdminPlatformSettingsRoutes = require("./routes/superAdmin/platformSettingsRoutes");
const superAdminRolesMatrixRoutes = require("./routes/superAdmin/rolesMatrixRoutes");

// ============================================================
// PROJECT MANAGER ROUTES
// ============================================================

// Team Management
const projectManagerTeamRoutes =
  require("./routes/projectManager/teamRoutes");

// Projects & Tasks
const projectManagerProjectsTasksRoutes =
  require("./routes/projectManager/projectsTasksRoutes");

// Scrum Review
const projectManagerScrumReviewRoutes =
  require("./routes/projectManager/scrumReviewRoutes");

// Notifications
const projectManagerNotificationRoutes =
  require("./routes/projectManager/projectManagerNotificationRoutes");

// Personal To-Do
const projectManagerTodoRoutes =
  require("./routes/projectManager/projectManagerTodoRoutes");

// Project Manager Profile
const projectManagerProfileRoutes =
  require("./routes/projectManager/projectManagerProfileRoutes");

// ============================================================
// ENVIRONMENT
// ============================================================

dotenv.config();

// ============================================================
// APP
// ============================================================

const app = express();

// ============================================================
// DATABASE CONNECTION
// ============================================================

connectDB();

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// ============================================================
// EXISTING API ROUTES
// ============================================================

// Authentication + Mentor Management
app.use(
  "/api/auth",
  authRoutes
);

// Cohorts
app.use(
  "/api/cohorts",
  cohortRoutes
);

// Existing Program Manager Projects
app.use(
  "/api/projects",
  projectRoutes
);

// Existing Notifications
app.use(
  "/api/notifications",
  notificationRoutes
);

// Reports
app.use(
  "/api/reports",
  reportRoutes
);

// Program Manager Dashboard
app.use(
  "/api/dashboard",
  dashboardRoutes
);

// Announcements
app.use(
  "/api/announcements",
  announcementRoutes
);

// ============================================================
// PROGRAM MANAGER PROFILE
// ============================================================

app.use(
  "/api/program-manager-profile",
  programManagerProfileRoutes
);

// ============================================================
// SUPER ADMIN API ROUTES
// ============================================================

app.use("/api/super-admin/users", superAdminUsersRoutes);
app.use("/api/super-admin/programs", superAdminProgramsRoutes);
app.use("/api/super-admin/audit-logs", superAdminAuditLogsRoutes);
app.use("/api/super-admin/notifications", superAdminNotificationsRoutes);
app.use("/api/super-admin/platform-settings", superAdminPlatformSettingsRoutes);
app.use("/api/super-admin/roles-matrix", superAdminRolesMatrixRoutes);

// ============================================================
// PROJECT MANAGER API ROUTES
// ============================================================

// ------------------------------------------------------------
// Team Management
// ------------------------------------------------------------

app.use(
  "/api/project-manager/team",
  projectManagerTeamRoutes
);

// ------------------------------------------------------------
// Projects & Tasks
// ------------------------------------------------------------

app.use(
  "/api/project-manager/projects-tasks",
  projectManagerProjectsTasksRoutes
);

// ------------------------------------------------------------
// Scrum Review
// ------------------------------------------------------------

app.use(
  "/api/project-manager/scrum-review",
  projectManagerScrumReviewRoutes
);

// ------------------------------------------------------------
// Project Manager Notifications
// ------------------------------------------------------------

app.use(
  "/api/project-manager/notifications",
  projectManagerNotificationRoutes
);

// ------------------------------------------------------------
// Project Manager To-Do
// ------------------------------------------------------------

app.use(
  "/api/project-manager/todos",
  projectManagerTodoRoutes
);

// ------------------------------------------------------------
// Project Manager Profile
// ------------------------------------------------------------

app.use(
  "/api/project-manager/profile",
  projectManagerProfileRoutes
);

// ============================================================
// ROOT ROUTE
// ============================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "MSN Academy Internship Portal API is running 🚀",
  });
});

// ============================================================
// SERVER
// ============================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});

