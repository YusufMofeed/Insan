// Stories service. frontend/docs/06-page-implementation-rules.md
// Section 4 (Data Flow Architecture): Page → Service layer → apiClient →
// Backend API — pages call this, never js/api/storyApi.js or apiClient
// directly.

import { storyApi } from "../api/storyApi.js";

export const storyService = {
  getStoriesByJourney(journeyId) {
    return storyApi.getByJourney(journeyId);
  },
};
