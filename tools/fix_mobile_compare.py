#!/usr/bin/env python3
"""
Hide compare-prompt on mobile and enhance toast styling
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with open('css/main.css', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add mobile media query to hide compare-prompt
mobile_css = '''
/* ==================== MOBILE COMPARISON UX ==================== */
/* Hide floating compare prompt on mobile - use bottom nav instead */
@media (max-width: 768px) {
    .compare-prompt {
        display: none !important;
    }
    
    .compare-counter {
        display: none !important; /* Also hide counter - bottom nav has badge */
    }
    
    /* Enhanced toast for mobile */
    .toast-notification {
        bottom: 80px !important; /* Above bottom nav */
        left: 12px !important;
        right: 12px !important;
        max-width: none !important;
        text-align: center;
    }
}

'''

# Add after the compare-prompt section (after .compare-prompt-btn.disabled)
marker = '.compare-prompt-btn.disabled {\n    opacity: 0.5;\n    cursor: not-allowed;\n}'

if marker in content and '/* MOBILE COMPARISON UX */' not in content:
    content = content.replace(marker, marker + mobile_css)
    print('✓ Added mobile CSS to hide compare-prompt')
else:
    print('✗ Marker not found or already added')

# 2. Improve toast styling if not already enhanced
if '.toast-notification {' not in content:
    toast_css = '''
/* Toast Notification */
.toast-notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #1f2937;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 0.9rem;
    z-index: 10000;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    animation: toast-in 0.3s ease-out;
    max-width: 300px;
}

@keyframes toast-in {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
'''
    # Add after the mobile CSS
    content += toast_css
    print('✓ Added toast-notification styling')
else:
    print('ℹ Toast styling already exists')

with open('css/main.css', 'w', encoding='utf-8') as f:
    f.write(content)

print('\n✓ Done!')
