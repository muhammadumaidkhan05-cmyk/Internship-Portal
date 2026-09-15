import React from "react";

import {
  LayoutDashboard,
  ClipboardCheck,
  CalendarCheck,
  FolderKanban,
  Upload,
  Award,
  Bell,
  Menu,
  X,
  Search,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

// Pages
import Dashboard from "./pages/Dashboard";
import DailyScrum from "./pages/DailyScrum";
import Attendance from "./pages/Attendance";
import MyProjects from "./pages/MyProjects";
import Submissions from "./pages/Submissions";
import Certificates from "./pages/Certificates";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

// Authentication Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Auth Utility
import { getCurrentUser } from "./utils/auth";

// ===============================
// SIDEBAR MENU
// ===============================

const menuItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Daily Scrum",
    path: "/daily-scrum",
    icon: ClipboardCheck,
  },
  {
    name: "Attendance",
    path: "/attendance",
    icon: CalendarCheck,
  },
  {
    name: "My Projects",
    path: "/my-projects",
    icon: FolderKanban,
  },
  {
    name: "Submissions",
    path: "/submissions",
    icon: Upload,
  },
  {
    name: "Certificates",
    path: "/certificates",
    icon: Award,
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
  },
];

// ===============================
// MAIN APP
// ===============================

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

// ===============================
// LOGIN / REGISTER ROUTES
// ===============================

function AppContent() {
  const location = useLocation();

  if (location.pathname === "/login") {
    return <Login />;
  }

  if (location.pathname === "/register") {
    return <Register />;
  }

  return <PortalLayout />;
}

// ===============================
// PORTAL LAYOUT
// ===============================

