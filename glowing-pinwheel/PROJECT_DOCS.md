# ComparaTop - Documentação Completa do Projeto

> **Última atualização:** 2026-01-05
> **Pasta do projeto:** `c:\Users\Adriano Antonio\.gemini\antigravity\playground\charged-meteorite`

## 🎯 Visão Geral

ComparaTop é um site de comparação de produtos premium com foco em **curadoria editorial** e **recomendação personalizada** via algoritmo ComparaMatch.

## 📁 Estrutura do Projeto

```
charged-meteorite/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Homepage com Mad Libs (NaturalLanguageSearch)
│   │   ├── layout.tsx                  # Layout global (Header, ComparisonTray, MobileNav)
│   │   ├── categorias/[slug]/page.tsx  # Página dinâmica de categoria
│   │   ├── produto/[slug]/page.tsx     # Página de detalhe do produto (PDP)
│   │   └── comparar/page.tsx           # Página de comparação lado-a-lado
│   │
│   ├── components/
│   │   ├── Header.tsx                  # Header + MegaMenu + MobileBottomNav
│   │   ├── DepartmentGrid.tsx          # Grid de categorias na home
│   │   ├── HorizontalRail.tsx          # Carrosséis de produtos (ProductRail, GuideRail)
│   │   ├── ProductDetailPage.tsx       # Componente PDP completo
│   │   ├── ProductRadarChart.tsx       # Gráfico radar de specs
│   │   ├── TechSpecsSection.tsx        # Especificações técnicas com MicroBars
│   │   ├── BundleWidget.tsx            # Widget de cross-sell estilo Amazon
│   │   ├── TrustMethodology.tsx        # Accordion de metodologia
│   │   ├── ComparisonTray.tsx          # Mini-tray de comparação (60px collapsed)
│   │   ├── ComparisonTable.tsx         # Tabela de comparação lado-a-lado
│   │   │
│   │   # === ComparaMatch UX Components ===
│   │   ├── EditorialWinners.tsx        # Pódio com 3 campeões da categoria
│   │   ├── CategoryFilters.tsx         # Sidebar de filtros (preço, marca)
│   │   ├── MatchFilterRibbon.tsx       # Barra sticky com chips de filtro (Popover/Drawer)
│   │   ├── MatchDonutChart.tsx         # Donut chart de match score
│   │   ├── AnimatedProductList.tsx     # Lista com animações FLIP (framer-motion)
│   │   └── NaturalLanguageSearch.tsx   # Mad Libs hero para home
│   │
│   ├── core/match/                     # === ComparaMatch Algorithm ===
│   │   ├── types.ts                    # Interfaces (UserPreferences, CriteriaConfig, MatchResult)
│   │   ├── engine.ts                   # Motor de cálculo (Sigmoid Penalty, Logarithmic Decay)
│   │   ├── index.ts                    # Exports
│   │   └── config/
│   │       └── tv-criteria.json        # Mapeamento "Dores" → "Specs" para TVs
│   │
│   ├── contexts/
│   │   ├── ComparisonContext.tsx       # Estado global de comparação
│   │   └── ToastContext.tsx            # Sistema de toasts
│   │
│   ├── config/
│   │   └── categories.ts               # Definições de categorias + scoring weights
│   │
│   ├── data/
│   │   └── products.ts                 # Base de dados de produtos
│   │
│   ├── lib/
│   │   ├── scoring.ts                  # Motor de scoring editorial
│   │   ├── amazon.ts                   # Geração de URLs Amazon
│   │   ├── utils.ts                    # Utilitários (cn, etc)
│   │   └── l10n.ts                     # Formatação de preços (BRL)
│   │
│   └── types/
│       ├── product.ts                  # Interface Product
│       └── category.ts                 # Interface ScoredProduct
│
└── package.json                        # Dependencies: Next.js 16, Framer Motion, Recharts, Lucide
```

## 🧠 ComparaMatch - Sistema de Recomendação

