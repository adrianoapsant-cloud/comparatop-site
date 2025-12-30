#!/usr/bin/env python3
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the duplicate button text
old_text = '''                                    <button class="newsletter-btn" onclick="subscribeNewsletter()">✉️ Cadastrar
                                        Email</button>

                                    Email</button>'''

new_text = '''                                    <button class="newsletter-btn" onclick="subscribeNewsletter()">✉️ Cadastrar Email</button>'''

if old_text in content:
    content = content.replace(old_text, new_text)
    with open('index.html', 'w', encoding='utf-8', newline='\r\n') as f:
        f.write(content)
    print('Fixed!')
else:
    print('Pattern not found, trying alternate...')
    # Check what's actually there
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if 'Cadastrar' in line:
            print(f'{i}: {repr(line[:80])}')
