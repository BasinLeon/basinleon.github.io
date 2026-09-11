import test from "node:test";
import assert from "node:assert/strict";
import worker, { isAutomatedRequest, normalizeContact, normalizeEvent, rangeSelection } from "../worker/index.js";

const base = {
  v: 1,
  type: "Pageview",
  page: "/index.html",
  session: "session-one",
  visitor: "visitor-one",
  campaign: {},
  detail: {}
};

test("normalizes a valid event without retaining excess input", () => {
  const event = normalizeEvent({ ...base, title: "  Leon   Basin  ", referrer: "google.com" });
  assert.equal(event.page, "/");
  assert.equal(event.title, "Leon Basin");
  assert.equal(event.referrer, "google.com");
  assert.equal(event.depth, null);
});

test("requires anonymous session and visitor identifiers", () => {
  assert.equal(normalizeEvent({ ...base, visitor: "" }), null);
  assert.equal(normalizeEvent({ ...base, session: "" }), null);
});

test("rejects unknown event types and schema versions", () => {
  assert.equal(normalizeEvent({ ...base, type: "Mystery" }), null);
  assert.equal(normalizeEvent({ ...base, v: 2 }), null);
});

test("bounds numeric event detail", () => {
  const depth = normalizeEvent({ ...base, type: "Scroll Depth", detail: { depth: 140 } });
  const reading = normalizeEvent({ ...base, type: "Reading Time", detail: { seconds: -20 } });
  assert.equal(depth.depth, 100);
  assert.equal(reading.seconds, 0);
});

test("accepts hiring funnel events and preserves the step", () => {
  const event = normalizeEvent({ ...base, type: "Hiring Funnel Step", detail: { step: "case-study" } });
  assert.equal(event.type, "Hiring Funnel Step");
  assert.equal(event.conversionAction, "case-study");
});

test("rejects automated and prefetch requests", () => {
  assert.equal(isAutomatedRequest(new Request("https://example.com", {
    headers: { "user-agent": "Mozilla/5.0 HeadlessChrome Playwright" }
  })), true);
  assert.equal(isAutomatedRequest(new Request("https://example.com", {
    headers: { purpose: "prefetch" }
  })), true);
});

test("allows ordinary browser requests", () => {
  assert.equal(isAutomatedRequest(new Request("https://example.com", {
    headers: { "user-agent": "Mozilla/5.0 Chrome/140.0 Safari/537.36" }
  })), false);
});

test("uses the clean measurement boundary without rewriting history", () => {
  const clean = rangeSelection(new URL("https://example.com/v1/dashboard?days=clean"));
  assert.equal(clean.mode, "clean");
  assert.equal(clean.since, "2026-08-14 21:22:00");

  const year = rangeSelection(new URL("https://example.com/v1/dashboard?days=365"));
  assert.equal(year.mode, "range");
  assert.equal(year.days, 365);
});

test("normalizes a valid private contact request", () => {
  const contact = normalizeContact({
    v: 1,
    name: " Leon Basin ",
    email: "LEON@example.com",
    company: "Example",
    intent: "Senior role",
    problem: "We need to build a repeatable public-sector motion.",
    page: "/work-with-me/",
    startedAt: Date.now() - 5000,
    campaign: { source: "linkedin", medium: "social", campaign: "operator-proof" }
  });
  assert.equal(contact.email, "leon@example.com");
  assert.equal(contact.page, "/work-with-me/");
  assert.equal(contact.campaignSource, "linkedin");
});

test("rejects malformed and too-fast contact requests", () => {
  assert.equal(normalizeContact({ v: 1, name: "Leon", email: "bad", problem: "Long enough problem", startedAt: Date.now() - 5000 }), null);
  assert.deepEqual(normalizeContact({
    v: 1,
    name: "Leon",
    email: "leon@example.com",
    problem: "This message is long enough.",
    startedAt: Date.now()
  }), { spam: true });
});

test("diagnostic-score intake accepts an empty name with a valid conversation", () => {
  const contact = normalizeContact({
    v: 1,
    type: "diagnostic-score",
    name: "",
    email: "reader@example.com",
    problem: "Diagnostic score 18/24. Weakest area: Follow-up. Answers: 2,3,1,2,3,2,1,2",
    startedAt: Date.now(),
    conversation_id: "conv-20260910-a3f9k2"
  });
  assert.ok(contact);
  assert.equal(contact.email, "reader@example.com");
  assert.equal(contact.conversationId, "conv-20260910-a3f9k2");
  assert.equal(contact.intakeType, "diagnostic-score");
});

