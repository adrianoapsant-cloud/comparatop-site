---
description: Como evitar que elementos apareçam acima do header em páginas SSG
---

# SSG Content Injection - Best Practices

Este documento explica como evitar o problema comum de elementos SSG (Static Site Generated) aparecerem ACIMA do header do site.

## O Problema

No ComparaTop, o build SSG (`tools/build.js`) injeta conteúdo HTML nas páginas. Se o conteúdo for injetado no local errado, os elementos aparecem visualmente acima do header porque são renderizados antes do layout principal no DOM.

## Arquitetura do ComparaTop

```
<body>
  <!-- SEO Content (hidden) - injected by build.js -->
  <div id="prerendered-content" class="prerendered-seo-content">
    ... conteúdo para bots de busca ...
  </div>
  
  <!-- Layout Principal (visible) -->
  <header class="ml-header">...</header>   <!-- z-index: 1100 -->
  <aside class="sidebar">...</aside>
  <main>...</main>
  <footer>...</footer>
  
  <!-- Floating Content (visible, fixed position) -->
  <!-- Deve ir AQUI, antes de </body> -->
</body>
```

## Regras de Ouro

### 1. Conteúdo SEO (Hidden)
- Vai logo após `<body>` 
- Usa classe `prerendered-seo-content` com `display:none`
- Bots de busca veem, usuários não

### 2. Elementos UI Visíveis (Fixed/Floating)
- **NUNCA** colocar antes do header no DOM
- Usar `position: fixed` com `z-index` apropriado
- Injetar **antes de `</body>`**, não após `<body>`

### 3. Elementos UI Inline
- Devem ser renderizados **pelo JavaScript** dinamicamente
- Exemplos: Hero Score Badge, Quick Buy Card
- O JS injeta dentro do container correto (`#product-content`)

## Solução no build.js

A função `processTemplate` aceita dois parâmetros:
- `bodyContent`: vai após `<body>` (SEO, hidden)
- `floatingContent`: vai antes de `</body>` (UI, visible)

```javascript
function processTemplate(template, { metaTags, jsonLd, bodyContent, floatingContent = '' }) {
    // SEO content after <body>
    html = html.replace(/<body>[\s\S]*?<!-- Skip/, bodyContent + '\n    <!-- Skip');
    
    // Floating content before </body>
    if (floatingContent) {
        html = html.replace('</body>', floatingContent + '\n</body>');
    }
}
```

## Z-Index Reference

| Elemento | z-index |
|----------|---------|
| Header | 1100 |
| Sidebar Overlay | 1050 |
| Sticky Footer CTA | 1040 |
| Compare Bottom Bar | 1030 |
| Floating Compare Button | 1020 |

## Checklist para Novos Elementos UI

- [ ] O elemento precisa aparecer dentro do fluxo do documento?
  - Sim → Renderizar via JavaScript no container correto
  - Não → Usar position:fixed e injetar antes de `</body>`
- [ ] O z-index está menor que o header (1100)?
- [ ] Testou em mobile (412x915)?
- [ ] O elemento aparece após scroll corretamente?

## URLs de Teste

- Staging: https://majestic-biscuit-69e50b.netlify.app/
- Produção: https://comparatop.com.br/
