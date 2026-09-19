import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarClock,
  FolderKanban,
  Users,
  UserCheck,
  ArrowRight,
} from "lucide-react";

import { getMyProjects } from "../../services/internApi";

// ============================================================
// MY PROJECTS  (page 7)
// Shows the project, team, mentor, team members and the tasks
// assigned to this intern. Each task links to the Task Details
// & Submission page (page 8).
// ============================================================

const TASK_STATUS_COLORS = {
  Assigned: "#2563EB",
  "In Progress": "#0891B2",
  Submitted: "#B45309",
  Approved: "#047857",
  Resubmit: "#DC2626",
};

function formatDate(value) {
  if (!value) return "Not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not set";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setNotice("");

      const data = await getMyProjects();

      setProjects(data);

      if (data.length === 0) {
        setNotice(
          "You have not been assigned to a project yet. Your Project Manager will assign one."
        );
      }
    } catch (err) {
      setError(err.message || "Failed to load your project.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
          Internship Portal
        </p>

        <h1 className="mt-1 text-2xl font-bold text-[#172033] md:text-3xl">
          My Projects
        </h1>

        <p className="mt-1 text-sm text-[#64748B]">
          Your assigned project, team and the tasks you need to complete.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#DC2626]">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-[#64748B]">Loading project...</p>
      ) : notice ? (
        <div className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
          <div className="absolute inset-x-0 top-0 h-1 gradient-stroke" />

          <FolderKanban size={26} className="mx-auto text-[#64748B]" />

          <h2 className="mt-4 font-bold text-[#172033]">No project yet</h2>

          <p className="mt-2 text-sm text-[#64748B]">{notice}</p>
        </div>
      ) : (
        projects.map((project) => (
          <div key={project._id} className="space-y-5">
            {/* Project overview */}
            <div className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md md:p-7">
              <div className="absolute inset-x-0 top-0 h-1 gradient-stroke" />

              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-[#172033] md:text-2xl">
                    {project.title}
                  </h2>

                  {project.description && (
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-[#64748B]">
                      {project.description}
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm">
                    <Meta
                      Icon={Users}
                      label="Team"
                      value={project.team?.name || "Not assigned"}
                    />
                    <Meta
                      Icon={UserCheck}
                      label="Mentor"
                      value={project.mentor?.name || "Not assigned"}
                    />
                    <Meta
                      Icon={CalendarClock}
                      label="Deadline"
                      value={formatDate(project.deadline)}
                    />
                  </div>
                </div>

                <div className="min-w-[180px] shrink-0 rounded-xl border border-[#E2E8F0] bg-[#F3F6FB] p-4">
                  <p className="text-xs font-medium text-[#64748B]">
                    My task progress
                  </p>

                  <p className="mt-2 text-2xl font-bold text-[#2563EB]">
                    {project.progress}%
                  </p>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full gradient-progress transition-all duration-700"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>

                  <p className="mt-3 text-xs text-[#64748B]">
                    {project.taskSummary.approved} of {project.taskSummary.total}{" "}
                    approved
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              {/* Tasks */}
              <div className="lg:col-span-2">
                <div className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md md:p-6">
                  <div className="absolute inset-x-0 top-0 h-1 gradient-stroke" />

                  <h3 className="text-lg font-bold text-[#172033]">
                    My Tasks on This Project
                  </h3>

                  {project.tasks.length === 0 ? (
                    <p className="mt-4 text-sm text-[#64748B]">
                      No tasks have been assigned to you on this project yet.
                    </p>
                  ) : (
                    <ul className="mt-5 space-y-3">
                      {project.tasks.map((task) => (
                        <li key={task._id}>
                          <Link
                            to={`/intern/tasks/${task._id}`}
                            className="flex items-center justify-between gap-4 rounded-xl border border-transparent bg-[#F3F6FB] px-4 py-3.5 transition-all duration-300 hover:border-[#22D3EE]"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[#172033]">
                                {task.title}
                              </p>

                              <p className="mt-1 text-xs text-[#64748B]">
                                Due {formatDate(task.deadline)} · {task.priority}{" "}
                                priority
                              </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-3">
                              <span
                                className="text-xs font-bold"
                                style={{
                                  color:
                                    TASK_STATUS_COLORS[task.status] || "#64748B",
                                }}
                              >
                                {task.status}
                              </span>

                              <ArrowRight size={16} className="text-[#2563EB]" />
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Team members */}
              <div>
                <div className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md md:p-6">
                  <div className="absolute inset-x-0 top-0 h-1 gradient-stroke" />

                  <h3 className="text-lg font-bold text-[#172033]">
                    Team Members
                  </h3>

                  {project.members.length === 0 ? (
                    <p className="mt-4 text-sm text-[#64748B]">
                      No other members on this project yet.
                    </p>
                  ) : (
                    <ul className="mt-5 space-y-3">
                      {project.members.map((member) => (
                        <li
                          key={member._id}
                          className="flex items-center gap-3 rounded-xl bg-[#F3F6FB] px-3 py-2.5"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#22D3EE] text-sm font-bold text-white">
                            {member.name?.charAt(0).toUpperCase()}
                          </span>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#172033]">
                              {member.name}
                            </p>

                            <p className="truncate text-xs text-[#64748B]">
                              {member.email}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function Meta({ Icon, label, value }) {
  return (
    <span className="flex items-center gap-2">
      <Icon size={15} className="text-[#0891B2]" />
      <span className="text-[#64748B]">{label}:</span>
      <span className="font-semibold text-[#172033]">{value}</span>
    </span>
  );
}

export default MyProjects;
