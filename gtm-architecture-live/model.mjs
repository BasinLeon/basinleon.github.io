const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value) || 0));

const LIMITS = {
  intent: 30,
  fit: 30,
  urgency: 20,
  trust: 20,
};

export function computeScore({ intent, fit, urgency, trust }) {
  const i = clamp(intent, 0, LIMITS.intent);
  const f = clamp(fit, 0, LIMITS.fit);
  const u = clamp(urgency, 0, LIMITS.urgency);
  const t = clamp(trust, 0, LIMITS.trust);
  return i + f + u + t;
}

export function tierFromScore(score) {
  const s = clamp(score, 0, 100);
  if (s >= 75) return 'Act Now';
  if (s >= 50) return 'Nurture This Week';
  return 'Ignore / Archive';
}

export function nextBestLever({ intent, fit, urgency, trust }) {
  const current = {
    intent: clamp(intent, 0, LIMITS.intent),
    fit: clamp(fit, 0, LIMITS.fit),
    urgency: clamp(urgency, 0, LIMITS.urgency),
    trust: clamp(trust, 0, LIMITS.trust),
  };

  const headroom = Object.keys(current).map((key) => ({
    key,
    delta: LIMITS[key] - current[key],
  }));

  headroom.sort((a, b) => b.delta - a.delta);
  return headroom[0];
}

export function explainTier(tier) {
  if (tier === 'Act Now') return 'Launch direct outreach now with clear CTA and owner assignment.';
  if (tier === 'Nurture This Week') return 'Run a nurture sequence this week and collect one stronger intent signal.';
  return 'Park this account and redirect energy to higher-signal opportunities.';
}

const normalized = (s) => ({
  intent: clamp(s.intent, 0, LIMITS.intent),
  fit: clamp(s.fit, 0, LIMITS.fit),
  urgency: clamp(s.urgency, 0, LIMITS.urgency),
  trust: clamp(s.trust, 0, LIMITS.trust),
});

export function compareSnapshots(before, after) {
  const b = normalized(before);
  const a = normalized(after);
  const beforeScore = computeScore(b);
  const afterScore = computeScore(a);
  return {
    before: b,
    after: a,
    beforeScore,
    afterScore,
    delta: afterScore - beforeScore,
    beforeTier: tierFromScore(beforeScore),
    afterTier: tierFromScore(afterScore),
  };
}

export function simulationSteps() {
  return [
    { label: 'Cold', values: { intent: 7, fit: 9, urgency: 5, trust: 4 } },
    { label: 'Warm', values: { intent: 16, fit: 18, urgency: 10, trust: 11 } },
    { label: 'Hot', values: { intent: 27, fit: 24, urgency: 17, trust: 15 } },
  ];
}

export function projectKpis(score) {
  const s = clamp(score, 0, 100);
  const tier = tierFromScore(s);
  let meetingRatePct = 4;
  let sqlProbabilityPct = 2;
  if (tier === 'Nurture This Week') {
    meetingRatePct = 10 + Math.round((s - 50) * 0.35);
    sqlProbabilityPct = 6 + Math.round((s - 50) * 0.2);
  }
  if (tier === 'Act Now') {
    meetingRatePct = 20 + Math.round((s - 75) * 0.4);
    sqlProbabilityPct = 12 + Math.round((s - 75) * 0.25);
  }
  return { tier, meetingRatePct, sqlProbabilityPct };
}

export function confidenceMeter({ intent, fit, urgency, trust }) {
  const d = normalized({ intent, fit, urgency, trust });
  const score = computeScore(d);
  const flags = [];
  if (d.trust < 8) flags.push('Low trust signal: add proof or referral path.');
  if (d.urgency < 8) flags.push('Low urgency: add trigger-based timing.');
  if (d.intent < 10) flags.push('Weak intent: improve signal source quality.');
  if (d.fit < 12) flags.push('Weak fit: tighten ICP before outreach.');
  return { score, flags, confidencePct: Math.max(10, Math.min(95, 100 - flags.length * 18)) };
}

const OBJECTION_MAP = {
  low_trust: {
    label: 'Low trust',
    response: 'Lead with proof: one quantified case + one low-friction pilot CTA to build credibility fast.',
  },
  no_urgency: {
    label: 'No urgency',
    response: 'Anchor to a time-bound trigger and the cost of delay; convert abstract pain into dated impact.',
  },
  poor_fit: {
    label: 'Poor fit',
    response: 'Disqualify quickly or reposition to a tighter ICP slice where your value is obvious.',
  },
};

export function objectionResponse(key) {
  return OBJECTION_MAP[key] || {
    label: 'General objection',
    response: 'Clarify the blocker, restate expected outcome, and propose one measurable next step.',
  };
}

export { LIMITS };
