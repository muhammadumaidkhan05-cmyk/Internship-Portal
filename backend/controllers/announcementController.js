const Announcement = require("../models/Announcement");

// ============================================================
// PROJECT MANAGER NOTIFICATION HELPER
// ============================================================

const {
  createProjectManagerAnnouncementNotification,
} = require(
  "./projectManager/projectManagerNotificationController"
);

// ============================================================
// CREATE ANNOUNCEMENT
// ============================================================

const createAnnouncement = async (req, res) => {
  try {
    const {
      title,
      description,
      audience,
      priority,
      status,
      date,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Announcement title is required.",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Announcement description is required.",
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Announcement date is required.",
      });
    }

    const announcement =
      await Announcement.create({
        title: title.trim(),
        description: description.trim(),
        audience:
          audience || "All Interns",
        priority:
          priority || "Medium",
        status:
          status || "Published",
        date,
        createdBy:
          "Program Manager",
      });

    // ========================================================
    // SEND NOTIFICATION TO PROJECT MANAGER
    // ========================================================

    try {
      await createProjectManagerAnnouncementNotification({
        title:
          announcement.title,

        message:
          announcement.description,

        priority:
          announcement.priority ||
          "Medium",

        sourceRole:
          "Program Manager",

        sourceId:
          announcement._id,

        createdBy:
          "Program Manager",
      });
    } catch (notificationError) {
      // Announcement should still be created
      // even if notification creation fails.
      console.error(
        "Project Manager Notification Error:",
        notificationError
      );
    }

    return res.status(201).json({
      success: true,
      message:
        "Announcement created successfully.",
      data: announcement,
    });
  } catch (error) {
    console.error(
      "Create Announcement Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create announcement.",
      error: error.message,
    });
  }
};

// ============================================================
// GET ALL ANNOUNCEMENTS
// ============================================================

const getAnnouncements = async (req, res) => {
  try {
    const announcements =
      await Announcement.find().sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    console.error(
      "Get Announcements Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch announcements.",
      error: error.message,
    });
  }
};

// ============================================================
// GET SINGLE ANNOUNCEMENT
// ============================================================

const getAnnouncementById = async (
  req,
  res
) => {
  try {
    const announcement =
      await Announcement.findById(
        req.params.id
      );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message:
          "Announcement not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    console.error(
      "Get Announcement Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch announcement.",
      error: error.message,
    });
  }
};

// ============================================================
// UPDATE ANNOUNCEMENT
// ============================================================

const updateAnnouncement = async (
  req,
  res
) => {
  try {
    const {
      title,
      description,
      audience,
      priority,
      status,
      date,
    } = req.body;

    const announcement =
      await Announcement.findById(
        req.params.id
      );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message:
          "Announcement not found.",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Announcement title is required.",
      });
    }

    if (
      !description ||
      !description.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Announcement description is required.",
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message:
          "Announcement date is required.",
      });
    }

    announcement.title =
      title.trim();

    announcement.description =
      description.trim();

    announcement.audience =
      audience ||
      announcement.audience;

    announcement.priority =
      priority ||
      announcement.priority;

    announcement.status =
      status ||
      announcement.status;

    announcement.date = date;

    const updatedAnnouncement =
      await announcement.save();

    return res.status(200).json({
      success: true,
      message:
        "Announcement updated successfully.",
      data: updatedAnnouncement,
    });
  } catch (error) {
    console.error(
      "Update Announcement Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update announcement.",
      error: error.message,
    });
  }
};

// ============================================================
// DELETE ANNOUNCEMENT
// ============================================================

const deleteAnnouncement = async (
  req,
  res
) => {
  try {
    const announcement =
      await Announcement.findById(
        req.params.id
      );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message:
          "Announcement not found.",
      });
    }

    await announcement.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Announcement deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Announcement Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete announcement.",
      error: error.message,
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
};