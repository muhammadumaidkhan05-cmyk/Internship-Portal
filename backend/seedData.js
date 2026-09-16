const mongoose = require("mongoose");
const dotenv = require("dotenv");

const User = require("./models/User");
const Cohort = require("./models/Cohort");
const Project = require("./models/Project");
const Notification = require("./models/Notification");

dotenv.config();

const seedData = async () => {
  try {
    // ==========================================
    // CONNECT DATABASE
    // ==========================================
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected for seeding...");

    // ==========================================
    // CLEAR OLD SEED DATA
    // ==========================================
    await User.deleteMany({});
    await Cohort.deleteMany({});
    await Project.deleteMany({});
    await Notification.deleteMany({});

    console.log("Old data cleared.");

    // ==========================================
    // USERS
    // ==========================================
    const users = await User.create([
      {
        name: "Sarah Ahmed",
        email: "sarah.pm@msnacademy.com",
        password: "123456",
        role: "program-manager",
        status: "Active",
      },

      {
        name: "Ali Raza",
        email: "ali.mentor@msnacademy.com",
        password: "123456",
        role: "mentor",
        status: "Active",
      },

      {
        name: "Maham Khan",
        email: "maham.mentor@msnacademy.com",
        password: "123456",
        role: "mentor",
        status: "Active",
      },

      {
        name: "Ayesha Ali",
        email: "ayesha.intern@msnacademy.com",
        password: "123456",
        role: "intern",
        status: "Active",
      },

      {
        name: "Hamza Ahmed",
        email: "hamza.intern@msnacademy.com",
        password: "123456",
        role: "intern",
        status: "Active",
      },

      {
        name: "Zainab Fatima",
        email: "zainab.intern@msnacademy.com",
        password: "123456",
        role: "intern",
        status: "Active",
      },

      {
        name: "Usman Khan",
        email: "usman.intern@msnacademy.com",
        password: "123456",
        role: "intern",
        status: "Active",
      },

      {
        name: "Hira Malik",
        email: "hira.intern@msnacademy.com",
        password: "123456",
        role: "intern",
        status: "Active",
      },

      {
        name: "Bilal Shah",
        email: "bilal.intern@msnacademy.com",
        password: "123456",
        role: "intern",
        status: "Active",
      },
    ]);

    const programManager = users.find(
      (user) => user.role === "program-manager"
    );

    const mentorAli = users.find(
      (user) => user.email === "ali.mentor@msnacademy.com"
    );

    const mentorMaham = users.find(
      (user) => user.email === "maham.mentor@msnacademy.com"
    );

    const interns = users.filter(
      (user) => user.role === "intern"
    );

    // ==========================================
    // COHORTS
    // ==========================================
    const cohorts = await Cohort.create([
      {
        name: "MERN Stack Cohort 01",
        program: "Full Stack Web Development",
        mentorId: mentorAli._id.toString(),
        mentorName: mentorAli.name,
        internIds: [
          interns[0]._id.toString(),
          interns[1]._id.toString(),
        ],
        interns: 2,
        progress: 78,
        status: "Active",
        startDate: new Date("2026-07-01"),
        endDate: new Date("2026-10-01"),
        description:
          "Full stack development training focused on MongoDB, Express, React and Node.js.",
        createdBy: programManager._id.toString(),
      },

      {
        name: "Web Development Cohort 02",
        program: "Frontend Development",
        mentorId: mentorMaham._id.toString(),
        mentorName: mentorMaham.name,
        internIds: [
          interns[2]._id.toString(),
          interns[3]._id.toString(),
        ],
        interns: 2,
        progress: 62,
        status: "Active",
        startDate: new Date("2026-08-01"),
        endDate: new Date("2026-11-01"),
        description:
          "Frontend development program covering React, JavaScript and responsive UI development.",
        createdBy: programManager._id.toString(),
      },

      {
        name: "UI/UX Design Cohort",
        program: "UI/UX Design",
        mentorId: mentorAli._id.toString(),
        mentorName: mentorAli.name,
        internIds: [
          interns[4]._id.toString(),
          interns[5]._id.toString(),
        ],
        interns: 2,
        progress: 45,
        status: "Upcoming",
        startDate: new Date("2026-10-01"),
        endDate: new Date("2027-01-01"),
        description:
          "UI/UX design training focused on user research, wireframes and modern interface design.",
        createdBy: programManager._id.toString(),
      },
    ]);

    // ==========================================
    // PROJECTS
    // ==========================================
    const projects = await Project.create([
      {
        id: "PRJ-001",
        name: "MSN Internship Portal",
        description:
          "A complete internship management portal for interns, mentors, program managers and administrators.",
        cohortId: cohorts[0]._id.toString(),
        cohortName: cohorts[0].name,
        mentorId: mentorAli._id.toString(),
        mentorName: mentorAli.name,
        internIds: cohorts[0].internIds,
        priority: "High",
        status: "In Progress",
        progress: 72,
        deadline: new Date("2026-09-25"),
        tasks: [
          {
            id: "TASK-001",
            title: "Authentication Module",
            status: "Completed",
          },
          {
            id: "TASK-002",
            title: "Dashboard Development",
            status: "Completed",
          },
          {
            id: "TASK-003",
            title: "Reports Module",
            status: "Pending",
          },
        ],
        createdBy: programManager._id.toString(),
      },

      {
        id: "PRJ-002",
        name: "E-Learning Platform",
        description:
          "Online learning platform for academy students and interns.",
        cohortId: cohorts[0]._id.toString(),
        cohortName: cohorts[0].name,
        mentorId: mentorAli._id.toString(),
        mentorName: mentorAli.name,
        internIds: cohorts[0].internIds,
        priority: "Medium",
        status: "Completed",
        progress: 100,
        deadline: new Date("2026-09-10"),
        tasks: [
          {
            id: "TASK-004",
            title: "Course Module",
            status: "Completed",
          },
          {
            id: "TASK-005",
            title: "Student Dashboard",
            status: "Completed",
          },
        ],
        createdBy: programManager._id.toString(),
      },

      {
        id: "PRJ-003",
        name: "Attendance Management System",
        description:
          "Digital attendance and daily scrum management system.",
        cohortId: cohorts[1]._id.toString(),
        cohortName: cohorts[1].name,
        mentorId: mentorMaham._id.toString(),
        mentorName: mentorMaham.name,
        internIds: cohorts[1].internIds,
        priority: "High",
        status: "In Progress",
        progress: 58,
        deadline: new Date("2026-10-05"),
        tasks: [
          {
            id: "TASK-006",
            title: "Attendance API",
            status: "Completed",
          },
          {
            id: "TASK-007",
            title: "Attendance UI",
            status: "Pending",
          },
        ],
        createdBy: programManager._id.toString(),
      },

      {
        id: "PRJ-004",
        name: "Portfolio Website",
        description:
          "Professional portfolio website development project.",
        cohortId: cohorts[1]._id.toString(),
        cohortName: cohorts[1].name,
        mentorId: mentorMaham._id.toString(),
        mentorName: mentorMaham.name,
        internIds: cohorts[1].internIds,
        priority: "Low",
        status: "Planning",
        progress: 20,
        deadline: new Date("2026-11-15"),
        tasks: [
          {
            id: "TASK-008",
            title: "Requirements Gathering",
            status: "Completed",
          },
          {
            id: "TASK-009",
            title: "UI Design",
            status: "Pending",
          },
        ],
        createdBy: programManager._id.toString(),
      },

      {
        id: "PRJ-005",
        name: "Academy Mobile App",
        description:
          "Mobile application concept for MSN Academy students.",
        cohortId: cohorts[2]._id.toString(),
        cohortName: cohorts[2].name,
        mentorId: mentorAli._id.toString(),
        mentorName: mentorAli.name,
        internIds: cohorts[2].internIds,
        priority: "Medium",
        status: "Planning",
        progress: 10,
        deadline: new Date("2026-12-20"),
        tasks: [
          {
            id: "TASK-010",
            title: "Project Planning",
            status: "Pending",
          },
        ],
        createdBy: programManager._id.toString(),
      },
    ]);

    // ==========================================
    // NOTIFICATIONS
    // ==========================================
    await Notification.create([
      {
        id: "NOT-001",
        title: "Project Deadline Approaching",
        message:
          "MSN Internship Portal project deadline is approaching.",
        type: "warning",
        recipientRole: "program-manager",
        relatedId: projects[0]._id.toString(),
        relatedType: "project",
        link: "/program-manager/projects",
        isRead: false,
        createdBy: programManager._id.toString(),
      },

      {
        id: "NOT-002",
        title: "Project Completed",
        message:
          "E-Learning Platform project has been completed successfully.",
        type: "success",
        recipientRole: "program-manager",
        relatedId: projects[1]._id.toString(),
        relatedType: "project",
        link: "/program-manager/projects",
        isRead: false,
        createdBy: programManager._id.toString(),
      },

      {
        id: "NOT-003",
        title: "New Cohort Active",
        message:
          "Web Development Cohort 02 is now active.",
        type: "info",
        recipientRole: "program-manager",
        relatedId: cohorts[1]._id.toString(),
        relatedType: "cohort",
        link: "/program-manager/cohorts",
        isRead: false,
        createdBy: programManager._id.toString(),
      },

      {
        id: "NOT-004",
        title: "High Priority Project",
        message:
          "Attendance Management System requires attention.",
        type: "warning",
        recipientRole: "program-manager",
        relatedId: projects[2]._id.toString(),
        relatedType: "project",
        link: "/program-manager/projects",
        isRead: false,
        createdBy: programManager._id.toString(),
      },
    ]);

    console.log("");
    console.log("==========================================");
    console.log("MSN ACADEMY SEED DATA CREATED");
    console.log("==========================================");
    console.log(`Users: ${users.length}`);
    console.log(`Cohorts: ${cohorts.length}`);
    console.log(`Projects: ${projects.length}`);
    console.log("Notifications: 4");
    console.log("==========================================");

    process.exit(0);
  } catch (error) {
    console.error("Seed Data Error:", error);
    process.exit(1);
  }
};

seedData();