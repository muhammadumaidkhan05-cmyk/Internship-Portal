const express = require("express");

const { getAssignedInterns } = require(
  "../../controllers/mentor/internController"
);

const protect = require("../../middleware/authMiddleware");
const allowRoles = require("../../middleware/roleMiddleware");

const router = express.Router();

router.use(protect, allowRoles("mentor"));

router.get("/", getAssignedInterns);

module.exports = router;
