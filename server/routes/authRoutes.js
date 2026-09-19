const express = require("express");

const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  getMentors,
  createMentor,
  updateMentor,
  deactivateMentor,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const { ROLES } = require("../constants/roles");

const router = express.Router();

// ============================================================
// PUBLIC AUTHENTICATION
// ============================================================

router.post("/register", register);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

// ============================================================
// AUTHENTICATED
// ============================================================

router.get("/me", protect, getMe);

// ============================================================
// MENTOR DIRECTORY
// Consumed by the Program Manager "Mentors" page.
// ============================================================

router.get(
  "/mentors",
  protect,
  allowRoles(
    ROLES.PROGRAM_MANAGER,
    ROLES.PROJECT_MANAGER,
    ROLES.SUPER_ADMIN
  ),
  getMentors
);

router.post(
  "/mentors",
  protect,
  allowRoles(ROLES.PROGRAM_MANAGER, ROLES.SUPER_ADMIN),
  createMentor
);

router.put(
  "/mentors/:id",
  protect,
  allowRoles(ROLES.PROGRAM_MANAGER, ROLES.SUPER_ADMIN),
  updateMentor
);

router.patch(
  "/mentors/:id/deactivate",
  protect,
  allowRoles(ROLES.PROGRAM_MANAGER, ROLES.SUPER_ADMIN),
  deactivateMentor
);

module.exports = router;
