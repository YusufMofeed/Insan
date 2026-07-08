// Reusable Toast notification component. frontend/docs/02-ui-design-system.md
// Section 15. `toastContainer` below is a module-private singleton (not a
// global — it is never attached to `window`), matching the standard pattern
// for a single shared notification region.

let toastContainer = null;

function getContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    toastContainer.setAttribute("aria-live", "polite");
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

/**
 * @param {Object} options
 * @param {string} options.message
 * @param {"success"|"error"|"warning"|"info"} [options.type]
 * @param {number} [options.duration] - ms before auto-dismiss; 0 disables it.
 * @returns {{ element: HTMLElement, dismiss: () => void }}
 */
export function showToast({ message, type = "info", duration = 4000 } = {}) {
  const container = getContainer();

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.setAttribute("role", "status");
  toast.textContent = message;

  container.appendChild(toast);

  const dismiss = () => toast.remove();

  if (duration > 0) {
    setTimeout(dismiss, duration);
  }

  return { element: toast, dismiss };
}
