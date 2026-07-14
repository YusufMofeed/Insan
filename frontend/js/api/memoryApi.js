// Memories resource API module. frontend/docs/03-project-structure.md
// Section 5 (api/) — one module per backend resource. Only communicates
// with the backend via apiClient; no DOM manipulation, no UI logic.

import { apiClient } from "./apiClient.js";

export const memoryApi = {
  /**
   * GET /api/journeys/{journeyId}/memories. Public endpoint, unfiltered
   * (Memory has no approval/status concept, unlike Voice).
   * @param {string} journeyId
   * @returns {Promise<Object[]>}
   */
  getByJourney(journeyId) {
    return apiClient.get(`/journeys/${journeyId}/memories`);
  },
};
