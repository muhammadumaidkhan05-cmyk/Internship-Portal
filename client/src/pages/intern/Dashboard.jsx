import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getInternDashboard } from "../../services/internApi";

// ============================================================
// INTERN DASHBOARD  (page 4)
// Design preserved from the intern branch; every figure now
// comes from the unified /api/intern/dashboard endpoint, which
// aggregates assignment, tasks, scrums, attendance, submissions,
// evaluations and certificates in one call.
// ============================================================

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      setData(await getInternDashboard());
    } catch (err) {
      setError(err.message || "Failed to load your dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <p className="text-sm text-[#64748B]">Loading dashboard...</p>;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#DC2626]">
        {error}
      </div>
    );
  }

  const { intern, assignment, stats, tasks, notifications } = data;

  const projectProgress =
    stats.totalTasks > 0
      ? Math.round((stats.approvedTasks / stats.totalTasks) * 100)
      : 0;

  return (
    <div>
      {/* ===============================
          HEADER
      =============================== */}

      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
          Internship Dashboard
        </p>

        <h1 className="mt-1 text-2xl font-bold text-[#172033] md:text-3xl">
          Welcome back{intern?.name ? `, ${intern.name.split(" ")[0]}` : ""}!
        </h1>

        <p className="mt-1 text-sm text-[#64748B]">
          Here is an overview of your internship progress.
        </p>
      </div>

      {/* ===============================
          ASSIGNMENT
      =============================== */}

      <div className="group relative mb-6 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md md:p-7">
        <div className="absolute inset-x-0 top-0 h-1 gradient-stroke" />

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#DC2626]">
              Internship Program
            </p>

            <h2 className="mt-2 text-xl font-bold text-[#172033] md:text-2xl">
              {assignment.project?.name || "Awaiting project assignment"}
            </h2>

            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <span className="text-[#64748B]">
                Team:{" "}
                <span className="font-semibold text-[#172033]">
                  {assignment.team?.name || "Not assigned"}
                </span>
              </span>

              <span className="text-[#64748B]">
                Mentor:{" "}
                <span className="font-semibold text-[#172033]">
                  {assignment.mentor?.name || "Not assigned"}
                </span>
              </span>

              <span className="text-[#64748B]">
                Cohort:{" "}
                <span className="font-semibold text-[#172033]">
                  {intern?.cohort || "-"}
                </span>
              </span>
            </div>
          </div>

          <div className="min-w-[190px] shrink-0 rounded-xl border border-[#E2E8F0] bg-[#F3F6FB] p-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#0891B2]" />
              <span className="text-xs font-medium text-[#64748B]">
                Internship Status
              </span>
            </div>

            <p className="mt-2 text-lg font-bold text-[#172033]">
              {assignment.project?.status || "In Progress"}
            </p>
          </div>
        </div>
      </div>

      {/* ===============================
          STATS
      =============================== */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Attendance"
          value={`${stats.attendancePercentage}%`}
          description={`${stats.presentDays} days present`}
          color="#2563EB"
        />
        <StatCard
          title="Tasks"
          value={stats.totalTasks}
          description={`${stats.approvedTasks} approved`}
          color="#8B5CF6"
        />
        <StatCard
          title="Submissions"
          value={stats.totalSubmissions}
          description={`${stats.pendingSubmissions} pending review`}
          color="#F59E0B"
        />
        <StatCard
          title="Certificates"
          value={stats.certificates}
          description="Certificates earned"
          color="#0891B2"
        />
      </div>

      {/* ===============================
          OVERVIEW PANELS
      =============================== */}

      <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel title="Workflow Status">
          <SummaryRow label="Open tasks" value={stats.pendingTasks} />
          <SummaryRow label="Awaiting mentor review" value={stats.awaitingReview} />
          <SummaryRow
            label="Resubmission requested"
            value={stats.resubmitSubmissions}
            valueColor={stats.resubmitSubmissions > 0 ? "#DC2626" : "#172033"}
          />
          <SummaryRow label="Approved submissions" value={stats.approvedSubmissions} valueColor="#047857" />
          <SummaryRow
            label="Performance score"
            value={
              stats.averageEvaluation !== null
                ? `${stats.averageEvaluation}%`
                : "Not evaluated yet"
            }
          />
        </Panel>

        <Panel title="Daily Activity">
          <SummaryRow label="Present days" value={stats.presentDays} />
          <SummaryRow label="Absent days" value={stats.absentDays} />
          <SummaryRow label="Daily scrums submitted" value={stats.totalScrums} />
          <SummaryRow
            label="Scrums awaiting PM review"
            value={stats.pendingScrumReviews}
          />
          <SummaryRow
            label="Unread notifications"
            value={stats.unreadNotifications}
          />
        </Panel>
      </div>

      {/* ===============================
          PROGRESS
      =============================== */}

      <div className="group relative mb-5 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md md:p-6">
        <div className="absolute inset-x-0 top-0 h-1 gradient-stroke" />

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#172033]">Overall Progress</h2>
            <p className="mt-1 text-xs text-[#64748B]">
              Approved tasks against everything assigned to you
            </p>
          </div>

          <span className="text-xl font-bold text-[#2563EB]">
            {projectProgress}%
          </span>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#F3F6FB]">
          <div
            className="h-full rounded-full gradient-progress transition-all duration-700"
            style={{ width: `${projectProgress}%` }}
          />
        </div>
      </div>

      {/* ===============================
          RECENT TASKS + NOTIFICATIONS
      =============================== */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel title="Recent Tasks" action={{ to: "/intern/projects", label: "View all" }}>
          {tasks.length === 0 ? (
            <p className="text-sm text-[#64748B]">
              No tasks have been assigned to you yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {tasks.map((task) => (
                <li key={task._id}>
                  <Link
                    to={`/intern/tasks/${task._id}`}
                    className="flex items-center justify-between rounded-xl border border-transparent bg-[#F3F6FB] px-4 py-3 transition-all duration-300 hover:border-[#22D3EE]"
                  >
                    <span className="min-w-0 truncate text-sm font-medium text-[#172033]">
                      {task.title}
                    </span>

                    <span className="ml-3 shrink-0 text-xs font-semibold text-[#2563EB]">
                      {task.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Latest Notifications"
          action={{ to: "/intern/notifications", label: "View all" }}
        >
          {notifications.length === 0 ? (
            <p className="text-sm text-[#64748B]">Nothing new right now.</p>
          ) : (
            <ul className="space-y-3">
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  className="rounded-xl bg-[#F3F6FB] px-4 py-3"
                >
                  <p className="text-sm font-semibold text-[#172033]">
                    {notification.title}
                  </p>

                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#64748B]">
                    {notification.message}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, action, children }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md md:p-6">
      <div className="absolute inset-x-0 top-0 h-1 gradient-stroke" />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#172033]">{title}</h2>

        {action && (
          <Link
            to={action.to}
            className="text-xs font-semibold text-[#2563EB] transition hover:underline"
          >
            {action.label}
          </Link>
        )}
      </div>

      <div className="mt-5 space-y-4 text-sm">{children}</div>
    </div>
  );
}

function StatCard({ title, value, description, color }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div
        className="absolute inset-x-0 top-0 h-1 transition-all duration-300 group-hover:h-1.5"
        style={{ background: `linear-gradient(90deg, #2563EB, ${color}, #DC2626)` }}
      />

      <p className="relative text-sm text-[#64748B]">{title}</p>

      <h2 className="relative mt-2 text-3xl font-bold" style={{ color }}>
        {value}
      </h2>

      <p className="relative mt-2 text-xs text-[#64748B]">{description}</p>
    </div>
  );
}

function SummaryRow({ label, value, valueColor = "#172033" }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#64748B]">{label}</span>
      <span className="font-semibold" style={{ color: valueColor }}>
        {value}
      </span>
    </div>
  );
}

export default Dashboard;
