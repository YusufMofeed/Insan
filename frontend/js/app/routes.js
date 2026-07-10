// Route registration only. frontend/docs/04-pages-specification.md defines
// what each route will eventually be. "/", "/login", "/register",
// "/journeys", "/journeys/:id", "/profile", and "/admin" have real pages
// so far; every other route still uses a placeholder handler. Which
// routes require/forbid authentication is applied here too, via the guard
// helpers in js/auth/routeGuards.js (05-api-integration.md Section 15) —
// the guards are written once and reused per protected route, not
// reimplemented per page.

import { createMainLayout } from "../layouts/MainLayout.js";
import { createHomePage } from "../pages/HomePage.js";
import { createLoginPage } from "../pages/LoginPage.js";
import { createRegisterPage } from "../pages/RegisterPage.js";
import { createJourneysPage } from "../pages/JourneysPage.js";
import { createJourneyDetailsPage } from "../pages/JourneyDetailsPage.js";
import { createProfilePage } from "../pages/ProfilePage.js";
import { createAdminDashboardPage } from "../pages/AdminDashboardPage.js";
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
  router.add("/journeys", () => createMainLayout({ router, content: createJourneysPage() }));
  router.add("/journeys/:id", () => createMainLayout({ router, content: createJourneyDetailsPage() }));

  // Authenticated — frontend/docs/04-pages-specification.md Section 8, 4
  router.add("/profile", requireAuth(router, () => createMainLayout({ router, content: createProfilePage() })));
  router.add("/create-journey", requireAuth(router, createPlaceholder("Create Journey")));

  // Admin — frontend/docs/04-pages-specification.md Section 9. "/admin"
  // is registered before the "/admin/*" wildcard so the real dashboard
  // wins the exact-path match; the wildcard still catches nested admin
  // pages not built yet (e.g. /admin/journeys) with the placeholder,
  // already guarded, until each of those gets its own real page.
  router.add("/admin", requireAuth(router, () => createMainLayout({ router, content: createAdminDashboardPage() })));
  router.add("/admin/*", requireAuth(router, createPlaceholder("Admin Dashboard")));
}
