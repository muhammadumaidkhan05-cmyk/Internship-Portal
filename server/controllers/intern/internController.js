const Task = require("../../models/Task");
const Submission = require("../../models/mentor/Submission");
const DailyScrum = require("../../models/DailyScrum");
const Attendance = require("../../models/Attendance");
const Certificate = require("../../models/Certificate");
const Notification = require("../../models/Notification");
const Evaluation = require("../../models/mentor/Evaluation");
const User = require("../../models/User");
const ProjectManagerProject = require("../../models/projectManager/ProjectManagerProject");
const ProjectManagerTeam = require("../../models/projectManager/ProjectManagerTeam");

const { notifyProjectManager } = require("../../services/notificationService");

// ============================================================
// INTERN MODULE CONTROLLER
// Everything here is scoped to req.user._id, so an intern can
// only ever read or write their own records.
// ============================================================

const internId = (req) => req.user._id;

// ============================================================
// DASHBOARD
// ============================================================

const getDashboard = async (req, res) => {
  try {
    const id = internId(req);

    const [
      tasks,
      submissions,
      attendance,
      scrums,
      certificates,
      notifications,
      evaluations,
      intern,
    ] = await Promise.all([
      Task.find({ assignedTo: id }).sort({ createdAt: -1 }),
      Submission.find({ internId: id }).sort({ createdAt: -1 }),
      Attendance.find({ userId: id }).sort({ date: -1 }),
      DailyScrum.find({ userId: id }).sort({ createdAt: -1 }),
      Certificate.find({ userId: id }).sort({ createdAt: -1 }),
      Notification.find({ userId: id }).sort({ createdAt: -1 }).limit(20),
      Evaluation.find({ internId: id }).sort({ createdAt: -1 }),
      User.findById(id),
    ]);

    const presentDays = attendance.filter(
      (item) => item.status === "Present"
    ).length;

    const absentDays = attendance.filter(
      (item) => item.status === "Absent"
    ).length;

    const totalAttendance = presentDays + absentDays;

    const project = intern?.projectId
      ? await ProjectManagerProject.findById(intern.projectId)
      : null;

    const team = intern?.teamId
      ? await ProjectManagerTeam.findById(intern.teamId)
      : null;

    const mentor = intern?.mentorId
      ? await User.findById(intern.mentorId).select("name email specialization")
      : null;

    const approvedTasks = tasks.filter(
      (task) => task.status === "Approved"
    ).length;

    const averageEvaluation =
      evaluations.length > 0
        ? Math.round(
            evaluations.reduce(
              (total, item) => total + Number(item.totalScore || 0),
              0
            ) / evaluations.length
          )
        : null;

    return res.status(200).json({
      success: true,
      data: {
        intern: {
          id: intern?._id,
          name: intern?.name,
          email: intern?.email,
          track: intern?.track,
          cohort: intern?.cohort,
          department: intern?.department,
        },
        assignment: {
          project: project
            ? {
                id: project._id,
                name: project.name,
                status: project.status,
                progress: project.progress,
                deadline: project.deadline,
              }
            : null,
          team: team
            ? {
                id: team._id,
                name: team.teamName,
                department: team.department,
                status: team.status,
                progress: team.progress,
              }
            : null,
          mentor: mentor
            ? {
                id: mentor._id,
                name: mentor.name,
                email: mentor.email,
                specialization: mentor.specialization,
              }
            : null,
        },
        stats: {
          totalTasks: tasks.length,
          approvedTasks,
          pendingTasks: tasks.filter((task) =>
            ["Assigned", "In Progress", "Resubmit"].includes(task.status)
          ).length,
          awaitingReview: tasks.filter((task) => task.status === "Submitted")
            .length,
          totalSubmissions: submissions.length,
          pendingSubmissions: submissions.filter(
            (item) => item.status === "pending"
          ).length,
          approvedSubmissions: submissions.filter(
            (item) => item.status === "approved"
          ).length,
          resubmitSubmissions: submissions.filter(
            (item) => item.status === "resubmission_required"
          ).length,
          presentDays,
          absentDays,
          attendancePercentage:
            totalAttendance > 0
              ? Math.round((presentDays / totalAttendance) * 100)
              : 0,
          totalScrums: scrums.length,
          pendingScrumReviews: scrums.filter(
            (item) => item.reviewStatus === "Pending"
          ).length,
          certificates: certificates.length,
          unreadNotifications: notifications.filter((item) => !item.isRead)
            .length,
          averageEvaluation,
        },
        tasks: tasks.slice(0, 5),
        submissions: submissions.slice(0, 5),
        scrums: scrums.slice(0, 5),
        notifications: notifications.slice(0, 5),
        certificates,
        evaluations,
      },
    });
  } catch (error) {
    console.error("Intern dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load the intern dashboard.",
      error: error.message,
    });
  }
};

