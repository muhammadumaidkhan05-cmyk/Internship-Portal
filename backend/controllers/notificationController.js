const Notification = require("../models/Notification");

// ============================================================
// CREATE NOTIFICATION
// ============================================================

const createNotification = async (req, res) => {
  try {
    const {
      title,
      message,
      type,
      recipientId,
      recipientRole,
      relatedId,
      relatedType,
      link,
      createdBy,
      senderRole,
    } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Notification title is required.",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Notification message is required.",
      });
    }

    // Create notification
    const notification = await Notification.create({
      id: `notification-${Date.now()}`,

      title: title.trim(),

      message: message.trim(),

      type: type || "Info",

      recipientId: recipientId || "",

      recipientRole: recipientRole || "",

      relatedId: relatedId || "",

      relatedType: relatedType || "",

      link: link || "",

      isRead: false,

      createdBy: createdBy || "System",

      senderRole: senderRole || "",
    });

    return res.status(201).json({
      success: true,
      message: "Notification created successfully.",
      data: notification,
    });
  } catch (error) {
    console.error(
      "Create notification error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create notification.",
      error: error.message,
    });
  }
};

// ============================================================
// GET ALL NOTIFICATIONS
// ============================================================

const getNotifications = async (req, res) => {
  try {
    // No token/authentication required.
    // Empty recipientRole/recipientId means notification
    // is available to everyone.

    const notifications = await Notification.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error(
      "Get notifications error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
      error: error.message,
    });
  }
};

// ============================================================
// GET UNREAD NOTIFICATIONS
// ============================================================

const getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      isRead: false,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error(
      "Get unread notifications error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch unread notifications.",
      error: error.message,
    });
  }
};

// ============================================================
// MARK ONE NOTIFICATION AS READ
// ============================================================

const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        $or: [
          {
            id: req.params.id,
          },
          {
            _id: req.params.id,
          },
        ],
      },
      {
        isRead: true,
      },
      {
        new: true,
      }
    ).catch(() => null);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      data: notification,
    });
  } catch (error) {
    console.error(
      "Mark notification as read error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update notification.",
      error: error.message,
    });
  }
};

// ============================================================
// MARK ONE NOTIFICATION AS UNREAD
// ============================================================

const markNotificationAsUnread = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        $or: [
          {
            id: req.params.id,
          },
          {
            _id: req.params.id,
          },
        ],
      },
      {
        isRead: false,
      },
      {
        new: true,
      }
    ).catch(() => null);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as unread.",
      data: notification,
    });
  } catch (error) {
    console.error(
      "Mark notification as unread error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update notification.",
      error: error.message,
    });
  }
};

// ============================================================
// MARK ALL NOTIFICATIONS AS READ
// ============================================================

const markAllNotificationsAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      {
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(
      "Mark all notifications error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update notifications.",
      error: error.message,
    });
  }
};

// ============================================================
// DELETE NOTIFICATION
// ============================================================

const deleteNotification = async (req, res) => {
  try {
    const notification =
      await Notification.findOneAndDelete({
        $or: [
          {
            id: req.params.id,
          },
          {
            _id: req.params.id,
          },
        ],
      }).catch(() => null);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
      data: notification,
    });
  } catch (error) {
    console.error(
      "Delete notification error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete notification.",
      error: error.message,
    });
  }
};

// ============================================================
// EXPORT CONTROLLERS
// ============================================================

module.exports = {
  createNotification,
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markNotificationAsUnread,
  markAllNotificationsAsRead,
  deleteNotification,
};