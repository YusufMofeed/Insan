// Authentication network operations. frontend/docs/05-api-integration.md
// Section 12. Uses the backend's real endpoints exactly:
//   POST /auth/login    -> { token, expiresAt }
//   POST /auth/register -> { id, fullName, email, role, createdAt } (no token)
// Pages call this, never apiClient directly (frontend/docs/03-project-structure.md
// Section 8).

import { apiClient } from "../api/apiClient.js";
import { authState } from "./authState.js";

export const authService = {
  async login(email, password) {
    const response = await apiClient.post("/auth/login", { email, password });
    authState.login(response.token);
    return response;
  },

  async register(fullName, email, password) {
    // No automatic login — the backend issues no token on registration.
    return apiClient.post("/auth/register", { fullName, email, password });
  },

  logout() {
    // Stateless JWTs, no backend logout endpoint — this is purely local.
    authState.logout();
  },
};
