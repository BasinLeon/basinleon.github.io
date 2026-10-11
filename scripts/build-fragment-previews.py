"""Original typography cards for published fragments; no source images altered."""
from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
import json,re,textwrap,html
out=Path('assets/img/writing-previews');out.mkdir(parents=True,exist_ok=True)
serif='/System/Library/Fonts/Supplemental/Georgia.ttf';sans='/System/Library/Fonts/Supplemental/Arial.ttf'
items=json.loads(Path('data/fragments.json').read_text())
for item in items+[dict(slug='writing-hub',title='A room for the writing.',excerpt='Fragments, stories, essays, and the books behind them.')]:
 im=Image.new('RGB',(1200,630),'#0e0c09');d=ImageDraw.Draw(im);gold='#d9ab45';ivory='#f4eedf';d.line((72,64,1128,64),fill=gold,width=2);d.text((72,94),'LEON BASIN.  /  '+('SAM & INK · '+item['slug'].replace('-',' ').upper() if item['slug']!='writing-hub' else 'THE WRITING HUB'),font=ImageFont.truetype(sans,23),fill=gold)
 d.text((72,180),item['title'],font=ImageFont.truetype(serif,75),fill=ivory)
 lines=textwrap.wrap(item['excerpt'],width=61)
 for n,line in enumerate(lines[:4]):d.text((76,315+n*42),line,font=ImageFont.truetype(serif,28),fill='#cbbda6')
 d.text((76,550),'basinleon.github.io/blog',font=ImageFont.truetype(sans,22),fill=gold);im.save(out/(item['slug']+'.png'),optimize=True)
 if item['slug']=='writing-hub':p=Path('blog/index.html');alt='Leon Basin writing hub: fragments, stories, essays and books'
 else:p=Path('blog/posts')/(item['slug']+'.html');alt='Sam & Ink '+item['slug'].replace('-',' ')+': '+item['title']
 s=p.read_text();url='https://basinleon.github.io/'+str(out/(item['slug']+'.png'))
 for prop,value in [('og:image',url),('og:image:alt',alt),('og:description',item['excerpt'])]:
  tag='<meta property="'+prop+'" content="'+html.escape(value,quote=True)+'">'
  pattern=r'<meta\s+property="'+re.escape(prop)+r'"[^>]*>'
  s=re.sub(pattern,lambda m:tag,s) if re.search(pattern,s) else s.replace('</head>',tag+'</head>')
 for name,value in [('twitter:image',url),('twitter:description',item['excerpt'])]:
  tag='<meta name="'+name+'" content="'+html.escape(value,quote=True)+'">';pattern=r'<meta\s+name="'+name+r'"[^>]*>';s=re.sub(pattern,lambda m:tag,s) if re.search(pattern,s) else s.replace('</head>',tag+'</head>')
 p.write_text(s)
