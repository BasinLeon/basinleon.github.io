import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../../assets/js/insights.js', import.meta.url), 'utf8');
const start = source.indexOf('  function conversionDetail(');
const end = source.indexOf('  function updateActiveTime', start);
const classify = vm.runInNewContext(source.slice(start, end) + '\nconversionDetail');
function intent(label, type = 'Email Click', destination = 'email') {
  return classify({}, { type, detail: { label, destination, region: 'article' } });
}
test('email sharing is reader interest, not a sales inquiry', () => {
  for (const label of ['Article: share by email', 'Fiction: share by email']) {
    assert.equal(intent(label).category, 'Reader interest');
    assert.equal(intent(label).action, 'share');
  }
});
test('subscription click is outbound intent, not a confirmed subscriber', () => {
  assert.equal(intent('Writing: subscription outbound', 'Outbound Click', 'basinandassociates.substack.com').action, 'subscription-outbound');
});
test('emailing Leon remains commercial intent', () => {
  assert.equal(intent('Write to Leon').category, 'Commercial intent');
});
test('reader email shares cannot trigger implicit hiring email steps', () => {
  assert.ok(source.includes('item.type === "Email Click" && conversion?.category === "Commercial intent"'));
});

test('article replies stay reader interest instead of hiring intent', () => {
  for (const label of ['Writing: reply', 'Writing: reader reply']) {
    assert.equal(intent(label).category, 'Reader interest');
    assert.equal(intent(label).action, 'reader-reply');
  }
});
test('next-piece clicks have a distinct reader action', () => {
  assert.equal(intent('Writing: read next', 'Internal Click', '/blog/posts/fragment-15.html').action, 'read-next');
});
test('resume PDF downloads are distinct from proof-page visits', () => {
  assert.equal(intent('Resume: public PDF download', 'Download', '/assets/downloads/Leon-Basin-Public-Resume.pdf').action, 'resume-download');
  assert.equal(intent('Resume: public PDF download', 'Download', '/assets/downloads/Leon-Basin-Public-Resume.pdf').category, 'Commercial intent');
});
