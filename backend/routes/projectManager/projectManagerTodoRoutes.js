const express = require("express");

const {
  getTodos,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
} = require(
  "../../controllers/projectManager/projectManagerTodoController"
);

const router = express.Router();

// GET ALL TODOS
router.get(
  "/",
  getTodos
);

// CREATE TODO
router.post(
  "/",
  createTodo
);

// UPDATE TODO
router.put(
  "/:id",
  updateTodo
);

// TOGGLE TODO
router.put(
  "/:id/toggle",
  toggleTodo
);

// DELETE TODO
router.delete(
  "/:id",
  deleteTodo
);

module.exports = router;