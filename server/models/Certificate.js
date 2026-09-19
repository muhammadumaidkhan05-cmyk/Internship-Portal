const mongoose = require("mongoose");

// ============================================================
// CERTIFICATE SCHEMA
// Issued automatically at the end of the workflow once a final
// performance evaluation exists and every assigned task has
// been approved.
// ============================================================

const certificateSchema = new mongoose.Schema(
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

    title: {
      type: String,
      required: true,
    },

    programName: {
      type: String,
      default: "",
      trim: true,
    },

    issuedBy: {
      type: String,
      default: "MSN Academy",
    },

    issuedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    issueDate: {
      type: String,
      default: "",
    },

    certificateId: {
      type: String,
      default: "",
      index: true,
    },

    finalScore: {
      type: Number,
      default: null,
    },

    certificateUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Certificate", certificateSchema);
