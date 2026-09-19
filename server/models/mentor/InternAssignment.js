const mongoose = require("mongoose");

// ============================================================
// INTERN ASSIGNMENT SCHEMA
// Mentor -> Assigned Intern relationship
// ============================================================

const internAssignmentSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    internId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Denormalized for quick display without populate
    internName: {
      type: String,
      default: "",
      trim: true,
    },

    programId: {
      type: String,
      default: "",
      trim: true,
    },

    programName: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Active", "Completed"],
      default: "Active",
    },

    // Current evaluation milestone this intern is working toward
    milestone: {
      type: String,
      default: "Mid-Internship",
      trim: true,
    },

    milestoneDueDate: {
      type: Date,
      default: () =>
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },

    assignedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate assignment of the same intern to the same mentor
internAssignmentSchema.index(
  { mentorId: 1, internId: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "InternAssignment",
  internAssignmentSchema
);
