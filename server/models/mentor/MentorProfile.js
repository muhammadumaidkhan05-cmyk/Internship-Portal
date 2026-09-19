const mongoose = require("mongoose");

// ============================================================
// MENTOR PROFILE SCHEMA
// Mirrors ProjectManagerProfile's pattern, scoped to Mentor.
// ============================================================

const mentorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    department: {
      type: String,
      default: "Mentorship",
      trim: true,
    },

    specialization: {
      type: String,
      default: "",
      trim: true,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
    },

    avatar: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MentorProfile", mentorProfileSchema);
