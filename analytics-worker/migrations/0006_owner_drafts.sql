CREATE TABLE owner_drafts (
 id TEXT PRIMARY KEY, kind TEXT NOT NULL CHECK(kind IN ('newsletter','offer')),
 title TEXT NOT NULL, body TEXT NOT NULL DEFAULT '', metadata TEXT NOT NULL DEFAULT '{}',
 updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
