const ScrumReview = require(
  "../../models/projectManager/ScrumReview"
);

// ============================================================
// GET ALL SCRUM REVIEWS
// ============================================================

const getScrumReviews = async (req, res) => {
  try {
    const {
      teamId,
      projectId,
      status,
      search,
    } = req.query;

    const filter = {};

    // Team filter
    if (teamId) {
      filter.teamId = teamId;
    }

    // Project filter
    if (projectId) {
      filter.projectId = projectId;
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Search by team/project/sprint
    if (search && search.trim()) {
      const searchRegex = new RegExp(
        search.trim(),
        "i"
      );

      filter.$or = [
        { teamName: searchRegex },
        { projectName: searchRegex },
        { sprintName: searchRegex },
        { scrumType: searchRegex },
      ];
    }

    const reviews = await ScrumReview.find(filter)
      .sort({
        scrumDate: -1,
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error(
      "Get Scrum Reviews error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch Scrum Reviews",
      error: error.message,
    });
  }
};

// ============================================================
// GET SINGLE SCRUM REVIEW
// ============================================================

const getScrumReviewById = async (req, res) => {
  try {
    const review = await ScrumReview.findById(
      req.params.id
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Scrum Review not found",
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error(
      "Get single Scrum Review error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch Scrum Review",
      error: error.message,
    });
  }
};

// ============================================================
// CREATE SCRUM REVIEW
// ============================================================

const createScrumReview = async (req, res) => {
  try {
    const {
      teamId,
      teamName,
      projectId,
      projectName,
      scrumDate,
      scrumType,
      sprintName,
      totalMembers,
      presentMembers,
      lateMembers,
      absentMembers,
      sprintProgress,
      completedWork,
      blockers,
      nextPlan,
      status,
      managerRemarks,
    } = req.body;

    // ----------------------------------------------------------
    // REQUIRED VALIDATION
    // ----------------------------------------------------------

    if (!teamId || !String(teamId).trim()) {
      return res.status(400).json({
        success: false,
        message: "Team is required",
      });
    }

    if (!teamName || !String(teamName).trim()) {
      return res.status(400).json({
        success: false,
        message: "Team name is required",
      });
    }

    if (!projectId || !String(projectId).trim()) {
      return res.status(400).json({
        success: false,
        message: "Project is required",
      });
    }

    if (
      !projectName ||
      !String(projectName).trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    if (!scrumDate) {
      return res.status(400).json({
        success: false,
        message: "Scrum date is required",
      });
    }

    const parsedDate = new Date(scrumDate);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid scrum date",
      });
    }

    if (
      !sprintName ||
      !String(sprintName).trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Sprint or week is required",
      });
    }

    if (
      !completedWork ||
      !String(completedWork).trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Completed work is required",
      });
    }

    if (
      !nextPlan ||
      !String(nextPlan).trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Next plan is required",
      });
    }

    // ----------------------------------------------------------
    // NUMBER NORMALIZATION
    // ----------------------------------------------------------

    let members = Number(totalMembers || 0);
    let present = Number(presentMembers || 0);
    let late = Number(lateMembers || 0);

    if (
      Number.isNaN(members) ||
      Number.isNaN(present) ||
      Number.isNaN(late)
    ) {
      return res.status(400).json({
        success: false,
        message: "Attendance values must be numbers",
      });
    }

    members = Math.max(0, members);
    present = Math.max(0, present);
    late = Math.max(0, late);

    if (present > members) {
      present = members;
    }

    if (late > members) {
      late = members;
    }

    let absent =
      members - present - late;

    if (absent < 0) {
      absent = 0;
    }

    // ----------------------------------------------------------
    // PROGRESS NORMALIZATION
    // ----------------------------------------------------------

    let progress =
      Number(sprintProgress || 0);

    if (Number.isNaN(progress)) {
      return res.status(400).json({
        success: false,
        message: "Sprint progress must be a number",
      });
    }

    progress = Math.max(
      0,
      Math.min(100, progress)
    );

    // ----------------------------------------------------------
    // CREATE
    // ----------------------------------------------------------

    const review =
      await ScrumReview.create({
        teamId: String(teamId).trim(),
        teamName: String(teamName).trim(),

        projectId: String(projectId).trim(),
        projectName: String(projectName).trim(),

        scrumDate: parsedDate,

        scrumType:
          scrumType || "Daily Scrum",

        sprintName:
          String(sprintName).trim(),

        totalMembers: members,
        presentMembers: present,
        lateMembers: late,
        absentMembers: absent,

        sprintProgress: progress,

        completedWork:
          String(completedWork).trim(),

        blockers:
          blockers
            ? String(blockers).trim()
            : "",

        nextPlan:
          String(nextPlan).trim(),

        status:
          status || "Pending",

        managerRemarks:
          managerRemarks
            ? String(managerRemarks).trim()
            : "",
      });

    res.status(201).json({
      success: true,
      message:
        "Scrum Review created successfully",
      data: review,
    });
  } catch (error) {
    console.error(
      "Create Scrum Review error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create Scrum Review",
      error: error.message,
    });
  }
};

