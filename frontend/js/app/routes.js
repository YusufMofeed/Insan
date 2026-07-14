// Route registration only. frontend/docs/04-pages-specification.md defines
// what each route will eventually be. "/", "/login", "/register",
// "/journeys", "/journeys/:id", "/profile", "/create-journey",
// "/edit-journey/:id", "/admin", and "/admin/journeys" have real pages so
// far; every other route still uses a placeholder handler. Which routes
// require/forbid authentication is applied here too, via the guard
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
import { createCreateJourneyPage } from "../pages/CreateJourneyPage.js";
import { createEditJourneyPage } from "../pages/EditJourneyPage.js";
import { createAdminDashboardPage } from "../pages/AdminDashboardPage.js";
import { createAdminJourneysPage } from "../pages/AdminJourneysPage.js";
import { requireAuth, requireRole, publicOnly } from "../auth/routeGuards.js";

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
  router.add("/register", publicOnly(router, () => createRegisterPage(router)));
  router.add("/journeys", () => createMainLayout({ router, content: createJourneysPage() }));
  router.add("/journeys/:id", ({ params }) => createMainLayout({ router, content: createJourneyDetailsPage(params.id) }));

  // Authenticated — frontend/docs/04-pages-specification.md Section 8, 4
  router.add("/profile", requireAuth(router, () => createMainLayout({ router, content: createProfilePage() })));
  router.add(
    "/create-journey",
    requireRole("Admin", router, () => createMainLayout({ router, content: createCreateJourneyPage(router) }))
  );
  router.add(
    "/edit-journey/:id",
    requireRole("Admin", router, ({ params }) => createMainLayout({ router, content: createEditJourneyPage(params.id, router) }))
  );

  // Admin — frontend/docs/04-pages-specification.md Section 9. Exact
  // admin paths are registered before the "/admin/*" wildcard so their
  // real pages win the match; the wildcard still catches nested admin
  // pages not built yet with the placeholder. "/admin/*" itself stays on
  // requireAuth (not requireRole) — it wasn't part of this guard's scope
  // and each nested admin page should get its own requireRole() call as
  // it's built, rather than the wildcard silently deciding that for pages
  // that don't exist yet.
  router.add("/admin", requireRole("Admin", router, () => createMainLayout({ router, content: createAdminDashboardPage() })));
  router.add(
    "/admin/journeys",
    requireRole("Admin", router, () => createMainLayout({ router, content: createAdminJourneysPage() }))
  );
  router.add("/admin/*", requireAuth(router, createPlaceholder("Admin Dashboard")));
}