### Conceito
- **Soft Constraints**: Nenhum produto é bloqueado, apenas penalizado
- O usuário define prioridades "🔒 Essencial" (Ouro) ou "⭐ Seria Bom" (Prata)
- O algoritmo calcula um Match Score personalizado (0-100%)

### Algoritmo (engine.ts)
```typescript
// Critérios Ouro: Penalidade Sigmoide multiplicativa
penalty = 1 / (1 + e^(k * (deviation - 0.20)))
// Se desvio > 20%, penalidade > 50%

// Preço: Decaimento Logarítmico
penalty = 1 - log(value/target) / log(3)

// Score Final = Base × PenalidadesOuro × (1 + AjustePrataBronze)
```

### UX Flow
1. Homepage: NaturalLanguageSearch (Mad Libs) direciona para categoria com filtros pré-aplicados
2. Categoria: MatchFilterRibbon com chips de critérios
3. Ao clicar chip: Popover (desktop) / Drawer (mobile) com opções Essencial/Seria Bom
4. Produtos reordenam com animação FLIP (framer-motion)
5. Cards mostram Donut Chart de Match Score

## 🏠 Homepage (Hub & Spoke Model)

1. **NaturalLanguageSearch** - Hero com frase "Estou procurando o melhor [📺] para [🎮 Gaming] com orçamento [💰 até R$ 5.000]"
2. **DepartmentGrid** - Grid de categorias com ícones
3. **ProductRail** - Carrossel horizontal de produtos populares
4. **GuideRail** - Carrossel de guias editoriais
5. **TrustSection** - Seção de confiança/metodologia

## 📦 Página de Categoria (categorias/[slug])

1. **Breadcrumbs**
2. **Header** com título e contagem de produtos
3. **TrustMethodology** - Accordion explicando a metodologia
4. **MatchFilterRibbon** - Chips de filtro sticky
5. **Sidebar (CategoryFilters)** - Filtros de preço, marca
6. **EditorialWinners** - Pódio com 3 campeões (🥇 Melhor Geral, 🥈 Custo-Benefício, 🥉 Premium)
7. **AnimatedProductList** - Lista de produtos com FLIP animations

## 📄 Página de Produto (PDP)

1. **ProductHero** - Imagem, preço, CTAs
2. **ProductRadarChart** - "DNA" do produto em radar
3. **TechSpecsSection** - Specs com MicroBars
4. **BundleWidget** - Cross-sell estilo Amazon
5. **StickySidebar** - Sidebar fixa no desktop
6. **StickyMobileFooter** - CTA fixo no mobile

## 🔗 URLs Disponíveis

| Rota | Descrição |
|------|-----------|
| `/` | Homepage |
| `/categorias/smart-tvs` | Categoria TVs |
| `/categorias/geladeiras` | Categoria Geladeiras |
| `/categorias/ar-condicionados` | Categoria AC |
| `/produto/{slug}` | Página de produto |
| `/comparar` | Página de comparação |

## 📦 Dependências Principais

```json
{
  "next": "16.1.1",
  "react": "19",
  "framer-motion": "^11.x",
  "recharts": "^2.x",
  "lucide-react": "^0.x"
}
```

## 🚀 Como Rodar

```bash
cd c:\Users\Adriano Antonio\.gemini\antigravity\playground\charged-meteorite
npm run dev
# Acesse http://localhost:3000
```

## 🔄 Backup

- **Backup atual:** `c:\Users\Adriano Antonio\Desktop\backup_comparatop_2026-01-05`
- **Projeto Netlify antigo:** `c:\Users\Adriano Antonio\.gemini\antigravity\playground\final-event`

## 📝 Próximos Passos Sugeridos

- [ ] Adicionar critérios para outras categorias (geladeiras, AC, etc.)
- [ ] Criar imagens de produtos reais
- [ ] Implementar persistência de preferências do usuário
- [ ] Adicionar mais produtos à base de dados
- [ ] Deploy para Netlify/Vercel
