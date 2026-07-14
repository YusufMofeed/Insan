// Users resource API module. frontend/docs/03-project-structure.md
// Section 5 (api/) — one module per backend resource, mirroring the
// backend's own controllers. Only communicates with the backend via
// apiClient; no DOM manipulation, no UI logic (Section 5's Rules).

import { apiClient } from "./apiClient.js";

export const userApi = {
  /**
   * GET /api/users/me. Requires an authenticated request (apiClient
   * attaches the stored token automatically) — returns the current
   * user's own record: { id, fullName, email, role, createdAt }.
   * @returns {Promise<Object>}
   */
  getMe() {
    return apiClient.get("/users/me");
  },
};
