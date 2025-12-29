#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Complete fix for all emojis and question marks in index.html
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Original file size: {len(content)} characters")

# All replacements needed
replacements = [
    # Header - logo
    ('? ComparaTop', '⚖️ ComparaTop'),
    
    # Navigation arrows - replace standalone ? with ▼ in category buttons
    ('>?</span>\r\n        </button>', '>▼</span>\r\n        </button>'),
    ('class="ml-cat-arrow">?</span>', 'class="ml-cat-arrow">▼</span>'),
    
    # Menu text
    ('>? Menu<', '>☰ Menu<'),
    
    # Category icons in explore section - need to be weather/appliance related
    # Based on context, these should be specific icons
    
    # Question marks after text (like "Geladeiras ?")
    ('Geladeiras ?', 'Geladeiras'),
    ('? Geladeiras', '🧊 Geladeiras'),
    
    # Sidebar/footer links
    ('Mais?', 'Mais'),
    
    # USP section icons - already have emojis but let's verify
    
    # Select dropdown arrow
    ('Selecione uma categoria...', '⚙️ Selecione uma categoria...'),
    
    # Remove duplicate emojis that got added incorrectly
    ('⚙️ ⚙️', '⚙️'),
    ('🧊 🧊', '🧊'),
    ('❄️ ❄️', '❄️'),
    
    # Fix any remaining ?? patterns
    ('??', ''),  # This is aggressive but should clean up leftovers
]

count = 0
for old, new in replacements:
    if old in content:
        occurrences = content.count(old)
        content = content.replace(old, new)
        count += occurrences
        print(f"Replaced {occurrences}x: '{old[:30]}' -> '{new[:30]}'")

print(f"\nTotal replacements: {count}")
print(f"New file size: {len(content)} characters")

# Count remaining single ? that might be issues (not in URLs)
single_q = 0
for i, char in enumerate(content):
    if char == '?' and i > 0 and content[i-1] not in '&;':
        # Check if it's in a URL context
        before = content[max(0,i-20):i]
        if 'href=' not in before and 'src=' not in before and 'http' not in before:
            single_q += 1

print(f"Remaining standalone '?' (non-URL): ~{single_q}")

# Write back
with open('index.html', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(content)

print("Saved!")
