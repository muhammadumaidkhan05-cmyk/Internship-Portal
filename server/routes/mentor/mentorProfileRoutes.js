const express = require("express");

const {
  getMentorProfile,
  updateMentorProfile,
} = require("../../controllers/mentor/mentorProfileController");

const protect = require("../../middleware/authMiddleware");
const allowRoles = require("../../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, allowRoles("mentor"));

router.get("/", getMentorProfile);

router.put("/", updateMentorProfile);

module.exports = router;
