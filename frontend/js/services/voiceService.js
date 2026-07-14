// Voices service. frontend/docs/06-page-implementation-rules.md Section 4
// (Data Flow Architecture): Page → Service layer → apiClient → Backend
// API — pages call this, never js/api/voiceApi.js or apiClient directly.

import { voiceApi } from "../api/voiceApi.js";

export const voiceService = {
  getVoicesByJourney(journeyId) {
    return voiceApi.getByJourney(journeyId);
  },
};
