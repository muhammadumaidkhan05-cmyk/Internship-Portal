import { useEffect, useState } from "react";
import { getCurrentUser } from "../utils/auth";

function Dashboard() {
  const user = getCurrentUser();
  const userId = user?._id;

  const [attendance, setAttendance] = useState([]);
  const [projects, setProjects] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [dailyScrums, setDailyScrums] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setError("You're not logged in. Please log in to view your dashboard.");
      setLoading(false);
      return;
    }

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          attendanceRes,
          projectsRes,
          submissionsRes,
          certificatesRes,
          notificationsRes,
          dailyScrumsRes,
        ] = await Promise.all([
          fetch(`http://localhost:5000/api/attendance/user/${userId}`),
          fetch(`http://localhost:5000/api/projects/user/${userId}`),
          fetch(`http://localhost:5000/api/submissions/user/${userId}`),
          fetch(`http://localhost:5000/api/certificates/user/${userId}`),
          fetch(`http://localhost:5000/api/notifications/user/${userId}`),
          fetch(`http://localhost:5000/api/daily-scrums/user/${userId}`),
        ]);

        const attendanceData = await attendanceRes.json();
        const projectsData = await projectsRes.json();
        const submissionsData = await submissionsRes.json();
        const certificatesData = await certificatesRes.json();
        const notificationsData = await notificationsRes.json();
        const dailyScrumsData = await dailyScrumsRes.json();

        if (!attendanceRes.ok) {
          throw new Error(attendanceData.message || "Failed to load attendance");
        }
        if (!projectsRes.ok) {
          throw new Error(projectsData.message || "Failed to load projects");
        }
        if (!submissionsRes.ok) {
          throw new Error(submissionsData.message || "Failed to load submissions");
        }
        if (!certificatesRes.ok) {
          throw new Error(certificatesData.message || "Failed to load certificates");
        }
        if (!notificationsRes.ok) {
          throw new Error(notificationsData.message || "Failed to load notifications");
        }
        if (!dailyScrumsRes.ok) {
          throw new Error(dailyScrumsData.message || "Failed to load daily scrums");
        }

        setAttendance(Array.isArray(attendanceData) ? attendanceData : []);
        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setSubmissions(Array.isArray(submissionsData) ? submissionsData : []);
        setCertificates(Array.isArray(certificatesData) ? certificatesData : []);
        setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
        setDailyScrums(Array.isArray(dailyScrumsData) ? dailyScrumsData : []);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [userId]);

  const presentDays = attendance.filter((item) => item.status === "Present").length;
  const absentDays = attendance.filter((item) => item.status === "Absent").length;
  const totalAttendance = presentDays + absentDays;

  const attendancePercentage =
    totalAttendance > 0 ? Math.round((presentDays / totalAttendance) * 100) : 0;

  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const pendingSubmissions = submissions.filter(
    (submission) => submission.status === "Pending"
  ).length;

  const approvedSubmissions = submissions.filter(
    (submission) => submission.status === "Approved"
  ).length;

  const unreadNotifications = notifications.filter(
    (notification) => notification.unread === true
  ).length;

  const projectProgress =
    projects.length > 0
      ? Math.round(
          projects.reduce((total, project) => total + Number(project.progress || 0), 0) /
            projects.length
        )
      : 0;

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-[#64748B]">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-7">
        <p className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
          Internship Dashboard
        </p>

        <h1 className="text-2xl md:text-3xl font-bold text-[#172033] mt-1">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}! 
        </h1>

        <p className="text-sm text-[#64748B] mt-1">
          Here is an overview of your internship progress.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-[#DC2626] rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="group relative overflow-hidden bg-white border border-[#E2E8F0] rounded-2xl p-6 md:p-7 shadow-sm mb-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#DC2626]" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <p className="text-xs font-semibold tracking-wider text-[#DC2626] uppercase">
              Internship Program
            </p>

            <h2 className="text-xl md:text-2xl font-bold text-[#172033] mt-2">
              Your Internship Progress
            </h2>

            <p className="text-sm text-[#64748B] max-w-2xl mt-2 leading-6">
              Keep track of your attendance, daily scrum updates, projects, submissions and overall internship activities.
            </p>
          </div>

          <div className="shrink-0 bg-[#F3F6FB] border border-[#E2E8F0] rounded-xl p-4 min-w-[190px]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0891B2] animate-pulse" />
              <span className="text-xs font-medium text-[#64748B]">Internship Status</span>
            </div>

            <p className="text-lg font-bold text-[#172033] mt-2">In Progress</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard title="Attendance" value={`${attendancePercentage}%`} description="Current attendance" color="#2563EB" />
        <StatCard title="Projects" value={projects.length} description={`${completedProjects} completed`} color="#8B5CF6" />
        <StatCard title="Submissions" value={submissions.length} description={`${pendingSubmissions} pending review`} color="#F59E0B" />
        <StatCard title="Certificates" value={certificates.length} description="Certificates earned" color="#0891B2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="group relative overflow-hidden bg-white border border-[#E2E8F0] rounded-2xl p-5 md:p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#DC2626]" />
          <h2 className="font-bold text-[#172033] text-lg">Internship Overview</h2>
          <div className="mt-5 space-y-4 text-sm">
            <SummaryRow label="Present Days" value={presentDays} />
            <SummaryRow label="Absent Days" value={absentDays} />
            <SummaryRow label="Daily Scrums" value={dailyScrums.length} />
            <SummaryRow label="Notifications" value={notifications.length} />
            <SummaryRow label="Unread Notifications" value={unreadNotifications} />
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white border border-[#E2E8F0] rounded-2xl p-5 md:p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#DC2626]" />
          <h2 className="font-bold text-[#172033] text-lg">Quick Summary</h2>
          <div className="mt-5 space-y-4">
            <SummaryRow label="Total Projects" value={projects.length} />
            <SummaryRow label="Completed Projects" value={completedProjects} valueColor="#0891B2" />
            <SummaryRow label="Total Submissions" value={submissions.length} />
            <SummaryRow label="Approved Submissions" value={approvedSubmissions} valueColor="#0891B2" />
            <SummaryRow label="Certificates" value={certificates.length} />
          </div>
        </div>
      </div>

      <div className="group relative overflow-hidden bg-white border border-[#E2E8F0] rounded-2xl p-5 md:p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#DC2626]" />
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-[#172033] text-lg">Overall Progress</h2>
            <p className="text-xs text-[#64748B] mt-1">Average project progress</p>
          </div>
          <span className="text-xl font-bold text-[#2563EB]">{projectProgress}%</span>
        </div>

        <div className="mt-5 h-3 bg-[#F3F6FB] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#EF4444] transition-all duration-700"
            style={{ width: `${projectProgress}%` }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          <ProgressBox title="Projects" value={projects.length} />
          <ProgressBox title="Completed" value={completedProjects} />
          <ProgressBox title="Certificates" value={certificates.length} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, description, color }) {
  return (
    <div className="group relative overflow-hidden bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300">
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
        style={{ background: `linear-gradient(90deg, #2563EB, ${color}, #DC2626)` }}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${color}08, transparent 60%)` }}
      />
      <p className="relative text-sm text-[#64748B]">{title}</p>
      <h2 className="relative text-3xl font-bold mt-2" style={{ color }}>{value}</h2>
      <p className="relative text-xs text-[#64748B] mt-2">{description}</p>
    </div>
  );
}

function SummaryRow({ label, value, valueColor = "#172033" }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#64748B]">{label}</span>
      <span className="font-semibold" style={{ color: valueColor }}>{value}</span>
    </div>
  );
}

function ProgressBox({ title, value }) {
  return (
    <div className="bg-[#F3F6FB] rounded-xl p-4 border border-transparent hover:border-[#22D3EE] transition-all duration-300">
      <p className="text-xs text-[#64748B]">{title}</p>
      <p className="text-xl font-bold text-[#172033] mt-1">{value}</p>
    </div>
  );
}

export default Dashboard;