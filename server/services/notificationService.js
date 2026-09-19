const Notification = require("../models/Notification");
const MentorNotification = require("../models/mentor/MentorNotification");
const ProjectManagerNotification = require("../models/projectManager/ProjectManagerNotification");
const { ROLES, ROLE_LABELS } = require("../constants/roles");

// ============================================================
// NOTIFICATION SERVICE
// Every branch shipped its own notification collection. Rather
// than delete them (each module's UI reads its own), this
// service is the single write path: callers say "notify this
// user about this event" and the service fans the event out to
// the correct collection for that user's role.
// ============================================================

/**
 * Write to the shared Notification collection (interns,
 * program managers and super admins read this one).
 */
const notifyUser = async ({
  userId,
  role = ROLES.INTERN,
  title,
  message,
  type = "General",
  relatedId = "",
  relatedType = "",
  link = "",
  createdBy = "System",
  senderRole = "System",
}) => {
  if (!userId) return null;

  try {
    return await Notification.create({
      userId,
      recipientId: String(userId),
      recipientRole: role,
      title,
      message,
      type,
      relatedId: relatedId ? String(relatedId) : "",
      relatedType,
      link,
      isRead: false,
      createdBy,
      senderRole,
    });
  } catch (error) {
    console.error("notifyUser error:", error.message);
    return null;
  }
};

/** Mentor inbox (mentor module reads MentorNotification). */
const notifyMentor = async ({
  mentorId,
  title,
  message,
  type = "System",
  priority = "Medium",
  sourceRole = "System",
  sourceType = "System",
  sourceId = "",
  relatedId = "",
  relatedName = "",
  createdBy = "System",
}) => {
  if (!mentorId) return null;

  try {
    return await MentorNotification.create({
      title,
      message,
      type,
      priority,
      recipientId: mentorId,
      sourceRole,
      sourceType,
      sourceId: sourceId ? String(sourceId) : "",
      relatedId: relatedId ? String(relatedId) : "",
      relatedName,
      createdBy,
      isRead: false,
    });
  } catch (error) {
    console.error("notifyMentor error:", error.message);
    return null;
  }
};

/** Project Manager inbox (role-targeted, not user-targeted). */
const notifyProjectManager = async ({
  title,
  message,
  type = "System",
  priority = "Medium",
  sourceRole = "System",
  sourceType = "System",
  sourceId = "",
  relatedId = "",
  relatedName = "",
  createdBy = "System",
}) => {
  try {
    return await ProjectManagerNotification.create({
      title,
      message,
      type,
      priority,
      targetRole: "Project Manager",
      sourceRole,
      sourceType,
      sourceId: sourceId ? String(sourceId) : "",
      relatedId: relatedId ? String(relatedId) : "",
      relatedName,
      createdBy,
      isRead: false,
    });
  } catch (error) {
    console.error("notifyProjectManager error:", error.message);
    return null;
  }
};

/**
 * Role-aware dispatcher. Used by workflow code that knows who
 * should be told but not which inbox they read.
 */
const notify = async ({ userId, role, ...payload }) => {
  if (role === ROLES.MENTOR) {
    return notifyMentor({
      mentorId: userId,
      title: payload.title,
      message: payload.message,
      type: payload.type === "General" ? "System" : payload.type,
      sourceType: payload.sourceType || "System",
      sourceId: payload.relatedId,
      relatedId: payload.relatedId,
      relatedName: payload.relatedName || "",
      createdBy: payload.createdBy || "System",
    });
  }

  if (role === ROLES.PROJECT_MANAGER) {
    return notifyProjectManager({
      title: payload.title,
      message: payload.message,
      type: payload.type === "General" ? "System" : payload.type,
      sourceType: payload.sourceType || "System",
      sourceId: payload.relatedId,
      relatedId: payload.relatedId,
      relatedName: payload.relatedName || "",
      createdBy: payload.createdBy || "System",
    });
  }

  return notifyUser({
    userId,
    role: role || ROLES.INTERN,
    ...payload,
  });
};

module.exports = {
  notify,
  notifyUser,
  notifyMentor,
  notifyProjectManager,
  ROLE_LABELS,
};
