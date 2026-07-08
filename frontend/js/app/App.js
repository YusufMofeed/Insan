// Application initialization only. No business logic beyond restoring auth
// state from a previously stored token — frontend/docs/03-project-structure.md
// Section 5 (app.js) and 05-api-integration.md Section 13: authState must be
// initialized before the first render, or a page reload would show a logged
// -out navbar/route guards until the next explicit login() call.

import { Router } from "../router/Router.js";
import { registerRoutes } from "./routes.js";
import { authState } from "../auth/authState.js";

export function initApp() {
  authState.initialize();

  const router = new Router({ rootElementId: "app" });
  registerRoutes(router);
  router.start();
}
