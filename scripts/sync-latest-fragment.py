#!/usr/bin/env python3
"""Keep the no-JavaScript latest/arrival links aligned with the published manifest."""
import argparse,datetime,html,json,re
from pathlib import Path
root=Path(__file__).resolve().parents[1]
args=argparse.ArgumentParser();args.add_argument('--check',action='store_true');args=args.parse_args()
items=json.loads((root/'data/fragments.json').read_text())
x=max(items,key=lambda x:int(x['slug'].split('-')[-1]));number=int(x['slug'].split('-')[-1]);E=html.escape
assert re.fullmatch(r'fragment-\d+',x['slug']) and x['url']=='/blog/posts/'+x['slug']+'.html'
p=root/'blog/index.html';original=p.read_text();s=original
for pattern,value in [(r'(data-latest-title>).*?(</h[23]>)',E(x['title'])),(r'(data-latest-number>).*?(</span>)','Fragment '+str(number)),(r'(data-latest-excerpt>).*?(</p>)',E(x['excerpt']))]:
 s,n=re.subn(pattern,lambda m:m[1]+value+m[2],s);assert n==1
s,n=re.subn(r'data-latest-read href="[^"]+"','data-latest-read href="'+x['url']+'"',s);assert n==1
date=datetime.date.fromisoformat(x['date']);s,n=re.subn(r'<time data-latest-date.*?</time>',f'<time data-latest-date datetime="{x["date"]}">{date.strftime("%B")} {date.day}, {date.year}</time>',s);assert n==1
s,n=re.subn(r'(data-arrival-read href=")[^"]+("[^>]*>).*?(</a>)',lambda m:m[1]+x['url']+m[2]+'Read Fragment '+str(number)+': '+E(x['title'])+m[3],s);assert n==1
if args.check:
 if s!=original:raise SystemExit('Latest fragment fallback is stale. Run python3 scripts/sync-latest-fragment.py')
 print('Latest/arrival fallback matches '+x['slug'])
else:p.write_text(s);print('Synchronized latest/arrival fallback: '+x['slug'])
