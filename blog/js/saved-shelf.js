/* A private reading shelf, stored on this device only. */
(()=>{
 if(window.__lbSavedShelfLoaded)return;
 window.__lbSavedShelfLoaded=true;
 const key='basin-saved-reading-v1';
 const legacyKey='lb_saved';

 function readSaved(){
  let items=[];
  try{items=JSON.parse(localStorage.getItem(key))||[];}catch{}
  if(!Array.isArray(items))items=[];
  let migrated=false;
  try{
   const legacy=JSON.parse(localStorage.getItem(legacyKey)||'[]');
   if(Array.isArray(legacy)&&legacy.length){
    const seen=new Set(items.map(x=>x?.url));
    legacy.forEach(x=>{
     if(x&&typeof x.url==='string'&&/^\/blog\/posts\/[a-z0-9-]+\.html$/.test(x.url)&&!seen.has(x.url)){
      items.push({title:String(x.title||x.slug||'Saved entry'),url:x.url});
      seen.add(x.url);
      migrated=true;
     }
    });
    if(migrated){localStorage.setItem(key,JSON.stringify(items.slice(0,100)));}
   }
  }catch{}
  return items.filter(x=>x&&typeof x.title==='string'&&/^\/blog\/posts\/[a-z0-9-]+\.html$/.test(x.url)).slice(0,100);
 }

 let saved=readSaved();
 const host=document.querySelector('[data-saved-shelf]');
 const buttons=new Set();
 const status=document.createElement('span');
 status.className='hub-shelf-status';
 status.setAttribute('role','status');

 function render(){
  buttons.forEach(b=>{
   if(!b.isConnected){buttons.delete(b);return;}
   const active=saved.some(x=>x.url===b.dataset.url);
   b.textContent=active?'Saved · remove':'Save for later';
   b.setAttribute('aria-pressed',String(active));
  });
  document.querySelectorAll('[data-saved-count]').forEach(el=>{
   el.textContent=String(saved.length);
   if(el.closest('[data-saved-jump]'))el.closest('[data-saved-jump]').hidden=saved.length===0;
  });
  if(!host)return;
  host.replaceChildren();
  const h=document.createElement('h2');h.textContent='Your reading shelf';
  const p=document.createElement('p');
  p.textContent=saved.length?'Saved on this device. No account needed.':'Save a piece for your next quiet moment. Your shelf stays on this device.';
  host.append(h,p);
  if(saved.length){
   const list=document.createElement('ul');
   saved.forEach(x=>{
    const li=document.createElement('li');
    const a=document.createElement('a');a.href=x.url;a.textContent=x.title;
    const remove=document.createElement('button');remove.type='button';remove.textContent='Remove';
    remove.setAttribute('aria-label','Remove '+x.title+' from your shelf');
    remove.addEventListener('click',()=>toggle(x));
    li.append(a,remove);list.append(li);
   });
   host.append(list);
  }
  host.append(status);
 }

 function toggle(item){
  const next=saved.some(x=>x.url===item.url)?saved.filter(x=>x.url!==item.url):[item,...saved].slice(0,100);
  try{
   localStorage.setItem(key,JSON.stringify(next));
   saved=next;
   status.textContent='Reading shelf updated.';
   document.dispatchEvent(new CustomEvent('lb-saved-shelf-changed',{detail:{saved}}));
  }catch{
   status.textContent='Could not save. Browser storage is unavailable.';
  }
  render();
 }

 function mount(parent,title,url,shouldRender=true){
  if(parent.closest('[data-card-tools="off"]'))return;
  if(parent.querySelector('.hub-save'))return;
  const b=document.createElement('button');b.type='button';b.className='hub-save';b.dataset.url=url;
  b.addEventListener('click',()=>toggle({title,url}));
  buttons.add(b);parent.append(b);
  if(shouldRender)render();
 }

 const mountCards=container=>{
  let added=false;
  container.querySelectorAll('.hub-entry').forEach(card=>{
   const a=card.querySelector('h3 a');
   if(a&&!card.querySelector('.hub-save')){mount(card,a.textContent,new URL(a.href,location.origin).pathname,false);added=true;}
  });
  if(added)render();
 };

 mountCards(document);
 const grid=document.querySelector('#fragments .hub-grid, [data-fragment-shelf]');
 if(grid)new MutationObserver(()=>mountCards(grid)).observe(grid,{childList:true});

 const article=document.querySelector('article');
 const title=document.querySelector('h1')?.textContent.trim();
 if(/^\/blog\/posts\/[a-z0-9-]+\.html$/.test(location.pathname)&&article&&title&&!document.querySelector('.hub-reader-response')){
  const actions=document.createElement('aside');actions.className='hub-reader-response';
  mount(actions,title,location.pathname,false);
  const reply=document.createElement('a');reply.href='/#contact';reply.dataset.track='Writing: Reader reply';reply.textContent='What stayed with you?';
  const note=document.createElement('p');note.textContent='Send Leon a private note through the contact form.';
  actions.append(reply,note,status);
  const tools=document.querySelector('.hub-fragment-tools');
  if(tools)tools.append(actions);else article.after(actions);
 }

 render();
 document.addEventListener('lb-saved-shelf-changed',()=>{saved=readSaved();render();});
 addEventListener('storage',event=>{if(event.key===key){saved=readSaved();render();}});
})();
