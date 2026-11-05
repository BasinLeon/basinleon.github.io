import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { WRITING_LIBRARY_SQL } from '../worker/writing-library.js';

test('writing rooms require a matched post view and separate landing and discovery sessions', () => {
  const db = new DatabaseSync(':memory:');
  db.exec('CREATE TABLE events(id INTEGER PRIMARY KEY, received_at TEXT, event_type TEXT, session_hash TEXT, page TEXT, destination TEXT, region TEXT)');
  const add = db.prepare('INSERT INTO events VALUES(NULL, ?, ?, ?, ?, ?, ?)');
  const hub = '/blog/';
  const first = '/blog/posts/first.html';
  const second = '/blog/posts/second.html';
  const view = (session, page, at = '2026-11-05 06:01:00') => add.run(at, 'Pageview', session, page, '', '');
  const click = (session, destination, room) => add.run('2026-11-05 06:01:00', 'Internal Click', session, hub, destination, room);
  view('reader', hub);
  view('reader', first); // Beacon arrives after the destination pageview.
  click('reader', first, 'library');
  click('reader', first, 'library');
  click('reader', second, 'garden');
  view('reader', second);
  view('bounced', hub);
  click('bounced', first, 'coffee-shop');
  view('landed', first);
  view('landed', hub);
  click('landed', first, 'coffee-shop'); // No second pageview after the hub.
  view('late', hub);
  click('late', first, 'coffee-shop');
  view('late', first, '2026-11-05 07:00:00');
  view('unlinked', first);
  assert.deepEqual({ ...db.prepare(WRITING_LIBRARY_SQL).get('2026-11-05 06:00:00', '2026-11-05 07:00:00') }, {
    hub_visits: 4, article_landings: 2, second_reads: 1, library: 1, coffee_shop: 0, garden: 1
  });
  db.close();
});
