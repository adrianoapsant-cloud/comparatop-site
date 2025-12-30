#!/usr/bin/env python3
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with open('tools/minify.js', 'r', encoding='utf-8') as f:
    content = f.read()

old = "'js/analytics.js',"
new = "'js/compare-store.js',\n    'js/analytics.js',"

if old in content and 'compare-store.js' not in content:
    content = content.replace(old, new)
    with open('tools/minify.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Added compare-store.js to minify.js')
else:
    print('Already added or pattern not found')
