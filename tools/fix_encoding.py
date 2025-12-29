#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys

# Read the file as binary to see the raw bytes
with open('index.html', 'rb') as f:
    content = f.read()

# First, let's check if there's a BOM
if content.startswith(b'\xef\xbb\xbf'):
    print("File has BOM")
    content = content[3:]

# Try different encodings
encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']

for encoding in encodings:
    try:
        text = content.decode(encoding)
        print(f"Successfully decoded with {encoding}")
        
        # Common replacements for broken characters
        replacements = {
            'In�cio': 'Início',
            'Compara��o': 'Comparação',
            'Climatiza��o': 'Climatização',
            'Coc��o': 'Cocção',
            'Refrigera��o': 'Refrigeração',
            'eletrodom�sticos': 'eletrodomésticos',
            'especifica��es': 'especificações',
            'avalia��es': 'avaliações',
            'pre�os': 'preços',
            'S�ntese': 'Síntese',
            'crit�rios': 'critérios',
            'voc�': 'você',
            'an�lises': 'análises',
            'an�lise': 'análise',
            'custo-benef�cio': 'custo-benefício',
            'Fog�es': 'Fogões',
            'Lava-lou�as': 'Lava-louças',
            'promo��es': 'promoções',
            'atualiza��es': 'atualizações',
            'Conserva��o': 'Conservação',
            'compara��es': 'comparações',
            'flex�veis': 'flexíveis',
            'Compara��es': 'Comparações',
            'or�amento': 'orçamento',
            'recomenda��es': 'recomendações',
            'refei��es': 'refeições',
            'cria��o': 'criação',
            'at�': 'até',
            'M�dio': 'Médio',
            'n�o': 'não',
            'Dispon�veis': 'Disponíveis',
            'conte�do': 'conteúdo',
            'usu�rios': 'usuários',
            'personalizada': 'personalizada',
            'r�pidas': 'rápidas',
            'agregada': 'agregada',
            '�': 'ã',
            '�': 'ç',
            '??': '⚖️',
        }
        
        count_fixed = 0
        for old, new in replacements.items():
            if old in text:
                text = text.replace(old, new)
                count_fixed += 1
        
        print(f"Fixed {count_fixed} patterns")
        
        # Write fixed content as UTF-8
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(text)
        
        print("File fixed and saved!")
        break
        
    except Exception as e:
        print(f"Failed with {encoding}: {e}")
