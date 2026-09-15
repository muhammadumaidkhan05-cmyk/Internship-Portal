const express = require("express");

const {
  createNotification,
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markNotificationAsUnread,
  markAllNotificationsAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const router = express.Router();

// ============================================================
// NOTIFICATIONS
// No authentication required for current project stage
// Same approach as Announcements
// ============================================================

// GET ALL
router.get("/", getNotifications);

// GET UNREAD
router.get("/unread", getUnreadNotifications);

// CREATE
router.post("/", createNotification);

// MARK ALL AS READ
router.put(
  "/read-all",
  markAllNotificationsAsRead
);

// MARK ONE AS READ
router.put(
  "/:id/read",
  markNotificationAsRead
);

// MARK ONE AS UNREAD
router.put(
  "/:id/unread",
  markNotificationAsUnread
);

// DELETE
router.delete(
  "/:id",
  deleteNotification
);

module.exports = router;