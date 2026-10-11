/* Reading choices and fragment position stay on this device. */
(()=>{
 const root=document.documentElement;
 const isHub=document.body.classList.contains('writing-hub');
 const isPost=/^\/blog\/posts\/[a-z0-9-]+\.html$/.test(location.pathname);
 if(!isHub&&!isPost)return;
 if(isPost)document.body.classList.add('hub-reader');
 const read=key=>{try{return JSON.parse(localStorage.getItem(key));}catch{return null;}};
 const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{/* Reading works without storage. */}};
 const key='basin-reading-preferences-v1';
 const saved=read(key);let mode=saved?.mode==='paper'?'paper':'dark';let size=['normal','large','larger'].includes(saved?.size)?saved.size:'normal';
 function apply(){root.dataset.readingMode=mode;root.dataset.readingSize=size;}
 apply();
 const panel=document.createElement('details');panel.className='hub-reading-preferences';
 const summary=document.createElement('summary');summary.textContent='Reading preferences';panel.append(summary);
 const controls=document.createElement('div');controls.className='hub-reading-controls';
 function select(label,values,current,change){const wrap=document.createElement('label');wrap.textContent=label;const input=document.createElement('select');values.forEach(([value,text])=>{const option=document.createElement('option');option.value=value;option.textContent=text;input.append(option);});input.value=current;input.addEventListener('change',()=>{change(input.value);apply();write(key,{mode,size});});wrap.append(input);controls.append(wrap);}
 select('Appearance',[['dark','Dark'],['paper','Warm paper']],mode,value=>mode=value);
 select('Text size',[['normal','Standard'],['large','Large'],['larger','Larger']],size,value=>size=value);
 const note=document.createElement('p');note.textContent='Saved on this device. No account needed.';controls.append(note);panel.append(controls);
 const target=isHub?document.querySelector('.hero-inner'):document.querySelector('main');if(target)target.prepend(panel);
 const lastKey='basin-last-fragment-v1';const previous=read(lastKey);
 const valid=value=>value&&/^\/blog\/posts\/fragment-\d+\.html$/.test(value.path)&&typeof value.title==='string';
 const host=document.querySelector('[data-continue-reading]');if(host&&valid(previous)){const a=document.createElement('a');a.href=previous.path+'#resume';a.textContent='Continue where you left off: '+previous.title;host.append(a);host.hidden=false;}
 if(/^\/blog\/posts\/fragment-\d+\.html$/.test(location.pathname)){
 const title=document.querySelector('h1')?.textContent.trim()||'Sam & Ink';
 function save(){write(lastKey,{path:location.pathname,title,progress:Math.min(1,Math.max(0,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)))});}
 if(location.hash==='#resume'&&valid(previous)&&previous.path===location.pathname){requestAnimationFrame(()=>requestAnimationFrame(()=>{scrollTo(0,(Number(previous.progress)||0)*Math.max(0,document.documentElement.scrollHeight-innerHeight));save();}));}else save();
 let timer;addEventListener('scroll',()=>{clearTimeout(timer);timer=setTimeout(save,200);},{passive:true});addEventListener('pagehide',save);
 }
})();
