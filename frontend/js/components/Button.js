// Reusable Button component. frontend/docs/02-ui-design-system.md Section 8.
// Pure factory: takes data, returns a DOM element. No API calls, no page logic.

import { createSpinner } from "./Loading.js";

/**
 * @param {Object} options
 * @param {string} options.label
 * @param {"primary"|"secondary"|"danger"|"ghost"} [options.variant]
 * @param {"button"|"submit"|"reset"} [options.type]
 * @param {boolean} [options.disabled]
 * @param {boolean} [options.loading]
 * @param {(event: MouseEvent) => void} [options.onClick]
 * @returns {HTMLButtonElement}
 */
export function createButton({
  label,
  variant = "primary",
  type = "button",
  disabled = false,
  loading = false,
  onClick,
} = {}) {
  const button = document.createElement("button");
  button.type = type;
  button.className = `btn btn--${variant}`;
  button.disabled = disabled || loading;

  if (loading) {
    button.classList.add("btn--loading");
    button.setAttribute("aria-busy", "true");
    button.appendChild(createSpinner({ size: "sm" }));
  }

  const labelSpan = document.createElement("span");
  labelSpan.textContent = label;
  button.appendChild(labelSpan);

  if (typeof onClick === "function") {
    button.addEventListener("click", onClick);
  }

  return button;
}
