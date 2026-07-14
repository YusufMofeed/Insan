// Centralized API base URL. frontend/docs/05-api-integration.md Section 2
// and Section 16. Resolved at runtime from window.location.hostname — no
// build tools, no environment variables (frontend/docs/01-frontend-principles.md
// Section 3): the same static files are served in every environment, and
// this is the one place that decides which backend they talk to.

const DEVELOPMENT_HOSTNAMES = new Set(["localhost", "127.0.0.1"]);

const DEVELOPMENT_API_BASE_URL = "http://localhost:5200/api";
const PRODUCTION_API_BASE_URL = "/api";

export const API_BASE_URL = DEVELOPMENT_HOSTNAMES.has(window.location.hostname)
  ? DEVELOPMENT_API_BASE_URL
  : PRODUCTION_API_BASE_URL;
