// Users service. frontend/docs/06-page-implementation-rules.md Section 4
// (Data Flow Architecture): Page → Service layer → apiClient → Backend
// API — pages call this, never js/api/userApi.js or apiClient directly.
// For now this is a thin pass-through to userApi; it's the layer where
// future cross-cutting concerns (caching, combining multiple api/ calls)
// would live without pages needing to change.

import { userApi } from "../api/userApi.js";

export const userService = {
  getCurrentUser() {
    return userApi.getMe();
  },
};
