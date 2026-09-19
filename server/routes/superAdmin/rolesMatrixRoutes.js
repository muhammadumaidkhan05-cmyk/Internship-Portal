const express = require("express");
const router = express.Router();
const rolesMatrixController = require("../../controllers/superAdmin/rolesMatrixController");

router.get("/", rolesMatrixController.getRolesMatrix);
router.patch("/:id", rolesMatrixController.updateRolePermissions);

module.exports = router;
