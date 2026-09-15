import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import EmailSent from "./pages/EmailSent";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/email-sent" element={<EmailSent />} />
        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        {/* Intern Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={["intern"]} />}>
          <Route
            path="/internship-dashboard"
            element={<div>Internship Dashboard</div>}
          />
        </Route>

        {/* Project Manager Dashboard */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["project_manager"]} />
          }
        >
          <Route
            path="/project-manager-dashboard"
            element={<div>Project Manager Dashboard</div>}
          />
        </Route>

        {/* Mentor Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={["mentor"]} />}>
          <Route
            path="/mentor-dashboard"
            element={<div>Mentor Dashboard</div>}
          />
        </Route>

        {/* Program Manager Dashboard */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["program_manager"]} />
          }
        >
          <Route
            path="/program-manager-dashboard"
            element={<div>Program Manager Dashboard</div>}
          />
        </Route>

        {/* Super Admin Dashboard */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["super_admin"]} />
          }
        >
          <Route
            path="/super-admin-dashboard"
            element={<div>Super Admin Dashboard</div>}
          />
        </Route>

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;