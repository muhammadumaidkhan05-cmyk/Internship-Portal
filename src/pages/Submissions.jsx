import { useEffect, useState } from "react";
import {
  Upload,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

function Submissions() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");

  const [submissions, setSubmissions] = useState([]);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const userId = localStorage.getItem("userId");

      if (!userId) {
        throw new Error("User is not logged in.");
      }

      const [submissionResponse, projectResponse] =
        await Promise.all([
          fetch(
            `http://localhost:5000/api/submissions/user/${userId}`
          ),
          fetch(
            `http://localhost:5000/api/projects/user/${userId}`
          ),
        ]);

      const submissionData = await submissionResponse.json();
      const projectData = await projectResponse.json();

      if (!submissionResponse.ok) {
        throw new Error(
          submissionData.message || "Failed to load submissions"
        );
      }

      if (!projectResponse.ok) {
        throw new Error(
          projectData.message || "Failed to load projects"
        );
      }

      setSubmissions(
        Array.isArray(submissionData) ? submissionData : []
      );

      setProjects(Array.isArray(projectData) ? projectData : []);
    } catch (error) {
      console.error("Submissions loading error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim() || !description.trim()) {
      setError("Please enter title and description.");
      return;
    }

    if (projects.length === 0) {
      setError("No projects are assigned to you yet.");
      return;
    }

    try {
      setSubmitting(true);

      const userId = localStorage.getItem("userId");

      if (!userId) {
        throw new Error("User is not logged in.");
      }

      const selectedProject = projects.find(
        (project) =>
          project.title.toLowerCase() ===
          title.trim().toLowerCase()
      );

      const projectToSubmit = selectedProject || projects[0];

      const response = await fetch(
        "http://localhost:5000/api/submissions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            projectId: projectToSubmit._id,
            title: title.trim(),
            description: description.trim(),
            githubLink: link.trim(),
            status: "Pending",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit work"
        );
      }

      setSubmissions((previous) => [data, ...previous]);

      setTitle("");
      setDescription("");
      setLink("");

      setSuccess("Your work has been submitted successfully.");
    } catch (error) {
      console.error("Submission error:", error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusIcon = (status) => {
    if (status === "Approved") {
      return <CheckCircle2 size={13} />;
    }

    if (status === "Rejected") {
      return <XCircle size={13} />;
    }

    return <Clock3 size={13} />;
  };

  const getStatusClass = (status) => {
    if (status === "Approved") {
      return "bg-emerald-50 text-emerald-600";
    }

    if (status === "Rejected") {
      return "bg-red-50 text-red-600";
    }

    return "bg-orange-50 text-[#F59E0B]";
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-[#64748B]">
          Loading submissions...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-7">
        <p className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
          Internship Activity
        </p>

        <h1 className="text-2xl md:text-3xl font-bold text-[#172033] mt-1">
          Submissions
        </h1>

        <p className="text-sm text-[#64748B] mt-1">
          Submit your internship work and track its review status.
        </p>
      </div>

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl px-4 py-3 text-sm">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="relative overflow-hidden bg-white border border-[#E2E8F0] rounded-2xl p-5 md:p-6 shadow-sm max-w-3xl mb-6"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#DC2626]" />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#EAF4FF] text-[#2563EB] flex items-center justify-center">
            <Upload size={19} />
          </div>

          <div>
            <h2 className="font-bold text-[#172033]">
              New Submission
            </h2>

            <p className="text-xs text-[#64748B]">
              Submit your completed internship work
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-[#172033] mb-2">
            Project / Task Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter project or task title"
            className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-[#172033] mb-2">
            Description
          </label>

          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your submitted work..."
            className="w-full border border-[#E2E8F0] rounded-xl p-3 text-sm outline-none resize-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-[#172033] mb-2">
            Project / GitHub Link
          </label>

          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://github.com/..."
            className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-[#2563EB] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1D4ED8] transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Submit Work"}
        </button>
      </form>

      <div className="relative overflow-hidden bg-white border border-[#E2E8F0] rounded-2xl shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#DC2626]" />

        <div className="p-5 border-b border-[#E2E8F0]">
          <h2 className="font-bold text-[#172033]">
            Submission History
          </h2>

          <p className="text-xs text-[#64748B] mt-1">
            Track your submitted internship work.
          </p>
        </div>

        {submissions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-[#64748B]">
              No submissions found.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E2E8F0]">
            {submissions.map((submission) => (
              <div
                key={submission._id}
                className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:bg-[#F8FAFC] transition"
              >
                <div>
                  <h3 className="text-sm font-semibold text-[#172033]">
                    {submission.title}
                  </h3>

                  <p className="text-xs text-[#94A3B8] mt-1">
                    Submitted: {formatDate(submission.createdAt)}
                  </p>

                  {submission.description && (
                    <p className="text-xs text-[#64748B] mt-2">
                      {submission.description}
                    </p>
                  )}

                  {submission.githubLink && (
                    <a
                      href={submission.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block text-xs text-[#2563EB] mt-2 hover:underline"
                    >
                      View GitHub Link
                    </a>
                  )}
                </div>

                <span
                  className={`w-fit flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${getStatusClass(
                    submission.status
                  )}`}
                >
                  {getStatusIcon(submission.status)}
                  {submission.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Submissions;