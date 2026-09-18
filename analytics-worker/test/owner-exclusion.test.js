import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

for (const blocked of [false, true]) test(`owner exclusion reads saved state, storage blocked=${blocked}`, () => {
  let stored = null;
  let cookie = '';
  let message;
  const document = { body: {appendChild() {}}, createElement: () => ({setAttribute() {},dataset:{},style:{},remove(){}}) };
  Object.defineProperty(document,'cookie',{get:()=>cookie,set:value=>{if(!blocked)cookie=value.split(';')[0];}});
  vm.runInNewContext(readFileSync(new URL('../../assets/js/insights.js',import.meta.url),'utf8'), {
    document, URL, URLSearchParams,
    location: {origin:'https://basinleon.github.io',href:'https://basinleon.github.io/?lb_owner=1',search:'?lb_owner=1'},
    history:{replaceState(){}},
    localStorage:{setItem(k,v){if(blocked)throw Error('blocked');stored=v;},getItem(){return stored;}},
    window:{opener:{closed:false,postMessage(value){message=value;}},setTimeout(){}},
  });
  assert.equal(message.excluded,!blocked);
});
