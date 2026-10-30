import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../../assets/js/insights.js',import.meta.url),'utf8');
function clickFixture(path,method,{owner=false,automated=false,dnt=false,gpc=false}={}){
 const sent=[],listeners={};const storage=new Map(owner?[['lb:insights:owner-optout:v1','1']]:[]);
 const location=new URL('https://basinleon.github.io'+path);
 const href=method==='gmail'?'https://mail.google.com/mail/?view=cm&to=lbasin23%40gmail.com':'mailto:lbasin23@gmail.com?subject=Senior%20GTM%20mandate';
 const link={href,dataset:{track:'Hiring path: live email CTA',hiringStep:'email'},hasAttribute:()=>false,getAttribute:key=>key==='href'?href:null,textContent:'Email Leon about a role',closest:()=>({tagName:'SECTION'})};
 const store={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
 const context={document:{title:'Fixture résumé',body:{dataset:{lbSection:'resume'}},cookie:'',referrer:'',hidden:false,querySelector:()=>null,addEventListener:(name,fn)=>listeners[name]=fn,documentElement:{scrollHeight:1000}},location,URL,URLSearchParams,crypto:{randomUUID:()=> 'fixture-anonymous-id'},navigator:{webdriver:automated,userAgent:'Fixture browser',doNotTrack:dnt?'1':'0',globalPrivacyControl:gpc,sendBeacon:(url,body)=>{sent.push(body);return true;}},localStorage:store,sessionStorage:store,fetch:async(url,options)=>{sent.push(options.body);return {ok:true}},Date,Blob,window:{innerWidth:390,innerHeight:900,addEventListener(){},setInterval(){}}};
 vm.runInNewContext(source,context);
 if(listeners.click)listeners.click({target:{closest:selector=>selector==='a[href]'?link:null}});
 return sent;
}
test('non-owner CTA fixtures emit one email click per method; owner, automation and privacy opt-outs emit none',async()=>{
 for(const page of ['/','/resume.html','/case-studies/'])for(const method of ['email','gmail']){
  const payloads=await Promise.all(clickFixture(page,method).map(async x=>JSON.parse(typeof x==='string'?x:await x.text())));
  const clicks=payloads.filter(x=>x.type==='Email Click');assert.equal(clicks.length,1);assert.equal(clicks[0].page,page);assert.equal(clicks[0].detail.destination,method);assert.equal(clicks[0].detail.action,method==='gmail'?'hiring-email-gmail':'hiring-email-mailto');
 }
 for(const page of ['/','/resume.html','/case-studies/'])for(const options of [{owner:true},{automated:true},{dnt:true},{gpc:true}])assert.equal(clickFixture(page,'email',options).length,0);
});
