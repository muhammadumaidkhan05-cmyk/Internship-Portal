const mongoose = require("mongoose");
const Cohort = require("../models/Cohort");
const User = require("../models/User");
const Notification = require("../models/Notification");

// ============================================================
// HELPER - FIND COHORT BY CUSTOM ID OR MONGODB _ID
// ============================================================
const findCohortById = async (id) => {
  // ----------------------------------------------------------
  // FIRST: FIND USING CUSTOM COHORT ID
  // Example: cohort-1750000000000
  // ----------------------------------------------------------
  let cohort = await Cohort.findOne({
    id: String(id),
  });

  if (cohort) {
    return cohort;
  }

  // ----------------------------------------------------------
  // SECOND: FIND USING MONGODB _ID
  // ----------------------------------------------------------
  if (mongoose.Types.ObjectId.isValid(id)) {
    cohort = await Cohort.findById(id);
  }

  return cohort;
};

// ============================================================
// HELPER - CREATE NOTIFICATION
// ============================================================
const createCohortNotification = async ({
  title,
  message,
  type = "info",
}) => {
  try {
    await Notification.create({
      id: `notification-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,

      title,

      message,

      type,

      recipientId: "",

      recipientRole: "",

      relatedId: "",

      relatedType: "cohort",

      link: "/program-manager/cohorts",

      createdBy: "program-manager",
    });
  } catch (error) {
    console.error(
      "Create cohort notification error:",
      error.message
    );
  }
};

// ============================================================
// CREATE COHORT
// ============================================================
const createCohort = async (req, res) => {
  try {
    const {
      name,
      program,
      mentorId,
      mentorName,
      internIds,
      interns,
      status,
      startDate,
      endDate,
      description,
    } = req.body;

    // ----------------------------------------------------------
    // REQUIRED FIELDS
    // ----------------------------------------------------------
    if (
      !name ||
      !program ||
      !mentorId ||
      interns === undefined ||
      interns === "" ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, program, mentor, intern capacity, start date and end date are required.",
      });
    }

    // ----------------------------------------------------------
    // DATE VALIDATION
    // ----------------------------------------------------------
    if (
      new Date(startDate) >
      new Date(endDate)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Start date cannot be after end date.",
      });
    }

    // ----------------------------------------------------------
    // INTERN CAPACITY VALIDATION
    // ----------------------------------------------------------
    const internCapacity = Number(interns);

    if (
      !Number.isFinite(internCapacity) ||
      internCapacity < 1
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Intern capacity must be at least 1.",
      });
    }

    // ----------------------------------------------------------
    // FIND MENTOR
    // ----------------------------------------------------------
    const mentor = await User.findOne({
      _id: mentorId,
      role: "mentor",
      status: "Active",
    }).select("-password");

    if (!mentor) {
      return res.status(400).json({
        success: false,
        message:
          "Selected mentor was not found or is inactive.",
      });
    }

    // ----------------------------------------------------------
    // CREATE COHORT
    // ----------------------------------------------------------
    const cohort = await Cohort.create({
      id: `cohort-${Date.now()}`,

      name: name.trim(),

      program: program.trim(),

      mentorId: String(mentor._id),

      mentorName:
        mentor.name ||
        mentorName ||
        "",

      internIds: Array.isArray(internIds)
        ? internIds
        : [],

      interns: internCapacity,

      status:
        status || "Upcoming",

      startDate,

      endDate,

      description: description
        ? description.trim()
        : "",

      createdBy: "program-manager",
    });

    // ----------------------------------------------------------
    // NOTIFICATION
    // ----------------------------------------------------------
    await createCohortNotification({
      title: "New cohort created",

      message: `${cohort.name} has been created and assigned to ${cohort.mentorName}.`,

      type: "success",
    });

    return res.status(201).json({
      success: true,

      message:
        "Cohort created successfully.",

      data: cohort,
    });
  } catch (error) {
    console.error(
      "Create cohort error:",
      error.message
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to create cohort.",

      error: error.message,
    });
  }
};

// ============================================================
// GET ALL COHORTS
// ============================================================
const getCohorts = async (req, res) => {
  try {
    const cohorts =
      await Cohort.find().sort({
        createdAt: -1,
      });

    // ----------------------------------------------------------
    // GET ACTIVE MENTORS
    // ----------------------------------------------------------
    const mentors =
      await User.find({
        role: "mentor",
        status: "Active",
      })
        .select(
          "name email role status"
        )
        .sort({
          name: 1,
        });

    return res.status(200).json({
      success: true,

      count: cohorts.length,

      data: cohorts,

      mentors,
    });
  } catch (error) {
    console.error(
      "Get cohorts error:",
      error.message
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch cohorts.",

      error: error.message,
    });
  }
};

// ============================================================
// GET SINGLE COHORT
// ============================================================
const getCohortById = async (req, res) => {
  try {
    const cohort =
      await findCohortById(
        req.params.id
      );

    if (!cohort) {
      return res.status(404).json({
        success: false,

        message:
          "Cohort not found.",
      });
    }

    return res.status(200).json({
      success: true,

      data: cohort,
    });
  } catch (error) {
    console.error(
      "Get cohort error:",
      error.message
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch cohort.",

      error: error.message,
    });
  }
};

// ============================================================
// UPDATE COHORT
// ============================================================
const updateCohort = async (req, res) => {
  try {
    const {
      name,
      program,
      mentorId,
      interns,
      status,
      startDate,
      endDate,
      description,
      internIds,
    } = req.body;

    // ----------------------------------------------------------
    // REQUIRED FIELDS
    // ----------------------------------------------------------
    if (
      !name ||
      !program ||
      !mentorId ||
      interns === undefined ||
      interns === "" ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Name, program, mentor, intern capacity, start date and end date are required.",
      });
    }

    // ----------------------------------------------------------
    // DATE VALIDATION
    // ----------------------------------------------------------
    if (
      new Date(startDate) >
      new Date(endDate)
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Start date cannot be after end date.",
      });
    }

    // ----------------------------------------------------------
    // INTERN CAPACITY
    // ----------------------------------------------------------
    const internCapacity = Number(interns);

    if (
      !Number.isFinite(internCapacity) ||
      internCapacity < 1
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Intern capacity must be at least 1.",
      });
    }

    // ----------------------------------------------------------
    // FIND MENTOR
    // ----------------------------------------------------------
    const mentor = await User.findOne({
      _id: mentorId,
      role: "mentor",
      status: "Active",
    }).select("-password");

    if (!mentor) {
      return res.status(400).json({
        success: false,

        message:
          "Selected mentor was not found or is inactive.",
      });
    }

    // ----------------------------------------------------------
    // FIND EXISTING COHORT SAFELY
    // ----------------------------------------------------------
    const existingCohort =
      await findCohortById(
        req.params.id
      );

    if (!existingCohort) {
      return res.status(404).json({
        success: false,

        message:
          "Cohort not found.",
      });
    }

    // ----------------------------------------------------------
    // UPDATE DATA
    // ----------------------------------------------------------
    existingCohort.name =
      name.trim();

    existingCohort.program =
      program.trim();

    existingCohort.mentorId =
      String(mentor._id);

    existingCohort.mentorName =
      mentor.name || "";

    existingCohort.interns =
      internCapacity;

    existingCohort.status =
      status || "Upcoming";

    existingCohort.startDate =
      startDate;

    existingCohort.endDate =
      endDate;

    existingCohort.description =
      description
        ? description.trim()
        : "";

    existingCohort.internIds =
      Array.isArray(internIds)
        ? internIds
        : [];

    // ----------------------------------------------------------
    // SAVE UPDATED COHORT
    // ----------------------------------------------------------
    const cohort =
      await existingCohort.save();

    // ----------------------------------------------------------
    // NOTIFICATION
    // ----------------------------------------------------------
    await createCohortNotification({
      title: "Cohort updated",

      message: `${cohort.name} has been updated by the Program Manager.`,

      type: "info",
    });

    return res.status(200).json({
      success: true,

      message:
        "Cohort updated successfully.",

      data: cohort,
    });
  } catch (error) {
    console.error(
      "Update cohort error:",
      error.message
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to update cohort.",

      error: error.message,
    });
  }
};

// ============================================================
// DELETE COHORT
// ============================================================
const deleteCohort = async (req, res) => {
  try {
    // ----------------------------------------------------------
    // FIND COHORT SAFELY
    // ----------------------------------------------------------
    const existingCohort =
      await findCohortById(
        req.params.id
      );

    if (!existingCohort) {
      return res.status(404).json({
        success: false,

        message:
          "Cohort not found.",
      });
    }

    // ----------------------------------------------------------
    // DELETE COHORT
    // ----------------------------------------------------------
    const cohort =
      await Cohort.findByIdAndDelete(
        existingCohort._id
      );

    if (!cohort) {
      return res.status(404).json({
        success: false,

        message:
          "Cohort not found.",
      });
    }

    // ----------------------------------------------------------
    // NOTIFICATION
    // ----------------------------------------------------------
    await createCohortNotification({
      title: "Cohort removed",

      message: `${cohort.name} has been removed by the Program Manager.`,

      type: "warning",
    });

    return res.status(200).json({
      success: true,

      message:
        "Cohort deleted successfully.",

      data: cohort,
    });
  } catch (error) {
    console.error(
      "Delete cohort error:",
      error.message
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to delete cohort.",

      error: error.message,
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================
module.exports = {
  createCohort,
  getCohorts,
  getCohortById,
  updateCohort,
  deleteCohort,
};