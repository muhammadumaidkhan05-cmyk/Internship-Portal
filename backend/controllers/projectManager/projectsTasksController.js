const ProjectManagerProject = require(
  "../../models/projectManager/ProjectManagerProject"
);

// ============================================================
// GET ALL PROJECTS
// ============================================================

const getProjects = async (req, res) => {
  try {
    const projects =
      await ProjectManagerProject.find().sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error(
      "Get Project Manager projects error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

// ============================================================
// GET SINGLE PROJECT
// ============================================================

const getProjectById = async (req, res) => {
  try {
    const project =
      await ProjectManagerProject.findById(
        req.params.id
      );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error(
      "Get single project error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error: error.message,
    });
  }
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
      cohortName,
      mentorId,
      mentorName,
      priority,
      status,
      progress,
      deadline,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    if (!deadline) {
      return res.status(400).json({
        success: false,
        message: "Project deadline is required",
      });
    }

    const parsedDeadline =
      new Date(deadline);

    if (
      Number.isNaN(
        parsedDeadline.getTime()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid project deadline",
      });
    }

    let projectProgress =
      Number(progress || 0);

    if (projectProgress < 0) {
      projectProgress = 0;
    }

    if (projectProgress > 100) {
      projectProgress = 100;
    }

    const project =
      await ProjectManagerProject.create({
        name: name.trim(),

        description:
          description?.trim() || "",

        cohortId:
          cohortId || "",

        cohortName:
          cohortName?.trim() ||
          "Unassigned",

        mentorId:
          mentorId || "",

        mentorName:
          mentorName?.trim() ||
          "Unassigned",

        priority:
          priority || "Medium",

        status:
          status || "Planning",

        progress:
          projectProgress,

        deadline:
          parsedDeadline,

        tasks: [],
      });

    res.status(201).json({
      success: true,
      message:
        "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.error(
      "Create Project Manager project error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create project",
      error: error.message,
    });
  }
};

// ============================================================
// UPDATE PROJECT
// ============================================================

const updateProject = async (req, res) => {
  try {
    const project =
      await ProjectManagerProject.findById(
        req.params.id
      );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const {
      name,
      description,
      cohortId,
      cohortName,
      mentorId,
      mentorName,
      priority,
      status,
      progress,
      deadline,
    } = req.body;

    if (
      name !== undefined &&
      !String(name).trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Project name cannot be empty",
      });
    }

    if (name !== undefined) {
      project.name =
        String(name).trim();
    }

    if (description !== undefined) {
      project.description =
        String(description).trim();
    }

    if (cohortId !== undefined) {
      project.cohortId =
        cohortId;
    }

    if (cohortName !== undefined) {
      project.cohortName =
        String(cohortName).trim();
    }

    if (mentorId !== undefined) {
      project.mentorId =
        mentorId;
    }

    if (mentorName !== undefined) {
      project.mentorName =
        String(mentorName).trim();
    }

    if (priority !== undefined) {
      project.priority =
        priority;
    }

    if (status !== undefined) {
      project.status =
        status;
    }

    if (progress !== undefined) {
      let updatedProgress =
        Number(progress);

      if (
        Number.isNaN(updatedProgress)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Progress must be a number",
        });
      }

      if (updatedProgress < 0) {
        updatedProgress = 0;
      }

      if (updatedProgress > 100) {
        updatedProgress = 100;
      }

      project.progress =
        updatedProgress;
    }

    if (deadline !== undefined) {
      const parsedDeadline =
        new Date(deadline);

      if (
        Number.isNaN(
          parsedDeadline.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid project deadline",
        });
      }

      project.deadline =
        parsedDeadline;
    }

    const updatedProject =
      await project.save();

    res.status(200).json({
      success: true,
      message:
        "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error(
      "Update Project Manager project error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: error.message,
    });
  }
};

// ============================================================
// DELETE PROJECT
// ============================================================

const deleteProject = async (req, res) => {
  try {
    const project =
      await ProjectManagerProject.findById(
        req.params.id
      );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await ProjectManagerProject.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Project deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Project Manager project error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message,
    });
  }
};

// ============================================================
// ADD PROJECT TASK
// ============================================================

const addProjectTask = async (
  req,
  res
) => {
  try {
    const project =
      await ProjectManagerProject.findById(
        req.params.id
      );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    project.tasks.push({
      title: title.trim(),
      status: "Pending",
      completed: false,
    });

    const updatedProject =
      await project.save();

    res.status(201).json({
      success: true,
      message:
        "Task added successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error(
      "Add project task error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to add task",
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
    const project =
      await ProjectManagerProject.findById(
        req.params.id
      );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const task =
      project.tasks.id(
        req.params.taskId
      );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.completed =
      !task.completed;

    task.status =
      task.completed
        ? "Completed"
        : "Pending";

    const updatedProject =
      await project.save();

    res.status(200).json({
      success: true,
      message:
        task.completed
          ? "Task completed"
          : "Task marked as pending",
      data: updatedProject,
    });
  } catch (error) {
    console.error(
      "Toggle project task error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update task",
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
    const project =
      await ProjectManagerProject.findById(
        req.params.id
      );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const task =
      project.tasks.id(
        req.params.taskId
      );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.deleteOne();

    const updatedProject =
      await project.save();

    res.status(200).json({
      success: true,
      message:
        "Task deleted successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error(
      "Delete project task error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete task",
      error: error.message,
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,

  addProjectTask,
  toggleProjectTask,
  deleteProjectTask,
};