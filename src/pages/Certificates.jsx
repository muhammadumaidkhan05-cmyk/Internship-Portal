import { useEffect, useState } from "react";
import { Award, CheckCircle2 } from "lucide-react";

function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      setError("");

      const userId = localStorage.getItem("userId");

      if (!userId) {
        throw new Error("User is not logged in.");
      }

      const response = await fetch(
        `http://localhost:5000/api/certificates/user/${userId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load certificates");
      }

      setCertificates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Certificates loading error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-[#64748B]">
          Loading certificates...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-7">
        <p className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
          Internship Achievements
        </p>

        <h1 className="text-2xl md:text-3xl font-bold text-[#172033] mt-1">
          Certificates
        </h1>

        <p className="text-sm text-[#64748B] mt-1">
          View your earned internship certificates and achievements.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {!error && certificates.length === 0 && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-[#172033]">
            No Certificates Found
          </h2>

          <p className="text-sm text-[#64748B] mt-2">
            No certificates have been issued to you yet.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {certificates.map((certificate) => (
          <div
            key={certificate._id}
            className="group relative overflow-hidden bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#DC2626] group-hover:brightness-125 transition" />

            <div className="w-12 h-12 rounded-xl bg-[#F3F6FB] text-[#8B5CF6] flex items-center justify-center">
              <Award size={24} />
            </div>

            <div className="mt-5">
              <span className="text-xs font-medium text-[#8B5CF6] bg-purple-50 px-2.5 py-1 rounded-full">
                {certificate.issuedBy || "MSN Academy"}
              </span>

              <h2 className="font-bold text-lg text-[#172033] mt-3">
                {certificate.title}
              </h2>

              <p className="text-sm text-[#64748B] mt-2">
                Issued: {certificate.issueDate || "Date not available"}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-600 mt-5">
              <CheckCircle2 size={15} />
              Certificate Earned
            </div>

            {certificate.certificateUrl ? (
              <a
                href={certificate.certificateUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-5 border border-[#E2E8F0] text-[#172033] px-4 py-2.5 rounded-lg text-sm font-medium hover:border-[#2563EB] hover:text-[#2563EB] transition"
              >
                View Certificate
              </a>
            ) : (
              <button
                onClick={() =>
                  alert(
                    `${certificate.title}\n\nIssued By: ${
                      certificate.issuedBy || "MSN Academy"
                    }\nIssue Date: ${
                      certificate.issueDate || "Not available"
                    }`
                  )
                }
                className="mt-5 border border-[#E2E8F0] text-[#172033] px-4 py-2.5 rounded-lg text-sm font-medium hover:border-[#2563EB] hover:text-[#2563EB] transition"
              >
                View Certificate
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Certificates;