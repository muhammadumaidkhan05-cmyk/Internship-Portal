import { useCallback, useEffect, useState } from "react";
import { Award, CalendarCheck, Download, ShieldCheck } from "lucide-react";

import { getMyCertificates } from "../../services/internApi";

// ============================================================
// CERTIFICATES  (page 10)
// Certificates are issued by the backend workflow once a mentor
// has recorded a performance evaluation and every assigned task
// has been approved - never generated on the client.
// ============================================================

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      setCertificates(await getMyCertificates());
    } catch (err) {
      setError(err.message || "Failed to load your certificates.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
          Internship Portal
        </p>

        <h1 className="mt-1 text-2xl font-bold text-[#172033] md:text-3xl">
          Certificates
        </h1>

        <p className="mt-1 text-sm text-[#64748B]">
          Certificates issued on completion of your internship.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#DC2626]">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-[#64748B]">Loading certificates...</p>
      ) : certificates.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
          <div className="absolute inset-x-0 top-0 h-1 gradient-stroke" />

          <Award size={28} className="mx-auto text-[#64748B]" />

          <h2 className="mt-4 font-bold text-[#172033]">
            No certificate issued yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#64748B]">
            Your certificate is issued automatically once every assigned task
            has been approved by your mentor and your performance evaluation is
            complete.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {certificates.map((certificate) => (
            <div
              key={certificate._id}
              className="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="absolute inset-x-0 top-0 h-1 gradient-stroke" />

              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#22D3EE]">
                  <Award size={22} className="text-white" />
                </div>

                {certificate.finalScore !== null &&
                  certificate.finalScore !== undefined && (
                    <span className="rounded-xl bg-[#ECFDF5] px-3 py-1.5 text-xs font-bold text-[#047857]">
                      Final score {certificate.finalScore}%
                    </span>
                  )}
              </div>

              <h2 className="mt-5 text-lg font-bold text-[#172033]">
                {certificate.title}
              </h2>

              <p className="mt-1 text-sm text-[#64748B]">
                {certificate.programName}
              </p>

              <div className="mt-5 space-y-2.5 text-sm">
                <Row
                  Icon={ShieldCheck}
                  label="Certificate ID"
                  value={certificate.certificateId || "-"}
                />
                <Row
                  Icon={CalendarCheck}
                  label="Issued on"
                  value={formatDate(certificate.issueDate || certificate.createdAt)}
                />
                <Row
                  Icon={Award}
                  label="Issued by"
                  value={certificate.issuedBy}
                />
              </div>

              {certificate.certificateUrl && (
                <a
                  href={certificate.certificateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  <Download size={16} />
                  Download certificate
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Row({ Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-[#64748B]">
        <Icon size={14} className="text-[#0891B2]" />
        {label}
      </span>

      <span className="truncate font-semibold text-[#172033]">{value}</span>
    </div>
  );
}

export default Certificates;
