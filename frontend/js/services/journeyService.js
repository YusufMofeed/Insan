// Journeys service. frontend/docs/06-page-implementation-rules.md
// Section 4 (Data Flow Architecture): Page → Service layer → apiClient →
// Backend API — pages call this, never js/api/journeyApi.js or apiClient
// directly. For now this is a thin pass-through to journeyApi; it's the
// layer where future cross-cutting concerns (caching, combining multiple
// api/ calls) would live without pages needing to change.

import { journeyApi } from "../api/journeyApi.js";

export const journeyService = {
  getJourneys(params) {
    return journeyApi.getJourneys(params);
  },

  getJourneyById(id) {
    return journeyApi.getById(id);
  },

  createJourney(payload) {
    return journeyApi.create(payload);
  },

  updateJourney(id, payload) {
    return journeyApi.update(id, payload);
  },

  deleteJourney(id) {
    return journeyApi.delete(id);
  },
};
