#!/usr/bin/env python3
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add compare-store.js before main.js
old_text = '''    <script src="/js/main.js?v=20251229a" defer></script>'''

new_text = '''    <script src="/js/compare-store.js?v=20251230a" defer></script>
    <script src="/js/main.js?v=20251230a" defer></script>'''

if old_text in content:
    content = content.replace(old_text, new_text)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('✓ Added compare-store.js to index.html')
else:
    print('✗ Pattern not found')
