import { useCallback, useEffect, useState } from "react";
import {
  CalendarClock,
  ListChecks,
  Plus,
  RefreshCcw,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";

import {
  getInterns,
  getAssignedTasks,
  createTask,
  updateTask,
  deleteTask,
  assignIntern,
} from "../../services/projectManagerWorkflowApi";

// ============================================================
// INTERN TASK ASSIGNMENT  (page 13)
//
// Creating a task here notifies the intern and makes the task
// openable at /intern/tasks/:id. When the intern submits it, the
// status shown below moves to "Submitted" and then to
// "Approved" or "Resubmit" once the mentor reviews it.
// ============================================================

const STATUS_COLORS = {
  Assigned: { bg: "#EFF6FF", color: "#2563EB" },
  "In Progress": { bg: "#ECFEFF", color: "#0891B2" },
  Submitted: { bg: "#FFFBEB", color: "#B45309" },
  Approved: { bg: "#ECFDF5", color: "#047857" },
  Resubmit: { bg: "#FEF2F2", color: "#DC2626" },
};

const EMPTY_TASK = {
  title: "",
  description: "",
  assignedTo: "",
  priority: "Medium",
  deadline: "",
};

function formatDate(value) {
  if (!value) return "No deadline";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "No deadline";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function InternTaskAssignment() {
  const [interns, setInterns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState({});

  const [form, setForm] = useState(EMPTY_TASK);
  const [formOpen, setFormOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [internList, taskData] = await Promise.all([
        getInterns(),
        getAssignedTasks(),
      ]);

      setInterns(internList);
      setTasks(taskData.tasks);
      setSummary(taskData.summary);
    } catch (err) {
      setError(err.message || "Failed to load interns and tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
    setError("");
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Give the task a title.");
      return;
    }

    if (!form.assignedTo) {
      setError("Choose the intern this task is assigned to.");
      return;
    }

    try {
      setSaving(true);

      const task = await createTask({
        title: form.title.trim(),
        description: form.description.trim(),
        assignedTo: form.assignedTo,
        priority: form.priority,
        deadline: form.deadline || null,
      });

      setTasks((previous) => [task, ...previous]);
      setForm(EMPTY_TASK);
      setFormOpen(false);
      setSuccess(`Task assigned to ${task.assignedToName}.`);

      await load();
    } catch (err) {
      setError(err.message || "Failed to assign the task.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((previous) => previous.filter((task) => task._id !== id));
      setSuccess("Task deleted.");
    } catch (err) {
      setError(err.message || "Failed to delete the task.");
    }
  };

  const handleReassign = async (id, assignedTo) => {
    if (!assignedTo) return;

    try {
      const updated = await updateTask(id, { assignedTo });

      setTasks((previous) =>
        previous.map((task) => (task._id === id ? updated : task))
      );

      setSuccess(`Task reassigned to ${updated.assignedToName}.`);
    } catch (err) {
      setError(err.message || "Failed to reassign the task.");
    }
  };

  const handleQuickMentorAssign = async (internId, mentorId) => {
    try {
      await assignIntern(internId, { mentorId });
      await load();
      setSuccess("Intern assignment updated.");
    } catch (err) {
      setError(err.message || "Failed to update the assignment.");
    }
  };

  return (
    <section className="mb-8">
      <div className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
        <div className="absolute inset-x-0 top-0 h-1 gradient-stroke" />

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ListChecks size={18} className="text-[#2563EB]" />
              <h2 className="text-lg font-bold text-[#172033]">
                Intern Task Assignment
              </h2>
            </div>

            <p className="mt-1 text-sm text-[#64748B]">
              Assign work to interns. Submitted tasks go straight to the
              mentor's review queue.
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={load}
              className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#172033] transition hover:border-[#2563EB] hover:text-[#2563EB]"
            >
              <RefreshCcw size={15} />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => setFormOpen((open) => !open)}
              className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              {formOpen ? <X size={15} /> : <Plus size={15} />}
              {formOpen ? "Cancel" : "Assign Task"}
            </button>
          </div>
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
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Open" value={summary.assigned || 0} color="#2563EB" />
          <Stat
            label="Awaiting review"
            value={summary.submitted || 0}
            color="#B45309"
          />
          <Stat label="Approved" value={summary.approved || 0} color="#047857" />
          <Stat label="Resubmit" value={summary.resubmit || 0} color="#DC2626" />
        </div>

        {/* Create form */}
        {formOpen && (
          <form
            onSubmit={handleCreate}
            className="mt-5 rounded-xl border border-[#E2E8F0] bg-[#F3F6FB] p-4 md:p-5"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Task title" required>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Build the submission form"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB]"
                />
              </Field>

              <Field label="Assign to" required>
                <select
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB]"
                >
                  <option value="">Select an intern</option>

                  {interns.map((intern) => (
                    <option key={intern._id} value={intern._id}>
                      {intern.name}
                      {intern.teamName ? ` - ${intern.teamName}` : ""}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Priority">
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB]"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </Field>

              <Field label="Deadline">
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB]"
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Description">
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="What should the intern deliver?"
                    className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#2563EB]"
                  />
                </Field>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0891B2] py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto md:px-8"
            >
              {saving ? "Assigning..." : "Assign task"}
            </button>
          </form>
        )}

        {/* Interns without a mentor */}
        {interns.some((intern) => !intern.mentor) && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2">
              <UserPlus size={16} className="text-[#B45309]" />
              <p className="text-sm font-bold text-[#B45309]">
                Interns without a mentor
              </p>
            </div>

            <p className="mt-1 text-xs text-[#92400E]">
              An intern cannot submit a task until a mentor is assigned.
            </p>

            <ul className="mt-3 space-y-2">
              {interns
                .filter((intern) => !intern.mentor)
                .map((intern) => (
                  <li
                    key={intern._id}
                    className="flex flex-col gap-2 rounded-lg bg-white px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="text-sm font-medium text-[#172033]">
                      {intern.name}
                    </span>

                    <MentorPicker
                      onPick={(mentorId) =>
                        handleQuickMentorAssign(intern._id, mentorId)
                      }
                    />
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Task list */}
        <div className="mt-6">
          {loading ? (
            <p className="text-sm text-[#64748B]">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="rounded-xl bg-[#F3F6FB] px-4 py-6 text-center text-sm text-[#64748B]">
              No tasks have been assigned yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {tasks.map((task) => {
                const style =
                  STATUS_COLORS[task.status] || STATUS_COLORS.Assigned;

                return (
                  <li
                    key={task._id}
                    className="rounded-xl border border-[#E2E8F0] bg-white p-4 transition hover:border-[#22D3EE]"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <p className="font-semibold text-[#172033]">
                          {task.title}
                        </p>

                        <p className="mt-1 text-xs text-[#64748B]">
                          {task.assignedToName} ·{" "}
                          {task.projectName || "No project"} ·{" "}
                          <span className="inline-flex items-center gap-1">
                            <CalendarClock size={12} />
                            {formatDate(task.deadline)}
                          </span>{" "}
                          · {task.priority} priority
                        </p>

                        {task.description && (
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                            {task.description}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span
                          className="rounded-lg px-3 py-1.5 text-xs font-bold"
                          style={{ background: style.bg, color: style.color }}
                        >
                          {task.status}
                        </span>

                        <select
                          value=""
                          onChange={(event) =>
                            handleReassign(task._id, event.target.value)
                          }
                          className="rounded-lg border border-[#E2E8F0] bg-white px-2 py-1.5 text-xs text-[#64748B] outline-none transition focus:border-[#2563EB]"
                        >
                          <option value="">Reassign...</option>

                          {interns
                            .filter(
                              (intern) =>
                                String(intern._id) !== String(task.assignedTo)
                            )
                            .map((intern) => (
                              <option key={intern._id} value={intern._id}>
                                {intern.name}
                              </option>
                            ))}
                        </select>

                        <button
                          type="button"
                          onClick={() => handleDelete(task._id)}
                          aria-label={`Delete ${task.title}`}
                          className="rounded-lg border border-[#E2E8F0] p-1.5 text-[#DC2626] transition hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
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

/**
 * Small mentor picker backed by the mentor directory exposed at
 * /api/auth/mentors.
 */
function MentorPicker({ onPick }) {
  const [mentors, setMentors] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const loadMentors = async () => {
    if (loaded) return;

    try {
      const { http } = await import("../../services/http");
      const payload = await http.get("/auth/mentors");

      setMentors(payload.mentors || []);
    } catch {
      setMentors([]);
    } finally {
      setLoaded(true);
    }
  };

  return (
    <select
      value=""
      onFocus={loadMentors}
      onChange={(event) => onPick(event.target.value)}
      className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs outline-none transition focus:border-[#2563EB]"
    >
      <option value="">Assign a mentor...</option>

      {mentors.map((mentor) => (
        <option key={mentor._id || mentor.id} value={mentor._id || mentor.id}>
          {mentor.name}
        </option>
      ))}
    </select>
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

export default InternTaskAssignment;
