const express = require("express");
const router = express.Router();
const notificationsController = require("../../controllers/superAdmin/notificationsController");

router.get("/", notificationsController.getNotifications);
router.post("/:id/read", notificationsController.markRead);
router.post("/read-all", notificationsController.markAllRead);

module.exports = router;
