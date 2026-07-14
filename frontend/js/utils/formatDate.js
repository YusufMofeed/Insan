// Date formatting helper. frontend/docs/03-project-structure.md Section 5
// (utils/) — a small, reusable helper with no dependencies on the rest of
// the app, called by any layer but calling nothing itself.

/**
 * @param {string} [isoDate]
 * @returns {string} e.g. "March 12, 1985" — empty string for a missing date,
 *   never the Unix epoch (`new Date(null)` resolves to 1970-01-01, which is
 *   wrong, not "unknown").
 */
export function formatDate(isoDate) {
  if (!isoDate) {
    return "";
  }
  return new Date(isoDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
