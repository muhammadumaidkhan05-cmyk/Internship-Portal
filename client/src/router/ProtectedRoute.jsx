import { Navigate, Outlet, useLocation } from "react-router-dom";

import { getStoredRole, getToken, homeForStoredRole } from "../lib/session";
import { normalizeRole } from "../lib/roles";

// ============================================================
// PROTECTED ROUTE
// The single guard used by every module.
//
//   no token            -> /login
//   wrong role for path -> that role's own dashboard
//   correct role        -> render
//
// Because a mismatched role is bounced to its own home rather
// than to /login, typing another role's URL can never expose
// that role's pages.
// ============================================================

export function ProtectedRoute({ allowedRoles, children }) {
  const location = useLocation();

  const token = getToken();
  const role = getStoredRole();

  if (!token || !role) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const allowed = (allowedRoles || [])
    .map((value) => normalizeRole(value))
    .filter(Boolean);

  if (allowed.length > 0 && !allowed.includes(role)) {
    return <Navigate to={homeForStoredRole()} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

/**
 * Used on /login and /register: a signed-in user should never
 * see the auth screens again.
 */
export function PublicOnlyRoute({ children }) {
  if (getToken() && getStoredRole()) {
    return <Navigate to={homeForStoredRole()} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

/** Sends "/" to whichever dashboard the signed-in role owns. */
export function HomeRedirect() {
  if (!getToken() || !getStoredRole()) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={homeForStoredRole()} replace />;
}

export default ProtectedRoute;
