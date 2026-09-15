const ProgramManagerProfile = require("../models/ProgramManagerProfile");

const PROFILE_KEY = "program-manager";

/* ============================================================
   GET PROFILE
   Returns the saved profile.
   Does NOT create any default/sample data.
============================================================ */

const getProgramManagerProfile = async (req, res) => {
  try {
    const profile = await ProgramManagerProfile.findOne({
      profileKey: PROFILE_KEY,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully.",
      profile,
    });
  } catch (error) {
    console.error(
      "GET PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load profile.",
      error: error.message,
    });
  }
};

/* ============================================================
   CREATE / UPDATE PROFILE
============================================================ */

const updateProgramManagerProfile = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      role,
      department,
      location,
      bio,
      joinedDate,
    } = req.body;

    /* --------------------------------------------------------
       REQUIRED FIELD VALIDATION
    -------------------------------------------------------- */

    if (
      !fullName ||
      !fullName.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter your full name.",
      });
    }

    if (
      !email ||
      !email.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email address.",
      });
    }

    if (
      !phone ||
      !phone.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter your phone number.",
      });
    }

    /* --------------------------------------------------------
       EMAIL VALIDATION
    -------------------------------------------------------- */

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    /* --------------------------------------------------------
       CHECK EXISTING PROFILE
    -------------------------------------------------------- */

    let profile =
      await ProgramManagerProfile.findOne({
        profileKey: PROFILE_KEY,
      });

    /* ========================================================
       CREATE NEW PROFILE
    ======================================================== */

    if (!profile) {
      profile =
        new ProgramManagerProfile({
          profileKey: PROFILE_KEY,

          fullName:
            fullName.trim(),

          email:
            email.trim().toLowerCase(),

          phone:
            phone.trim(),

          role:
            role?.trim() || "",

          department:
            department?.trim() || "",

          location:
            location?.trim() || "",

          bio:
            bio?.trim() || "",

          status: "Active",
        });

      /* --------------------------------------------------------
         JOINED DATE
      -------------------------------------------------------- */

      if (joinedDate) {
        const parsedDate =
          new Date(joinedDate);

        if (
          Number.isNaN(
            parsedDate.getTime()
          )
        ) {
          return res.status(400).json({
            success: false,
            message: "Please enter a valid joined date.",
          });
        }

        profile.joinedDate =
          parsedDate;
      }
    }

    /* ========================================================
       UPDATE EXISTING PROFILE
    ======================================================== */

    else {
      profile.fullName =
        fullName.trim();

      profile.email =
        email.trim().toLowerCase();

      profile.phone =
        phone.trim();

      profile.role =
        role?.trim() || "";

      profile.department =
        department?.trim() || "";

      profile.location =
        location?.trim() || "";

      profile.bio =
        bio?.trim() || "";

      profile.status =
        "Active";

      /* --------------------------------------------------------
         UPDATE JOINED DATE
      -------------------------------------------------------- */

      if (joinedDate) {
        const parsedDate =
          new Date(joinedDate);

        if (
          Number.isNaN(
            parsedDate.getTime()
          )
        ) {
          return res.status(400).json({
            success: false,
            message: "Please enter a valid joined date.",
          });
        }

        profile.joinedDate =
          parsedDate;
      }
    }

    /* ========================================================
       SAVE
    ======================================================== */

    const savedProfile =
      await profile.save();

    /* ========================================================
       RESPONSE
    ======================================================== */

    return res.status(200).json({
      success: true,
      message: profile.isNew
        ? "Profile created successfully."
        : "Profile updated successfully.",
      profile: savedProfile,
    });
  } catch (error) {
    console.error(
      "SAVE PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to save profile.",
      error: error.message,
    });
  }
};

/* ============================================================
   DELETE PROFILE
============================================================ */

const deleteProgramManagerProfile = async (
  req,
  res
) => {
  try {
    const deletedProfile =
      await ProgramManagerProfile.findOneAndDelete({
        profileKey: PROFILE_KEY,
      });

    if (!deletedProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile removed successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to remove profile.",
      error: error.message,
    });
  }
};

/* ============================================================
   CLEAR PROFILE
   Removes the current profile.
   No sample/default information is created.
============================================================ */

const resetProgramManagerProfile = async (
  req,
  res
) => {
  try {
    const deletedProfile =
      await ProgramManagerProfile.findOneAndDelete({
        profileKey: PROFILE_KEY,
      });

    if (!deletedProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile cleared successfully.",
    });
  } catch (error) {
    console.error(
      "CLEAR PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to clear profile.",
      error: error.message,
    });
  }
};

/* ============================================================
   EXPORTS
============================================================ */

module.exports = {
  getProgramManagerProfile,
  updateProgramManagerProfile,
  deleteProgramManagerProfile,
  resetProgramManagerProfile,
};