const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/superAdmin/usersController");

router.get("/", usersController.getUsers);
router.post("/", usersController.createUser);
router.patch("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);

// Profile update — patch user by their own ID
router.patch("/:id/profile", usersController.updateProfile);

module.exports = router;
