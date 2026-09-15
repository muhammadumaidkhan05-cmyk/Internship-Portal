const mongoose = require("mongoose");

const cohortSchema = new mongoose.Schema(
  {
    // ============================================================
    // CUSTOM COHORT ID
    // ============================================================
    id: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    // ============================================================
    // BASIC INFORMATION
    // ============================================================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    program: {
      type: String,
      required: true,
      trim: true,
    },

    // ============================================================
    // MENTOR
    // ============================================================
    mentorId: {
      type: String,
      default: "",
      trim: true,
    },

    mentorName: {
      type: String,
      default: "",
      trim: true,
    },

    // ============================================================
    // INTERNS
    // ============================================================
    internIds: {
      type: [String],
      default: [],
    },

    interns: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ============================================================
    // PROGRESS
    // ============================================================
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // ============================================================
    // STATUS
    // ============================================================
    status: {
      type: String,
      enum: [
        "Active",
        "Completed",
        "Upcoming",
        "Inactive",
      ],
      default: "Upcoming",
    },

    // ============================================================
    // DATES
    // ============================================================
    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    // ============================================================
    // DESCRIPTION
    // ============================================================
    description: {
      type: String,
      default: "",
      trim: true,
    },

    // ============================================================
    // CREATED BY
    // ============================================================
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
  "Cohort",
  cohortSchema
);