// ============================================================
// UPDATE SCRUM REVIEW
// ============================================================

const updateScrumReview = async (req, res) => {
  try {
    const review =
      await ScrumReview.findById(
        req.params.id
      );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Scrum Review not found",
      });
    }

    const {
      teamId,
      teamName,
      projectId,
      projectName,
      scrumDate,
      scrumType,
      sprintName,
      totalMembers,
      presentMembers,
      lateMembers,
      absentMembers,
      sprintProgress,
      completedWork,
      blockers,
      nextPlan,
      status,
      managerRemarks,
    } = req.body;

    // ----------------------------------------------------------
    // TEAM
    // ----------------------------------------------------------

    if (teamId !== undefined) {
      if (!String(teamId).trim()) {
        return res.status(400).json({
          success: false,
          message: "Team is required",
        });
      }

      review.teamId = String(
        teamId
      ).trim();
    }

    if (teamName !== undefined) {
      if (!String(teamName).trim()) {
        return res.status(400).json({
          success: false,
          message: "Team name is required",
        });
      }

      review.teamName =
        String(teamName).trim();
    }

    // ----------------------------------------------------------
    // PROJECT
    // ----------------------------------------------------------

    if (projectId !== undefined) {
      if (!String(projectId).trim()) {
        return res.status(400).json({
          success: false,
          message: "Project is required",
        });
      }

      review.projectId =
        String(projectId).trim();
    }

    if (projectName !== undefined) {
      if (!String(projectName).trim()) {
        return res.status(400).json({
          success: false,
          message: "Project name is required",
        });
      }

      review.projectName =
        String(projectName).trim();
    }

    // ----------------------------------------------------------
    // DATE
    // ----------------------------------------------------------

    if (scrumDate !== undefined) {
      const parsedDate =
        new Date(scrumDate);

      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid scrum date",
        });
      }

      review.scrumDate =
        parsedDate;
    }

    // ----------------------------------------------------------
    // SCRUM TYPE
    // ----------------------------------------------------------

    if (scrumType !== undefined) {
      review.scrumType =
        scrumType;
    }

    // ----------------------------------------------------------
    // SPRINT
    // ----------------------------------------------------------

    if (sprintName !== undefined) {
      if (!String(sprintName).trim()) {
        return res.status(400).json({
          success: false,
          message: "Sprint or week is required",
        });
      }

      review.sprintName =
        String(sprintName).trim();
    }

    // ----------------------------------------------------------
    // ATTENDANCE
    // ----------------------------------------------------------

    let members =
      totalMembers !== undefined
        ? Number(totalMembers)
        : review.totalMembers;

    let present =
      presentMembers !== undefined
        ? Number(presentMembers)
        : review.presentMembers;

    let late =
      lateMembers !== undefined
        ? Number(lateMembers)
        : review.lateMembers;

    if (
      Number.isNaN(members) ||
      Number.isNaN(present) ||
      Number.isNaN(late)
    ) {
      return res.status(400).json({
        success: false,
        message: "Attendance values must be numbers",
      });
    }

    members = Math.max(0, members);
    present = Math.max(0, present);
    late = Math.max(0, late);

    if (present > members) {
      present = members;
    }

    if (late > members) {
      late = members;
    }

    const absent =
      Math.max(
        0,
        members - present - late
      );

    review.totalMembers =
      members;

    review.presentMembers =
      present;

    review.lateMembers =
      late;

    // Always recalculate absent
    review.absentMembers =
      absent;

    // ----------------------------------------------------------
    // PROGRESS
    // ----------------------------------------------------------

    if (
      sprintProgress !==
      undefined
    ) {
      let progress =
        Number(sprintProgress);

      if (Number.isNaN(progress)) {
        return res.status(400).json({
          success: false,
          message:
            "Sprint progress must be a number",
        });
      }

      progress = Math.max(
        0,
        Math.min(100, progress)
      );

      review.sprintProgress =
        progress;
    }

    // ----------------------------------------------------------
    // DISCUSSION
    // ----------------------------------------------------------

    if (
      completedWork !==
      undefined
    ) {
      if (!String(completedWork).trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Completed work is required",
        });
      }

      review.completedWork =
        String(completedWork).trim();
    }

    if (blockers !== undefined) {
      review.blockers =
        String(blockers).trim();
    }

    if (nextPlan !== undefined) {
      if (!String(nextPlan).trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Next plan is required",
        });
      }

      review.nextPlan =
        String(nextPlan).trim();
    }

    // ----------------------------------------------------------
    // REVIEW STATUS
    // ----------------------------------------------------------

    if (status !== undefined) {
      review.status =
        status;
    }

    if (
      managerRemarks !==
      undefined
    ) {
      review.managerRemarks =
        String(managerRemarks).trim();
    }

    // ----------------------------------------------------------
    // SAVE
    // ----------------------------------------------------------

    const updatedReview =
      await review.save();

    res.status(200).json({
      success: true,
      message:
        "Scrum Review updated successfully",
      data: updatedReview,
    });
  } catch (error) {
    console.error(
      "Update Scrum Review error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update Scrum Review",
      error: error.message,
    });
  }
};

