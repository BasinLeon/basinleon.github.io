import unittest,tempfile,shutil,json,subprocess,re
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
class Publishing(unittest.TestCase):
 def test_one_pass_preserves_existing_writing_and_rejects_missing_video(self):
  with tempfile.TemporaryDirectory() as d:
   root=Path(d)
   for name in ['blog','data','scripts']:
    shutil.copytree(ROOT/name,root/name)
   shutil.copy(ROOT/'sitemap.xml',root/'sitemap.xml')
   before=(root/'blog/posts/fragment-09.html').read_text();paragraphs=re.findall(r'<p>.*?</p>',before);videos=re.findall(r'<video.*?</video>',before)
   f=dict(status='approved',date='2026-10-13',slug='fragment-10',title='Test draft only',paragraphs=['This is synthetic text for a local publishing test.'],video='/assets/video/fragments/test.mp4')
   source=root/'approved.json';source.write_text(json.dumps(f));run=lambda:subprocess.run(['node','scripts/publish-fragment.mjs',str(source)],cwd=root,capture_output=True,text=True)
   self.assertNotEqual(run().returncode,0);self.assertFalse((root/'blog/posts/fragment-10.html').exists())
   reel=root/f['video'].lstrip('/');reel.parent.mkdir(parents=True);reel.write_bytes(b'local fixture')
   result=run();self.assertEqual(result.returncode,0,result.stderr)
   for name in ['blog/index.html','blog/fiction/sam-and-ink/index.html','blog/rss.xml','sitemap.xml']:
    self.assertIn('fragment-10',(root/name).read_text())
   self.assertIn('data-latest-title>Test draft only',(root/'blog/index.html').read_text())
   self.assertIn('fragment-10',(root/'blog/posts/fragment-09.html').read_text())
   after=(root/'blog/posts/fragment-09.html').read_text();self.assertEqual(paragraphs,re.findall(r'<p>.*?</p>',after));self.assertEqual(videos,re.findall(r'<video.*?</video>',after))
   snapshot={p:str(p.read_text()) for p in root.rglob('*') if p.is_file() and p.suffix in ['.html','.json','.xml']}
   subprocess.run(['python3','scripts/sync-fragments.py'],cwd=root,check=True,capture_output=True)
   self.assertEqual(snapshot,{p:str(p.read_text()) for p in snapshot})
   self.assertNotEqual(run().returncode,0)
if __name__=='__main__':unittest.main()
