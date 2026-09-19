const mongoose = require("mongoose");
const MentorProfile = require("../../models/mentor/MentorProfile");
const InternAssignment = require("../../models/mentor/InternAssignment");
let { demoProfile, demoAssignments } = require("../../utils/demoData");

// ============================================================
// GET MENTOR PROFILE
// ============================================================

const getMentorProfile = async (req, res) => {
  try {
    const user = req.user;

    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        profile: {
          ...demoProfile,
          assignedInternsCount: demoAssignments.length,
        },
      });
    }

    let profile = await MentorProfile.findOne({ userId: user._id });

    // Create a default profile on first visit
    if (!profile) {
      profile = await MentorProfile.create({
        userId: user._id,
        fullName: user.name,
        email: user.email,
        phone: user.phone || "",
        specialization: user.specialization || "",
        bio: user.bio || "",
      });
    }

    const assignedInternsCount = await InternAssignment.countDocuments({
      mentorId: user._id,
      status: "Active",
    });

    return res.status(200).json({
      success: true,
      profile: {
        ...profile.toObject(),
        assignedInternsCount,
      },
    });
  } catch (error) {
    console.error("Get mentor profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load mentor profile.",
      error: error.message,
    });
  }
};

// ============================================================
// UPDATE MENTOR PROFILE
// ============================================================

const updateMentorProfile = async (req, res) => {
  try {
    const { fullName, phone, department, specialization, bio, avatar } =
      req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required.",
      });
    }

    if (mongoose.connection.readyState !== 1) {
      demoProfile.fullName = fullName.trim();
      demoProfile.phone = phone?.trim() || "";
      demoProfile.department = department?.trim() || "Mentorship";
      demoProfile.specialization = specialization?.trim() || "";
      demoProfile.bio = bio?.trim() || "";
      demoProfile.avatar = avatar?.trim() || "";

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        profile: demoProfile,
      });
    }

    let profile = await MentorProfile.findOne({
      userId: req.user._id,
    });

    if (!profile) {
      profile = new MentorProfile({
        userId: req.user._id,
        email: req.user.email,
      });
    }

    profile.fullName = fullName.trim();
    profile.phone = phone?.trim() || "";
    profile.department = department?.trim() || "Mentorship";
    profile.specialization = specialization?.trim() || "";
    profile.bio = bio?.trim() || "";
    profile.avatar = avatar?.trim() || "";

    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      profile,
    });
  } catch (error) {
    console.error("Update mentor profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update mentor profile.",
      error: error.message,
    });
  }
};

module.exports = { getMentorProfile, updateMentorProfile };
