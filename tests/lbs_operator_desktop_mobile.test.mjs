import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../docs/lbs_operator_desktop.html", import.meta.url), "utf8");

test("mobile refinery rows use dedicated compact card hooks", () => {
  assert.match(html, /\.mobile-row-meta\s*\{/);
  assert.match(html, /\.row-next\s*\{/);
  assert.match(html, /class="row-type row-meta-cell"/);
  assert.match(html, /class="row-stage row-meta-cell"/);
  assert.match(html, /class="row-touch row-meta-cell"/);
  assert.match(html, /class="row-next"/);
});
