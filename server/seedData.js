const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

const { ROLES } = require("./constants/roles");

const User = require("./models/User");
const Cohort = require("./models/Cohort");
const Task = require("./models/Task");
const Notification = require("./models/Notification");
const DailyScrum = require("./models/DailyScrum");
const Attendance = require("./models/Attendance");
const Certificate = require("./models/Certificate");
const Submission = require("./models/mentor/Submission");
const Evaluation = require("./models/mentor/Evaluation");
const InternAssignment = require("./models/mentor/InternAssignment");
const MentorProfile = require("./models/mentor/MentorProfile");
const MentorNotification = require("./models/mentor/MentorNotification");
const ProjectManagerProject = require("./models/projectManager/ProjectManagerProject");
const ProjectManagerTeam = require("./models/projectManager/ProjectManagerTeam");
const ProjectManagerNotification = require("./models/projectManager/ProjectManagerNotification");

const { onTaskAssigned } = require("./services/workflowService");

// ============================================================
// SEED
// Creates one account per role plus a complete assignment chain
// (team -> project -> intern -> mentor -> task) so the whole
// workflow can be walked end to end immediately after install.
//
//   npm run seed
// ============================================================

const PASSWORD = "Msn@12345";

const seed = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGO_URI is missing from the .env file.");
    }

    await mongoose.connect(mongoURI);

    console.log("MongoDB connected for seeding...");

    // ----------------------------------------------------------
    // CLEAR
    // ----------------------------------------------------------

    await Promise.all([
      User.deleteMany({}),
      Cohort.deleteMany({}),
      Task.deleteMany({}),
      Notification.deleteMany({}),
      DailyScrum.deleteMany({}),
      Attendance.deleteMany({}),
      Certificate.deleteMany({}),
      Submission.deleteMany({}),
      Evaluation.deleteMany({}),
      InternAssignment.deleteMany({}),
      MentorProfile.deleteMany({}),
      MentorNotification.deleteMany({}),
      ProjectManagerProject.deleteMany({}),
      ProjectManagerTeam.deleteMany({}),
      ProjectManagerNotification.deleteMany({}),
    ]);

    console.log("Existing data cleared.");

    const password = await bcrypt.hash(PASSWORD, 10);

    // ----------------------------------------------------------
    // USERS - one per role
    // ----------------------------------------------------------

    const superAdmin = await User.create({
      name: "Amara Khan",
      email: "admin@msnacademy.com",
      password,
      role: ROLES.SUPER_ADMIN,
      status: "Active",
    });

    const programManager = await User.create({
      name: "Sarah Ahmed",
      email: "program.manager@msnacademy.com",
      password,
      role: ROLES.PROGRAM_MANAGER,
      status: "Active",
      department: "Program Management",
    });

    const projectManager = await User.create({
      name: "Bilal Raza",
      email: "project.manager@msnacademy.com",
      password,
      role: ROLES.PROJECT_MANAGER,
      status: "Active",
      department: "Project Management",
    });

    const mentor = await User.create({
      name: "Hina Malik",
      email: "mentor@msnacademy.com",
      password,
      role: ROLES.MENTOR,
      status: "Active",
      department: "Mentorship",
      specialization: "Full Stack Development",
      bio: "Mentors interns through the full stack track.",
    });

    await MentorProfile.create({
      userId: mentor._id,
      fullName: mentor.name,
      email: mentor.email,
      department: "Mentorship",
      specialization: mentor.specialization,
      bio: mentor.bio,
    });

    // ----------------------------------------------------------
    // COHORT
    // ----------------------------------------------------------

    const cohort = await Cohort.create({
      name: "Cohort 1",
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      status: "Active",
    }).catch(async (error) => {
      // The Cohort schema differs slightly between branches; fall
      // back to the minimum required shape rather than failing.
      console.warn("Cohort create warning:", error.message);
      return Cohort.create({ name: "Cohort 1" });
    });

    // ----------------------------------------------------------
    // TEAM + PROJECT
    // ----------------------------------------------------------

    const team = await ProjectManagerTeam.create({
      teamName: "Team Falcon",
      memberCount: 2,
      mentor: mentor.name,
      project: "Internship Management Portal",
      department: "Development",
      status: "Active",
      technologies: ["React", "Node.js", "MongoDB"],
      description: "Builds and maintains the internship portal.",
      progress: 35,
      startDate: new Date(),
    });

    const project = await ProjectManagerProject.create({
      name: "Internship Management Portal",
      description:
        "Role based portal covering scrums, tasks, reviews, evaluations and certificates.",
      cohortId: String(cohort._id),
      cohortName: cohort.name || "Cohort 1",
      mentorId: String(mentor._id),
      mentorName: mentor.name,
      priority: "High",
      status: "In Progress",
      progress: 35,
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    });

    // ----------------------------------------------------------
    // INTERNS - fully assigned
    // ----------------------------------------------------------

    const internSeeds = [
      { name: "Ayesha Noor", email: "intern@msnacademy.com" },
      { name: "Usman Tariq", email: "intern2@msnacademy.com" },
    ];

    const interns = [];

    for (const seedIntern of internSeeds) {
      const intern = await User.create({
        name: seedIntern.name,
        email: seedIntern.email,
        password,
        role: ROLES.INTERN,
        status: "Active",
        track: "Full Stack Development",
        cohort: cohort.name || "Cohort 1",
        department: "Full Stack Development",
        mentorId: mentor._id,
        projectManagerId: projectManager._id,
        teamId: team._id,
        teamName: team.teamName,
        projectId: project._id,
        projectName: project.name,
      });

      await InternAssignment.create({
        mentorId: mentor._id,
        internId: intern._id,
        internName: intern.name,
        programId: String(project._id),
        programName: project.name,
        status: "Active",
        milestone: "Mid-Internship",
      });

      interns.push(intern);
    }

    // ----------------------------------------------------------
    // TASKS - one per intern, notifications fired by the workflow
    // ----------------------------------------------------------

    const taskSeeds = [
      {
        title: "Build the submission form",
        description:
          "Implement the task submission form with repository link and attachments.",
        priority: "High",
      },
      {
        title: "Write the attendance report query",
        description:
          "Aggregate attendance per intern and expose it to the dashboard.",
        priority: "Medium",
      },
    ];

    for (let index = 0; index < interns.length; index += 1) {
      const intern = interns[index];
      const taskSeed = taskSeeds[index];

      const task = await Task.create({
        title: taskSeed.title,
        description: taskSeed.description,
        assignedTo: intern._id,
        assignedToName: intern.name,
        assignedBy: projectManager._id,
        assignedByName: projectManager.name,
        mentorId: mentor._id,
        mentorName: mentor.name,
        projectId: project._id,
        projectName: project.name,
        teamId: team._id,
        teamName: team.teamName,
        priority: taskSeed.priority,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "Assigned",
      });

      await onTaskAssigned(task);
    }

    // ----------------------------------------------------------
    // ATTENDANCE - a few days for the first intern
    // ----------------------------------------------------------

    for (let dayOffset = 4; dayOffset >= 1; dayOffset -= 1) {
      const date = new Date(Date.now() - dayOffset * 24 * 60 * 60 * 1000);

      await Attendance.create({
        userId: interns[0]._id,
        date: date.toISOString().split("T")[0],
        checkIn: "09:05",
        checkOut: "17:30",
        status: dayOffset === 3 ? "Absent" : "Present",
      });
    }

    console.log("");
    console.log("==========================================");
    console.log("MSN ACADEMY SEED DATA CREATED");
    console.log("==========================================");
    console.log(`Shared password: ${PASSWORD}`);
    console.log("");
    console.log(`Super Admin      : ${superAdmin.email}`);
    console.log(`Program Manager  : ${programManager.email}`);
    console.log(`Project Manager  : ${projectManager.email}`);
    console.log(`Mentor           : ${mentor.email}`);
    interns.forEach((intern) => {
      console.log(`Intern           : ${intern.email}`);
    });
    console.log("");
    console.log(`Team    : ${team.teamName}`);
    console.log(`Project : ${project.name}`);
    console.log(`Tasks   : ${taskSeeds.length} assigned and notified`);
    console.log("==========================================");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seed();
