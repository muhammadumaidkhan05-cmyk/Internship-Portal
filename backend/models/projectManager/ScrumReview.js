const mongoose = require("mongoose");

const scrumReviewSchema = new mongoose.Schema(
  {
    // ============================================================
    // TEAM INFORMATION
    // ============================================================

    teamId: {
      type: String,
      required: [true, "Team is required"],
      trim: true,
    },

    teamName: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
    },

    // ============================================================
    // PROJECT INFORMATION
    // ============================================================

    projectId: {
      type: String,
      required: [true, "Project is required"],
      trim: true,
    },

    projectName: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },

    // ============================================================
    // SCRUM MEETING INFORMATION
    // ============================================================

    scrumDate: {
      type: Date,
      required: [true, "Scrum date is required"],
    },

    scrumType: {
      type: String,
      enum: [
        "Daily Scrum",
        "Sprint Review",
        "Sprint Retrospective",
        "Sprint Planning",
      ],
      default: "Daily Scrum",
    },

    sprintName: {
      type: String,
      required: [true, "Sprint or week is required"],
      trim: true,
    },

    // ============================================================
    // TEAM ATTENDANCE
    // ============================================================

    totalMembers: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    presentMembers: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    lateMembers: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    absentMembers: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // ============================================================
    // PERFORMANCE
    // ============================================================

    sprintProgress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    // ============================================================
    // SCRUM DISCUSSION
    // ============================================================

    completedWork: {
      type: String,
      required: [true, "Completed work is required"],
      trim: true,
    },

    blockers: {
      type: String,
      default: "",
      trim: true,
    },

    nextPlan: {
      type: String,
      required: [true, "Next plan is required"],
      trim: true,
    },

    // ============================================================
    // REVIEW STATUS
    // ============================================================

    status: {
      type: String,
      enum: [
        "Pending",
        "Reviewed",
        "Needs Attention",
      ],
      default: "Pending",
    },

    managerRemarks: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ScrumReview",
  scrumReviewSchema
);