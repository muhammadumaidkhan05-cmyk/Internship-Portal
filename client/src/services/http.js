import { getToken, clearSession } from "../lib/session";

// ============================================================
// HTTP CLIENT
// A single fetch wrapper for every module. It attaches the JWT
// from the unified session, normalises the two response shapes
// the branches used ({ success, data } and bare arrays) and
// signs the user out on a 401.
// ============================================================

const API_ROOT = import.meta.env.VITE_API_URL || "/api";

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function buildUrl(endpoint) {
  if (/^https?:\/\//i.test(endpoint)) return endpoint;
  if (endpoint.startsWith("/api")) return endpoint;

  return `${API_ROOT}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
}

export async function request(endpoint, options = {}) {
  const { method = "GET", body, headers: extraHeaders, ...rest } = options;

  const headers = new Headers(extraHeaders || {});

  if (body !== undefined && !(body instanceof FormData)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  const token = getToken();

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response;

  try {
    response = await fetch(buildUrl(endpoint), {
      method,
      headers,
      credentials: "include",
      body:
        body === undefined || body instanceof FormData
          ? body
          : JSON.stringify(body),
      ...rest,
    });
  } catch (networkError) {
    throw new ApiError(
      "Unable to reach the server. Please check your connection.",
      0
    );
  }

  const payload = await response.json().catch(() => ({}));

  if (response.status === 401) {
    clearSession();

    if (
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/login")
    ) {
      window.location.href = "/login";
    }

    throw new ApiError(payload.message || "Your session has expired.", 401, payload);
  }

  if (!response.ok || payload.success === false) {
    throw new ApiError(
      payload.message || payload.error || "Something went wrong.",
      response.status,
      payload
    );
  }

  return payload;
}

/** Unwrap `{ success, data }` responses; pass anything else through. */
export function unwrap(payload, fallback = null) {
  if (payload && Object.prototype.hasOwnProperty.call(payload, "data")) {
    return payload.data ?? fallback;
  }

  return payload ?? fallback;
}

export const http = {
  get: (endpoint, options) => request(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options) =>
    request(endpoint, { ...options, method: "POST", body }),
  put: (endpoint, body, options) =>
    request(endpoint, { ...options, method: "PUT", body }),
  patch: (endpoint, body, options) =>
    request(endpoint, { ...options, method: "PATCH", body }),
  delete: (endpoint, options) =>
    request(endpoint, { ...options, method: "DELETE" }),
};

export default http;
