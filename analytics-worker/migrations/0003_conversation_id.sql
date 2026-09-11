ALTER TABLE events ADD COLUMN conversation_id TEXT NOT NULL DEFAULT '';
ALTER TABLE contact_submissions ADD COLUMN conversation_id TEXT NOT NULL DEFAULT '';
ALTER TABLE contact_submissions ADD COLUMN intake_type TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_events_conversation_id
  ON events(conversation_id) WHERE conversation_id != '';
CREATE INDEX IF NOT EXISTS idx_contact_submissions_conversation_id
  ON contact_submissions(conversation_id) WHERE conversation_id != '';
