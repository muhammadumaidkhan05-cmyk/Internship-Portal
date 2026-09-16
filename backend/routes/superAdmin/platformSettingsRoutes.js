const express = require("express");
const router = express.Router();
const platformSettingsController = require("../../controllers/superAdmin/platformSettingsController");

router.get("/", platformSettingsController.getSettings);
router.patch("/", platformSettingsController.updateSettings);

module.exports = router;
