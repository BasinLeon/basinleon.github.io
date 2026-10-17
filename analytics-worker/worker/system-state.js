import fallback from '../src/system-snapshot.json' with { type: 'json' };
const API='https://api.github.com/repos/BasinLeon/basinleon.github.io';
let cached;
async function get(url,fetcher) {
 const r=await fetcher(url,{headers:{'User-Agent':'basin-site-insights','Accept':'application/vnd.github+json'},signal:AbortSignal.timeout(7000)});
 if(!r.ok) throw Error(`Public system status HTTP ${r.status}`);
 return r.json();
}
export function releaseMarkers(runs) {
 const byCommit=new Map();
 for(const run of runs) {
  if(run.conclusion!=='success'||run.head_branch!=='main')continue;
  const marker={commit:run.head_sha,at:run.updated_at,url:run.html_url,source:'Successful Pages deployment workflow completion'};
  const old=byCommit.get(marker.commit);
  if(!old||marker.at<old.at)byCommit.set(marker.commit,marker);
 }
 return [...byCommit.values()].sort((a,b)=>b.at.localeCompare(a.at));
}
export function healthAttention(health,ownerExcluded) {
 const items=[];
 if(!health.sitemap || !Array.isArray(health.validators) || health.validators.length!==2)items.push({kind:'unknown',count:1,label:'System checks incomplete; status unknown'});
 if(health.error)items.push({kind:'unknown',count:1,label:`System status unavailable: ${health.error}`});
 for(const v of health.validators||[]) {
  if(v.status!=='success')items.push({kind:'validator',count:v.files.length||1,label:`${v.name}: ${v.status}; ${v.files.join(', ')||'files unavailable'}`,url:v.url});
  if(v.workflow_status&&v.workflow_status!=='success')items.push({kind:'workflow',count:1,label:`${v.name} workflow: ${v.workflow_status}${v.workflow_commit!==health.checked_commit?' (different commit from file checks)':''}`,url:v.url});
 }
 if(health.sitemap?.missing?.length)items.push({kind:'sitemap',count:health.sitemap.missing.length,label:`Published posts absent from sitemap: ${health.sitemap.missing.join(', ')}`});
 if(!ownerExcluded)items.push({kind:'owner',count:1,label:'Owner exclusion: not confirmed in this browser'});
 return items;
}
export async function systemState(fetcher=fetch) {
 if(fetcher===fetch&&cached&&cached.expires>Date.now())return cached.value;
 const value={...fallback,releases:fallback.releases||[],error:null};
 try {
  const [snapshot,deploy,links,safety]=await Promise.allSettled([
   get('https://basinleon.github.io/data/system-health.json',fetcher),
   get(`${API}/actions/runs?status=success&per_page=100&branch=main`,fetcher),
   get(`${API}/actions/workflows/validate-links.yml/runs?per_page=1&branch=main`,fetcher),
   get(`${API}/actions/workflows/validate-public-safety.yml/runs?per_page=1&branch=main`,fetcher)
  ]);
  if(snapshot.status==='fulfilled' && snapshot.value.checked_at >= fallback.checked_at)Object.assign(value,snapshot.value);
  else if(snapshot.status!=='fulfilled') value.error='Live build snapshot unavailable; showing bundled checks with timestamp';
  if(deploy.status==='fulfilled')value.releases=releaseMarkers((deploy.value.workflow_runs||[]).filter(r=>['Deploy Hybrid Site','pages build and deployment'].includes(r.name)));
  else value.error=[value.error,`Live release refresh unavailable (${deploy.reason?.message||'unknown'}); using recorded snapshot`].filter(Boolean).join('; ');
  value.validators=value.validators.map((v,i)=>{
   const result=[links,safety][i]; const run=result.status==='fulfilled'?result.value.workflow_runs?.[0]:null;
   return {...v,workflow_status:run?(run.conclusion||run.status):(v.workflow_status||'unknown'),workflow_commit:run?.head_sha||v.workflow_commit,url:run?.html_url||v.url};
  });
 } catch(error){value.error=error.message;}
 value.fetched_at=new Date().toISOString();
 if(fetcher===fetch)cached={expires:Date.now()+15*60*1000,value};
 return value;
}
