#!/usr/bin/env python3
"""Sanitized build-time checks; never publish raw logs or private source content."""
import importlib.util,json,re,subprocess,sys,os
from datetime import datetime,timezone
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def load(name,path):
 spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
links=load('site_links',ROOT/'scripts/validate-blog-links.py')
sitemap=links.validate_sitemap(ROOT)
missing=[i['link'] for i in sitemap if i['normalized']=='indexable blog post missing from sitemap']
# Use the actual validator's complete pass/fail result, with file paths only.
r=subprocess.run([sys.executable,str(ROOT/'scripts/validate-blog-links.py')],capture_output=True,text=True,cwd=ROOT)
plain=re.sub(r'\x1b\[[0-9;]*m','',r.stdout+r.stderr)
link_files=sorted(set(re.findall(r'^  • (.+)$',plain,re.M)))
r2=subprocess.run([sys.executable,str(ROOT/'scripts/validate-public-safety.py')],capture_output=True,text=True,cwd=ROOT)
findings=[x.strip()[2:] for x in r2.stdout.splitlines() if x.strip().startswith('- ')]
sha=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip()
data={'checked_commit':sha,'checked_at':datetime.now(timezone.utc).isoformat(),'validators':[
 {'workflow':'validate-links.yml','name':'Site links','status':'failure' if r.returncode else 'success','files':link_files},
 {'workflow':'validate-public-safety.yml','name':'Public safety','status':'failure' if r2.returncode else 'success','files':sorted(set(x.rsplit(': ',1)[-1] for x in findings))}],
 'sitemap':{'missing':missing,'published_posts':len(list((ROOT/'blog/posts').glob('*.html')))}}
if os.environ.get('SYSTEM_HEALTH_METADATA') == '1':
    def api(path):
        r=subprocess.run(['gh','api','repos/BasinLeon/basinleon.github.io/'+path],capture_output=True,text=True,timeout=20)
        if r.returncode: raise RuntimeError('GitHub metadata request failed')
        return json.loads(r.stdout)
    try:
        runs=api('actions/runs?status=success&per_page=100&branch=main').get('workflow_runs',[])
        markers={}
        for run in runs:
            if run.get('name') not in ['Deploy Hybrid Site','pages build and deployment'] or run.get('head_branch')!='main' or run.get('conclusion')!='success': continue
            marker={'commit':run['head_sha'],'at':run['updated_at'],'url':run['html_url'],'source':'Successful Pages deployment workflow completion'}
            if marker['commit'] not in markers or marker['at']<markers[marker['commit']]['at']: markers[marker['commit']]=marker
        data['releases']=sorted(markers.values(),key=lambda r:r['at'],reverse=True)
        for validator in data['validators']:
            runs=api('actions/workflows/'+validator['workflow']+'/runs?per_page=1&branch=main').get('workflow_runs',[])
            if runs:
                run=runs[0]
                validator.update(workflow_status=run.get('conclusion') or run['status'],workflow_commit=run['head_sha'],url=run['html_url'])
        data['metadata_checked_at']=datetime.now(timezone.utc).isoformat()
    except (RuntimeError,subprocess.TimeoutExpired,json.JSONDecodeError):
        data['metadata_error']='GitHub workflow metadata unavailable during build'
target=Path(sys.argv[1]) if len(sys.argv)>1 else ROOT/'analytics-worker/src/system-snapshot.json'
target.parent.mkdir(parents=True,exist_ok=True);target.write_text(json.dumps(data,indent=2)+'\n')
print(f'Health snapshot: {len(link_files)} link files; {len(findings)} safety findings; {len(missing)} missing posts')
