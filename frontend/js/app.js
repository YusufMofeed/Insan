// Application entry point. ES module scripts are deferred by the browser
// until the DOM is parsed, so initApp can run immediately here without a
// DOMContentLoaded wrapper. All actual initialization logic lives in
// js/app/App.js — this file only triggers it.

import { initApp } from "./app/App.js";

initApp();
