CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  event_type TEXT NOT NULL,
  page TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  site_section TEXT NOT NULL DEFAULT 'site',
  referrer TEXT NOT NULL DEFAULT '',
  session_hash TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  campaign_source TEXT NOT NULL DEFAULT '',
  campaign_medium TEXT NOT NULL DEFAULT '',
  campaign_name TEXT NOT NULL DEFAULT '',
  viewport TEXT NOT NULL DEFAULT '',
  language TEXT NOT NULL DEFAULT '',
  destination TEXT NOT NULL DEFAULT '',
  label TEXT NOT NULL DEFAULT '',
  region TEXT NOT NULL DEFAULT '',
  conversion_category TEXT NOT NULL DEFAULT '',
  conversion_action TEXT NOT NULL DEFAULT '',
  depth INTEGER,
  seconds INTEGER
);

CREATE INDEX IF NOT EXISTS idx_events_received_at ON events(received_at);
CREATE INDEX IF NOT EXISTS idx_events_event_type_received_at ON events(event_type, received_at);
CREATE INDEX IF NOT EXISTS idx_events_page_received_at ON events(page, received_at);
CREATE INDEX IF NOT EXISTS idx_events_session_received_at ON events(session_hash, received_at);
CREATE INDEX IF NOT EXISTS idx_events_visitor_received_at ON events(visitor_hash, received_at);
CREATE INDEX IF NOT EXISTS idx_events_conversion_received_at ON events(conversion_category, received_at)
  WHERE conversion_category != '';
