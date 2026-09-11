# conversation_id — the bridge between site analytics and Basin::Nexus

## What it is

A short random identifier minted the moment a visitor **actually engages**:

- completes the Signal-to-Action diagnostic (`/diagnostic/`)
- requests their score + recommendations by email
- clicks a session CTA (`data-lb-engage`)
- submits the contact intake (working session or otherwise)

It is **not** created for passive pageviews. Browsing is anonymous; engagement gets a thread.

## Format

```
conv-YYYYMMDD-xxxxxx
```

Example: `conv-20260910-a3f9k2`

- `conv-` prefix so the id is greppable and self-describing.
- Date stamp (visitor's local date) for rough cohorting.
- 6 random base36 characters from `crypto.getRandomValues`.

## Lifecycle

- Created by `assets/js/conversation.js` (`window.lbConversation.ensure()`).
- Stored in `sessionStorage` only (`lb:conversation:id:v1`). One id per browser session; it never follows the visitor across sessions or devices.
- Contains no PII. It is random — it cannot be reversed into a person. The HMAC-hashed visitor token in the analytics pipeline stays separate.

## Where it is attached

| Surface | Field | How |
|---|---|---|
| Every analytics event (`assets/js/insights.js`) | `conversation` (top-level, empty string until engagement) | read from `lbConversation.get()` on each send |
| CTA clicks with `data-lb-engage` | `detail.conversation_id` | `ensure()` runs before the event records |
| Contact intake payload (`assets/js/contact-form.js`) | `conversation_id` | `ensure()` on submit |
| Diagnostic score-email payload (`/diagnostic/`) | `conversation_id` | minted at completion, reused at email request |

## Privacy

- Respects the existing collector contract: no raw IPs, GPC/DNT honored, owner opt-out honored.
- The id is meaningless without the visitor's own subsequent actions. It is a thread, not a profile.
- Contact details are still stored only on explicit form submission and removed after 180 days, per the analytics-worker README.

## Worker implementation (done 2026-09-10)

The edge collector persists the top-level `conversation` field as **blob 18** in `writeDataPoint` (`analytics/edge-collector/src/index.js`; blobs 1–17 unchanged, Analytics Engine allows 20). Empty string until engagement; cleaned to 32 chars max like every other blob. A conversation-journey query (`WHERE blob18 = ... ORDER BY timestamp ASC`) is in `analytics/edge-collector/queries.sql`.

Remaining follow-up: extend the worker dashboard with a "conversation journey" view. Manual stages (qualified opportunity, revenue) are annotated in the dashboard or in Basin::Nexus against the same id.

## The question it answers

> Which piece of Leon's work created this relationship, and what did that relationship become?

Source (UTM/referrer) → landing page → engagement (conversation_id minted) → email/intake (id in payload) → Leon's reply → opportunity → revenue. The id is the thread that ties the anonymous journey to the named relationship — without ever turning browsing into surveillance.
