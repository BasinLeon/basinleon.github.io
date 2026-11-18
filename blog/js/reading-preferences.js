/* Reading choices and fragment position stay on this device. */
(()=>{
 const root=document.documentElement;
 const isHub=document.body.classList.contains('writing-hub');
 const isShelf=location.pathname==='/blog/fiction/sam-and-ink/'||location.pathname.startsWith('/answers');
 const isPost=/^\/blog\/posts\/[a-z0-9-]+\.html$/.test(location.pathname);
 const isStory=document.body.classList.contains('fiction-story-reader')||document.body.classList.contains('hub-reader');
 if(!isHub&&!isPost&&!isShelf&&!isStory)return;
 if(document.querySelector('.hub-reading-preferences'))return;
 if(isPost||isShelf||isStory)document.body.classList.add('hub-reader');
 const read=key=>{try{return JSON.parse(localStorage.getItem(key));}catch{return null;}};
 const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{/* Reading works without storage. */}};
 const key='basin-reading-preferences-v1';
 const saved=read(key);
 let legacy=null;try{legacy=localStorage.getItem('fiction-reading-theme');}catch{/* Optional local preferences. */}
 let mode=['paper','dark'].includes(saved?.mode)?saved.mode:(isStory&&legacy!=='dark'?'paper':'dark');
 let size=['normal','large','larger'].includes(saved?.size)?saved.size:'normal';
 if(isStory&&!saved&&legacy)write(key,{mode,size});
 function apply(){root.dataset.readingMode=mode;root.dataset.readingSize=size;if(isStory)root.dataset.readingTheme=mode==='dark'?'dark':'light';}
 apply();
 const panel=document.createElement('details');panel.className='hub-reading-preferences';
 const summary=document.createElement('summary');summary.textContent='Reading preferences';panel.append(summary);
 const controls=document.createElement('div');controls.className='hub-reading-controls';
 function select(label,values,current,change){const wrap=document.createElement('label');wrap.textContent=label;const input=document.createElement('select');input.setAttribute('aria-label',label);values.forEach(([value,text])=>{const option=document.createElement('option');option.value=value;option.textContent=text;input.append(option);});input.value=current;input.addEventListener('change',()=>{change(input.value);if(document.startViewTransition&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){try{const t=document.startViewTransition(()=>apply());if(t?.ready)t.ready.catch(()=>{});if(t?.finished)t.finished.catch(()=>{});}catch{apply();}}else{apply();}write(key,{mode,size});});wrap.append(input);controls.append(wrap);}
 select('Appearance',[['dark','Dark'],['paper','Warm paper']],mode,value=>mode=value);
 select('Text size',[['normal','Standard'],['large','Large'],['larger','Larger']],size,value=>size=value);
 panel.append(controls);
 const target=isHub?document.querySelector('.hero-inner'):document.querySelector('main, article, .post-container, .blog-content');if(target)target.prepend(panel);
 const lastKey='basin-last-fragment-v1';const previous=read(lastKey);
 const valid=value=>value&&/^\/blog\/posts\/fragment-\d+\.html$/.test(value.path)&&typeof value.title==='string';
 const host=document.querySelector('[data-continue-reading]');if(host&&valid(previous)){const a=document.createElement('a');a.href=previous.path+'#resume';a.textContent='Continue where you left off: '+previous.title;host.append(a);host.hidden=false;}
 if(/^\/blog\/posts\/fragment-\d+\.html$/.test(location.pathname)){
 const title=document.querySelector('h1')?.textContent.trim()||'Sam & Ink';
 function save(){write(lastKey,{path:location.pathname,title,progress:Math.min(1,Math.max(0,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)))});}
 if(location.hash==='#resume'&&valid(previous)&&previous.path===location.pathname){requestAnimationFrame(()=>requestAnimationFrame(()=>{scrollTo(0,(Number(previous.progress)||0)*Math.max(0,document.documentElement.scrollHeight-innerHeight));save();}));}else save();
 let timer;addEventListener('scroll',()=>{clearTimeout(timer);timer=setTimeout(save,200);},{passive:true});addEventListener('pagehide',save);
 const prevLink=document.querySelector('.hub-reading-next a[data-track*="previous"]');
 const nextLink=document.querySelector('.hub-reading-next a[data-track*="next"]');
 addEventListener('keydown',ev=>{
  if(ev.defaultPrevented||ev.metaKey||ev.ctrlKey||ev.altKey)return;
  if(/^(INPUT|TEXTAREA|SELECT|VIDEO)$/.test(document.activeElement?.tagName||''))return;
  if(ev.key==='ArrowLeft'&&prevLink){ev.preventDefault();prevLink.click();}
  if(ev.key==='ArrowRight'&&nextLink){ev.preventDefault();nextLink.click();}
 });
 const navBar=document.querySelector('.hub-reading-next');
 const slugMatch=location.pathname.match(/(fragment-\d+)/);
 if(navBar&&slugMatch&&navigator.clipboard){
  const copyBtn=document.createElement('button');
  copyBtn.type='button';
  copyBtn.textContent='Copy tagged link';
  copyBtn.style.cssText='background:transparent;border:1px solid currentColor;color:inherit;padding:.35rem .7rem;font:inherit;font-size:.78rem;cursor:pointer;min-height:36px;opacity:.85';
  copyBtn.addEventListener('click',()=>{
   const tagged='https://basinleon.github.io'+location.pathname+'?utm_source=social&utm_medium=share&utm_campaign='+slugMatch[1];
   navigator.clipboard.writeText(tagged).then(()=>{
    copyBtn.textContent='Copied link ✓';
    setTimeout(()=>{copyBtn.textContent='Copy tagged link';},2000);
   }).catch(()=>{});
  });
  navBar.append(copyBtn);
 }
 }
})();
