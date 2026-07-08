// Reusable ErrorState component, for API errors.
// frontend/docs/02-ui-design-system.md Section 15.
// The retry action is a placeholder — this component does not know what
// "retry" means, it only offers the callback slot; the caller (a future
// page, via the services/API layer) supplies the actual behavior.

import { createButton } from "./Button.js";

/**
 * @param {Object} options
 * @param {string} [options.message]
 * @param {() => void} [options.onRetry]
 * @returns {HTMLDivElement}
 */
export function createErrorState({ message = "Something went wrong.", onRetry } = {}) {
  const container = document.createElement("div");
  container.className = "error-state";
  container.setAttribute("role", "alert");

  const messageEl = document.createElement("p");
  messageEl.className = "error-state__message";
  messageEl.textContent = message;
  container.appendChild(messageEl);

  if (typeof onRetry === "function") {
    const retryButton = createButton({ label: "Retry", variant: "secondary", onClick: onRetry });
    retryButton.classList.add("error-state__retry");
    container.appendChild(retryButton);
  }

  return container;
}
