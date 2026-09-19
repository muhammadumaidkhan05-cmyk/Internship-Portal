import { ROLE_HOME, normalizeRole } from "./roles";

// ============================================================
// SESSION STORE
// The five branches each picked different localStorage keys for
// the same token and user. Writing every key on sign-in is what
// lets the Program Manager, Project Manager, Mentor, Intern and
// Super Admin pages keep working unmodified against one session.
//
//   token / msn_token          -> JWT
//   user  / msn_user           -> serialised user
//   role  / msn_active_role    -> canonical role string
//   userId                     -> user id
// ============================================================

const TOKEN_KEYS = ["token", "msn_token", "authToken", "accessToken"];
const USER_KEYS = ["user", "msn_user"];
const ROLE_KEYS = ["role", "msn_active_role"];
const ID_KEYS = ["userId"];

const ALL_KEYS = [...TOKEN_KEYS, ...USER_KEYS, ...ROLE_KEYS, ...ID_KEYS];

const isBrowser = () => typeof window !== "undefined";

/** Normalise the various user payload shapes into one object. */
function normalizeUser(user) {
  if (!user) return null;

  const id = user._id || user.id || null;

  return {
    ...user,
    _id: id,
    id,
    role: normalizeRole(user.role) || user.role || null,
  };
}

export function setSession({ token, user }) {
  if (!isBrowser()) return null;

  const normalised = normalizeUser(user);

  if (token) {
    TOKEN_KEYS.forEach((key) => localStorage.setItem(key, token));
  }

  if (normalised) {
    const serialised = JSON.stringify(normalised);

    USER_KEYS.forEach((key) => localStorage.setItem(key, serialised));

    if (normalised.role) {
      ROLE_KEYS.forEach((key) => localStorage.setItem(key, normalised.role));
    }

    if (normalised._id) {
      ID_KEYS.forEach((key) => localStorage.setItem(key, String(normalised._id)));
    }
  }

  return normalised;
}

export function clearSession() {
  if (!isBrowser()) return;

  ALL_KEYS.forEach((key) => localStorage.removeItem(key));
}

export function getToken() {
  if (!isBrowser()) return null;

  for (const key of TOKEN_KEYS) {
    const value = localStorage.getItem(key);
    if (value) return value;
  }

  return null;
}

export function getStoredUser() {
  if (!isBrowser()) return null;

  for (const key of USER_KEYS) {
    const raw = localStorage.getItem(key);

    if (!raw) continue;

    try {
      return normalizeUser(JSON.parse(raw));
    } catch {
      // Corrupt entry - fall through to the next key.
    }
  }

  return null;
}

export function getStoredRole() {
  const user = getStoredUser();

  if (user?.role) return user.role;

  if (!isBrowser()) return null;

  for (const key of ROLE_KEYS) {
    const value = normalizeRole(localStorage.getItem(key));
    if (value) return value;
  }

  return null;
}

export function getStoredUserId() {
  const user = getStoredUser();

  if (user?._id) return String(user._id);

  if (!isBrowser()) return null;

  return localStorage.getItem("userId");
}

export function isAuthenticated() {
  return Boolean(getToken() && getStoredRole());
}

export function homeForStoredRole() {
  return ROLE_HOME[getStoredRole()] || "/login";
}
