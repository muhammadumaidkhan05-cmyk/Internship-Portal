const express = require("express");

const {
  getInterns,
  assignIntern,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getInternScrums,
  reviewInternScrum,
} = require("../../controllers/projectManager/internWorkflowController");

const router = express.Router();

// ============================================================
// INTERN ROSTER & ASSIGNMENT  (page 12)
// ============================================================

router.get("/interns", getInterns);

router.patch("/interns/:internId/assignment", assignIntern);

// ============================================================
// TASK ASSIGNMENT  (page 13)
// ============================================================

router.get("/tasks", getTasks);

router.post("/tasks", createTask);

router.put("/tasks/:id", updateTask);

router.delete("/tasks/:id", deleteTask);

// ============================================================
// DAILY SCRUM REVIEW  (page 14)
// ============================================================

router.get("/intern-scrums", getInternScrums);

router.patch("/intern-scrums/:id/review", reviewInternScrum);

module.exports = router;
