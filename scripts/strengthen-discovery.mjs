#!/usr/bin/env node

import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsDirectory = path.join(root, "blog", "posts");
const site = "https://basinleon.github.io";
const feed = `${site}/blog/rss.xml`;
const postData = JSON.parse(await readFile(path.join(root, "data", "posts.json"), "utf8"));
const dates = new Map(
  postData
    .filter((post) => post.url && post.date)
    .map((post) => [`/blog/${post.url.replace(/^\/+/, "")}`, post.date])
);

const files = (await readdir(postsDirectory))
  .filter((file) => file.endsWith(".html") && file !== "index.html")
  .sort();

for (const file of files) {
  const absolute = path.join(postsDirectory, file);
  const pathname = `/blog/posts/${file}`;
  const canonical = `${site}${pathname}`;
  let html = await readFile(absolute, "utf8");
  const additions = [];

  if (!/<meta[^>]+name=["']robots["']/i.test(html)) {
    additions.push('  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">');
  }
  if (!/<link[^>]+rel=["']canonical["']/i.test(html) && !/\brel=["']canonical["']/i.test(html)) {
    additions.push(`  <link rel="canonical" href="${canonical}">`);
  }
  if (!/<link[^>]+application\/rss\+xml/i.test(html)) {
    additions.push(`  <link rel="alternate" type="application/rss+xml" title="The Archive RSS" href="${feed}">`);
  }
  if (!/application\/ld\+json/i.test(html)) {
    const title = extract(html, /<title[^>]*>([\s\S]*?)<\/title>/i)
      .replace(/\s*[|–—-]\s*Leon Basin.*$/i, "")
      .trim() || file.replace(/\.html$/, "").replace(/-/g, " ");
    const description = extract(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)
      || extract(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
    const date = dates.get(pathname) || (await stat(absolute)).mtime.toISOString().slice(0, 10);
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: decode(title),
      description: decode(description),
      datePublished: date,
      dateModified: date,
      author: {
        "@type": "Person",
        name: "Leon Basin",
        url: `${site}/`
      },
      publisher: {
        "@type": "Person",
        name: "Leon Basin",
        url: `${site}/`
      },
      mainEntityOfPage: canonical,
      isPartOf: {
        "@type": "Blog",
        name: "The Archive",
        url: `${site}/blog/`
      }
    };
    additions.push(`  <script type="application/ld+json">\n${indent(JSON.stringify(schema, null, 2), 2)}\n  </script>`);
  }
  if (!/site-shell\.js|continuity\.js|blog-analytics\.js|insights\.js/.test(html)) {
    additions.push('  <script src="/assets/js/insights.js" defer></script>');
  }

  if (additions.length) {
    html = html.replace(/<\/head>/i, `${additions.join("\n")}\n</head>`);
    await writeFile(absolute, html);
  }
}

const mainRoutes = [
  "/",
  "/blog/",
  "/blog/fiction/",
  "/case-studies/",
  "/library/",
  "/tools/",
  "/work-with-me/",
  "/basin-nexus/",
  "/basin-nexus/career/",
  "/docs/about/",
  "/docs/start-here/",
  "/docs/frameworks/",
  "/docs/best-of/",
  "/answers/",
  "/privacy/",
  "/resume.html",
  "/play/",
  "/pipeline-game/",
  "/gtm-architecture-live/"
];

const urls = new Map();
for (const route of mainRoutes) {
  const file = route === "/"
    ? path.join(root, "index.html")
    : route.endsWith("/")
      ? path.join(root, route, "index.html")
      : path.join(root, route);
  try {
    const info = await stat(file);
    urls.set(`${site}${route}`, info.mtime.toISOString().slice(0, 10));
  } catch (_) {
    // A curated route can be absent during a branch build.
  }
}

for (const file of files) {
  const route = `/blog/posts/${file}`;
  const info = await stat(path.join(postsDirectory, file));
  urls.set(`${site}${route}`, dates.get(route) || info.mtime.toISOString().slice(0, 10));
}

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...[...urls.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .flatMap(([url, lastmod]) => [
      "  <url>",
      `    <loc>${escapeXml(url)}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      "  </url>"
    ]),
  "</urlset>",
  ""
].join("\n");

await writeFile(path.join(root, "sitemap.xml"), sitemap);
console.log(`Strengthened ${files.length} articles and wrote ${urls.size} unique sitemap URLs.`);

function extract(value, expression) {
  return value.match(expression)?.[1]?.replace(/\s+/g, " ").trim() || "";
}

function decode(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function indent(value, spaces) {
  const prefix = " ".repeat(spaces);
  return value.split("\n").map((line) => `${prefix}${line}`).join("\n");
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
