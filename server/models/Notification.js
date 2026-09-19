const mongoose = require("mongoose");

// ============================================================
// UNIFIED NOTIFICATION SCHEMA
// The intern branch addressed notifications with `userId`, the
// mentor branch with `recipientId`. Both field names are kept
// and mirrored so every existing page keeps working while a
// single collection powers the whole portal.
// ============================================================

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // String mirror of userId (mentor module writes/reads this).
    recipientId: {
      type: String,
      default: "",
      index: true,
    },

    recipientRole: {
      type: String,
      default: "intern",
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      default: "General",
    },

    relatedId: {
      type: String,
      default: "",
    },

    relatedType: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "",
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    createdBy: {
      type: String,
      default: "System",
    },

    senderRole: {
      type: String,
      default: "System",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// The intern layout counts `notification.unread === true`.
notificationSchema.virtual("unread").get(function readFlag() {
  return this.isRead === false;
});

// Keep userId and recipientId in sync whichever one was supplied.
notificationSchema.pre("validate", function mirrorRecipient(next) {
  if (!this.userId && this.recipientId) {
    if (mongoose.Types.ObjectId.isValid(this.recipientId)) {
      this.userId = new mongoose.Types.ObjectId(this.recipientId);
    }
  }

  if (this.userId) {
    this.recipientId = String(this.userId);
  }

  next();
});

module.exports =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
