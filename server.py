#!/usr/bin/env python3
import http.server
import socketserver
import os
import json
import urllib.request
import urllib.error
from pathlib import Path

PORT = 8000
WEB3FORMS_ACCESS_KEY = "fd79700d-67aa-41ca-bab0-81f556306515"

BASE_DIR = Path(__file__).parent.absolute()
os.chdir(BASE_DIR)

class PortfolioHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_POST(self):
        if self.path == '/api/contact':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))

                # Map the fields from form submission
                msg = data.get("message") or data.get("msg")

                web3_payload = {
                    "access_key": WEB3FORMS_ACCESS_KEY,
                    "name": data.get("name"),
                    "email": data.get("email"),
                    "subject": data.get("subject") or "New Portfolio Message",
                    "message": msg,
                    "from_name": "CodeNova Portfolio"
                }

                # Convert to JSON
                jsondata = json.dumps(web3_payload).encode("utf-8")

                # Create request with proper headers for Web3Forms
                req = urllib.request.Request(
                    "https://api.web3forms.com/submit",
                    data=jsondata,
                    headers={
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                )

                try:
                    with urllib.request.urlopen(req, timeout=10) as response:
                        result = json.loads(response.read().decode('utf-8'))
                        self.send_response(200)
                        self.send_header('Content-Type', 'application/json')
                        self.end_headers()
                        self.wfile.write(json.dumps(result).encode('utf-8'))
                        print(f"✓ Form submitted: {data.get('email')}")
                except urllib.error.HTTPError as e:
                    err_body = e.read().decode('utf-8')
                    try:
                        # Try to parse as JSON
                        err_json = json.loads(err_body)
                        err_msg = err_json.get("message", str(e))
                    except:
                        # If HTML (Cloudflare block), provide user-friendly message
                        err_msg = f"API Error {e.code}: Service temporarily unavailable"
                        print(f"✗ Web3Forms blocked (status {e.code}). Check access key or rate limiting.")

                    self.send_response(200)  # Return 200 to client with error details
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"success": False, "message": err_msg}).encode('utf-8'))

                except urllib.error.URLError as e:
                    print(f"✗ Network error: {str(e)}")
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"success": False, "message": "Network error. Please try again."}).encode('utf-8'))

            except Exception as e:
                print(f"✗ Server Error: {str(e)}")
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "message": "Server error processing request"}).encode('utf-8'))
        else:
            super().do_GET()

with socketserver.TCPServer(("", PORT), PortfolioHandler) as httpd:
    print(f"Terminal Server active at http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n✓ Stopped")
