# ComparaTop - Arquitetura Técnica

> **Versão:** 2.0.0  
> **Atualizado:** 2025-12-25  
> **Maintainer:** Equipe ComparaTop

## Visão Geral

ComparaTop é um site de comparação de eletrodomésticos focado em:
- **Decision Engine:** Decisão rápida sem perder profundidade
- **SEO Forte:** Indexável de verdade (HTML no servidor)
- **Escala:** Suporta milhares de produtos/categorias
- **Monetização:** Afiliados multi-loja com compliance

## Stack Técnico

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | HTML/CSS/JS estático (SSG) |
| **Build** | Node.js scripts customizados |
| **Hosting** | Coolify (Docker) + Nginx |
| **CDN** | Cloudflare (DNS + Cache) |
| **Imagens** | Cloudflare R2 (futuro) |
| **CI/CD** | GitHub Actions |
| **Validação** | JSON Schema (Ajv) |

## Estrutura do Repositório

```
comparatop-site-git/
├── .github/
│   └── workflows/
│       └── ci.yml              # Pipeline CI/CD
├── config/
│   ├── affiliates.yml          # Lojas + regras de afiliados
│   ├── categories.yml          # Categorias + tópicos editoriais
│   ├── seo.yml                 # Templates SEO
│   └── redirects.yml           # Redirects em escala
├── data/
│   ├── catalogs/               # JSON por categoria
│   │   └── geladeira.json
│   └── site.json               # Config global
├── docs/
│   ├── architecture.md         # (este arquivo)
│   ├── data-contracts.md       # Schemas e exemplos
│   └── runbook-deploy.md       # Guia de deploy
├── schemas/
│   ├── product.schema.json     # Schema de produto
│   ├── category.schema.json    # Schema de categoria
│   └── catalog.schema.json     # Schema de catálogo
├── tools/
│   ├── build.js                # SSG builder
│   ├── validate-catalog.js     # Validação de dados
│   ├── validate-schemas.js     # Validação JSON Schema
│   ├── smoke-test.js           # Testes pós-build
│   └── generate-redirects.js   # Gerar config nginx
├── dist/                       # Output do build
├── package.json
├── nginx.conf
└── README.md
```

## Fases de Implementação

### ✅ FASE 0 — Convenções + Contratos

- [x] Estrutura `/config` com YAMLs
- [x] JSON Schemas em `/schemas`
- [x] Documentação em `/docs`
- [x] Script de validação

### ✅ FASE 1 — SEO Base (Indexável)

- [x] SSG funcional (HTML no servidor)
- [x] 200/404 corretos (sem SPA fallback)
- [x] sitemap.xml com canônicas
- [x] robots.txt + llms.txt

### ✅ FASE 2 — CI/CD

- [x] GitHub Actions pipeline
- [x] Smoke tests automatizados
- [x] Deploy via Coolify webhook

### ⏳ FASE 3 — Imagens em Escala (Stub)

- [ ] Cloudflare R2 bucket
- [ ] Sync com rclone
- [ ] Componente lazy-load

### ⏳ FASE 4 — SEO Avançado (Stub)

- [ ] Schema.org ItemList
- [ ] BreadcrumbList
- [ ] Páginas /metodologia, /fontes

### 🔜 FASE 5+ — Futuro

- [ ] Offers Engine (multi-loja)
- [ ] Histórico de preços (exceto Amazon)
- [ ] Alertas com double opt-in
- [ ] Termômetro de valor (QS/VS)

## Comandos

### Desenvolvimento

```bash
# Instalar dependências
npm install

# Validar dados (schemas + catálogo)
npm run validate

# Build (gera dist/)
npm run build

# Servir localmente
npm run serve

# Smoke tests
npm run smoke-test
```

### Deploy

```bash
# Build completo com validação
npm run build:full

# Verificar produção
npm run deploy:check

# Deploy (via push para main)
git push origin main
# → GitHub Actions → Coolify webhook → Deploy automático
```

## Fluxo de Dados

```
┌─────────────────────────────────────────────────────────┐
│                    DESENVOLVIMENTO                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   config/*.yml     data/catalogs/*.json                 │
│        │                    │                            │
│        └─────────┬──────────┘                           │
│                  ▼                                       │
│        ┌─────────────────┐                              │
│        │ npm run validate │                             │
│        │ (JSON Schema)    │                             │
│        └────────┬────────┘                              │
│                 │ ✅ Passa                               │
│                 ▼                                        │
│        ┌─────────────────┐                              │
│        │  npm run build   │                             │
│        │  (tools/build.js)│                             │
│        └────────┬────────┘                              │
│                 │                                        │
│                 ▼                                        │
│             dist/                                        │
│    ├── index.html                                        │
│    ├── produto/geladeira/brm44hb/index.html             │
│    ├── categoria/geladeira/index.html                   │
│    ├── comparar/brm44hb-vs-tf55/index.html             │
│    ├── sitemap.xml                                       │
│    └── robots.txt                                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                      CI/CD                               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   git push origin main                                   │
│          │                                               │
│          ▼                                               │
│   GitHub Actions (.github/workflows/ci.yml)             │
│   ├── npm ci                                             │
│   ├── npm run validate                                   │
│   ├── npm run build                                      │
│   ├── npm run smoke-test                                 │
│   └── curl Coolify webhook ──┐                          │
│                               │                          │
└───────────────────────────────┼──────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────┐
│                     PRODUÇÃO                             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   Coolify (Docker)                                       │
│   ├── git pull                                           │
│   ├── npm run build                                      │
│   └── nginx serve dist/                                  │
│                    │                                     │
│                    ▼                                     │
│         Cloudflare (CDN + DNS)                          │
│                    │                                     │
│                    ▼                                     │
│        https://comparatop.com.br                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Regras de Negócio

### Afiliados

1. **Disclosure obrigatório** antes das ofertas
2. **Amazon:** SEM histórico de preço, SEM alertas
3. **Outras lojas:** Pode ter histórico e alertas
4. **LGPD:** Alertas requerem double opt-in

### SEO

1. **Conteúdo no HTML:** View source mostra dados
2. **Canonical única:** Sem duplicação de URLs
3. **Redirects:** 301 para migrações
4. **IA bots:** ClaudeBot allow, GPTBot disallow

### Scoring

1. **Editorial:** Notas 0-10 por tópico
2. **Pesos:** Definidos por categoria em `categories.yml`
3. **Fontes:** Sempre rastreáveis e documentadas

## Troubleshooting

### Build falha

```bash
# Verificar erros de validação
npm run validate

# Ver output detalhado
DEBUG=* npm run build
```

### 404 em produção

```bash
# Verificar se página existe em dist/
ls dist/produto/geladeira/brm44hb/

# Verificar nginx logs (via Coolify)
docker logs <container_id>
```

### Deploy não atualiza

1. Verificar webhook no GitHub → Settings → Webhooks
2. Verificar logs do Coolify
3. Purge cache Cloudflare

## Contatos

- **Repo:** github.com/adrianoapsant-cloud/comparatop-site
- **Prod:** https://comparatop.com.br
- **Painel:** Coolify (VPS Vultr)
