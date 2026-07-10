// Date formatting helper. frontend/docs/03-project-structure.md Section 5
// (utils/) — a small, reusable helper with no dependencies on the rest of
// the app, called by any layer but calling nothing itself.

/**
 * @param {string} isoDate
 * @returns {string} e.g. "March 12, 1985"
 */
export function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
