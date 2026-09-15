
const express = require("express");

const {
  register,
  login,
  getMe,
  getMentors,
  createMentor,
  updateMentor,
  deactivateMentor,
} = require("../controllers/authController");

const router = express.Router();

// ============================================================
// AUTH
// Login/Register only
// ============================================================

router.post("/register", register);

router.post("/login", login);

router.get("/me", getMe);

// ============================================================
// MENTORS
// No token / role middleware
// ============================================================

router.get("/mentors", getMentors);

router.post("/mentors", createMentor);

router.put("/mentors/:id", updateMentor);

router.patch(
  "/mentors/:id/deactivate",
  deactivateMentor
);

module.exports = router;

