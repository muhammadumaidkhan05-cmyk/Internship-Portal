import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Users,
  Gauge,
  CalendarClock,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  FileText,
  CheckCircle2,
} from "lucide-react";

import { getMentorDashboard } from "../../services/mentorApi";

function MentorDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      else setRefreshing(true);

      setError("");

      const response = await getMentorDashboard();
      setData(response.data?.data || null);
    } catch (err) {
      console.error("Mentor dashboard error:", err);
      setError(
        "Dashboard data could not be loaded. Please make sure the backend server is running and you're logged in as a mentor."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();

    const timer = setInterval(() => fetchDashboard(false), 15000);
    return () => clearInterval(timer);
  }, []);

  const stats = data?.stats || {
    pendingReviews: 0,
    internsAssigned: 0,
    avgScore: 0,
    evaluationsDue: 0,
  };

  const pendingSubmissions = data?.pendingSubmissions || [];
  const upcomingEvaluations = data?.upcomingEvaluations || [];

  const formatDate = (date) => {
    if (!date) return "No date";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "No date";
    return parsed.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#F3F6FB] p-5 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[1500px] animate-pulse">
          <div className="h-8 w-72 rounded bg-slate-200" />
          <div className="mt-3 h-4 w-96 max-w-full rounded bg-slate-200" />

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 rounded-2xl bg-white" />
            ))}
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <div className="h-72 rounded-2xl bg-white" />
            <div className="h-72 rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F3F6FB]">
      <div className="mx-auto max-w-[1500px] p-5 sm:p-6 lg:p-8">
        {/* HEADER */}

        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#2563EB]">
                Mentorship
              </p>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-[#172033] sm:text-3xl">
              Mentor Dashboard
            </h1>

            <p className="mt-1 text-sm text-[#64748B]">
              Manage your interns, submissions, evaluations and
              mentorship activities.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchDashboard(false)}
            disabled={refreshing}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#172033] shadow-sm transition hover:border-[#2563EB] hover:text-[#2563EB] disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Refreshing" : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* STAT CARDS */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Pending Reviews"
            value={stats.pendingReviews}
            sub="submissions waiting"
            icon={ClipboardList}
            iconClass="bg-red-50 text-[#DC2626]"
            onClick={() => navigate("/mentor/submission-review")}
          />

          <StatCard
            title="Interns Assigned"
            value={stats.internsAssigned}
            sub="under your mentorship"
            icon={Users}
            iconClass="bg-blue-50 text-[#2563EB]"
          />

          <StatCard
            title="Avg Score"
            value={stats.avgScore}
            sub="across evaluations"
            icon={Gauge}
            iconClass="bg-cyan-50 text-[#0891B2]"
          />

          <StatCard
            title="Evaluations Due"
            value={stats.evaluationsDue}
            sub="upcoming milestones"
            icon={CalendarClock}
            iconClass="bg-amber-50 text-[#F59E0B]"
            onClick={() => navigate("/mentor/performance-evaluation")}
          />
        </section>

        {/* PENDING SUBMISSIONS + UPCOMING EVALUATIONS */}

        <section className="mt-5 grid gap-5 xl:grid-cols-2">
          <DashboardPanel
            title="Pending Submissions"
            subtitle="Awaiting your review"
            action={
              <ViewButton
                onClick={() => navigate("/mentor/submission-review")}
              />
            }
          >
            {pendingSubmissions.length === 0 ? (
              <EmptyState
                icon={FileText}
                text="No pending submissions"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                      <th className="pb-2.5">Intern</th>
                      <th className="pb-2.5">Task</th>
                      <th className="pb-2.5">Submitted</th>
                      <th className="pb-2.5">Status</th>
                      <th className="pb-2.5 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pendingSubmissions.map((submission) => (
                      <tr
                        key={submission._id}
                        className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-slate-50"
                      >
                        <td className="py-3 font-semibold text-[#172033]">
                          {submission.internName}
                        </td>
                        <td className="py-3 text-[#334155]">
                          {submission.taskTitle}
                        </td>
                        <td className="py-3 text-[#64748B]">
                          {formatDate(submission.submittedAt)}
                        </td>
                        <td className="py-3">
                          <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
                            Pending
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/mentor/submission-review/${submission._id}`
                              )
                            }
                            className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8]"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DashboardPanel>

          <DashboardPanel
            title="Upcoming Evaluations"
            subtitle="Milestones coming due"
            action={
              <ViewButton
                onClick={() =>
                  navigate("/mentor/performance-evaluation")
                }
              />
            }
          >
            {upcomingEvaluations.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                text="No upcoming evaluations"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                      <th className="pb-2.5">Intern</th>
                      <th className="pb-2.5">Milestone</th>
                      <th className="pb-2.5">Due</th>
                      <th className="pb-2.5">Status</th>
                      <th className="pb-2.5 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {upcomingEvaluations.map((item) => (
                      <tr
                        key={item.internId}
                        className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-slate-50"
                      >
                        <td className="py-3 font-semibold text-[#172033]">
                          {item.internName}
                        </td>
                        <td className="py-3 text-[#334155]">
                          {item.milestone}
                        </td>
                        <td className="py-3 text-[#64748B]">
                          {formatDate(item.dueDate)}
                        </td>
                        <td className="py-3">
                          <span
                            className={`rounded-full border px-2 py-1 text-[10px] font-bold ${
                              item.status === "Due Soon"
                                ? "border-red-200 bg-red-50 text-red-700"
                                : "border-cyan-200 bg-cyan-50 text-cyan-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/mentor/performance-evaluation/${item.internId}`
                              )
                            }
                            className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8]"
                          >
                            Evaluate
                            <ArrowRight
                              size={12}
                              className="ml-1 inline"
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DashboardPanel>
        </section>
      </div>
    </div>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({ title, value, sub, icon: Icon, iconClass, onClick }) {
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white text-left shadow-[0_6px_22px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)] ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#DC2626]" />

      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
            {title}
          </p>

          <p className="mt-1 text-2xl font-black tracking-tight text-[#172033]">
            {value}
          </p>

          <p className="mt-0.5 text-[10px] text-[#64748B]">{sub}</p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass} transition-transform duration-300 group-hover:scale-105`}
        >
          <Icon size={18} />
        </div>
      </div>
    </Wrapper>
  );
}

// ============================================================
// DASHBOARD PANEL
// ============================================================

function DashboardPanel({ title, subtitle, action, children }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.045)]">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#DC2626]" />

      <div className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] px-5 py-4">
        <div className="min-w-0">
          <h2 className="text-sm font-black text-[#172033] sm:text-[15px]">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-0.5 text-[11px] text-[#94A3B8]">{subtitle}</p>
          )}
        </div>

        {action}
      </div>

      <div className="p-5">{children}</div>
    </section>
  );
}

function ViewButton({ text = "View all", onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-[#2563EB] transition hover:text-[#1D4ED8]"
    >
      {text}
      <ArrowRight size={13} />
    </button>
  );
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="flex min-h-[150px] flex-col items-center justify-center text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-300">
        <Icon size={23} />
      </div>

      <p className="mt-2 text-xs font-semibold text-[#94A3B8]">{text}</p>
    </div>
  );
}

export default MentorDashboard;
