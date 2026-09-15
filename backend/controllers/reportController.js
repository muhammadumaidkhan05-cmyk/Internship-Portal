const Cohort = require("../models/Cohort");
const Project = require("../models/Project");
const User = require("../models/User");

// ============================================================
// GET PROGRAM MANAGER REPORT
// ============================================================

const getReport = async (req, res) => {
  try {
    const cohorts = await Cohort.find().sort({ createdAt: -1 });

    const projects = await Project.find().sort({ createdAt: -1 });

    // Get interns and mentors from User collection
    const interns = await User.find({ role: "intern" })
      .select("-password")
      .sort({ createdAt: -1 });

    const mentors = await User.find({ role: "mentor" })
      .select("-password")
      .sort({ createdAt: -1 });

    // ------------------------------------------------------------
    // ANALYTICS
    // ------------------------------------------------------------

    const totalInterns = cohorts.reduce(
      (sum, cohort) => sum + Number(cohort.interns || 0),
      0
    );

    const activeCohorts = cohorts.filter(
      (cohort) => cohort.status === "Active"
    ).length;

    const completedProjects = projects.filter(
      (project) => project.status === "Completed"
    ).length;

    const inProgressProjects = projects.filter(
      (project) => project.status === "In Progress"
    ).length;

    const planningProjects = projects.filter(
      (project) => project.status === "Planning"
    ).length;

    const averageProgress =
      projects.length === 0
        ? 0
        : Math.round(
            projects.reduce(
              (sum, project) =>
                sum + Number(project.progress || 0),
              0
            ) / projects.length
          );

    const highPriorityProjects = projects.filter(
      (project) => project.priority === "High"
    ).length;

    // ------------------------------------------------------------
    // PROJECT STATUS PERCENTAGES
    // ------------------------------------------------------------

    const totalProjects = projects.length;

    const completedPercent =
      totalProjects === 0
        ? 0
        : Math.round((completedProjects / totalProjects) * 100);

    const inProgressPercent =
      totalProjects === 0
        ? 0
        : Math.round((inProgressProjects / totalProjects) * 100);

    const planningPercent =
      totalProjects === 0
        ? 0
        : Math.round((planningProjects / totalProjects) * 100);

    // ------------------------------------------------------------
    // COHORT PERFORMANCE
    // ------------------------------------------------------------

    const cohortPerformance = cohorts.map((cohort) => ({
      ...cohort.toObject(),
      performance: Number(cohort.progress || 0),
    }));

    // ------------------------------------------------------------
    // PROJECT PERFORMANCE
    // ------------------------------------------------------------

    const projectPerformance = [...projects]
      .sort(
        (a, b) =>
          Number(b.progress || 0) -
          Number(a.progress || 0)
      )
      .map((project) => project.toObject());

    // ------------------------------------------------------------
    // RESPONSE
    // ------------------------------------------------------------

    res.status(200).json({
      success: true,

      data: {
        generatedAt: new Date().toISOString(),
        generatedBy: "Program Manager",

        analytics: {
          totalInterns,
          activeCohorts,
          completedProjects,
          inProgressProjects,
          planningProjects,
          averageProgress,
          highPriorityProjects,
          totalProjects,
        },

        projectStatus: {
          completedPercent,
          inProgressPercent,
          planningPercent,
        },

        cohorts,
        projects,

        interns,
        mentors,

        cohortPerformance,
        projectPerformance,
      },
    });
  } catch (error) {
    console.error("Get Report Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate report",
      error: error.message,
    });
  }
};

module.exports = {
  getReport,
};