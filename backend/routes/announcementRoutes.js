
const express = require("express");

const {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController");

const router = express.Router();

// ============================================================
// ANNOUNCEMENT ROUTES
// No token/authentication required
// ============================================================

router.get("/", getAnnouncements);

router.get("/:id", getAnnouncementById);

router.post("/", createAnnouncement);

router.put("/:id", updateAnnouncement);

router.delete("/:id", deleteAnnouncement);

module.exports = router;

