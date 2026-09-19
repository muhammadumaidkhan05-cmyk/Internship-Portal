const {
  notifyUser,
  notifyMentor,
} = require("../services/notificationService");
const { ROLES } = require("../constants/roles");

// ============================================================
// MENTOR NOTIFY HELPERS
// Kept at their original path so the mentor controllers keep
// their imports, but they now delegate to the single shared
// notification service used by every module.
// ============================================================

const notifyIntern = async ({
  internId,
  title,
  message,
  type = "Info",
  relatedId = "",
  relatedType = "",
  link = "",
}) =>
  notifyUser({
    userId: internId,
    role: ROLES.INTERN,
    title,
    message,
    type,
    relatedId,
    relatedType,
    link,
    createdBy: "Mentor",
    senderRole: "Mentor",
  });

module.exports = { notifyIntern, notifyMentor };
