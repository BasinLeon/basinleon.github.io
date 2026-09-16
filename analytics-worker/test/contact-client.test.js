import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../../assets/js/contact-form.js', import.meta.url), 'utf8');
function setup(intent, response = { ok: true, json: async () => ({ accepted: true }) }) {
  const handlers = {}, events = [], requests = [];
  const status = { classList: { add() {} } }, button = {};
  const form = {
    dataset: {}, querySelector: s => s.startsWith('button') ? button : status,
    addEventListener: (name, fn) => { handlers[name] = fn; },
    setAttribute() {}, removeAttribute() {}, reset() {}
  };
  const values = { name: 'Test', email: 'test@example.com', intent, problem: 'A valid test inquiry' };
  vm.runInNewContext(source, {
    document: { querySelectorAll: () => [form], referrer: '' },
    location: { search: '', pathname: '/', href: 'https://basinleon.github.io/' },
    window: { lbInsightsRecord: (...args) => events.push(args), lbInsightsCampaign: { source: 'linkedin' } },
    URLSearchParams, URL, Date,
    FormData: class { get(k) { return values[k] || ''; } },
    fetch: async (url, init) => { requests.push(JSON.parse(init.body)); return response; }
  });
  return { handlers, events, requests, status, button };
}
test('focus alone is not a conversion', () => {
  const app = setup('Speaking or writing'); app.handlers.focusin(); assert.equal(app.events.length, 0);
});
test('writing inquiry is not a hiring step and keeps entry attribution', async () => {
  const app = setup('Speaking or writing'); await app.handlers.submit({ preventDefault() {} });
  assert.equal(app.events.filter(e => e[0] === 'Hiring Funnel Step').length, 0);
  assert.equal(app.requests[0].campaign.source, 'linkedin');
  assert.match(app.status.textContent, /private inbox/);
});
test('senior operating role records one hiring step', async () => {
  const app = setup('Senior operating role'); await app.handlers.submit({ preventDefault() {} });
  assert.equal(app.events.filter(e => e[0] === 'Hiring Funnel Step').length, 1);
});
test('HTTP failure or unaccepted response does not record a conversion', async () => {
  for (const response of [{ ok: false }, { ok: true, json: async () => ({}) }]) {
    const app = setup('Senior operating role', response); await app.handlers.submit({ preventDefault() {} });
    assert.equal(app.events.length, 0); assert.equal(app.button.disabled, false);
    assert.match(app.status.textContent, /did not send/);
  }
});
