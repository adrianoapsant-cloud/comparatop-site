#!/usr/bin/env python3
"""
Implement smart direct navigation for Compare button:
- 2 products: navigate directly to 1x1 page
- 3+ products: show simple modal to remove items
- 1 product: toast
- 0 products: toast
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with open('js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace handleCompareClick with smart navigation
old_function = '''// Handle compare button click - go directly to comparison
function handleCompareClick() {
    if (CompareStore.getCount() >= 2) {
        showComparison();
    } else if (CompareStore.getCount() === 1) {
        showToast('Adicione mais 1 produto para comparar');
    } else {
        showToast('Adicione produtos para comparar');
    }
}'''

new_function = '''// Handle compare button click - smart direct navigation
function handleCompareClick() {
    const count = CompareStore.getCount();
    
    if (count === 0) {
        showToast('Adicione produtos para comparar');
        return;
    }
    
    if (count === 1) {
        showToast('Adicione mais 1 produto para comparar');
        return;
    }
    
    if (count === 2) {
        // Navigate directly to 1x1 comparison page
        navigateToComparisonPage();
        return;
    }
    
    // 3+ products: show simple modal to select 2
    showProductSelectionModal();
}

// Navigate directly to 1x1 comparison page
function navigateToComparisonPage() {
    const products = CompareStore.getActiveList();
    if (products.length < 2) return;
    
    const category = CompareStore.getActiveCategory() || 'geladeira';
    const [first, second] = products.slice(0, 2).map(p => p.id).sort();
    const url = `/comparar/${category}/${first}-vs-${second}/`;
    
    showToast('Abrindo comparação detalhada...');
    setTimeout(() => {
        window.location.href = url;
    }, 300);
}

// Show simple modal for 3+ products to select which 2 to compare
function showProductSelectionModal() {
    const products = CompareStore.getActiveList();
    
    let html = `
    <div class="product-selection-overlay" onclick="closeProductSelectionModal()">
        <div class="product-selection-modal" onclick="event.stopPropagation()">
            <div class="product-selection-header">
                <h3>⚖️ Selecione 2 produtos</h3>
                <button onclick="closeProductSelectionModal()" class="product-selection-close">✕</button>
            </div>
            <p style="color:#64748b;font-size:0.9rem;margin-bottom:1rem;">
                Você tem ${products.length} produtos. Remova ${products.length - 2} para ver a análise detalhada.
            </p>
            <div class="product-selection-list">
    `;
    
    products.forEach(p => {
        html += `
            <div class="product-selection-item">
                <div class="product-selection-info">
                    <strong>${p.brand} ${p.model}</strong>
                    <span>${p.editorialScores?.overall || '?'}/10</span>
                </div>
                <button onclick="removeAndUpdateModal('${p.id}')" class="product-selection-remove">🗑️</button>
            </div>
        `;
    });
    
    html += `
            </div>
            <div class="product-selection-footer">
                <button onclick="closeProductSelectionModal()" class="btn-secondary">Cancelar</button>
                <button onclick="navigateToComparisonPage()" class="btn-primary" ${products.length > 2 ? 'disabled' : ''}>
                    📝 Ver Análise Completa
                </button>
            </div>
        </div>
    </div>
    `;
    
    // Add modal to body
    const existing = document.getElementById('product-selection-container');
    if (existing) existing.remove();
    
    const container = document.createElement('div');
    container.id = 'product-selection-container';
    container.innerHTML = html;
    document.body.appendChild(container);
    document.body.style.overflow = 'hidden';
}

function closeProductSelectionModal() {
    const container = document.getElementById('product-selection-container');
    if (container) container.remove();
    document.body.style.overflow = '';
}

function removeAndUpdateModal(productId) {
    CompareStore.removeItem(productId);
    const count = CompareStore.getCount();
    
    if (count === 2) {
        closeProductSelectionModal();
        navigateToComparisonPage();
    } else if (count < 2) {
        closeProductSelectionModal();
        showToast('Adicione mais produtos para comparar');
    } else {
        // Re-render modal with updated list
        showProductSelectionModal();
    }
}'''

if old_function in content:
    content = content.replace(old_function, new_function)
    with open('js/main.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print('✓ Updated handleCompareClick with smart navigation')
else:
    print('✗ Pattern not found')

print('Done!')
