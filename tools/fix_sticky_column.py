#!/usr/bin/env python3
"""
Fix sticky column table: Replace broken CSS with proper implementation
"""
import sys
import re
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with open('css/main.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the broken STICKY FIRST COLUMN section
content = re.sub(
    r'/\* ==================== STICKY FIRST COLUMN \+ HORIZONTAL SCROLL ====================.*?@media \(max-width: 768px\) \{.*?\n\}',
    '',
    content,
    flags=re.DOTALL
)

# Remove the COMPACT SPECS TABLE section that sets table-layout: fixed
content = re.sub(
    r'/\* ==================== COMPACT SPECS TABLE FOR MOBILE ====================.*?@media \(max-width: 768px\) \{.*?\n\}',
    '',
    content,
    flags=re.DOTALL
)

# Remove the extra overflow-x hidden rule
content = re.sub(
    r'/\* Prevent page horizontal scroll \*/\s*html, body \{[^}]+\}',
    '',
    content
)

# Add new proper implementation
new_css = '''
/* ==================== MOBILE SPECS TABLE WITH STICKY COLUMN ==================== */
@media (max-width: 768px) {
    /* Wrapper for horizontal scroll */
    .comparison-table-section {
        position: relative;
        overflow: visible;
    }
    
    /* Create scrollable container around table */
    .comparison-table {
        display: block;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        white-space: nowrap;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
    }
    
    /* Make inner table work properly */
    .comparison-table thead,
    .comparison-table tbody,
    .comparison-table tr {
        display: table;
        width: 100%;
        table-layout: fixed;
    }
    
    .comparison-table thead {
        display: table-header-group;
    }
    
    .comparison-table tbody {
        display: table-row-group;
    }
    
    /* Sticky first column */
    .comparison-table th:first-child,
    .comparison-table td:first-child {
        position: sticky;
        left: 0;
        z-index: 2;
        background: white;
        min-width: 110px;
        box-shadow: 2px 0 4px rgba(0,0,0,0.08);
    }
    
    .comparison-table th:first-child {
        background: #1e40af;
        z-index: 3;
    }
    
    /* Product columns sizing */
    .comparison-table th:nth-child(2),
    .comparison-table td:nth-child(2),
    .comparison-table th:nth-child(3),
    .comparison-table td:nth-child(3) {
        min-width: 100px;
        text-align: center;
    }
    
    /* Compact text */
    .comparison-table th,
    .comparison-table td {
        padding: 0.5rem 0.4rem;
        font-size: 0.8rem;
        white-space: normal;
    }
    
    .comparison-table th {
        font-size: 0.75rem;
    }
    
    /* Rounded corners */
    .comparison-table th:first-child {
        border-top-left-radius: 8px;
    }
    
    .comparison-table th:last-child {
        border-top-right-radius: 8px;
    }
}

/* Prevent horizontal page scroll */
html {
    overflow-x: hidden;
}

body {
    overflow-x: hidden;
    max-width: 100vw;
}
'''

content += new_css

with open('css/main.css', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed sticky column implementation')
