import { useState } from "react";
import { CheckCircle2, ClipboardCheck } from "lucide-react";
import { getCurrentUserId } from "../utils/auth";

function DailyScrum() {
  const [yesterday, setYesterday] = useState("");
  const [today, setToday] = useState("");
  const [blockers, setBlockers] = useState("");

  const [submittedScrum, setSubmittedScrum] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!yesterday.trim() || !today.trim()) {
      setMessage("Please complete the required fields before submitting.");
      return;
    }

    const userId = getCurrentUserId();

    if (!userId) {
      setMessage(
        "You're not logged in. Please log in again to submit your scrum."
      );
      console.warn(
        "No user found in localStorage. Expected localStorage.user._id to be set by the login flow."
      );
      return;
    }

    const scrumData = {
      userId: userId,
      yesterday: yesterday,
      today: today,
      blockers: blockers,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/daily-scrums",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(scrumData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit Daily Scrum"
        );
      }

      setSubmittedScrum({
        ...data,
        submittedAt: new Date(
          data.createdAt
        ).toLocaleString(),
      });

      setMessage("Daily Scrum submitted successfully!");

      setYesterday("");
      setToday("");
      setBlockers("");
    } catch (error) {
      setMessage(error.message);
      console.error("Submission error:", error);
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
          className="bg-[#2563EB] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1D4ED8] transition"
        >
          Submit Scrum
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
    </div>
  );
}

export default DailyScrum;