-- Visits and pseudonymous visitors by day
SELECT
  toDate(timestamp) AS day,
  SUM(CASE WHEN blob1 = 'Pageview' THEN 1 ELSE 0 END) AS pageviews,
  COUNT(DISTINCT index1) AS visitors
FROM leon_site_events
WHERE timestamp >= NOW() - INTERVAL '30' DAY
GROUP BY day
ORDER BY day DESC;

-- Every measured click, newest first
SELECT
  timestamp,
  index1 AS visitor_token,
  blob14 AS session_id,
  blob1 AS event,
  blob2 AS page,
  blob3 AS destination,
  blob4 AS label,
  blob6 AS referrer,
  blob7 AS country,
  blob8 AS region,
  blob9 AS city,
  blob10 AS device
FROM leon_site_events
WHERE blob1 IN ('Internal Click', 'Outbound Click', 'Email Click', 'Phone Click', 'Download')
  AND timestamp >= NOW() - INTERVAL '30' DAY
ORDER BY timestamp DESC
LIMIT 1000;

-- Acquisition and campaign performance
SELECT
  blob6 AS referrer,
  blob11 AS utm_source,
  blob12 AS utm_medium,
  blob13 AS utm_campaign,
  SUM(CASE WHEN blob1 = 'Pageview' THEN 1 ELSE 0 END) AS pageviews,
  COUNT(DISTINCT index1) AS visitors,
  SUM(CASE WHEN blob1 = 'Engaged Visit' THEN 1 ELSE 0 END) AS engaged_visits
FROM leon_site_events
WHERE timestamp >= NOW() - INTERVAL '30' DAY
GROUP BY referrer, utm_source, utm_medium, utm_campaign
ORDER BY pageviews DESC
LIMIT 200;

-- Reading depth by page
SELECT
  blob2 AS page,
  SUM(CASE WHEN blob1 = 'Pageview' THEN 1 ELSE 0 END) AS pageviews,
  AVG(CASE WHEN blob1 = 'Reading Time' THEN double2 ELSE NULL END) AS avg_reading_seconds,
  SUM(CASE WHEN blob1 = 'Scroll Depth' AND double3 = 100 THEN 1 ELSE 0 END) AS completions
FROM leon_site_events
WHERE timestamp >= NOW() - INTERVAL '30' DAY
GROUP BY page
ORDER BY pageviews DESC
LIMIT 200;
