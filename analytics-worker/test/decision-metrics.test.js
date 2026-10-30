import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {METRICS_SQL,EMAIL_SQL,compareMetrics,releasePeriods} from '../worker/decision-metrics.js';
import {releaseMarkers,healthAttention} from '../worker/system-state.js';
function database(){const d=new DatabaseSync(':memory:');d.exec(`CREATE TABLE events(received_at TEXT,event_type TEXT,visitor_hash TEXT,session_hash TEXT,page TEXT,conversion_action TEXT,destination TEXT);`);return d;}
test('canonical visits exclude event-only sessions and distinguish the two offer paths',()=>{
 const db=database(); const add=db.prepare('INSERT INTO events VALUES (?,?,?,?,?,?,?)');
 add.run('2026-10-16 12:00:00','Pageview','v','s','/working-session/','','');
 add.run('2026-10-16 12:01:00','Pageview','v','s','/working-session/','','');
 add.run('2026-10-16 12:00:00','Pageview','v2','s2','/work-with-me/','','');
 add.run('2026-10-16 12:00:00','Engaged Visit','v3','s3','/','','');
 const m=db.prepare(METRICS_SQL).get('2026-10-16','2026-10-17');
 assert.equal(m.visits,2);assert.equal(m.offer_visits,1);assert.equal(m.unique_visitors,2);db.close();
});
test('email route counts retain page and method while hiring sessions deduplicate',()=>{
 const db=database();const add=db.prepare('INSERT INTO events VALUES (?,?,?,?,?,?,?)');
 for(const [page,route,session] of [['/resume.html','email','one'],['/resume.html','gmail','one'],['/case-studies/','gmail','two'],['/blog/','email','three']])add.run('2026-10-16 12:00:00','Email Click','v',session,page,'',route);
 assert.equal(db.prepare(EMAIL_SQL).all('2026-10-16','2026-10-17').length,3);
 assert.equal(db.prepare(METRICS_SQL).get('2026-10-16','2026-10-17').email_actions,2);db.close();
});
test('attention never calls unavailable states clean and names current file findings',()=>{
 const health={error:'API unavailable',validators:[{name:'Public safety',status:'failure',files:['llms.txt','services/index.html']}],sitemap:{missing:[]}};
 const items=healthAttention(health,false);
 assert.equal(items.find(i=>i.kind==='validator').count,2);
 assert.match(items.find(i=>i.kind==='validator').label,/services\/index.html/);
 assert.ok(items.some(i=>i.kind==='unknown'));assert.ok(items.some(i=>i.kind==='owner'));
 assert.ok(!items.some(i=>i.kind==='sitemap'));
});
test('release comparison uses successful deduplicated markers and half-open periods',()=>{
 const markers=releaseMarkers([{head_sha:'a',head_branch:'main',conclusion:'success',updated_at:'2026-10-16T10:00:00Z'},{head_sha:'a',head_branch:'main',conclusion:'success',updated_at:'2026-10-16T11:00:00Z'},{head_sha:'b',head_branch:'main',conclusion:'failure',updated_at:'2026-10-15T10:00:00Z'},{head_sha:'c',head_branch:'main',conclusion:'success',updated_at:'2026-10-14T10:00:00Z'}]);
 assert.equal(markers.length,2);assert.equal(markers[0].at,'2026-10-16T11:00:00Z');
 const periods=releasePeriods(markers,new Date('2026-10-17T00:00:00Z'));
 assert.equal(periods.previous.until,periods.current.since);
 assert.equal(compareMetrics({visits:3},{visits:2}).visits.delta,1);
 const db=database();db.prepare('INSERT INTO events VALUES (?,?,?,?,?,?,?)').run('2026-10-16 10:00:00','Pageview','v','s','/','','');
 assert.equal(db.prepare(METRICS_SQL).get('2026-10-14 10:00:00','2026-10-16 10:00:00').visits,0);db.close();
});

test('live API failures retain timestamped recorded release evidence instead of inventing a clean state',async()=>{
 const {systemState}=await import('../worker/system-state.js');
 const state=await systemState(async url=>url.includes('/data/system-health.json')?new Response(JSON.stringify({checked_at:'2100-01-01T00:00:00Z',checked_commit:'fixture',releases:[{commit:'ff3270dd',at:'2026-10-17T00:03:40Z'}],validators:[{name:'Site links',workflow_status:'success',status:'success',files:[]},{name:'Public safety',workflow_status:'failure',status:'failure',files:['llms.txt','services/index.html']}],sitemap:{missing:[]}})):new Response('',{status:403}));
 assert.equal(state.releases[0].commit,'ff3270dd');assert.equal(state.validators[1].workflow_status,'failure');assert.match(state.error,/403/);
});


