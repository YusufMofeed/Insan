// Reusable Loading components: Spinner and Loading container.
// frontend/docs/02-ui-design-system.md Section 15.

/**
 * @param {Object} options
 * @param {"sm"|"md"|"lg"} [options.size]
 * @returns {HTMLSpanElement}
 */
export function createSpinner({ size = "md" } = {}) {
  const spinner = document.createElement("span");
  spinner.className = `spinner spinner--${size}`;
  spinner.setAttribute("role", "status");
  spinner.setAttribute("aria-label", "Loading");
  return spinner;
}

/**
 * @param {Object} options
 * @param {string} [options.message]
 * @returns {HTMLDivElement}
 */
export function createLoadingContainer({ message = "Loading…" } = {}) {
  const container = document.createElement("div");
  container.className = "loading-container";
  container.appendChild(createSpinner({ size: "lg" }));

  if (message) {
    const text = document.createElement("p");
    text.className = "loading-container__message";
    text.textContent = message;
    container.appendChild(text);
  }

  return container;
}
