const express = require("express");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectTask,
  toggleProjectTask,
  deleteProjectTask,
} = require("../controllers/projectController");

const router = express.Router();

// ============================================================
// GET ALL PROJECTS
// ============================================================

router.get("/", getProjects);

// ============================================================
// GET SINGLE PROJECT
// ============================================================

router.get("/:id", getProjectById);

// ============================================================
// CREATE PROJECT
// ============================================================

router.post("/", createProject);

// ============================================================
// UPDATE PROJECT
// ============================================================

router.put("/:id", updateProject);

// ============================================================
// DELETE PROJECT
// ============================================================

router.delete("/:id", deleteProject);

// ============================================================
// ADD PROJECT TASK
// ============================================================

router.post("/:id/tasks", addProjectTask);

// ============================================================
// TOGGLE PROJECT TASK
// ============================================================

router.put("/:id/tasks/:taskId", toggleProjectTask);

// ============================================================
// DELETE PROJECT TASK
// ============================================================

router.delete("/:id/tasks/:taskId", deleteProjectTask);

module.exports = router;