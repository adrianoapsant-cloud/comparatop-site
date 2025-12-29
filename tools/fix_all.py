#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Complete second pass for all remaining ? characters
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Original size: {len(content)}")

# Comprehensive replacements 
replacements = [
    # Buttons and actions
    ('? Iniciar Assistente', '🤖 Iniciar Assistente'),
    ('? Cadastrar Email', '📧 Cadastrar Email'),
    ('? Cadastro realizado', '✅ Cadastro realizado'),
    ('? Link copiado', '📋 Link copiado'),
    
    # Close button - should be × not ?
    ('>?</button>', '>×</button>'),
    ('"Fechar">?<', '"Fechar">×<'),
    
    # Arrows in sidebar/mobile menu
    ('class="nav-category-arrow">?</span>', 'class="nav-category-arrow">›</span>'),
    ('class="nav-product-arrow">?</span>', 'class="nav-product-arrow">›</span>'),
    
    # CTA buttons
    ('? Ver ofertas', '🛒 Ver ofertas'),
    ('? Comparar agora', '⚖️ Comparar agora'),
    ('? Ver todos', '📋 Ver todos'),
    
    # Prices - remove trailing ?
    (' ?</div>', '</div>'),
    ('R$ ?', 'R$'),
    
    # Various icons
    ('? Voz do Cliente', '💬 Voz do Cliente'),
    ('? Notas Editoriais', '📝 Notas Editoriais'),
    ('? Assistente', '🤖 Assistente'),
    ('? Fontes', '📊 Fontes'),
    
    # Mobile sheet icons
    ('class="ml-sheet-icon">?', 'class="ml-sheet-icon">📄'),
    
    # Generic patterns for any remaining ?
    ('>?</', '></', ),  # Remove standalone ? between tags
]

count = 0
for old, new in replacements:
    if old in content:
        occurrences = content.count(old)
        content = content.replace(old, new)
        count += occurrences
        print(f"Replaced {occurrences}x: '{old[:35]}'")

print(f"\nTotal: {count}")
print(f"New size: {len(content)}")

# Count remaining
q_count = content.count('>?<')
print(f"Remaining '>?<' patterns: {q_count}")

with open('index.html', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(content)

print("Saved!")
