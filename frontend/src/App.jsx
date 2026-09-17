
import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { ProtectedRoute } from "./router/ProtectedRoute";
import SignInPage from "./pages/super-admin/SignInPage";

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
import ProgramManagerLoggedOutPage from "./pages/programManager/LoggedOutPage";

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
import ProjectManagerLoggedOutPage from "./pages/projectManager/LoggedOutPage";

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
            <ProtectedRoute allowedRoles={["program-manager", "program_manager"]}>
              <ProgramManagerLayout>
                <ProgramManagerDashboard />
              </ProgramManagerLayout>
            </ProtectedRoute>
          }
        />

        {/* Cohorts */}

        <Route
          path="/program-manager/cohorts"
          element={
            <ProtectedRoute allowedRoles={["program-manager", "program_manager"]}>
              <ProgramManagerLayout>
                <Cohorts />
              </ProgramManagerLayout>
            </ProtectedRoute>
          }
        />

        {/* Mentors */}

        <Route
          path="/program-manager/mentors"
          element={
            <ProtectedRoute allowedRoles={["program-manager", "program_manager"]}>
              <ProgramManagerLayout>
                <Mentors />
              </ProgramManagerLayout>
            </ProtectedRoute>
          }
        />

        {/* Reports */}

        <Route
          path="/program-manager/reports"
          element={
            <ProtectedRoute allowedRoles={["program-manager", "program_manager"]}>
              <ProgramManagerLayout>
                <Reports />
              </ProgramManagerLayout>
            </ProtectedRoute>
          }
        />

        {/* Announcements */}

        <Route
          path="/program-manager/announcements"
          element={
            <ProtectedRoute allowedRoles={["program-manager", "program_manager"]}>
              <ProgramManagerLayout>
                <Announcements />
              </ProgramManagerLayout>
            </ProtectedRoute>
          }
        />

        {/* Notifications */}

        <Route
          path="/program-manager/notifications"
          element={
            <ProtectedRoute allowedRoles={["program-manager", "program_manager"]}>
              <ProgramManagerLayout>
                <Notifications />
              </ProgramManagerLayout>
            </ProtectedRoute>
          }
        />

        {/* Profile */}

        <Route
          path="/program-manager/profile"
          element={
            <ProtectedRoute allowedRoles={["program-manager", "program_manager"]}>
              <ProgramManagerLayout>
                <Profile />
              </ProgramManagerLayout>
            </ProtectedRoute>
          }
        />

        {/* Program Manager Logout Confirmation */}

        <Route
          path="/program-manager/logout"
          element={<Logout />}
        />

        {/* Program Manager Logged Out — extracted to LoggedOutPage component */}

        <Route
          path="/program-manager/logged-out"
          element={<ProgramManagerLoggedOutPage />}
        />

        {/* ======================================================
            PROJECT MANAGER
        ====================================================== */}

        <Route
          path="/project-manager"
          element={
            <ProtectedRoute allowedRoles={["project-manager", "project_manager"]}>
              <ProjectManagerLayout />
            </ProtectedRoute>
          }
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

        {/* Project Manager Logged Out — extracted to LoggedOutPage component */}

        <Route
          path="/project-manager/logged-out"
          element={<ProjectManagerLoggedOutPage />}
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

