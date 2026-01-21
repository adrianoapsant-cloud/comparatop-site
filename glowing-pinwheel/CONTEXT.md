# 🧠 ComparaTop - Contexto do Projeto

> **LEIA PRIMEIRO**: Este arquivo contém todo o contexto necessário para continuar o desenvolvimento.
> Última atualização: 2026-01-07

---

## 📍 Localização do Projeto

```
Workspace: c:\Users\Adriano Antonio\.gemini\antigravity\playground\eternal-cosmos
```

---

## 🎯 O Que é o ComparaTop

Site de comparação de produtos eletrônicos no Brasil com:
- Sistema de scoring próprio (10 critérios por categoria)
- Análises geradas por IA (Gemini 2.5 Flash)
- Ferramentas interativas (calculadoras, quiz, comparadores)
- Afiliação Amazon Associates

---

## 🏗️ Arquitetura Principal

### Stack
- **Framework**: Next.js 16.1.1 (App Router)
- **Styling**: TailwindCSS 4
- **Database**: SQLite/Prisma (local), PostgreSQL (prod)
- **AI**: Google Gemini 2.5 Flash (1M tokens)
- **Hosting**: Cloudflare Pages

### Estrutura de Pastas Críticas

```
src/
├── app/                    # Rotas Next.js
│   ├── api/reviews/        # API de análises IA
│   ├── categorias/         # Páginas de categoria
│   ├── produto/            # Páginas de produto (PDP)
│   ├── comparar/           # Comparações
│   └── ferramentas/        # Calculadoras e quiz
├── components/
│   ├── engines/            # Motores interativos (Quiz, Rate, Geometry)
│   ├── ui/                 # Componentes base
│   ├── ProductDetailPage.tsx    # Página de produto principal
│   ├── AIReviewSection.tsx      # Seção de análise IA
│   └── AnimatedProductList.tsx  # Listagem de produtos
├── config/
│   └── categories.ts       # 10 CRITÉRIOS POR CATEGORIA (CRÍTICO!)
├── contexts/
│   └── ReviewContext.tsx   # Cache centralizado de reviews IA
├── data/
│   └── products.ts         # Dados estáticos de produtos
└── lib/
    ├── scoring.ts          # Algoritmo de scoring (QS, VS, GS)
    └── review-adapters.ts  # Adapter Gemini
```

---

## ⭐ Sistema de Scoring (10 Critérios)

### Protocolo Consenso 360º

Cada categoria tem 10 critérios (c1-c10) avaliados por fontes específicas:

| Fonte | Peso | Dados |
|-------|------|-------|
| RTINGS.com | 35% | Medições de laboratório |
| YouTube Brasil | 25% | Reviews de 1+ ano |
| Reclame Aqui | 20% | Nota da marca |
| Fóruns | 10% | Discussões técnicas |
| Marketplaces | 10% | Reviews verificados |

### Scores Computados
- **QS** (Quality Score): Média ponderada de critérios de qualidade
- **VS** (Value Score): Custo-benefício (70% editorial + 30% algorítmico)
- **GS** (Gift Score): Confiabilidade e suporte
- **Overall**: QS 55% + VS 30% + GS 15%

### Arquivo de Definição
📄 `src/config/categories.ts` - FONTE DA VERDADE dos 10 critérios

---

## 🤖 Sistema de IA (Frozen Content Pipeline)

### Como Funciona
1. Usuário acessa página de produto
2. `AIReviewSection` busca `/api/reviews/[productId]`
3. API verifica cache → se não tiver, chama Gemini
4. Gemini gera análise com 10 critérios
5. Resultado cacheado por 24h

### Arquivos Chave
- `src/app/api/reviews/[productId]/route.ts` - API Route
- `src/components/AIReviewSection.tsx` - Componente visual
- `src/contexts/ReviewContext.tsx` - Cache centralizado

### Configuração
```env
# .env.local
GOOGLE_GENERATIVE_AI_API_KEY="your-api-key-here"
DATABASE_URL="file:./prisma/dev.db"
```

---

## 🛠️ Ferramentas Interativas

| Engine | Descrição | Arquivo |
|--------|-----------|---------|
| QuizEngine | Quiz de recomendação | `src/components/engines/QuizEngine.tsx` |
| RateEngine | Calculadora de consumo | `src/components/engines/RateEngine.tsx` |
| GeometryEngine | "Cabe na sala?" | `src/components/engines/GeometryEngine.tsx` |
| ComparisonEngine | Comparador visual | `src/components/engines/ComparisonEngine.tsx` |

---

## 📋 Estado Atual do Projeto

### ✅ Implementado
- Sistema de scoring completo
- AI Review com protocolo Consenso 360º
- Ferramentas interativas (Quiz, Rate, Geometry)
- Comparador de produtos
- Bundle recommendations
- Cache de reviews

### 🔄 Em Progresso (Fase 2)
- Migrar listagens para usar ReviewContext
- Batch generation para todos produtos
- Persistir reviews no SQLite/Prisma

### 📝 Backlog
- Integração com mais marketplaces
- PWA mobile
- Dashboard de analytics

---

## 🚀 Comandos Úteis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor
npm run dev:clean    # Mata processos e inicia limpo
npm run kill         # Mata todos processos Node
npm run restart      # Reinicia limpo

# Testes
npm run test:gemini  # Testa conexão Gemini

# Build
npm run build        # Build produção
```

---

## 📚 Roteiro de Estudo para Novo Agente

### Ordem de Leitura Recomendada

1. **Entender categorias e critérios**
   - Ler: `src/config/categories.ts`
   
2. **Entender scoring**
   - Ler: `src/lib/scoring.ts`
   
3. **Entender estrutura de produto**
   - Ler: `src/types/category.ts`
   - Ler: `src/data/products.ts` (primeiros 100 linhas)

4. **Entender página de produto**
   - Ler: `src/components/ProductDetailPage.tsx` (outline)
   - Ler: `src/components/AIReviewSection.tsx`

5. **Entender API de reviews**
   - Ler: `src/app/api/reviews/[productId]/route.ts`
   - Ler: `src/contexts/ReviewContext.tsx`

6. **Entender ferramentas**
   - Ler: `src/lib/tools-config.ts`
   - Ler: `src/components/engines/` (qualquer um)

---

## 🔗 Arquivos de Referência Rápida

| Precisa de... | Vá para... |
|---------------|------------|
| 10 critérios | `src/config/categories.ts` |
| Algoritmo de score | `src/lib/scoring.ts` |
| Dados de produtos | `src/data/products.ts` |
| Página de produto | `src/components/ProductDetailPage.tsx` |
| Análise IA | `src/components/AIReviewSection.tsx` |
| API Gemini | `src/app/api/reviews/[productId]/route.ts` |
| Ferramentas | `src/lib/tools-config.ts` |

---

## 👤 Preferências do Usuário

- Prefere respostas diretas e concisas
- Gosta de tabelas para comparações
- Valoriza automação (scripts de cleanup, etc.)
- Foco no mercado brasileiro
- Afiliação Amazon Associates

---

*Este arquivo deve ser atualizado sempre que houver mudanças significativas na arquitetura.*
