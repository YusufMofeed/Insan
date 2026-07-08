// JWT persistence. frontend/docs/05-api-integration.md Section 4.
// The only module that reads or writes the stored token directly — every
// other module (apiClient, authState) goes through these three functions.

const TOKEN_STORAGE_KEY = "insan_auth_token";

export function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}
