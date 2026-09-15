const express = require("express");
const router = express.Router();
const Certificate = require("../models/Certificate");

// GET all certificates
router.get("/", async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET certificates of one user
router.get("/user/:userId", async (req, res) => {
  try {
    const certificates = await Certificate.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE certificate
router.post("/", async (req, res) => {
  try {
    const certificate = new Certificate(req.body);
    const savedCertificate = await certificate.save();

    res.status(201).json(savedCertificate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE certificate
router.delete("/:id", async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: "Certificate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;