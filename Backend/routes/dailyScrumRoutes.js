const express = require("express");
const router = express.Router();
const DailyScrum = require("../models/DailyScrum");

// GET all daily scrums
router.get("/", async (req, res) => {
  try {
    const scrums = await DailyScrum.find().sort({ createdAt: -1 });
    res.json(scrums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET scrums of one user
router.get("/user/:userId", async (req, res) => {
  try {
    const scrums = await DailyScrum.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(scrums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE daily scrum
router.post("/", async (req, res) => {
  try {
    const scrum = new DailyScrum(req.body);
    const savedScrum = await scrum.save();

    res.status(201).json(savedScrum);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE daily scrum
router.delete("/:id", async (req, res) => {
  try {
    await DailyScrum.findByIdAndDelete(req.params.id);
    res.json({ message: "Daily Scrum deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;