// Runtime deployment configuration. frontend/docs/05-api-integration.md
// Section 16. This file is loaded before js/app.js (see index.html) and is
// the one deploy-time override point for environment-specific values —
// never edit js/config/api.js per environment, edit this file instead (or
// have the deployment process overwrite it before serving).
//
// Left empty/default, as committed here, js/config/api.js falls back to
// its existing hostname-based detection (localhost/127.0.0.1 -> local
// backend, anything else -> same-origin "/api") — this is the exact,
// unchanged local-development behavior.
//
// For a production deployment where the frontend and backend are NOT
// served from the same origin (so the "/api" same-origin fallback doesn't
// apply), set API_BASE_URL below to the deployed backend's full URL. See
// frontend/config.production.example.js for the shape this takes.
window.__INSAN_CONFIG__ = {
  API_BASE_URL: "",
};
