const mongoose = require("mongoose");

// ============================================================
// TASK SCHEMA
// ============================================================

const projectManagerTaskSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: [true, "Task title is required"],
        trim: true,
      },

      status: {
        type: String,
        enum: ["Pending", "Completed"],
        default: "Pending",
      },

      completed: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

// ============================================================
// TODO SCHEMA
// ============================================================

const projectManagerTodoSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: [true, "Todo title is required"],
        trim: true,
      },

      description: {
        type: String,
        default: "",
        trim: true,
      },

      priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium",
      },

      dueDate: {
        type: Date,
        default: null,
      },

      category: {
        type: String,
        default: "General",
        trim: true,
      },

      completed: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

// ============================================================
// PROJECT SCHEMA
// ============================================================

const projectManagerProjectSchema =
  new mongoose.Schema(
    {
      // --------------------------------------------------------
      // PROJECT BASIC INFORMATION
      // --------------------------------------------------------

      name: {
        type: String,
        required: [true, "Project name is required"],
        trim: true,
      },

      description: {
        type: String,
        trim: true,
        default: "",
      },

      cohortId: {
        type: String,
        default: "",
      },

      cohortName: {
        type: String,
        trim: true,
        default: "Unassigned",
      },

      mentorId: {
        type: String,
        default: "",
      },

      mentorName: {
        type: String,
        trim: true,
        default: "Unassigned",
      },

      priority: {
        type: String,
        enum: ["High", "Medium", "Low"],
        default: "Medium",
      },

      status: {
        type: String,
        enum: [
          "Planning",
          "In Progress",
          "Completed",
        ],
        default: "Planning",
      },

      progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },

      deadline: {
        type: Date,
        required: [true, "Project deadline is required"],
      },

      // --------------------------------------------------------
      // PROJECT TASKS
      // --------------------------------------------------------

      tasks: {
        type: [projectManagerTaskSchema],
        default: [],
      },

      // --------------------------------------------------------
      // PROJECT MANAGER TO-DOS
      // --------------------------------------------------------

      todos: {
        type: [projectManagerTodoSchema],
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "ProjectManagerProject",
    projectManagerProjectSchema
  );