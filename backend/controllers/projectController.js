const mongoose = require("mongoose");

const Project = require("../models/Project");
const Cohort = require("../models/Cohort");
const User = require("../models/User");

// ============================================================
// FIND PROJECT BY CUSTOM ID OR MONGODB _id
// ============================================================

const findProjectById = async (id) => {
  let project = await Project.findOne({
    id: String(id),
  });

  if (project) {
    return project;
  }

  if (mongoose.Types.ObjectId.isValid(id)) {
    project = await Project.findById(id);
  }

  return project;
};

// ============================================================
// FIND COHORT BY CUSTOM ID OR MONGODB _id
// ============================================================

const findCohortById = async (id) => {
  let cohort = await Cohort.findOne({
    id: String(id),
  });

  if (cohort) {
    return cohort;
  }

  if (mongoose.Types.ObjectId.isValid(id)) {
    cohort = await Cohort.findById(id);
  }

  return cohort;
};

// ============================================================
// FIND MENTOR
// ============================================================

const findMentorById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return User.findOne({
    _id: id,
    role: "mentor",
  });
};

// ============================================================
// CREATE PROJECT
// ============================================================

const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      cohortId,
      mentorId,
      priority,
      status,
      progress,
      deadline,
      tasks,
    } = req.body;

    // ----------------------------------------------------------
    // REQUIRED FIELDS
    // ----------------------------------------------------------

    if (
      !name ||
      !String(name).trim() ||
      !cohortId ||
      !mentorId ||
      !deadline
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, cohort, mentor and deadline are required.",
      });
    }

    // ----------------------------------------------------------
    // VALIDATE DATE
    // ----------------------------------------------------------

    const deadlineDate = new Date(deadline);

    if (Number.isNaN(deadlineDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid deadline.",
      });
    }

    // ----------------------------------------------------------
    // VALIDATE PROGRESS
    // ----------------------------------------------------------

    const projectProgress =
      progress !== undefined
        ? Number(progress)
        : 0;

    if (
      Number.isNaN(projectProgress) ||
      projectProgress < 0 ||
      projectProgress > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Progress must be between 0 and 100.",
      });
    }

    // ----------------------------------------------------------
    // FIND COHORT
    // ----------------------------------------------------------

    const cohort = await findCohortById(cohortId);

    if (!cohort) {
      return res.status(404).json({
        success: false,
        message: "Selected cohort not found.",
      });
    }

    // ----------------------------------------------------------
    // FIND MENTOR
    // ----------------------------------------------------------

    const mentor = await findMentorById(mentorId);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Selected mentor not found.",
      });
    }

    // ----------------------------------------------------------
    // CREATE PROJECT
    // ----------------------------------------------------------

    const project = await Project.create({
      id: `project-${Date.now()}-${Math.floor(
        Math.random() * 10000
      )}`,

      name: String(name).trim(),

      description: description
        ? String(description).trim()
        : "",

      cohortId: String(
        cohort.id || cohort._id
      ),

      cohortName: cohort.name || "",

      mentorId: String(mentor._id),

      mentorName: mentor.name || "",

      internIds: Array.isArray(cohort.internIds)
        ? cohort.internIds
        : [],

      priority: priority || "Medium",

      status: status || "Planning",

      progress: projectProgress,

      deadline: deadlineDate,

      tasks: Array.isArray(tasks)
        ? tasks
        : [],

      createdBy: "program-manager",
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      data: project,
    });
  } catch (error) {
    console.error(
      "Create project error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create project.",
      error: error.message,
    });
  }
};

// ============================================================
// GET ALL PROJECTS
// ============================================================

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error(
      "Get projects error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects.",
      error: error.message,
    });
  }
};

// ============================================================
// GET SINGLE PROJECT
// ============================================================

const getProjectById = async (req, res) => {
  try {
    const project = await findProjectById(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error(
      "Get project error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch project.",
      error: error.message,
    });
  }
};

// ============================================================
// UPDATE PROJECT
// ============================================================

