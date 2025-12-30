#!/usr/bin/env python3
"""
Fix specs table:
1. Remove the "EXTRA COMPACT" CSS that shrunk the table too much
2. Fix horizontal overflow properly
3. Add rounded corners to right side
"""
import sys
import re
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with open('css/main.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove EXTRA COMPACT section (lines 3942-3978)
content = re.sub(
    r'/\* ==================== EXTRA COMPACT MOBILE SPECS ====================.*?\n\}',
    '',
    content,
    flags=re.DOTALL
)

# Remove the previous FIX HORIZONTAL OVERFLOW section
content = re.sub(
    r'/\* ==================== FIX HORIZONTAL OVERFLOW \+ ROUNDED CORNERS ====================.*?\n\}',
    '',
    content,
    flags=re.DOTALL
)

# Add new cleaner fix for overflow and rounded corners
new_css = '''
/* ==================== MOBILE PAGE OVERFLOW FIX ==================== */
html {
    overflow-x: hidden;
}

@media (max-width: 768px) {
    body {
        overflow-x: hidden;
        width: 100vw;
        max-width: 100%;
    }
    
    #comparison-content {
        overflow-x: hidden;
        max-width: 100%;
    }
    
    .comparison-table-section {
        overflow: hidden;
        max-width: 100%;
    }
    
    /* Rounded corners on header - both sides */
    .comparison-table th:first-child {
        border-top-left-radius: 8px;
    }
    
    .comparison-table th:last-child {
        border-top-right-radius: 8px;
    }
    
    /* Rounded corners on last row - both sides */
    .comparison-table tbody tr:last-child td:first-child {
        border-bottom-left-radius: 8px;
    }
    
    .comparison-table tbody tr:last-child td:last-child {
        border-bottom-right-radius: 8px;
    }
    
    /* Ensure table doesn't overflow */
    .comparison-table {
        max-width: 100%;
        border-collapse: separate;
        border-spacing: 0;
    }
}
'''

content += new_css

with open('css/main.css', 'w', encoding='utf-8') as f:
    f.write(content)

print('Removed extra compact CSS and fixed overflow/rounded corners')
