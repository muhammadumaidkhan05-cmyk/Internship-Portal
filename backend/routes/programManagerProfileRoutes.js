const express = require("express");

const {
  getProgramManagerProfile,
  updateProgramManagerProfile,
  deleteProgramManagerProfile,
  resetProgramManagerProfile,
} = require("../controllers/programManagerProfileController");

const router = express.Router();

router.get("/", getProgramManagerProfile);

router.put("/", updateProgramManagerProfile);

router.delete("/", deleteProgramManagerProfile);

router.post("/reset", resetProgramManagerProfile);

module.exports = router;