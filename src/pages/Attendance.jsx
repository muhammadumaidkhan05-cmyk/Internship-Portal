import { useEffect, useState } from "react";

function Attendance() {
  const [userId, setUserId] = useState("");
  const [attendance, setAttendance] = useState(null);
  const [allAttendance, setAllAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const getLoggedInUserId = () => {
    const savedUserId = localStorage.getItem("userId");

    if (savedUserId) {
      return savedUserId;
    }

    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);

        return parsedUser._id || parsedUser.id || "";
      } catch (error) {
        console.error("User data parsing error:", error);
      }
    }

    return "";
  };

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const loadAttendance = async (currentUserId) => {
    try {
      setLoading(true);
      setMessage("");

      if (!currentUserId) {
        setMessage("User ID not found. Please login again.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/attendance/user/${currentUserId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load attendance");
      }

      setAllAttendance(data);

      const todayRecord = data.find(
        (record) => record.date === getTodayDate()
      );

      setAttendance(todayRecord || null);
    } catch (error) {
      console.error("Attendance loading error:", error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentUserId = getLoggedInUserId();

    setUserId(currentUserId);

    if (currentUserId) {
      loadAttendance(currentUserId);
    } else {
      setLoading(false);
      setMessage("User ID not found. Please login again.");
    }
  }, []);

  const handleCheckIn = async () => {
    try {
      setMessage("");

      if (!userId) {
        setMessage("User ID not found. Please login again.");
        return;
      }

      if (attendance) {
        setMessage("You have already checked in today.");
        return;
      }

      const attendanceData = {
        userId: userId,
        date: getTodayDate(),
        checkIn: getCurrentTime(),
        checkOut: "",
        status: "Present",
      };

      const response = await fetch(
        "http://localhost:5000/api/attendance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(attendanceData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to check in");
      }

      setAttendance(data);
      setMessage("Check In successful! Attendance saved to MongoDB.");

      await loadAttendance(userId);
    } catch (error) {
      console.error("Check In error:", error);
      setMessage(error.message);
    }
  };

  const handleCheckOut = async () => {
    try {
      setMessage("");

      if (!attendance) {
        setMessage("Please check in first.");
        return;
      }

      if (attendance.checkOut) {
        setMessage("You have already checked out today.");
        return;
      }

      const updatedData = {
        checkOut: getCurrentTime(),
        status: "Present",
      };

      const response = await fetch(
        `http://localhost:5000/api/attendance/${attendance._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to check out");
      }

      setAttendance(data);
      setMessage("Check Out successful! Attendance updated in MongoDB.");

      await loadAttendance(userId);
    } catch (error) {
      console.error("Check Out error:", error);
      setMessage(error.message);
    }
  };

  const presentDays = allAttendance.filter(
    (record) => record.status === "Present"
  ).length;

  const absentDays = allAttendance.filter(
    (record) => record.status === "Absent"
  ).length;

  const totalDays = presentDays + absentDays;

  const attendancePercentage =
    totalDays > 0
      ? Math.round((presentDays / totalDays) * 100)
      : 0;

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-[#64748B]">
          Loading attendance...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#172033]">
          Attendance
        </h1>

        <p className="text-sm text-[#64748B] mt-1">
          Track your internship attendance and check-in status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative overflow-hidden bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#DC2626]" />

          <p className="text-xs text-[#64748B]">Attendance</p>

          <h2 className="text-3xl font-bold text-[#2563EB] mt-2">
            {attendancePercentage}%
          </h2>

          <div className="mt-4 h-2 bg-[#F3F6FB] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#EF4444]"
              style={{ width: `${attendancePercentage}%` }}
            />
          </div>
        </div>

        <div className="relative overflow-hidden bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#DC2626]" />

          <p className="text-xs text-[#64748B]">Present Days</p>

          <h2 className="text-3xl font-bold text-[#2563EB] mt-2">
            {presentDays}
          </h2>
        </div>

        <div className="relative overflow-hidden bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#DC2626]" />

          <p className="text-xs text-[#64748B]">Absent Days</p>

          <h2 className="text-3xl font-bold text-[#DC2626] mt-2">
            {absentDays}
          </h2>
        </div>
      </div>

      <div className="relative overflow-hidden bg-white border border-[#E2E8F0] rounded-xl p-5 md:p-6 shadow-sm max-w-3xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#DC2626]" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="font-semibold text-lg text-[#172033]">
              Today's Attendance
            </h2>

            <p className="text-sm text-[#64748B] mt-1">
              Mark your attendance for today.
            </p>
          </div>

          <span
            className={`w-fit text-xs font-medium px-3 py-1.5 rounded-full ${
              attendance?.checkOut
                ? "bg-emerald-50 text-emerald-600"
                : attendance?.checkIn
                ? "bg-[#E0F7FA] text-[#0891B2]"
                : "bg-orange-50 text-[#F59E0B]"
            }`}
          >
            {attendance?.checkOut
              ? "Completed"
              : attendance?.checkIn
              ? "Checked In"
              : "Not Checked In"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-[#F3F6FB] rounded-lg p-4">
            <p className="text-xs text-[#64748B]">Check In</p>

            <p className="text-lg font-semibold text-[#172033] mt-1">
              {attendance?.checkIn || "--"}
            </p>
          </div>

          <div className="bg-[#F3F6FB] rounded-lg p-4">
            <p className="text-xs text-[#64748B]">Check Out</p>

            <p className="text-lg font-semibold text-[#172033] mt-1">
              {attendance?.checkOut || "--"}
            </p>
          </div>
        </div>

        {message && (
          <div className="mb-4 bg-[#EAF4FF] text-[#2563EB] border border-blue-100 rounded-xl px-4 py-3 text-sm">
            {message}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCheckIn}
            disabled={!!attendance?.checkIn || !userId}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition ${
              attendance?.checkIn || !userId
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
            }`}
          >
            Check In
          </button>

          <button
            onClick={handleCheckOut}
            disabled={
              !attendance?.checkIn ||
              !!attendance?.checkOut
            }
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition ${
              !attendance?.checkIn || attendance?.checkOut
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#0E2A52] text-white hover:bg-[#0B2345]"
            }`}
          >
            Check Out
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden bg-white border border-[#E2E8F0] rounded-xl p-5 md:p-6 shadow-sm max-w-3xl mt-6">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#DC2626]" />

        <h2 className="font-semibold text-lg text-[#172033] mb-4">
          Attendance Information
        </h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[#64748B]">
              Total Working Days
            </span>

            <span className="font-medium text-[#172033]">
              {totalDays}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#64748B]">Present</span>

            <span className="font-medium text-[#2563EB]">
              {presentDays}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#64748B]">Absent</span>

            <span className="font-medium text-[#DC2626]">
              {absentDays}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attendance;