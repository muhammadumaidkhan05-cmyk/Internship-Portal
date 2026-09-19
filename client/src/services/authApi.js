import { http, unwrap } from "./http";
import { setSession, clearSession } from "../lib/session";
import { homeForRole } from "../lib/roles";

// ============================================================
// AUTHENTICATION API  (pages 1 - 3)
// ============================================================

export async function login({ email, password, role }) {
  const payload = await http.post("/auth/login", { email, password, role });

  const user = setSession({ token: payload.token, user: payload.user });

  return {
    user,
    token: payload.token,
    redirectTo: payload.redirectTo || homeForRole(user?.role),
  };
}

export async function register(values) {
  const payload = await http.post("/auth/register", values);

  return unwrap(payload, payload.user);
}

export async function requestPasswordReset(email) {
  return http.post("/auth/forgot-password", { email });
}

export async function resetPassword({ token, password }) {
  return http.post(`/auth/reset-password/${token}`, { password });
}

export async function fetchCurrentUser() {
  const payload = await http.get("/auth/me");

  const user = unwrap(payload);

  if (user) {
    setSession({ user });
  }

  return user;
}

export function logout() {
  clearSession();
}
