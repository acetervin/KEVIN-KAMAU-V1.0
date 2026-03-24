#!/usr/bin/env python3
"""
Simple HTTP server for the Portfolio website
Run this to serve the website on localhost
"""

import http.server
import socketserver
import os
from pathlib import Path

# Get the directory where this script is located
BASE_DIR = Path(__file__).parent.absolute()

# Change to the website directory
os.chdir(BASE_DIR)

# Configure server
PORT = 8000
HANDLER = http.server.SimpleHTTPRequestHandler

class MyHTTPRequestHandler(HANDLER):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def log_message(self, format, *args):
        # Custom logging
        print(f"[{self.log_date_time_string()}] {format % args}")

# Create server
with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"""
╔════════════════════════════════════════╗
║    Portfolio Website Server Running    ║
╚════════════════════════════════════════╝

📍 Local:   http://localhost:{PORT}
📍 Network: http://<your-ip>:{PORT}

Press CTRL+C to stop the server
    """)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n✓ Server stopped gracefully")
