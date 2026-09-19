const express = require("express");

const { getDashboard } = require(
  "../../controllers/mentor/mentorDashboardController"
);

const protect = require("../../middleware/authMiddleware");
const allowRoles = require("../../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, allowRoles("mentor"));

router.get("/", getDashboard);

module.exports = router;
