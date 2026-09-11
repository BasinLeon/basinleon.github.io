# UTM Conventions — basinleon.github.io

Attribution exists to answer one question: **which piece of Leon's work created a relationship, and what did that relationship become?** Tag the source of every outbound journey. Keep values lowercase kebab-case.

## Source taxonomy

| Distribution path | `utm_source` | `utm_medium` | `utm_content` |
|---|---|---|---|
| X post | `x` | `social` | `post` |
| X profile bio link | `x` | `social` | `profile-bio` |
| LinkedIn post | `linkedin` | `social` | `post` |
| LinkedIn profile / featured | `linkedin` | `social` | `profile-bio` |
| Substack post / note | `substack` | `newsletter` | `post` |
| Substack welcome / about page | `substack` | `newsletter` | `evergreen` |
| Site contextual close → Substack | `site` | `contextual-close` | `subscribe` |
| Email signature | `email-signature` | `signature` | — |
| Direct introduction | person or connector slug | `introduction` | — |
| Speaking appearance | event slug | `speaking` | — |
| Job application | company slug | `application` | — |

## Campaign naming

`utm_campaign=YYYY-MM-topic` for dated pushes, `evergreen` for permanent links.

Examples:
- `?utm_source=x&utm_medium=social&utm_content=post&utm_campaign=2026-09-diagnostic-launch`
- `?utm_source=linkedin&utm_medium=social&utm_content=profile-bio&utm_campaign=evergreen`

## Sources without UTMs

Some sources carry no tags and are detected by other means — keep them separately attributable in the dashboard:

- **direct** — empty referrer, no UTMs. Someone typed the URL or used a bookmark.
- **referral** — referrer hostname is a site that is not a search engine, AI assistant, or tagged source.
- **organic-search** — referrer hostname is google, bing, duckduckgo, etc.
- **ai-referral** — referrer is chatgpt.com, claude.ai, perplexity.ai, gemini.google.com, copilot, poe.com, you.com (already inferred by `assets/js/insights.js` as `utm_source=<assistant>`, `utm_medium=ai-referral`).

## Rules

1. Never invent a source value. If the journey didn't come from a tagged link, it is `direct`, `referral`, `organic-search`, or `ai-referral` — not a guess.
2. The site's own outbound share paths carry UTMs where the destination is Leon's own property (e.g. the contextual-close subscribe variant tags Substack). Third-party destinations stay untagged.
3. One campaign per push. A post promoting the diagnostic and a post promoting the working session are different campaigns, even on the same day.
4. `utm_content` distinguishes the placement (`post` vs `profile-bio`) so a bio link and a post don't merge into one number.

## Where this is enforced

- `assets/js/insights.js` reads `utm_source` / `utm_medium` / `utm_campaign` from the URL and attaches them to every event as `campaign`.
- `assets/js/contact-form.js` and the diagnostic email capture include the campaign in the private intake payload.
- The dashboard (`/analytics/dashboard/`) groups the money chain by resolved source.
