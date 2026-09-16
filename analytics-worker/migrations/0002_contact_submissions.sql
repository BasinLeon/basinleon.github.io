CREATE TABLE IF NOT EXISTS contact_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  intent TEXT NOT NULL DEFAULT '',
  problem TEXT NOT NULL,
  page TEXT NOT NULL DEFAULT '/',
  referrer TEXT NOT NULL DEFAULT '',
  campaign_source TEXT NOT NULL DEFAULT '',
  campaign_medium TEXT NOT NULL DEFAULT '',
  campaign_name TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'NEW'
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_received_at
  ON contact_submissions(received_at);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status_received_at
  ON contact_submissions(status, received_at);
