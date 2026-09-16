const express = require("express");

const {
  getScrumReviews,
  getScrumReviewById,
  createScrumReview,
  updateScrumReview,
  deleteScrumReview,
  getTeamPerformance,
} = require(
  "../../controllers/projectManager/scrumReviewController"
);

const router = express.Router();

// ============================================================
// SCRUM REVIEW ROUTES
// ============================================================

// Get all reviews
router.get("/", getScrumReviews);

// Team performance
router.get(
  "/team-performance",
  getTeamPerformance
);

// Get single review
router.get("/:id", getScrumReviewById);

// Create review
router.post("/", createScrumReview);

// Update review
router.put("/:id", updateScrumReview);

// Delete review
router.delete("/:id", deleteScrumReview);

module.exports = router;