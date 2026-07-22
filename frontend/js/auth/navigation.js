// Builds the app Navbar's links/actions from current auth state.
// frontend/docs/04-pages-specification.md Section 10 (nav tiers are
// additive: authenticated extends public, admin extends authenticated) and
// the explicit ownership note in js/components/Navbar.js: deciding which
// links are public vs. authenticated belongs to the auth layer, not the
// component or the layout that renders it.

import { authState } from "./authState.js";
import { authService } from "./authService.js";
import { createNavbar } from "../components/Navbar.js";
import { createButton } from "../components/Button.js";

const PUBLIC_LINKS = [
  { label: "Home", href: "/" },
  { label: "Journeys", href: "/journeys" },
];

/**
 * @param {import("../router/Router.js").Router} router
 * @returns {HTMLElement}
 */
export function createAppNavbar(router) {
  const links = [...PUBLIC_LINKS];
  const actions = [];

  if (authState.isAuthenticated) {
    links.push({ label: "Profile", href: "/profile" });

    if (authState.currentUser?.role === "Admin") {
      links.push({ label: "Admin", href: "/admin" });
      links.push({ label: "Manage Journeys", href: "/admin/journeys" });
    }

    actions.push(
      createButton({
        label: "Logout",
        variant: "ghost",
        onClick: () => {
          authService.logout();
          router.navigate("/");
        },
      })
    );
  } else {
    const loginLink = document.createElement("a");
    loginLink.className = "btn btn--secondary";
    loginLink.href = "/login";
    loginLink.textContent = "Login";

    const registerLink = document.createElement("a");
    registerLink.className = "btn btn--primary";
    registerLink.href = "/register";
    registerLink.textContent = "Register";

    actions.push(loginLink, registerLink);
  }

  return createNavbar({ links, actions });
}
