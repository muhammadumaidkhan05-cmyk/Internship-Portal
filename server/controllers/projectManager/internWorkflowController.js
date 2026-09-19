const Task = require("../../models/Task");
const DailyScrum = require("../../models/DailyScrum");
const Submission = require("../../models/mentor/Submission");
const User = require("../../models/User");
const ProjectManagerProject = require("../../models/projectManager/ProjectManagerProject");
const ProjectManagerTeam = require("../../models/projectManager/ProjectManagerTeam");
const InternAssignment = require("../../models/mentor/InternAssignment");

const { ROLES } = require("../../constants/roles");
const { notifyUser } = require("../../services/notificationService");
const { onTaskAssigned } = require("../../services/workflowService");

// ============================================================
// PROJECT MANAGER - INTERN WORKFLOW CONTROLLER
// Covers the three things the Project Manager module needs in
// order to feed the Intern module:
//   1. put interns on a team / project / mentor
//   2. assign tasks to them
//   3. review the daily scrums they submit
// ============================================================

// ============================================================
// INTERN ROSTER
// ============================================================

const getInterns = async (req, res) => {
  try {
    const { teamId, projectId, unassigned } = req.query;

    const filter = { role: ROLES.INTERN };

    if (teamId) filter.teamId = teamId;
    if (projectId) filter.projectId = projectId;
    if (unassigned === "true") filter.teamId = null;

    const interns = await User.find(filter)
      .select(
        "name email status track cohort department teamId teamName projectId projectName mentorId createdAt"
      )
      .populate("mentorId", "name email specialization")
      .sort({ name: 1 });

    const withCounts = await Promise.all(
      interns.map(async (intern) => {
        const [totalTasks, approvedTasks, pendingScrums] = await Promise.all([
          Task.countDocuments({ assignedTo: intern._id }),
          Task.countDocuments({
            assignedTo: intern._id,
            status: "Approved",
          }),
          DailyScrum.countDocuments({
            userId: intern._id,
            reviewStatus: "Pending",
          }),
        ]);

        return {
          ...intern.toObject(),
          mentor: intern.mentorId || null,
          totalTasks,
          approvedTasks,
          pendingScrums,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: withCounts.length,
      data: withCounts,
    });
  } catch (error) {
    console.error("Get interns error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load interns.",
      error: error.message,
    });
  }
};

// ============================================================
// ASSIGN AN INTERN TO A TEAM / PROJECT / MENTOR
// ============================================================

const assignIntern = async (req, res) => {
  try {
    const { teamId, projectId, mentorId } = req.body;

    const intern = await User.findOne({
      _id: req.params.internId,
      role: ROLES.INTERN,
    });

    if (!intern) {
      return res.status(404).json({
        success: false,
        message: "Intern not found.",
      });
    }

    let team = null;
    let project = null;
    let mentor = null;

    if (teamId !== undefined) {
      if (teamId) {
        team = await ProjectManagerTeam.findById(teamId);

        if (!team) {
          return res.status(404).json({
            success: false,
            message: "Team not found.",
          });
        }

        intern.teamId = team._id;
        intern.teamName = team.teamName;
      } else {
        intern.teamId = null;
        intern.teamName = "";
      }
    }

    if (projectId !== undefined) {
      if (projectId) {
        project = await ProjectManagerProject.findById(projectId);

        if (!project) {
          return res.status(404).json({
            success: false,
            message: "Project not found.",
          });
        }

        intern.projectId = project._id;
        intern.projectName = project.name;
      } else {
        intern.projectId = null;
        intern.projectName = "";
      }
    }

    if (mentorId !== undefined) {
      if (mentorId) {
        mentor = await User.findOne({
          _id: mentorId,
          role: ROLES.MENTOR,
        });

        if (!mentor) {
          return res.status(404).json({
            success: false,
            message: "Mentor not found.",
          });
        }

        intern.mentorId = mentor._id;
      } else {
        intern.mentorId = null;
      }
    }

    intern.projectManagerId = req.user._id;

    await intern.save();

    // Keep the Mentor module's assignment list in step.
    if (intern.mentorId) {
      await InternAssignment.findOneAndUpdate(
        { mentorId: intern.mentorId, internId: intern._id },
        {
          mentorId: intern.mentorId,
          internId: intern._id,
          internName: intern.name,
          programId: intern.projectId ? String(intern.projectId) : "",
          programName: intern.projectName || intern.track || "",
          status: "Active",
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    await notifyUser({
      userId: intern._id,
      role: ROLES.INTERN,
      title: "Assignment Updated",
      message: `You have been assigned to ${
        intern.teamName || "a team"
      }${intern.projectName ? ` on ${intern.projectName}` : ""}${
        mentor ? ` with ${mentor.name} as your mentor` : ""
      }.`,
      type: "Team",
      relatedId: intern.teamId || "",
      relatedType: "team",
      link: "/intern/projects",
      createdBy: req.user.name,
      senderRole: "Project Manager",
    });

    return res.status(200).json({
      success: true,
      message: "Intern assignment updated.",
      data: intern,
    });
  } catch (error) {
    console.error("Assign intern error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update the intern assignment.",
      error: error.message,
    });
  }
};

// ============================================================
// TASK ASSIGNMENT
// ============================================================

const getTasks = async (req, res) => {
  try {
    const { assignedTo, projectId, status } = req.query;

    const filter = {};

    if (assignedTo) filter.assignedTo = assignedTo;
    if (projectId) filter.projectId = projectId;
    if (status) filter.status = status;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
      summary: {
        assigned: tasks.filter((task) =>
          ["Assigned", "In Progress"].includes(task.status)
        ).length,
        submitted: tasks.filter((task) => task.status === "Submitted").length,
        approved: tasks.filter((task) => task.status === "Approved").length,
        resubmit: tasks.filter((task) => task.status === "Resubmit").length,
      },
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load tasks.",
      error: error.message,
    });
  }
};

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      assignedTo,
      projectId,
      teamId,
      mentorId,
      priority,
      deadline,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required.",
      });
    }

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: "Please choose the intern this task is assigned to.",
      });
    }

    const intern = await User.findOne({
      _id: assignedTo,
      role: ROLES.INTERN,
    });

    if (!intern) {
      return res.status(404).json({
        success: false,
        message: "Intern not found.",
      });
    }

    const resolvedProjectId = projectId || intern.projectId || null;
    const resolvedTeamId = teamId || intern.teamId || null;
    const resolvedMentorId = mentorId || intern.mentorId || null;

    const [project, team, mentor] = await Promise.all([
      resolvedProjectId
        ? ProjectManagerProject.findById(resolvedProjectId)
        : null,
      resolvedTeamId ? ProjectManagerTeam.findById(resolvedTeamId) : null,
      resolvedMentorId ? User.findById(resolvedMentorId) : null,
    ]);

    const task = await Task.create({
      title: title.trim(),
      description: (description || "").trim(),
      assignedTo: intern._id,
      assignedToName: intern.name,
      assignedBy: req.user._id,
      assignedByName: req.user.name,
      mentorId: mentor?._id || null,
      mentorName: mentor?.name || "",
      projectId: project?._id || null,
      projectName: project?.name || intern.projectName || "",
      teamId: team?._id || null,
      teamName: team?.teamName || intern.teamName || "",
      priority: priority || "Medium",
      deadline: deadline ? new Date(deadline) : null,
      status: "Assigned",
    });

    await onTaskAssigned(task);

    return res.status(201).json({
      success: true,
      message: `Task assigned to ${intern.name}.`,
      data: task,
    });
  } catch (error) {
    console.error("Create task error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to assign the task.",
      error: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    const { title, description, priority, deadline, status, assignedTo } =
      req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Task title cannot be empty.",
        });
      }

      task.title = title.trim();
    }

    if (description !== undefined) task.description = description.trim();
    if (priority !== undefined) task.priority = priority;
    if (deadline !== undefined) {
      task.deadline = deadline ? new Date(deadline) : null;
    }

    if (status !== undefined) {
      if (
        !["Assigned", "In Progress", "Submitted", "Approved", "Resubmit"].includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid task status.",
        });
      }

      task.status = status;
    }

    let reassigned = false;

    if (assignedTo !== undefined && String(assignedTo) !== String(task.assignedTo)) {
      const intern = await User.findOne({
        _id: assignedTo,
        role: ROLES.INTERN,
      });

      if (!intern) {
        return res.status(404).json({
          success: false,
          message: "Intern not found.",
        });
      }

      task.assignedTo = intern._id;
      task.assignedToName = intern.name;
      task.mentorId = intern.mentorId || task.mentorId;
      task.status = "Assigned";
      reassigned = true;
    }

    await task.save();

    if (reassigned) {
      await onTaskAssigned(task);
    }

    return res.status(200).json({
      success: true,
      message: "Task updated.",
      data: task,
    });
  } catch (error) {
    console.error("Update task error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update the task.",
      error: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    await Submission.deleteMany({ taskId: task._id });
    await task.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Task deleted.",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete the task.",
      error: error.message,
    });
  }
};

