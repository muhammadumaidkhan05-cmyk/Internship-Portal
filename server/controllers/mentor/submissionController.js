const mongoose = require("mongoose");
const Submission = require("../../models/mentor/Submission");
const { notifyIntern, notifyMentor } = require("../../utils/mentorNotify");
const { demoSubmissions } = require("../../utils/demoData");
const { onSubmissionReviewed } = require("../../services/workflowService");

// ============================================================
// GET SUBMISSIONS (queue)
// ============================================================

const getSubmissions = async (req, res) => {
  try {
    const mentorId = req.user._id;
    const { status } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let filtered = demoSubmissions;
      if (status) {
        filtered = demoSubmissions.filter((s) => s.status === status);
      }
      return res.status(200).json({
        success: true,
        count: filtered.length,
        data: filtered,
      });
    }

    const filter = { mentorId };

    if (status) {
      filter.status = status;
    }

    const submissions = await Submission.find(filter).sort({
      submittedAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    console.error("Get submissions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch submissions.",
      error: error.message,
    });
  }
};

// ============================================================
// GET SINGLE SUBMISSION
// ============================================================

const getSubmissionById = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const sub = demoSubmissions.find((s) => s._id === req.params.id);
      if (!sub) {
        return res.status(404).json({
          success: false,
          message: "Submission not found.",
        });
      }
      return res.status(200).json({
        success: true,
        data: sub,
      });
    }

    const submission = await Submission.findOne({
      _id: req.params.id,
      mentorId: req.user._id,
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    console.error("Get submission error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch submission.",
      error: error.message,
    });
  }
};

// ============================================================
// SHARED REVIEW LOGIC
// ============================================================

const applyReview = async ({
  submission,
  mentor,
  status,
  score,
  feedback,
}) => {
  submission.status = status;
  submission.feedback = feedback || "";
  submission.reviewedBy = mentor._id;
  submission.reviewedAt = new Date();

  if (status === "approved") {
    submission.score = score;
  }

  submission.history = submission.history || [];
  submission.history.push({
    status,
    score: status === "approved" ? score : null,
    feedback: feedback || "",
    reviewedBy: mentor._id,
    reviewedAt: new Date(),
  });

  if (typeof submission.save === "function") {
    await submission.save();
  }

  // Keep the Task (Intern + Project Manager view) in step with
  // the review decision recorded here.
  await onSubmissionReviewed(submission);

  const isApproved = status === "approved";

  await notifyIntern({
    internId: submission.internId,
    title: isApproved ? "Submission Approved" : "Resubmission Requested",
    message: isApproved
      ? `Your submission "${submission.taskTitle}" was approved by ${mentor.name}.`
      : `Your submission "${submission.taskTitle}" needs changes. Feedback from ${mentor.name}: ${feedback || "See mentor comments."}`,
    type: "Evaluation",
    relatedId: submission._id,
    relatedType: "task",
    link: `/intern/submissions/${submission._id}`,
  });

  await notifyMentor({
    mentorId: mentor._id,
    title: isApproved ? "Submission Approved" : "Resubmission Requested",
    message: `${submission.internName}'s "${submission.taskTitle}" was ${
      isApproved ? "approved" : "sent back for resubmission"
    }.`,
    type: "Submission",
    sourceType: "Submission",
    sourceId: submission._id,
    relatedId: submission._id,
    relatedName: submission.taskTitle,
    createdBy: mentor.name,
  });

  return submission;
};

// ============================================================
// GENERIC REVIEW (PATCH)
// ============================================================

const reviewSubmission = async (req, res) => {
  try {
    const { status, score, feedback } = req.body;

    if (!["approved", "resubmission_required"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'approved' or 'resubmission_required'.",
      });
    }

    let submission;
    if (mongoose.connection.readyState !== 1) {
      submission = demoSubmissions.find((s) => s._id === req.params.id);
    } else {
      submission = await Submission.findOne({
        _id: req.params.id,
        mentorId: req.user._id,
      });
    }

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    if (status === "approved") {
      const numericScore = Number(score);

      if (!Number.isFinite(numericScore) || numericScore < 0 || numericScore > 100) {
        return res.status(400).json({
          success: false,
          message: "Score must be a number between 0 and 100.",
        });
      }
    }

    const updated = await applyReview({
      submission,
      mentor: req.user,
      status,
      score: Number(score),
      feedback,
    });

    return res.status(200).json({
      success: true,
      message: "Submission reviewed successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Review submission error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to review submission.",
      error: error.message,
    });
  }
};

// ============================================================
// APPROVE
// ============================================================

const approveSubmission = async (req, res) => {
  try {
    const { score, feedback } = req.body;
    const numericScore = Number(score);

    if (!Number.isFinite(numericScore) || numericScore < 0 || numericScore > 100) {
      return res.status(400).json({
        success: false,
        message: "Score must be a number between 0 and 100.",
      });
    }

    let submission;
    if (mongoose.connection.readyState !== 1) {
      submission = demoSubmissions.find((s) => s._id === req.params.id);
    } else {
      submission = await Submission.findOne({
        _id: req.params.id,
        mentorId: req.user._id,
      });
    }

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    if (submission.status === "approved") {
      return res.status(409).json({
        success: false,
        message: "This submission has already been approved.",
      });
    }

    const updated = await applyReview({
      submission,
      mentor: req.user,
      status: "approved",
      score: numericScore,
      feedback,
    });

    return res.status(200).json({
      success: true,
      message: "Submission approved successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Approve submission error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to approve submission.",
      error: error.message,
    });
  }
};

// ============================================================
// REQUEST RESUBMISSION
// ============================================================

const requestResubmission = async (req, res) => {
  try {
    const { feedback } = req.body;

    if (!feedback || !feedback.trim()) {
      return res.status(400).json({
        success: false,
        message: "Feedback is required when requesting a resubmission.",
      });
    }

    let submission;
    if (mongoose.connection.readyState !== 1) {
      submission = demoSubmissions.find((s) => s._id === req.params.id);
    } else {
      submission = await Submission.findOne({
        _id: req.params.id,
        mentorId: req.user._id,
      });
    }

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    const updated = await applyReview({
      submission,
      mentor: req.user,
      status: "resubmission_required",
      score: null,
      feedback,
    });

    return res.status(200).json({
      success: true,
      message: "Resubmission requested successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Request resubmission error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to request resubmission.",
      error: error.message,
    });
  }
};

module.exports = {
  getSubmissions,
  getSubmissionById,
  reviewSubmission,
  approveSubmission,
  requestResubmission,
};
