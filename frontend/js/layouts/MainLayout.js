// Common application layout: Navbar + main content area + Footer.
// frontend/docs/03-project-structure.md. This file only composes existing
// components around whatever content it's given — it doesn't know what
// that content is, and contains no page logic or API calls. Which navbar
// links/actions to show (public vs. authenticated vs. admin) is decided by
// js/auth/navigation.js, not here — this file just renders whatever it
// returns.

import { createAppNavbar } from "../auth/navigation.js";
import { createFooter } from "./Footer.js";

/**
 * @param {Object} options
 * @param {import("../router/Router.js").Router} options.router
 * @param {Node} [options.content] - the page content to render in <main>.
 * @returns {HTMLDivElement}
 */
export function createMainLayout({ router, content } = {}) {
  const shell = document.createElement("div");
  shell.className = "app-shell";

  const navbar = createAppNavbar(router);

  const main = document.createElement("main");
  main.id = "main-content";
  main.className = "app-shell__main";

  if (content instanceof Node) {
    main.appendChild(content);
  }

  shell.append(navbar, main, createFooter());

  return shell;
}
