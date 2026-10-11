/* Published-library discovery. Reading times are estimates at 225 words/minute. */
(()=>{
 const shelves=[
 {url:'/blog/posts/the-archive-was-empty.html',opening:'I opened Obsidian expecting to find the essay.'},
 {url:'/blog/posts/sam-ink-note-in-the-other-room.html',opening:'The first time Sam heard it, he assumed someone upstairs had left a piano playing.'},
 {url:'/blog/posts/the-souls-algorithm-fallow-year.html',opening:'Forty-two editions in, my subscriber line is close to flat. Two new names last week, and a red arrow to make sure I felt it.'}
 ];
 const curated={
 '/blog/posts/fragment-08.html':'/blog/posts/the-archive-was-empty.html',
 '/blog/posts/fragment-07.html':'/blog/posts/what-does-a-moment-become.html',
 '/blog/posts/fragment-06.html':'/blog/posts/the-archive-was-empty.html',
 '/blog/posts/the-archive-was-empty.html':'/blog/posts/fragment-08.html',
 '/blog/posts/sam-ink-note-in-the-other-room.html':'/blog/posts/fragment-08.html',
 '/blog/posts/the-souls-algorithm-fallow-year.html':'/blog/posts/the-silence-architect.html'
 };
 const label=x=>`About ${x.minutes} min read`;
 fetch('/blog/reading-index.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(rows=>{
 const valid=rows.filter(x=>/^\/blog\/posts\/[a-z0-9-]+\.html$/.test(x.url));
 const host=document.querySelector('[data-from-shelves]');
 if(host){const localDay=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());const week=Math.floor((Date.parse(localDay+'T12:00:00Z')-Date.UTC(2026,9,5))/(7*86400000));const pick=shelves[((week%shelves.length)+shelves.length)%shelves.length];const item=valid.find(x=>x.url===pick.url);if(item){host.replaceChildren();const meta=document.createElement('span');meta.className='hub-label';meta.textContent=`From the shelves · ${item.date.slice(0,4)} · ${label(item)}`;const title=document.createElement('h2');title.textContent=item.title;const p=document.createElement('p');p.textContent=pick.opening;const a=document.createElement('a');a.href=item.url;a.className='text-link';a.textContent='Read';host.append(meta,title,p,a);}}
 const latestRead=document.querySelector('[data-latest-read]');if(latestRead){const item=valid.find(x=>x.url===new URL(latestRead.href).pathname);if(item){const time=document.createElement('span');time.className='hub-reading-time';time.textContent=label(item);document.querySelector('[data-latest-excerpt]')?.after(time);}}
 function markCard(card){if(card.querySelector('.hub-reading-time'))return;const a=card.querySelector('h3 a');const item=valid.find(x=>x.url===new URL(a?.href||location.href).pathname);if(item){const time=document.createElement('span');time.className='hub-reading-time';time.textContent=label(item);card.append(time);}}
 document.querySelectorAll('.hub-entry').forEach(markCard);const grid=document.querySelector('#fragments .hub-grid, [data-fragment-shelf]');if(grid)new MutationObserver(()=>grid.querySelectorAll('.hub-entry').forEach(markCard)).observe(grid,{childList:true});
 const current=valid.find(x=>x.url===location.pathname);const article=document.querySelector('article');
 if(current&&article){const h=document.querySelector('h1');const time=document.createElement('p');time.className='hub-reading-time';time.textContent=label(current);h?.after(time);
 const preferred=valid.find(x=>x.url===curated[current.url]);
 const related=preferred||valid.filter(x=>x.url!==current.url).map(x=>({item:x,score:(x.tags||[]).filter(t=>(current.tags||[]).includes(t)).length})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score)[0]?.item||valid.find(x=>x.url===shelves[0].url&&x.url!==current.url);
 if(related){const aside=document.createElement('aside');aside.className='hub-read-next';const k=document.createElement('span');k.className='hub-label';k.textContent='Read next';const a=document.createElement('a');a.href=related.url;a.textContent=related.title;const p=document.createElement('p');p.textContent=label(related);aside.append(k,a,p);article.after(aside);}}
 }).catch(()=>{/* The writing and published navigation remain available. */});
})();
