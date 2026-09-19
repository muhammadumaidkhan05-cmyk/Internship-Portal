import { http, unwrap } from "./http";

// ============================================================
// PROJECT MANAGER WORKFLOW API  (pages 12 - 14)
// Intern roster, task assignment and daily scrum review - the
// endpoints that feed the Intern and Mentor modules.
// ============================================================

const BASE = "/project-manager/workflow";

// Intern roster & assignment (page 12)
export const getInterns = async (params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
  ).toString();

  return unwrap(
    await http.get(query ? `${BASE}/interns?${query}` : `${BASE}/interns`),
    []
  );
};

export const assignIntern = async (internId, assignment) =>
  unwrap(await http.patch(`${BASE}/interns/${internId}/assignment`, assignment));

// Task assignment (page 13)
export const getAssignedTasks = async (params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
  ).toString();

  const payload = await http.get(
    query ? `${BASE}/tasks?${query}` : `${BASE}/tasks`
  );

  return {
    tasks: payload.data || [],
    summary: payload.summary || {},
  };
};

export const createTask = async (values) =>
  unwrap(await http.post(`${BASE}/tasks`, values));

export const updateTask = async (id, values) =>
  unwrap(await http.put(`${BASE}/tasks/${id}`, values));

export const deleteTask = async (id) => http.delete(`${BASE}/tasks/${id}`);

// Daily scrum review (page 14)
export const getInternScrums = async (params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
  ).toString();

  const payload = await http.get(
    query ? `${BASE}/intern-scrums?${query}` : `${BASE}/intern-scrums`
  );

  return {
    scrums: payload.data || [],
    summary: payload.summary || { pending: 0, reviewed: 0, needsAttention: 0 },
  };
};

export const reviewInternScrum = async (id, values) =>
  unwrap(await http.patch(`${BASE}/intern-scrums/${id}/review`, values));
