import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.js';

function fakeDb() {
  const rows = [];
  let seq = 0;
  return {
    rows,
    prepare(sql) {
      let args = [];
      const stmt = {
        bind(...a) { args = a; return stmt; },
        async first() {
          if (/FROM comments\s+WHERE page = \? AND body = \?/.test(sql)) {
            return rows.find(r => r.page === args[0] && r.body === args[1]) || null;
          }
          if (/SELECT id FROM comments WHERE id = \?/.test(sql)) {
            return rows.find(r => r.id === args[0]) || null;
          }
          return null;
        },
        async all() {
          if (/status = 'APPROVED'/.test(sql)) {
            return { results: rows.filter(r => r.page === args[0] && r.status === 'APPROVED') };
          }
          if (/status = 'NEW'/.test(sql)) {
            return { results: rows.filter(r => r.status === 'NEW') };
          }
          return { results: [] };
        },
        async run() {
          if (/INSERT INTO comments/.test(sql)) {
            rows.push({
              id: ++seq,
              created_at: '2026-10-22 00:00:00',
              page: args[0], name: args[1], body: args[2],
              conversation_id: args[3],
              status: 'NEW', reply_body: '', replied_at: null
            });
            return { success: true };
          }
          if (/UPDATE comments SET status = \?, reply_body = \?/.test(sql)) {
            const row = rows.find(r => r.id === args[2]);
            if (row) { row.status = args[0]; row.reply_body = args[1]; row.replied_at = '2026-10-22 01:00:00'; }
            return { success: true };
          }
          if (/UPDATE comments SET status = \?/.test(sql)) {
            const row = rows.find(r => r.id === args[1]);
            if (row) row.status = args[0];
            return { success: true };
          }
          return { success: true };
        }
      };
      return stmt;
    }
  };
}

const env = () => ({ ALLOWED_ORIGINS: 'https://basinleon.github.io', ADMIN_TOKEN: 'test-token', DB: fakeDb() });

const post = (body, extraHeaders = {}) => new Request('https://example.com/v1/comments', {
  method: 'POST',
  headers: { Origin: 'https://basinleon.github.io', 'Content-Type': 'application/json', ...extraHeaders },
  body: JSON.stringify(body)
});

const validBody = { v: 1, name: 'A Reader', body: 'This piece stayed with me.', page: '/blog/posts/fragment-08.html', startedAt: Date.now() - 5000 };

test('valid comment is stored as NEW and accepted', async () => {
  const e = env();
  const res = await worker.fetch(post(validBody), e);
  assert.equal(res.status, 202);
  assert.equal((await res.json()).accepted, true);
  assert.equal(e.DB.rows.length, 1);
  assert.equal(e.DB.rows[0].status, 'NEW');
  assert.equal(e.DB.rows[0].page, '/blog/posts/fragment-08.html');
});

test('honeypot submission is silently accepted and never stored', async () => {
  const e = env();
  const res = await worker.fetch(post({ ...validBody, website: 'http://spam.example' }), e);
  assert.equal(res.status, 202);
  assert.equal(e.DB.rows.length, 0);
});

test('too-short body is rejected', async () => {
  const e = env();
  const res = await worker.fetch(post({ ...validBody, body: 'x' }), e);
  assert.equal(res.status, 422);
  assert.equal(e.DB.rows.length, 0);
});

test('bot user agent gets a silent 204 and stores nothing', async () => {
  const e = env();
  const res = await worker.fetch(post(validBody, { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' }), e);
  assert.equal(res.status, 204);
  assert.equal(e.DB.rows.length, 0);
});

test('bad origin is refused', async () => {
  const e = env();
  const req = new Request('https://example.com/v1/comments', {
    method: 'POST',
    headers: { Origin: 'https://evil.example', 'Content-Type': 'application/json' },
    body: JSON.stringify(validBody)
  });
  const res = await worker.fetch(req, e);
  assert.equal(res.status, 403);
});

test('public list shows nothing until approval, then shows comment with reply', async () => {
  const e = env();
  await worker.fetch(post(validBody), e);

  const listUrl = 'https://example.com/v1/comments?page=' + encodeURIComponent('/blog/posts/fragment-08.html');
  let res = await worker.fetch(new Request(listUrl, { headers: { Origin: 'https://basinleon.github.io' } }), e);
  let data = await res.json();
  assert.equal(data.comments.length, 0);

  const queue = await worker.fetch(new Request('https://example.com/v1/comments/moderation', {
    headers: { Authorization: 'Bearer test-token' }
  }), e);
  assert.equal((await queue.json()).comments.length, 1);

  const mod = await worker.fetch(new Request('https://example.com/v1/comment-moderate', {
    method: 'PUT',
    headers: { Authorization: 'Bearer test-token', 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: 1, status: 'APPROVED', reply_body: 'Thank you for reading closely.' })
  }), e);
  assert.equal((await mod.json()).saved, true);

  res = await worker.fetch(new Request(listUrl, { headers: { Origin: 'https://basinleon.github.io' } }), e);
  data = await res.json();
  assert.equal(data.comments.length, 1);
  assert.equal(data.comments[0].body, 'This piece stayed with me.');
  assert.equal(data.comments[0].reply_body, 'Thank you for reading closely.');
});

test('moderation endpoints require the admin token', async () => {
  const e = env();
  const queue = await worker.fetch(new Request('https://example.com/v1/comments/moderation'), e);
  assert.equal(queue.status, 401);
  const mod = await worker.fetch(new Request('https://example.com/v1/comment-moderate', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: 1, status: 'APPROVED' })
  }), e);
  assert.equal(mod.status, 401);
});
