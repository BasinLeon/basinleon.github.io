import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.js';
test('notification feed denies missing and admin-only credentials', async () => {
  for (const token of ['', 'admin']) {
    const response = await worker.fetch(new Request('https://example.com/v1/notifications', {headers:{authorization:'Bearer '+token}}), {NOTIFIER_TOKEN:'notify',ADMIN_TOKEN:'admin'});
    assert.equal(response.status,401);
  }
});
test('notification feed validates cursor and returns only ordered IDs', async () => {
  const env = {NOTIFIER_TOKEN:'notify',DB:{prepare(sql){assert.match(sql,/ORDER BY id ASC LIMIT 50/);return {bind(id){assert.equal(id,3);return {all:async()=>({results:[{id:4}]})}}}}}};
  const headers={authorization:'Bearer notify'};
  assert.equal((await worker.fetch(new Request('https://example.com/v1/notifications?after=-1',{headers}),env)).status,400);
  const response=await worker.fetch(new Request('https://example.com/v1/notifications?after=3',{headers}),env);
  assert.deepEqual(await response.json(),{ids:[4]});
});
