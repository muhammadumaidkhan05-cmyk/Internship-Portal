const express = require("express");
const router = express.Router();
const programsController = require("../../controllers/superAdmin/programsController");

router.get("/", programsController.getPrograms);
router.post("/", programsController.createProgram);
router.patch("/:id", programsController.updateProgram);
router.delete("/:id", programsController.deleteProgram);

module.exports = router;
