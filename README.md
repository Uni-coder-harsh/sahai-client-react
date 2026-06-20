# SahAI Web Client: Vite React Application

This directory contains the frontend client (`sahai-client-react`) for the SahAI platform. It is a single-page web application built using **React** and **Vite** with vanilla CSS design styling, featuring Outfit typography, radial dark backgrounds, dynamic interactive graphs, and telemetry HUD console overlays.

---

## ⚛️ User Interfaces & Screen Controllers

The React application implements the following pages and modals:

1. **Guest Landing Page**: Distinguishes the student diagnostic entry from B2B2C institutional access points, featuring sitemaps and super-admin whitelisting guidelines.
2. **Auth Screen**: Login and registration switching, password constraints, security validations, and local AES-256 session token caching.
3. **Personalization Screen**: Gathers academic streams, semesters, and targets (such as GATE papers), with warning screens blocking non-CS domains ("*we are still in progress...*").
4. **Initial Diagnostic Test**: Renders the 10 seeded MCQ diagnostic questions. Tracks reading velocity, latency duration, and option switch triggers.
5. **Interactive Skill Mesh Graph**: Renders the 10 Python CS subtopics dynamically using `react-force-graph-2d`. Nodes expand/shrink based on expected mastery ($E[K]$) and link weights represent prerequisite connections ($W_{pre}$ and $W_{diag}$).
6. **LeetCode-Style Question Bank**: A unified test panel showing MCQ, Code compiler, and Handwriting scanner questions:
   * Conditionally renders only the MCQ options list when options are seeded.
   * Renders the **Monaco IDE editor** code scratchpad and execution compiler logs for programming questions.
   * Renders the Base64 image scanner uploader for handwritten derivation questions.
7. **Diagnostics & Behavior Audit Screen**: Visualizes detailed student cognitive indicators, behavior compliance logs (Cheating/Plagiarism, Guessing, Shotgun debugging), and explains learning rate update modifiers.
8. **B2B2C HOD Institutional Portal**: Dedicated faculty dashboard workspace displaying pending staff approvals, role validations, and cohort-wide aggregate concept bottlenecks (where critical bottleneck concepts are visually highlighted in red with expanded node sizes).
9. **Telemetry Log Console Overlay**: Translucent monospace terminal HUD console floating in the bottom-right corner. Subscribes to custom window event interceptors, rendering logs for network pings, ML inference runs, and Bayesian mastery updates in real-time.

---

## 🏗️ State & Networking Core

* **HTTP Services & Cache Busting**: Configured in `src/services/api.js`. Attaches custom session tokens inside requests' authorization headers. Implements query-parameter cache-busting (`_t=Date.now()`) on key state fetches (such as `/cognitive-state` and `/curriculum/:domain`) to prevent stale memory caching.
* **API Base URL Auto-Correction**: Sanitizes Base URLs to resolve absolute HTTP/HTTPS protocols and ensure `/api` suffixes are automatically appended if omitted by the user, avoiding connection drops in production.
* **AES-256 Payload Encryption**: Encrypts outbound student interaction metrics on-the-fly using the Web Crypto API, aligning with Node gateway decryption parameters.
* **Vercel Routing Rewrites**: Built-in [vercel.json](file:///home/harsh/Desktop/SahAI/SahAI/clients/react/vercel.json) rewrite configurations mapping all subpaths back to `index.html` to avoid 404 blank reloads on refreshes.

---

## 📂 Submodule Directory Layout

* `src/main.jsx` - Root mounting, routes initialization (HashRouter configuration resolving static file routing on Vercel), and Telemetry logs context providers.
* `src/App.jsx` - Core shell containing collapsible/hover-toggle navigation sidebars, session-restore checks, private screens auth gates, and top navigation row overlays.
* `src/components/` - Renders modular screen pages (Auth, Personalization, Initial MCQ Test, Dashboard, Skill Mesh, Question Bank, Diagnostics, Profile, and Admin/HOD panels).
* `src/services/` - Centralized API fetch controllers (`api.js`) and telemetry hook interceptors (`telemetryHooks.js`).
* `src/utils/` - Standalone browser AES payload encryptors (`crypto.js`).
* `src/index.css` - Custom styling declarations, Outfit fonts, neon color tokens, custom inputs, transitions, and mobile grid media overrides.

---

## 🚀 Execution & Command Reference

### 1. Requirements
Ensure Node.js 18+ and npm are installed.

### 2. Environment Variables
Add your compilation settings inside your environment variables or in `.env` inside the client folder:
* `VITE_AES_SECRET_KEY` - Symmetric key matching Node API.
* `API_URL` - Base URL targeting Express Gateway API.

### 3. Running Locally
To launch the hot-reloading development server on port 5173:
```bash
npm install
npm run dev
```

### 4. Build for Production
To compile the static production bundle:
```bash
# Inject compile-time API target environment variable
npx vite build
```
This outputs production files to `dist/`, which are automatically read and served statically by the Node.js API Gateway.
