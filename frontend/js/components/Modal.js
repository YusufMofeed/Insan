// Reusable Modal component. frontend/docs/02-ui-design-system.md Section 15.
// No business logic — this only manages open/close, the overlay, and
// keyboard/focus accessibility. What goes inside the modal, and what
// happens on close, is entirely up to the caller.

/**
 * @param {Object} options
 * @param {string} [options.title]
 * @param {string|Node} [options.content]
 * @param {() => void} [options.onClose]
 * @returns {{ element: HTMLElement, open: () => void, close: () => void }}
 */
export function createModal({ title = "", content = "", onClose } = {}) {
  let previouslyFocusedElement = null;

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.hidden = true;

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  if (title) {
    modal.setAttribute("aria-label", title);
  }

  const header = document.createElement("div");
  header.className = "modal__header";

  if (title) {
    const titleEl = document.createElement("h3");
    titleEl.className = "modal__title";
    titleEl.textContent = title;
    header.appendChild(titleEl);
  }

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "modal__close";
  closeButton.setAttribute("aria-label", "Close dialog");
  closeButton.textContent = "×";
  header.appendChild(closeButton);

  modal.appendChild(header);

  const body = document.createElement("div");
  body.className = "modal__body";
  if (content instanceof Node) {
    body.appendChild(content);
  } else if (content) {
    body.textContent = content;
  }
  modal.appendChild(body);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  function handleKeydown(event) {
    if (event.key === "Escape") {
      close();
    }
  }

  function open() {
    previouslyFocusedElement = document.activeElement;
    overlay.hidden = false;
    document.addEventListener("keydown", handleKeydown);
    closeButton.focus();
  }

  function close() {
    overlay.hidden = true;
    document.removeEventListener("keydown", handleKeydown);
    if (previouslyFocusedElement instanceof HTMLElement) {
      previouslyFocusedElement.focus();
    }
    if (typeof onClose === "function") {
      onClose();
    }
  }

  closeButton.addEventListener("click", close);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      close();
    }
  });

  return { element: overlay, open, close };
}
