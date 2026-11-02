"""Build public reading metadata from published archive entries only."""
from pathlib import Path
from html.parser import HTMLParser
import json, re, math
class Text(HTMLParser):
 def __init__(self):super().__init__();self.stack=[];self.article=[];self.main=[]
 def handle_starttag(self,tag,attrs):
  if tag not in ['meta','link','img','br','hr','input','source','wbr']:self.stack.append(tag)
 def handle_endtag(self,tag):
  if tag in self.stack:self.stack=self.stack[:len(self.stack)-1-self.stack[::-1].index(tag)]
 def handle_data(self,data):
  if any(x in self.stack for x in ['script','style','nav','aside','header','footer']):return
  if 'article' in self.stack:self.article.append(data)
  if 'main' in self.stack:self.main.append(data)
rows=[]
posts=json.loads(Path('data/posts.json').read_text())
known={x['url'] for x in posts}
for fragment in json.loads(Path('data/fragments.json').read_text()):
 url=fragment['url'].removeprefix('/blog/')
 if url not in known:posts.append(dict(url=url,title=fragment['title'],date=fragment['date'],tags=['Sam & Ink','Fiction','Fragments']))
for item in posts:
 path=Path('blog')/item['url']
 if not path.is_file():continue
 parser=Text();parser.feed(path.read_text());words=len(re.findall(r"\b[\w’'-]+\b",' '.join(parser.article or parser.main)))
 row=dict(url='/blog/'+item['url'],title=item['title'],date=item['date'],tags=item.get('tags',[]),minutes=max(1,math.ceil(words/225)))
 if re.fullmatch(r'posts/fragment-\d+\.html',item['url']):row['words']=words
 rows.append(row)
Path('blog/reading-index.json').write_text(json.dumps(rows,indent=2,ensure_ascii=False)+'\n')
