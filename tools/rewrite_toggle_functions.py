#!/usr/bin/env python3
"""
Rewrite all toggle functions to use CompareStore.toggleItem()
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with open('js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Rewrite toggleCategoryCompare
old_toggle_category = '''// Toggle product in compare list from category page cards
function toggleCategoryCompare(productId, model, brand, score) {
    const existingIndex = CompareStore.getActiveList().findIndex(p => p.id === productId);
    const btn = event.target;

    if (existingIndex > -1) {
        // Remove from list
        compareList.splice(existingIndex, 1);
        if (btn) {
            btn.textContent = '➕ Adicionar à comparação';
            btn.classList.remove('added');
        }
    } else {
        // Add to list
        if (CompareStore.getCount() >= 4) {
            showToast('Máximo de 4 produtos na comparação');
            return;
        }
        // Get full product data from catalog
        const fullProduct = currentCatalog?.products?.[productId];
        if (fullProduct) {
            compareList.push({ id: productId, ...fullProduct });
        } else {
            // Fallback if catalog not available
            compareList.push({
                id: productId,
                model: model,
                brand: brand,
                editorialScores: { overall: score }
            });
        }
        if (btn) {
            btn.textContent = '✓ Na comparação';
            btn.classList.add('added');
        }
    }

    // Save to localStorage
    localStorage.setItem('compareList', JSON.stringify(compareList));

    // Sync all buttons for this product
    updateAllCompareButtonsForProduct(productId);

    updateCompareUI();
    showComparePrompt();
    updateBottomBarBadge();
}'''

new_toggle_category = '''// Toggle product in compare list from category page cards
function toggleCategoryCompare(productId, model, brand, score) {
    // Get category from current catalog or URL
    const category = currentCatalog?.category?.slug || getCategoryFromUrl() || 'geladeiras';
    
    // Build product object with category
    const fullProduct = currentCatalog?.products?.[productId];
    const product = fullProduct 
        ? { id: productId, category, ...fullProduct }
        : { id: productId, category, model, brand, editorialScores: { overall: score } };
    
    // Use CompareStore (handles add/remove, localStorage, limits)
    const added = CompareStore.toggleItem(product);
    
    // Update button visual
    const btn = event?.target;
    if (btn) {
        const isNow = CompareStore.isInList(productId);
        btn.textContent = isNow ? '✓ Na comparação' : '➕ Adicionar à comparação';
        btn.classList.toggle('added', isNow);
    }

    // Sync all buttons and UI
    updateAllCompareButtonsForProduct(productId);
    updateCompareUI();
    showComparePrompt();
    updateBottomBarBadge();
}'''

if old_toggle_category in content:
    content = content.replace(old_toggle_category, new_toggle_category)
    print('✓ Rewrote toggleCategoryCompare')
else:
    print('✗ toggleCategoryCompare pattern not found')

# 2. Add getCategoryFromUrl helper if not exists
helper_function = '''
// Helper to extract category from URL
function getCategoryFromUrl() {
    const path = window.location.pathname;
    const match = path.match(/\\/(geladeiras|lavadoras|climatizacao|coccao)\\//);
    if (match) return match[1];
    const prodMatch = path.match(/\\/produto\\/(geladeira|lavadora|ar-condicionado|fogao)\\//);
    if (prodMatch) {
        const mapping = { 'geladeira': 'geladeiras', 'lavadora': 'lavadoras', 'ar-condicionado': 'climatizacao', 'fogao': 'coccao' };
        return mapping[prodMatch[1]] || prodMatch[1];
    }
    return null;
}

'''

if 'getCategoryFromUrl' not in content:
    # Add after the MAX_COMPARE line
    content = content.replace(
        'const MAX_COMPARE = CompareStore.MAX_ITEMS;',
        'const MAX_COMPARE = CompareStore.MAX_ITEMS;' + helper_function
    )
    print('✓ Added getCategoryFromUrl helper')
else:
    print('ℹ getCategoryFromUrl already exists')

# 3. Add compare:changed event listener
event_listener = '''
// Listen to CompareStore changes and sync UI
window.addEventListener('compare:changed', (e) => {
    const { action, product, category } = e.detail;
    
    // Update all buttons for affected product
    if (product && product.id) {
        updateAllCompareButtonsForProduct(product.id);
    }
    
    // Update global UI
    updateCompareUI();
    showComparePrompt();
    updateBottomBarBadge();
    
    // Initialize buttons if switching categories
    if (action === 'switch') {
        initCategoryCompareButtons();
    }
});
'''

if "window.addEventListener('compare:changed'" not in content:
    # Add near end of file, before any exports
    if 'window.toggleProductCompare' in content:
        content = content.replace(
            'window.toggleProductCompare',
            event_listener + '\nwindow.toggleProductCompare'
        )
        print('✓ Added compare:changed event listener')
    else:
        print('✗ Could not add event listener - marker not found')
else:
    print('ℹ compare:changed listener already exists')

# Save
with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('\n✓ Done!')
