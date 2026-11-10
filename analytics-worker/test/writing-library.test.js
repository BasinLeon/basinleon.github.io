import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { WRITING_LIBRARY_SQL, FRAGMENT_FOLLOW_THROUGH_SQL } from '../worker/writing-library.js';

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

test('fragment follow-through counts direct landing sessions and matches tagged clicks to destination views', () => {
  const db = new DatabaseSync(':memory:');
  db.exec('CREATE TABLE events(id INTEGER PRIMARY KEY, received_at TEXT, event_type TEXT, session_hash TEXT, page TEXT, destination TEXT, label TEXT)');
  const add = db.prepare('INSERT INTO events VALUES(NULL, ?, ?, ?, ?, ?, ?)');
  const fragment = '/blog/posts/fragment-08.html';
  const destination = '/blog/posts/the-archive-was-empty.html';
  const record = (session, seconds, type, page, target = '', label = '') =>
    add.run(`2026-11-05 09:00:${seconds}`, type, session, page, target, label);
  const view = (session, seconds, page = fragment) => record(session, seconds, 'Pageview', page);
  const click = (session, seconds, target = destination, label = 'Writing: read next') =>
    record(session, seconds, 'Internal Click', fragment, target, label);

  view('opened', '01');
  view('opened', '02', destination);
  click('opened', '03');
  click('opened', '04');
  view('clicked', '01');
  click('clicked', '02');
  view('clicked', '03', '/blog/');
  view('wrong-link', '01');
  click('wrong-link', '02', destination, 'Other link');
  view('wrong-link', '03', destination);
  view('earlier-view', '01');
  view('earlier-view', '02', destination);
  click('earlier-view', '25');
  view('internal', '00', '/blog/');
  view('internal', '01');
  click('internal', '02');
  view('internal', '03', destination);
  view('boundary', '01');
  click('boundary', '02');
  view('boundary', '30', destination);

  const rows = db.prepare(FRAGMENT_FOLLOW_THROUGH_SQL).all('2026-11-05 09:00:01', '2026-11-05 09:00:30');
  assert.equal(rows.length, 5);
  assert.deepEqual({ ...rows[0] }, { fragment, destination, landings: 5, clicks: 4, opens: 1 });
  assert.equal(rows[1].landings, 0);
  db.close();
});
