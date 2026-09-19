const API_BASE_URL = import.meta.env.VITE_SUPER_ADMIN_API_URL || "/api/super-admin";

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const toastListeners = new Set();

export const subscribeToast = (listener) => {
  toastListeners.add(listener);
  return () => toastListeners.delete(listener);
};

export const showToast = (message, type = "error") => {
  toastListeners.forEach((l) => l(message, type));
};

function getCsrfToken() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)msn_csrf_token=([^;]*)/);
  return match && match[1] ? decodeURIComponent(match[1]) : null;
}

export async function apiClient(endpoint, options = {}) {
  const url = endpoint.startsWith("http") || endpoint.startsWith("/api")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers = new Headers(options.headers || {});

  // Add default JSON content-type if body is provided and not FormData
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  // Attach token from localStorage if present (for Bearer fallback)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("msn_token");
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  // Attach CSRF token
  const csrfToken = getCsrfToken();
  if (csrfToken && !headers.has("x-csrf-token")) {
    headers.set("x-csrf-token", csrfToken);
  }
  headers.set("X-Requested-With", "XMLHttpRequest");

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // Essential for httpOnly cookies
    });

    // Handle 401 Unauthorized
    if (response.status === 401) {
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/sign-in")
      ) {
        localStorage.removeItem("msn_token");
        localStorage.removeItem("msn_user");
        window.location.href = "/sign-in";
      }
      const errData = await response.json().catch(() => ({}));
      throw new ApiError(errData.error || "Unauthorized", 401, errData);
    }

    // Handle 403 Forbidden
    if (response.status === 403) {
      const errData = await response.json().catch(() => ({}));
      showToast(errData.error || "Permission denied for this action", "error");
      throw new ApiError(errData.error || "Forbidden", 403, errData);
    }

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new ApiError(
        data.message || data.error || "An error occurred",
        response.status,
        data,
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    const message = error instanceof Error ? error.message : "Network error";
    showToast(message, "error");
    throw new ApiError(message, 500);
  }
}
