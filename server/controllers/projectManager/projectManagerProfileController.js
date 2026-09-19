
const ProjectManagerProfile = require("../../models/projectManager/ProjectManagerProfile");
const User = require("../../models/User");

// ============================================================
// GET PROJECT MANAGER PROFILE
// ============================================================

const getProjectManagerProfile = async (req, res) => {
  try {
    let profile =
      await ProjectManagerProfile.findOne().sort({
        createdAt: 1,
      });

    // ----------------------------------------------------------
    // CREATE DEFAULT PROFILE IF NONE EXISTS
    // ----------------------------------------------------------

    if (!profile) {
      const user = await User.findOne().sort({
        createdAt: 1,
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No user found to create profile.",
        });
      }

      const defaultName =
        user.name ||
        `${user.firstName || ""} ${
          user.lastName || ""
        }`.trim() ||
        "Project Manager";

      profile =
        await ProjectManagerProfile.create({
          userId: user._id,
          fullName: defaultName,
          email: user.email || "",
          designation: "Project Manager",
          department: "Project Management",
          phone: "",
          location: "",
          bio: "",
          avatar: "",
        });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error(
      "Get Project Manager Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load Project Manager profile.",
      error: error.message,
    });
  }
};

// ============================================================
// UPDATE PROJECT MANAGER PROFILE
// ============================================================

const updateProjectManagerProfile = async (
  req,
  res
) => {
  try {
    const {
      fullName,
      email,
      phone,
      designation,
      department,
      location,
      bio,
      avatar,
    } = req.body;

    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required.",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid email address.",
      });
    }

    // ----------------------------------------------------------
    // FIND EXISTING PROJECT MANAGER PROFILE
    // ----------------------------------------------------------

    let profile =
      await ProjectManagerProfile.findOne().sort({
        createdAt: 1,
      });

    // ----------------------------------------------------------
    // CREATE PROFILE IF MISSING
    // ----------------------------------------------------------

    if (!profile) {
      const user = await User.findOne().sort({
        createdAt: 1,
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No user found to create profile.",
        });
      }

      profile =
        await ProjectManagerProfile.create({
          userId: user._id,
          fullName: fullName.trim(),
          email: normalizedEmail,
          phone: phone?.trim() || "",
          designation:
            designation?.trim() ||
            "Project Manager",
          department:
            department?.trim() ||
            "Project Management",
          location:
            location?.trim() || "",
          bio:
            bio?.trim() || "",
          avatar:
            avatar?.trim() || "",
        });
    } else {
      // --------------------------------------------------------
      // UPDATE EXISTING PROFILE
      // --------------------------------------------------------

      profile.fullName =
        fullName.trim();

      profile.email =
        normalizedEmail;

      profile.phone =
        phone?.trim() || "";

      profile.designation =
        designation?.trim() ||
        "Project Manager";

      profile.department =
        department?.trim() ||
        "Project Management";

      profile.location =
        location?.trim() || "";

      profile.bio =
        bio?.trim() || "";

      profile.avatar =
        avatar?.trim() || "";

      await profile.save();
    }

    return res.status(200).json({
      success: true,
      message:
        "Project Manager profile updated successfully.",
      profile,
    });
  } catch (error) {
    console.error(
      "Update Project Manager Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update Project Manager profile.",
      error: error.message,
    });
  }
};

module.exports = {
  getProjectManagerProfile,
  updateProjectManagerProfile,
};

