import { useEffect, useState } from "react";

function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const userId = localStorage.getItem("userId");

      if (!userId) {
        throw new Error("User is not logged in.");
      }

      const response = await fetch(
        `http://localhost:5000/api/projects/user/${userId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load projects"
        );
      }

      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Projects loading error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-[#64748B]">
          Loading projects...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl md:text-3xl font-bold text-[#172033]">
          My Projects
        </h1>

        <p className="text-sm text-[#64748B] mt-1">
          View your assigned internship projects, progress and
          submission status.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {!error && projects.length === 0 && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-[#172033]">
            No Projects Found
          </h2>

          <p className="text-sm text-[#64748B] mt-2">
            No projects have been assigned to you yet.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project._id}
            className="group relative overflow-hidden bg-white border border-[#E2E8F0] rounded-2xl p-5 md:p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#DC2626] group-hover:brightness-125 transition" />

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#64748B] mb-1">
                  Internship Project
                </p>

                <h2 className="text-lg md:text-xl font-bold text-[#172033]">
                  {project.title}
                </h2>
              </div>

              <span
                className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full ${
                  project.status === "Completed"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-[#E0F7FA] text-[#0891B2]"
                }`}
              >
                {project.status}
              </span>
            </div>

            <div className="mt-5">
              <h3 className="text-sm font-semibold text-[#172033] mb-1">
                Description
              </h3>

              <p className="text-sm leading-6 text-[#64748B]">
                {project.description || "No description available."}
              </p>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-[#172033]">
                    Project Progress
                  </h3>

                  <p className="text-xs text-[#64748B] mt-0.5">
                    Current completion
                  </p>
                </div>

                <span className="text-sm font-bold text-[#2563EB]">
                  {project.progress || 0}%
                </span>
              </div>

              <div className="h-3 bg-[#F3F6FB] rounded-full overflow-hidden border border-[#E2E8F0]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#EF4444] transition-all duration-700"
                  style={{
                    width: `${project.progress || 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-5 bg-[#F3F6FB] rounded-xl p-4">
              <h3 className="text-sm font-semibold text-[#172033] mb-1">
                Project Update
              </h3>

              <p className="text-sm leading-6 text-[#64748B]">
                {project.stage || "No update available."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              <div className="border border-[#E2E8F0] rounded-xl p-3">
                <p className="text-xs text-[#64748B]">
                  Project Status
                </p>

                <p className="text-sm font-semibold text-[#172033] mt-1">
                  {project.status}
                </p>
              </div>

              <div className="border border-[#E2E8F0] rounded-xl p-3">
                <p className="text-xs text-[#64748B]">
                  Submission
                </p>

                <p
                  className={`text-sm font-semibold mt-1 ${
                    project.submissionStatus === "Approved"
                      ? "text-emerald-600"
                      : project.submissionStatus === "Submitted"
                      ? "text-[#2563EB]"
                      : "text-[#F59E0B]"
                  }`}
                >
                  {project.submissionStatus || "Not Submitted"}
                </p>
              </div>
            </div>

            {(project.githubLink || project.liveLink) && (
              <div className="flex flex-wrap gap-3 mt-5">
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-[#2563EB] hover:underline"
                  >
                    GitHub
                  </a>
                )}

                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-[#2563EB] hover:underline"
                  >
                    Live Project
                  </a>
                )}
              </div>
            )}

            <button
              onClick={() =>
                alert(
                  `${project.title}\n\nProgress: ${
                    project.progress || 0
                  }%\nStatus: ${project.status}\nSubmission: ${
                    project.submissionStatus || "Not Submitted"
                  }`
                )
              }
              className="mt-5 w-full sm:w-auto bg-[#2563EB] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1D4ED8] transition"
            >
              View Project
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyProjects;