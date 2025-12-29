#!/usr/bin/env python3
"""
Convert index.html from Latin-1 (or Windows-1252) encoding to UTF-8.
"""

# Read as Latin-1/Windows-1252
with open('index.html', 'rb') as f:
    data = f.read()

print(f"Original size: {len(data)} bytes")

# The file appears to be encoded in Latin-1 (ISO-8859-1) or Windows-1252
# Windows-1252 is a superset of Latin-1, so it's safer to use
try:
    text = data.decode('cp1252')  # Windows-1252
    print("Decoded as Windows-1252")
except:
    text = data.decode('latin-1')  # Fallback to Latin-1
    print("Decoded as Latin-1")

# Write as UTF-8
with open('index.html', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(text)

print("Saved as UTF-8!")

# Verify
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

print(f"New size: {len(content.encode('utf-8'))} bytes")

# Check for specific Portuguese words
checks = ['Climatização', 'Cocção', 'Refrigeração', 'Início', 'análises', 'eletrodomésticos', 'você']
for word in checks:
    if word in content:
        print(f"  Found: {word}")
    else:
        print(f"  Missing: {word}")

# Check for problematic patterns that should have been fixed
# The close button × should now be ×
if '×' in content or '&times;' in content:
    print("  Found: close button (× or &times;)")
