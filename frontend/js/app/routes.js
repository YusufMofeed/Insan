// Route registration only. frontend/docs/04-pages-specification.md defines
// what each route will eventually be. "/", "/login", and "/register" have
// real pages so far; every other route still uses a placeholder handler.
// Which routes require/forbid authentication is applied here too, via the
// guard helpers in js/auth/routeGuards.js (05-api-integration.md Section 15)
// — the guards are written once and reused per protected route, not
// reimplemented per page.

import { createMainLayout } from "../layouts/MainLayout.js";
import { createHomePage } from "../pages/HomePage.js";
import { createLoginPage } from "../pages/LoginPage.js";
import { createRegisterPage } from "../pages/RegisterPage.js";
import { requireAuth, publicOnly } from "../auth/routeGuards.js";

function createPlaceholder(routeName) {
  return ({ params } = {}) => {
    const element = document.createElement("p");
    element.className = "container";
    element.textContent =
      params && Object.keys(params).length > 0
        ? `Route placeholder: ${routeName} (${JSON.stringify(params)})`
        : `Route placeholder: ${routeName}`;
    return element;
  };
}

/**
 * @param {import("../router/Router.js").Router} router
 */
export function registerRoutes(router) {
  // Public — frontend/docs/04-pages-specification.md Section 2-3
  router.add("/", () => createMainLayout({ router, content: createHomePage() }));
  router.add("/login", publicOnly(router, () => createLoginPage(router)));
  router.add("/register", publicOnly(router, () => createRegisterPage()));
  router.add("/journeys", createPlaceholder("Journeys Feed"));
  router.add("/journeys/:id", createPlaceholder("Journey Details"));

  // Authenticated — frontend/docs/04-pages-specification.md Section 8, 4
  router.add("/profile", requireAuth(router, createPlaceholder("Profile")));
  router.add("/create-journey", requireAuth(router, createPlaceholder("Create Journey")));

  // Admin — frontend/docs/04-pages-specification.md Section 9. A single
  // "/admin/*" registration covers /admin itself and any nested admin
  // section added later (e.g. /admin/journeys), so each new admin page
  // doesn't need its own requireAuth() wrapping at registration time.
  router.add("/admin/*", requireAuth(router, createPlaceholder("Admin Dashboard")));
}
