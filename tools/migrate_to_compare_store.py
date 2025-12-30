#!/usr/bin/env python3
"""
Refactor main.js to use CompareStore
This script replaces the old compareList logic with CompareStore API calls.
"""
import sys
import re
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with open('js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

changes = 0

# 1. Replace old compareList loading with CompareStore compatibility shim
old_compareList_init = '''// ==================== N-WAY COMPARISON ====================
// Load compareList from localStorage if available
let compareList = [];
try {
    const savedCompareList = localStorage.getItem('compareList');
    if (savedCompareList) {
        const parsed = JSON.parse(savedCompareList);
        // Validate that saved items are valid product objects
        if (Array.isArray(parsed)) {
            compareList = parsed.filter(item =>
                item &&
                typeof item === 'object' &&
                item.id &&
                (item.brand || item.name) &&
                (item.model || item.name)
            );
            // Re-save the cleaned list
            if (compareList.length !== parsed.length) {
                localStorage.setItem('compareList', JSON.stringify(compareList));
                console.log('Cleaned compareList in localStorage');
            }
        }
        console.log('Loaded compareList from localStorage:', compareList.length, 'products');
    }
} catch (e) {
    console.warn('Failed to load compareList from localStorage:', e);
    compareList = [];
    localStorage.removeItem('compareList');
}
const MAX_COMPARE = 4;'''

new_compareList_init = '''// ==================== N-WAY COMPARISON ====================
// CompareStore handles all comparison logic now
// This getter provides backward compatibility for existing code
Object.defineProperty(window, 'compareList', {
    get: function() {
        return CompareStore.getActiveList();
    }
});
const MAX_COMPARE = CompareStore.MAX_ITEMS;'''

if old_compareList_init in content:
    content = content.replace(old_compareList_init, new_compareList_init)
    changes += 1
    print('✓ Replaced compareList initialization with CompareStore compatibility shim')
else:
    print('✗ compareList init pattern not found')

# 2. Update initCategoryCompareButtons to use CompareStore
old_init_category = '''// Initialize category page compare buttons based on compareList
function initCategoryCompareButtons() {
    const buttons = document.querySelectorAll('.ssg-compare-btn');
    buttons.forEach(btn => {
        // Extract productId from onclick attribute
        const onclick = btn.getAttribute('onclick');
        if (onclick) {
            const match = onclick.match(/toggleCategoryCompare\\(['\"]([^'\"]+)['\"]/)
            if (match && match[1]) {
                const productId = match[1];
                const isInCompare = compareList.some(p => p.id === productId);
                if (isInCompare) {
                    btn.textContent = '✓ Na comparação';
                    btn.classList.add('added');
                } else {
                    btn.textContent = '➕ Adicionar à comparação';
                    btn.classList.remove('added');
                }
            }
        }
    });
}'''

new_init_category = '''// Initialize category page compare buttons based on CompareStore
function initCategoryCompareButtons() {
    const buttons = document.querySelectorAll('.ssg-compare-btn');
    buttons.forEach(btn => {
        // Extract productId from onclick attribute
        const onclick = btn.getAttribute('onclick');
        if (onclick) {
            const match = onclick.match(/toggleCategoryCompare\\(['\"]([^'\"]+)['\"]/)
            if (match && match[1]) {
                const productId = match[1];
                const isInCompare = CompareStore.isInList(productId);
                if (isInCompare) {
                    btn.textContent = '✓ Na comparação';
                    btn.classList.add('added');
                } else {
                    btn.textContent = '➕ Adicionar à comparação';
                    btn.classList.remove('added');
                }
            }
        }
    });
}'''

if old_init_category in content:
    content = content.replace(old_init_category, new_init_category)
    changes += 1
    print('✓ Updated initCategoryCompareButtons to use CompareStore')
else:
    print('✗ initCategoryCompareButtons pattern not found - may need manual update')

# 3. Update updateAllCompareButtonsForProduct to use CompareStore
old_update_all = 'const isInCompare = compareList.some(p => p.id === productId);'
new_update_all = 'const isInCompare = CompareStore.isInList(productId);'

count = content.count(old_update_all)
if count > 0:
    content = content.replace(old_update_all, new_update_all)
    changes += count
    print(f'✓ Updated {count} occurrences of compareList.some to CompareStore.isInList')

# 4. Update showComparePrompt to use CompareStore
old_show_prompt = 'if (!prompt || !productsContainer || compareList.length === 0) {'
new_show_prompt = 'if (!prompt || !productsContainer || CompareStore.getActiveList().length === 0) {'

if old_show_prompt in content:
    content = content.replace(old_show_prompt, new_show_prompt)
    changes += 1
    print('✓ Updated showComparePrompt to use CompareStore')

# 5. Update other compareList references
# These are more complex and need careful handling
content = content.replace(
    'compareList.map(p =>',
    'CompareStore.getActiveList().map(p =>'
)
content = content.replace(
    'compareList.length',
    'CompareStore.getCount()'
)
content = content.replace(
    'compareList.findIndex(p => p.id',
    'CompareStore.getActiveList().findIndex(p => p.id'
)

print(f'\n✓ Replaced additional compareList references')

# Save the modified file
with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print(f'\n✓ Done! Made {changes} major changes')
print('Note: Toggle functions still need to call CompareStore.toggleItem() - see next script')
