const mongoose = require("mongoose");

// ============================================================
// DAILY SCRUM SCHEMA
// Written by the Intern module, reviewed by the Project Manager
// module. The review fields are what turn two isolated pages
// into one workflow.
// ============================================================

const dailyScrumSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    internName: {
      type: String,
      default: "",
      trim: true,
    },

    // ----------------------------------------------------------
    // SCRUM CONTENT
    // ----------------------------------------------------------

    yesterday: {
      type: String,
      required: true,
    },

    today: {
      type: String,
      required: true,
    },

    blockers: {
      type: String,
      default: "",
    },

    // ----------------------------------------------------------
    // CONTEXT (denormalised from the intern's assignment)
    // ----------------------------------------------------------

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectManagerProject",
      default: null,
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

    projectManagerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // ----------------------------------------------------------
    // PROJECT MANAGER REVIEW
    // ----------------------------------------------------------

    reviewStatus: {
      type: String,
      enum: ["Pending", "Reviewed", "Needs Attention"],
      default: "Pending",
      index: true,
    },

    managerRemarks: {
      type: String,
      default: "",
      trim: true,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedByName: {
      type: String,
      default: "",
      trim: true,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DailyScrum", dailyScrumSchema);
