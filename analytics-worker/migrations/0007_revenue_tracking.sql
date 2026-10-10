CREATE TABLE IF NOT EXISTS lead_progress (
 contact_id INTEGER PRIMARY KEY REFERENCES contact_submissions(id),
 stage TEXT NOT NULL DEFAULT 'inquiry',
 paid_cents INTEGER NOT NULL DEFAULT 0,
 potential_cents INTEGER NOT NULL DEFAULT 0,
 next_action TEXT NOT NULL DEFAULT '',
 follow_up TEXT NOT NULL DEFAULT '',
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
