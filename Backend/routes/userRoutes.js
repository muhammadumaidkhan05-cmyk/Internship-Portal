const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      message: "Failed to get users",
    });
  }
});

// GET one user by MongoDB ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);

    res.status(400).json({
      message: "Invalid user ID",
    });
  }
});

// CREATE new user/profile
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      role,
      department,
      phone,
      bio,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        message: "A user with this email already exists",
        user: existingUser,
      });
    }

    const user = new User({
      name,
      email,
      role,
      department,
      phone,
      bio,
    });

    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Create user error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
});

// UPDATE user/profile
router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      email,
      role,
      department,
      phone,
      bio,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        role,
        department,
        phone,
        bio,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Update user error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    res.status(400).json({
      message: "Invalid user ID",
    });
  }
});

module.exports = router;