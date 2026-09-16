#!/usr/bin/env node

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ignored = [
  `${path.sep}.git${path.sep}`,
  `${path.sep}node_modules${path.sep}`,
  `${path.sep}analytics${path.sep}`,
  `${path.sep}docs${path.sep}_includes${path.sep}`,
  `${path.sep}docs${path.sep}_layouts${path.sep}`,
  `${path.sep}blog${path.sep}fiction${path.sep}_template.html`
];
const sharedPattern = /site-shell\.js|continuity\.js|blog-analytics\.js|insights\.js/;
let changed = 0;

for (const file of await walk(root)) {
  if (!file.endsWith(".html") || ignored.some((fragment) => file.includes(fragment))) continue;
  let html = await readFile(file, "utf8");
  if (sharedPattern.test(html) || !/<\/head>/i.test(html)) continue;
  html = html.replace(/<\/head>/i, '  <script src="/assets/js/insights.js" defer></script>\n</head>');
  await writeFile(file, html);
  changed += 1;
}

console.log(`Added shared insights to ${changed} previously uncovered HTML files.`);

async function walk(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".git" || entry.name === "node_modules") continue;
      output.push(...await walk(absolute));
    } else {
      output.push(absolute);
    }
  }
  return output;
}
