import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readdirSync,readFileSync} from 'node:fs';
import worker from '../worker/index.js';

test('complete dashboard SQL keeps repeated counters identical and reads genuine email events across release windows',async()=>{
 const db=new DatabaseSync(':memory:');
 for(const file of readdirSync(new URL('../migrations/',import.meta.url)).filter(f=>f.endsWith('.sql')).sort())db.exec(readFileSync(new URL('../migrations/'+file,import.meta.url),'utf8'));
 const add=db.prepare('INSERT INTO events(received_at,event_type,session_hash,visitor_hash,page,destination,conversion_action) VALUES(?,?,?,?,?,?,?)');
 add.run('2026-10-16 12:00:00','Pageview','fixture-one','visitor-one','/working-session/','','');
 add.run('2026-10-16 12:01:00','Pageview','fixture-two','visitor-two','/resume.html','','');
 add.run('2026-10-16 12:02:00','Email Click','fixture-two','visitor-two','/resume.html','gmail','hiring-email-gmail');
 add.run('2026-10-16 12:03:00','Engaged Visit','event-only','visitor-three','/','','');
 const env={ADMIN_TOKEN:'fixture-owner',SYSTEM_STATE:{validators:[],sitemap:{missing:[]},releases:[{commit:'latest',at:'2026-10-16T00:00:00Z'},{commit:'prior',at:'2026-10-15T00:00:00Z'}]},DB:{prepare(sql){const q=db.prepare(sql);return {q,args:[],bind(...args){return {q,args}}};},async batch(statements){return statements.map(({q,args})=>({results:q.all(...args)}));}}};
 for(const mode of ['365','release']){
  const response=await worker.fetch(new Request('https://fixture/v1/dashboard?days='+mode,{headers:{authorization:'Bearer fixture-owner'}}),env);
  const data=await response.json();assert.equal(response.status,200);
  assert.equal(data.summary.visits,2);assert.equal(data.revenue_funnel.site_visits,data.summary.visits);
  assert.equal(data.revenue_funnel.offer_visits,data.working_session.viewed);
  assert.equal(data.hiring_funnel.find(r=>r.step==='email').actions,1);
  assert.equal(data.email_ctas[0].destination,'gmail');
  assert.equal(data.release_comparison.metrics.email_actions.current,1);
 }
 db.close();
});
