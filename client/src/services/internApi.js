import { http, unwrap } from "./http";

// ============================================================
// INTERN MODULE API  (pages 4 - 10)
// Every call is scoped server-side to the signed-in intern.
// ============================================================

const BASE = "/intern";

// Dashboard (page 4)
export const getInternDashboard = async () =>
  unwrap(await http.get(`${BASE}/dashboard`));

// Daily Scrum (page 5)
export const getDailyScrums = async () =>
  unwrap(await http.get(`${BASE}/daily-scrums`), []);

export const submitDailyScrum = async (values) =>
  unwrap(await http.post(`${BASE}/daily-scrums`, values));

export const deleteDailyScrum = async (id) =>
  http.delete(`${BASE}/daily-scrums/${id}`);

// Attendance (page 6)
export const getAttendance = async () =>
  unwrap(await http.get(`${BASE}/attendance`), []);

export const markAttendance = async (values) =>
  unwrap(await http.post(`${BASE}/attendance`, values));

export const updateAttendance = async (id, values) =>
  unwrap(await http.put(`${BASE}/attendance/${id}`, values));

// My Projects (page 7)
export const getMyProjects = async () =>
  unwrap(await http.get(`${BASE}/projects`), []);

// Tasks & task submission (page 8)
export const getMyTasks = async (status) =>
  unwrap(
    await http.get(
      status ? `${BASE}/tasks?status=${encodeURIComponent(status)}` : `${BASE}/tasks`
    ),
    []
  );

export const getTaskById = async (taskId) =>
  unwrap(await http.get(`${BASE}/tasks/${taskId}`));

export const startTask = async (taskId) =>
  unwrap(await http.patch(`${BASE}/tasks/${taskId}/start`));

export const submitTask = async (taskId, values) =>
  unwrap(await http.post(`${BASE}/tasks/${taskId}/submit`, values));

// Submission status (page 9)
export const getMySubmissions = async () => {
  const payload = await http.get(`${BASE}/submissions`);

  return {
    submissions: payload.data || [],
    summary: payload.summary || { pending: 0, approved: 0, resubmit: 0 },
  };
};

export const getSubmissionById = async (id) =>
  unwrap(await http.get(`${BASE}/submissions/${id}`));

// Certificates (page 10)
export const getMyCertificates = async () =>
  unwrap(await http.get(`${BASE}/certificates`), []);

// Evaluations (read-only)
export const getMyEvaluations = async () =>
  unwrap(await http.get(`${BASE}/evaluations`), []);

// Notifications
export const getNotifications = async () => {
  const payload = await http.get(`${BASE}/notifications`);

  return {
    notifications: payload.data || [],
    unreadCount: payload.unreadCount || 0,
  };
};

export const markNotificationRead = async (id) =>
  unwrap(await http.patch(`${BASE}/notifications/${id}/read`));

export const markAllNotificationsRead = async () =>
  unwrap(await http.patch(`${BASE}/notifications/read-all`), []);

export const deleteNotification = async (id) =>
  http.delete(`${BASE}/notifications/${id}`);

// Profile
export const getInternProfile = async () =>
  unwrap(await http.get(`${BASE}/profile`));

export const updateInternProfile = async (values) =>
  unwrap(await http.put(`${BASE}/profile`, values));
