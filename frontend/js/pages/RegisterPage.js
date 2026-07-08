// Register page. frontend/docs/04-pages-specification.md Section 2.
// No API calls, no authentication logic, no state management — same
// preventDefault()-only submit as LoginPage.js. No automatic login is
// implied here since there is no submission logic at all yet.

import { createInput } from "../components/Input.js";
import { createButton } from "../components/Button.js";
import { createAuthLayout } from "../layouts/AuthLayout.js";

export function createRegisterPage() {
  const form = document.createElement("form");
  form.className = "auth-form";
  form.addEventListener("submit", (event) => event.preventDefault());

  const fullNameInput = createInput({ label: "Full name", name: "fullName", type: "text" });
  const emailInput = createInput({ label: "Email", name: "email", type: "email" });
  const passwordInput = createInput({ label: "Password", name: "password", type: "password" });

  const submitButton = createButton({ label: "Create Account", variant: "primary", type: "submit" });
  submitButton.classList.add("auth-form__submit");

  form.append(fullNameInput, emailInput, passwordInput, submitButton);

  const footer = document.createElement("p");
  footer.className = "auth-card__footer";
  const loginLink = document.createElement("a");
  loginLink.href = "/login";
  loginLink.textContent = "Log in";
  footer.append("Already have an account? ", loginLink);

  return createAuthLayout({
    title: "Create Account",
    form,
    footer,
  });
}
