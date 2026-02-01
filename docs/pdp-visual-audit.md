# Auditoria Visual Completa da PDP - Mapeamento de Elementos

> Documento de trabalho: cada print adiciona elementos à lista.
> Objetivo: mapear TODOS os elementos visuais da página para suas fontes de dados.

---

## 📸 PRINT 1 - Hero Section (Topo da Página)

### 🔝 HEADER (Barra Superior)

| # | Elemento | Texto/Conteúdo | Fonte de Dados |
|---|----------|----------------|----------------|
| 1 | Logo | "ComparaTop" (verde) | Hardcoded |
| 2 | Menu | "Categorias ▼" | Hardcoded |
| 3 | Link | "Comparador" | Hardcoded |
| 4 | Link | "Metodologia" | Hardcoded |
| 5 | Localização | "📍 SP ▼" | localStorage/IP |
| 6 | Barra de busca | "🎤 Q Cole um link ou descreva..." | Placeholder hardcoded |

### 📢 BARRA DE TRANSPARÊNCIA

| # | Elemento | Texto/Conteúdo | Fonte de Dados |
|---|----------|----------------|----------------|
| 7 | Aviso amarelo | "Transparência: Auditoria independente..." | Hardcoded |

### ⬅️ NAVEGAÇÃO

| # | Elemento | Texto/Conteúdo | Fonte de Dados |
|---|----------|----------------|----------------|
| 8 | Link | "← Voltar" | Hardcoded |

---

### 🖼️ HERO ESQUERDO (Galeria)

| # | Elemento | Texto/Conteúdo | Fonte de Dados |
|---|----------|----------------|----------------|
| 9 | Imagem principal | [Placeholder - imagem não carregou] | `product.imageUrl` ou `product.gallery[0]` |
| 10 | Texto alt | "Roborock Q7 L5 Robô Aspirador..." | `product.name` |
| 11 | Thumbnail mini | "Thumbnail 1" + botão "+" | `product.gallery[]` |

---

### 📝 HERO DIREITO (Info do Produto)

| # | Elemento | Texto/Conteúdo | Fonte de Dados |
|---|----------|----------------|----------------|
| 12 | **🏆 Badge headline** | "🏆 LiDAR preciso com 8000Pa de sucção e escovas anti-emaranhamento para pets" | `extendedData.header.subtitle` → `product.benefitSubtitle` |
| 13 | **Título H1** | "Roborock Q7 L5 Robô Aspirador e Esfregão com LiDAR" | `product.name` |
| 14 | **Badge nota** | "8.11 ⭐" | `getBaseScore(product)` → calculado de `product.scores` |
| 15 | Checkmark 1 | "✓ LiDAR de Precisão" | `product.featureBenefits[0].title` |
| 16 | Checkmark 2 | "✓ Anti-Emaranhamento" | `product.featureBenefits[1].title` |
| 17 | Checkmark 3 | "✓ 8000Pa de Sucção" | `product.featureBenefits[2].title` |

---

### 💡 CARD INSIGHT (Azul - CuriositySandwich)

| # | Elemento | Texto/Conteúdo | Fonte de Dados |
|---|----------|----------------|----------------|
| 18 | Ícone | 📊 | Gerado por `CuriositySandwich` baseado em score |
| 19 | Texto | "Esta Roborock com nota 8.11 é excelente na maioria dos aspectos..." | Gerado localmente por `CuriositySandwich` |

---

### 📊 BARRA DE CUSTO-BENEFÍCIO (CostBenefitChart)

| # | Elemento | Texto/Conteúdo | Fonte de Dados |
|---|----------|----------------|----------------|
| 20 | Título | "✓ 18% mais barato que a média da categoria" | Calculado: `(categoryMedian - product.price) / categoryMedian * 100` |
| 21 | Label esquerda | "Este produto" | Hardcoded |
| 22 | Barra verde | "R$ 2.105,97" | `product.price` formatado |
| 23 | Label esquerda | "Média categoria" | Hardcoded |
| 24 | Barra cinza | "R$ 2.552,98" | `getCategoryPriceStats(categoryId).median` |

---

### 🛒 SEÇÃO ONDE COMPRAR (SmartOfferCard)

| # | Elemento | Texto/Conteúdo | Fonte de Dados |
|---|----------|----------------|----------------|
| 25 | Título | "Onde Comprar" | Hardcoded |
| 26 | Subtítulo | "A partir de R$ 2.106" | `Math.min(...offers.map(o => o.price))` |
| 27 | Link | "Comparando 2 lojas" | `offers.length` |
| 28 | Card Amazon | "Amazon" + "À vista 🔗" + "R$ 2.106" | `product.offers[].storeSlug === 'amazon'` |
| 29 | Card ML | "Mercado Livre" + "À vista 🔗" + "R$ 2.169" | `product.offers[].storeSlug === 'mercadolivre'` |

---

## 📊 RESUMO PARCIAL

| Print | Elementos | Acumulado |
|-------|-----------|-----------|
| Print 1 | 29 | 29 |

---

## 📸 PRINT 2 - (Aguardando...)

<!-- Próximos elementos serão adicionados aqui -->

---

## 📸 PRINT 3 - (Aguardando...)

<!-- Próximos elementos serão adicionados aqui -->

---

## 📸 PRINT 4 - (Aguardando...)

<!-- Próximos elementos serão adicionados aqui -->

---

## 📸 PRINT 5 - (Aguardando...)

<!-- Próximos elementos serão adicionados aqui -->
