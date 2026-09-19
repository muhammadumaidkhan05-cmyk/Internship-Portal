import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Code2,
  Globe,
  Paperclip,
  Plus,
  RefreshCcw,
  Trash2,
  Upload,
  UserCheck,
  XCircle,
} from "lucide-react";

import {
  getTaskById,
  startTask,
  submitTask,
} from "../../services/internApi";

// ============================================================
// TASK DETAILS & SUBMISSION  (page 8)
//
// Opening a task marks it In Progress. Submitting it creates a
// Submission that lands directly in the assigned mentor's review
// queue (page 16) and moves the task to "Submitted".
// ============================================================

const TASK_STATUS_STYLES = {
  Assigned: { bg: "#EFF6FF", color: "#2563EB", label: "Assigned" },
  "In Progress": { bg: "#ECFEFF", color: "#0891B2", label: "In Progress" },
  Submitted: { bg: "#FFFBEB", color: "#B45309", label: "Awaiting Review" },
  Approved: { bg: "#ECFDF5", color: "#047857", label: "Approved" },
  Resubmit: { bg: "#FEF2F2", color: "#DC2626", label: "Resubmit Required" },
};

const SUBMISSION_STATUS_STYLES = {
  pending: { bg: "#FFFBEB", color: "#B45309", label: "Pending", Icon: Clock3 },
  approved: {
    bg: "#ECFDF5",
    color: "#047857",
    label: "Approved",
    Icon: CheckCircle2,
  },
  resubmission_required: {
    bg: "#FEF2F2",
    color: "#DC2626",
    label: "Resubmit",
    Icon: XCircle,
  },
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

function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [canSubmit, setCanSubmit] = useState(false);

  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadTask = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTaskById(taskId);

      setTask(data.task);
      setSubmissions(data.submissions || []);
      setCanSubmit(Boolean(data.canSubmit));

      // Opening an assigned task moves it to In Progress so the
      // Project Manager can see it has been picked up.
      if (data.task?.status === "Assigned") {
        const updated = await startTask(taskId);
        setTask(updated);
      }
    } catch (err) {
      setError(err.message || "Failed to load this task.");
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  const handleAddAttachment = () => {
    const name = attachmentName.trim();
    const url = attachmentUrl.trim();

    if (!name && !url) {
      setError("Give the attachment a name or a link before adding it.");
      return;
    }

    setError("");
    setAttachments((previous) => [
      ...previous,
      { name: name || "Attachment", url },
    ]);
    setAttachmentName("");
    setAttachmentUrl("");
  };

  const handleRemoveAttachment = (index) => {
    setAttachments((previous) =>
      previous.filter((_, position) => position !== index)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!description.trim()) {
      setError("Describe what you completed before submitting.");
      return;
    }

    try {
      setSubmitting(true);

      const result = await submitTask(taskId, {
        description: description.trim(),
        githubUrl: githubUrl.trim(),
        liveUrl: liveUrl.trim(),
        attachments,
      });

      setTask(result.task);
      setSubmissions((previous) => [result.submission, ...previous]);
      setCanSubmit(false);

      setDescription("");
      setGithubUrl("");
      setLiveUrl("");
      setAttachments([]);

      setSuccess(
        "Task submitted. Your mentor has been notified and will review it shortly."
      );

      window.dispatchEvent(new Event("intern:notifications-changed"));
    } catch (err) {
      setError(err.message || "Failed to submit this task.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-[#64748B]">Loading task...</p>;
  }

  if (!task) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 gradient-stroke" />

        <h1 className="text-lg font-bold text-[#172033]">Task not available</h1>

        <p className="mt-2 text-sm text-[#64748B]">
          {error || "This task could not be found or is not assigned to you."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/intern/projects")}
          className="mt-5 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Back to my projects
        </button>
      </div>
    );
  }

  const statusStyle =
    TASK_STATUS_STYLES[task.status] || TASK_STATUS_STYLES.Assigned;

  const latestSubmission = submissions[0] || null;

  return (
    <div>
      {/* ===============================
          HEADER
      =============================== */}

      <div className="mb-6">
        <Link
          to="/intern/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#2563EB] transition hover:underline"
        >
          <ArrowLeft size={16} />
          Back to My Projects
        </Link>
      </div>

      <div className="group relative mb-6 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md md:p-7">
        <div className="absolute inset-x-0 top-0 h-1 gradient-stroke" />

        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
              Task Details
            </p>

            <h1 className="mt-2 text-xl font-bold text-[#172033] md:text-2xl">
              {task.title}
            </h1>

            {task.description && (
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#64748B]">
                {task.description}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-4 text-sm">
              <MetaItem
                Icon={FolderKanban}
                label="Project"
                value={task.projectName || "Unassigned"}
              />
              <MetaItem
                Icon={UserCheck}
                label="Mentor"
                value={task.mentorName || "Not assigned"}
              />
              <MetaItem
                Icon={CalendarClock}
                label="Deadline"
                value={formatDate(task.deadline)}
              />
              <MetaItem
                Icon={RefreshCcw}
                label="Attempts"
                value={task.submissionCount || 0}
              />
            </div>
          </div>

          <span
            className="shrink-0 rounded-xl px-4 py-2 text-xs font-bold"
            style={{ background: statusStyle.bg, color: statusStyle.color }}
          >
            {statusStyle.label}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#DC2626]">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-[#047857]">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* ===============================
            SUBMISSION FORM
        =============================== */}

        <div className="lg:col-span-3">
          <div className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md md:p-6">
            <div className="absolute inset-x-0 top-0 h-1 gradient-stroke" />

            <div className="flex items-center gap-2">
              <Upload size={18} className="text-[#2563EB]" />
              <h2 className="text-lg font-bold text-[#172033]">
                Submit This Task
              </h2>
            </div>

            {!canSubmit ? (
              <p className="mt-4 rounded-xl bg-[#F3F6FB] px-4 py-3 text-sm text-[#64748B]">
                {task.status === "Approved"
                  ? "This task has been approved. No further submission is needed."
                  : "This task is with your mentor for review. You will be notified when a decision is made."}
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <Field label="What did you complete?" required>
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={5}
                    placeholder="Summarise the work you completed, the approach you took and anything your mentor should look at first."
                    className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#172033] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                  />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Repository link">
                    <div className="relative">
                      <Code2
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]"
                      />
                      <input
                        type="url"
                        value={githubUrl}
                        onChange={(event) => setGithubUrl(event.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full rounded-xl border border-[#E2E8F0] bg-white py-3 pl-10 pr-4 text-sm text-[#172033] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                      />
                    </div>
                  </Field>

                  <Field label="Live / preview link">
                    <div className="relative">
                      <Globe
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]"
                      />
                      <input
                        type="url"
                        value={liveUrl}
                        onChange={(event) => setLiveUrl(event.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-xl border border-[#E2E8F0] bg-white py-3 pl-10 pr-4 text-sm text-[#172033] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                      />
                    </div>
                  </Field>
                </div>

                {/* Attachments */}
                <div>
                  <p className="mb-2 text-sm font-medium text-[#172033]">
                    Attachments
                  </p>

                  {attachments.length > 0 && (
                    <ul className="mb-3 space-y-2">
                      {attachments.map((file, index) => (
                        <li
                          key={`${file.name}-${index}`}
                          className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F3F6FB] px-3 py-2 text-sm"
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <Paperclip size={14} className="text-[#64748B]" />
                            <span className="truncate text-[#172033]">
                              {file.name}
                            </span>
                          </span>

                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(index)}
                            className="text-[#DC2626] transition hover:opacity-70"
                            aria-label={`Remove ${file.name}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      value={attachmentName}
                      onChange={(event) => setAttachmentName(event.target.value)}
                      placeholder="File name"
                      className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB] sm:w-40"
                    />

                    <input
                      type="url"
                      value={attachmentUrl}
                      onChange={(event) => setAttachmentUrl(event.target.value)}
                      placeholder="https://link-to-file"
                      className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB]"
                    />

                    <button
                      type="button"
                      onClick={handleAddAttachment}
                      className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-[#2563EB]/30 bg-[#EFF6FF] px-4 py-2.5 text-sm font-semibold text-[#2563EB] transition hover:bg-[#2563EB] hover:text-white"
                    >
                      <Plus size={15} />
                      Add
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0891B2] py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Upload size={17} />
                  {submitting
                    ? "Submitting..."
                    : task.status === "Resubmit"
                      ? "Resubmit for review"
                      : "Submit for mentor review"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ===============================
            REVIEW HISTORY
        =============================== */}

        <div className="lg:col-span-2">
          {latestSubmission?.status === "resubmission_required" &&
            latestSubmission.feedback && (
              <div className="relative mb-5 overflow-hidden rounded-2xl border border-red-200 bg-[#FEF2F2] p-5 shadow-sm">
                <div className="absolute inset-x-0 top-0 h-1 bg-[#DC2626]" />

                <div className="flex items-center gap-2">
                  <XCircle size={17} className="text-[#DC2626]" />
                  <h3 className="font-bold text-[#172033]">
                    Mentor Requested Changes
                  </h3>
                </div>

                <p className="mt-3 text-sm leading-6 text-[#7F1D1D]">
                  {latestSubmission.feedback}
                </p>
              </div>
            )}

          <div className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md md:p-6">
            <div className="absolute inset-x-0 top-0 h-1 gradient-stroke" />

            <h2 className="text-lg font-bold text-[#172033]">
              Submission History
            </h2>

            {submissions.length === 0 ? (
              <p className="mt-4 text-sm text-[#64748B]">
                You have not submitted this task yet.
              </p>
            ) : (
              <ul className="mt-5 space-y-4">
                {submissions.map((submission) => {
                  const style =
                    SUBMISSION_STATUS_STYLES[submission.status] ||
                    SUBMISSION_STATUS_STYLES.pending;

                  const StatusIcon = style.Icon;

                  return (
                    <li
                      key={submission._id}
                      className="rounded-xl border border-[#E2E8F0] bg-[#F3F6FB] p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-[#64748B]">
                          Attempt {submission.attempt || 1} ·{" "}
                          {formatDate(submission.submittedAt)}
                        </span>

                        <span
                          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold"
                          style={{ background: style.bg, color: style.color }}
                        >
                          <StatusIcon size={13} />
                          {style.label}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-[#172033]">
                        {submission.description}
                      </p>

                      {submission.score !== null &&
                        submission.score !== undefined && (
                          <p className="mt-2 text-sm font-semibold text-[#047857]">
                            Score: {submission.score}/100
                          </p>
                        )}

                      {submission.feedback && (
                        <p className="mt-2 text-sm text-[#64748B]">
                          <span className="font-semibold text-[#172033]">
                            Feedback:
                          </span>{" "}
                          {submission.feedback}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaItem({ Icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={15} className="text-[#0891B2]" />
      <span className="text-[#64748B]">{label}:</span>
      <span className="font-semibold text-[#172033]">{value}</span>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#172033]">
        {label}
        {required && <span className="ml-1 text-[#DC2626]">*</span>}
      </label>

      {children}
    </div>
  );
}

export default TaskDetails;
