/* Local share handoffs. No SDK, login token or automatic publishing. */
(()=>{
 const shelf=document.createElement('script');shelf.src='/blog/js/saved-shelf.js';document.head.append(shelf);
 const discovery=document.createElement('script');discovery.src='/blog/js/reading-discovery.js';document.head.append(discovery);
 const preferences=document.createElement("script");preferences.src="/blog/js/reading-preferences.js?v=20261022";document.head.append(preferences);
 function link(path,channel){const u=new URL(path,location.origin);u.search='';u.hash='';u.searchParams.set('utm_source',channel);u.searchParams.set('utm_medium','social');u.searchParams.set('utm_campaign','writing-hub');return u.href;}
 function mount(host,title,path){
 if(host.querySelector('.hub-share'))return;
 const wrap=document.createElement('div');wrap.className='hub-share';wrap.setAttribute('aria-label','Share '+title);
 const status=document.createElement('span');status.className='hub-share-status';status.setAttribute('role','status');
 const record=(channel,action)=>{if(window.lbInsightsRecord)window.lbInsightsRecord('Conversion',{category:'Reader interest',action,label:'Article: '+action+' '+channel,destination:link(path,channel),region:'article'});};
 const destinations={Threads:u=>'https://www.threads.com/intent/post?text='+encodeURIComponent(title+'\n'+u),X:u=>'https://twitter.com/intent/tweet?text='+encodeURIComponent(title)+'&url='+encodeURIComponent(u),Facebook:u=>'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(u),Reddit:u=>'https://www.reddit.com/submit?url='+encodeURIComponent(u)+'&title='+encodeURIComponent(title),LinkedIn:u=>'https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(u),Bluesky:u=>'https://bsky.app/intent/compose?text='+encodeURIComponent(title+'\n'+u)};
 function add(label,target){const channel=label.toLowerCase().replaceAll(' ','-');
 if(destinations[label]){const a=document.createElement('a');a.className='hub-share-action';a.href=destinations[label](link(path,channel));a.target='_blank';a.rel='noopener noreferrer';a.textContent=label;a.addEventListener('click',()=>{status.textContent='Review your post in '+label+'.';record(channel,'share-open');});target.append(a);return;}
 const button=document.createElement('button');button.type='button';button.textContent=label;
 button.addEventListener('click',async()=>{const url=link(path,channel);
 if(label==='Share'&&navigator.share){try{await navigator.share({title,url});status.textContent='Share menu closed.';record('native','share-handoff');}catch(e){if(e.name!=='AbortError')status.textContent='Sharing unavailable. Use Copy link.';}return;}
 const text=(label==='Copy link'||label==='Share')?url:title+'\n'+url;
 try{await navigator.clipboard.writeText(text);status.textContent=label==='Copy link'||label==='Share'?'Link copied.':'Copied. Paste into '+label+'.';record(channel,'share-copy');
 if(label==='Instagram'||label==='Substack'){const a=document.createElement('a');a.href=label==='Instagram'?'https://www.instagram.com/':'https://substack.com/notes';a.target='_blank';a.rel='noopener noreferrer';a.textContent='Open '+label;status.append(' ',a);}}
 catch{status.textContent='Copy this link: '+url;}});target.append(button);}
 ['Threads','X','Copy link'].forEach(label=>add(label,wrap));if(navigator.share)add('Share',wrap);
 const more=document.createElement('details');more.className='hub-share-more';const summary=document.createElement('summary');summary.textContent='More';const choices=document.createElement('div');choices.className='hub-share-choices';['Facebook','Reddit','LinkedIn','Bluesky','Instagram','Substack'].forEach(label=>add(label,choices));more.append(summary,choices);wrap.append(more,status);host.append(wrap);
 }
 const daily=document.querySelector('#fragments .hub-grid, [data-fragment-shelf]');
 if(daily)fetch('/data/fragments.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(items=>{
 if(!Array.isArray(items)||!items.length)return;
 const valid=items.filter(x=>typeof x.url==='string' && /^\/blog\/posts\/[a-z0-9-]+\.html$/.test(x.url));if(!valid.length)return;
 const latest=valid[0];const number=latest.slug.split('-').pop();
 const set=(selector,value)=>{const node=document.querySelector(selector);if(node)node.textContent=value;};
 set('[data-latest-title]',latest.title);set('[data-latest-number]','Fragment '+number);set('[data-latest-excerpt]',latest.excerpt);
 const date=document.querySelector('[data-latest-date]');if(date){date.dateTime=latest.date;date.textContent=new Date(latest.date+'T12:00:00Z').toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'America/Los_Angeles'});}
 const read=document.querySelector('[data-latest-read]');if(read){read.href=latest.url;read.textContent='Read';}
 daily.replaceChildren();valid.sort((a,b)=>(daily.dataset.fragmentOrder==='newest'?-1:1)*(Number(a.slug.split('-').pop())-Number(b.slug.split('-').pop()))).forEach(x=>{const a=document.createElement('article');a.className='hub-entry';const k=document.createElement('span');k.className='hub-label';k.textContent='Sam & Ink · Fragment '+x.slug.split('-').pop();const h=document.createElement('h3'),l=document.createElement('a');l.href=x.url;l.textContent=x.title;h.append(l);const t=document.createElement('time');t.dateTime=x.date;t.textContent='Published here · '+x.date;const p=document.createElement('p');p.textContent=x.excerpt;a.append(k,h,t,p);mount(a,x.title,x.url);daily.append(a);});
 }).catch(()=>{/* Retain server-rendered archive entries. */});
 // Fragment 10 keeps its authored Previous/All nav, without a derived Next link.
 if(location.pathname!=='/blog/posts/fragment-10.html' && /^\/blog\/posts\/fragment-\d+\.html$/.test(location.pathname))fetch('/data/fragments.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(items=>{
 const ordered=items.filter(x=>typeof x.url==='string'&&/^\/blog\/posts\/fragment-\d+\.html$/.test(x.url)).sort((a,b)=>Number(a.slug.split('-').pop())-Number(b.slug.split('-').pop()));
 const index=ordered.findIndex(x=>x.url===location.pathname);if(index<0)return;
 let nav=document.querySelector('.hub-reading-next');if(!nav){nav=document.createElement('nav');nav.className='hub-reading-next';document.querySelector('article')?.after(nav);}nav.setAttribute('aria-label','Fragment reading order');nav.replaceChildren();
 function add(item,label){const a=document.createElement('a');a.href=item.url;a.textContent=label+': '+item.title;nav.append(a);}
 if(index>0)add(ordered[index-1],'Previous');const all=document.createElement('a');all.href='/blog/fiction/sam-and-ink/#fragments';all.textContent='All fragments';nav.append(all);if(index<ordered.length-1)add(ordered[index+1],'Next');
 }).catch(()=>{/* Keep the published reading links if the manifest is unavailable. */});
 document.querySelectorAll('[data-hub-share]').forEach(el=>mount(el,el.dataset.shareTitle,el.dataset.shareUrl));
 if(/\/blog\/posts\//.test(location.pathname)){const h=document.querySelector('h1');const article=document.querySelector('article')||document.querySelector('main');if(h&&article){const host=document.createElement('aside');host.className='hub-post-share';article.append(host);mount(host,h.textContent.trim(),document.querySelector('link[rel="canonical"]')?.href||location.href);if(!document.querySelector('.hub-follow')&&!document.querySelector('a[href*="substack.com/subscribe"]')){const follow=document.createElement('aside');follow.className='hub-follow';const heading=document.createElement('h2');heading.textContent='Keep reading.';const a=document.createElement('a');a.href='/blog/';a.textContent='Explore the writing hub';const subscribe=document.createElement('a');subscribe.href='https://basinandassociates.substack.com/subscribe?utm_source=basinleon.github.io&utm_medium=owned&utm_campaign=article';subscribe.textContent='Subscribe to the Dispatch ↗';subscribe.target='_blank';subscribe.rel='noopener noreferrer';follow.append(heading,a,subscribe);article.append(follow);}}}
})();
