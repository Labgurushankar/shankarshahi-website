SHANKAR SHAHI WEBSITE — MENU-ONLY ADD-ON
=========================================
CRITICAL: This package DOES NOT contain or replace your original root index.html.
It preserves all of your live site's calculators, books, CSS, images, JS and other folders.

FILES
virtual-lab/index.html            New virtual laboratory landing page
virtual-lab/glucose/index.html    Original Glucose V5 simulator (from your uploaded ZIP)
add_virtual_lab_menu.py           OPTIONAL one-time safe menu insertion script

INSTALL
1) Download a complete BACKUP of your CURRENT GitHub repository first.
2) Extract this ZIP and copy ONLY the virtual-lab/ folder into your existing repo ROOT.
3) To add the menu, edit your EXISTING root index.html without replacing it:
   Within <div id="links" class="nav-links"> add:
     <a href="/virtual-lab/">Virtual Lab</a>
   OR run python add_virtual_lab_menu.py from your LOCAL repo root.
4) Commit modified index.html and the new virtual-lab folder.
5) Do not upload the ZIP as one file or replace the whole repository contents.
6) Preserve ALL existing files and folders.

Result:
https://shankarshahi.com.np/             -> original homepage remains intact
https://shankarshahi.com.np/virtual-lab/ -> virtual lab landing page
https://shankarshahi.com.np/virtual-lab/glucose/ -> glucose test

If current website is already showing only the lab, first restore the correct
root index.html from the commit BEFORE that replacement. Adding this menu
alone will not restore a homepage that has already been overwritten.
