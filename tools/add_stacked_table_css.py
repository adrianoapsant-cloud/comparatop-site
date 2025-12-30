#!/usr/bin/env python3
"""
Add CSS for stacked specs table on mobile (Gemini's suggestion)
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

css = '''
/* ==================== MOBILE STACKED SPECS TABLE ==================== */
@media (max-width: 768px) {
    .comparison-table-section {
        overflow-x: visible;
    }
    
    .comparison-table {
        display: block;
        width: 100%;
    }
    
    .comparison-table thead {
        display: none;
    }
    
    .comparison-table tbody {
        display: block;
    }
    
    .comparison-table tr {
        display: block;
        margin-bottom: 0.75rem;
        background: #f8fafc;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #e2e8f0;
    }
    
    /* First cell (label) - full width on top */
    .comparison-table td:first-child {
        display: block;
        width: 100%;
        background: #1e40af;
        color: white;
        font-weight: 600;
        padding: 0.6rem 1rem;
        text-align: center;
        border-bottom: none;
    }
    
    /* Product value cells - side by side */
    .comparison-table td:nth-child(2),
    .comparison-table td:nth-child(3) {
        display: inline-block;
        width: 50%;
        box-sizing: border-box;
        text-align: center;
        padding: 0.75rem 0.5rem;
        vertical-align: top;
        border-bottom: none;
        background: white;
    }
    
    /* Add product names above values */
    .comparison-table td:nth-child(2)::before {
        content: "BRM44HB";
        display: block;
        font-size: 0.7rem;
        color: #64748b;
        margin-bottom: 0.25rem;
        font-weight: 600;
    }
    
    .comparison-table td:nth-child(3)::before {
        content: "TF55";
        display: block;
        font-size: 0.7rem;
        color: #64748b;
        margin-bottom: 0.25rem;
        font-weight: 600;
    }
    
    /* Left border on middle divider */
    .comparison-table td:nth-child(3) {
        border-left: 1px solid #e2e8f0;
    }
}
'''

with open('css/main.css', 'a', encoding='utf-8') as f:
    f.write(css)

print('Added stacked specs table CSS for mobile')
