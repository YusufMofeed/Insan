// Reusable ConfirmDialog component. frontend/docs/02-ui-design-system.md
// Section 15 (Modal: "blocking dialog for focused tasks or confirmations")
// and Section 8 (Danger button: "used only for destructive, confirmed
// actions" — exactly this component's typical use). Built on top of
// Modal.js rather than reimplementing overlay/focus/Escape handling
// (Section 20: reuse existing components rather than a one-off
// equivalent) — this file only adds the confirm/cancel action pattern on
// top of it.

import { createModal } from "./Modal.js";
import { createButton } from "./Button.js";

/**
 * @param {Object} options
 * @param {string} options.title
 * @param {string} [options.message]
 * @param {string} [options.confirmLabel]
 * @param {string} [options.cancelLabel]
 * @param {"primary"|"danger"} [options.confirmVariant] - "danger" for destructive actions (02-ui-design-system.md Section 8)
 * @param {() => void} [options.onConfirm]
 * @param {() => void} [options.onCancel] - called on Cancel, the close (×) button, an overlay click, or Escape — anything that isn't Confirm
 * @returns {{ element: HTMLElement, open: () => void, close: () => void }}
 */
export function createConfirmDialog({
  title,
  message = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "primary",
  onConfirm,
  onCancel,
} = {}) {
  let confirmed = false;

  const body = document.createElement("div");
  body.className = "confirm-dialog__body";

  if (message) {
    const messageEl = document.createElement("p");
    messageEl.className = "confirm-dialog__message";
    messageEl.textContent = message;
    body.appendChild(messageEl);
  }

  const actions = document.createElement("div");
  actions.className = "confirm-dialog__actions";

  const cancelButton = createButton({
    label: cancelLabel,
    variant: "ghost",
    onClick: () => dialog.close(),
  });

  const confirmButton = createButton({
    label: confirmLabel,
    variant: confirmVariant,
    onClick: () => {
      confirmed = true;
      dialog.close();
    },
  });

  actions.append(cancelButton, confirmButton);
  body.appendChild(actions);

  const dialog = createModal({
    title,
    content: body,
    onClose: () => {
      if (confirmed) {
        confirmed = false;
        if (typeof onConfirm === "function") {
          onConfirm();
        }
      } else if (typeof onCancel === "function") {
        onCancel();
      }
    },
  });

  return dialog;
}
