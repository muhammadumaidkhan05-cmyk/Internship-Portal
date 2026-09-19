// ============================================================
// MSN ACADEMY - PROGRAM MANAGER SHARED DATA
// ============================================================

export const STORAGE_KEYS = {
  cohorts: "msnAcademyCohorts",
  projects: "msnAcademyProjects",
  notifications: "msnAcademyNotifications",
  interns: "msnAcademyInterns",
  mentors: "msnAcademyMentors",
};

const defaultCohorts = [
  {
    id: "cohort-001",
    name: "MERN Cohort A",
    program: "Full Stack Development",
    mentorId: "mentor-001",
    mentorName: "Ali Ahmed",
    internIds: ["intern-001", "intern-002", "intern-003"],
    interns: 18,
    progress: 82,
    status: "Active",
    startDate: "2026-07-01",
    endDate: "2026-10-01",
    description:
      "Full stack MERN development internship cohort.",
    createdBy: "program-manager",
    createdAt: "2026-07-01",
  },
  {
    id: "cohort-002",
    name: "Web Development Cohort B",
    program: "Web Development",
    mentorId: "mentor-002",
    mentorName: "Sara Khan",
    internIds: ["intern-004", "intern-005"],
    interns: 15,
    progress: 74,
    status: "Active",
    startDate: "2026-07-15",
    endDate: "2026-10-15",
    description:
      "Modern responsive web development program.",
    createdBy: "program-manager",
    createdAt: "2026-07-15",
  },
  {
    id: "cohort-003",
    name: "Software Engineering Cohort C",
    program: "Software Engineering",
    mentorId: "mentor-003",
    mentorName: "Usman Malik",
    internIds: ["intern-006", "intern-007"],
    interns: 15,
    progress: 71,
    status: "Active",
    startDate: "2026-08-01",
    endDate: "2026-11-01",
    description:
      "Software engineering fundamentals and practical development.",
    createdBy: "program-manager",
    createdAt: "2026-08-01",
  },
];

const defaultProjects = [
  {
    id: "project-001",
    name: "E-Commerce Platform",
    description:
      "Build a complete responsive e-commerce application.",
    cohortId: "cohort-001",
    cohortName: "MERN Cohort A",
    mentorId: "mentor-001",
    mentorName: "Ali Ahmed",
    internIds: ["intern-001", "intern-002"],
    priority: "High",
    status: "In Progress",
    progress: 78,
    deadline: "2026-09-30",
    createdBy: "program-manager",
    createdAt: "2026-08-01",
  },
  {
    id: "project-002",
    name: "Internship Portal",
    description:
      "Develop the MSN Academy internship management portal.",
    cohortId: "cohort-001",
    cohortName: "MERN Cohort A",
    mentorId: "mentor-001",
    mentorName: "Ali Ahmed",
    internIds: ["intern-001", "intern-003"],
    priority: "High",
    status: "In Progress",
    progress: 64,
    deadline: "2026-10-05",
    createdBy: "program-manager",
    createdAt: "2026-08-05",
  },
  {
    id: "project-003",
    name: "Portfolio Website",
    description:
      "Create professional portfolio websites for interns.",
    cohortId: "cohort-002",
    cohortName: "Web Development Cohort B",
    mentorId: "mentor-002",
    mentorName: "Sara Khan",
    internIds: ["intern-004", "intern-005"],
    priority: "Medium",
    status: "In Progress",
    progress: 52,
    deadline: "2026-09-25",
    createdBy: "program-manager",
    createdAt: "2026-08-12",
  },
  {
    id: "project-004",
    name: "Software Testing Lab",
    description:
      "Practical software quality assurance and testing project.",
    cohortId: "cohort-003",
    cohortName: "Software Engineering Cohort C",
    mentorId: "mentor-003",
    mentorName: "Usman Malik",
    internIds: ["intern-006", "intern-007"],
    priority: "Medium",
    status: "Planning",
    progress: 25,
    deadline: "2026-10-20",
    createdBy: "program-manager",
    createdAt: "2026-08-20",
  },
];

