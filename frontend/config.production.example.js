// Example production override for frontend/config.js. Not loaded by the
// app directly (index.html only ever loads config.js) — copy this file's
// content into config.js as part of deploying to a real environment where
// the frontend and backend do not share an origin, then restore config.js
// to its default (empty) state, as committed, for local development.
window.__INSAN_CONFIG__ = {
  API_BASE_URL: "https://api.insan.example.com/api",
};
