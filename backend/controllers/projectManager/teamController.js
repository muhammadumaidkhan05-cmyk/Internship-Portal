const ProjectManagerTeam = require(
  "../../models/projectManager/ProjectManagerTeam"
);

// ============================================================
// GET ALL TEAMS
// ============================================================

const getTeamMembers = async (
  req,
  res
) => {
  try {
    const teams =
      await ProjectManagerTeam.find().sort(
        { createdAt: -1 }
      );

    res.status(200).json({
      success: true,
      data: teams,
    });
  } catch (error) {
    console.error(
      "Get teams error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch teams.",
    });
  }
};

// ============================================================
// GET SINGLE TEAM
// ============================================================

const getTeamMemberById = async (
  req,
  res
) => {
  try {
    const team =
      await ProjectManagerTeam.findById(
        req.params.id
      );

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    console.error(
      "Get team error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch team.",
    });
  }
};

// ============================================================
// CREATE TEAM
// ============================================================

const createTeamMember = async (
  req,
  res
) => {
  try {
    const {
      teamName,
      memberCount,
      mentor,
      project,
      department,
      startDate,
      endDate,
      status,
      technologies,
      description,
      progress,
    } = req.body;

    // Team name validation
    if (!teamName?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Team name is required.",
      });
    }

    // Members validation
    if (
      memberCount === undefined ||
      Number(memberCount) < 1
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Members count must be at least 1.",
      });
    }

    // Technologies normalization
    let normalizedTechnologies = [];

    if (Array.isArray(technologies)) {
      normalizedTechnologies =
        technologies
          .map((item) =>
            String(item).trim()
          )
          .filter(Boolean);
    } else if (
      typeof technologies ===
      "string"
    ) {
      normalizedTechnologies =
        technologies
          .split(",")
          .map((item) =>
            item.trim()
          )
          .filter(Boolean);
    }

    // Mentor normalization
    const normalizedMentor =
      typeof mentor === "string" &&
      mentor.trim()
        ? mentor.trim()
        : "Unassigned";

    const team =
      await ProjectManagerTeam.create(
        {
          teamName:
            teamName.trim(),

          memberCount:
            Number(memberCount),

          mentor:
            normalizedMentor,

          project:
            project?.trim() ||
            "Unassigned",

          department:
            department?.trim() ||
            "Development",

          startDate:
            startDate || null,

          endDate:
            endDate || null,

          status:
            status || "Active",

          technologies:
            normalizedTechnologies,

          description:
            description?.trim() || "",

          progress:
            Number(progress) || 0,
        }
      );

    res.status(201).json({
      success: true,
      message:
        "Team created successfully.",
      data: team,
    });
  } catch (error) {
    console.error(
      "Create team error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create team.",
    });
  }
};

// ============================================================
// UPDATE TEAM
// ============================================================

const updateTeamMember = async (
  req,
  res
) => {
  try {
    const {
      teamName,
      memberCount,
      mentor,
      project,
      department,
      startDate,
      endDate,
      status,
      technologies,
      description,
      progress,
    } = req.body;

    // Team name validation
    if (!teamName?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Team name is required.",
      });
    }

    // Members validation
    if (
      memberCount === undefined ||
      Number(memberCount) < 1
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Members count must be at least 1.",
      });
    }

    // Technologies normalization
    let normalizedTechnologies = [];

    if (Array.isArray(technologies)) {
      normalizedTechnologies =
        technologies
          .map((item) =>
            String(item).trim()
          )
          .filter(Boolean);
    } else if (
      typeof technologies ===
      "string"
    ) {
      normalizedTechnologies =
        technologies
          .split(",")
          .map((item) =>
            item.trim()
          )
          .filter(Boolean);
    }

    // Mentor normalization
    const normalizedMentor =
      typeof mentor === "string" &&
      mentor.trim()
        ? mentor.trim()
        : "Unassigned";

    const updatedTeam =
      await ProjectManagerTeam.findByIdAndUpdate(
        req.params.id,
        {
          teamName:
            teamName.trim(),

          memberCount:
            Number(memberCount),

          mentor:
            normalizedMentor,

          project:
            project?.trim() ||
            "Unassigned",

          department:
            department?.trim() ||
            "Development",

          startDate:
            startDate || null,

          endDate:
            endDate || null,

          status:
            status || "Active",

          technologies:
            normalizedTechnologies,

          description:
            description?.trim() || "",

          progress:
            Number(progress) || 0,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedTeam) {
      return res.status(404).json({
        success: false,
        message: "Team not found.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Team updated successfully.",
      data: updatedTeam,
    });
  } catch (error) {
    console.error(
      "Update team error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update team.",
    });
  }
};

// ============================================================
// DELETE TEAM
// ============================================================

const deleteTeamMember = async (
  req,
  res
) => {
  try {
    const deletedTeam =
      await ProjectManagerTeam.findByIdAndDelete(
        req.params.id
      );

    if (!deletedTeam) {
      return res.status(404).json({
        success: false,
        message: "Team not found.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Team deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete team error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete team.",
    });
  }
};

module.exports = {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
};