const mongoose = require("mongoose");

// ============================================================
// PROJECT TASK SCHEMA
// ============================================================

const taskSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

// ============================================================
// PROJECT SCHEMA
// ============================================================

const projectSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    cohortId: {
      type: String,
      required: true,
      trim: true,
    },

    cohortName: {
      type: String,
      default: "",
      trim: true,
    },

    mentorId: {
      type: String,
      required: true,
      trim: true,
    },

    mentorName: {
      type: String,
      default: "",
      trim: true,
    },

    internIds: {
      type: [String],
      default: [],
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
      default: 0,
      min: 0,
      max: 100,
    },

    deadline: {
      type: Date,
      required: true,
    },

    tasks: {
      type: [taskSchema],
      default: [],
    },

    createdBy: {
      type: String,
      default: "program-manager",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Project",
  projectSchema
);