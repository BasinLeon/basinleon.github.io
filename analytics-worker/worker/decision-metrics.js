// Counts use one bounded event window. No new identifiers or personal data.
export const EMAIL_PREDICATE = `event_type='Email Click' AND page IN ('/resume.html','/case-studies/') AND destination IN ('email','gmail')`;
export const METRICS_SQL = `WITH bounded AS (
 SELECT * FROM events WHERE received_at>=? AND received_at<?
) SELECT
 COUNT(DISTINCT CASE WHEN event_type='Pageview' THEN visitor_hash END) AS unique_visitors,
 COUNT(DISTINCT CASE WHEN event_type='Pageview' THEN session_hash END) AS visits,
 COUNT(DISTINCT CASE WHEN event_type='Engaged Visit' THEN session_hash END) AS engaged_visits,
 SUM(event_type='Conversion') AS conversion_actions,
 COUNT(DISTINCT CASE WHEN event_type='Pageview' AND page='/working-session/' THEN session_hash END) AS offer_visits,
 COUNT(DISTINCT CASE WHEN page='/working-session/' AND conversion_action='working-session-request' THEN session_hash END) AS request_clicks,
 COUNT(DISTINCT CASE WHEN page='/working-session/' AND conversion_action='contact-form-start' THEN session_hash END) AS form_starts,
 COUNT(DISTINCT CASE WHEN ${EMAIL_PREDICATE} THEN session_hash END) AS email_actions
 FROM bounded`;
export const EMAIL_SQL = `SELECT page,destination,COUNT(*) AS clicks,COUNT(DISTINCT session_hash) AS sessions
 FROM events WHERE received_at>=? AND received_at<? AND ${EMAIL_PREDICATE}
 GROUP BY page,destination ORDER BY page,destination`;
export function releasePeriods(releases, now = new Date()) {
 const sorted = [...releases].sort((a,b)=>b.at.localeCompare(a.at));
 const latest=sorted[0], previous=sorted[1];
 if(!latest || !previous) return null;
 return {current:{since:latest.at,until:now.toISOString(),commit:latest.commit},previous:{since:previous.at,until:latest.at,commit:previous.commit}};
}
export function sqlTime(value) { return new Date(value).toISOString().slice(0,19).replace('T',' '); }
export function compareMetrics(current, previous) {
 return Object.fromEntries(['unique_visitors','visits','engaged_visits','conversion_actions','request_clicks','form_starts','email_actions'].map(key=>{
  const value=Number(current[key]||0), prior=Number(previous[key]||0);
  return [key,{current:value,previous:prior,delta:value-prior,percent:prior?(value-prior)/prior*100:null}];
 }));
}

// Adjacent periods of exactly the same duration, bounded by retained coverage.
export function equalWindow(since, until, coverage='2026-08-09 00:00:00') {
 const end=new Date(until.replace(' ','T')+'Z'), start=new Date(since.replace(' ','T')+'Z');
 const prior=new Date(start.getTime()-(end-start));
 return {current:{since,until},previous:{since:sqlTime(prior),until:since},available:sqlTime(prior)>=coverage};
}
export const READER_COHORT_SQL = `WITH bounded AS (
 SELECT * FROM events WHERE received_at>=? AND received_at<?
), visitors AS (
 SELECT visitor_hash,COUNT(DISTINCT session_hash) AS sessions FROM bounded WHERE event_type='Pageview' GROUP BY visitor_hash
), page_sessions AS (
 SELECT DISTINCT visitor_hash,session_hash FROM bounded WHERE event_type='Pageview'
) SELECT CASE WHEN v.sessions>1 THEN 'returning' ELSE 'single' END AS cohort,
 COUNT(DISTINCT p.visitor_hash) AS visitors,COUNT(DISTINCT p.session_hash) AS visits,
 COUNT(DISTINCT CASE WHEN e.event_type='Engaged Visit' THEN p.session_hash END) AS engaged,
 COUNT(DISTINCT CASE WHEN e.event_type='Scroll Depth' AND e.depth>=75 THEN p.session_hash END) AS deep_reads,
 COUNT(DISTINCT CASE WHEN e.event_type='Scroll Depth' AND e.depth>=100 THEN p.session_hash END) AS completed
 FROM page_sessions p JOIN visitors v ON v.visitor_hash=p.visitor_hash
 LEFT JOIN bounded e ON e.visitor_hash=p.visitor_hash AND e.session_hash=p.session_hash
 GROUP BY cohort`;
