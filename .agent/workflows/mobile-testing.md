---
description: Como testar responsividade mobile do site ComparaTop
---

# Mobile Testing Workflow

Este workflow define como testar o site em diferentes resoluções de celular.

## URLs de Teste

| Ambiente | URL |
|----------|-----|
| **Staging (Netlify)** | https://majestic-biscuit-69e50b.netlify.app/ |
| **Produção** | https://comparatop.com.br/ |

> **IMPORTANTE**: Sempre teste primeiro no Netlify staging para confirmar deploys antes de validar em produção.

## Viewports de Teste Obrigatórios

Sempre testar em pelo menos 3 resoluções para garantir responsividade:

### 1. Samsung M52 / Galaxy S21+ (High-end Android)
- **Largura**: 412px
- **Altura**: 915px
- **Aspect Ratio**: 20:9 (~2.22:1)
- **Device Pixel Ratio**: 2.625

### 2. iPhone 14 Pro / iPhone 15
- **Largura**: 393px
- **Altura**: 852px
- **Aspect Ratio**: 19.5:9
- **Device Pixel Ratio**: 3

### 3. Android Pequeno (Moto G, Galaxy A)
- **Largura**: 360px
- **Altura**: 640px
- **Aspect Ratio**: 16:9
- **Device Pixel Ratio**: 2

### 4. iPhone SE (Menor iOS)
- **Largura**: 375px
- **Altura**: 667px
- **Aspect Ratio**: 16:9
- **Device Pixel Ratio**: 2

## Passos do Teste

### 1. Preparação
```powershell
# Rodar preflight check antes de testar
node tools/preflight-check.js

# Garantir que build está atualizado
node tools/build.js
node tools/minify.js
```

### 2. Teste no Navegador

Para cada viewport listado acima:

1. Abrir https://comparatop.com.br/geladeiras/
2. Redimensionar para o viewport especificado
3. **Verificar**:
   - [ ] Cards de produtos não cortados
   - [ ] Botões "Adicionar à comparação" visíveis e clicáveis
   - [ ] Menu bottom bar fixo e funcional
   - [ ] Textos legíveis (não muito pequenos)

4. Adicionar 2+ produtos à comparação
5. **Verificar Sticky Bottom Bar**:
   - [ ] Aparece acima do bottom navigation bar
   - [ ] Contador de produtos atualiza
   - [ ] Botão "Comparar" clicável

6. Abrir modal de comparação
7. **Verificar Modal**:
   - [ ] Tabela scrollável horizontalmente
   - [ ] Header sticky funciona ao rolar
   - [ ] Toggle "Mostrar diferenças" presente
   - [ ] Células vencedoras com destaque verde
   - [ ] Botão fechar acessível

### 3. Verificação de Console

Sempre verificar se há erros no console do navegador (F12 → Console):
- [ ] Sem `TypeError` 
- [ ] Sem `ReferenceError`
- [ ] Sem erros de CORS
- [ ] Sem erros 404 em assets

## Breakpoints CSS do Projeto

O projeto usa estes breakpoints em `css/main.css`:

| Breakpoint | Descrição |
|------------|-----------|
| `max-width: 768px` | Mobile (esconde sidebar, mostra bottom bar) |
| `max-width: 480px` | Small mobile (ajustes de padding/font) |
| `min-width: 769px` | Desktop (mostra sidebar, esconde bottom bar) |
| `min-width: 1024px` | Large desktop (sidebar sempre visível) |

## Componentes Mobile-Específicos

Estes elementos só aparecem em mobile (`max-width: 768px`):

1. **Bottom Navigation Bar** (`.ml-bottom-bar`)
   - Fixa no rodapé
   - 4 itens: Início, Categorias, Comparar, Mais

2. **Sticky Comparison Bar** (`.compare-sticky-bottom-bar`)
   - Aparece quando há produtos selecionados
   - Posicionada acima do bottom navigation (bottom: 60px)

3. **Bottom Sheets** (`.ml-bottom-sheet`)
   - Menus que sobem do rodapé
   - Para categorias e opções adicionais

4. **Floating Compare Button** (`.floating-compare-btn`)
   - Alternativa ao counter desktop
   - Canto inferior direito

## Troubleshooting

### Sticky Bottom Bar não aparece
- Verificar se `CompareStore.getCount() > 0`
- Verificar CSS `.compare-sticky-bottom-bar.show { display: flex; }`
- Verificar se não está oculto por outro elemento

### Modal não abre
- Verificar erros de JavaScript no console
- Verificar se `renderComparisonTable()` tem dados válidos
- Verificar se produtos no `compareList` têm `specs` definidos

### Layout quebrado em tela pequena
- Verificar uso de `max-width: 100%` em imagens
- Verificar `overflow-x: auto` em tabelas
- Verificar `flex-wrap: wrap` em containers flex
