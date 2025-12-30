#!/usr/bin/env python3
"""
Redesign mobile header: add Comparar button and hide bottom nav
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# 1. Add Compare button to header in index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Insert Compare button after logo, before search wrapper
old_header = '''            <a href="/" class="ml-logo">

                ⚡ ComparaTop

            </a>

            <div class="ml-search-wrapper">'''

new_header = '''            <a href="/" class="ml-logo">

                ⚡ ComparaTop

            </a>

            <!-- Mobile Compare Button -->
            <button class="ml-header-compare" id="header-compare-btn" onclick="handleCompareClick()">
                <span class="ml-header-compare-text">⚖️ Comparar</span>
                <span class="ml-header-compare-badge" id="header-compare-badge">0</span>
            </button>

            <div class="ml-search-wrapper">'''

if old_header in content:
    content = content.replace(old_header, new_header)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('✓ Added Compare button to header in index.html')
else:
    print('✗ Header pattern not found in index.html')

# 2. Add CSS for new header compare button and hide bottom nav
with open('css/main.css', 'r', encoding='utf-8') as f:
    css = f.read()

header_compare_css = '''
/* ==================== HEADER COMPARE BUTTON ==================== */
.ml-header-compare {
    display: none; /* Hidden on desktop by default */
}

@media (max-width: 768px) {
    .ml-header-compare {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        background: white;
        color: #1e40af;
        border: none;
        border-radius: 6px;
        padding: 0.4rem 0.6rem;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        position: relative;
        white-space: nowrap;
        margin-left: auto;
    }
    
    .ml-header-compare-text {
        font-size: 0.8rem;
    }
    
    .ml-header-compare-badge {
        display: none; /* Hidden when 0 */
        background: #f59e0b;
        color: white;
        font-size: 0.7rem;
        font-weight: 700;
        border-radius: 50%;
        min-width: 18px;
        height: 18px;
        line-height: 18px;
        text-align: center;
    }
    
    .ml-header-compare-badge.show {
        display: inline-block;
    }
    
    /* Reorganize header for mobile */
    .ml-header-content {
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .ml-search-wrapper {
        order: 3;
        width: 100%;
        margin-top: 0.25rem;
    }
    
    .ml-home-btn {
        order: 1;
    }
    
    .ml-logo {
        order: 2;
    }
    
    .ml-header-compare {
        order: 2;
        margin-left: auto;
    }
    
    /* Hide bottom nav on mobile */
    .ml-bottom-nav {
        display: none !important;
    }
    
    /* Adjust page padding since bottom nav is gone */
    .main-content,
    .ml-main {
        padding-bottom: 20px;
    }
}

'''

if '.ml-header-compare {' not in css:
    css += header_compare_css
    with open('css/main.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print('✓ Added header compare button CSS')
else:
    print('ℹ Header compare CSS already exists')

# 3. Add JavaScript to update header badge
with open('js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Add function to update header badge
update_header_badge_js = '''
// Update header compare badge for mobile
function updateHeaderCompareBadge() {
    const badge = document.getElementById('header-compare-badge');
    const count = CompareStore.getCount();
    if (badge) {
        badge.textContent = count;
        badge.classList.toggle('show', count > 0);
    }
}

// Handle compare button click - go directly to comparison
function handleCompareClick() {
    if (CompareStore.getCount() >= 2) {
        showComparison();
    } else if (CompareStore.getCount() === 1) {
        showToast('Adicione mais 1 produto para comparar');
    } else {
        showToast('Adicione produtos para comparar');
    }
}

'''

if 'updateHeaderCompareBadge' not in js:
    # Insert after CompareStore initialization
    marker = "const MAX_COMPARE = CompareStore.MAX_ITEMS;"
    js = js.replace(marker, marker + update_header_badge_js)
    
    # Also call updateHeaderCompareBadge in the DOMContentLoaded listener
    old_init = '''document.addEventListener('DOMContentLoaded', () => {
    initCategoryCompareButtons();
    updateCompareUI();
    updateBottomBarBadge();
});'''
    
    new_init = '''document.addEventListener('DOMContentLoaded', () => {
    initCategoryCompareButtons();
    updateCompareUI();
    updateBottomBarBadge();
    updateHeaderCompareBadge();
});'''
    
    js = js.replace(old_init, new_init)
    
    # Add call to updateHeaderCompareBadge in compare:changed handler
    if "window.addEventListener('compare:changed'" in js:
        old_listener = "updateBottomBarBadge();"
        new_listener = "updateBottomBarBadge();\n    updateHeaderCompareBadge();"
        js = js.replace(old_listener, new_listener, 1)  # Only first occurrence
    
    with open('js/main.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print('✓ Added header badge update functions')
else:
    print('ℹ Header badge functions already exist')

print('\n✓ Done! Build and deploy to see changes.')
