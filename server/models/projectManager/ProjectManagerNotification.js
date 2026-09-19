
const mongoose = require("mongoose");

const projectManagerNotificationSchema =
  new mongoose.Schema(
    {
      // ============================================================
      // NOTIFICATION CONTENT
      // ============================================================

      title: {
        type: String,
        required: [
          true,
          "Notification title is required",
        ],
        trim: true,
      },

      message: {
        type: String,
        required: [
          true,
          "Notification message is required",
        ],
        trim: true,
      },

      // ============================================================
      // NOTIFICATION TYPE
      // ============================================================

      type: {
        type: String,
        enum: [
          "Announcement",
          "Project",
          "Task",
          "Team",
          "Scrum",
          "System",
          "Alert",
        ],
        default: "System",
      },

      // ============================================================
      // PRIORITY
      // ============================================================

      priority: {
        type: String,
        enum: [
          "Low",
          "Medium",
          "High",
        ],
        default: "Medium",
      },

      // ============================================================
      // RECIPIENT
      // ============================================================

      targetRole: {
        type: String,
        enum: [
          "Admin",
          "Program Manager",
          "Project Manager",
          "Mentor",
          "Intern",
          "All",
        ],
        default: "Project Manager",
        index: true,
      },

      // ============================================================
      // SOURCE
      // ============================================================

      sourceRole: {
        type: String,
        enum: [
          "Admin",
          "Program Manager",
          "Project Manager",
          "Mentor",
          "System",
        ],
        default: "System",
      },

      sourceType: {
        type: String,
        enum: [
          "Announcement",
          "Project",
          "Task",
          "Team",
          "Scrum",
          "System",
        ],
        default: "System",
      },

      sourceId: {
        type: String,
        default: "",
      },

      // ============================================================
      // RELATED RECORD
      // ============================================================

      relatedId: {
        type: String,
        default: "",
      },

      relatedName: {
        type: String,
        default: "",
        trim: true,
      },

      // ============================================================
      // CREATED BY
      // ============================================================

      createdBy: {
        type: String,
        default: "System",
        trim: true,
      },

      // ============================================================
      // READ STATUS
      // ============================================================

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

module.exports =
  mongoose.model(
    "ProjectManagerNotification",
    projectManagerNotificationSchema
  );

