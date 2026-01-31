# SimplifiedPDP - Inventário de Fontes de Dados

> **IMPORTANTE**: Consulte este documento ANTES de propor simplificações.

## Seções do SimplifiedPDP e Suas Fontes

| # | Seção | Fonte Primária | Fonte Fallback | Arquivo Gerador |
|---|-------|----------------|----------------|-----------------|
| 1 | **Context Profiles** | Categoria → `context-profiles.ts` | - | `context-profiles.ts` |
| 2 | **Audit Verdict** | `mockData.auditVerdict` | `product.scores` | `audit-verdict-generator.ts` |
| 3 | **VOC / Community** | `mockData.voc` | - | Gemini (registro) |
| 4 | **TCO** | `mockData.tco` | `product.price` | `generate-tco.ts` |
| 5 | **Feature Benefits** | `mockData.featureBenefits` OU `product.featureBenefits` | `product.specs` | `generate-feature-benefits.ts` |
| 6 | **Unknown Unknowns** | `category-uu.json` | - | Auto por categoria |
| 7 | **Methodology** | Static | - | `MethodologyAccordion` |
| 8 | **Radar/DNA** | `data.scores.dimensions` | `product.scores` | `extract-radar-dimensions.ts` |
| 9 | **Interactive Tools** | Categoria | - | Auto-seleção |
| 10 | **FAQ** | `mockData.faq` OU `decisionFAQ` | - | Gemini (template) |
| 11 | **Tech Specs** | `product.specs` | - | Direto do produto |
| 12 | **Benchmarks** | `product.benchmarks` | - | Direto do produto |
| 13 | **Price History** | `product.priceHistory` | - | Direto do produto |
| 14 | **Main Competitor** | `product.mainCompetitor` | - | Direto do produto |

## Arquivos Auto-Geradores (`src/lib/pdp/`)

| Arquivo | Gera de | Saída |
|---------|---------|-------|
| `extract-radar-dimensions.ts` | `product.scores` | `RadarDimension[]` |
| `audit-verdict-generator.ts` | `product.scores` | `AuditVerdictData` |
| `generate-tco.ts` | `product.price` + categoria | `GeneratedTCOData` |
| `generate-feature-benefits.ts` | `product.specs` | `FeatureBenefit[]` |

## Configurações por Categoria (`src/config/`)

| Arquivo | Conteúdo |
|---------|----------|
| `context-profiles.ts` | Perfis de uso por categoria |
| `categories.ts` | Critérios de avaliação (c1-c10) |

## Dados no Tipo `Product` (verificar SEMPRE)

```typescript
interface Product {
  // Dados diretos (NÃO precisam de mock)
  specs: Record<string, any>;
  scores: { c1: number, c2: number, ... };
  benchmarks?: Benchmark[];  // ✅ JÁ EXISTE
  featureBenefits?: FeatureBenefit[];  // ✅ JÁ EXISTE
  priceHistory?: PricePoint[];
  mainCompetitor?: Competitor;
  // ...
}
```

## Checklist Antes de Propor Simplificação

- [ ] Verificar tipo `Product` em `src/types/category.ts`
- [ ] Verificar `products.ts` para campos existentes
- [ ] Verificar templates em `src/lib/scaffold/templates/minimal/`
- [ ] Verificar mocks existentes em `src/data/mocks/`
- [ ] Verificar se já existe gerador em `src/lib/pdp/`
