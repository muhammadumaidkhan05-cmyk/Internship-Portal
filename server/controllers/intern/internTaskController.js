const Task = require("../../models/Task");
const Submission = require("../../models/mentor/Submission");
const User = require("../../models/User");
const Notification = require("../../models/Notification");

const {
  onTaskSubmitted,
} = require("../../services/workflowService");

// ============================================================
// INTERN TASK & SUBMISSION CONTROLLER
// This is the hand-off point into the Mentor module: creating a
// Submission here is what puts the work into the mentor's queue.
// ============================================================

const SUBMITTABLE_STATUSES = ["Assigned", "In Progress", "Resubmit"];

// ============================================================
// TASK LIST
// ============================================================

const getMyTasks = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = { assignedTo: req.user._id };

    if (status) filter.status = status;

    const tasks = await Task.find(filter).sort({
      deadline: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load your tasks.",
      error: error.message,
    });
  }
};

// ============================================================
// TASK DETAIL (page 8)
// ============================================================

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      assignedTo: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or it is not assigned to you.",
      });
    }

    const submissions = await Submission.find({
      taskId: task._id,
      internId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: {
        task,
        submissions,
        latestSubmission: submissions[0] || null,
        canSubmit: SUBMITTABLE_STATUSES.includes(task.status),
      },
    });
  } catch (error) {
    console.error("Get task error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load the task.",
      error: error.message,
    });
  }
};

// ============================================================
// SUBMIT A TASK  (page 8 -> mentor page 16)
// ============================================================

const submitTask = async (req, res) => {
  try {
    const { description, githubUrl, liveUrl, attachments } = req.body;

    const task = await Task.findOne({
      _id: req.params.taskId,
      assignedTo: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or it is not assigned to you.",
      });
    }

    if (!SUBMITTABLE_STATUSES.includes(task.status)) {
      return res.status(409).json({
        success: false,
        message:
          task.status === "Submitted"
            ? "This task is already awaiting mentor review."
            : "This task has already been approved.",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please describe what you completed for this task.",
      });
    }

    const intern = await User.findById(req.user._id);

    const mentorId = task.mentorId || intern.mentorId;

    if (!mentorId) {
      return res.status(409).json({
        success: false,
        message:
          "You do not have a mentor assigned yet, so this task cannot be submitted for review.",
      });
    }

    const previousAttempts = await Submission.countDocuments({
      taskId: task._id,
      internId: intern._id,
    });

    const normalisedAttachments = Array.isArray(attachments)
      ? attachments
          .filter((file) => file && (file.name || file.url))
          .map((file) => ({
            name: String(file.name || "Attachment").trim(),
            url: String(file.url || "").trim(),
          }))
      : [];

    const submission = await Submission.create({
      taskId: task._id,
      internId: intern._id,
      internName: intern.name,
      mentorId,
      programName: task.projectName || intern.projectName || "",
      projectId: task.projectId || intern.projectId || null,
      taskTitle: task.title,
      description: description.trim(),
      githubUrl: (githubUrl || "").trim(),
      liveUrl: (liveUrl || "").trim(),
      attachments: normalisedAttachments,
      attempt: previousAttempts + 1,
      status: "pending",
      submittedAt: new Date(),
    });

    await onTaskSubmitted({ task, submission });

    return res.status(201).json({
      success: true,
      message: "Task submitted. Your mentor has been notified.",
      data: {
        task,
        submission,
      },
    });
  } catch (error) {
    console.error("Submit task error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit the task.",
      error: error.message,
    });
  }
};

// ============================================================
// MARK A TASK AS IN PROGRESS
// ============================================================

const startTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      assignedTo: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or it is not assigned to you.",
      });
    }

    if (task.status === "Assigned") {
      task.status = "In Progress";
      await task.save();
    }

    return res.status(200).json({
      success: true,
      message: "Task marked as in progress.",
      data: task,
    });
  } catch (error) {
    console.error("Start task error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update the task.",
      error: error.message,
    });
  }
};

// ============================================================
// SUBMISSION STATUS (page 9)
// ============================================================

const STATUS_LABELS = {
  pending: "Pending",
  approved: "Approved",
  resubmission_required: "Resubmit",
};

const getMySubmissions = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = { internId: req.user._id };

    if (status) filter.status = status;

    const submissions = await Submission.find(filter).sort({
      createdAt: -1,
    });

    const decorated = submissions.map((submission) => ({
      ...submission.toObject(),
      statusLabel: STATUS_LABELS[submission.status] || submission.status,
      needsAction: submission.status === "resubmission_required",
    }));

    return res.status(200).json({
      success: true,
      count: decorated.length,
      data: decorated,
      summary: {
        pending: submissions.filter((item) => item.status === "pending").length,
        approved: submissions.filter((item) => item.status === "approved")
          .length,
        resubmit: submissions.filter(
          (item) => item.status === "resubmission_required"
        ).length,
      },
    });
  } catch (error) {
    console.error("Get submissions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load your submissions.",
      error: error.message,
    });
  }
};

const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findOne({
      _id: req.params.id,
      internId: req.user._id,
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    const task = submission.taskId
      ? await Task.findById(submission.taskId)
      : null;

    return res.status(200).json({
      success: true,
      data: {
        ...submission.toObject(),
        statusLabel: STATUS_LABELS[submission.status] || submission.status,
        task,
      },
    });
  } catch (error) {
    console.error("Get submission error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load the submission.",
      error: error.message,
    });
  }
};

// ============================================================
// NOTIFICATIONS
// ============================================================

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount: notifications.filter((item) => !item.isRead).length,
      data: notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load notifications.",
      error: error.message,
    });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error("Mark notification read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update the notification.",
      error: error.message,
    });
  }
};

const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );

    const notifications = await Notification.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
      data: notifications,
    });
  } catch (error) {
    console.error("Mark all notifications read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update notifications.",
      error: error.message,
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted.",
    });
  } catch (error) {
    console.error("Delete notification error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete the notification.",
      error: error.message,
    });
  }
};

module.exports = {
  getMyTasks,
  getTaskById,
  submitTask,
  startTask,
  getMySubmissions,
  getSubmissionById,
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
};
