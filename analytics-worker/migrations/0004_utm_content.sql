ALTER TABLE events ADD COLUMN utm_content TEXT NOT NULL DEFAULT '';
ALTER TABLE contact_submissions ADD COLUMN utm_content TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_events_utm_content
  ON events(utm_content) WHERE utm_content != '';
CREATE INDEX IF NOT EXISTS idx_contact_submissions_utm_content
  ON contact_submissions(utm_content) WHERE utm_content != '';
