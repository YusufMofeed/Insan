#!/usr/bin/env python3
"""Static file server with SPA fallback, for local frontend development.

Serves this directory exactly like `python3 -m http.server`, except any
request for a path with no matching file on disk falls back to
index.html instead of returning 404. That fallback is required for the
SPA's client-side routes (e.g. /journeys/{id}, /admin/journeys,
/create-journey) to work on a direct URL load or a page refresh — not
only when reached by clicking a link inside the already-loaded app.

Usage (run from anywhere; always serves this file's own directory):
    python3 serve.py [port]      # default port: 5501
"""

import http.server
import os
import sys


class SPARequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        requested_path = self.translate_path(self.path.split("?", 1)[0])
        if not os.path.isfile(requested_path):
            self.path = "/index.html"
        return super().do_GET()


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5501
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = http.server.HTTPServer(("", port), SPARequestHandler)
    print(f"Serving {os.getcwd()} with SPA fallback at http://localhost:{port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
