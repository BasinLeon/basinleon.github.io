---
version: alpha
name: Leon Basin Studio
description: Quiet editorial craft on warm obsidian and archival paper surfaces, pairing Instrument Serif headlines with Manrope prose and JetBrains Mono indices.
colors:
  surface-obsidian: "#11100E"
  card-obsidian: "#181613"
  ink-obsidian: "#EEE9DE"
  muted-obsidian: "#BCB3A2"
  line-obsidian: "#403A30"
  accent-gold: "#D9AB45"
  surface-paper: "#F4F1EA"
  card-paper: "#EEEBE3"
  ink-paper: "#29251E"
  muted-paper: "#6B6256"
  line-paper: "#CCC4B5"
  accent-bronze: "#805D27"
typography:
  display-xl:
    fontFamily: Instrument Serif
    fontSize: 4.5rem
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  heading-lg:
    fontFamily: Instrument Serif
    fontSize: 3.25rem
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  heading-md:
    fontFamily: Instrument Serif
    fontSize: 2rem
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body-md:
    fontFamily: Manrope
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.65
  meta-mono:
    fontFamily: JetBrains Mono
    fontSize: 0.72rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.07em"
rounded:
  none: 0px
  xs: 2px
  sm: 4px
  pill: 999px
spacing:
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
components:
  page-surface-dark:
    backgroundColor: "{colors.surface-obsidian}"
    textColor: "{colors.ink-obsidian}"
    typography: "{typography.body-md}"
  page-surface-paper:
    backgroundColor: "{colors.surface-paper}"
    textColor: "{colors.ink-paper}"
    typography: "{typography.body-md}"
  card-editorial-dark:
    backgroundColor: "{colors.card-obsidian}"
    textColor: "{colors.ink-obsidian}"
    rounded: "{rounded.none}"
    padding: 24px
  card-editorial-paper:
    backgroundColor: "{colors.card-paper}"
    textColor: "{colors.ink-paper}"
    rounded: "{rounded.none}"
    padding: 24px
  button-primary:
    backgroundColor: "{colors.accent-gold}"
    textColor: "{colors.surface-obsidian}"
    rounded: "{rounded.none}"
    padding: 12px
    height: 44px
  button-primary-hover:
    backgroundColor: "{colors.ink-obsidian}"
    textColor: "{colors.surface-obsidian}"
    rounded: "{rounded.none}"
    padding: 12px
    height: 44px
  button-filter-active:
    backgroundColor: "{colors.card-obsidian}"
    textColor: "{colors.ink-obsidian}"
    rounded: "{rounded.none}"
    padding: 10px
    height: 44px
  button-filter-active-paper:
    backgroundColor: "{colors.card-paper}"
    textColor: "{colors.ink-paper}"
    rounded: "{rounded.none}"
    padding: 10px
    height: 44px
  input-search:
    backgroundColor: "{colors.card-obsidian}"
    textColor: "{colors.ink-obsidian}"
    rounded: "{rounded.none}"
    padding: 12px
    height: 48px
  input-search-paper:
    backgroundColor: "{colors.card-paper}"
    textColor: "{colors.ink-paper}"
    rounded: "{rounded.none}"
    padding: 12px
    height: 48px
---

## Overview

Leon Basin Studio is a single-surface editorial publication and GTM architecture portfolio built without third-party UI frameworks. Every page shares one calm visual grammar: hairline borders, generous measure, original ink-and-gold plate illustrations, and full dual-surface parity between **Warm Obsidian** (default dark reading surface) and **Archival Paper** (`data-reading-mode="paper"`).

The goal is print-like authority that stays effortless on iOS, iPadOS, and desktop displays. Structure comes from alignment, scale contrast, and hairline rules rather than heavy card chrome or decorative blur.

## Colors

### Warm Obsidian (Default)
- **Surface Obsidian (`#11100E`):** Continuous primary reading ground across navigation, editorial leads, catalog rows, and footer.
- **Card Obsidian (`#181613`):** Quiet stepped elevation for search inputs, active filter pills, reading-preference popovers, and framed plates.
- **Ink Obsidian (`#EEE9DE`):** Primary body and headline ink (~15.8:1 contrast on Surface Obsidian, WCAG AAA).
- **Muted Obsidian (`#BCB3A2`):** Secondary summaries, dates, and quiet metadata (~8.9:1 on Surface Obsidian, WCAG AAA).
- **Line Obsidian (`#403A30`):** 1px structural hairline rules separating zones, ledger rows, and artwork frames.
- **Accent Gold (`#D9AB45`):** Sole accent for section kickers, active indicators, focus rings, and interactive hovers (~8.7:1 on Surface Obsidian, WCAG AAA).

### Archival Paper (`data-reading-mode="paper"`)
- **Surface Paper (`#F4F1EA`):** Warm cotton-stock reading surface for daylight long-form reading.
- **Card Paper (`#EEEBE3`):** Subtle tonal lift for inputs, active chips, and framed shelves.
- **Ink Paper (`#29251E`):** Deep walnut-black prose ink (~13.3:1 on Surface Paper, WCAG AAA).
- **Muted Paper (`#6B6256`):** Secondary metadata and captions (~5.4:1 on Surface Paper, WCAG AA).
- **Line Paper (`#CCC4B5`):** Crisp architectural dividers and artwork mats.
- **Accent Bronze (`#805D27`):** Darkened antique gold calibrated for legible contrast on warm paper (~5.2:1 on Surface Paper, WCAG AA).

## Typography

Three curated families are loaded via a single Google Fonts request with `display=swap`:

