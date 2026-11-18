#!/usr/bin/env python3
"""Index tracked read-next cards for the private analytics report. --check is read-only."""
import argparse,json,sys,subprocess
from html.parser import HTMLParser
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
TARGET=ROOT/'analytics-worker/worker/reading-paths.json'
class Card(HTMLParser):
 def __init__(self):
  super().__init__();self.depth=0;self.capture=None;self.title=False;self.title_text='';self.links=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='h1':self.title=True
  if tag=='aside':
   if self.depth:self.depth+=1
   elif 'read-next' in a.get('class','').split():self.depth=1
  if tag=='a' and self.depth and a.get('data-track')=='Writing: read next':self.capture=[a.get('href',''),'']
 def handle_data(self,text):
  if self.title:self.title_text+=text
  if self.capture is not None:self.capture[1]+=text
 def handle_endtag(self,tag):
  if tag=='h1':self.title=False
  if tag=='a' and self.capture is not None:self.links.append(self.capture);self.capture=None
  if tag=='aside' and self.depth:self.depth-=1
parser=argparse.ArgumentParser();parser.add_argument('--check',action='store_true');parser.add_argument('--since');args=parser.parse_args()
old=json.loads(TARGET.read_text()) if TARGET.exists() else []
previous={(x['fragment'],x['destination']):x for x in old}
paths=[]
tracked=subprocess.check_output(['git','ls-files','blog/posts/*.html'],cwd=ROOT,text=True).splitlines()
for p in (ROOT/name for name in sorted(tracked)):
 card=Card();card.feed(p.read_text());source='/blog/posts/'+p.name
 for destination,label in card.links:
  if not destination.startswith('/blog/posts/') or not (ROOT/destination.lstrip('/')).is_file():raise SystemExit('Invalid reading destination: '+destination)
  prior=previous.get((source,destination));since=prior['since'] if prior else args.since
  if not since:raise SystemExit('New reading path requires --since UTC: '+source+' -> '+destination)
  paths.append(dict(fragment=source,destination=destination,title=card.title_text.strip(),destination_title=label.strip(),since=since))
text=json.dumps(paths,indent=2,ensure_ascii=False)+'\n'
if args.check:
 if not TARGET.exists() or TARGET.read_text()!=text:raise SystemExit('Reading paths differ from published cards; run scripts/sync-reading-paths.py --since "YYYY-MM-DD HH:MM:SS"')
 print(f'Reading paths match {len(paths)} published recommendations.')
else:TARGET.write_text(text);print(f'Indexed {len(paths)} reading recommendations.')