// ============================================================
// DELETE SCRUM REVIEW
// ============================================================

const deleteScrumReview = async (req, res) => {
  try {
    const review =
      await ScrumReview.findById(
        req.params.id
      );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Scrum Review not found",
      });
    }

    await ScrumReview.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Scrum Review deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Scrum Review error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete Scrum Review",
      error: error.message,
    });
  }
};

// ============================================================
// TEAM PERFORMANCE OVERVIEW
// ============================================================

const getTeamPerformance = async (
  req,
  res
) => {
  try {
    const reviews =
      await ScrumReview.find()
        .sort({
          scrumDate: -1,
          createdAt: -1,
        });

    const teamMap = new Map();

    reviews.forEach((review) => {
      const key =
        review.teamId ||
        review.teamName;

      if (!teamMap.has(key)) {
        teamMap.set(key, {
          teamId: review.teamId,
          teamName: review.teamName,
          projectName:
            review.projectName,
          sprintProgress:
            review.sprintProgress || 0,
          totalMembers:
            review.totalMembers || 0,
          presentMembers:
            review.presentMembers || 0,
          lateMembers:
            review.lateMembers || 0,
          absentMembers:
            review.absentMembers || 0,
          blockers: review.blockers
            ? 1
            : 0,
          reviewCount: 1,
        });
      } else {
        const team =
          teamMap.get(key);

        team.sprintProgress =
          Math.max(
            team.sprintProgress,
            review.sprintProgress || 0
          );

        team.totalMembers =
          review.totalMembers || 0;

        team.presentMembers =
          review.presentMembers || 0;

        team.lateMembers =
          review.lateMembers || 0;

        team.absentMembers =
          review.absentMembers || 0;

        if (review.blockers) {
          team.blockers += 1;
        }

        team.reviewCount += 1;
      }
    });

    const data =
      Array.from(
        teamMap.values()
      ).map((team) => {
        const attendance =
          team.totalMembers > 0
            ? Math.round(
                ((team.presentMembers +
                  team.lateMembers) /
                  team.totalMembers) *
                  100
              )
            : 0;

        return {
          ...team,
          attendancePercentage:
            attendance,
        };
      });

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error(
      "Get team performance error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch team performance",
      error: error.message,
    });
  }
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  getScrumReviews,
  getScrumReviewById,
  createScrumReview,
  updateScrumReview,
  deleteScrumReview,
  getTeamPerformance,
};