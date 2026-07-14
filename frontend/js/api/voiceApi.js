// Voices resource API module. frontend/docs/03-project-structure.md
// Section 5 (api/) — one module per backend resource. Only communicates
// with the backend via apiClient; no DOM manipulation, no UI logic.

import { apiClient } from "./apiClient.js";

export const voiceApi = {
  /**
   * GET /api/journeys/{journeyId}/voices. Public endpoint; the backend
   * defaults to approved-only Voices for a caller with no `onlyApproved`
   * query param, which is exactly what this public-facing page should
   * show — not re-decided or overridden here.
   * @param {string} journeyId
   * @returns {Promise<Object[]>}
   */
  getByJourney(journeyId) {
    return apiClient.get(`/journeys/${journeyId}/voices`);
  },
};
