// Only trusted edge metadata supplies geography. Never accept browser-supplied locations.
export function coarseGeography(cf = {}) {
  const country = String(cf?.country || '').toUpperCase();
  if (!/^[A-Z]{2}$/.test(country) || ['XX', 'T1'].includes(country)) return { country: '', region: '' };
  return { country, region: String(cf?.region || '').replace(/\s+/g, ' ').trim().slice(0, 80) };
}

export const RECENT_SUMMARY_SQL = `
SELECT COUNT(DISTINCT CASE WHEN received_at >= datetime('now', '-5 minutes') THEN session_hash END) AS sessions_5m,
 COUNT(DISTINCT session_hash) AS sessions_30m, MAX(received_at) AS latest_event
FROM events WHERE received_at >= datetime('now', '-30 minutes')`;

export const RECENT_PAGES_SQL = `
SELECT page, COUNT(DISTINCT session_hash) AS visits, MAX(received_at) AS latest_event
FROM events WHERE received_at >= datetime('now', '-30 minutes')
GROUP BY page ORDER BY latest_event DESC, page LIMIT 8`;

export const RECENT_SOURCES_SQL = `
WITH recent AS (
 SELECT session_hash, MAX(received_at) AS latest_event FROM events
 WHERE received_at >= datetime('now', '-30 minutes') GROUP BY session_hash
), arrivals AS (
 SELECT e.session_hash, CASE WHEN e.campaign_source != '' THEN e.campaign_source
 WHEN e.referrer != '' THEN e.referrer ELSE 'Direct' END AS source,
 ROW_NUMBER() OVER (PARTITION BY e.session_hash ORDER BY e.received_at, e.id) AS position
 FROM events e JOIN recent r ON r.session_hash = e.session_hash WHERE e.event_type = 'Pageview'
)
SELECT source, COUNT(*) AS visits FROM arrivals WHERE position = 1
GROUP BY source ORDER BY visits DESC, source LIMIT 8`;

// One first recorded geographic location per session. Old records remain unknown.
export const GEO_CTE = `WITH locations AS (
 SELECT session_hash, geo_country, geo_region,
 ROW_NUMBER() OVER (PARTITION BY session_hash ORDER BY received_at, id) AS position
 FROM events WHERE received_at >= ? AND geo_country != ''
)`;
export const COUNTRIES_SQL = `${GEO_CTE}
SELECT geo_country AS country, COUNT(*) AS visits FROM locations WHERE position = 1
GROUP BY geo_country HAVING COUNT(*) >= 3 ORDER BY visits DESC, country LIMIT 12`;
export const REGIONS_SQL = `${GEO_CTE}
SELECT geo_country AS country, geo_region AS region, COUNT(*) AS visits
FROM locations WHERE position = 1 AND geo_region != ''
GROUP BY geo_country, geo_region HAVING COUNT(*) >= 3 ORDER BY visits DESC, country, region LIMIT 12`;
export const GEO_COVERAGE_SQL = `SELECT COUNT(DISTINCT session_hash) AS total_sessions,
COUNT(DISTINCT CASE WHEN geo_country != '' THEN session_hash END) AS located_sessions,
MIN(CASE WHEN geo_country != '' THEN received_at END) AS first_location_at
FROM events WHERE received_at >= ?`;
