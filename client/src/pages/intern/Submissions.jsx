import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock3,
  ExternalLink,
  Code2,
  RefreshCcw,
  Upload,
  XCircle,
} from "lucide-react";

import { getMySubmissions } from "../../services/internApi";

// ============================================================
// SUBMISSION STATUS  (page 9)
//
// Read-only view of every submission and the mentor's decision.
// Pending -> Approved | Resubmit. When the mentor asks for a
// resubmission the feedback is shown here with a direct link
// back to the task so the intern can submit again.
// ============================================================

const STATUS_META = {
  pending: {
    label: "Pending",
    description: "Waiting for your mentor to review.",
    bg: "#FFFBEB",
    color: "#B45309",
    Icon: Clock3,
  },
  approved: {
    label: "Approved",
    description: "Your mentor approved this submission.",
    bg: "#ECFDF5",
    color: "#047857",
    Icon: CheckCircle2,
  },
  resubmission_required: {
    label: "Resubmit",
    description: "Your mentor asked for changes.",
    bg: "#FEF2F2",
    color: "#DC2626",
    Icon: XCircle,
  },
};

const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "resubmission_required", label: "Resubmit" },
];

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [summary, setSummary] = useState({
    pending: 0,
    approved: 0,
    resubmit: 0,
  });

  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMySubmissions();

      setSubmissions(data.submissions);
      setSummary(data.summary);
    } catch (err) {
      setError(err.message || "Failed to load your submissions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible =
    filter === "all"
      ? submissions
      : submissions.filter((submission) => submission.status === filter);

  return (
    <div>
      {/* ===============================
          HEADER
      =============================== */}

      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
            Internship Portal
          </p>

          <h1 className="mt-1 text-2xl font-bold text-[#172033] md:text-3xl">
            Submission Status
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            Track every task you have submitted and your mentor's decision.
          </p>
        </div>

        <button
          type="button"
          onClick={load}
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#172033] transition hover:border-[#2563EB] hover:text-[#2563EB]"
        >
          <RefreshCcw size={15} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#DC2626]">
          {error}
        </div>
      )}

      {/* ===============================
          SUMMARY
      =============================== */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Pending"
          value={summary.pending}
          description="Awaiting mentor review"
          color="#B45309"
        />
        <StatCard
          title="Approved"
          value={summary.approved}
          description="Accepted by your mentor"
          color="#047857"
        />
        <StatCard
          title="Resubmit"
          value={summary.resubmit}
          description="Changes requested"
          color="#DC2626"
        />
      </div>

      {/* ===============================
          FILTERS
      =============================== */}

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
              filter === option.value
                ? "border-[#2563EB] bg-[#2563EB] text-white"
                : "border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* ===============================
          LIST
      =============================== */}

      {loading ? (
        <p className="text-sm text-[#64748B]">Loading submissions...</p>
      ) : visible.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
          <div className="absolute inset-x-0 top-0 h-1 gradient-stroke" />

          <Upload size={26} className="mx-auto text-[#64748B]" />

          <h2 className="mt-4 font-bold text-[#172033]">
            {filter === "all"
              ? "No submissions yet"
              : "Nothing in this category"}
          </h2>

          <p className="mt-2 text-sm text-[#64748B]">
            {filter === "all"
              ? "Open a task from My Projects and submit it to start the review workflow."
              : "Try a different filter."}
          </p>

          {filter === "all" && (
            <Link
              to="/intern/projects"
              className="mt-5 inline-block rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Go to My Projects
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((submission) => {
            const meta = STATUS_META[submission.status] || STATUS_META.pending;
            const StatusIcon = meta.Icon;

            return (
              <div
                key={submission._id}
                className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md md:p-6"
              >
                <div className="absolute inset-x-0 top-0 h-1 gradient-stroke" />

                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-[#172033]">
                      {submission.taskTitle}
                    </h2>

                    <p className="mt-1 text-xs text-[#64748B]">
                      Attempt {submission.attempt || 1} · Submitted{" "}
                      {formatDate(submission.submittedAt)}
                      {submission.programName
                        ? ` · ${submission.programName}`
                        : ""}
                    </p>

                    <p className="mt-3 max-w-3xl text-sm leading-6 text-[#64748B]">
                      {submission.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      {submission.githubUrl && (
                        <a
                          href={submission.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-sm font-medium text-[#2563EB] transition hover:underline"
                        >
                          <Code2 size={15} />
                          Repository
                        </a>
                      )}

                      {submission.liveUrl && (
                        <a
                          href={submission.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-sm font-medium text-[#2563EB] transition hover:underline"
                        >
                          <ExternalLink size={15} />
                          Live preview
                        </a>
                      )}

                      {submission.taskId && (
                        <Link
                          to={`/intern/tasks/${submission.taskId}`}
                          className="flex items-center gap-1.5 text-sm font-medium text-[#0891B2] transition hover:underline"
                        >
                          Open task
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold"
                      style={{ background: meta.bg, color: meta.color }}
                    >
                      <StatusIcon size={14} />
                      {meta.label}
                    </span>

                    {submission.score !== null &&
                      submission.score !== undefined && (
                        <p className="mt-2 text-sm font-bold text-[#047857]">
                          {submission.score}/100
                        </p>
                      )}
                  </div>
                </div>

                {submission.feedback && (
                  <div
                    className="mt-5 rounded-xl px-4 py-3"
                    style={{ background: meta.bg }}
                  >
                    <p className="text-xs font-bold" style={{ color: meta.color }}>
                      Mentor feedback
                    </p>

                    <p className="mt-1.5 text-sm leading-6 text-[#172033]">
                      {submission.feedback}
                    </p>

                    {submission.status === "resubmission_required" &&
                      submission.taskId && (
                        <Link
                          to={`/intern/tasks/${submission.taskId}`}
                          className="mt-3 inline-block rounded-lg bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110"
                        >
                          Update and resubmit
                        </Link>
                      )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
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

      <p className="text-sm text-[#64748B]">{title}</p>

      <h2 className="mt-2 text-3xl font-bold" style={{ color }}>
        {value}
      </h2>

      <p className="mt-2 text-xs text-[#64748B]">{description}</p>
    </div>
  );
}

export default Submissions;
