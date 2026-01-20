# ComparaTop - Relatório Completo para Continuação

> **Data:** 2026-01-05 13:30
> **Projeto:** `c:\Users\Adriano Antonio\.gemini\antigravity\playground\charged-meteorite`
> **Backup:** `c:\Users\Adriano Antonio\Desktop\backup_comparatop_2026-01-05`

---

## ⚠️ PROBLEMAS PENDENTES (PRIORIDADE)

### 1. MatchFilterRibbon - Popover/Drawer não funcionando corretamente

**Arquivo:** `src/components/MatchFilterRibbon.tsx`

**Problema atual:**
- Desktop: O popover aparece "boiando" (posição incorreta)
- Mobile: O drawer (bottom sheet) não aparece inteiro

**Causa provável:**
O componente foi reescrito várias vezes tentando usar `createPortal`. A última versão usa inline styles e z-index 10000+, mas ainda precisa de ajustes.

**Solução sugerida:**
1. Verificar se `createPortal` está renderizando corretamente
2. O popover precisa calcular posição baseada no `getBoundingClientRect()` do botão
3. O drawer mobile deve ter `position: fixed`, `bottom: 0`, `left: 0`, `right: 0`

**Código atual do FilterPopover (linhas relevantes):**
```tsx
// Posicionamento via estilo inline
style={{
    position: 'fixed',
    top: anchorRect.bottom + 8,
    left: anchorRect.left,
    zIndex: 10000,
}}
```

**Código atual do FilterDrawer (mobile):**
```tsx
// Deve renderizar via createPortal no document.body
return createPortal(drawerContent, document.body);
```

---

### 2. NaturalLanguageSearch - Dropdown com fontes grandes

**Arquivo:** `src/components/NaturalLanguageSearch.tsx`

**Status:** PARCIALMENTE CORRIGIDO

**O que foi feito:**
- Adicionado `text-base font-body font-normal` ao container do dropdown
- Adicionado `text-sm` às opções

**Se ainda estiver com problema:**
O dropdown herda o tamanho da fonte do container pai (que é `text-2xl md:text-4xl lg:text-5xl`). Certifique-se de que o dropdown menu tem classes explícitas para tamanho de fonte.

---

## 📁 ESTRUTURA DO PROJETO

```
src/
├── app/
│   ├── page.tsx                    # Homepage com NaturalLanguageSearch
│   ├── layout.tsx                  # Layout global (Header, ComparisonTray)
│   ├── globals.css                 # Estilos globais e design tokens
│   ├── categorias/[slug]/page.tsx  # Página de categoria com MatchFilterRibbon
│   ├── produto/[slug]/page.tsx     # Página de produto (PDP)
│   └── comparar/page.tsx           # Página de comparação
│
├── components/
│   ├── Header.tsx                  # Header com MegaMenu + MobileBottomNav
│   ├── DepartmentGrid.tsx          # Grid de categorias na home
│   ├── HorizontalRail.tsx          # ProductRail e GuideRail
│   ├── ProductDetailPage.tsx       # Componente PDP completo
│   ├── ProductRadarChart.tsx       # Gráfico radar Recharts
│   ├── TechSpecsSection.tsx        # Specs com MicroBars
│   ├── BundleWidget.tsx            # Cross-sell estilo Amazon
│   ├── TrustMethodology.tsx        # Accordion de metodologia
│   ├── ComparisonTray.tsx          # Mini-tray de comparação
│   ├── ComparisonTable.tsx         # Tabela de comparação side-by-side
│   │
│   # === ComparaMatch (Sistema de Recomendação) ===
│   ├── EditorialWinners.tsx        # Pódio com 3 campeões
│   ├── CategoryFilters.tsx         # Sidebar de filtros (preço, marca)
│   ├── MatchFilterRibbon.tsx       # ⚠️ BARRA DE FILTROS COM PROBLEMA
│   ├── MatchDonutChart.tsx         # Donut chart do match score
│   ├── AnimatedProductList.tsx     # Lista com FLIP animations
│   └── NaturalLanguageSearch.tsx   # ⚠️ MAD LIBS COM DROPDOWN GRANDE
│
├── core/match/                     # Algoritmo ComparaMatch
│   ├── types.ts                    # Interfaces TypeScript
│   ├── engine.ts                   # Motor de cálculo de match score
│   ├── index.ts                    # Exports
│   └── config/
│       └── tv-criteria.json        # Critérios para TVs
│
├── contexts/
│   ├── ComparisonContext.tsx       # Estado global de comparação
│   └── ToastContext.tsx            # Sistema de toasts
│
├── config/
│   └── categories.ts               # Definições de categorias + scoring weights
│
├── data/
│   └── products.ts                 # Base de dados de produtos
│
├── lib/
│   ├── scoring.ts                  # Motor de scoring editorial
│   ├── amazon.ts                   # Geração de URLs Amazon
│   ├── utils.ts                    # cn() e outros utilitários
│   └── l10n.ts                     # Formatação de preços (BRL)
│
└── types/
    ├── product.ts                  # Interface Product
    └── category.ts                 # Interface ScoredProduct
```

---

## 🧠 ALGORITMO COMPARAMATCH

### Conceito Principal
- **Soft Constraints**: Produtos nunca são bloqueados, apenas penalizados
- O usuário define prioridades:
  - 🔒 **Essencial (Ouro)**: Penalidade severa se não atender
  - ⭐ **Seria Bom (Prata)**: Penalidade leve se não atender

### Fórmulas (em `src/core/match/engine.ts`)

