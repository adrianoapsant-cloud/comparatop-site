# ComparaTop — Prompt/Brief de Implementação para Oppus (SEO + Escala + Conversão)

## PAPEL
Você é um **engenheiro sênior de front-end + SEO técnico**.

## OBJETIVO
Transformar o ComparaTop (hoje **SPA/CSR** com **hash routing**) em um site **indexável e escalável**, mantendo o visual atual e reaproveitando o modelo de dados existente em `/data`.

## BASELINE (auditoria do estado atual)
- O site é **CSR (client-side rendering)** e usa **hash routing** (`/#geladeiras`, `/#produto-xxx`), e o **view-source** vem vazio/sem conteúdo de produto.
- O `sitemap.xml` contém URLs com `#`.
- Falta **meta description** e **canonical** por página.
- Falta **Schema.org/JSON-LD** (Product/Offer/AggregateRating/FAQ/Breadcrumb/Organization).
- Não há **analytics** nem tracking de CTA.
- Não existe **validador automático** de consistência JSON/HTML.
- CSS está inline (~200KB); scripts sem `defer`; imagens sem `loading="lazy"`; mobile tem apenas 1 breakpoint.

---

# ENTREGÁVEL (Implementação)

## 1) Migrar de hash routing para rotas reais e indexáveis (P0)
Migrar para rotas reais e estáveis (sem `#`), idealmente com **Next.js App Router** ou **Astro**.

Rotas obrigatórias:
- `/` (home)
- `/categoria/[slug]`
- `/produto/[id]`
- `/comparar/[idA]-vs-[idB]` **ou** `/comparar?ids=...`
- `/top/[categoria]/[ano]` (template pronto, pode ficar “em breve”)
- `/artigos/[slug]` (template pronto, mesmo vazio agora)

Renderização:
- Priorizar **SSG/ISR** para páginas de produto/categoria/comparação (e SSR quando fizer sentido).
- Garantir que o HTML final entregue aos crawlers já contenha conteúdo.

## 2) SEO por página (P0 — obrigatório)
Implementar por página:
- `title` dinâmico
- `meta description` dinâmico
- `canonical` correto
- `robots` meta quando necessário (ex.: filtros/páginas sem valor)
- OpenGraph + Twitter Cards
- Breadcrumbs sem depender de JS
- `sitemap.xml` com rotas **REAIS** (sem `#`), incluindo produtos e categorias
- `robots.txt` coerente

## 3) Schema.org / JSON-LD (P0)
Gerar JSON-LD no HTML final.

Por tipo de página:
- **Home**: `Organization` + `WebSite`
- **Todas**: `BreadcrumbList`
- **Categoria**: `CollectionPage`
- **Produto**: `Product` + `Offer` + `AggregateRating`
- **FAQ**: `FAQPage` (quando a seção existir)

Regras:
- Usar dados de `/data/catalogs/*.json` (offers, ratings, voc.sample.totalApprox etc.).
- Garantir que o JSON-LD seja renderizado no HTML final (não apenas via JS após load).

## 4) Performance (P0)
- Remover CSS inline gigante; separar e otimizar CSS (minificação e bundling do framework).
- Scripts com `defer`/estratégia padrão do framework.
- Imagens: `loading="lazy"`, `width/height`, e `srcset` quando possível.
- Melhorar **TTFB/LCP/CLS/INP** (ao menos evidência via Lighthouse antes/depois).

## 5) Analytics e tracking (P0)
Integrar GA4 ou Plausible (config por env var).

Eventos mínimos:
- Clique em **“Ver Oferta”** (com `varejista`, `preco`, `produtoId`, `posicao_na_lista`)
- Clique em **“Adicionar ao comparador”**
- Submit do **email** (newsletter/alertas)
- **Scroll depth** (25/50/75/90)

LGPD:
- Implementar banner simples de cookies/consentimento se necessário.

## 6) Validador de consistência (P1)
Criar script Node que rode no build/CI:
- valida que todo produto no JSON gera página `/produto/[id]`
- valida campos obrigatórios (ex.: nome, categoria, dimensões quando aplicável)
- valida URLs de offers (formato + presença de tags de afiliado quando aplicável)
- opcional: alerta se preço estiver desatualizado (se houver timestamp)

## 7) Conteúdo e confiança (P1)
- Criar páginas: `/privacidade`, `/cookies`, `/termos` (templates simples)
- Melhorar mobile:
  - breakpoints adicionais (768 e 480)
  - tabelas com `overflow-x:auto`
- Acessibilidade:
  - foco visível
  - navegação por teclado
  - `aria-labels` consistentes
  - “skip to content”

---

# CRITÉRIOS DE ACEITE (NÃO NEGOCIÁVEL)
1. Em **view-source** de `/produto/[id]` existe:
   - H1 preenchido
   - conteúdo principal (specs + ofertas + seções principais)
   - JSON-LD (Product + Offer + AggregateRating quando aplicável)
2. `sitemap.xml` contém **apenas URLs sem `#`** e inclui `/produto` e `/categoria`.
3. `title` / `description` / `canonical` variam por página e são coerentes.
4. Eventos de clique nos CTAs (“Ver Oferta”) aparecem no analytics.
5. Lighthouse mobile melhora após otimizações (principalmente LCP/CLS) — anexar relatório antes/depois.
