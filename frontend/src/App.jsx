
import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import SignInPage from "./pages/super-admin/SignInPage";
import { ProtectedRoute } from "./router/ProtectedRoute";

// ============================================================
// PROGRAM MANAGER
// ============================================================

import ProgramManagerLayout from "./layouts/ProgramManagerLayout";

import ProgramManagerDashboard from "./pages/programManager/ProgramManagerDashboard";
import Cohorts from "./pages/programManager/Cohorts";
import Reports from "./pages/programManager/Reports";
import Announcements from "./pages/programManager/Announcements";
import Notifications from "./pages/programManager/Notifications";
import Profile from "./pages/programManager/Profile";
import Logout from "./pages/programManager/Logout";
import Mentors from "./pages/programManager/Mentors";

// ============================================================
// PROJECT MANAGER
// ============================================================

import ProjectManagerLayout from "./layouts/projectManager/ProjectManagerLayout";

import ProjectManagerDashboard from "./pages/projectManager/ProjectManagerDashboard";
import TeamManagement from "./pages/projectManager/TeamManagement";
import ProjectsTasks from "./pages/projectManager/ProjectsTasks";
import ScrumReview from "./pages/projectManager/ScrumReview";
import ProjectManagerNotifications from "./pages/projectManager/ProjectManagerNotifications";
import ProjectManagerProfile from "./pages/projectManager/ProjectManagerProfile";
import ProjectManagerLogout from "./pages/projectManager/Logout";

// ============================================================
// SUPER ADMIN
// ============================================================

import SuperAdminLayout from "./pages/super-admin/SuperAdminLayout";

import SuperAdminDashboardPage from "./pages/super-admin/SuperAdminDashboardPage";
import UsersPage from "./pages/super-admin/UsersPage";
import ProgramsPage from "./pages/super-admin/ProgramsPage";
import AuditPage from "./pages/super-admin/AuditPage";
import NotificationsPage from "./pages/super-admin/NotificationsPage";
import SettingsPage from "./pages/super-admin/SettingsPage";
import ProfilePage from "./pages/super-admin/ProfilePage";

// ============================================================
// APP
// ============================================================

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ======================================================
            DEFAULT
        ====================================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/sign-in"
              replace
            />
          }
        />

        {/* Sign In */}

        <Route
          path="/sign-in"
          element={<SignInPage />}
        />

        {/* ======================================================
            SUPER ADMIN
        ====================================================== */}

        <Route
          path="/super-admin"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
              <SuperAdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SuperAdminDashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="programs" element={<ProgramsPage />} />
          <Route path="audit" element={<AuditPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* ======================================================
            PROGRAM MANAGER
        ====================================================== */}

        {/* Dashboard */}

        <Route
          path="/program-manager/dashboard"
          element={
            <ProgramManagerLayout>
              <ProgramManagerDashboard />
            </ProgramManagerLayout>
          }
        />

        {/* Cohorts */}

        <Route
          path="/program-manager/cohorts"
          element={
            <ProgramManagerLayout>
              <Cohorts />
            </ProgramManagerLayout>
          }
        />

        {/* Mentors */}

        <Route
          path="/program-manager/mentors"
          element={
            <ProgramManagerLayout>
              <Mentors />
            </ProgramManagerLayout>
          }
        />

        {/* Reports */}

        <Route
          path="/program-manager/reports"
          element={
            <ProgramManagerLayout>
              <Reports />
            </ProgramManagerLayout>
          }
        />

        {/* Announcements */}

        <Route
          path="/program-manager/announcements"
          element={
            <ProgramManagerLayout>
              <Announcements />
            </ProgramManagerLayout>
          }
        />

        {/* Notifications */}

        <Route
          path="/program-manager/notifications"
          element={
            <ProgramManagerLayout>
              <Notifications />
            </ProgramManagerLayout>
          }
        />

        {/* Profile */}

        <Route
          path="/program-manager/profile"
          element={
            <ProgramManagerLayout>
              <Profile />
            </ProgramManagerLayout>
          }
        />

        {/* Program Manager Logout Confirmation */}

        <Route
          path="/program-manager/logout"
          element={<Logout />}
        />

        {/* Program Manager Logged Out */}

        <Route
          path="/program-manager/logged-out"
          element={
            <div className="flex min-h-screen items-center justify-center bg-[#F3F6FB] px-4 py-8">
              <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
                <div className="h-1 w-full bg-gradient-to-r from-red-500 via-blue-500 to-cyan-400" />

                <div className="p-8 text-center sm:p-10">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-green-100 bg-green-50">
                    <span className="text-3xl font-bold text-green-500">
                      ✓
                    </span>
                  </div>

                  <h1 className="mt-5 text-2xl font-black text-[#172033]">
                    Successfully Logged Out
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    You have been securely logged out from
                    the Program Manager module.
                  </p>

                </div>
              </div>
            </div>
          }
        />

        {/* ======================================================
            PROJECT MANAGER
        ====================================================== */}

        <Route
          path="/project-manager"
          element={<ProjectManagerLayout />}
        >

          {/* Dashboard */}

          <Route
            index
            element={<ProjectManagerDashboard />}
          />

          {/* Team Management */}

          <Route
            path="team"
            element={<TeamManagement />}
          />

          {/* Projects & Tasks */}

          <Route
            path="projects-tasks"
            element={<ProjectsTasks />}
          />

          {/* Scrum Review */}

          <Route
            path="scrum-review"
            element={<ScrumReview />}
          />

          {/* Notifications */}

          <Route
            path="notifications"
            element={
              <ProjectManagerNotifications />
            }
          />

          {/* Profile */}

          <Route
            path="profile"
            element={
              <ProjectManagerProfile />
            }
          />

        </Route>

        {/* ======================================================
            PROJECT MANAGER LOGOUT CONFIRMATION
        ====================================================== */}

        <Route
          path="/project-manager/logout"
          element={<ProjectManagerLogout />}
        />

        {/* Project Manager Logged Out */}

        <Route
          path="/project-manager/logged-out"
          element={
            <div className="flex min-h-screen items-center justify-center bg-[#071426] px-4 py-8">
              <div className="w-full max-w-md rounded-2xl bg-gradient-to-r from-red-500 via-blue-500 to-cyan-400 p-[1px] shadow-2xl">
                <div className="rounded-2xl bg-[#111418] p-8 text-center sm:p-10">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10">
                    <span className="text-3xl font-bold text-green-400">
                      ✓
                    </span>
                  </div>

                  <h1 className="mt-5 text-2xl font-bold text-white">
                    Successfully Logged Out
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    You have been securely logged out from
                    the Project Manager module.
                  </p>

                </div>
              </div>
            </div>
          }
        />

        {/* ======================================================
            WRONG URL
        ====================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/sign-in"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

