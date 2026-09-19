import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, Users, Gauge } from "lucide-react";

import {
  getAssignedInterns,
  getEvaluationsByIntern,
  createEvaluation,
  updateEvaluation,
} from "../../services/mentorApi";

const CRITERIA = [
  { key: "technicalSkill", label: "Technical Skill", weight: 30 },
  { key: "communication", label: "Communication", weight: 20 },
  {
    key: "punctualityAttendance",
    label: "Punctuality & Attendance",
    weight: 20,
  },
  { key: "collaboration", label: "Collaboration", weight: 15 },
  { key: "initiative", label: "Initiative", weight: 15 },
];

const EMPTY_SCORES = CRITERIA.reduce((acc, item) => {
  acc[item.key] = "";
  return acc;
}, {});

const EMPTY_COMMENTS = CRITERIA.reduce((acc, item) => {
  acc[item.key] = "";
  return acc;
}, {});

function PerformanceEvaluation() {
  const navigate = useNavigate();
  const { internId: internIdParam } = useParams();

  const [interns, setInterns] = useState([]);
  const [selectedInternId, setSelectedInternId] = useState(
    internIdParam || ""
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [existingEvaluation, setExistingEvaluation] = useState(null);
  const [scores, setScores] = useState(EMPTY_SCORES);
  const [comments, setComments] = useState(EMPTY_COMMENTS);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const showToast = (message, type = "success") =>
    setToast({ show: true, type, message });

  useEffect(() => {
    if (!toast.show) return;
    const timer = setTimeout(
      () => setToast({ show: false, type: "", message: "" }),
      3000
    );
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const loadInterns = async () => {
      try {
        setLoading(true);
        const response = await getAssignedInterns();
        const assignments = response.data?.data || [];
        setInterns(assignments);

        if (!internIdParam && assignments.length > 0) {
          setSelectedInternId(assignments[0].internId?._id);
        }
      } catch (error) {
        showToast("Unable to load assigned interns.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadInterns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const loadEvaluation = async () => {
      if (!selectedInternId) return;

      try {
        const response = await getEvaluationsByIntern(selectedInternId);
        const evaluations = response.data?.data || [];
        const latest = evaluations[0] || null;

        setExistingEvaluation(latest);

        if (latest) {
          const nextScores = {};
          const nextComments = {};

          CRITERIA.forEach((item) => {
            nextScores[item.key] = String(latest.criteria[item.key]);
            nextComments[item.key] = latest.comments?.[item.key] || "";
          });

          setScores(nextScores);
          setComments(nextComments);
        } else {
          setScores(EMPTY_SCORES);
          setComments(EMPTY_COMMENTS);
        }
      } catch (error) {
        setExistingEvaluation(null);
        setScores(EMPTY_SCORES);
        setComments(EMPTY_COMMENTS);
      }
    };

    loadEvaluation();
  }, [selectedInternId]);

  const selectedIntern = interns.find(
    (item) => item.internId?._id === selectedInternId
  );

  const totalScore = useMemo(() => {
    const weightedSum = CRITERIA.reduce((sum, item) => {
      const value = Number(scores[item.key]);
      if (!Number.isFinite(value)) return sum;
      return sum + value * (item.weight / 100);
    }, 0);

    return Math.round(weightedSum * 10 * 10) / 10;
  }, [scores]);

  const allScoresValid = CRITERIA.every((item) => {
    const value = Number(scores[item.key]);
    return Number.isFinite(value) && value >= 1 && value <= 10;
  });

  const handleScoreChange = (key, value) => {
    if (value === "") {
      setScores((prev) => ({ ...prev, [key]: "" }));
      return;
    }

    const numeric = Number(value);
    if (Number.isNaN(numeric)) return;

    const clamped = Math.max(1, Math.min(10, numeric));
    setScores((prev) => ({ ...prev, [key]: String(clamped) }));
  };

  const validate = () => {
    const nextErrors = {};

    CRITERIA.forEach((item) => {
      const value = Number(scores[item.key]);
      if (!Number.isFinite(value) || value < 1 || value > 10) {
        nextErrors[item.key] = "1-10 required";
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!selectedInternId) {
      showToast("Select an intern first.", "error");
      return;
    }

    if (!validate()) {
      showToast("Please enter a score (1-10) for every criterion.", "error");
      return;
    }

    const criteriaPayload = {};
    CRITERIA.forEach((item) => {
      criteriaPayload[item.key] = Number(scores[item.key]);
    });

    try {
      setSubmitting(true);

      if (existingEvaluation) {
        await updateEvaluation(existingEvaluation._id, {
          criteria: criteriaPayload,
          comments,
        });
        showToast("Evaluation updated successfully.");
      } else {
        await createEvaluation({
          internId: selectedInternId,
          internName: selectedIntern?.internId?.name,
          programName: selectedIntern?.programName,
          milestone: selectedIntern?.milestone,
          criteria: criteriaPayload,
          comments,
        });
        showToast("Evaluation submitted successfully.");
      }

      const response = await getEvaluationsByIntern(selectedInternId);
      setExistingEvaluation(response.data?.data?.[0] || null);
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to submit evaluation.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#F3F6FB] p-5 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[1100px] animate-pulse">
          <div className="h-8 w-72 rounded bg-slate-200" />
          <div className="mt-5 h-96 rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F3F6FB]">
      <div className="mx-auto max-w-[1100px] p-5 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#2563EB]">
                Mentorship
              </p>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-[#172033] sm:text-3xl">
              Performance Evaluation
            </h1>

            <p className="mt-1 text-sm text-[#64748B]">
              Score your intern against the standard evaluation criteria.
            </p>
          </div>

          {/* INTERN DROPDOWN */}

          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex min-w-[180px] items-center justify-between gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#172033] shadow-sm transition hover:border-[#2563EB]"
            >
              <span className="flex items-center gap-2">
                <Users size={15} className="text-[#2563EB]" />
                {selectedIntern?.internId?.name || "Select intern"}
              </span>
              <ChevronDown
                size={15}
                className={`transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-12 z-10 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
                <div className="h-[2px] w-full bg-gradient-to-r from-red-500 via-blue-500 to-cyan-400" />

                {interns.length === 0 ? (
                  <div className="px-4 py-4 text-sm text-[#64748B]">
                    No assigned interns.
                  </div>
                ) : (
                  interns.map((assignment) => (
                    <button
                      key={assignment._id}
                      type="button"
                      onClick={() => {
                        setSelectedInternId(assignment.internId?._id);
                        setDropdownOpen(false);
                        navigate(
                          `/mentor/performance-evaluation/${assignment.internId?._id}`,
                          { replace: true }
                        );
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-[#F3F6FB] ${
                        assignment.internId?._id === selectedInternId
                          ? "font-bold text-[#2563EB]"
                          : "text-[#172033]"
                      }`}
                    >
                      {assignment.internId?.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {interns.length === 0 ? (
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-10 text-center shadow-sm">
            <p className="text-sm font-semibold text-[#94A3B8]">
              You have no assigned interns to evaluate yet.
            </p>
          </div>
        ) : (
          <section className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.045)]">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#DC2626]" />

            <div className="overflow-x-auto p-5">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    <th className="pb-3">Criteria</th>
                    <th className="pb-3">Weight</th>
                    <th className="pb-3">Score (1-10)</th>
                    <th className="pb-3">Comments</th>
                  </tr>
                </thead>

                <tbody>
                  {CRITERIA.map((item) => (
                    <tr
                      key={item.key}
                      className="border-b border-[#E2E8F0] last:border-b-0"
                    >
                      <td className="py-3.5 pr-4 font-semibold text-[#172033]">
                        {item.label}
                      </td>

                      <td className="py-3.5 pr-4 text-[#64748B]">
                        {item.weight}%
                      </td>

                      <td className="py-3.5 pr-4">
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={scores[item.key]}
                          onChange={(event) =>
                            handleScoreChange(item.key, event.target.value)
                          }
                          className={`w-20 rounded-lg border px-2.5 py-1.5 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 ${
                            errors[item.key]
                              ? "border-red-300"
                              : "border-[#E2E8F0]"
                          }`}
                        />
                      </td>

                      <td className="py-3.5">
                        <input
                          type="text"
                          value={comments[item.key]}
                          onChange={(event) =>
                            setComments((prev) => ({
                              ...prev,
                              [item.key]: event.target.value,
                            }))
                          }
                          placeholder="Optional comment"
                          className="w-full rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-sm outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                    <Gauge size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                      Total Score
                    </p>
                    <p className="text-xl font-black text-[#172033]">
                      {allScoresValid ? totalScore : "\u2014"}
                      <span className="text-sm font-semibold text-[#64748B]">
                        /100
                      </span>
                    </p>
                  </div>
                </div>

                {existingEvaluation && (
                  <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-bold text-cyan-700">
                    Editing existing evaluation
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-[#2563EB] via-[#0891B2] to-[#22D3EE] px-4 py-4 text-sm font-bold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Submitting..."
                : existingEvaluation
                ? "Update Evaluation"
                : "Submit Evaluation"}
            </button>
          </section>
        )}
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

export default PerformanceEvaluation;
