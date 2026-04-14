---
name: site-ops-migration-queue
description: Use to compare local data/posts.json against basinleon.com sitemap and produce move/leave/rewrite queues, import-ready JSON batches, and rewrite briefs.
---

# Site Ops Migration Queue

## Use When
- User is migrating essays/posts from basinleon.com.
- User wants a concrete Thursday queue (move/leave/rewrite).
- User requests import-ready JSON payloads.

## Inputs
- Local source: data/posts.json
- Remote source: https://www.basinleon.com/sitemap.xml

## Procedure
1. Parse remote sitemap URLs.
2. Normalize local post slugs from data/posts.json.
3. Compute missing remote slugs not present locally.
4. Classify each slug: move, rewrite, or leave.
5. Emit:
- Top 10 move JSON import batch
- Next 10 move JSON batch
- Rewrite briefs with title angle and 3 repositioning bullets

## Output JSON Shape
```json
{
  "source_url": "https://basinleon.com/YYYY/MM/DD/slug/",
  "date": "YYYY-MM-DD",
  "title": "Title Case",
  "target_slug": "slug",
  "target_url": "posts/slug.html",
  "category": "Blog",
  "tags": ["GTM", "Revenue Architecture", "RevOps"],
  "excerpt_stub": "A field note on ...",
  "migration_action": "move"
}
```

## Classification Heuristic
- move: GTM/revenue/AI/cybersecurity/systems/operator execution
- rewrite: strong ideas but needs reframing or deduping
- leave: weak, numeric, promo-only, or low-signal entries

## Done Criteria
- Queue totals provided.
- JSON batch is import-ready.
- Rewrite briefs are explicit and actionable.