// ============================================================
// MY PROJECTS
// ============================================================

const getMyProjects = async (req, res) => {
  try {
    const id = internId(req);

    const intern = await User.findById(id);

    if (!intern?.projectId) {
      return res.status(200).json({
        success: true,
        data: [],
        message:
          "You have not been assigned to a project yet. Your Project Manager will assign one.",
      });
    }

    const project = await ProjectManagerProject.findById(intern.projectId);

    if (!project) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "Your assigned project could not be found.",
      });
    }

    const [team, tasks, members, mentor] = await Promise.all([
      intern.teamId ? ProjectManagerTeam.findById(intern.teamId) : null,
      Task.find({ assignedTo: id, projectId: project._id }).sort({
        createdAt: -1,
      }),
      User.find({
        projectId: project._id,
        role: "intern",
      }).select("name email teamName"),
      intern.mentorId
        ? User.findById(intern.mentorId).select("name email specialization")
        : null,
    ]);

    const approved = tasks.filter((task) => task.status === "Approved").length;

    return res.status(200).json({
      success: true,
      data: [
        {
          _id: project._id,
          title: project.name,
          description: project.description,
          status: project.status,
          priority: project.priority,
          deadline: project.deadline,
          progress:
            tasks.length > 0
              ? Math.round((approved / tasks.length) * 100)
              : project.progress,
          projectProgress: project.progress,
          team: team
            ? {
                _id: team._id,
                name: team.teamName,
                department: team.department,
                technologies: team.technologies,
                status: team.status,
              }
            : null,
          mentor: mentor
            ? {
                _id: mentor._id,
                name: mentor.name,
                email: mentor.email,
                specialization: mentor.specialization,
              }
            : null,
          members: members.map((member) => ({
            _id: member._id,
            name: member.name,
            email: member.email,
            teamName: member.teamName,
          })),
          tasks,
          taskSummary: {
            total: tasks.length,
            approved,
            submitted: tasks.filter((task) => task.status === "Submitted")
              .length,
            open: tasks.filter((task) =>
              ["Assigned", "In Progress", "Resubmit"].includes(task.status)
            ).length,
          },
        },
      ],
    });
  } catch (error) {
    console.error("Intern projects error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load your project.",
      error: error.message,
    });
  }
};

// ============================================================
// DAILY SCRUM
// ============================================================

const getMyScrums = async (req, res) => {
  try {
    const scrums = await DailyScrum.find({ userId: internId(req) }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: scrums.length,
      data: scrums,
    });
  } catch (error) {
    console.error("Get scrums error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load your daily scrums.",
      error: error.message,
    });
  }
};

const createScrum = async (req, res) => {
  try {
    const { yesterday, today, blockers } = req.body;

    if (!yesterday || !yesterday.trim() || !today || !today.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Both yesterday's progress and today's plan are required.",
      });
    }

    const intern = await User.findById(internId(req));

    const scrum = await DailyScrum.create({
      userId: intern._id,
      internName: intern.name,
      yesterday: yesterday.trim(),
      today: today.trim(),
      blockers: (blockers || "").trim(),
      projectId: intern.projectId || null,
      projectName: intern.projectName || "",
      teamId: intern.teamId || null,
      teamName: intern.teamName || "",
      projectManagerId: intern.projectManagerId || null,
      reviewStatus: "Pending",
    });

    // The Project Manager's Scrum Review page picks this up.
    await notifyProjectManager({
      title: "Daily Scrum Submitted",
      message: `${intern.name} submitted a daily scrum${
        intern.teamName ? ` for ${intern.teamName}` : ""
      }.`,
      type: "Scrum",
      priority: (blockers || "").trim() ? "High" : "Medium",
      sourceRole: "System",
      sourceType: "Scrum",
      sourceId: scrum._id,
      relatedId: scrum._id,
      relatedName: intern.name,
      createdBy: intern.name,
    });

    return res.status(201).json({
      success: true,
      message: "Daily scrum submitted. Your Project Manager will review it.",
      data: scrum,
    });
  } catch (error) {
    console.error("Create scrum error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit your daily scrum.",
      error: error.message,
    });
  }
};

