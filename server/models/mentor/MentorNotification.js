const mongoose = require("mongoose");

// ============================================================
// MENTOR NOTIFICATION SCHEMA
// Mirrors ProjectManagerNotification's pattern, scoped to Mentor.
// ============================================================

const mentorNotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
    },

    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "Submission",
        "Evaluation",
        "Task",
        "System",
        "Alert",
      ],
      default: "System",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    // The mentor (User) this notification belongs to
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sourceRole: {
      type: String,
      enum: ["Mentor", "Intern", "System", "Program Manager"],
      default: "System",
    },

    sourceType: {
      type: String,
      enum: ["Submission", "Evaluation", "Task", "System"],
      default: "System",
    },

    sourceId: {
      type: String,
      default: "",
    },

    relatedId: {
      type: String,
      default: "",
    },

    relatedName: {
      type: String,
      default: "",
      trim: true,
    },

    createdBy: {
      type: String,
      default: "System",
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "MentorNotification",
  mentorNotificationSchema
);
