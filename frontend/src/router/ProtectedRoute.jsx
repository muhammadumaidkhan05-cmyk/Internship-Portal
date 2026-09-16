import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser, getStoredRole } from "../api/useAuth";

/**
 * ProtectedRoute
 * Guards a route by requiring a valid authenticated role.
 *
 * @param {string[]} allowedRoles - Roles allowed to access this route.
 * @param {React.ReactNode} children - Optional children (for wrapping pattern).
 *                                     If omitted, renders <Outlet /> (for nested routes).
 */
export function ProtectedRoute({ allowedRoles, children }) {
  const { data: user, isLoading } = useCurrentUser();
  const storedRole = getStoredRole();

  // Show a loading state only if we have no cached role yet
  if (isLoading && !storedRole) {
    return (
      <div
        style={{
          display: "grid",
          minHeight: "100vh",
          placeItems: "center",
          background: "#0F172A",
          fontSize: "0.875rem",
          color: "rgba(255,255,255,0.4)",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Checking access...
      </div>
    );
  }

  const effectiveRole = user?.role || storedRole;

  // No role → redirect to sign-in
  if (!effectiveRole) {
    return <Navigate to="/sign-in" replace />;
  }

  // Has a role but not the required one → redirect to their correct home
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(effectiveRole)) {
    if (effectiveRole === "super_admin") {
      return <Navigate to="/super-admin" replace />;
    }
    if (effectiveRole === "program-manager" || effectiveRole === "program_manager") {
      return <Navigate to="/program-manager/dashboard" replace />;
    }
    if (effectiveRole === "project-manager" || effectiveRole === "project_manager") {
      return <Navigate to="/project-manager" replace />;
    }
    return <Navigate to="/sign-in" replace />;
  }

  // Authorized — render children or outlet
  return children ? <>{children}</> : <Outlet />;
}
