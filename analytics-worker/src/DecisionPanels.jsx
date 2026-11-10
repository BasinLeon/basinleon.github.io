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
 {items.map((i,n)=><p key={n}>{i.url?<a href={i.url} target="_blank" rel="noreferrer">{i.label}</a>:i.label}</p>)}
 {pending.map(l=><p key={l.id}>{l.name}: {l.stage} · {l.follow_up} · {l.next_action}</p>)}
 {!items.length&&!pending.length&&<p>Nothing outstanding in validator, sitemap, owner-exclusion and lead checks.</p>}
 <p>Sitemap: {missing?`${missing.length} missing indexable posts (${health.sitemap.published_posts} HTML post files checked)`:'Unknown'}. File checks: {health.checked_at||'Unavailable'} · commit {health.checked_commit?.slice(0,8)||'Unknown'}. Status source: {health.status_source||'Direct public API with recorded fallback'}. Live status refresh attempted {health.fetched_at||'Unavailable'}; recorded workflow evidence {health.metadata_checked_at||'Unavailable'}. Cached up to 5 minutes. Public-safety findings may be deliberate; failures remain visible.</p></section>;
}
export function EmailCounts({rows=[]}) {
 return <section className="panel"><h2>Email CTA clicks</h2><p>Accepted Email Click events on the homepage, GTM Systems, résumé and case studies, split by mailto and Gmail. Clicks are intent, not sent email. Hiring path counts distinct sessions across both routes.</p><div className="report-scroll"><table><thead><tr><th>Page</th><th>Route</th><th>Clicks</th><th>Sessions</th></tr></thead><tbody>{['/','/gtm-systems/','/resume.html','/case-studies/'].flatMap(page=>['email','gmail'].map(route=>{const r=rows.find(r=>r.page===page&&r.destination===route);return <tr key={page+route}><th>{page}</th><td>{route==='email'?'mailto':'Gmail'}</td><td>{r?.clicks||0}</td><td>{r?.sessions||0}</td></tr>}))}</tbody></table></div></section>;
}

export function PeriodComparison({comparison}) {
 if(!comparison)return null;
 const {current,previous,metrics,available}=comparison;
 return <section className="panel period-comparison"><h2>Previous equal period</h2><p>Current: {current.since} → {current.until} UTC. Previous: {previous.since} → {previous.until} UTC. Adjacent windows have exactly the same duration.</p>{!available?<p>Previous period extends before collection began; no complete baseline. Choose 7 days or 30 days for a comparison.</p>:<div className="report-scroll"><table><thead><tr><th>Metric</th><th>Selected period</th><th>Previous period</th><th>Change</th></tr></thead><tbody>{Object.entries(metrics||{}).map(([key,m])=><tr key={key}><th>{labels[key]}</th><td>{m.current}</td><td>{m.previous}</td><td>{m.delta>0?'+':''}{m.delta}{m.percent===null?' · no prior baseline':` (${m.percent.toFixed(1)}%)`}</td></tr>)}</tbody></table></div>}</section>;
}
export function ReaderCohorts({rows=[]}) {
 const percent=(n,d)=>d?`${Math.round(n/d*100)}%`:'—';
 return <section className="panel reader-cohorts"><h2>Reader loyalty &amp; depth</h2><p>Groups use pageview sessions within the selected window. One-session visitors may have visited before this window. Rates below are shares of each group’s visits. Anonymous hashes cannot identify a person across browsers or cleared storage.</p><div className="report-scroll"><table><thead><tr><th>Audience</th><th>Visitors</th><th>Visits</th><th>Engaged 15s</th><th>Deep read ≥75%</th><th>Completed ≥100%</th></tr></thead><tbody>{['single','returning'].map(cohort=>{const r=rows.find(r=>r.cohort===cohort)||{};return <tr key={cohort}><th>{cohort==='single'?'One-session visitors':'Returning visitors'}</th><td>{r.visitors||0}</td><td>{r.visits||0}</td><td>{r.engaged||0} · {percent(r.engaged,r.visits)}</td><td>{r.deep_reads||0} · {percent(r.deep_reads,r.visits)}</td><td>{r.completed||0} · {percent(r.completed,r.visits)}</td></tr>})}</tbody></table></div></section>;
}

