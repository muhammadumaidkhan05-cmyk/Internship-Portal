const express = require("express");

const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addProjectTask,
  toggleProjectTask,
  deleteProjectTask,
} = require(
  "../../controllers/projectManager/projectsTasksController"
);

const router = express.Router();

// ============================================================
// PROJECT ROUTES
// ============================================================

// GET ALL PROJECTS
router.get(
  "/",
  getProjects
);

// GET SINGLE PROJECT
router.get(
  "/:id",
  getProjectById
);

// CREATE PROJECT
router.post(
  "/",
  createProject
);

// UPDATE PROJECT
router.put(
  "/:id",
  updateProject
);

// DELETE PROJECT
router.delete(
  "/:id",
  deleteProject
);

// ============================================================
// PROJECT TASK ROUTES
// ============================================================

// ADD TASK
router.post(
  "/:id/tasks",
  addProjectTask
);

// TOGGLE TASK
router.put(
  "/:id/tasks/:taskId",
  toggleProjectTask
);

// DELETE TASK
router.delete(
  "/:id/tasks/:taskId",
  deleteProjectTask
);

module.exports = router;