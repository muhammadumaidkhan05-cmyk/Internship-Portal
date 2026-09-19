import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Link2,
  CheckCircle2,
  RotateCcw,
  Inbox,
  User,
} from "lucide-react";

import {
  getSubmissions,
  getSubmissionById,
  approveSubmission,
  requestResubmission,
} from "../../services/mentorApi";

function SubmissionReview() {
  const navigate = useNavigate();
  const { submissionId } = useParams();

  const [queue, setQueue] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, type, message });
  };

  useEffect(() => {
    if (!toast.show) return;
    const timer = setTimeout(
      () => setToast({ show: false, type: "", message: "" }),
      3000
    );
    return () => clearTimeout(timer);
  }, [toast]);

  const loadQueue = async () => {
    try {
      const response = await getSubmissions("pending");
      const submissions = response.data?.data || [];
      setQueue(submissions);
      return submissions;
    } catch (error) {
      showToast("Unable to load the review queue.", "error");
      return [];
    }
  };

  const loadSelected = async (id, fallbackQueue) => {
    if (!id) {
      const first = fallbackQueue?.[0];
      setSelected(first || null);
      return;
    }

    try {
      const response = await getSubmissionById(id);
      setSelected(response.data?.data || null);
    } catch (error) {
      showToast("That submission could not be found.", "error");
      setSelected(fallbackQueue?.[0] || null);
    }
  };

  const initialLoad = async () => {
    setLoading(true);
    const submissions = await loadQueue();
    await loadSelected(submissionId, submissions);
    setLoading(false);
  };

  useEffect(() => {
    initialLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId]);

  useEffect(() => {
    setScore(
      selected?.status === "approved" && selected?.score != null
        ? String(selected.score)
        : ""
    );
    setFeedback(selected?.feedback || "");
    setErrors({});
  }, [selected]);

  const selectSubmission = (submission) => {
    navigate(`/mentor/submission-review/${submission._id}`);
  };

  const validate = (action) => {
    const nextErrors = {};

    if (action === "approve") {
      const numericScore = Number(score);

      if (
        score === "" ||
        !Number.isFinite(numericScore) ||
        numericScore < 0 ||
        numericScore > 100
      ) {
        nextErrors.score = "Enter a score between 0 and 100.";
      }
    }

    if (action === "resubmission" && !feedback.trim()) {
      nextErrors.feedback = "Feedback is required to request a resubmission.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goToNext = async (currentId) => {
    const remaining = await loadQueue();
    const next = remaining.find((item) => item._id !== currentId);

    navigate(
      next
        ? `/mentor/submission-review/${next._id}`
        : "/mentor/submission-review",
      { replace: true }
    );
  };

  const handleApprove = async () => {
    if (!selected || !validate("approve")) return;

    try {
      setSubmitting(true);

      await approveSubmission(selected._id, {
        score: Number(score),
        feedback,
      });

      showToast("Submission approved successfully.");
      await goToNext(selected._id);
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to approve submission.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResubmission = async () => {
    if (!selected || !validate("resubmission")) return;

    try {
      setSubmitting(true);

      await requestResubmission(selected._id, { feedback });

      showToast("Resubmission requested.");
      await goToNext(selected._id);
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          "Failed to request resubmission.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

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
          <div className="mt-5 grid gap-5 xl:grid-cols-[1.7fr_1fr]">
            <div className="h-96 rounded-2xl bg-white" />
            <div className="h-96 rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F3F6FB]">
      <div className="mx-auto max-w-[1500px] p-5 sm:p-6 lg:p-8">
        <div className="mb-6">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#2563EB]">
              Mentorship
            </p>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-[#172033] sm:text-3xl">
            Submission Review
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            Review intern submissions, score them, and give feedback.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
          {/* LEFT: SUBMISSION + REVIEW FORM */}

          <div className="space-y-5">
            {!selected ? (
              <Panel>
                <EmptyState
                  icon={Inbox}
                  text="No pending submissions to review."
                />
              </Panel>
            ) : (
              <>
                <Panel>
                  <div className="border-b border-[#E2E8F0] pb-4">
                    <h2 className="text-lg font-black text-[#172033]">
                      {selected.taskTitle}
                    </h2>

                    <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-[#64748B]">
                      <User size={14} className="text-[#2563EB]" />
                      {selected.internName}
                      {selected.programName && (
                        <>
                          <span>&middot;</span>
                          {selected.programName}
                        </>
                      )}
                      <span>&middot;</span>
                      Submitted {formatDate(selected.submittedAt)}
                    </p>
                  </div>

                  <div className="mt-4 space-y-3 text-sm">
                    {selected.githubUrl && (
                      <div className="flex items-start gap-2">
                        <Link2
                          size={16}
                          className="mt-0.5 shrink-0 text-[#172033]"
                        />
                        <a
                          href={selected.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all font-semibold text-[#2563EB] hover:underline"
                        >
                          {selected.githubUrl}
                        </a>
                      </div>
                    )}

                    {selected.description && (
                      <p className="leading-6 text-[#334155]">
                        {selected.description}
                      </p>
                    )}

                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                        selected.status === "approved"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : selected.status === "resubmission_required"
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                      }`}
                    >
                      {selected.status === "resubmission_required"
                        ? "Resubmission Required"
                        : selected.status.charAt(0).toUpperCase() +
                          selected.status.slice(1)}
                    </span>
                  </div>
                </Panel>

                <Panel title="Review">
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#64748B]">
                        Score (0-100)
                      </label>

                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={score}
                        onChange={(event) => setScore(event.target.value)}
                        disabled={selected.status === "approved"}
                        placeholder="e.g. 85"
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 ${
                          errors.score
                            ? "border-red-300"
                            : "border-[#E2E8F0]"
                        }`}
                      />

                      {errors.score && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.score}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#64748B]">
                        Feedback
                      </label>

                      <textarea
                        rows={4}
                        value={feedback}
                        onChange={(event) =>
                          setFeedback(event.target.value)
                        }
                        placeholder="Enter feedback for the intern"
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 ${
                          errors.feedback
                            ? "border-red-300"
                            : "border-[#E2E8F0]"
                        }`}
                      />

                      {errors.feedback && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.feedback}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={handleApprove}
                        disabled={
                          submitting || selected.status === "approved"
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0891B2] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <CheckCircle2 size={17} />
                        Approve
                      </button>

                      <button
                        type="button"
                        onClick={handleResubmission}
                        disabled={
                          submitting ||
                          selected.status === "resubmission_required"
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-bold text-[#172033] transition hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <RotateCcw size={17} />
                        Request Resubmission
                      </button>
                    </div>
                  </div>
                </Panel>
              </>
            )}
          </div>

          {/* RIGHT: REVIEW QUEUE */}

          <Panel title="Review Queue" subtitle={`${queue.length} pending`}>
            {queue.length === 0 ? (
              <EmptyState icon={Inbox} text="Queue is empty." />
            ) : (
              <div className="space-y-2">
                {queue.map((item) => {
                  const isActive = selected?._id === item._id;

                  return (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => selectSubmission(item)}
                      className={`w-full rounded-xl border px-3.5 py-3 text-left transition ${
                        isActive
                          ? "border-transparent bg-gradient-to-r from-[#2563EB]/[0.08] via-[#22D3EE]/[0.08] to-[#DC2626]/[0.08] ring-2 ring-[#2563EB]/30"
                          : "border-[#E2E8F0] hover:border-blue-200 hover:bg-slate-50"
                      }`}
                    >
                      <p className="truncate text-sm font-bold text-[#172033]">
                        {item.internName}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-[#64748B]">
                        {item.taskTitle}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </Panel>
        </div>
      </div>

      {toast.show && (
        <div
          className={`fixed bottom-5 right-5 z-[70] flex max-w-sm items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-xl ${
            toast.type === "error" ? "border-red-200" : "border-blue-200"
          }`}
        >
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              toast.type === "error" ? "bg-[#DC2626]" : "bg-[#2563EB]"
            }`}
          />
          <p className="text-sm font-medium text-[#172033]">
            {toast.message}
          </p>
        </div>
      )}
    </div>
  );
}

function Panel({ title, subtitle, children }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.045)]">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#DC2626]" />

      {title && (
        <div className="border-b border-[#E2E8F0] px-5 py-4">
          <h2 className="text-sm font-black text-[#172033] sm:text-[15px]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-[11px] text-[#94A3B8]">{subtitle}</p>
          )}
        </div>
      )}

      <div className="p-5">{children}</div>
    </section>
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

export default SubmissionReview;
