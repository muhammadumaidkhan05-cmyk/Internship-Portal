const express = require("express");
const router = express.Router();
const Submission = require("../models/Submission");

// GET all submissions
router.get("/", async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("projectId")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET submissions of one user
router.get("/user/:userId", async (req, res) => {
  try {
    const submissions = await Submission.find({
      userId: req.params.userId,
    })
      .populate("projectId")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE submission
router.post("/", async (req, res) => {
  try {
    const submission = new Submission(req.body);
    const savedSubmission = await submission.save();

    res.status(201).json(savedSubmission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE submission
router.put("/:id", async (req, res) => {
  try {
    const updatedSubmission = await Submission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedSubmission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE submission
router.delete("/:id", async (req, res) => {
  try {
    await Submission.findByIdAndDelete(req.params.id);
    res.json({ message: "Submission deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;