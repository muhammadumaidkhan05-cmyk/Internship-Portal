const { normalizeRole } = require("../constants/roles");

// ============================================================
// ROLE AUTHORISATION MIDDLEWARE
// Both the allowed list and the user's role are normalised, so
// a route written as allowRoles("project-manager") and a user
// stored as "project_manager" still match.
// ============================================================

const allowRoles = (...allowedRoles) => {
  const allowed = allowedRoles
    .map((role) => normalizeRole(role))
    .filter(Boolean);

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const role = normalizeRole(req.user.role);

    if (allowed.length > 0 && !allowed.includes(role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource.",
      });
    }

    next();
  };
};

module.exports = allowRoles;
