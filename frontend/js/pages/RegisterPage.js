// Register page. frontend/docs/05-api-integration.md Section 12: submit
// calls POST /auth/register via authService — 201 with no token (no
// automatic login; the backend doesn't issue one on registration) — then
// navigates to /login, since there is no session to land the user in.
// Failure (400 field validation, 409 duplicate email, or anything else)
// is shown as a single form-level error from the normalized error's
// `message` (Section 6, Section 8), mirroring LoginPage.js's pattern
// exactly rather than inventing a second error-handling approach.

import { createInput } from "../components/Input.js";
import { createButton } from "../components/Button.js";
import { createAuthLayout } from "../layouts/AuthLayout.js";
import { authService } from "../auth/authService.js";

/**
 * @param {import("../router/Router.js").Router} router
 */
export function createRegisterPage(router) {
  const form = document.createElement("form");
  form.className = "auth-form";

  const fullNameInput = createInput({ label: "Full name", name: "fullName", type: "text" });
  const emailInput = createInput({ label: "Email", name: "email", type: "email" });
  const passwordInput = createInput({ label: "Password", name: "password", type: "password" });

  const errorMessage = document.createElement("p");
  errorMessage.className = "auth-form__error";
  errorMessage.setAttribute("role", "alert");
  errorMessage.hidden = true;

  const submitButton = createButton({ label: "Create Account", variant: "primary", type: "submit" });
  submitButton.classList.add("auth-form__submit");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorMessage.hidden = true;

    const formData = new FormData(form);

    try {
      await authService.register(formData.get("fullName"), formData.get("email"), formData.get("password"));
      router.navigate("/login");
    } catch (error) {
      errorMessage.textContent = error.message;
      errorMessage.hidden = false;
    }
  });

  form.append(fullNameInput, emailInput, passwordInput, errorMessage, submitButton);

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
