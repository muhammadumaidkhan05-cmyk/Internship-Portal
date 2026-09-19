const express = require("express");
const router = express.Router();
const auditLogsController = require("../../controllers/superAdmin/auditLogsController");

router.get("/", auditLogsController.getAuditLogs);
router.get("/export", auditLogsController.exportAuditLogs);

module.exports = router;
