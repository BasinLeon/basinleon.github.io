export const WRITING_LIBRARY_RELEASE = {
  commit: 'ade162ede6e6ca35849657a72a8c012b7eb81593',
  name: 'The Writing Library',
  at: '2026-11-05T05:25:18Z',
  url: 'https://github.com/BasinLeon/basinleon.github.io/actions/runs/41973786084'
};

// Attribute a room click only when its destination also has a pageview in the
// same session. A navigation beacon can reach the server after the pageview.
export const WRITING_LIBRARY_SQL = `WITH views AS (
  SELECT id, session_hash, page FROM events
  WHERE event_type='Pageview' AND received_at>=?1 AND received_at<?2
), entries AS (
  SELECT MIN(id) AS id FROM views GROUP BY session_hash
), hub AS (
  SELECT session_hash, MIN(id) AS first_hub FROM views WHERE page='/blog/' GROUP BY session_hash
), articles AS (
  SELECT id, session_hash, page FROM views WHERE page LIKE '/blog/posts/%.html'
), room_reads AS (
  SELECT DISTINCT e.session_hash, e.region
  FROM events e JOIN hub h ON h.session_hash=e.session_hash
  WHERE e.received_at>=?1 AND e.received_at<?2 AND e.event_type='Internal Click'
    AND e.page='/blog/' AND e.region IN ('library','coffee-shop','garden')
    AND EXISTS (SELECT 1 FROM articles a WHERE a.session_hash=e.session_hash AND a.page=e.destination AND a.id>h.first_hub)
), second_reads AS (
  SELECT a.session_hash FROM articles a JOIN hub h ON h.session_hash=a.session_hash AND a.id>h.first_hub
  GROUP BY a.session_hash HAVING COUNT(DISTINCT a.page)>=2
)
SELECT
  (SELECT COUNT(*) FROM hub) AS hub_visits,
  (SELECT COUNT(*) FROM entries JOIN articles USING(id)) AS article_landings,
  (SELECT COUNT(*) FROM second_reads) AS second_reads,
  (SELECT COUNT(*) FROM room_reads WHERE region='library') AS library,
  (SELECT COUNT(*) FROM room_reads WHERE region='coffee-shop') AS coffee_shop,
  (SELECT COUNT(*) FROM room_reads WHERE region='garden') AS garden`;
