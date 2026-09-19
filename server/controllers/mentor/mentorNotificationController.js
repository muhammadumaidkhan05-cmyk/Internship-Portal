const mongoose = require("mongoose");
const MentorNotification = require("../../models/mentor/MentorNotification");
let { demoNotifications } = require("../../utils/demoData");

// ============================================================
// GET NOTIFICATIONS
// ============================================================

const getNotifications = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: demoNotifications.length,
        data: demoNotifications,
      });
    }

    const notifications = await MentorNotification.find({
      recipientId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error("Get mentor notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
      error: error.message,
    });
  }
};

// ============================================================
// MARK ONE AS READ
// ============================================================

const markAsRead = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const item = demoNotifications.find((n) => n._id === req.params.id);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Notification not found.",
        });
      }
      item.isRead = true;
      return res.status(200).json({
        success: true,
        message: "Notification marked as read.",
        data: item,
      });
    }

    const notification = await MentorNotification.findOne({
      _id: req.params.id,
      recipientId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    notification.isRead = true;

    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      data: notification,
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update notification.",
      error: error.message,
    });
  }
};

// ============================================================
// MARK ALL AS READ
// ============================================================

const markAllAsRead = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      demoNotifications.forEach((n) => {
        n.isRead = true;
      });
      return res.status(200).json({
        success: true,
        message: "All notifications marked as read.",
        data: demoNotifications,
      });
    }

    await MentorNotification.updateMany(
      { recipientId: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    const notifications = await MentorNotification.find({
      recipientId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
      data: notifications,
    });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read.",
      error: error.message,
    });
  }
};

// ============================================================
// DELETE NOTIFICATION
// ============================================================

const deleteNotification = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const idx = demoNotifications.findIndex((n) => n._id === req.params.id);
      if (idx === -1) {
        return res.status(404).json({
          success: false,
          message: "Notification not found.",
        });
      }
      demoNotifications.splice(idx, 1);
      return res.status(200).json({
        success: true,
        message: "Notification deleted successfully.",
      });
    }

    const notification = await MentorNotification.findOneAndDelete({
      _id: req.params.id,
      recipientId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    console.error("Delete notification error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete notification.",
      error: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
