const express = require("express");

const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../../controllers/mentor/mentorNotificationController");

const protect = require("../../middleware/authMiddleware");
const allowRoles = require("../../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, allowRoles("mentor"));

router.get("/", getNotifications);

// MUST come before /:id
router.patch("/read-all", markAllAsRead);

router.patch("/:id/read", markAsRead);

router.delete("/:id", deleteNotification);

module.exports = router;
