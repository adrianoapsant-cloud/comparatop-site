#!/usr/bin/env python3
"""
Remove bottom nav bar from index.html completely
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and remove the bottom bar section
old_bottom_bar = '''    <!-- Mobile Bottom Bar -->

    <nav class="ml-bottom-bar" id="ml-bottom-bar">

        <a href="/" class="ml-bottom-item" id="bottom-home">

            <span class="ml-bottom-icon">🏠</span>

            <span class="ml-bottom-label">Início</span>

        </a>

        <button class="ml-bottom-item" id="bottom-categories" onclick="openBottomSheet('categories')">

            <span class="ml-bottom-icon">📂</span>

            <span class="ml-bottom-label">Categorias</span>

        </button>

        <button class="ml-bottom-item" id="bottom-compare" onclick="handleCompareClick()">

            <span class="ml-bottom-icon">⚖️</span>

            <span class="ml-bottom-label">Comparar</span>

            <span class="ml-bottom-badge" id="bottom-compare-badge">0</span>

        </button>

        <button class="ml-bottom-item" id="bottom-more" onclick="openBottomSheet('more')">

            <span class="ml-bottom-icon">☰</span>

            <span class="ml-bottom-label">Mais</span>

        </button>

    </nav>'''

if old_bottom_bar in content:
    content = content.replace(old_bottom_bar, '    <!-- Mobile Bottom Bar: Removed - Compare button is now in header -->')
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('✓ Removed bottom nav bar from index.html')
else:
    print('✗ Bottom bar pattern not found - may have different formatting')
    # Try alternative pattern with less strict whitespace
    import re
    pattern = r'<!-- Mobile Bottom Bar -->.*?</nav>'
    if re.search(pattern, content, re.DOTALL):
        content = re.sub(pattern, '<!-- Mobile Bottom Bar: Removed -->', content, flags=re.DOTALL)
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(content)
        print('✓ Removed bottom nav bar using regex')
    else:
        print('✗ Could not find bottom bar to remove')

print('Done!')