// ============================================================
// DAILY SCRUM REVIEW  (page 14)
// ============================================================

const getInternScrums = async (req, res) => {
  try {
    const { status, internId, teamId } = req.query;

    const filter = {};

    if (status) filter.reviewStatus = status;
    if (internId) filter.userId = internId;
    if (teamId) filter.teamId = teamId;

    const scrums = await DailyScrum.find(filter)
      .populate("userId", "name email teamName projectName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: scrums.length,
      data: scrums,
      summary: {
        pending: await DailyScrum.countDocuments({ reviewStatus: "Pending" }),
        reviewed: await DailyScrum.countDocuments({
          reviewStatus: "Reviewed",
        }),
        needsAttention: await DailyScrum.countDocuments({
          reviewStatus: "Needs Attention",
        }),
      },
    });
  } catch (error) {
    console.error("Get intern scrums error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load daily scrums.",
      error: error.message,
    });
  }
};

const reviewInternScrum = async (req, res) => {
  try {
    const { reviewStatus, managerRemarks } = req.body;

    if (!["Reviewed", "Needs Attention"].includes(reviewStatus)) {
      return res.status(400).json({
        success: false,
        message:
          "Review status must be either 'Reviewed' or 'Needs Attention'.",
      });
    }

    const scrum = await DailyScrum.findById(req.params.id);

    if (!scrum) {
      return res.status(404).json({
        success: false,
        message: "Daily scrum not found.",
      });
    }

    scrum.reviewStatus = reviewStatus;
    scrum.managerRemarks = (managerRemarks || "").trim();
    scrum.reviewedBy = req.user._id;
    scrum.reviewedByName = req.user.name;
    scrum.reviewedAt = new Date();

    await scrum.save();

    await notifyUser({
      userId: scrum.userId,
      role: ROLES.INTERN,
      title:
        reviewStatus === "Reviewed"
          ? "Daily Scrum Reviewed"
          : "Daily Scrum Needs Attention",
      message:
        reviewStatus === "Reviewed"
          ? `${req.user.name} reviewed your daily scrum.${
              scrum.managerRemarks ? ` Remarks: ${scrum.managerRemarks}` : ""
            }`
          : `${req.user.name} flagged your daily scrum. ${
              scrum.managerRemarks || "Please follow up."
            }`,
      type: "Scrum",
      relatedId: scrum._id,
      relatedType: "scrum",
      link: "/intern/daily-scrum",
      createdBy: req.user.name,
      senderRole: "Project Manager",
    });

    return res.status(200).json({
      success: true,
      message: "Daily scrum reviewed.",
      data: scrum,
    });
  } catch (error) {
    console.error("Review intern scrum error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to review the daily scrum.",
      error: error.message,
    });
  }
};

module.exports = {
  getInterns,
  assignIntern,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getInternScrums,
  reviewInternScrum,
};
