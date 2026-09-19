import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, ClipboardCheck, Clock3 } from "lucide-react";

import {
  getDailyScrums,
  submitDailyScrum,
} from "../../services/internApi";

// ============================================================
// DAILY SCRUM  (page 5)
// The submitted scrum is stored with a Pending review status and
// immediately appears in the Project Manager's Scrum Review page
// (page 14). The PM's decision comes back into the history below.
// ============================================================

const REVIEW_STYLES = {
  Pending: { bg: "#FFFBEB", color: "#B45309" },
  Reviewed: { bg: "#ECFDF5", color: "#047857" },
  "Needs Attention": { bg: "#FEF2F2", color: "#DC2626" },
};

function DailyScrum() {
  const [yesterday, setYesterday] = useState("");
  const [today, setToday] = useState("");
  const [blockers, setBlockers] = useState("");

  const [history, setHistory] = useState([]);
  const [submittedScrum, setSubmittedScrum] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setHistory(await getDailyScrums());
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Failed to load your scrum history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setIsError(false);

    if (!yesterday.trim() || !today.trim()) {
      setIsError(true);
      setMessage("Please complete the required fields before submitting.");
      return;
    }

    try {
      setSubmitting(true);

      const scrum = await submitDailyScrum({
        yesterday: yesterday.trim(),
        today: today.trim(),
        blockers: blockers.trim(),
      });

      setSubmittedScrum({
        ...scrum,
        submittedAt: new Date(scrum.createdAt).toLocaleString(),
      });

      setHistory((previous) => [scrum, ...previous]);

      setMessage(
        "Daily Scrum submitted. Your Project Manager has been notified."
      );

      setYesterday("");
      setToday("");
      setBlockers("");
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Failed to submit your Daily Scrum.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <p className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
          Internship Activity
        </p>

        <h1 className="text-2xl md:text-3xl font-bold text-[#172033] mt-1">
          Daily Scrum
        </h1>

        <p className="text-sm text-[#64748B] mt-1">
          Share your daily progress and keep your mentor updated.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="relative overflow-hidden bg-white border border-[#E2E8F0] rounded-2xl p-5 md:p-6 shadow-sm max-w-3xl hover:shadow-md transition"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#DC2626]" />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#EAF4FF] text-[#2563EB] flex items-center justify-center">
            <ClipboardCheck size={20} />
          </div>

          <div>
            <h2 className="font-bold text-[#172033]">
              Today's Update
            </h2>

            <p className="text-xs text-[#64748B]">
              Complete your daily scrum report
            </p>
          </div>
        </div>

        {/* Yesterday */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-[#172033] mb-2">
            What did you do yesterday?
          </label>

          <textarea
            rows="4"
            value={yesterday}
            onChange={(e) => setYesterday(e.target.value)}
            placeholder="Describe the work you completed yesterday..."
            className="w-full border border-[#E2E8F0] rounded-xl p-3 text-sm text-[#172033] outline-none focus:ring-2 focus:ring-[#2563EB]/15 focus:border-[#2563EB] resize-none"
          />
        </div>

        {/* Today */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-[#172033] mb-2">
            What will you do today?
          </label>

          <textarea
            rows="4"
            value={today}
            onChange={(e) => setToday(e.target.value)}
            placeholder="Describe what you plan to work on today..."
            className="w-full border border-[#E2E8F0] rounded-xl p-3 text-sm text-[#172033] outline-none focus:ring-2 focus:ring-[#2563EB]/15 focus:border-[#2563EB] resize-none"
          />
        </div>

        {/* Blockers */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#172033] mb-2">
            Any blockers?
          </label>

          <textarea
            rows="3"
            value={blockers}
            onChange={(e) => setBlockers(e.target.value)}
            placeholder="Mention any issue or blocker..."
            className="w-full border border-[#E2E8F0] rounded-xl p-3 text-sm text-[#172033] outline-none focus:ring-2 focus:ring-[#2563EB]/15 focus:border-[#2563EB] resize-none"
          />
        </div>

        {/* Message */}
        {message && (
          <div className="mb-4 flex items-center gap-2 bg-[#EAF4FF] text-[#2563EB] border border-blue-100 rounded-xl px-4 py-3 text-sm">
            <CheckCircle2 size={17} />
            {message}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-[#2563EB] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Scrum"}
        </button>
      </form>

      {/* Latest Submission */}
      {submittedScrum && (
        <div className="relative overflow-hidden bg-white border border-[#E2E8F0] rounded-2xl p-5 md:p-6 shadow-sm max-w-3xl mt-6">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#DC2626]" />

          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#172033]">
              Latest Submitted Scrum
            </h2>

            <span className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full">
              <CheckCircle2 size={13} />
              Submitted
            </span>
          </div>

          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-[#172033]">
                Yesterday
              </h3>

              <p className="text-sm text-[#64748B] mt-1 leading-6">
                {submittedScrum.yesterday}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#172033]">
                Today
              </h3>

              <p className="text-sm text-[#64748B] mt-1 leading-6">
                {submittedScrum.today}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#172033]">
                Blockers
              </h3>

              <p className="text-sm text-[#64748B] mt-1">
                {submittedScrum.blockers || "No blockers reported."}
              </p>
            </div>

            <p className="text-xs text-[#94A3B8]">
              Submitted: {submittedScrum.submittedAt}
            </p>
          </div>
        </div>
      )}

      {/* ===============================
          SCRUM HISTORY + PM REVIEW
      =============================== */}

      <div className="relative mt-6 max-w-3xl overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
        <div className="absolute inset-x-0 top-0 h-1 gradient-stroke" />

        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[#172033]">Submission History</h2>

          <span className="text-xs text-[#64748B]">
            {history.length} submitted
          </span>
        </div>

        {loading ? (
          <p className="mt-4 text-sm text-[#64748B]">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="mt-4 text-sm text-[#64748B]">
            You have not submitted a daily scrum yet.
          </p>
        ) : (
          <ul className="mt-5 space-y-4">
            {history.map((scrum) => {
              const style =
                REVIEW_STYLES[scrum.reviewStatus] || REVIEW_STYLES.Pending;

              return (
                <li
                  key={scrum._id}
                  className="rounded-xl border border-[#E2E8F0] bg-[#F3F6FB] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-[#64748B]">
                      {new Date(scrum.createdAt).toLocaleString()}
                    </span>

                    <span
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold"
                      style={{ background: style.bg, color: style.color }}
                    >
                      <Clock3 size={12} />
                      {scrum.reviewStatus}
                    </span>
                  </div>

                  <dl className="mt-3 space-y-2 text-sm">
                    <div>
                      <dt className="font-semibold text-[#172033]">Yesterday</dt>
                      <dd className="text-[#64748B]">{scrum.yesterday}</dd>
                    </div>

                    <div>
                      <dt className="font-semibold text-[#172033]">Today</dt>
                      <dd className="text-[#64748B]">{scrum.today}</dd>
                    </div>

                    <div>
                      <dt className="font-semibold text-[#172033]">Blockers</dt>
                      <dd className="text-[#64748B]">
                        {scrum.blockers || "No blockers reported."}
                      </dd>
                    </div>
                  </dl>

                  {scrum.managerRemarks && (
                    <div
                      className="mt-3 rounded-lg px-3 py-2"
                      style={{ background: style.bg }}
                    >
                      <p
                        className="text-[11px] font-bold"
                        style={{ color: style.color }}
                      >
                        Project Manager remarks
                      </p>

                      <p className="mt-1 text-sm text-[#172033]">
                        {scrum.managerRemarks}
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DailyScrum;