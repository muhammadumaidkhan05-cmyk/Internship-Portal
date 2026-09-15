const express = require("express");

const {
  createCohort,
  getCohorts,
  getCohortById,
  updateCohort,
  deleteCohort,
} = require("../controllers/cohortController");

const router = express.Router();

// ============================================================
// GET ALL COHORTS + MENTORS
// ============================================================
router.get("/", getCohorts);

// ============================================================
// GET SINGLE COHORT
// ============================================================
router.get("/:id", getCohortById);

// ============================================================
// CREATE COHORT
// ============================================================
router.post("/", createCohort);

// ============================================================
// UPDATE COHORT
// ============================================================
router.put("/:id", updateCohort);

// ============================================================
// DELETE COHORT
// ============================================================
router.delete("/:id", deleteCohort);

module.exports = router;