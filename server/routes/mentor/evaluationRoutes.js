const express = require("express");

const {
  getEvaluations,
  getEvaluationsByIntern,
  createEvaluation,
  updateEvaluation,
} = require("../../controllers/mentor/evaluationController");

const protect = require("../../middleware/authMiddleware");
const allowRoles = require("../../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, allowRoles("mentor"));

router.get("/", getEvaluations);

router.get("/:internId", getEvaluationsByIntern);

router.post("/", createEvaluation);

router.put("/:id", updateEvaluation);

module.exports = router;