```typescript
// Penalidade Sigmoide para critérios Ouro
penalty = 1 / (1 + exp(k * (deviation - 0.20)))
// Onde k = 10, deviation = |actual - target| / target

// Decaimento Logarítmico para preço
penalty = 1 - log(value/target) / log(3)

// Score Final
finalScore = baseScore × goldPenaltyProduct × (1 + silverBronzeAdjustment)
```

### Critérios para TVs (`tv-criteria.json`)

| ID | Label | Campo Técnico | Target | Tipo |
|---|---|---|---|---|
| bright_room | Sala Muito Clara | specs.brightness_nits | 1000 | sigmoid |
| gaming | Jogos Competitivos | specs.input_lag_ms | 10 | logarithmic |
| home_cinema | Cinema em Casa | specs.contrast_ratio | 10000 | sigmoid |
| sports | Esportes ao Vivo | specs.response_time_ms | 6 | linear |
| economy | Economia | specs.power_watts | 100 | sigmoid |
| big_room | Sala Grande | specs.screen_size | 65 | sigmoid |
| smart_features | Smart TV Completa | specs.smart_tv_score | 9 | linear |

---

## 🔧 COMO RODAR O PROJETO

```bash
cd c:\Users\Adriano Antonio\.gemini\antigravity\playground\charged-meteorite
npm run dev
# Servidor: http://localhost:3000
```

**Se aparecer erro de porta ocupada:**
```bash
taskkill /F /IM node.exe
npm run dev
```

---

## 🔗 URLS DISPONÍVEIS

| Rota | Descrição |
|------|-----------|
| `/` | Homepage com NaturalLanguageSearch |
| `/categorias/smart-tvs` | Categoria TVs com MatchFilterRibbon |
| `/categorias/geladeiras` | Categoria Geladeiras |
| `/categorias/ar-condicionados` | Categoria AC |
| `/produto/{slug}` | Página de produto (ex: samsung-qn90c-65) |
| `/comparar` | Página de comparação lado-a-lado |

---

## 📦 DEPENDÊNCIAS PRINCIPAIS

```json
{
  "next": "16.1.1",
  "react": "19",
  "framer-motion": "^11.18.2",
  "recharts": "^2.15.0",
  "lucide-react": "^0.468.0"
}
```

---

## 🎨 DESIGN TOKENS (globals.css)

```css
:root {
  --brand-core: #4361ee;    /* Azul principal */
  --brand-accent: #f72585;  /* Rosa destaque */
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
}
```

---

## ⚠️ ARMADILHAS CONHECIDAS (EVITAR ESTES ERROS)

### 1. Null Safety nos Scores
Muitos produtos não têm `scores` definido. SEMPRE use optional chaining:
```tsx
// ❌ ERRADO
product.scores.quality

// ✅ CORRETO
product.scores?.quality ?? 0
```

### 2. ComparisonTray Global
O `ComparisonTray` está no `layout.tsx` (global). NÃO adicione novamente em páginas individuais.

### 3. AnimatedProductList vs Lista Simples
A página de categoria agora usa `AnimatedProductList` que precisa de:
```tsx
import { AnimatedProductList } from '@/components/AnimatedProductList';

<AnimatedProductList
    products={visibleProducts}
    matchResults={matchResults}
    hasMatchFilters={hasMatchFilters}
/>
```

### 4. Imagens de Produtos
As imagens em `/images/products/` NÃO EXISTEM (404). Os produtos mostram placeholders.

### 5. Critérios apenas para TVs
Atualmente só existem critérios para TVs (`tv-criteria.json`). Outras categorias precisam de seus próprios arquivos.

---

## 📋 TAREFAS PENDENTES

1. [ ] **CORRIGIR** MatchFilterRibbon popover/drawer
2. [ ] **CORRIGIR** NaturalLanguageSearch dropdown (se ainda grande)
3. [ ] Adicionar critérios para outras categorias
4. [ ] Adicionar imagens reais de produtos
5. [ ] Implementar persistência de preferências do usuário
6. [ ] Deploy para produção

---

## 🔄 HISTÓRICO DE MUDANÇAS RECENTES

1. **MatchFilterRibbon.tsx** - Reescrito 3x tentando corrigir o posicionamento
2. **AnimatedProductList.tsx** - Criado para substituir lista estática
3. **NaturalLanguageSearch.tsx** - Criado para homepage, dropdown com problema de fonte
4. **layout.tsx** - ComparisonTray movido para cá (global)
5. **page.tsx (home)** - NaturalLanguageSearch integrado no hero
6. **categorias/[slug]/page.tsx** - CompactProductCard removido, usa AnimatedProductList

---

## 💬 PROMPT PARA INICIAR NOVA CONVERSA

```
Estou continuando o desenvolvimento do projeto ComparaTop. Por favor, leia os seguintes arquivos para entender o contexto completo:

1. c:\Users\Adriano Antonio\.gemini\antigravity\playground\charged-meteorite\CONTINUACAO_2026-01-05.md
2. c:\Users\Adriano Antonio\.gemini\antigravity\playground\charged-meteorite\PROJECT_DOCS.md

Após ler, me ajude a corrigir o MatchFilterRibbon.tsx - o popover/drawer não está aparecendo corretamente. No desktop fica "boiando" fora de posição, e no mobile não aparece inteiro.
```

---

## 📎 ARQUIVOS MAIS IMPORTANTES PARA REVISAR

1. `src/components/MatchFilterRibbon.tsx` - Componente com problema
2. `src/components/NaturalLanguageSearch.tsx` - Dropdown com fonte grande
3. `src/app/categorias/[slug]/page.tsx` - Página que usa o ribbon
4. `src/core/match/engine.ts` - Algoritmo de match score
5. `src/components/AnimatedProductList.tsx` - Lista com animações FLIP
