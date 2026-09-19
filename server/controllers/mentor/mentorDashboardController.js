const mongoose = require("mongoose");
const InternAssignment = require("../../models/mentor/InternAssignment");
const Submission = require("../../models/mentor/Submission");
const Evaluation = require("../../models/mentor/Evaluation");
const {
  demoAssignments,
  demoSubmissions,
  demoEvaluations,
} = require("../../utils/demoData");

// ============================================================
// GET MENTOR DASHBOARD
// ============================================================

const getDashboard = async (req, res) => {
  try {
    const mentorId = req.user._id;

    // In-memory fallback if MongoDB is not connected
    if (mongoose.connection.readyState !== 1) {
      const pendingSubmissions = demoSubmissions.filter(
        (s) => s.status === "pending"
      );
      const upcomingEvaluations = demoAssignments.slice(0, 4).map((a, i) => ({
        internId: a.internId._id,
        internName: a.internName,
        milestone: a.milestone,
        dueDate: a.milestoneDueDate,
        status: i === 0 ? "Due Soon" : "Upcoming",
      }));

      return res.status(200).json({
        success: true,
        data: {
          stats: {
            pendingReviews: pendingSubmissions.length,
            internsAssigned: demoAssignments.length,
            avgScore: 80,
            evaluationsDue: 2,
          },
          pendingSubmissions,
          upcomingEvaluations,
        },
      });
    }

    // ----------------------------------------------------------
    // PENDING REVIEWS
    // ----------------------------------------------------------

    const pendingReviewsCount = await Submission.countDocuments({
      mentorId,
      status: "pending",
    });

    // ----------------------------------------------------------
    // INTERNS ASSIGNED
    // ----------------------------------------------------------

    const internsAssignedCount = await InternAssignment.countDocuments({
      mentorId,
      status: "Active",
    });

    // ----------------------------------------------------------
    // AVG SCORE (across all evaluations for this mentor's interns)
    // ----------------------------------------------------------

    const evaluations = await Evaluation.find({ mentorId }).select(
      "totalScore"
    );

    const avgScore =
      evaluations.length > 0
        ? Math.round(
            evaluations.reduce(
              (sum, item) => sum + (item.totalScore || 0),
              0
            ) / evaluations.length
          )
        : 0;

    // ----------------------------------------------------------
    // EVALUATIONS DUE
    // Active assignments that don't yet have an evaluation
    // for their current milestone.
    // ----------------------------------------------------------

    const activeAssignments = await InternAssignment.find({
      mentorId,
      status: "Active",
    });

    const evaluatedKeys = new Set(
      (
        await Evaluation.find({ mentorId }).select(
          "internId milestone"
        )
      ).map((item) => `${item.internId}_${item.milestone}`)
    );

    const dueAssignments = activeAssignments.filter(
      (assignment) =>
        !evaluatedKeys.has(
          `${assignment.internId}_${assignment.milestone}`
        )
    );

    // ----------------------------------------------------------
    // PENDING SUBMISSIONS (preview list)
    // ----------------------------------------------------------

    const pendingSubmissions = await Submission.find({
      mentorId,
      status: "pending",
    })
      .sort({ submittedAt: -1 })
      .limit(10);

    // ----------------------------------------------------------
    // UPCOMING EVALUATIONS (preview list)
    // ----------------------------------------------------------

    const upcomingEvaluations = dueAssignments
      .sort(
        (a, b) =>
          new Date(a.milestoneDueDate) - new Date(b.milestoneDueDate)
      )
      .slice(0, 10)
      .map((assignment) => {
        const daysUntilDue = Math.ceil(
          (new Date(assignment.milestoneDueDate) - new Date()) /
            (1000 * 60 * 60 * 24)
        );

        return {
          internId: assignment.internId,
          internName: assignment.internName,
          milestone: assignment.milestone,
          dueDate: assignment.milestoneDueDate,
          status:
            daysUntilDue <= 7 ? "Due Soon" : "Upcoming",
        };
      });

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          pendingReviews: pendingReviewsCount,
          internsAssigned: internsAssignedCount,
          avgScore,
          evaluationsDue: dueAssignments.length,
        },
        pendingSubmissions,
        upcomingEvaluations,
      },
    });
  } catch (error) {
    console.error("Get mentor dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load mentor dashboard.",
      error: error.message,
    });
  }
};

module.exports = { getDashboard };
