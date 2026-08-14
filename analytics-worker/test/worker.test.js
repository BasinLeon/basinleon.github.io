import test from "node:test";
import assert from "node:assert/strict";
import { isAutomatedRequest, normalizeEvent, rangeSelection } from "../worker/index.js";

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
  assert.equal(clean.since, "2026-08-14 00:00:00");

  const year = rangeSelection(new URL("https://example.com/v1/dashboard?days=365"));
  assert.equal(year.mode, "range");
  assert.equal(year.days, 365);
});