test('an older published snapshot can supply recorded releases without replacing newer file checks',async()=>{
 const {systemState}=await import('../worker/system-state.js');
 const state=await systemState(async url=>url.includes('/data/system-health.json')?new Response(JSON.stringify({checked_at:'1970-01-01T00:00:00Z',checked_commit:'old-source',metadata_checked_at:'2026-10-17T00:00:00Z',releases:[{commit:'older-recorded-release',at:'2026-10-16T00:00:00Z'}],validators:[],sitemap:{missing:['do-not-use-old-check']}})):new Response('',{status:403}));
 assert.notEqual(state.checked_commit,'old-source');assert.ok(!state.sitemap.missing.includes('do-not-use-old-check'));
 assert.ok(state.releases.length>0);
});

test('equal periods have identical durations and reject incomplete collection baselines',async()=>{
 const {equalWindow}=await import('../worker/decision-metrics.js');
 const w=equalWindow('2026-10-12 00:00:00','2026-10-19 05:00:00');
 assert.equal(new Date(w.current.until+'Z')-new Date(w.current.since+'Z'),new Date(w.previous.until+'Z')-new Date(w.previous.since+'Z'));
 assert.equal(w.previous.until,w.current.since);assert.equal(w.available,true);
 assert.equal(equalWindow('2026-08-09 00:00:00','2026-10-19 05:00:00').available,false);
});
test('reader cohorts deduplicate sessions and preserve engagement and reading-depth rates',async()=>{
 const {READER_COHORT_SQL}=await import('../worker/decision-metrics.js');
 const db=database();db.exec('ALTER TABLE events ADD COLUMN depth INTEGER');
 const add=db.prepare('INSERT INTO events VALUES (?,?,?,?,?,?,?,?)');
 for(const [visitor,session,type,depth] of [['a','1','Pageview',null],['a','1','Pageview',null],['a','2','Pageview',null],['a','2','Engaged Visit',null],['a','2','Scroll Depth',100],['b','3','Pageview',null],['b','3','Scroll Depth',75],['c','4','Engaged Visit',null]])add.run('2026-10-16 12:00:00',type,visitor,session,'/','','',depth);
 const rows=db.prepare(READER_COHORT_SQL).all('2026-10-16','2026-10-17');
 const r=rows.find(r=>r.cohort==='returning'),s=rows.find(r=>r.cohort==='single');
 assert.equal(r.visitors,1);assert.equal(r.visits,2);assert.equal(r.engaged,1);assert.equal(r.completed,1);assert.equal(s.deep_reads,1);assert.equal(s.completed,0);db.close();
});
test('fresh scheduled public status avoids failing direct GitHub requests without edge credentials',async()=>{
 const {systemState}=await import('../worker/system-state.js');let calls=0;
 const state=await systemState(async url=>{calls++;assert.match(url,/raw.githubusercontent.com/);return new Response(JSON.stringify({checked_at:new Date().toISOString(),metadata_checked_at:new Date().toISOString(),checked_commit:'scheduled',validators:[{workflow_status:'success',status:'success',files:[]},{workflow_status:'failure',status:'failure',files:['llms.txt','services/index.html']}],releases:[{commit:'release',at:new Date().toISOString()}],sitemap:{missing:[]}}))});
 assert.equal(calls,1);assert.equal(state.error,null);assert.match(state.status_source,/Scheduled/);assert.equal(state.sitemap.missing.length,0);
});

test('homepage hiring emails count once per session and retain route breakdown without counting unrelated pages',()=>{
 const db=database();const add=db.prepare('INSERT INTO events VALUES (?,?,?,?,?,?,?)');
 for(const [type,page,route,session] of [['Email Click','/','email','home'],['Email Click','/','email','home'],['Email Click','/','gmail','home'],['Email Click','/resume.html','email','resume'],['Email Click','/blog/','email','reader'],['Email Click','/','phone','other'],['Hiring Funnel Step','/','email','step-only']])add.run('2026-10-29 12:00:00',type,'fixture',session,page,'',route);
 assert.equal(db.prepare(METRICS_SQL).get('2026-10-29','2026-10-30').email_actions,2);
 const routes=db.prepare(EMAIL_SQL).all('2026-10-29','2026-10-30');assert.equal(routes.length,3);assert.equal(routes.find(r=>r.page==='/'&&r.destination==='email').clicks,2);db.close();
});
