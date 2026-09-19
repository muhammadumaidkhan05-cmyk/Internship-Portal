const mongoose = require("mongoose");

// ============================================================
// TASK SCHEMA
// The connective tissue between the Project Manager module
// (who creates and assigns work), the Intern module (who opens
// and submits it) and the Mentor module (who reviews it).
// ============================================================

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // ----------------------------------------------------------
    // ASSIGNMENT
    // ----------------------------------------------------------

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A task must be assigned to an intern"],
      index: true,
    },

    assignedToName: {
      type: String,
      default: "",
      trim: true,
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    assignedByName: {
      type: String,
      default: "",
      trim: true,
    },

    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    mentorName: {
      type: String,
      default: "",
      trim: true,
    },

    // ----------------------------------------------------------
    // CONTEXT
    // ----------------------------------------------------------

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectManagerProject",
      default: null,
      index: true,
    },

    projectName: {
      type: String,
      default: "",
      trim: true,
    },

    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectManagerTeam",
      default: null,
    },

    teamName: {
      type: String,
      default: "",
      trim: true,
    },

    // ----------------------------------------------------------
    // WORKFLOW STATE
    // Assigned -> Submitted -> Approved | Resubmit -> Submitted...
    // ----------------------------------------------------------

    status: {
      type: String,
      enum: ["Assigned", "In Progress", "Submitted", "Approved", "Resubmit"],
      default: "Assigned",
      index: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    deadline: {
      type: Date,
      default: null,
    },

    // Latest submission for this task, if any.
    latestSubmissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      default: null,
    },

    submissionCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
