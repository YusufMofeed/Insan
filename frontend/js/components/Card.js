// Reusable Card component. frontend/docs/02-ui-design-system.md Section 10.
// This is the shared card shell only — content-specific variants (Journey,
// Voice, Memory, Story, LifeEvent cards) are built later, on top of this,
// not implemented here.

/**
 * @param {Object} options
 * @param {string} [options.title]
 * @param {string|Node} [options.content]
 * @param {Node[]} [options.actions]
 * @param {boolean} [options.interactive] - enables hover lift (Section 10:
 *   non-interactive cards, e.g. inside a read-only timeline, should not).
 * @returns {HTMLElement}
 */
export function createCard({ title = "", content = "", actions = [], interactive = false } = {}) {
  const card = document.createElement("article");
  card.className = interactive ? "card card--interactive" : "card";

  if (title) {
    const titleEl = document.createElement("h3");
    titleEl.className = "card__title";
    titleEl.textContent = title;
    card.appendChild(titleEl);
  }

  const contentEl = document.createElement("div");
  contentEl.className = "card__content";
  if (content instanceof Node) {
    contentEl.appendChild(content);
  } else if (content) {
    contentEl.textContent = content;
  }
  card.appendChild(contentEl);

  if (actions.length > 0) {
    const actionsEl = document.createElement("div");
    actionsEl.className = "card__actions";
    actions.forEach((action) => actionsEl.appendChild(action));
    card.appendChild(actionsEl);
  }

  return card;
}
