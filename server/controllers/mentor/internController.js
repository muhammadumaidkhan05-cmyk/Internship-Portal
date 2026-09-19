const mongoose = require("mongoose");
const InternAssignment = require("../../models/mentor/InternAssignment");
const User = require("../../models/User");
const { demoAssignments } = require("../../utils/demoData");

// ============================================================
// GET ASSIGNED INTERNS
// ============================================================

const getAssignedInterns = async (req, res) => {
  try {
    const mentorId = req.user._id;

    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: demoAssignments.length,
        data: demoAssignments,
      });
    }

    const assignments = await InternAssignment.find({
      mentorId,
    })
      .populate("internId", "name email phone status")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    console.error("Get assigned interns error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch assigned interns.",
      error: error.message,
    });
  }
};

module.exports = { getAssignedInterns };
