// Login page. frontend/docs/04-pages-specification.md Section 2: submit
// calls POST /auth/login via authService, shows a form-level error on
// failure (401 "Invalid credentials" is not field-specific), and on success
// navigates to the ?redirect= path that sent the user to /login, or
// /journeys otherwise (resolvePostLoginRedirect, routeGuards.js).

import { createInput } from "../components/Input.js";
import { createButton } from "../components/Button.js";
import { createAuthLayout } from "../layouts/AuthLayout.js";
import { authService } from "../auth/authService.js";
import { resolvePostLoginRedirect } from "../auth/routeGuards.js";

/**
 * @param {import("../router/Router.js").Router} router
 */
export function createLoginPage(router) {
  const form = document.createElement("form");
  form.className = "auth-form";

  const emailInput = createInput({ label: "Email", name: "email", type: "email" });
  const passwordInput = createInput({ label: "Password", name: "password", type: "password" });

  const errorMessage = document.createElement("p");
  errorMessage.className = "auth-form__error";
  errorMessage.setAttribute("role", "alert");
  errorMessage.hidden = true;

  const submitButton = createButton({ label: "Log In", variant: "primary", type: "submit" });
  submitButton.classList.add("auth-form__submit");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorMessage.hidden = true;

    const formData = new FormData(form);

    try {
      await authService.login(formData.get("email"), formData.get("password"));
      router.navigate(resolvePostLoginRedirect());
    } catch (error) {
      errorMessage.textContent = error.message;
      errorMessage.hidden = false;
    }
  });

  form.append(emailInput, passwordInput, errorMessage, submitButton);

  const footer = document.createElement("p");
  footer.className = "auth-card__footer";
  const registerLink = document.createElement("a");
  registerLink.href = "/register";
  registerLink.textContent = "Create one";
  footer.append("Don't have an account? ", registerLink);

  return createAuthLayout({
    title: "Log In",
    form,
    footer,
  });
}
