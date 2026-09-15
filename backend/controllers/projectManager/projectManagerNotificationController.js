const ProjectManagerNotification =
  require(
    "../../models/projectManager/ProjectManagerNotification"
  );

const Announcement =
  require("../../models/Announcement");

// ============================================================
// SYNC EXISTING PROGRAM MANAGER ANNOUNCEMENTS
// ============================================================

const syncProgramManagerAnnouncements =
  async () => {
    const announcements =
      await Announcement.find({
        createdBy: "Program Manager",
      }).sort({
        createdAt: -1,
      });

    for (const announcement of announcements) {
      const announcementId =
        String(announcement._id);

      // Check whether this announcement
      // already has a PM notification
      const existingNotification =
        await ProjectManagerNotification.findOne({
          sourceType: "Announcement",
          sourceId: announcementId,
          targetRole: "Project Manager",
        });

      // Do not create duplicate notifications
      if (existingNotification) {
        continue;
      }

      await ProjectManagerNotification.create({
        title: announcement.title,

        message: announcement.description,

        type: "Announcement",

        priority:
          announcement.priority ||
          "Medium",

        targetRole:
          "Project Manager",

        sourceRole:
          "Program Manager",

        sourceType:
          "Announcement",

        sourceId:
          announcementId,

        relatedId:
          announcementId,

        relatedName:
          "Program Announcement",

        createdBy:
          "Program Manager",

        isRead: false,
      });
    }
  };

// ============================================================
// GET PROJECT MANAGER NOTIFICATIONS
// ============================================================

const getNotifications = async (
  req,
  res
) => {
  try {
    // Sync old announcements first.
    // This makes previously created announcements
    // visible to Project Manager as notifications.
    await syncProgramManagerAnnouncements();

    const notifications =
      await ProjectManagerNotification.find({
        targetRole: {
          $in: [
            "Project Manager",
            "All",
          ],
        },
      }).sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count:
        notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error(
      "Get Project Manager notifications error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch notifications.",
      error: error.message,
    });
  }
};

// ============================================================
// CREATE NOTIFICATION
// ============================================================

const createNotification = async (
  req,
  res
) => {
  try {
    const {
      title,
      message,
      type,
      priority,
      targetRole,
      sourceRole,
      sourceType,
      sourceId,
      relatedId,
      relatedName,
      createdBy,
    } = req.body;

    if (
      !title ||
      !String(title).trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Notification title is required.",
      });
    }

    if (
      !message ||
      !String(message).trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Notification message is required.",
      });
    }

    const notification =
      await ProjectManagerNotification.create(
        {
          title:
            String(title).trim(),

          message:
            String(message).trim(),

          type:
            type || "System",

          priority:
            priority || "Medium",

          targetRole:
            targetRole ||
            "Project Manager",

          sourceRole:
            sourceRole || "System",

          sourceType:
            sourceType || "System",

          sourceId:
            sourceId
              ? String(sourceId)
              : "",

          relatedId:
            relatedId
              ? String(relatedId)
              : "",

          relatedName:
            relatedName
              ? String(
                  relatedName
                ).trim()
              : "",

          createdBy:
            createdBy || "System",

          isRead: false,
        }
      );

    return res.status(201).json({
      success: true,
      message:
        "Notification created successfully.",
      data: notification,
    });
  } catch (error) {
    console.error(
      "Create Project Manager notification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create notification.",
      error: error.message,
    });
  }
};

// ============================================================
// UPDATE NOTIFICATION
// ============================================================

const updateNotification = async (
  req,
  res
) => {
  try {
    const notification =
      await ProjectManagerNotification.findOne(
        {
          _id: req.params.id,

          targetRole: {
            $in: [
              "Project Manager",
              "All",
            ],
          },
        }
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message:
          "Notification not found.",
      });
    }

    const {
      title,
      message,
      type,
      priority,
      relatedId,
      relatedName,
      createdBy,
    } = req.body;

    if (title !== undefined) {
      notification.title =
        String(title).trim();
    }

    if (message !== undefined) {
      notification.message =
        String(message).trim();
    }

    if (type !== undefined) {
      notification.type = type;
    }

    if (priority !== undefined) {
      notification.priority =
        priority;
    }

    if (relatedId !== undefined) {
      notification.relatedId =
        relatedId;
    }

    if (
      relatedName !== undefined
    ) {
      notification.relatedName =
        String(
          relatedName
        ).trim();
    }

    if (createdBy !== undefined) {
      notification.createdBy =
        createdBy;
    }

    const updatedNotification =
      await notification.save();

    return res.status(200).json({
      success: true,
      message:
        "Notification updated successfully.",
      data: updatedNotification,
    });
  } catch (error) {
    console.error(
      "Update Project Manager notification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update notification.",
      error: error.message,
    });
  }
};

// ============================================================
// MARK ONE AS READ
// ============================================================

const markAsRead = async (
  req,
  res
) => {
  try {
    const notification =
      await ProjectManagerNotification.findOne(
        {
          _id: req.params.id,

          targetRole: {
            $in: [
              "Project Manager",
              "All",
            ],
          },
        }
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message:
          "Notification not found.",
      });
    }

    notification.isRead = true;

    const updatedNotification =
      await notification.save();

    return res.status(200).json({
      success: true,
      message:
        "Notification marked as read.",
      data: updatedNotification,
    });
  } catch (error) {
    console.error(
      "Mark notification as read error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update notification.",
      error: error.message,
    });
  }
};

// ============================================================
// MARK ALL AS READ
// ============================================================

const markAllAsRead = async (
  req,
  res
) => {
  try {
    await ProjectManagerNotification.updateMany(
      {
        targetRole: {
          $in: [
            "Project Manager",
            "All",
          ],
        },

        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    const notifications =
      await ProjectManagerNotification.find(
        {
          targetRole: {
            $in: [
              "Project Manager",
              "All",
            ],
          },
        }
      ).sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message:
        "All notifications marked as read.",
      data: notifications,
    });
  } catch (error) {
    console.error(
      "Mark all notifications as read error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to mark all notifications as read.",
      error: error.message,
    });
  }
};

// ============================================================
// DELETE NOTIFICATION
// ============================================================

const deleteNotification =
  async (req, res) => {
    try {
      const notification =
        await ProjectManagerNotification.findOne(
          {
            _id: req.params.id,

            targetRole: {
              $in: [
                "Project Manager",
                "All",
              ],
            },
          }
        );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found.",
        });
      }

      await ProjectManagerNotification.findByIdAndDelete(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message:
          "Notification deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete notification error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete notification.",
        error: error.message,
      });
    }
  };

// ============================================================
// CREATE PROGRAM MANAGER ANNOUNCEMENT NOTIFICATION
// ============================================================

const createProjectManagerAnnouncementNotification =
  async ({
    title,
    message,
    priority = "Medium",
    sourceRole =
      "Program Manager",
    sourceId = "",
    createdBy =
      "Program Manager",
  }) => {
    return ProjectManagerNotification.create(
      {
        title:
          String(title).trim(),

        message:
          String(message).trim(),

        type:
          "Announcement",

        priority,

        targetRole:
          "Project Manager",

        sourceRole,

        sourceType:
          "Announcement",

        sourceId:
          sourceId
            ? String(sourceId)
            : "",

        relatedId:
          sourceId
            ? String(sourceId)
            : "",

        relatedName:
          "Program Announcement",

        createdBy,

        isRead: false,
      }
    );
  };

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  getNotifications,
  createNotification,
  updateNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,

  createProjectManagerAnnouncementNotification,
};