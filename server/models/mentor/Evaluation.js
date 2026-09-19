const mongoose = require("mongoose");

// ============================================================
// EVALUATION SCHEMA
// ============================================================

const criteriaSchema = new mongoose.Schema(
  {
    technicalSkill: { type: Number, min: 1, max: 10, required: true },
    communication: { type: Number, min: 1, max: 10, required: true },
    punctualityAttendance: { type: Number, min: 1, max: 10, required: true },
    collaboration: { type: Number, min: 1, max: 10, required: true },
    initiative: { type: Number, min: 1, max: 10, required: true },
  },
  { _id: false }
);

const commentsSchema = new mongoose.Schema(
  {
    technicalSkill: { type: String, default: "", trim: true },
    communication: { type: String, default: "", trim: true },
    punctualityAttendance: { type: String, default: "", trim: true },
    collaboration: { type: String, default: "", trim: true },
    initiative: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const weightsSchema = new mongoose.Schema(
  {
    technicalSkill: { type: Number, default: 30 },
    communication: { type: Number, default: 20 },
    punctualityAttendance: { type: Number, default: 20 },
    collaboration: { type: Number, default: 15 },
    initiative: { type: Number, default: 15 },
  },
  { _id: false }
);

const evaluationSchema = new mongoose.Schema(
  {
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

    milestone: {
      type: String,
      default: "Mid-Internship",
      trim: true,
    },

    criteria: {
      type: criteriaSchema,
      required: true,
    },

    comments: {
      type: commentsSchema,
      default: () => ({}),
    },

    weights: {
      type: weightsSchema,
      default: () => ({}),
    },

    // Weighted total, expressed on a 0-100 scale
    // (weighted 1-10 average multiplied by 10)
    totalScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    status: {
      type: String,
      enum: ["submitted"],
      default: "submitted",
    },

    evaluationDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// One evaluation per intern / mentor / milestone.
// Editing an existing evaluation updates this record instead
// of creating a duplicate.
evaluationSchema.index(
  { internId: 1, mentorId: 1, milestone: 1 },
  { unique: true }
);

module.exports = mongoose.model("Evaluation", evaluationSchema);
