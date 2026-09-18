// One row per entry source/campaign/destination. Outcomes are session flags,
// not a claimed ordered funnel or proof of human reading.
export const DISTRIBUTION_SQL = `
WITH ranked AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY session_hash ORDER BY received_at, id) AS position
  FROM events WHERE event_type = 'Pageview' AND received_at >= ?
), entries AS (SELECT * FROM ranked WHERE position = 1), sessions AS (
  SELECT a.session_hash, a.page AS destination,
    COALESCE(NULLIF(a.campaign_source,''), NULLIF(a.referrer,''), 'Unattributed') AS source,
    a.campaign_medium AS medium, a.campaign_name AS campaign,
    MAX(CASE WHEN e.event_type='Engaged Visit' AND e.page=a.page THEN 1 ELSE 0 END) AS engaged,
    MAX(CASE WHEN e.event_type='Scroll Depth' AND e.page=a.page AND e.depth>=75 THEN 1 ELSE 0 END) AS deep_scroll,
    MAX(CASE WHEN e.event_type='Pageview' AND e.page!=a.page AND (e.page LIKE '/fiction/%' OR e.page LIKE '/blog/posts/%') THEN 1 ELSE 0 END) AS onward,
    MAX(CASE WHEN e.event_type='Conversion' AND e.conversion_action='subscription-outbound' THEN 1 ELSE 0 END) AS subscription_clicks
  FROM entries a LEFT JOIN events e ON e.session_hash=a.session_hash
    AND e.received_at>=a.received_at
    AND (e.received_at>a.received_at OR e.id>=a.id)
  GROUP BY a.session_hash
)
SELECT source, medium, campaign, destination, COUNT(*) AS visits,
  SUM(engaged) AS engaged, SUM(deep_scroll) AS deep_scroll,
  SUM(onward) AS onward, SUM(subscription_clicks) AS subscription_clicks
FROM sessions GROUP BY source, medium, campaign, destination
ORDER BY visits DESC, source, campaign, destination LIMIT 100`;
