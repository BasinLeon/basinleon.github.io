"""Synchronize published fragment HTML into every public reading surface."""
from pathlib import Path
import re,json,html,subprocess,email.utils,datetime
E=lambda x:html.escape(str(x),quote=True)
items=[]
for path in Path('blog/posts').glob('fragment-*.html'):
 s=path.read_text();title=html.unescape(re.search(r'<h1[^>]*>(.*?)</h1>',s,re.S)[1]);date=re.search(r'<time[^>]*datetime="([0-9-]+)"',s)[1];article=re.search(r'<article[^>]*>(.*?)</article>',s,re.S)[1];opening=html.unescape(re.sub('<[^>]+>','',re.search(r'<p[^>]*>(.*?)</p>',article,re.S)[1]));items.append(dict(slug=path.stem,title=title,date=date,url='/'+str(path),excerpt=opening))
items.sort(key=lambda x:(x['date'],int(x['slug'].split('-')[-1])),reverse=True)
if not items:raise SystemExit('No published fragments.')
Path('data/fragments.json').write_text(json.dumps(items,indent=2,ensure_ascii=False)+'\n')
p=Path('data/posts.json');posts=[x for x in json.loads(p.read_text()) if not re.fullmatch(r'posts/fragment-\d+\.html',x['url'])];posts=[dict(title=x['title'],date=x['date'],tags=['Sam & Ink','Fiction','Fragments'],excerpt=x['excerpt'],url=x['url'].removeprefix('/blog/'),category='Fiction') for x in items]+posts;p.write_text(json.dumps(posts,indent=2,ensure_ascii=False)+'\n')
ordered=sorted(items,key=lambda x:int(x['slug'].split('-')[-1]))
cards=''.join(f'<article class="hub-entry"><span class="hub-label">Sam &amp; Ink · Fragment {x["slug"].split("-")[-1]}</span><h3><a href="{x["url"]}">{E(x["title"])}</a></h3><time datetime="{x["date"]}">Published here · {x["date"]}</time><p>{E(x["excerpt"])}</p><div data-hub-share data-share-title="{E(x["title"])}" data-share-url="{x["url"]}"></div></article>' for x in ordered)
for name in ['blog/index.html','blog/fiction/sam-and-ink/index.html']:
 p=Path(name);s=p.read_text();s=re.sub(r'(<div class="hub-grid"(?: data-fragment-shelf)?>).*?(</div>)(?=</div>|<p class="hub-note")',lambda m:m[1]+cards+m[2],s,count=1,flags=re.S)
 if name=='blog/index.html':
  x=items[0];s=re.sub(r'(data-latest-title>).*?(</h1>)',lambda m:m[1]+E(x['title'])+m[2],s);s=re.sub(r'(data-latest-number>).*?(</span>)',lambda m:m[1]+'Fragment '+x['slug'].split('-')[-1]+m[2],s);s=re.sub(r'(data-latest-excerpt>).*?(</div>)',lambda m:m[1]+E(x['excerpt'])+m[2],s);s=re.sub(r'data-latest-read href="[^"]+"','data-latest-read href="'+x['url']+'"',s);date=datetime.date.fromisoformat(x['date']);s=re.sub(r'<time data-latest-date.*?</time>',f'<time data-latest-date datetime="{x["date"]}">{date.strftime("%B")} {date.day}, {date.year}</time>',s)
 p.write_text(s)
for i,x in enumerate(ordered):
 p=Path(x['url'].lstrip('/'));s=p.read_text();links=[]
 if i:links.append(f'<a href="{ordered[i-1]["url"]}">Previous: {E(ordered[i-1]["title"])}</a>')
 links.append('<a href="/blog/fiction/sam-and-ink/#fragments">All fragments</a>')
 if i+1<len(ordered):links.append(f'<a href="{ordered[i+1]["url"]}">Next: {E(ordered[i+1]["title"])}</a>')
 nav='<nav class="hub-reading-next" aria-label="Fragment reading order">'+''.join(links)+'</nav>'
 s=re.sub(r'<nav class="hub-reading-next".*?</nav>',lambda m:nav,s,flags=re.S) if 'class="hub-reading-next"' in s else s.replace('</article>','</article>'+nav,1);p.write_text(s)
p=Path('blog/rss.xml');s=p.read_text();s=re.sub(r'<item>.*?</item>',lambda m:'' if re.search(r'/blog/posts/fragment-\d+\.html',m[0]) else m[0],s,flags=re.S);feed=''.join(f'<item><title>{E(x["title"])}</title><link>https://basinleon.github.io{x["url"]}</link><guid isPermaLink="true">https://basinleon.github.io{x["url"]}</guid><pubDate>{email.utils.format_datetime(datetime.datetime.fromisoformat(x["date"]+"T12:00:00+00:00"),usegmt=True)}</pubDate><description>{E(x["excerpt"])}</description></item>' for x in items);p.write_text(chr(10).join(line.rstrip() for line in s.replace('</channel>',feed+'</channel>').splitlines())+chr(10))
p=Path('sitemap.xml');s=p.read_text();s=re.sub(r'<url>.*?</url>',lambda m:'' if re.search(r'/blog/posts/fragment-\d+\.html',m[0]) else m[0],s,flags=re.S);p.write_text(s.replace('</urlset>',''.join(f'<url><loc>https://basinleon.github.io{x["url"]}</loc><lastmod>{x["date"]}</lastmod></url>' for x in items)+'</urlset>'))
subprocess.run(['python3','scripts/build-reading-index.py'],check=True)
print('Synchronized',len(items),'published fragments; latest:',items[0]['slug'])
