import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import worker from '../worker/index.js';
import { coarseGeography, RECENT_SUMMARY_SQL, RECENT_PAGES_SQL, RECENT_SOURCES_SQL, COUNTRIES_SQL, REGIONS_SQL, GEO_COVERAGE_SQL } from '../worker/activity.js';

test('geography handles missing and non-geographic edge metadata', () => {
  assert.deepEqual(coarseGeography(), { country: '', region: '' });
  assert.deepEqual(coarseGeography({ country: 'T1', region: 'Tor' }), { country: '', region: '' });
  assert.deepEqual(coarseGeography({ country: 'us', region: '  New   York ' }), { country: 'US', region: 'New York' });
});

function database() {
  const db = new DatabaseSync(':memory:');
  for (const file of ['0001_initial.sql', '0002_contact_submissions.sql', '0003_conversation_id.sql', '0004_utm_content.sql', '0005_coarse_geography.sql']) {
    db.exec(readFileSync(new URL(`../migrations/${file}`, import.meta.url), 'utf8'));
  }
  return db;
}

test('activity deduplicates sessions, retains arrival source, and suppresses small geography groups', () => {
  const db = database();
  const put = db.prepare(`INSERT INTO events(received_at,event_type,page,session_hash,visitor_hash,campaign_source,geo_country,geo_region) VALUES(datetime('now',?),?,?,?,?,?,?,?)`);
  const add = (age,type,session,country='',region='',source='') => put.run(age,type,'/plays/untitled/',session,session,source,country,region);
  for (const session of ['a','b','c']) { add('-1 minutes','Pageview',session,'US','California','substack'); add('-1 minutes','Scroll Depth',session,'US','California'); }
  add('-10 minutes','Pageview','d','CA','Ontario','x');
  add('-40 minutes','Pageview','old','','','google');
  add('-1 minutes','Engaged Visit','old','','','');
  const recent = db.prepare(RECENT_SUMMARY_SQL).get();
  assert.equal(recent.sessions_5m,4); assert.equal(recent.sessions_30m,5);
  assert.equal(db.prepare(RECENT_PAGES_SQL).get().visits,5);
  assert.deepEqual(db.prepare(RECENT_SOURCES_SQL).all().map(r => [r.source,r.visits]), [['substack',3],['google',1],['x',1]]);
  assert.deepEqual(db.prepare(COUNTRIES_SQL).all('2000-01-01').map(r=>[r.country,r.visits]), [['US',3]]);
  assert.deepEqual(db.prepare(REGIONS_SQL).all('2000-01-01').map(r=>[r.region,r.visits]), [['California',3]]);
  const coverage = db.prepare(GEO_COVERAGE_SQL).get('2000-01-01');
  assert.equal(coverage.total_sessions,5); assert.equal(coverage.located_sessions,4);
  assert.equal(db.prepare(COUNTRIES_SQL).all('2999-01-01').length,0);
  db.close();
});

test('ingestion uses edge geography, ignores claimed client geography and IP, and dashboard stays private', async () => {
  const db = database();
  const env = { HASH_SECRET: 'unit-test-key', ADMIN_TOKEN:'owner-test', ALLOWED_ORIGINS:'https://basinleon.github.io', DB: {
    prepare(sql) { let values=[]; return { bind(...args) { values=args;return this; }, async run() { return db.prepare(sql).run(...values); } }; }
  }};
  const request = new Request('https://example.com/v1/event', { method:'POST',headers:{origin:'https://basinleon.github.io','content-type':'application/json'},body:JSON.stringify({v:1,type:'Pageview',page:'/',session:'test-session',visitor:'test-visitor',country:'CA',city:'fake',ip:'1.2.3.4'}) });
  Object.defineProperty(request,'cf',{value:{country:'US',region:'California',city:'Never store',latitude:'1',longitude:'2'}});
  assert.equal((await worker.fetch(request,env)).status,202);
  const row = db.prepare('SELECT * FROM events').get();
  assert.equal(row.geo_country,'US'); assert.equal(row.geo_region,'California');
  assert.equal(row.city,undefined); assert.equal(row.ip,undefined); assert.notEqual(row.visitor_hash,'test-visitor');
  assert.equal((await worker.fetch(new Request('https://example.com/v1/dashboard'),env)).status,401);
  db.close();
});

test('authenticated dashboard executes every query on the migrated database', async () => {
  const db = database();
  const env = { ADMIN_TOKEN:'owner-test', DB: {
    prepare(sql) { return { sql, values:[], bind(...args) { this.values=args; return this; } }; },
    async batch(statements) { return statements.map(s => ({results: db.prepare(s.sql).all(...s.values)})); }
  }};
  const response = await worker.fetch(new Request('https://example.com/v1/dashboard?days=365', {headers:{authorization:'Bearer owner-test'}}), env);
  assert.equal(response.status,200);
  const data = await response.json();
  assert.equal(data.recent_activity.sessions_5m,0);
  assert.equal(data.geography.located_sessions,0);
  assert.deepEqual(data.geography.countries,[]);
  assert.ok(data.trend.length >= 365);
  db.close();
});
