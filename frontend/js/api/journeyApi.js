// Journeys resource API module. frontend/docs/03-project-structure.md
// Section 5 (api/) — one module per backend resource, mirroring the
// backend's own controllers. Only communicates with the backend via
// apiClient; no DOM manipulation, no UI logic (Section 5's Rules).

import { apiClient } from "./apiClient.js";

function buildQueryString(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export const journeyApi = {
  /**
   * GET /api/journeys. frontend/docs/05-api-integration.md Section 9 —
   * the response wraps results with pagination metadata:
   * { data, totalCount, page, pageSize }.
   *
   * @param {Object} [params]
   * @param {number} [params.page]
   * @param {number} [params.pageSize]
   * @param {string} [params.search]
   * @param {string} [params.city]
   * @param {string} [params.occupation]
   * @returns {Promise<{ data: Object[], totalCount: number, page: number, pageSize: number }>}
   */
  getJourneys(params = {}) {
    return apiClient.get(`/journeys${buildQueryString(params)}`);
  },

  /**
   * GET /api/journeys/{id}. Scalar Journey fields only — no nested
   * voices/memories/stories/lifeEvents arrays (confirmed against
   * backend/Insan.API/DTOs/JourneyDtos.cs's JourneyResponse); each of
   * those is its own separate resource module and endpoint.
   * @param {string} id
   * @returns {Promise<Object>}
   */
  getById(id) {
    return apiClient.get(`/journeys/${id}`);
  },

  /**
   * POST /api/journeys. Admin only (backend: [Authorize(Roles = "Admin")]).
   * 201 Created with the full JourneyResponse (including the new id).
   * @param {Object} payload - CreateJourneyRequest shape, including createdBy.
   * @returns {Promise<Object>}
   */
  create(payload) {
    return apiClient.post("/journeys", payload);
  },

  /**
   * PUT /api/journeys/{id}. Admin only. 200 OK with the full
   * JourneyResponse (not 204 — the backend returns the updated record).
   * @param {string} id
   * @param {Object} payload - UpdateJourneyRequest shape (no createdBy).
   * @returns {Promise<Object>}
   */
  update(id, payload) {
    return apiClient.put(`/journeys/${id}`, payload);
  },

  /**
   * DELETE /api/journeys/{id}. Admin only. 204 No Content (soft delete —
   * the backend archives the record rather than removing the row).
   * @param {string} id
   * @returns {Promise<null>}
   */
  delete(id) {
    return apiClient.delete(`/journeys/${id}`);
  },
};
