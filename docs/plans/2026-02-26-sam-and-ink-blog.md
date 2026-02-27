# Sam & Ink Editorial Blog Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a premium, literary-style Astro blog for `writing.basinleon.com` (hosted on GitHub Pages) with an editorial "Sam & Ink" aesthetic.

**Architecture:** Use Astro's Content Collections for type-safe Markdown management. Tailored editorial design with Playfair Display and EB Garamond. Automated deployment via GitHub Actions.

**Tech Stack:** Astro, Vanilla CSS, GitHub Pages, Google Fonts (Editorial Serif Stack).

---

### Task 1: Project Scaffolding
**Files:**
- Create: `basin-writing/package.json`
- Create: `basin-writing/astro.config.mjs`
- Create: `basin-writing/tsconfig.json`

**Step 1: Create package.json**
```json
{
  "name": "basin-writing",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "^4.0.0"
  }
}
```

**Step 2: Create astro.config.mjs**
```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://writing.basinleon.com',
  outDir: './dist',
});
```

**Step 3: Commit initial scaffold**
```bash
cd "/Users/basin/Desktop/Basin & Associates 🌍/basin-writing"
git init
git add .
git commit -m "chore: initial astro scaffold"
```

---

### Task 2: Design System & Base Layout
**Files:**
- Create: `basin-writing/src/styles/global.css`
- Create: `basin-writing/src/layouts/BaseLayout.astro`

**Step 1: Implement global.css (Editorial tokens)**
```css
:root {
  --bg: #fdfcf0; /* Warm paper */
  --text: #1a1a1a;
  --text-dim: #5c5c5c;
  --accent: #c04e2e; /* Terracotta */
  --font-serif: "EB Garamond", serif;
  --font-display: "Playfair Display", serif;
  --font-sans: "Inter", sans-serif;
}
/* Base styles... */
```

**Step 2: Create BaseLayout.astro**
Include Google Fonts imports, layout shell, header, and footer.

---

### Task 3: Content Collection & Initial Posts
**Files:**
- Create: `basin-writing/src/content/config.ts`
- Create: `basin-writing/src/content/writing/revenue-is-an-engineering-problem.md`

**Step 1: Define Collection**
Define `writing` collection with schema (title, pubDate, tags, description).

**Step 2: Port initial essays**
Port the 4 existing essays into the `src/content/writing/` folder.

---

### Task 4: Homepage & Post Rendering
**Files:**
- Create: `basin-writing/src/pages/index.astro`
- Create: `basin-writing/src/pages/writing/[...slug].astro`

**Step 1: Implement Index**
Fetch and sort posts by date, render editorial list.

**Step 2: Implement Post View**
Render Markdown content using `<Content />`.

---

### Task 5: GitHub Actions & Deployment
**Files:**
- Create: `basin-writing/.github/workflows/deploy.yml`
- Create: `basin-writing/public/CNAME`

**Step 1: Create deploy workflow**
GitHub Action to build and deploy to `gh-pages` branch.

**Step 2: Add CNAME**
Set content to `writing.basinleon.com`.
