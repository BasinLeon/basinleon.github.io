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
for item in json.loads(Path('data/posts.json').read_text()):
 path=Path('blog')/item['url']
 if not path.is_file():continue
 parser=Text();parser.feed(path.read_text());words=len(re.findall(r"\b[\w’'-]+\b",' '.join(parser.article or parser.main)))
 rows.append(dict(url='/blog/'+item['url'],title=item['title'],date=item['date'],tags=item.get('tags',[]),minutes=max(1,math.ceil(words/225))))
Path('blog/reading-index.json').write_text(json.dumps(rows,indent=2,ensure_ascii=False)+'\n')