- **Display (`Instrument Serif`, 400, normal & italic):** Page titles, section headers, ledger entry titles, and epigraph quotes. Tight line-height (`1.08`), negative tracking (`-0.01em`), and `text-wrap: balance`.
- **Prose & UI (`Manrope`, 400–700):** Body copy (`16px` / `1.65` line-height), navigation, search inputs (`max(16px, 1rem)` to prevent iOS Safari zoom), and buttons.
- **Index & Labels (`JetBrains Mono`, 400–500):** Section kickers (`0.72rem`, uppercase, `0.07em` tracking), dates, reading times, and fragment numbers.

Fluid scale uses continuous `clamp()` steps (`clamp(2.75rem, 6vw, 4.5rem)` for H1, `clamp(2rem, 4vw, 3.25rem)` for H2, `clamp(1.5rem, 3vw, 2.1rem)` for ledger entries) so headings transition smoothly from iPhone to ultrawide displays.

## Layout

- **Max Measure:** `1120px` content container with fluid inline gutter `clamp(16px, 4vw, 48px)`.
- **Editorial Spread (`#start-here`):** 12-column asymmetric split (`7fr 5fr`) on desktop (`>= 1024px`), balanced 2-column (`1fr 1fr`) on tablet (`640–1023px`), single column (`1fr`) on mobile (`< 640px`).
- **Reading Measure:** Body copy capped at `52ch–65ch` to protect reading rhythm.
- **Long-List Performance:** Catalog ledger rows apply `content-visibility: auto` with `contain-intrinsic-size: auto 96px` so 100+ archived entries stay fast on mobile Safari.
- **Touch & Safe Areas:** All interactive links, filter chips, selects, and buttons enforce a `44px` minimum tap height; bottom footers respect `env(safe-area-inset-bottom)`.

## Elevation & Depth

Depth is expressed through **tonal stepping and hairline borders**, not heavy drop shadows:

- **Level 0 (Ground):** `surface-obsidian` / `surface-paper` — continuous editorial canvas.
- **Level 1 (Inset / Active):** `card-obsidian` / `card-paper` bounded by `1px solid` hairline (`line-obsidian` / `line-paper`).
- **Level 2 (Modal / Overlay):** Native `<dialog>` chapbook reader and `Cmd+K` command palette with subtle backdrop blur and high-contrast border.
- **Motion Signature:** Decisive cubic easing `cubic-bezier(0.22, 1, 0.36, 1)` at `160ms–220ms` for hover reveals, image scale (`1.018`), and guarded `document.startViewTransition` switches. Never block first paint with scroll-reveal opacity `0`, and always honor `@media (prefers-reduced-motion: reduce)`.

## Shapes

- **Architectural Edges (`0px` radius):** Editorial plates, search inputs, ledger rows, filter tabs, and book cards use crisp square corners consistent with book plates and broadsheet typesetting.
- **Pill Tags (`999px` radius):** Reserved exclusively for floating reader action pills (`reader.js`) where soft geometry signals floating controls.
- **Image Ratios:** Explicit `width`, `height`, and CSS `aspect-ratio` on every `<picture>` (`16/9` or `5/2` essay plates, `16/10` room plates, `2/3` portrait book covers) to guarantee zero Cumulative Layout Shift (CLS).

## Components

- **Editorial Plate (`.lead-plate`):** Hairline-framed `<picture>` element serving responsive WebP with progressive JPEG fallback. Applies subtle `transform: scale(1.018)` on pointer hover and a warm museum mat border in Archival Paper mode.
- **Catalog Search & Filter Bar (`.catalog-tools`, `.catalog-subbar`):** Full-width `48px` search field with Lucide inline search SVG, keyboard `/` shortcut hint, clear button, horizontal scroll-snap filter lanes (`Featured`, `All`, `Operator`, `Builder`, `Human`, `Fiction`, `Saved`), quick topic chips, sort select, and random-entry action.
- **Archive Ledger Row (`.catalog-row`):** Two-column horizontal index row (`110px` mono metadata + title/excerpt + subtle hover arrow) with a hairline top divider and accent-gold left indicator on hover/focus.
- **Book Showcase Card (`.book-card`):** Side-by-side `2:3` portrait cover artwork paired with kicker, serif title, and external destination link.
- **Visual Study Folio (`.visual-study`):** Hairline-framed 3-plate gallery on `/blog/fiction/sam-and-ink/` showcasing original Sam & Ink artwork with `loading="lazy"` and museum captions.

## Do's and Don'ts

### Do
- Pair every visual change across both Warm Obsidian and Archival Paper modes and verify contrast ratios (>= 4.5:1 AA).
- Serve modern `<picture>` WebP + fallback JPEG assets with explicit `width`/`height`, `decoding="async"`, `fetchpriority="high"` on above-the-fold LCP plates, and `loading="lazy"` below the fold.
- Use crisp single-stroke Lucide inline SVGs (`stroke-width="1.75"`, `aria-hidden="true"`) sparingly as functional affordances (search, bookmark, RSS, arrows).
- Keep JavaScript zero-dependency, guarded, and resilient when `localStorage` or `startViewTransition` is unavailable.

### Don't
- Never use generic AI-slop aesthetics: no neon cyan/purple gradients, no floating glassmorphism bubbles over body prose, no glowing drop shadows, no gratuitous scroll-jacking, and no `opacity: 0` above-the-fold reveals.
- Never introduce background-color whipsaw between sections on `/blog/` or `/blog/fiction/sam-and-ink/`.
- Never set `<input>` or `<select>` font sizes below `16px` (prevents iOS Safari auto-zoom).
- Never duplicate helper meta-copy or cluttered button bars onto every fragment card.