test("diagnostic-score without a conversation still trips the timing heuristic", () => {
  assert.deepEqual(normalizeContact({
    v: 1,
    type: "diagnostic-score",
    name: "",
    email: "reader@example.com",
    problem: "Diagnostic score 18/24. Weakest area: Follow-up. Answers: 2,3,1,2,3,2,1,2",
    startedAt: Date.now(),
    conversation_id: ""
  }), { spam: true });
});

test("non-diagnostic intakes still require a name", () => {
  assert.equal(normalizeContact({
    v: 1,
    name: "",
    email: "reader@example.com",
    problem: "This message is long enough to pass.",
    startedAt: Date.now() - 5000
  }), null);
});

test("events and contacts carry the conversation id", () => {
  const event = normalizeEvent({ ...base, conversation: "conv-20260910-a3f9k2" });
  assert.equal(event.conversationId, "conv-20260910-a3f9k2");
  const detailEvent = normalizeEvent({ ...base, detail: { conversation_id: "conv-20260910-zz99" } });
  assert.equal(detailEvent.conversationId, "conv-20260910-zz99");
  const contact = normalizeContact({
    v: 1,
    name: "Leon",
    email: "leon@example.com",
    problem: "We need to build a repeatable public-sector motion.",
    startedAt: Date.now() - 5000,
    conversation_id: "conv-20260910-a3f9k2"
  });
  assert.equal(contact.conversationId, "conv-20260910-a3f9k2");
  assert.equal(contact.intakeType, "");
});

test("events and contacts carry utm_content without touching other campaign fields", () => {
  const event = normalizeEvent({
    ...base,
    campaign: { source: "x", medium: "social", campaign: "conversation_engine_2026_09", content: "reply" }
  });
  assert.equal(event.campaignContent, "reply");
  assert.equal(event.campaignSource, "x");
  assert.equal(event.campaignName, "conversation_engine_2026_09");

  const detailEvent = normalizeEvent({ ...base, detail: { utm_content: "post" } });
  assert.equal(detailEvent.campaignContent, "post");

  const topLevelEvent = normalizeEvent({ ...base, utm_content: "profile-bio" });
  assert.equal(topLevelEvent.campaignContent, "profile-bio");

  const contact = normalizeContact({
    v: 1,
    name: "Leon",
    email: "leon@example.com",
    problem: "We need to build a repeatable public-sector motion.",
    startedAt: Date.now() - 5000,
    campaign: { source: "x", medium: "social", campaign: "conversation_engine_2026_09", content: "reply" }
  });
  assert.equal(contact.campaignContent, "reply");

  // Missing content stays empty, never breaks normalization.
  const bare = normalizeEvent({ ...base, campaign: {} });
  assert.equal(bare.campaignContent, "");
});

test("dashboard keeps AI referrals, revenue steps and private contacts in their own fields", async () => {
  const resultSets = Array.from({ length: 12 }, () => ({ results: [] }));
  resultSets[0] = { results: [{ unique_visitors: 12, visits: 15, engaged_visits: 7, conversion_actions: 2 }] };
  resultSets[8] = { results: [{ source: "ChatGPT", visits: 2 }] };
  resultSets[9] = { results: [{ site_visits: 15, engaged_visits: 7, offer_visits: 3, commercial_action_visits: 1 }] };
  resultSets[10] = { results: [{ leads: 1 }] };
  resultSets[11] = { results: [{ id: 9, name: "Founder", email: "founder@example.com", problem: "Our activity is not becoming revenue." }] };

  const statement = { bind() { return this; } };
  const env = {
    ADMIN_TOKEN: "owner-token",
    RETENTION_DAYS: "400",
    DB: {
      prepare() { return statement; },
      async batch(statements) {
        assert.equal(statements.length, 12);
        return resultSets;
      }
    }
  };
  const response = await worker.fetch(new Request("https://example.com/v1/dashboard?days=30", {
    headers: { authorization: "Bearer owner-token" }
  }), env);
  const data = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(data.ai_referrals, [{ source: "ChatGPT", visits: 2 }]);
  assert.deepEqual(data.revenue_funnel, {
    site_visits: 15,
    engaged_visits: 7,
    offer_visits: 3,
    commercial_action_visits: 1,
    leads: 1
  });
  assert.equal(data.contact_submissions[0].email, "founder@example.com");
});
