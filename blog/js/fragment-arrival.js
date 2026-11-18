/* Published fragments only: no query logging, redirects or new tracking. */
(()=>{
 const params=new URLSearchParams(location.search);
 const campaign=params.get('utm_campaign')||'',content=params.get('utm_content')||'';
 const fragment=value=>value.match(/(?:^|[^a-z0-9])fragment-(\d+)(?=$|[^a-z0-9])/i)?.[1];
 const wanted=fragment(content)||fragment(campaign);
 const arrival=Boolean(wanted)||campaign==='sam-ink';
 if(arrival)document.documentElement.classList.add('sam-ink-arrival');
 const entrance=document.querySelector('.sam-ink-entrance');
 const latestCard=document.querySelector('[data-latest-title]');
 if(!entrance&&!latestCard)return;
 fetch('/data/fragments.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(items=>{
  const published=(Array.isArray(items)?items:[]).filter(x=>typeof x.slug==='string'&&/^fragment-\d+$/.test(x.slug)&&x.url==='/blog/posts/'+x.slug+'.html'&&typeof x.title==='string'&&typeof x.excerpt==='string').sort((a,b)=>Number(b.slug.split('-').pop())-Number(a.slug.split('-').pop()));
  if(!published.length)throw Error();
  const latest=published[0];
  const set=(selector,value)=>{const node=document.querySelector(selector);if(node)node.textContent=value;};
  set('[data-latest-title]',latest.title);set('[data-latest-number]','Fragment '+Number(latest.slug.split('-').pop()));set('[data-latest-excerpt]',latest.excerpt);
  const date=document.querySelector('[data-latest-date]');if(date&&/^\d{4}-\d{2}-\d{2}$/.test(latest.date)){date.dateTime=latest.date;date.textContent=new Date(latest.date+'T12:00:00Z').toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'America/Los_Angeles'});}
  const latestRead=document.querySelector('[data-latest-read]');if(latestRead)latestRead.href=latest.url;
  if(!entrance)return;
  const requested=wanted?published.find(x=>Number(x.slug.split('-').pop())===Number(wanted)):null,chosen=requested||latest;
  const read=entrance.querySelector('[data-arrival-read]');if(read){read.href=chosen.url;read.textContent='Read Fragment '+Number(chosen.slug.split('-').pop())+': '+chosen.title;}
  if(arrival&&(!wanted||requested)){entrance.querySelector('h2').textContent=chosen.title;entrance.querySelector('[data-arrival-message]').textContent=chosen.excerpt;}
  else if(wanted){entrance.querySelector('[data-arrival-status]').textContent='Fragment '+wanted+' is not published in this archive yet. Use the link to read the latest published fragment.';entrance.querySelector('h2').textContent='The next room is not open yet.';}
 }).catch(()=>{if(entrance&&arrival)entrance.querySelector('[data-arrival-status]').textContent='The latest index could not load. Use the link to browse the published fragment shelf.';});
})();
