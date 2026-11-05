/* Use only the published manifest. No query logging, redirect or new tracking. */
(()=>{
 const params=new URLSearchParams(location.search);
 if(params.get('utm_campaign')!=='sam-ink')return;
 const entrance=document.querySelector('.sam-ink-entrance');if(!entrance)return;
 const wanted=params.get('utm_content')||'';
 fetch('/data/fragments.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(items=>{
  const published=items.filter(x=>/^fragment-\d+$/.test(x.slug)&&x.url==='/blog/posts/'+x.slug+'.html').sort((a,b)=>Number(b.slug.split('-').pop())-Number(a.slug.split('-').pop()));
  if(!published.length)return;
  const requested=published.find(x=>x.slug===wanted),chosen=requested||published[0];
  const read=entrance.querySelector('[data-arrival-read]');read.href=chosen.url;read.textContent='Read Fragment '+chosen.slug.split('-').pop()+': '+chosen.title;
  if(requested){entrance.querySelector('h2').textContent=requested.title;entrance.querySelector('[data-arrival-message]').textContent=requested.excerpt;}
  else if(/^fragment-\d+$/.test(wanted)){entrance.querySelector('[data-arrival-status]').textContent='Fragment '+wanted.split('-').pop()+' is not published in this archive yet. Use the link to read the latest published fragment.';entrance.querySelector('h2').textContent='The next room is not open yet.';}
 }).catch(()=>{entrance.querySelector('[data-arrival-status]').textContent='The latest index could not load. Use the link to browse the published fragment shelf.';});
})();
