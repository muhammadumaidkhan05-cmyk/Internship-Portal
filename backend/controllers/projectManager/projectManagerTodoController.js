const ProjectManagerTodo = require(
  "../../models/projectManager/ProjectManagerTodo"
);

// ============================================================
// GET ALL TODOS
// ============================================================

const getTodos = async (req, res) => {
  try {
    const todos =
      await ProjectManagerTodo.find().sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos,
    });
  } catch (error) {
    console.error(
      "Get Project Manager todos error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load to-do list.",
      error: error.message,
    });
  }
};

// ============================================================
// CREATE TODO
// ============================================================

const createTodo = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      status,
      completed,
    } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({
        success: false,
        message: "Todo title is required.",
      });
    }

    let finalStatus =
      status || "Pending";

    let finalCompleted =
      typeof completed === "boolean"
        ? completed
        : false;

    if (finalStatus === "Completed") {
      finalCompleted = true;
    }

    if (finalCompleted) {
      finalStatus = "Completed";
    }

    const todo =
      await ProjectManagerTodo.create({
        title: String(title).trim(),

        description:
          description !== undefined
            ? String(description).trim()
            : "",

        priority:
          priority || "Medium",

        dueDate:
          dueDate || null,

        status:
          finalStatus,

        completed:
          finalCompleted,
      });

    res.status(201).json({
      success: true,
      message: "To-do created successfully.",
      data: todo,
    });
  } catch (error) {
    console.error(
      "Create Project Manager todo error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create to-do.",
      error: error.message,
    });
  }
};

// ============================================================
// UPDATE TODO
// ============================================================

const updateTodo = async (req, res) => {
  try {
    const todo =
      await ProjectManagerTodo.findById(
        req.params.id
      );

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "To-do not found.",
      });
    }

    const {
      title,
      description,
      priority,
      dueDate,
      status,
      completed,
    } = req.body;

    if (
      title !== undefined &&
      !String(title).trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Todo title cannot be empty.",
      });
    }

    if (title !== undefined) {
      todo.title =
        String(title).trim();
    }

    if (description !== undefined) {
      todo.description =
        String(description).trim();
    }

    if (priority !== undefined) {
      todo.priority =
        priority;
    }

    if (dueDate !== undefined) {
      todo.dueDate =
        dueDate || null;
    }

    if (status !== undefined) {
      todo.status =
        status;
    }

    if (typeof completed === "boolean") {
      todo.completed =
        completed;
    }

    if (todo.status === "Completed") {
      todo.completed = true;
    }

    if (todo.completed) {
      todo.status = "Completed";
    }

    await todo.save();

    res.status(200).json({
      success: true,
      message: "To-do updated successfully.",
      data: todo,
    });
  } catch (error) {
    console.error(
      "Update Project Manager todo error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update to-do.",
      error: error.message,
    });
  }
};

// ============================================================
// TOGGLE TODO
// ============================================================

const toggleTodo = async (req, res) => {
  try {
    const todo =
      await ProjectManagerTodo.findById(
        req.params.id
      );

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "To-do not found.",
      });
    }

    todo.completed =
      !todo.completed;

    todo.status =
      todo.completed
        ? "Completed"
        : "Pending";

    await todo.save();

    res.status(200).json({
      success: true,
      message:
        todo.completed
          ? "To-do marked as completed."
          : "To-do marked as pending.",
      data: todo,
    });
  } catch (error) {
    console.error(
      "Toggle Project Manager todo error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update to-do.",
      error: error.message,
    });
  }
};

// ============================================================
// DELETE TODO
// ============================================================

const deleteTodo = async (req, res) => {
  try {
    const todo =
      await ProjectManagerTodo.findByIdAndDelete(
        req.params.id
      );

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "To-do not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "To-do deleted successfully.",
      data: todo,
    });
  } catch (error) {
    console.error(
      "Delete Project Manager todo error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete to-do.",
      error: error.message,
    });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
};