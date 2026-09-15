const Cohort = require("../models/Cohort");
const Project = require("../models/Project");
const Notification = require("../models/Notification");
const User = require("../models/User");

// ============================================================
// GET PROGRAM MANAGER DASHBOARD
// ============================================================

const getDashboard = async (req, res) => {
  try {
    // ----------------------------------------------------------
    // FETCH DATA
    // ----------------------------------------------------------

    const cohorts = await Cohort.find().sort({ createdAt: -1 });

    const projects = await Project.find().sort({ createdAt: -1 });

    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const interns = await User.find({
      role: "intern",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    // ----------------------------------------------------------
    // COHORT STATISTICS
    // ----------------------------------------------------------

    const activeCohorts = cohorts.filter(
      (cohort) =>
        String(cohort.status || "").toLowerCase() === "active"
    ).length;

    // ----------------------------------------------------------
    // PROJECT STATISTICS
    // ----------------------------------------------------------

    const completedProjects = projects.filter(
      (project) =>
        String(project.status || "").toLowerCase() === "completed"
    ).length;

    const inProgressProjects = projects.filter(
      (project) =>
        String(project.status || "").toLowerCase() === "in progress"
    ).length;

    const planningProjects = projects.filter(
      (project) =>
        String(project.status || "").toLowerCase() === "planning"
    ).length;

    const highPriorityProjects = projects.filter(
      (project) =>
        String(project.priority || "").toLowerCase() === "high"
    ).length;

    // ----------------------------------------------------------
    // AVERAGE PROJECT PROGRESS
    // ----------------------------------------------------------

    const totalProgress = projects.reduce(
      (sum, project) =>
        sum + Number(project.progress || 0),
      0
    );

    const averageProgress =
      projects.length > 0
        ? Math.round(totalProgress / projects.length)
        : 0;

    // ----------------------------------------------------------
    // TOTAL INTERNS
    // ----------------------------------------------------------

    const cohortInterns = cohorts.reduce(
      (sum, cohort) =>
        sum + Number(cohort.interns || 0),
      0
    );

    const totalInterns =
      interns.length > 0
        ? interns.length
        : cohortInterns;

    // ----------------------------------------------------------
    // PROJECT STATUS PERCENTAGES
    // ----------------------------------------------------------

    const totalProjects = projects.length || 1;

    const completedPercent = Math.round(
      (completedProjects / totalProjects) * 100
    );

    const inProgressPercent = Math.round(
      (inProgressProjects / totalProjects) * 100
    );

    const planningPercent = Math.round(
      (planningProjects / totalProjects) * 100
    );

    // ----------------------------------------------------------
    // TOP 5 COHORTS BY PROGRESS
    // ----------------------------------------------------------

    const sortedCohorts = [...cohorts]
      .sort(
        (a, b) =>
          Number(b.progress || 0) -
          Number(a.progress || 0)
      )
      .slice(0, 5);

    // ----------------------------------------------------------
    // UPCOMING PROJECT DEADLINES
    // ----------------------------------------------------------

    const upcomingProjects = [...projects]
      .filter((project) => project.deadline)
      .sort(
        (a, b) =>
          new Date(a.deadline) -
          new Date(b.deadline)
      )
      .slice(0, 4);

    // ----------------------------------------------------------
    // RESPONSE
    // ----------------------------------------------------------

    res.status(200).json({
      success: true,

      data: {
        stats: {
          activeCohorts,
          totalInterns,
          totalProjects: projects.length,
          averageProgress,
          completedProjects,
          inProgressProjects,
          planningProjects,
          highPriorityProjects,
        },

        projectStatus: {
          completed: completedProjects,
          inProgress: inProgressProjects,
          planning: planningProjects,

          completedPercent,
          inProgressPercent,
          planningPercent,
        },

        cohorts: sortedCohorts,

        projects: upcomingProjects,

        notifications,

        interns,

        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Get Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};