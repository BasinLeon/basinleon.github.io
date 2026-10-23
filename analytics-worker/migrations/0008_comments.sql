CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  page TEXT NOT NULL DEFAULT '/',
  name TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NEW',
  reply_body TEXT NOT NULL DEFAULT '',
  replied_at TEXT,
  conversation_id TEXT NOT NULL DEFAULT '',
  campaign_source TEXT NOT NULL DEFAULT '',
  campaign_medium TEXT NOT NULL DEFAULT '',
  campaign_name TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_comments_page_status
  ON comments(page, status);

CREATE INDEX IF NOT EXISTS idx_comments_status_created_at
  ON comments(status, created_at);
