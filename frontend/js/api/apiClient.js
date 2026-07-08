// Centralized fetch wrapper. frontend/docs/05-api-integration.md Section 3.
// Every HTTP request in the app goes through here — no page or resource
// api/ module calls fetch() directly (frontend/docs/03-project-structure.md
// Section 8).

import { API_BASE_URL } from "../config/api.js";
import { getToken } from "../auth/tokenStorage.js";
import { authState } from "../auth/authState.js";

// 401 on these two paths means "wrong credentials" / "duplicate email",
// not "your session expired" — neither request ever carries a token in
// the first place, so this list only exists to make that exemption
// explicit rather than relying on "no Authorization header was sent" as
// the sole signal (frontend/docs/05-api-integration.md Section 7).
const AUTH_ENDPOINTS_EXEMPT_FROM_AUTO_LOGOUT = new Set(["/auth/login", "/auth/register"]);

async function request(method, path, body) {
  const headers = {
    "Content-Type": "application/json",
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Unable to reach the server. Check your connection and try again.");
  }

  if (response.status === 204) {
    return null;
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    if (response.status === 401 && !AUTH_ENDPOINTS_EXEMPT_FROM_AUTO_LOGOUT.has(path)) {
      // Foundation layer only: clears auth state (Section 13). Redirecting
      // to /login is a route-guard/navigation concern, explicitly out of
      // scope for this task.
      authState.logout();
    }

    const message = (payload && payload.message) || "Something went wrong. Please try again.";
    const error = new Error(message);
    error.status = response.status;
    error.code = (payload && payload.code) || null;
    throw error;
  }

  return payload;
}

export const apiClient = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  delete: (path) => request("DELETE", path),
};
