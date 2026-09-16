
const express = require("express");

const {
  getProjectManagerProfile,
  updateProjectManagerProfile,
} = require("../../controllers/projectManager/projectManagerProfileController");

const router = express.Router();

// ============================================================
// GET PROJECT MANAGER PROFILE
// No Authorization Token Required
// ============================================================

router.get(
  "/",
  getProjectManagerProfile
);

// ============================================================
// UPDATE PROJECT MANAGER PROFILE
// No Authorization Token Required
// ============================================================

router.put(
  "/",
  updateProjectManagerProfile
);

module.exports = router;

