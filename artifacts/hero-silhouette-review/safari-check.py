import json, subprocess, time, urllib.request, urllib.error
from pathlib import Path
status={'engine_check':'WebKit passed separately'}
driver=subprocess.Popen(['/usr/bin/safaridriver','--port','5193'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
 time.sleep(.8)
 request=urllib.request.Request('http://127.0.0.1:5193/session',data=json.dumps({'capabilities':{'alwaysMatch':{'browserName':'safari'}}}).encode(),headers={'Content-Type':'application/json'},method='POST')
 try:
  response=json.load(urllib.request.urlopen(request,timeout=15))
  status.update(status='available',response=response)
  session=response['value']['sessionId']
  urllib.request.urlopen(urllib.request.Request(f'http://127.0.0.1:5193/session/{session}',method='DELETE'),timeout=10)
 except urllib.error.HTTPError as error:
  status.update(status='blocked',response=json.loads(error.read()))
 except Exception as error:
  status.update(status='unavailable',reason=str(error))
finally:
 driver.terminate()
 driver.wait(timeout=5)
Path('artifacts/hero-silhouette-review/safari-status.json').write_text(json.dumps(status,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(status,ensure_ascii=False))
