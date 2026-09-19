const mongoose = require("mongoose");
const Evaluation = require("../../models/mentor/Evaluation");
const InternAssignment = require("../../models/mentor/InternAssignment");
const { notifyIntern, notifyMentor } = require("../../utils/mentorNotify");
const { demoEvaluations, demoAssignments } = require("../../utils/demoData");
const {
  onEvaluationCompleted,
  issueCertificateIfEligible,
} = require("../../services/workflowService");

const DEFAULT_WEIGHTS = {
  technicalSkill: 30,
  communication: 20,
  punctualityAttendance: 20,
  collaboration: 15,
  initiative: 15,
};

const CRITERIA_KEYS = Object.keys(DEFAULT_WEIGHTS);

// ============================================================
// VALIDATE + COMPUTE TOTAL SCORE SERVER-SIDE
// ============================================================

const computeTotalScore = (criteria, weights) => {
  const weightedSum = CRITERIA_KEYS.reduce((sum, key) => {
    const score = Number(criteria[key]);
    const weight = Number(weights[key]) / 100;

    return sum + score * weight;
  }, 0);

  return Math.round(weightedSum * 10 * 10) / 10;
};

const validateCriteria = (criteria) => {
  if (!criteria || typeof criteria !== "object") {
    return "Criteria scores are required.";
  }

  for (const key of CRITERIA_KEYS) {
    const value = Number(criteria[key]);

    if (!Number.isFinite(value) || value < 1 || value > 10) {
      return `${key} must be a number between 1 and 10.`;
    }
  }

  return null;
};

// ============================================================
// GET ALL EVALUATIONS (for this mentor)
// ============================================================

const getEvaluations = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: demoEvaluations.length,
        data: demoEvaluations,
      });
    }

    const evaluations = await Evaluation.find({
      mentorId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: evaluations.length,
      data: evaluations,
    });
  } catch (error) {
    console.error("Get evaluations error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch evaluations.",
      error: error.message,
    });
  }
};

// ============================================================
// GET EVALUATION(S) FOR A SPECIFIC INTERN
// ============================================================

const getEvaluationsByIntern = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const filtered = demoEvaluations.filter(
        (e) => String(e.internId) === String(req.params.internId)
      );
      return res.status(200).json({
        success: true,
        count: filtered.length,
        data: filtered,
      });
    }

    const evaluations = await Evaluation.find({
      mentorId: req.user._id,
      internId: req.params.internId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: evaluations.length,
      data: evaluations,
    });
  } catch (error) {
    console.error("Get intern evaluations error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch evaluations for this intern.",
      error: error.message,
    });
  }
};

// ============================================================
// CREATE EVALUATION
// ============================================================

