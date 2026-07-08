// Reusable form Input component. frontend/docs/02-ui-design-system.md Section 9.
// Pure factory: takes data, returns a DOM element. No validation rules — an
// error message is displayed if given, but deciding what counts as an error
// is the caller's responsibility (frontend/docs/01-frontend-principles.md
// Section 1: business/validation rules are never owned by a component).

let inputIdCounter = 0;

/**
 * @param {Object} options
 * @param {string} [options.label]
 * @param {string} [options.name]
 * @param {string} [options.type]
 * @param {string} [options.placeholder]
 * @param {string} [options.value]
 * @param {string} [options.error]
 * @param {boolean} [options.disabled]
 * @returns {HTMLDivElement}
 */
export function createInput({
  label = "",
  name = "",
  type = "text",
  placeholder = "",
  value = "",
  error = "",
  disabled = false,
} = {}) {
  inputIdCounter += 1;
  const inputId = `input-${name || "field"}-${inputIdCounter}`;

  const wrapper = document.createElement("div");
  wrapper.className = "input-group";

  if (label) {
    const labelEl = document.createElement("label");
    labelEl.className = "input-group__label";
    labelEl.setAttribute("for", inputId);
    labelEl.textContent = label;
    wrapper.appendChild(labelEl);
  }

  const input = document.createElement("input");
  input.className = "input-group__input";
  input.id = inputId;
  input.type = type;
  input.name = name;
  input.placeholder = placeholder;
  input.value = value;
  input.disabled = disabled;

  if (error) {
    input.classList.add("input-group__input--error");
    input.setAttribute("aria-invalid", "true");
  }

  wrapper.appendChild(input);

  if (error) {
    const errorId = `${inputId}-error`;
    const errorEl = document.createElement("p");
    errorEl.className = "input-group__error";
    errorEl.id = errorId;
    errorEl.textContent = error;
    input.setAttribute("aria-describedby", errorId);
    wrapper.appendChild(errorEl);
  }

  return wrapper;
}
