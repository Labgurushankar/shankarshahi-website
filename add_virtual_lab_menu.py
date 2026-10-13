#!/usr/bin/env python3
"""Run from your existing website repo root. Keeps all existing site files."""
from pathlib import Path
import re
root=Path(__file__).resolve().parent
index=root/'index.html'
if not index.exists():
    raise SystemExit('Cannot find homepage index.html. Run from existing website repository root.')
s=index.read_text(encoding='utf-8')
link='<a href="/virtual-lab/">Virtual Laboratory</a>'
if '/virtual-lab/' in s:
    print('Virtual Laboratory link already present; homepage unchanged.')
else:
    m=re.search(r'<div\b[^>]*class=["\'][^"\']*\bnav-links\b[^"\']*["\'][^>]*>',s,re.I)
    if m:
        pos=s.find('</div>',m.end())
        if pos<0: raise SystemExit('Could not locate closing menu div; no changes made.')
        s=s[:pos]+'      '+link+'\n    '+s[pos:]
    else:
        nav=re.search(r'</nav\s*>',s,re.I)
        if not nav: raise SystemExit('No navigation found; no changes made.')
        s=s[:nav.start()]+'  '+link+'\n'+s[nav.start():]
    bak=root/'index.before_virtual_lab.bak.html'
    if not bak.exists(): bak.write_text(index.read_text(encoding='utf-8'),encoding='utf-8')
    index.write_text(s,encoding='utf-8')
    print('Added Virtual Laboratory menu; backup:',bak)
print('Open /virtual-lab/ after deployment.')
