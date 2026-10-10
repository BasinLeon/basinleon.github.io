export const SESSION_SQL = `WITH page AS (
 SELECT session_hash, MIN(received_at) AS viewed FROM events
 WHERE page='/working-session/' AND event_type='Pageview' AND received_at>=? GROUP BY session_hash
), stages AS (
 SELECT p.session_hash,p.viewed,
 MIN(CASE WHEN e.conversion_action='working-session-request' THEN e.received_at END) AS clicked,
 MIN(CASE WHEN e.conversion_action='contact-form-start' THEN e.received_at END) AS started,
 MIN(CASE WHEN e.conversion_action='contact-form-submit' THEN e.received_at END) AS submitted
 FROM page p LEFT JOIN events e ON e.session_hash=p.session_hash AND e.page='/working-session/' AND e.received_at>=p.viewed GROUP BY p.session_hash
) SELECT COUNT(*) AS viewed,
 SUM(clicked IS NOT NULL) AS clicked,
 SUM(started IS NOT NULL) AS started,
 SUM(submitted IS NOT NULL) AS submitted,
 SUM(clicked IS NOT NULL AND started>=clicked AND submitted>=started) AS completed_sequence
 FROM stages`;
export const CAMPAIGN_SQL = `WITH entry AS (
 SELECT *,ROW_NUMBER() OVER(PARTITION BY session_hash ORDER BY received_at,id) AS n
 FROM events WHERE page='/working-session/' AND event_type='Pageview' AND received_at>=?
), flags AS (
 SELECT a.session_hash,COALESCE(NULLIF(a.campaign_source,''),NULLIF(a.referrer,''),'Unattributed') AS source,
 a.campaign_medium AS medium,a.campaign_name AS campaign,a.utm_content AS content,
 MAX(e.event_type='Engaged Visit') AS engaged,
 MAX(e.conversion_action='working-session-request') AS clicks,
 MAX(e.conversion_action='contact-form-submit') AS submissions
 FROM entry a LEFT JOIN events e ON e.session_hash=a.session_hash AND e.page=a.page AND e.received_at>=a.received_at
 WHERE a.n=1 GROUP BY a.session_hash
) SELECT source,medium,campaign,content,COUNT(*) AS visits,SUM(engaged) AS engaged,SUM(clicks) AS clicks,SUM(submissions) AS submissions
 FROM flags GROUP BY source,medium,campaign,content ORDER BY visits DESC LIMIT 100`;
export const STAGES=['inquiry','qualified','payment_pending','paid','completed','implementation_agreed','closed'];
export function normalizeRevenue(value){
 if(!value || !STAGES.includes(value.stage)) return null;
 const cents=Number(value.paid_cents), potential=Number(value.potential_cents);
 if(!Number.isSafeInteger(cents)||cents<0||!Number.isSafeInteger(potential)||potential<0) return null;
 return {stage:value.stage,paid_cents:cents,potential_cents:potential,next_action:String(value.next_action||'').trim().slice(0,500),follow_up:String(value.follow_up||'').slice(0,10)};
}
