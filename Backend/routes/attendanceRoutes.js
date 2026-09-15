const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");

// GET all attendance
router.get("/", async (req, res) => {
  try {
    const attendance = await Attendance.find().sort({ createdAt: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET attendance of one user
router.get("/user/:userId", async (req, res) => {
  try {
    const attendance = await Attendance.find({
      userId: req.params.userId,
    }).sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE attendance
router.post("/", async (req, res) => {
  try {
    const attendance = new Attendance(req.body);
    const savedAttendance = await attendance.save();

    res.status(201).json(savedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE attendance
router.put("/:id", async (req, res) => {
  try {
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;