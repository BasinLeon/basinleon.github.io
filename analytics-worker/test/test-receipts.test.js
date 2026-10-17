import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { TEST_CONTACT_SQL } from '../worker/index.js';

test('only the explicitly marked conversion test is excluded from real inquiries', () => {
  const db = new DatabaseSync(':memory:');
  db.exec('CREATE TABLE contact_submissions(name TEXT, problem TEXT)');
  const insert = db.prepare('INSERT INTO contact_submissions VALUES (?, ?)');
  insert.run('TEST-DELETE', 'What is broken in GTM right now: SYNTHETIC E2E TEST conversion-20261016. Verify receipt only.');
  insert.run('TEST-DELETE', 'Real inquiry without the exact QA marker');
  insert.run('Prospect', 'SYNTHETIC E2E TEST conversion-20261016');
  assert.equal(db.prepare(`SELECT count(*) AS n FROM contact_submissions WHERE ${TEST_CONTACT_SQL}`).get().n, 1);
  assert.equal(db.prepare(`SELECT count(*) AS n FROM contact_submissions WHERE NOT ${TEST_CONTACT_SQL}`).get().n, 2);
  db.close();
});
