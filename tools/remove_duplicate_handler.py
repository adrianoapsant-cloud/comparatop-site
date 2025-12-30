#!/usr/bin/env python3
"""
Remove duplicate handleCompareClick function that shows the card
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with open('js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the old handleCompareClick that shows the card
old_function = '''// Handle Compare Click from bottom bar (mobile)
function handleCompareClick() {
    const list = window.compareList || [];
    const prompt = document.getElementById('compare-prompt');
    const productsContainer = document.getElementById('compare-prompt-products');
    const hint = document.getElementById('compare-prompt-hint');
    const compareBtn = document.getElementById('compare-prompt-btn-compare');

    if (!prompt) {
        // Fallback if element doesn't exist
        if (list.length >= 2) {
            if (typeof startComparisonFromPrompt === 'function') {
                startComparisonFromPrompt();
            }
        } else {
            showToast('Adicione pelo menos 2 produtos para comparar');
        }
        return;
    }

    // Show the compare card
    prompt.style.display = 'block';
    prompt.style.opacity = '1';

    if (list.length === 0) {
        // Empty state
        if (productsContainer) {
            productsContainer.innerHTML = '<div style="color:#64748b;font-size:0.9rem;text-align:center;padding:0.5rem;">Nenhum produto selecionado ainda</div>';
        }
        if (hint) {
            hint.textContent = 'Adicione produtos nas páginas de categoria';
            hint.style.color = '#f59e0b';
        }
        if (compareBtn) {
            compareBtn.classList.add('disabled');
            compareBtn.disabled = true;
        }
    } else if (list.length < 2) {
        // Has products but not enough
        if (productsContainer) {
            productsContainer.innerHTML = list.map(p => {
                const scoreText = p.editorialScores?.overall ? `${p.editorialScores.overall}/10` : '';
                return `<div class="compare-prompt-product"><span>✓ ${p.brand} ${p.model}</span><span style="color:#10b981;font-weight:600">${scoreText}</span></div>`;
            }).join('');
        }
        if (hint) {
            hint.textContent = `+${2 - list.length} para comparar`;
            hint.style.color = '#f59e0b';
        }
        if (compareBtn) {
            compareBtn.classList.add('disabled');
            compareBtn.disabled = true;
        }
    } else {
        // Has 2+ products - ready to compare
        if (typeof showComparePrompt === 'function') {
            showComparePrompt();
        }
    }
}

// Open Compare Modal (legacy - uses existing function)
function openCompareModal() {
    handleCompareClick();
}'''

replacement = '''// Handle Compare Click from bottom bar - removed, duplicate definition exists above

// Open Compare Modal (legacy - uses showComparison directly)
function openCompareModal() {
    if (CompareStore.getCount() >= 2) {
        showComparison();
    } else {
        showToast('Adicione pelo menos 2 produtos para comparar');
    }
}'''

if old_function in content:
    content = content.replace(old_function, replacement)
    with open('js/main.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print('✓ Removed duplicate handleCompareClick function')
else:
    print('✗ Pattern not found - checking for variations')

print('Done!')
