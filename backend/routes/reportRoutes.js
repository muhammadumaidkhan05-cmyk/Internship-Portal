const express = require("express");

const { getReport } = require("../controllers/reportController");

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// All report routes require authentication
router.use(protect);

// Program Manager and Admin can view reports
router.get(
  "/",
  allowRoles("program-manager", "admin"),
  getReport
);

module.exports = router;