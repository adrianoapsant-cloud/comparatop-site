#!/usr/bin/env python3
"""
Last batch of emoji fixes.
"""

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Final replacements
replacements = [
    # Social icons
    ('title="WhatsApp">??</a>', 'title="WhatsApp">💬</a>'),
    
    # Labels
    ('>?? Sensibilidade a ru', '>🔊 Sensibilidade a ru'),
    ('>?? Uso do freezer:', '>❄️ Uso do freezer:'),
    ('>?? Faixa de orçamento ', '>💰 Faixa de orçamento '),
    
    # Comparison modal
    ('>?? Comparação Detalhad', '>⚖️ Comparação Detalhad'),
    ('>?? Comparação</h1>', '>⚖️ Comparação</h1>'),
    
    # Bottom icons
    ('class="ml-bottom-icon">??</span>', 'class="ml-bottom-icon">🏠</span>'),
    ('class="ml-sheet-cat-icon">??</span>', 'class="ml-sheet-cat-icon">📁</span>'),
    
    # Sections
    ('>?? Categorias</h3>', '>📂 Categorias</h3>'),
    ('>?? Qual geladeira é id', '>🤔 Qual geladeira é id'),
    ('>?? Calculadoras</h2>', '>🧮 Calculadoras</h2>'),
    
    # Standalone
    ('margin-bottom:1rem;">??', 'margin-bottom:1rem;">📊'),
]

count = 0
for old, new in replacements:
    if old in content:
        occurrences = content.count(old)
        content = content.replace(old, new)
        count += occurrences
        print(f"Replaced {occurrences}x: {old[:35]}...")

print(f"\nTotal replacements: {count}")
remaining = content.count('??')
print(f"Remaining '??' patterns: {remaining}")

with open('index.html', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(content)

print("Saved!")
