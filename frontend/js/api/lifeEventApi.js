// Life Events resource API module. frontend/docs/03-project-structure.md
// Section 5 (api/) — one module per backend resource. Only communicates
// with the backend via apiClient; no DOM manipulation, no UI logic.

import { apiClient } from "./apiClient.js";

export const lifeEventApi = {
  /**
   * GET /api/journeys/{journeyId}/lifeevents. Public endpoint, unfiltered.
   * @param {string} journeyId
   * @returns {Promise<Object[]>}
   */
  getByJourney(journeyId) {
    return apiClient.get(`/journeys/${journeyId}/lifeevents`);
  },
};
