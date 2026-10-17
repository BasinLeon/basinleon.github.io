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
