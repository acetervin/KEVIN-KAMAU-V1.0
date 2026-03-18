# Kevin Kamau — Software Engineer Portfolio

A modern, interactive portfolio website for Kevin Kamau, a Software Engineering student at Kirinyaga University. This project features a unique terminal-style loader, 3D interactive elements, and a multi-language (English/Arabic) interface.

## Features

- **Interactive 3D Elements:** Powered by Three.js for an engaging visual experience.
- **Terminal Loader:** A custom-built terminal simulation during the initial load.
- **Multi-language Support:** Seamlessly switch between English and Arabic.
- **Dynamic UI:** Responsive design with smooth transitions and a modern aesthetic.
- **Project Showcase:** Highlights key projects like Allen's Kitchen and Admin Dashboard.
- **Mini-games:** Built-in interactive experiences (accessible via `script/games.js`).
- **Dark/Light Mode:** Toggleable themes for better accessibility.

## Built With

- **Frontend:** HTML5, CSS3, JavaScript (ES6+), Three.js
- **Styling:** Custom Vanilla CSS with a focus on typography and layout.
- **Backend (Development):** Python-based simple HTTP server for local hosting.
- **Icons:** Font Awesome 6.

## Project Structure

```text
├── index.html          # Main entry point
├── styles.css          # Core styling and layout
├── server.py           # Local development server with CORS support
├── run_server.bat      # Windows batch script to launch the server
└── script/             # JavaScript logic
    ├── games.js        # Logic for interactive mini-games
    ├── loader.js       # Custom terminal-style loading sequence
    ├── three-setup.js  # 3D canvas and Three.js initialization
    ├── translations.js # English and Arabic text content
    ├── ui-core.js      # Core UI interactions (theme, navigation)
    └── main.js         # Entry point for JavaScript
```

## Local Development

To run this project locally, you'll need Python installed.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/acetervin/acetervin.github.io.git
   cd acetervin.github.io
   ```

2. **Start the server:**
   - **Windows:** Double-click `run_server.bat` or run `python server.py`.
   - **macOS/Linux:** Run `python3 server.py`.

3. **Open in browser:**
   Navigate to `http://localhost:8000`.

## Contact

- **GitHub:** [@acetervin](https://github.com/acetervin)
- **LinkedIn:** [Kevin Kamau](https://www.linkedin.com/in/devkevin75/)
- **Twitter/X:** [@Realcrptonite](https://x.com/Realcrptonite)

---
© 2026 Kevin Kamau — Built with precision.
