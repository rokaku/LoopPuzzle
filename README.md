# ☕ LoopPuzzle - Online Logic Loop Game

A lightweight, zero-build, single-page **Slitherlink-style** puzzle game.

> **Slitherlink** (also known as Loop the Loop) is a logic puzzle where you connect dots to form a single, non-intersecting closed loop based on number clues.

---

## 🎮 Features

- **Zero-Build & Pure Vanilla**: No Node.js / Vite build steps required. Simply open [`index.html`](./index.html) in any browser.
- **Light & Dark Theme**: Toggle between elegant Dark and clean Light themes seamlessly with persistent user preference.
- **Internationalization (i18n)**:
  - Dedicated language files in [`locales/en.js`](./locales/en.js) and [`locales/zh_tw.js`](./locales/zh_tw.js).
  - **Automatic Browser Language Detection**: Automatically matches your OS/browser language (e.g. Traditional Chinese for Chinese systems, English for others).
  - Instant manual language switching with preference saved in `localStorage`.
- **Pure SVG Vector Rendering**: Crisp lines, responsive scaling, and high-performance interactivity.
- **Smooth Gameplay & Controls**:
  - **Left Click & Drag**: Draw or erase lines quickly.
  - **Right Click**: Mark crosses (`✕`) to eliminate edges.
  - **Undo (`Ctrl + Z`)** & **Reset Board**.
- **Real-Time Topology & Constraint Validation**:
  - Automatically checks vertex degree $\le 2$ (prevents branches).
  - Highlights solved clues and warns on clue violations.
  - Validates single continuous closed loop using BFS connectivity check.
- **Preset Levels & Random Puzzle Generator**:
  - Handcrafted tutorial and challenge levels (5×5, 7×7, 8×8, 10×10).
  - Unlimited procedural random puzzle generation.
  - Timer and best time tracking per level (`localStorage`).

---

## 🚀 How to Play

Double click or open [`index.html`](./index.html) in your browser.

---

## 📄 License

MIT © 2026 rokaku — see [LICENSE](./LICENSE) for details.