function PortalLayout() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const user = getCurrentUser() || {
    name: "Guest",
    role: "Not logged in",
  };

  const userId = user?._id;

  // ===============================
  // LOGOUT
  // ===============================

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    setProfileMenuOpen(false);
    setSidebarOpen(false);

    navigate("/login");
  };

  // ===============================
  // LOAD NOTIFICATIONS
  // ===============================

  React.useEffect(() => {
    if (!userId) return;

    const loadNotifications = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/notifications/user/${userId}`
        );

        const data = await response.json();

        if (response.ok && Array.isArray(data)) {
          const unread = data.filter(
            (notification) => notification.unread === true
          ).length;

          setUnreadCount(unread);
        } else {
          setUnreadCount(0);
        }
      } catch (error) {
        console.error("Notification count error:", error);
        setUnreadCount(0);
      }
    };

    loadNotifications();
  }, [userId]);

  // ===============================
  // SEARCH FUNCTION
  // ===============================

  const handleSearch = (event) => {
    if (event.key !== "Enter") return;

    const query = searchQuery.trim().toLowerCase();

    if (!query) return;

    const matchedPage = menuItems.find((item) =>
      item.name.toLowerCase().includes(query)
    );

    if (matchedPage) {
      navigate(matchedPage.path);
      setSearchQuery("");
    } else {
      alert("Page not found. Please search Dashboard, Profile, Attendance, etc.");
    }
  };

  const initial = user.name?.charAt(0).toUpperCase() || "G";

  return (
    <div className="min-h-screen flex bg-[#071426] text-white">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* ===============================
          SIDEBAR
      =============================== */}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[270px]
        flex flex-col text-white overflow-hidden
        transform transition-transform duration-300
        bg-gradient-to-b from-[#0b1d35]/95 via-[#081426]/95 to-[#050d1a]/95
        backdrop-blur-2xl border-r border-white/10
        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >

        {/* Sidebar Glow Effects */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 -right-20 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />

        <div className="absolute top-0 right-0 w-[3px] h-full bg-gradient-to-b from-cyan-400 via-blue-500 to-red-500" />

        {/* Logo */}
        <div className="relative px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-red-500 flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-500/20">
              M
            </div>

            <div>
              <h1 className="font-bold text-lg tracking-wide">
                MSN Academy
              </h1>

              <p className="text-xs text-white/50 mt-0.5">
                Internship Portal
              </p>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto lg:hidden text-white/70 hover:text-white"
            >
              <X size={20} />
            </button>

          </div>
        </div>

        {/* Navigation */}
        <div className="relative px-4 py-6 flex-1 overflow-y-auto">

          <p className="text-[10px] font-semibold tracking-[0.18em] text-cyan-300/60 px-3 mb-4">
            INTERNSHIP PORTAL
          </p>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <SidebarLink
                key={item.path}
                item={item}
                onClick={() => setSidebarOpen(false)}
                unreadCount={unreadCount}
              />
            ))}
          </nav>

        </div>

        {/* Logout */}
        <div className="relative p-4 border-t border-white/10">

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
            text-sm text-red-300
            border border-red-400/10
            hover:bg-red-500/10 hover:text-red-200
            transition-all duration-300"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>
      </aside>

      {/* ===============================
          MAIN CONTENT
      =============================== */}

      <div className="flex-1 min-w-0">

        {/* Header */}
        <header
          className="h-[82px] px-4 md:px-6 lg:px-8
          flex items-center justify-between
          bg-[#0a1b31]/90 backdrop-blur-xl
          text-white border-b border-white/10 relative"
        >

          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-500 via-cyan-400 to-blue-500" />

          {/* Header Title */}
          <div className="flex items-center gap-4">

            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="text-[10px] tracking-[0.2em] text-cyan-300 font-semibold">
                MSN ACADEMY
              </p>

              <h1 className="text-lg md:text-xl font-bold">
                Internship Portal
              </h1>
            </div>

          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">

            {/* Functional Search */}
            <div
              className="hidden md:flex items-center
              bg-white/[0.06] border border-white/10
              rounded-xl px-3 py-2
              focus-within:border-cyan-400/60
              focus-within:bg-white/[0.09]
              transition-all"
            >
              <Search size={16} className="text-cyan-300/70" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search pages..."
                className="bg-transparent outline-none text-sm px-2
                w-32 lg:w-48 text-white
                placeholder:text-white/40"
              />
            </div>

            {/* Notifications */}
            <Link
              to="/notifications"
              className="relative w-10 h-10 rounded-xl
              bg-white/[0.06] border border-white/10
              flex items-center justify-center
              hover:bg-cyan-400/10 hover:border-cyan-400/30
              transition-all"
            >
              <Bell size={18} />

              {unreadCount > 0 && (
                <span
                  className="absolute -top-1 -right-1
                  min-w-[18px] h-[18px] px-1
                  bg-red-500 rounded-full
                  text-[9px] font-bold
                  flex items-center justify-center"
                >
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Profile Menu */}
            <div className="hidden sm:block relative">

              <button
                onClick={() => setProfileMenuOpen((open) => !open)}
                className="flex items-center gap-2 ml-1 cursor-pointer group"
              >

                <div
                  className="w-9 h-9 rounded-full
                  bg-gradient-to-br from-cyan-400 via-blue-500 to-red-500
                  flex items-center justify-center
                  text-sm font-bold"
                >
                  {initial}
                </div>

                <div className="hidden md:block text-left">
                  <p className="text-xs font-medium leading-tight">
                    {user.name}
                  </p>

                  <p className="text-[10px] text-white/50 leading-tight">
                    {user.role || "Intern"}
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  className={`text-white/40 group-hover:text-white transition ${
                    profileMenuOpen ? "rotate-180" : ""
                  }`}
                />

              </button>

              {/* Dropdown */}
              {profileMenuOpen && (
                <>
                  <div
                    onClick={() => setProfileMenuOpen(false)}
                    className="fixed inset-0 z-40"
                  />

                  <div
                    className="absolute right-0 top-12 w-56
                    bg-[#10243d] text-white
                    rounded-xl shadow-2xl
                    border border-white/10
                    py-2 z-50"
                  >

                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-semibold">
                        {user.name}
                      </p>

                      {user.email && (
                        <p className="text-xs text-white/50 truncate mt-1">
                          {user.email}
                        </p>
                      )}

                      <p className="text-xs text-cyan-300/70 mt-1">
                        {user.role || "Intern"}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5
                      text-sm hover:bg-white/10 transition"
                    >
                      <User size={15} />
                      My Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2
                      px-4 py-2.5 text-sm text-red-300
                      hover:bg-red-500/10 transition"
                    >
                      <LogOut size={15} />
                      Logout
                    </button>

                  </div>
                </>
              )}

            </div>
          </div>
        </header>

        {/* Page Routes */}
      <main
  className="portal-main min-h-[calc(100vh-82px)]
  p-4 md:p-6 lg:p-8
  bg-[#F3F6FB] text-[#172033]"
>
  <Routes>
    <Route path="/" element={<Dashboard />} />

    <Route
      path="/daily-scrum"
      element={<DailyScrum />}
    />

    <Route
      path="/attendance"
      element={<Attendance />}
    />

    <Route
      path="/my-projects"
      element={<MyProjects />}
    />

    <Route
      path="/submissions"
      element={<Submissions />}
    />

    <Route
      path="/certificates"
      element={<Certificates />}
    />

    <Route
      path="/notifications"
      element={<Notifications />}
    />

    <Route
      path="/profile"
      element={<Profile />}
    />
  </Routes>
</main>

      </div>
    </div>
  );
}

// ===============================
// SIDEBAR LINK
// ===============================

function SidebarLink({ item, onClick, unreadCount }) {
  const location = useLocation();

  const Icon = item.icon;
  const active = location.pathname === item.path;

  return (
    <Link
      to={item.path}
      onClick={onClick}
      className={`group flex items-center gap-3 px-3.5 py-3
      rounded-xl text-sm transition-all duration-300 border
      ${
        active
          ? "bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-red-500/20 text-white border-cyan-300/30 shadow-lg shadow-cyan-500/5"
          : "text-white/60 border-transparent hover:bg-white/[0.06] hover:text-white hover:border-white/10"
      }`}
    >

      <Icon
        size={18}
        className={
          active
            ? "text-cyan-300"
            : "text-white/50 group-hover:text-cyan-300"
        }
      />

      <span>{item.name}</span>

      {item.name === "Notifications" && unreadCount > 0 && (
        <span
          className="ml-auto bg-red-500 text-white
          text-[9px] font-bold min-w-[18px] h-[18px]
          px-1 rounded-full flex items-center justify-center"
        >
          {unreadCount}
        </span>
      )}
    </Link>
  );
}

export default App;