const deleteScrum = async (req, res) => {
  try {
    const scrum = await DailyScrum.findOne({
      _id: req.params.id,
      userId: internId(req),
    });

    if (!scrum) {
      return res.status(404).json({
        success: false,
        message: "Daily scrum not found.",
      });
    }

    if (scrum.reviewStatus !== "Pending") {
      return res.status(409).json({
        success: false,
        message: "A reviewed scrum cannot be deleted.",
      });
    }

    await scrum.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Daily scrum deleted.",
    });
  } catch (error) {
    console.error("Delete scrum error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete the daily scrum.",
      error: error.message,
    });
  }
};

// ============================================================
// ATTENDANCE
// ============================================================

const getMyAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      userId: internId(req),
    }).sort({ date: -1 });

    return res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error) {
    console.error("Get attendance error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load attendance.",
      error: error.message,
    });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { date, checkIn, checkOut, status } = req.body;

    const attendanceDate =
      (date && String(date).trim()) ||
      new Date().toISOString().split("T")[0];

    const existing = await Attendance.findOne({
      userId: internId(req),
      date: attendanceDate,
    });

    if (existing) {
      existing.checkIn = checkIn ?? existing.checkIn;
      existing.checkOut = checkOut ?? existing.checkOut;
      existing.status = status || existing.status;

      await existing.save();

      return res.status(200).json({
        success: true,
        message: "Attendance updated.",
        data: existing,
      });
    }

    const attendance = await Attendance.create({
      userId: internId(req),
      date: attendanceDate,
      checkIn: checkIn || "",
      checkOut: checkOut || "",
      status: status || "Present",
    });

    return res.status(201).json({
      success: true,
      message: "Attendance recorded.",
      data: attendance,
    });
  } catch (error) {
    console.error("Mark attendance error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to record attendance.",
      error: error.message,
    });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findOneAndUpdate(
      { _id: req.params.id, userId: internId(req) },
      {
        ...(req.body.checkIn !== undefined && { checkIn: req.body.checkIn }),
        ...(req.body.checkOut !== undefined && {
          checkOut: req.body.checkOut,
        }),
        ...(req.body.status !== undefined && { status: req.body.status }),
      },
      { new: true, runValidators: true }
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Attendance updated.",
      data: attendance,
    });
  } catch (error) {
    console.error("Update attendance error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update attendance.",
      error: error.message,
    });
  }
};

// ============================================================
// CERTIFICATES
// ============================================================

const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({
      userId: internId(req),
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates,
    });
  } catch (error) {
    console.error("Get certificates error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load certificates.",
      error: error.message,
    });
  }
};

// ============================================================
// EVALUATIONS (read-only for the intern)
// ============================================================

const getMyEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.find({
      internId: internId(req),
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: evaluations.length,
      data: evaluations,
    });
  } catch (error) {
    console.error("Get evaluations error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load evaluations.",
      error: error.message,
    });
  }
};

// ============================================================
// PROFILE
// ============================================================

const getProfile = async (req, res) => {
  try {
    const intern = await User.findById(internId(req));

    if (!intern) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: intern,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load your profile.",
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, department, bio, avatar } = req.body;

    const intern = await User.findById(internId(req));

    if (!intern) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty.",
        });
      }

      intern.name = name.trim();
    }

    if (phone !== undefined) intern.phone = phone.trim();
    if (department !== undefined) intern.department = department.trim();
    if (bio !== undefined) intern.bio = bio.trim();
    if (avatar !== undefined) intern.avatar = avatar.trim();

    await intern.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated.",
      data: intern,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update your profile.",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboard,
  getMyProjects,
  getMyScrums,
  createScrum,
  deleteScrum,
  getMyAttendance,
  markAttendance,
  updateAttendance,
  getMyCertificates,
  getMyEvaluations,
  getProfile,
  updateProfile,
};