const defaultNotifications = [
  {
    id: "notification-001",
    type: "cohort",
    title: "New cohort created",
    message:
      "MERN Cohort A has been created successfully.",
    time: "2 hours ago",
    read: false,
    targetRoles: ["admin", "mentor", "intern"],
  },
  {
    id: "notification-002",
    type: "mentor",
    title: "Mentor assigned",
    message:
      "Ali Ahmed has been assigned as mentor to MERN Cohort A.",
    time: "4 hours ago",
    read: false,
    targetRoles: ["admin", "mentor"],
  },
  {
    id: "notification-003",
    type: "intern",
    title: "Intern added",
    message:
      "New interns have been added to Web Development Cohort B.",
    time: "6 hours ago",
    read: false,
    targetRoles: ["admin", "mentor", "intern"],
  },
  {
    id: "notification-004",
    type: "project",
    title: "Project updated",
    message:
      "Internship Portal project details were updated.",
    time: "8 hours ago",
    read: false,
    targetRoles: ["admin", "mentor", "intern"],
  },
  {
    id: "notification-005",
    type: "report",
    title: "Report generated",
    message:
      "Monthly program performance report has been generated.",
    time: "1 day ago",
    read: true,
    targetRoles: ["admin", "program-manager"],
  },
];

const defaultInterns = [
  {
    id: "intern-001",
    name: "Ayesha Ali",
    email: "ayesha@msnacademy.com",
    cohortId: "cohort-001",
    status: "Active",
  },
  {
    id: "intern-002",
    name: "Hassan Raza",
    email: "hassan@msnacademy.com",
    cohortId: "cohort-001",
    status: "Active",
  },
  {
    id: "intern-003",
    name: "Fatima Noor",
    email: "fatima@msnacademy.com",
    cohortId: "cohort-001",
    status: "Active",
  },
];

const defaultMentors = [
  {
    id: "mentor-001",
    name: "Ali Ahmed",
    email: "ali@msnacademy.com",
    specialization: "Full Stack Development",
    status: "Active",
  },
  {
    id: "mentor-002",
    name: "Sara Khan",
    email: "sara@msnacademy.com",
    specialization: "Web Development",
    status: "Active",
  },
  {
    id: "mentor-003",
    name: "Usman Malik",
    email: "usman@msnacademy.com",
    specialization: "Software Engineering",
    status: "Active",
  },
];

function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);

    if (!stored) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }

    return JSON.parse(stored);
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));

  window.dispatchEvent(
    new CustomEvent("msnAcademyDataUpdated", {
      detail: {
        key,
        value,
      },
    })
  );
}

export function getCohorts() {
  return readStorage(
    STORAGE_KEYS.cohorts,
    defaultCohorts
  );
}

export function saveCohorts(cohorts) {
  writeStorage(STORAGE_KEYS.cohorts, cohorts);
}

export function getProjects() {
  return readStorage(
    STORAGE_KEYS.projects,
    defaultProjects
  );
}

export function saveProjects(projects) {
  writeStorage(STORAGE_KEYS.projects, projects);
}

export function getNotifications() {
  return readStorage(
    STORAGE_KEYS.notifications,
    defaultNotifications
  );
}

export function saveNotifications(notifications) {
  writeStorage(
    STORAGE_KEYS.notifications,
    notifications
  );
}

export function getInterns() {
  return readStorage(
    STORAGE_KEYS.interns,
    defaultInterns
  );
}

export function getMentors() {
  return readStorage(
    STORAGE_KEYS.mentors,
    defaultMentors
  );
}

export function createNotification({
  type,
  title,
  message,
  targetRoles = ["admin", "mentor", "intern"],
}) {
  const notifications = getNotifications();

  const notification = {
    id: `notification-${Date.now()}`,
    type,
    title,
    message,
    time: "Just now",
    read: false,
    targetRoles,
  };

  saveNotifications([
    notification,
    ...notifications,
  ]);

  return notification;
}

export function resetProgramManagerData() {
  saveCohorts(defaultCohorts);
  saveProjects(defaultProjects);
  saveNotifications(defaultNotifications);
}