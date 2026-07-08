// Application-wide authentication state. frontend/docs/05-api-integration.md
// Section 13. The only module that decides isAuthenticated/currentUser —
// everything else (apiClient, authService, future pages) reads these
// values rather than inspecting the token itself.
//
// currentUser is decoded directly from the JWT payload — the backend's
// token contains "sub" (user id, as issued — JwtRegisteredClaimNames.Sub
// is literally the short name "sub" in the raw token) and the role under
// its full claim URI (ClaimTypes.Role's string value *is* that URI, so
// that's what's actually encoded — there is no short "role" claim in the
// raw token). No network call is needed to decode this, it's local base64.

import { getToken, setToken, removeToken } from "./tokenStorage.js";

const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

function decodeTokenPayload(token) {
  try {
    const [, payload] = token.split(".");
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
}

function buildUserFromToken(token) {
  const payload = decodeTokenPayload(token);
  if (!payload) {
    return null;
  }

  const isExpired = typeof payload.exp === "number" && Date.now() >= payload.exp * 1000;
  if (isExpired) {
    return null;
  }

  const userId = payload.sub || null;
  const role = payload[ROLE_CLAIM] || null;

  return userId ? { id: userId, role } : null;
}

function createAuthState() {
  let isAuthenticated = false;
  let currentUser = null;

  function applyToken(token) {
    const user = buildUserFromToken(token);
    isAuthenticated = Boolean(user);
    currentUser = user;
  }

  return {
    get isAuthenticated() {
      return isAuthenticated;
    },

    get currentUser() {
      return currentUser;
    },

    /** Restore state from a previously stored token, if any (e.g. on app load). */
    initialize() {
      const token = getToken();
      if (token) {
        applyToken(token);
      }
    },

    /** Persist a newly issued token and update state to match. */
    login(token) {
      setToken(token);
      applyToken(token);
    },

    /** Clear the stored token and reset state. */
    logout() {
      removeToken();
      isAuthenticated = false;
      currentUser = null;
    },
  };
}

export const authState = createAuthState();
