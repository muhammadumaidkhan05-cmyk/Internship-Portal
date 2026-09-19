const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { normalizeRole } = require("../constants/roles");

// ============================================================
// AUTHENTICATION MIDDLEWARE
// Accepts the token payload shapes produced by every branch
// (`id`, `userId` or `_id`) so old and new tokens both work.
// ============================================================

const protect = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Token is required.",
      });
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id || decoded.userId || decoded._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found.",
      });
    }

    if (user.status !== "Active") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive.",
      });
    }

    // Guarantee the canonical role downstream.
    user.role = normalizeRole(user.role) || user.role;

    req.user = user;
    req.userId = String(user._id);

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = protect;