const createEvaluation = async (req, res) => {
  try {
    const mentorId = req.user._id;
    const { internId, internName, programName, milestone, criteria, comments } =
      req.body;

    if (!internId) {
      return res.status(400).json({
        success: false,
        message: "Intern is required.",
      });
    }

    const validationError = validateCriteria(criteria);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    if (mongoose.connection.readyState !== 1) {
      const totalScore = computeTotalScore(criteria, DEFAULT_WEIGHTS);
      const newEval = {
        _id: `eval-${Date.now()}`,
        internId,
        internName: internName || "Assigned Intern",
        mentorId,
        programName: programName || "IMP Portal Build",
        milestone: milestone || "Mid-Internship",
        criteria,
        comments: comments || {},
        weights: DEFAULT_WEIGHTS,
        totalScore,
        evaluationDate: new Date().toISOString(),
      };
      demoEvaluations.push(newEval);
      return res.status(201).json({
        success: true,
        message: "Evaluation submitted successfully.",
        data: newEval,
      });
    }

    // Confirm this intern is actually assigned to this mentor
    const assignment = await InternAssignment.findOne({
      mentorId,
      internId,
    });

    if (!assignment) {
      return res.status(403).json({
        success: false,
        message: "This intern is not assigned to you.",
      });
    }

    const finalMilestone = milestone || assignment.milestone;

    const existing = await Evaluation.findOne({
      mentorId,
      internId,
      milestone: finalMilestone,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          "An evaluation already exists for this intern and milestone. Use update instead.",
        data: existing,
      });
    }

    const totalScore = computeTotalScore(criteria, DEFAULT_WEIGHTS);

    const evaluation = await Evaluation.create({
      internId,
      internName: internName || assignment.internName,
      mentorId,
      programName: programName || assignment.programName,
      milestone: finalMilestone,
      criteria,
      comments: comments || {},
      weights: DEFAULT_WEIGHTS,
      totalScore,
      evaluationDate: new Date(),
    });

    await notifyIntern({
      internId,
      title: "Performance Evaluation Submitted",
      message: `Your ${finalMilestone} evaluation has been submitted by ${req.user.name}. Total score: ${totalScore}/100.`,
      type: "Evaluation",
      relatedId: evaluation._id,
      relatedType: "evaluation",
      link: `/intern/evaluations/${evaluation._id}`,
    });

    await notifyMentor({
      mentorId,
      title: "Evaluation Submitted",
      message: `You submitted the ${finalMilestone} evaluation for ${evaluation.internName}.`,
      type: "Evaluation",
      sourceType: "Evaluation",
      sourceId: evaluation._id,
      relatedId: evaluation._id,
      relatedName: evaluation.internName,
      createdBy: req.user.name,
    });

    // Evaluation completed -> intern notified, and a certificate
    // is issued when every assigned task has been approved.
    const certificate = await onEvaluationCompleted({
      evaluation,
      mentor: req.user,
    });

    return res.status(201).json({
      success: true,
      message: certificate
        ? "Evaluation submitted and the internship certificate has been issued."
        : "Evaluation submitted successfully.",
      data: evaluation,
      certificate: certificate || null,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An evaluation already exists for this intern and milestone.",
      });
    }

    console.error("Create evaluation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit evaluation.",
      error: error.message,
    });
  }
};

// ============================================================
// UPDATE EVALUATION
// ============================================================

const updateEvaluation = async (req, res) => {
  try {
    const { criteria, comments } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const evaluation = demoEvaluations.find((e) => e._id === req.params.id);
      if (!evaluation) {
        return res.status(404).json({
          success: false,
          message: "Evaluation not found.",
        });
      }
      if (criteria !== undefined) {
        evaluation.criteria = criteria;
        evaluation.totalScore = computeTotalScore(criteria, DEFAULT_WEIGHTS);
      }
      if (comments !== undefined) {
        evaluation.comments = { ...evaluation.comments, ...comments };
      }
      return res.status(200).json({
        success: true,
        message: "Evaluation updated successfully.",
        data: evaluation,
      });
    }

    const evaluation = await Evaluation.findOne({
      _id: req.params.id,
      mentorId: req.user._id,
    });

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: "Evaluation not found.",
      });
    }

    if (criteria !== undefined) {
      const validationError = validateCriteria(criteria);

      if (validationError) {
        return res.status(400).json({
          success: false,
          message: validationError,
        });
      }

      evaluation.criteria = criteria;
      evaluation.totalScore = computeTotalScore(
        criteria,
        evaluation.weights || DEFAULT_WEIGHTS
      );
    }

    if (comments !== undefined) {
      evaluation.comments = {
        ...evaluation.comments.toObject(),
        ...comments,
      };
    }

    evaluation.evaluationDate = new Date();

    await evaluation.save();

    const certificate = await issueCertificateIfEligible({
      internId: evaluation.internId,
      issuedBy: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message: "Evaluation updated successfully.",
      data: evaluation,
      certificate: certificate || null,
    });
  } catch (error) {
    console.error("Update evaluation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update evaluation.",
      error: error.message,
    });
  }
};

module.exports = {
  getEvaluations,
  getEvaluationsByIntern,
  createEvaluation,
  updateEvaluation,
};
