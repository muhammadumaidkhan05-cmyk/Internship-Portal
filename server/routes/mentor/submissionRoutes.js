const express = require("express");

const {
  getSubmissions,
  getSubmissionById,
  reviewSubmission,
  approveSubmission,
  requestResubmission,
} = require("../../controllers/mentor/submissionController");

const protect = require("../../middleware/authMiddleware");
const allowRoles = require("../../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, allowRoles("mentor"));

// GET ALL / QUEUE
router.get("/", getSubmissions);

// GET SINGLE
router.get("/:id", getSubmissionById);

// GENERIC REVIEW
router.patch("/:id/review", reviewSubmission);

// APPROVE
router.post("/:id/approve", approveSubmission);

// REQUEST RESUBMISSION
router.post("/:id/resubmission", requestResubmission);

module.exports = router;
