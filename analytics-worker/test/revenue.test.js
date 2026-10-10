import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeRevenue} from '../worker/career-revenue.js';
test('revenue rejects invalid stages and negative or fractional cents',()=>{
 assert.equal(normalizeRevenue({stage:'invented',paid_cents:0,potential_cents:0}),null);
 assert.equal(normalizeRevenue({stage:'paid',paid_cents:-1,potential_cents:0}),null);
 assert.equal(normalizeRevenue({stage:'paid',paid_cents:1.2,potential_cents:0}),null);
 assert.equal(normalizeRevenue({stage:'paid',paid_cents:50000,potential_cents:250000}).paid_cents,50000);
});
