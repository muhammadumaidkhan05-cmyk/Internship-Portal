const Task = require("../models/Task");
const Submission = require("../models/mentor/Submission");
const Certificate = require("../models/Certificate");
const Evaluation = require("../models/mentor/Evaluation");
const User = require("../models/User");

const { notifyUser, notifyMentor } = require("./notificationService");
const { ROLES } = require("../constants/roles");

// ============================================================
// WORKFLOW SERVICE
// Owns the transitions that cross module boundaries so that no
// single module has to know the internals of another:
//
//   Task assigned      -> intern notified
//   Task submitted     -> mentor queue + mentor notified
//   Mentor reviewed    -> task status synced + intern notified
//   Evaluation stored  -> certificate eligibility checked
//   Certificate issued -> intern notified
// ============================================================

const SUBMISSION_TO_TASK_STATUS = {
  pending: "Submitted",
  approved: "Approved",
  resubmission_required: "Resubmit",
};

/**
 * Called by the Project Manager module after a task is created
 * or reassigned.
 */
const onTaskAssigned = async (task) => {
  await notifyUser({
    userId: task.assignedTo,
    role: ROLES.INTERN,
    title: "New Task Assigned",
    message: `You have been assigned "${task.title}"${
      task.projectName ? ` on ${task.projectName}` : ""
    }.`,
    type: "Task",
    relatedId: task._id,
    relatedType: "task",
    link: `/intern/tasks/${task._id}`,
    createdBy: task.assignedByName || "Project Manager",
    senderRole: "Project Manager",
  });

  if (task.mentorId) {
    await notifyMentor({
      mentorId: task.mentorId,
      title: "Task Assigned To Your Intern",
      message: `${task.assignedToName || "An intern"} has been assigned "${
        task.title
      }".`,
      type: "Task",
      sourceType: "Task",
      sourceId: task._id,
      relatedId: task._id,
      relatedName: task.title,
      createdBy: task.assignedByName || "Project Manager",
      sourceRole: "System",
    });
  }

  return task;
};

/**
 * Called by the Intern module when a task is submitted (first
 * time or after a resubmission request).
 */
const onTaskSubmitted = async ({ task, submission }) => {
  task.status = "Submitted";
  task.latestSubmissionId = submission._id;
  task.submissionCount = (task.submissionCount || 0) + 1;
  await task.save();

  if (submission.mentorId) {
    await notifyMentor({
      mentorId: submission.mentorId,
      title:
        submission.attempt > 1
          ? "Task Resubmitted For Review"
          : "New Task Submission",
      message: `${submission.internName || "An intern"} submitted "${
        submission.taskTitle
      }" for review.`,
      type: "Submission",
      priority: "High",
      sourceRole: "Intern",
      sourceType: "Submission",
      sourceId: submission._id,
      relatedId: submission._id,
      relatedName: submission.taskTitle,
      createdBy: submission.internName || "Intern",
    });
  }

  return { task, submission };
};

/**
 * Called by the Mentor module after approve / request-resubmission.
 * Keeps the Task (Project Manager + Intern view) in step with the
 * Submission (Mentor view).
 */
const onSubmissionReviewed = async (submission) => {
  if (!submission || !submission.taskId) return null;

  const task = await Task.findById(submission.taskId);

  if (!task) return null;

  task.status =
    SUBMISSION_TO_TASK_STATUS[submission.status] || task.status;
  task.latestSubmissionId = submission._id;

  await task.save();

  return task;
};

/**
 * True when the intern has at least one assigned task and every
 * one of them has been approved.
 */
const hasCompletedAllTasks = async (internId) => {
  const total = await Task.countDocuments({ assignedTo: internId });

  if (total === 0) return false;

  const approved = await Task.countDocuments({
    assignedTo: internId,
    status: "Approved",
  });

  return approved === total;
};

/**
 * Issue a certificate when the intern has an evaluation on record
 * and has cleared every assigned task. Idempotent: calling it
 * twice never produces two certificates.
 */
const issueCertificateIfEligible = async ({ internId, issuedBy = null }) => {
  if (!internId) return null;

  const existing = await Certificate.findOne({ userId: internId });

  if (existing) return existing;

  const evaluations = await Evaluation.find({ internId }).sort({
    createdAt: -1,
  });

  if (evaluations.length === 0) return null;

  const tasksDone = await hasCompletedAllTasks(internId);

  if (!tasksDone) return null;

  const intern = await User.findById(internId);

  if (!intern) return null;

  const averageScore =
    evaluations.reduce(
      (total, evaluation) => total + Number(evaluation.totalScore || 0),
      0
    ) / evaluations.length;

  const finalScore = Math.round(averageScore);

  const issueDate = new Date().toISOString().split("T")[0];

  const certificate = await Certificate.create({
    userId: intern._id,
    internName: intern.name,
    title: "Certificate of Internship Completion",
    programName:
      intern.projectName || intern.track || intern.cohort || "MSN Academy",
    issuedBy: "MSN Academy",
    issuedById: issuedBy,
    issueDate,
    certificateId: `MSN-${String(intern._id).slice(-6).toUpperCase()}-${
      new Date().getFullYear()
    }`,
    finalScore,
  });

  await notifyUser({
    userId: intern._id,
    role: ROLES.INTERN,
    title: "Certificate Issued",
    message: `Your internship certificate has been issued with a final score of ${finalScore}%.`,
    type: "Certificate",
    relatedId: certificate._id,
    relatedType: "certificate",
    link: "/intern/certificates",
    createdBy: "MSN Academy",
    senderRole: "System",
  });

  return certificate;
};

/**
 * Called by the Mentor module once an evaluation is saved.
 */
const onEvaluationCompleted = async ({ evaluation, mentor }) => {
  await notifyUser({
    userId: evaluation.internId,
    role: ROLES.INTERN,
    title: "Performance Evaluation Completed",
    message: `${mentor?.name || "Your mentor"} completed your ${
      evaluation.milestone
    } evaluation. Score: ${Math.round(evaluation.totalScore)}%.`,
    type: "Evaluation",
    relatedId: evaluation._id,
    relatedType: "evaluation",
    link: "/intern/dashboard",
    createdBy: mentor?.name || "Mentor",
    senderRole: "Mentor",
  });

  return issueCertificateIfEligible({
    internId: evaluation.internId,
    issuedBy: mentor?._id || null,
  });
};

/** Latest submission for a task, used by the intern task page. */
const getLatestSubmission = async (taskId) =>
  Submission.findOne({ taskId }).sort({ createdAt: -1 });

module.exports = {
  onTaskAssigned,
  onTaskSubmitted,
  onSubmissionReviewed,
  onEvaluationCompleted,
  issueCertificateIfEligible,
  hasCompletedAllTasks,
  getLatestSubmission,
  SUBMISSION_TO_TASK_STATUS,
};
