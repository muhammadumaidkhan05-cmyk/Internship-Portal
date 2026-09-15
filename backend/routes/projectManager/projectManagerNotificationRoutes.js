
const express = require("express");

const {
  getNotifications,
  createNotification,
  updateNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require(
  "../../controllers/projectManager/projectManagerNotificationController"
);

const router = express.Router();

// ============================================================
// GET ALL PROJECT MANAGER NOTIFICATIONS
// ============================================================

router.get(
  "/",
  getNotifications
);

// ============================================================
// CREATE NOTIFICATION
// ============================================================

router.post(
  "/",
  createNotification
);

// ============================================================
// MARK ALL AS READ
// IMPORTANT: MUST COME BEFORE /:id
// ============================================================

router.put(
  "/mark-all-read",
  markAllAsRead
);

// ============================================================
// MARK ONE AS READ
// ============================================================

router.put(
  "/:id/read",
  markAsRead
);

// ============================================================
// UPDATE
// ============================================================

router.put(
  "/:id",
  updateNotification
);

// ============================================================
// DELETE
// ============================================================

router.delete(
  "/:id",
  deleteNotification
);

module.exports = router;

