#!/usr/bin/env python3
"""
Fix specs table: revert stacked rows and use horizontal scroll with sticky first column
"""
import sys
import re
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with open('css/main.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the bad stacked table CSS
content = re.sub(
    r'/\* ==================== MOBILE STACKED SPECS TABLE ====================.*?@media \(max-width: 768px\) \{.*?\n\}',
    '',
    content,
    flags=re.DOTALL
)

# Add proper horizontal scroll CSS
new_css = '''
/* ==================== MOBILE HORIZONTAL SCROLL SPECS TABLE ==================== */
@media (max-width: 768px) {
    .comparison-table-section {
        position: relative;
        margin: 0 -1rem; /* Extend to full width */
        padding: 0 1rem;
    }
    
    /* Wrapper for horizontal scroll */
    .comparison-table {
        display: block;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        white-space: nowrap;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
    }
    
    .comparison-table table {
        min-width: 100%;
        white-space: normal;
    }
    
    /* Make first column sticky */
    .comparison-table th:first-child,
    .comparison-table td:first-child {
        position: sticky;
        left: 0;
        background: white;
        z-index: 2;
        box-shadow: 2px 0 4px rgba(0,0,0,0.1);
    }
    
    .comparison-table th:first-child {
        background: #1e40af;
    }
    
    .comparison-table th,
    .comparison-table td {
        min-width: 100px;
        padding: 0.6rem 0.75rem;
        font-size: 0.85rem;
    }
    
    .comparison-table td:first-child {
        min-width: 120px;
        font-weight: 500;
    }
}
'''

content += new_css

with open('css/main.css', 'w', encoding='utf-8') as f:
    f.write(content)

print('Replaced stacked layout with horizontal scroll + sticky column')
