const express = require("express");

const {
  getDashboard,
} = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// All dashboard routes require authentication
router.use(protect);

// Program Manager and Admin can access dashboard
router.get(
  "/",
  allowRoles("program-manager", "admin"),
  getDashboard
);

module.exports = router;