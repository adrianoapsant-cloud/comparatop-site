#!/usr/bin/env python3
"""
Fix showComparePrompt to not show on mobile
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with open('js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the display logic to check for mobile
old_code = "    prompt.style.display = 'block';\n}"

new_code = """    // Don't show floating prompt on mobile - use bottom nav instead
    if (window.innerWidth > 768) {
        prompt.style.display = 'block';
    }
}"""

if old_code in content:
    content = content.replace(old_code, new_code)
    with open('js/main.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print('✓ Updated showComparePrompt to skip mobile')
else:
    print('✗ Pattern not found')
