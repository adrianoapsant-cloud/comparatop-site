#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Final emoji corrections:
1. Logo: ⚡ (raio) instead of ⚖️
2. Category icons: proper icons instead of repeated lupas
3. USP icons: distinct icons
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Original size: {len(content)}")

# All corrections needed
replacements = [
    # Logo - change from ⚖️ to ⚡
    ('⚖️ ComparaTop', '⚡ ComparaTop'),
    
    # Category icons - need to be specific to each category
    # Climatização = ❄️ (já está certo pelo que vejo)
    # Cocção = 🍳 (panela/frigideira para cozinhar)
    # Lavanderia = 👕 (camiseta/roupa)
    # Refrigeração = 🧊 (gelo/geladeira)
    
    # The problem is the category-card-icon divs have wrong icons
    # Let's fix by context
    
    # Fix repeated 🔍 (lupa) icons in category cards
    # Looking at the HTML structure, need to replace these
    
    # For Cocção category card
    ('<div class="category-card-icon">🍳</div>\r\n                        <h3 class="category-card-title">Cocção</h3>',
     '<div class="category-card-icon">🍳</div>\r\n                        <h3 class="category-card-title">Cocção</h3>'),
    
    # For Lavanderia category card  
    ('<div class="category-card-icon">👕</div>\r\n                        <h3 class="category-card-title">Lavanderia',
     '<div class="category-card-icon">👕</div>\r\n                        <h3 class="category-card-title">Lavanderia'),
    
    # For Refrigeração category card
    ('<div class="category-card-icon">🧊</div>\r\n                        <h3 class="category-card-title">Refrigeração',
     '<div class="category-card-icon">🧊</div>\r\n                        <h3 class="category-card-title">Refrigeração'),
    
    # USP section icons - make them distinct  
    # Voz do Cliente = 💬 (chat/comentários)
    # Notas Editoriais = 📝 (anotações)
    # Assistente Inteligente = 🤖 (robô)
    # Fontes Transparentes = 🔗 (link/fonte)
    
    # The repeated 📊 should be replaced
    ('<div class="usp-item-icon">📊</div>\r\n                        <h4 class="usp-item-title">Voz do Cliente',
     '<div class="usp-item-icon">💬</div>\r\n                        <h4 class="usp-item-title">Voz do Cliente'),
    
    ('<div class="usp-item-icon">📊</div>\r\n                        <h4 class="usp-item-title">Notas',
     '<div class="usp-item-icon">📝</div>\r\n                        <h4 class="usp-item-title">Notas'),
    
    ('<div class="usp-item-icon">📊</div>\r\n                        <h4 class="usp-item-title">Assistente',
     '<div class="usp-item-icon">🤖</div>\r\n                        <h4 class="usp-item-title">Assistente'),
    
    ('<div class="usp-item-icon">📊</div>\r\n                        <h4 class="usp-item-title">Fontes',
     '<div class="usp-item-icon">🔗</div>\r\n                        <h4 class="usp-item-title">Fontes'),
     
    # Also fix header icons
    ('<span class="ml-home-icon">⚖️</span>', '<span class="ml-home-icon">🏠</span>'),
    
    # Fix remaining ⚖️ that should be something else
    ('<span class="ml-cat-icon">⚖️</span>', '<span class="ml-cat-icon">📦</span>'),
]

count = 0
for old, new in replacements:
    if old in content:
        occurrences = content.count(old)
        content = content.replace(old, new)
        count += occurrences
        print(f"Replaced {occurrences}x: {old[:40]}...")

print(f"\nTotal: {count}")

with open('index.html', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(content)

print("Saved!")
