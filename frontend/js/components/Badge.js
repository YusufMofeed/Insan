// Reusable Badge component. frontend/docs/02-ui-design-system.md Section 12
// (Role badge: neutral styling only — border + --color-text-secondary,
// never the status colors) and Section 3 (--color-success/--color-warning/
// --color-danger reserved for status communication, e.g. Voice moderation
// state). One component and one set of styles covers both uses, rather
// than a role-badge and a separate status-badge (Section 20: avoid
// duplicate styles for near-identical components).

/**
 * @param {Object} options
 * @param {string} options.label
 * @param {"neutral"|"success"|"warning"|"danger"} [options.variant]
 * @returns {HTMLSpanElement}
 */
export function createBadge({ label, variant = "neutral" } = {}) {
  const badge = document.createElement("span");
  badge.className = `badge badge--${variant}`;
  badge.textContent = label;
  return badge;
}
