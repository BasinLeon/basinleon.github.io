// Publish only an explicitly approved fragment JSON. No draft-directory scanning.
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const filename=process.argv[2];
if(!filename)throw Error('Usage: node scripts/publish-fragment.mjs approved-fragment.json');
const f=JSON.parse(fs.readFileSync(filename,'utf8'));
if(f.status!=='approved'||!/^\d{4}-\d{2}-\d{2}$/.test(f.date)||!/^fragment-\d{2,}$/.test(f.slug)||typeof f.title!=='string'||!Array.isArray(f.paragraphs)||!f.paragraphs.length||!f.paragraphs.every(p=>typeof p==='string'))throw Error('Approved status, ISO date, fragment-NN slug, title and paragraph strings required.');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const url='/blog/posts/'+f.slug+'.html',file='blog/posts/'+f.slug+'.html';
if(fs.existsSync(file))throw Error('Existing fragment preserved. Edit it explicitly instead.');
const page=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(f.title)} | Sam &amp; Ink | Leon Basin</title><link rel="canonical" href="https://basinleon.github.io${url}"><meta property="og:title" content="${esc(f.title)}"><meta property="og:url" content="https://basinleon.github.io${url}"><meta property="og:type" content="article"><meta name="description" content="${esc(f.paragraphs[0].slice(0,160))}"><link rel="stylesheet" href="/blog/css/hub.css"><style>body{margin:0;background:#070706;color:#f4eedf;font:1.15rem/1.8 Georgia,serif}main{max-width:700px;margin:auto;padding:2rem 1.25rem}a{color:#d9ab45}h1{font-size:clamp(2.5rem,8vw,4rem);line-height:1.1}time{color:#d9ab45;font:1rem system-ui}nav{margin-bottom:2rem}</style></head><body data-lb-section="fiction"><main><nav><a href="/blog/#fragments">← The writing hub</a></nav><article><span>Sam &amp; Ink</span><h1>${esc(f.title)}</h1><time datetime="${f.date}">${f.date}</time>${f.paragraphs.map(p=>'<p>'+esc(p)+'</p>').join('')}</article><p><a href="/blog/#fragments">Read the next fragment at the hub</a></p></main><script src="/blog/js/hub-share.js" defer></script><script src="/assets/js/insights.js" defer></script></body></html>`;
const fragments=JSON.parse(fs.readFileSync('data/fragments.json','utf8'));
if(fragments.some(p=>p.slug===f.slug))throw Error('Duplicate fragment slug.');
fs.writeFileSync(file,page);fragments.push({slug:f.slug,title:f.title,date:f.date,url,excerpt:f.paragraphs[0].slice(0,180)});fragments.sort((a,b)=>b.date.localeCompare(a.date)||b.slug.localeCompare(a.slug));fs.writeFileSync('data/fragments.json',JSON.stringify(fragments,null,2)+'\n');
const posts=JSON.parse(fs.readFileSync('data/posts.json','utf8'));
posts.unshift({title:f.title,date:f.date,tags:['Sam & Ink','Fiction','Fragments'],excerpt:f.paragraphs[0].slice(0,180),url:'posts/'+f.slug+'.html',category:'Fiction'});
fs.writeFileSync('data/posts.json',JSON.stringify(posts,null,2)+'\n');
execFileSync(process.execPath,['scripts/generate-seo-assets.mjs'],{stdio:'inherit'});
console.log('Created '+file+'. Review the diff before publishing.');
