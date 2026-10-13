#!/usr/bin/env python3
"""Safely add only one navigation link to an existing Shankar Shahi homepage.
Never replace its content or edit any other file.
"""
from pathlib import Path
import re
homepage = Path(__file__).resolve().parent / "index.html"
if not homepage.is_file():
    raise SystemExit("ERROR: Place this script in the existing website root, beside index.html.")
original = homepage.read_bytes()
html = original.decode("utf-8")
if re.search(r'href\s*=\s*["\'](?:/|\./)?virtual-lab/?["\']', html, re.I):
    print("Virtual Lab menu already exists; no file changed.")
    raise SystemExit(0)
nav = re.search(r'<div\b[^>]*\bclass\s*=\s*["\'][^"\']*\bnav-links\b[^"\']*["\'][^>]*>',html,re.I)
if not nav:
    raise SystemExit("ERROR: Original nav-links not found. Homepage UNCHANGED.")
addition = '\n      <a href="/virtual-lab/">Virtual Lab</a>'
updated = html[:nav.end()] + addition + html[nav.end():]
backup = homepage.with_name("index.before_virtual_lab_menu.backup.html")
if not backup.exists():
    backup.write_bytes(original)
homepage.write_bytes(updated.encode("utf-8"))
print("SUCCESS: Added only Virtual Lab menu. Previous homepage backed up.")