const updateProject = async (req, res) => {
  try {
    const project = await findProjectById(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const {
      name,
      description,
      cohortId,
      mentorId,
      priority,
      status,
      progress,
      deadline,
      internIds,
    } = req.body;

    // ----------------------------------------------------------
    // NAME
    // ----------------------------------------------------------

    if (name !== undefined) {
      if (!String(name).trim()) {
        return res.status(400).json({
          success: false,
          message: "Project name is required.",
        });
      }

      project.name = String(name).trim();
    }

    // ----------------------------------------------------------
    // DESCRIPTION
    // ----------------------------------------------------------

    if (description !== undefined) {
      project.description =
        String(description).trim();
    }

    // ----------------------------------------------------------
    // COHORT
    // ----------------------------------------------------------

    if (cohortId !== undefined) {
      const cohort = await findCohortById(
        cohortId
      );

      if (!cohort) {
        return res.status(404).json({
          success: false,
          message: "Selected cohort not found.",
        });
      }

      project.cohortId = String(
        cohort.id || cohort._id
      );

      project.cohortName =
        cohort.name || "";

      project.internIds = Array.isArray(
        cohort.internIds
      )
        ? cohort.internIds
        : [];
    }

    // ----------------------------------------------------------
    // MENTOR
    // ----------------------------------------------------------

    if (mentorId !== undefined) {
      const mentor = await findMentorById(
        mentorId
      );

      if (!mentor) {
        return res.status(404).json({
          success: false,
          message: "Selected mentor not found.",
        });
      }

      project.mentorId = String(
        mentor._id
      );

      project.mentorName =
        mentor.name || "";
    }

    // ----------------------------------------------------------
    // PRIORITY
    // ----------------------------------------------------------

    if (priority !== undefined) {
      const allowedPriorities = [
        "High",
        "Medium",
        "Low",
      ];

      if (
        !allowedPriorities.includes(priority)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid project priority.",
        });
      }

      project.priority = priority;
    }

    // ----------------------------------------------------------
    // STATUS
    // ----------------------------------------------------------

    if (status !== undefined) {
      const allowedStatuses = [
        "Planning",
        "In Progress",
        "Completed",
      ];

      if (
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid project status.",
        });
      }

      project.status = status;
    }

    // ----------------------------------------------------------
    // PROGRESS
    // ----------------------------------------------------------

    if (progress !== undefined) {
      const projectProgress =
        Number(progress);

      if (
        Number.isNaN(projectProgress) ||
        projectProgress < 0 ||
        projectProgress > 100
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Progress must be between 0 and 100.",
        });
      }

      project.progress =
        projectProgress;
    }

    // ----------------------------------------------------------
    // DEADLINE
    // ----------------------------------------------------------

    if (deadline !== undefined) {
      const deadlineDate =
        new Date(deadline);

      if (
        Number.isNaN(
          deadlineDate.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide a valid deadline.",
        });
      }

      project.deadline =
        deadlineDate;
    }

    // ----------------------------------------------------------
    // INTERN IDS
    // ----------------------------------------------------------

    if (internIds !== undefined) {
      project.internIds =
        Array.isArray(internIds)
          ? internIds
          : [];
    }

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      data: project,
    });
  } catch (error) {
    console.error(
      "Update project error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update project.",
      error: error.message,
    });
  }
};

// ============================================================
// DELETE PROJECT
// ============================================================

const deleteProject = async (req, res) => {
  try {
    const project = await findProjectById(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    await project.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
      data: project,
    });
  } catch (error) {
    console.error(
      "Delete project error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete project.",
      error: error.message,
    });
  }
};

// ============================================================
// ADD PROJECT TASK
// ============================================================

const addProjectTask = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required.",
      });
    }

    const project = await findProjectById(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const task = {
      id: `task-${Date.now()}-${Math.floor(
        Math.random() * 10000
      )}`,

      title: String(title).trim(),

      status: "Pending",

      createdAt: new Date(),
    };

    project.tasks.push(task);

    await project.save();

    return res.status(201).json({
      success: true,
      message: "Task added successfully.",
      data: project,
    });
  } catch (error) {
    console.error(
      "Add project task error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to add task.",
      error: error.message,
    });
  }
};

// ============================================================
// TOGGLE PROJECT TASK
// ============================================================

const toggleProjectTask = async (
  req,
  res
) => {
  try {
    const project = await findProjectById(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const task = project.tasks.find(
      (item) =>
        item.id === req.params.taskId
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    task.status =
      task.status === "Completed"
        ? "Pending"
        : "Completed";

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Task status updated.",
      data: project,
    });
  } catch (error) {
    console.error(
      "Toggle task error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update task status.",
      error: error.message,
    });
  }
};

// ============================================================
// DELETE PROJECT TASK
// ============================================================

const deleteProjectTask = async (
  req,
  res
) => {
  try {
    const project = await findProjectById(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const oldLength =
      project.tasks.length;

    project.tasks =
      project.tasks.filter(
        (task) =>
          task.id !== req.params.taskId
      );

    if (
      project.tasks.length === oldLength
    ) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
      data: project,
    });
  } catch (error) {
    console.error(
      "Delete task error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete task.",
      error: error.message,
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectTask,
  toggleProjectTask,
  deleteProjectTask,
};