#!/usr/bin/env python3
"""Publish only the sanitized health snapshot; never copy credentials or raw logs."""
import base64,json,subprocess,sys
from pathlib import Path
REPO='repos/BasinLeon/basinleon.github.io/'
def api(path,method='GET',payload=None):
    args=['gh','api',REPO+path,'--method',method]
    if payload is not None: args+=['--input','-']
    r=subprocess.run(args,input=json.dumps(payload) if payload is not None else None,text=True,capture_output=True)
    if r.returncode: raise RuntimeError('Status publication API request failed')
    return json.loads(r.stdout) if r.stdout.strip() else {}
snapshot=json.loads(Path(sys.argv[1]).read_text())
assert set(snapshot)<=set('checked_commit checked_at validators sitemap releases metadata_checked_at metadata_error'.split())
# The branch contains a single JSON file and has no source checkout or secrets.
try: head=api('git/ref/heads/dashboard-health')['object']['sha']
except RuntimeError: head=None
blob=api('git/blobs','POST',{'content':json.dumps(snapshot,indent=2)+'\n','encoding':'utf-8'})
tree=api('git/trees','POST',{'tree':[{'path':'system-health.json','mode':'100644','type':'blob','sha':blob['sha']}]})
commit=api('git/commits','POST',{'message':'Refresh sanitized dashboard system health','tree':tree['sha'],'parents':[head] if head else []})
if head: api('git/refs/heads/dashboard-health','PATCH',{'sha':commit['sha']})
else: api('git/refs','POST',{'ref':'refs/heads/dashboard-health','sha':commit['sha']})
print('Published sanitized dashboard-health snapshot')
