// Centralized API base URL. frontend/docs/05-api-integration.md Section 2
// and Section 16. No build tools, no build-time environment variables
// (frontend/docs/01-frontend-principles.md Section 3): the same static
// files are served in every environment, and this is the one place that
// decides which backend they talk to, resolved at runtime in one of two
// ways:
//
// 1. An explicit override from config.js (window.__INSAN_CONFIG__.API_BASE_URL)
//    — the deploy-time override point for a production deployment where
//    the frontend and backend do not share an origin. Empty/absent by
//    default (as committed in config.js), so this never fires in local
//    development.
// 2. Otherwise, window.location.hostname: known local-development
//    hostnames (localhost, 127.0.0.1) resolve to the local backend's URL;
//    anything else resolves to the deployed backend's URL via a
//    same-origin relative path, assuming a reverse proxy routes /api to
//    the backend — this is the exact, unchanged local-development
//    behavior this project has always used.

const DEVELOPMENT_HOSTNAMES = new Set(["localhost", "127.0.0.1"]);

const DEVELOPMENT_API_BASE_URL = "http://localhost:5200/api";
const PRODUCTION_API_BASE_URL = "/api";

const configuredOverride = window.__INSAN_CONFIG__?.API_BASE_URL;

export const API_BASE_URL = configuredOverride
  ? configuredOverride
  : DEVELOPMENT_HOSTNAMES.has(window.location.hostname)
    ? DEVELOPMENT_API_BASE_URL
    : PRODUCTION_API_BASE_URL;