export function WritingRelease({ release, until, onSelect }) {
  if (!release || !until) return null;
  const minutes = Math.max(0, Math.floor((Date.parse(until.replace(' ', 'T') + 'Z') - Date.parse(release.at)) / 60000));
  const elapsed = minutes < 60 ? `${minutes} min` : minutes < 1440 ? `${Math.floor(minutes / 60)} hr` : `${Math.floor(minutes / 1440)} days`;
  return <section className="panel writing-release">
    <div>
      <p className="eyebrow">Writing release</p>
      <h2>{release.name}</h2>
      <p>Live for {elapsed} at this snapshot.</p>
      <p className="coverage-note"><time dateTime={release.at}>{release.at.replace('T', ' ').replace('Z', '')}</time> → {until} UTC · <a href={release.url} target="_blank" rel="noreferrer">Deployment {release.commit.slice(0, 8)}</a></p>
    </div>
    <button type="button" onClick={onSelect}>View since this release</button>
  </section>;
}

export function WritingLibraryReport({ report }) {
  if (!report) return null;
  const rooms = [['Library', 'library'], ['Coffee Shop', 'coffee_shop'], ['Garden', 'garden']];
  return <section className="panel writing-report">
    <h2>How readers use the Writing Library</h2>
    <p className="coverage-note">{report.since} → {report.until} UTC</p>
    <div className="report-scroll">
      <table>
        <thead><tr><th scope="col">Reading path</th><th scope="col">Sessions</th></tr></thead>
        <tbody>
          <tr><th scope="row">Visited the Writing Library</th><td>{report.hub_visits}</td></tr>
          {rooms.map(([label, key]) => <tr key={key}><th scope="row">Opened a piece from the {label}</th><td>{report[key]}</td></tr>)}
          <tr><th scope="row">Opened at least two different pieces after the Library</th><td>{report.second_reads}</td></tr>
          <tr><th scope="row">Landed on a piece anywhere on the site</th><td>{report.article_landings}</td></tr>
        </tbody>
      </table>
    </div>
    <p>Room counts require a tagged article link and a matching pageview in the same session. A session can appear in more than one room. Visits recorded before room tags went live still count toward Library visits and article landings.</p>
    <p>Article landings count sessions whose first recorded pageview in this window was a writing post, from any source.</p>
  </section>;
}

export function FragmentFollowThrough({ report }) {
  if (!report) return null;
  const countAndRate = (count, landings) => landings ? `${count} · ${(100 * count / landings).toFixed(1)}%` : String(count);
  return <section className="panel writing-report">
    <h2>Read next follow-through</h2>
    <p className="coverage-note">{report.since} → {report.until} UTC</p>
    <div className="report-scroll">
      <table>
        <thead><tr>
          <th scope="col">Starting fragment</th>
          <th scope="col">Landing sessions</th>
          <th scope="col">Clicked Read next</th>
          <th scope="col">Opened recommendation</th>
        </tr></thead>
        <tbody>{report.rows.map(row => <tr key={row.fragment}>
          <th scope="row"><a href={`https://basinleon.github.io${row.fragment}`} target="_blank" rel="noreferrer">Fragment {row.fragment.match(/(\d+)\.html$/)?.[1]}</a></th>
          <td>{row.landings}</td>
          <td>{countAndRate(row.clicks, row.landings)}</td>
          <td>{countAndRate(row.opens, row.landings)}</td>
        </tr>)}</tbody>
      </table>
    </div>
    <p>A landing is a session whose first recorded pageview was this fragment, from any source. Both rates use landing sessions. Repeat clicks count once.</p>
    <p>An open requires a matching destination pageview in the same session. The match allows a click event to arrive up to 10 seconds after its destination pageview.</p>
  </section>;
}
