const express = require("express");

const {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require(
  "../../controllers/projectManager/teamController"
);

const router = express.Router();

// ============================================================
// GET ALL TEAMS
// ============================================================

router.get(
  "/",
  getTeamMembers
);

// ============================================================
// GET SINGLE TEAM
// ============================================================

router.get(
  "/:id",
  getTeamMemberById
);

// ============================================================
// CREATE TEAM
// ============================================================

router.post(
  "/",
  createTeamMember
);

// ============================================================
// UPDATE TEAM
// ============================================================

router.put(
  "/:id",
  updateTeamMember
);

// ============================================================
// DELETE TEAM
// ============================================================

router.delete(
  "/:id",
  deleteTeamMember
);

module.exports = router;