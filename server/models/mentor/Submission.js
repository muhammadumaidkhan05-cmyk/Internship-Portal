const mongoose = require("mongoose");

// ============================================================
// REVIEW HISTORY ENTRY
// ============================================================

const reviewHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["approved", "resubmission_required"],
      required: true,
    },

    score: {
      type: Number,
      default: null,
    },

    feedback: {
      type: String,
      default: "",
      trim: true,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// ============================================================
// SUBMISSION SCHEMA
// ============================================================

const submissionSchema = new mongoose.Schema(
  {
    // ----------------------------------------------------------
    // WORKFLOW LINKS (added during integration)
    // Connects the Intern task page to the Mentor review queue.
    // ----------------------------------------------------------

    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
      index: true,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectManagerProject",
      default: null,
    },

    liveUrl: {
      type: String,
      default: "",
      trim: true,
    },

    attachments: {
      type: [
        {
          name: { type: String, default: "", trim: true },
          url: { type: String, default: "", trim: true },
          _id: false,
        },
      ],
      default: [],
    },

    attempt: {
      type: Number,
      default: 1,
    },

    internId: {
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

    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    programName: {
      type: String,
      default: "",
      trim: true,
    },

    taskTitle: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    githubUrl: {
      type: String,
      default: "",
      trim: true,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "resubmission_required"],
      default: "pending",
      index: true,
    },

    score: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    feedback: {
      type: String,
      default: "",
      trim: true,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    history: {
      type: [reviewHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Submission", submissionSchema);
