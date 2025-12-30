#!/usr/bin/env python3
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with open('js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add sync call to toggleProductCompare
old_text1 = '''    // Save to localStorage for sync
    localStorage.setItem('compareList', JSON.stringify(compareList));

    updateCompareUI();
    showComparePrompt();
    updateBottomBarBadge();
}

// Toggle product in compare list from carousel'''

new_text1 = '''    // Save to localStorage for sync
    localStorage.setItem('compareList', JSON.stringify(compareList));

    // Sync all buttons for this product
    updateAllCompareButtonsForProduct(productId);

    updateCompareUI();
    showComparePrompt();
    updateBottomBarBadge();
}

// Toggle product in compare list from carousel'''

if old_text1 in content:
    content = content.replace(old_text1, new_text1)
    print('✓ Fixed toggleProductCompare')
else:
    print('✗ toggleProductCompare pattern not found')

# 2. Add sync call to toggleCategoryCompare
old_text2 = '''    // Save to localStorage
    localStorage.setItem('compareList', JSON.stringify(compareList));

    updateCompareUI();
    showComparePrompt();
    updateBottomBarBadge();
}

// Energy calculator'''

new_text2 = '''    // Save to localStorage
    localStorage.setItem('compareList', JSON.stringify(compareList));

    // Sync all buttons for this product
    updateAllCompareButtonsForProduct(productId);

    updateCompareUI();
    showComparePrompt();
    updateBottomBarBadge();
}

// Energy calculator'''

if old_text2 in content:
    content = content.replace(old_text2, new_text2)
    print('✓ Fixed toggleCategoryCompare')
else:
    print('✗ toggleCategoryCompare pattern not found')

# 3. Add sync call to toggleCompare (the original one)
old_text3 = '''    // Save to localStorage for sync
    localStorage.setItem('compareList', JSON.stringify(compareList));

    updateCompareUI();
    showComparePrompt();
    updateBottomBarBadge();
}

function updateCompareUI()'''

new_text3 = '''    // Save to localStorage for sync
    localStorage.setItem('compareList', JSON.stringify(compareList));

    // Sync all buttons for this product
    updateAllCompareButtonsForProduct(productId);

    updateCompareUI();
    showComparePrompt();
    updateBottomBarBadge();
}

function updateCompareUI()'''

if old_text3 in content:
    content = content.replace(old_text3, new_text3)
    print('✓ Fixed toggleCompare')
else:
    print('✗ toggleCompare pattern not found')

with open('js/main.js', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)

print('\nDone!')
