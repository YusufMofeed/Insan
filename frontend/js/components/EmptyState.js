// Reusable EmptyState component, for no-data situations.
// frontend/docs/02-ui-design-system.md Section 15.

/**
 * @param {Object} options
 * @param {string} [options.title]
 * @param {string} [options.description]
 * @param {Node} [options.action]
 * @returns {HTMLDivElement}
 */
export function createEmptyState({ title = "Nothing here yet", description = "", action } = {}) {
  const container = document.createElement("div");
  container.className = "empty-state";

  const titleEl = document.createElement("h3");
  titleEl.className = "empty-state__title";
  titleEl.textContent = title;
  container.appendChild(titleEl);

  if (description) {
    const descriptionEl = document.createElement("p");
    descriptionEl.className = "empty-state__description";
    descriptionEl.textContent = description;
    container.appendChild(descriptionEl);
  }

  if (action instanceof Node) {
    container.appendChild(action);
  }

  return container;
}
