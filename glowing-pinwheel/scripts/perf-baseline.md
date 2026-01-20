# Performance Baseline - ComparaTop

## Data: 2026-01-19 17:37

## Ferramentas
- Bundle Analyzer: `npm run analyze`
- Relatórios: `.next/analyze/client.html`, `.next/analyze/nodejs.html`
- Integrity: `npm run test:integrity`

---

## Bundle Analysis Report

### ❌ BEFORE (19/01/2026 - Baseline)

**Total Client Bundle: 2.76 MB (parsed)**

| # | Chunk | Tamanho | Conteúdo Principal |
|---|-------|---------|-------------------|
| 1 | `4001-*.js` | 927.2 KB | lucide-react/icons + recharts |
| 2 | `produto/[slug]/page-*.js` | 297.75 KB | ProductDetailPage.tsx |
| 3 | `4bd1b696-*.js` | 193.88 KB | react-dom dependencies |
| 4 | `framework-*.js` | 185.34 KB | React framework |
| 5 | `3794-*.js` | 184.06 KB | Next.js internals |
| 6 | `b1644e8c-*.js` | 150.96 KB | lucide-react base |
| 7 | `main-*.js` | 125.81 KB | Next.js router |
| 8 | `7900-*.js` | 111.95 KB | framer-motion |
| 9 | `categorias/[slug]/page-*.js` | 95.55 KB | CategoryPageClient.tsx |
| 10 | `layout-*.js` | 43.16 KB | App layout |

**Problemas Identificados:**
1. `SmartSimulatorCard.tsx` usava `import * as LucideIcons` — puxava TODOS os ícones (~927KB)
2. `recharts` no chunk vendor sem lazy loading

---

### ✅ AFTER (19/01/2026 - Optimized)

**Otimizações Aplicadas:**
1. ✅ Refatorado `SmartSimulatorCard.tsx` com mapa `ALLOWED_ICONS` (tree-shaking)
2. ✅ Guardrail adicionado em `integrity-ui-contracts.ts` para prevenir regressão
3. ✅ Todos os `import * as LucideIcons` removidos do projeto

| # | Chunk | Tamanho | Conteúdo Principal |
|---|-------|---------|-------------------|
| 1 | `746-*.js` | **373.03 KB** | recharts + redux-toolkit + es-toolkit |
| 2 | `produto/[slug]/page-*.js` | 298.15 KB | ProductDetailPage.tsx |
| 3 | `4bd1b696-*.js` | 193.88 KB | react-dom dependencies |
| 4 | `framework-*.js` | ~185 KB | React framework |
| 5 | `lucide-react (total)` | **~142 KB** | Ícones usados (tree-shaked) |

### 📊 Impacto da Otimização

| Métrica | Antes | Depois | Delta |
|---------|-------|--------|-------|
| Maior chunk vendor | 927.2 KB | 373.03 KB | **-554 KB (-60%)** |
| lucide-react footprint | ~927 KB (all icons) | ~142 KB | **-785 KB (-85%)** |
| Tree-shaking | ❌ Não funcionava | ✅ Ativo | - |

> [!TIP]
> Ícones agora são importados individualmente (ex: `trophy.js` 455B, `info.js` 196B), confirmando tree-shaking ativo.

---

## Sistema de Integridade (Status-Aware)

### Implementação (19/01/2026)
- Adicionado campo `status: 'draft' | 'published'` ao ProductSchema
- Modificado `checkProductHealth()` para considerar status:
  - **DRAFT**: MISSING_IMAGE/NO_OFFERS = WARNING (não bloqueia CI)
  - **PUBLISHED**: Campos críticos faltantes = FAIL (bloqueia CI)
- Script `integrity-products.ts` refatorado com relatório por status

### Resultado Atual
```
📦 INTEGRITY:PRODUCTS - Status-Aware Validation
============================================================
Total de produtos: 21

📝 DRAFT (não bloqueiam CI):
   ✅ OK:   2
   ⚠️  WARN: 14

🚀 PUBLISHED (bloqueiam CI se FAIL):
   ✅ OK:   5
   ⚠️  WARN: 0
   ❌ FAIL: 0
============================================================
⚠️ INTEGRITY:PRODUCTS PASSOU (drafts com warnings)
```

---

## Regras de next/image

### Guardrails Implementados

1. **Máximo 1 priority por rota** (exceto se justificado)
   - `ProductGallery.tsx`: `priority={activeIndex === 0}` ✅
   
2. **sizes obrigatório com fill**
   - `ProductGallery`: `sizes="(max-width: 768px) 100vw, 50vw"` ✅
   - `SmartShelf`: `sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"` ✅

3. **aspect-ratio container**
   - Usar container com `aspect-square relative` ou similar para reservar espaço

### Checklist de Conformidade
- [x] ProductGallery usa `priority` apenas na primeira imagem
- [x] SmartShelf usa `fill` com `sizes` coerente
- [x] Suspense boundaries em componentes com useSearchParams

---

## Rotina Lighthouse

### Rotas Alvo
1. `/` (Home)
2. `/categorias/smart-tvs` (PLP)
3. `/produto/samsung-qn90c-65` (PDP)
4. `/vs/samsung-qn90c-65-vs-tcl-c735-65` (VS Battle)

### Metodologia
- 3 testes por rota
- Usar mediana dos resultados
- DevTools > Lighthouse > Performance
- Mobile simulation (default)

### Métricas Prioritárias
| Métrica | Alvo | Impacto SEO |
|---------|------|-------------|
| LCP | < 2.5s | Alto (Core Web Vital) |
| CLS | < 0.1 | Alto (Core Web Vital) |
| FCP | < 1.8s | Médio |
| TTI | < 3.8s | Médio |

---

## AÇÕES APLICADAS

### A) Integridade de Produtos ✅
- Implementado sistema DRAFT/PUBLISHED
- CI passa com 14 drafts com warnings
- 5 produtos completos marcados como published

### B) LCP/CLS Otimization ✅
- Hero image com next/image + priority
- SmartShelf com next/image + fill + sizes
- Suspense boundaries em chat/ e categorias/[slug]

### C) Build Fixes ✅
- Subprojetos excluídos do tsconfig
- Tipos corrigidos (INTERNAL_EXACT_PATHS, etc.)
- Build passa (Exit code 0)

---

## Próximas Otimizações (Backlog)

### Alta Prioridade
1. **Refatorar dynamic icon loading**: O `import * as LucideIcons` pode ser substituído por um mapa estático de ícones usados
2. **Lazy load recharts**: Verificar se já está com dynamic import em todos os usos

### Média Prioridade
3. **Code split ProductDetailPage**: 298KB pode ser reduzido separando componentes abaixo da dobra
4. **Analisar framer-motion**: Verificar se pode ser substituído por CSS animations em casos simples

---

## COMANDOS

```bash
# Rodar bundle analyzer
npm run analyze

# Ver relatório (abrir no browser)
start .next/analyze/client.html

# Build normal
npm run build

# Testes de integridade
npm run test:integrity
```
