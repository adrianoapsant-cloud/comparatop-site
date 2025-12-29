#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix encoding issues in index.html
The file was corrupted by being saved with wrong encoding.
We need to fix specific byte sequences.
"""

import re

# Read file as binary
with open('index.html', 'rb') as f:
    content = f.read()

# Map corrupted sequences to correct UTF-8
# The original file has Latin-1/Windows-1252 bytes that should be UTF-8
replacements = {
    # Portuguese characters (corrupted -> correct)
    b'\xe9': 'é'.encode('utf-8'),      # é
    b'\xe1': 'á'.encode('utf-8'),      # á
    b'\xe3': 'ã'.encode('utf-8'),      # ã
    b'\xf5': 'õ'.encode('utf-8'),      # õ
    b'\xf3': 'ó'.encode('utf-8'),      # ó
    b'\xed': 'í'.encode('utf-8'),      # í
    b'\xfa': 'ú'.encode('utf-8'),      # ú
    b'\xe7': 'ç'.encode('utf-8'),      # ç
    b'\xea': 'ê'.encode('utf-8'),      # ê
    b'\xf4': 'ô'.encode('utf-8'),      # ô
    b'\xc1': 'Á'.encode('utf-8'),      # Á
    b'\xc9': 'É'.encode('utf-8'),      # É
    b'\xcd': 'Í'.encode('utf-8'),      # Í
    b'\xd3': 'Ó'.encode('utf-8'),      # Ó
    b'\xda': 'Ú'.encode('utf-8'),      # Ú
    b'\xc7': 'Ç'.encode('utf-8'),      # Ç
    b'\xc3': 'Ã'.encode('utf-8'),      # Ã
    b'\xd5': 'Õ'.encode('utf-8'),      # Õ
}

# Also need to fix double-encoded UTF-8 (where UTF-8 bytes were interpreted as Latin-1)
# ã = C3 A3 in UTF-8, but if read as Latin-1 it becomes Ã£
double_encoded = {
    b'\xc3\xa3': 'ã'.encode('utf-8'),
    b'\xc3\xa9': 'é'.encode('utf-8'),
    b'\xc3\xa1': 'á'.encode('utf-8'),
    b'\xc3\xad': 'í'.encode('utf-8'),
    b'\xc3\xb5': 'õ'.encode('utf-8'),
    b'\xc3\xb3': 'ó'.encode('utf-8'),
    b'\xc3\xba': 'ú'.encode('utf-8'),
    b'\xc3\xa7': 'ç'.encode('utf-8'),
    b'\xc3\xaa': 'ê'.encode('utf-8'),
    b'\xc3\xb4': 'ô'.encode('utf-8'),
}

# First, handle already correct UTF-8 sequences (don't change them)
# Then fix the corrupted Latin-1 single bytes

# Try to decode the file properly first
try:
    # Check if it's already valid UTF-8
    text = content.decode('utf-8')
    print("File is valid UTF-8")
except:
    print("File is not valid UTF-8, fixing...")
    
    # Replace single corrupted bytes with correct UTF-8
    for old, new in replacements.items():
        content = content.replace(old, new)
    
    # Write as UTF-8
    with open('index.html', 'wb') as f:
        f.write(content)
    
    print("Fixed and saved!")
    
    # Verify
    try:
        with open('index.html', 'rb') as f:
            content = f.read()
        text = content.decode('utf-8')
        print("Verification: File is now valid UTF-8!")
        
        # Count Portuguese chars
        for char in ['ã', 'é', 'á', 'ç', 'í', 'ú', 'ó', 'ô', 'ê', 'õ']:
            count = text.count(char)
            if count > 0:
                print(f"  Found {count} occurrences of '{char}'")
    except Exception as e:
        print(f"Verification failed: {e}")
