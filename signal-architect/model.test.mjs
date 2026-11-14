import test from 'node:test';
import assert from 'node:assert/strict';
import { score, EXAMPLES } from './model.mjs';
test('published synthetic rows retain their Python priority and strength', () => {
  assert.deepEqual(EXAMPLES.map(x => { const s=score(x);return [s.priority,s.friction,s.category,s.strength]; }), [['P0',3,'Technical',80],['P2',2,'Sales',40],['P3',0,'Mixed',50]]);
});
test('removing hiring terms changes Northstar from P0 to P2 for an explicit reason', () => {
  const s=score({...EXAMPLES[0],description:'Security engineer building a product.'});
  assert.equal(s.priority,'P2');assert.equal(s.friction,0);assert.match(s.reason,/Technical keywords alone/);
});
test('threshold and precedence distinguish all four tiers', () => {
  const row=(title,description)=>score({company:'Example',name:'Taylor',title,description});
  assert.equal(row('Engineer CTO security','sales sdr revenue').priority,'P0');
  assert.equal(row('Engineer','sales revenue').priority,'P1');
  assert.equal(row('Operations','sales revenue').priority,'P2');
  assert.equal(row('VP Sales','Operations').priority,'P3');
});
test('matches are case-insensitive, distinct, overlapping, and capped', () => {
  const s=score({title:'VP ENGINEERING CTO developer technical founder phd security infosec',description:'SDR sdr sdr revenue sales'});
  assert.equal(s.friction,3);assert(s.technicalMatches.includes('engineer'));assert(s.technicalMatches.includes('vp engineering'));assert.equal(s.strength,100);
});
test('empty and tied input keep the original Mixed rule', () => {
  assert.equal(score({}).priority,'P3');const tied=score({title:'CTO CRO'});assert.equal(tied.category,'Mixed');assert.equal(tied.strength,50);
});
