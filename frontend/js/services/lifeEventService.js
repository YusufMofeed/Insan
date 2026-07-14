// Life Events service. frontend/docs/06-page-implementation-rules.md
// Section 4 (Data Flow Architecture): Page → Service layer → apiClient →
// Backend API — pages call this, never js/api/lifeEventApi.js or
// apiClient directly.

import { lifeEventApi } from "../api/lifeEventApi.js";

export const lifeEventService = {
  getLifeEventsByJourney(journeyId) {
    return lifeEventApi.getByJourney(journeyId);
  },
};
