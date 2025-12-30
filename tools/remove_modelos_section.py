#!/usr/bin/env python3
"""
Remove 'Modelos Disponíveis' section from index.html
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and remove the section
old_section = '''                        <!-- Products List - now links to SSG category page -->

                        <section style="margin-bottom:2rem;">

                            <h2 style="color:var(--c-primary-dark);margin-bottom:1rem;">📦 Modelos Disponíveis</h2>

                            <a href="/geladeiras/" onclick="Router.navigate('/geladeiras/'); return false;"
                                style="display:block;background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); padding: 1.5rem; border-radius: var(--radius); border-left: 4px solid var(--c-primary); text-decoration:none; cursor:pointer; transition:transform 0.2s, box-shadow 0.2s;"
                                onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)';"
                                onmouseout="this.style.transform='';this.style.boxShadow='';">

                                <p style="margin:0; font-size: 1rem; color: var(--c-primary-dark);">

                                    📋 <strong>Ver todos os modelos de Geladeiras</strong>

                                </p>

                                <p style="margin: 0.5rem 0 0; font-size: 0.9rem; color: var(--c-muted);">

                                    Veja a lista completa com preços, notas e comparações

                                </p>

                            </a>

                            <div id="products-grid" class="products-grid" style="display:none;"></div>

                        </section>'''

if old_section in content:
    content = content.replace(old_section, '                        <!-- Modelos Disponíveis section removed -->')
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('✓ Removed Modelos Disponíveis section')
else:
    print('✗ Section not found - checking with regex')
    import re
    pattern = r'<!-- Products List - now links to SSG category page -->.*?</section>'
    if re.search(pattern, content, re.DOTALL):
        content = re.sub(pattern, '<!-- Products List section removed -->', content, flags=re.DOTALL)
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(content)
        print('✓ Removed section with regex')
    else:
        print('✗ Could not find section')

print('Done!')
