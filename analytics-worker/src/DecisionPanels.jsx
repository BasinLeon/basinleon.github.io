import React from 'react';
import { healthAttention } from '../worker/system-state.js';
const labels={unique_visitors:'Unique visitors',visits:'Visits',engaged_visits:'Engaged visits',conversion_actions:'Conversion actions',request_clicks:'Request clicks',form_starts:'Form starts',email_actions:'Email actions'};
export function ReleaseComparison({comparison}) {
 if(!comparison)return <section className="panel"><h2>Release comparison</h2><p>Unavailable: two successful deployment markers are required.</p></section>;
 const {current,previous,metrics}=comparison;
 return <section className="panel release-comparison"><h2>Release comparison</h2><p>Current: {current.commit.slice(0,8)} · {current.since} → {current.until}. Previous: {previous.commit.slice(0,8)} · {previous.since} → {previous.until}.</p><p>Raw counts across unequal release periods, not a rate or causal verdict. UTC boundaries; end excluded. Short observation windows are inconclusive.</p><div className="report-scroll"><table><thead><tr><th>Metric</th><th>Current release</th><th>Previous release</th><th>Delta</th></tr></thead><tbody>{Object.entries(metrics).map(([key,m])=><tr key={key}><th>{labels[key]}</th><td>{m.current}</td><td>{m.previous}</td><td>{m.delta>0?'+':''}{m.delta}{m.percent===null?' · no prior baseline':` (${m.percent.toFixed(1)}%)`}</td></tr>)}</tbody></table></div></section>;
}
export function SystemAttention({health={},ownerExcluded,leads=[]}) {
 const items=healthAttention(health,ownerExcluded);
 const pending=leads.filter(l=>l.stage==='inquiry'||l.stage==='payment_pending'||(l.follow_up&&l.follow_up<=new Date().toISOString().slice(0,10)&&l.stage!=='closed'));
 const missing=health.sitemap?.missing;
 return <section className="system-attention"><h3>What needs attention</h3><p>{items.length+pending.length} attention items · {items.filter(i=>i.kind==='validator').reduce((n,i)=>n+i.count,0)} validator file findings · {missing?.length??'Unknown'} published posts missing from sitemap · Owner exclusion: {ownerExcluded?'Yes':'Not confirmed'}</p>
 {items.map((i,n)=><p key={n}><strong>{i.count}</strong> · {i.url?<a href={i.url} target="_blank" rel="noreferrer">{i.label}</a>:i.label}</p>)}
 {pending.map(l=><p key={l.id}>{l.name}: {l.stage} · {l.follow_up} · {l.next_action}</p>)}
 {!items.length&&!pending.length&&<p>Nothing outstanding in validator, sitemap, owner-exclusion and lead checks.</p>}
 <p>Sitemap: {missing?`${missing.length} missing indexable posts (${health.sitemap.published_posts} HTML post files checked)`:'Unknown'}. File checks: {health.checked_at||'Unavailable'} · commit {health.checked_commit?.slice(0,8)||'Unknown'}. Live status refresh attempted {health.fetched_at||'Unavailable'}; recorded workflow evidence {health.metadata_checked_at||'Unavailable'}. Cached up to 15 minutes. Public-safety findings may be deliberate; failures remain visible.</p></section>;
}
export function EmailCounts({rows=[]}) {
 return <section className="panel"><h2>Email CTA clicks</h2><p>Accepted Email Click events on résumé and case studies, split by mailto and Gmail. Clicks are intent, not sent email. Hiring path counts distinct sessions across both routes.</p><div className="report-scroll"><table><thead><tr><th>Page</th><th>Route</th><th>Clicks</th><th>Sessions</th></tr></thead><tbody>{['/resume.html','/case-studies/'].flatMap(page=>['email','gmail'].map(route=>{const r=rows.find(r=>r.page===page&&r.destination===route);return <tr key={page+route}><th>{page}</th><td>{route==='email'?'mailto':'Gmail'}</td><td>{r?.clicks||0}</td><td>{r?.sessions||0}</td></tr>}))}</tbody></table></div></section>;
}
