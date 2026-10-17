import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readOwnerConfirmation, saveOwnerConfirmation } from '../src/owner-confirmation.js';

test('a new dashboard instance restores a verified result and clears a negative result', () => {
  const records = new Map([['unrelated', 'preserve']]);
  globalThis.localStorage = {
    getItem: key => records.get(key) ?? null,
    setItem: (key, value) => records.set(key, value),
    removeItem: key => records.delete(key),
  };
  try {
    assert.equal(readOwnerConfirmation(), false);
    saveOwnerConfirmation(true);
    assert.equal(readOwnerConfirmation(), true);
    saveOwnerConfirmation(false);
    assert.equal(readOwnerConfirmation(), false);
    assert.equal(records.get('unrelated'), 'preserve');
  } finally {
    delete globalThis.localStorage;
  }
});

test('blocked storage cannot create a persisted confirmation', () => {
  globalThis.localStorage = {
    getItem() { throw new Error('blocked'); },
    setItem() { throw new Error('blocked'); },
    removeItem() { throw new Error('blocked'); },
  };
  try {
    assert.doesNotThrow(() => saveOwnerConfirmation(true));
    assert.equal(readOwnerConfirmation(), false);
    assert.doesNotThrow(() => saveOwnerConfirmation(false));
  } finally {
    delete globalThis.localStorage;
  }
});
