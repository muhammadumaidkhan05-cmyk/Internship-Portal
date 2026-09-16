const mongoose = require("mongoose");

// ============================================================
// NOTIFICATION SCHEMA
// ============================================================

const notificationSchema = new mongoose.Schema(
  {
    // Custom notification ID
    id: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Notification title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Notification message
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Notification category
    type: {
      type: String,
      enum: [
        "Registration",
        "Cohort",
        "Attendance",
        "Evaluation",
        "Announcement",
        "System",
        "Project",
        "Task",
        "User",
        "Info",
        "general",
        "security",
        "approval",
        "system",
      ],
      default: "Info",
    },

    // Person who should receive notification
    recipientId: {
      type: String,
      default: "",
      trim: true,
    },

    // Role that should receive notification
    recipientRole: {
      type: String,
      default: "",
      trim: true,
    },

    // Related record ID
    relatedId: {
      type: String,
      default: "",
      trim: true,
    },

    // Related module
    relatedType: {
      type: String,
      enum: [
        "project",
        "cohort",
        "task",
        "user",
        "attendance",
        "evaluation",
        "announcement",
        "system",
        "notification",
        "",
      ],
      default: "",
    },

    // Optional frontend route
    link: {
      type: String,
      default: "",
      trim: true,
    },

    // Read / unread
    isRead: {
      type: Boolean,
      default: false,
    },

    // Who created/sent this notification
    createdBy: {
      type: String,
      default: "System",
      trim: true,
    },

    // Sender role
    senderRole: {
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
  "Notification",
  notificationSchema
);