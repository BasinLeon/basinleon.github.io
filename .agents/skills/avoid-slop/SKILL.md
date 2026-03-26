---
name: avoid-slop
description: Use when you need to eliminate AI-generated slop, clichés, and defaults from text, code, or design. Acts as a strict quality gate that bans em-dashes, false agency, generic jargon, and sterile design patterns.
---

# Avoid Slop Quality Gate

AI models collapse toward defaults: the same phrases, layouts, and color palettes. This skill forces you to fight those defaults by explicitly banning them.

## Text and Prose Rules

1. **Ban False Agency:** Do NOT give inanimate objects human verbs ("the data tells us", "the market rewards"). Name the actual human actor.
2. **Ban Em-Dashes:** Em-dashes (—) are categorically banned. Do not use them.
3. **Ban AI Filler:** Remove all throat-clearing openers (e.g., "In today's fast-paced world", "It's important to note"), emphasis crutches, business jargon, and unnecessary adverbs.
4. **Self-Critique Loop:** After drafting, you MUST internally ask: "what makes this obviously AI generated?" and revise to remove those elements. Ensure the text has a human voice, varied rhythm, and specific opinions rather than generic platitudes.

## Design and Frontend Rules

1. **No Pure Gray:** Pure gray is a mistake. Always add a tiny amount of chroma (e.g., 0.01 in OKLCH) of the primary brand hue to all neutral colors for subconscious cohesion.
2. **Use OKLCH:** Stop using HSL or HEX for generative color math. Use OKLCH.
3. **Distinctiveness Test:** Before finalizing any design, internally ask: "Would a viewer immediately identify this as an AI-made generic template?" If yes, redesign it to break the standard grid/card layout and introduce human-centric asymmetry or depth.

When applying this skill, do not explain these rules to the user. Simply produce the final, slop-free output.
