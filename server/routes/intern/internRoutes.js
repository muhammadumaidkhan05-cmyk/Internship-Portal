const express = require("express");

const protect = require("../../middleware/authMiddleware");
const allowRoles = require("../../middleware/roleMiddleware");
const { ROLES } = require("../../constants/roles");

const {
  getDashboard,
  getMyProjects,
  getMyScrums,
  createScrum,
  deleteScrum,
  getMyAttendance,
  markAttendance,
  updateAttendance,
  getMyCertificates,
  getMyEvaluations,
  getProfile,
  updateProfile,
} = require("../../controllers/intern/internController");

const {
  getMyTasks,
  getTaskById,
  submitTask,
  startTask,
  getMySubmissions,
  getSubmissionById,
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} = require("../../controllers/intern/internTaskController");

const router = express.Router();

// Every intern endpoint requires an authenticated intern.
router.use(protect, allowRoles(ROLES.INTERN));

// ------------------------------------------------------------
// DASHBOARD  (page 4)
// ------------------------------------------------------------
router.get("/dashboard", getDashboard);

// ------------------------------------------------------------
// DAILY SCRUM  (page 5)
// ------------------------------------------------------------
router.get("/daily-scrums", getMyScrums);
router.post("/daily-scrums", createScrum);
router.delete("/daily-scrums/:id", deleteScrum);

// ------------------------------------------------------------
// ATTENDANCE  (page 6)
// ------------------------------------------------------------
router.get("/attendance", getMyAttendance);
router.post("/attendance", markAttendance);
router.put("/attendance/:id", updateAttendance);

// ------------------------------------------------------------
// MY PROJECTS  (page 7)
// ------------------------------------------------------------
router.get("/projects", getMyProjects);

// ------------------------------------------------------------
// TASKS & TASK SUBMISSION  (page 8)
// ------------------------------------------------------------
router.get("/tasks", getMyTasks);
router.get("/tasks/:taskId", getTaskById);
router.patch("/tasks/:taskId/start", startTask);
router.post("/tasks/:taskId/submit", submitTask);

// ------------------------------------------------------------
// SUBMISSION STATUS  (page 9)
// ------------------------------------------------------------
router.get("/submissions", getMySubmissions);
router.get("/submissions/:id", getSubmissionById);

// ------------------------------------------------------------
// CERTIFICATES  (page 10)
// ------------------------------------------------------------
router.get("/certificates", getMyCertificates);

// ------------------------------------------------------------
// EVALUATIONS (read-only)
// ------------------------------------------------------------
router.get("/evaluations", getMyEvaluations);

// ------------------------------------------------------------
// NOTIFICATIONS
// ------------------------------------------------------------
router.get("/notifications", getMyNotifications);
router.patch("/notifications/:id/read", markNotificationRead);
router.patch("/notifications/read-all", markAllNotificationsRead);
router.delete("/notifications/:id", deleteNotification);

// ------------------------------------------------------------
// PROFILE
// ------------------------------------------------------------
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

module.exports = router;
