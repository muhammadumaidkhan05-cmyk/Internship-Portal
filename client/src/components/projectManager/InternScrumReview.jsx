import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, MessageSquare, RefreshCcw } from "lucide-react";

import {
  getInternScrums,
  reviewInternScrum,
} from "../../services/projectManagerWorkflowApi";

// ============================================================
// INTERN DAILY SCRUM REVIEW  (page 14)
//
// Every scrum an intern submits arrives here as Pending. The
// decision recorded below is stored on the scrum and sent back
// to the intern as a notification.
// ============================================================

const REVIEW_STYLES = {
  Pending: { bg: "#FFFBEB", color: "#B45309" },
  Reviewed: { bg: "#ECFDF5", color: "#047857" },
  "Needs Attention": { bg: "#FEF2F2", color: "#DC2626" },
};

const FILTERS = [
  { value: "Pending", label: "Pending" },
  { value: "Reviewed", label: "Reviewed" },
  { value: "Needs Attention", label: "Needs Attention" },
  { value: "", label: "All" },
];

function InternScrumReview() {
  const [scrums, setScrums] = useState([]);
  const [summary, setSummary] = useState({
    pending: 0,
    reviewed: 0,
    needsAttention: 0,
  });

  const [filter, setFilter] = useState("Pending");
  const [remarks, setRemarks] = useState({});

  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getInternScrums(filter ? { status: filter } : {});

      setScrums(data.scrums);
      setSummary(data.summary);
    } catch (err) {
      setError(err.message || "Failed to load daily scrums.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleReview = async (id, reviewStatus) => {
    setError("");
    setSuccess("");

    if (reviewStatus === "Needs Attention" && !(remarks[id] || "").trim()) {
      setError(
        "Add a remark explaining what needs attention before flagging a scrum."
      );
      return;
    }

    try {
      setSavingId(id);

      await reviewInternScrum(id, {
        reviewStatus,
        managerRemarks: (remarks[id] || "").trim(),
      });

      setSuccess(
        reviewStatus === "Reviewed"
          ? "Scrum reviewed. The intern has been notified."
          : "Scrum flagged. The intern has been notified."
      );

      setRemarks((previous) => ({ ...previous, [id]: "" }));

      await load();
    } catch (err) {
      setError(err.message || "Failed to record the review.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <section className="mb-8">
      <div className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
        <div className="absolute inset-x-0 top-0 h-1 gradient-stroke" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-[#2563EB]" />
              <h2 className="text-lg font-bold text-[#172033]">
                Intern Daily Scrums
              </h2>
            </div>

            <p className="mt-1 text-sm text-[#64748B]">
              Daily updates submitted by your interns, awaiting your review.
            </p>
          </div>

          <button
            type="button"
            onClick={load}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#172033] transition hover:border-[#2563EB] hover:text-[#2563EB]"
          >
            <RefreshCcw size={15} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#DC2626]">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-[#047857]">
            {success}
          </div>
        )}

        {/* Summary */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat label="Pending" value={summary.pending} color="#B45309" />
          <Stat label="Reviewed" value={summary.reviewed} color="#047857" />
          <Stat
            label="Needs attention"
            value={summary.needsAttention}
            color="#DC2626"
          />
        </div>

        {/* Filters */}
        <div className="mt-5 flex flex-wrap gap-2">
          {FILTERS.map((option) => (
            <button
              key={option.label}
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

        {/* List */}
        <div className="mt-6">
          {loading ? (
            <p className="text-sm text-[#64748B]">Loading daily scrums...</p>
          ) : scrums.length === 0 ? (
            <p className="rounded-xl bg-[#F3F6FB] px-4 py-6 text-center text-sm text-[#64748B]">
              Nothing to review in this category.
            </p>
          ) : (
            <ul className="space-y-4">
              {scrums.map((scrum) => {
                const style =
                  REVIEW_STYLES[scrum.reviewStatus] || REVIEW_STYLES.Pending;

                const internName =
                  scrum.userId?.name || scrum.internName || "Intern";

                return (
                  <li
                    key={scrum._id}
                    className="rounded-xl border border-[#E2E8F0] bg-white p-4 md:p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#172033]">
                          {internName}
                        </p>

                        <p className="mt-0.5 text-xs text-[#64748B]">
                          {scrum.teamName || "No team"} ·{" "}
                          {new Date(scrum.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <span
                        className="rounded-lg px-3 py-1.5 text-xs font-bold"
                        style={{ background: style.bg, color: style.color }}
                      >
                        {scrum.reviewStatus}
                      </span>
                    </div>

                    <dl className="mt-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
                      <Cell label="Yesterday" value={scrum.yesterday} />
                      <Cell label="Today" value={scrum.today} />
                      <Cell
                        label="Blockers"
                        value={scrum.blockers || "None reported"}
                        highlight={Boolean(scrum.blockers)}
                      />
                    </dl>

                    {scrum.reviewStatus === "Pending" ? (
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <input
                          type="text"
                          value={remarks[scrum._id] || ""}
                          onChange={(event) =>
                            setRemarks((previous) => ({
                              ...previous,
                              [scrum._id]: event.target.value,
                            }))
                          }
                          placeholder="Remarks for the intern (required when flagging)"
                          className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB]"
                        />

                        <button
                          type="button"
                          disabled={savingId === scrum._id}
                          onClick={() => handleReview(scrum._id, "Reviewed")}
                          className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#047857] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
                        >
                          <CheckCircle2 size={15} />
                          Mark reviewed
                        </button>

                        <button
                          type="button"
                          disabled={savingId === scrum._id}
                          onClick={() =>
                            handleReview(scrum._id, "Needs Attention")
                          }
                          className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#DC2626] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
                        >
                          <AlertTriangle size={15} />
                          Flag
                        </button>
                      </div>
                    ) : (
                      scrum.managerRemarks && (
                        <div
                          className="mt-4 rounded-xl px-4 py-3"
                          style={{ background: style.bg }}
                        >
                          <p
                            className="text-xs font-bold"
                            style={{ color: style.color }}
                          >
                            Your remarks
                          </p>

                          <p className="mt-1 text-sm text-[#172033]">
                            {scrum.managerRemarks}
                          </p>
                        </div>
                      )
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function Cell({ label, value, highlight }) {
  return (
    <div className="rounded-xl bg-[#F3F6FB] px-3 py-2.5">
      <dt className="text-xs font-semibold text-[#64748B]">{label}</dt>

      <dd
        className="mt-1 text-sm leading-6"
        style={{ color: highlight ? "#DC2626" : "#172033" }}
      >
        {value}
      </dd>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-[#F3F6FB] px-4 py-3">
      <p className="text-xs text-[#64748B]">{label}</p>

      <p className="mt-1 text-xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

export default InternScrumReview;
