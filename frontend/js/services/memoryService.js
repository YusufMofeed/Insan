// Memories service. frontend/docs/06-page-implementation-rules.md
// Section 4 (Data Flow Architecture): Page → Service layer → apiClient →
// Backend API — pages call this, never js/api/memoryApi.js or apiClient
// directly.

import { memoryApi } from "../api/memoryApi.js";

export const memoryService = {
  getMemoriesByJourney(journeyId) {
    return memoryApi.getByJourney(journeyId);
  },
};
