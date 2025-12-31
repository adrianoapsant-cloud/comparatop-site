# ComparaTop - Contexto do Projeto

## 📍 Localização dos Arquivos
```
C:\Users\Adriano Antonio\Desktop\backup\
├── template.html          # Template principal do site
├── manifest.json          # PWA manifest
├── sw.js                  # Service Worker
├── tools/                 # Scripts de build e geração
│   ├── build.js           # ⭐ Script principal de build estático
│   ├── minify.js          # Minificação CSS/JS
│   ├── preflight-check.js # ⭐ Validação pré-build (escalabilidade)
│   ├── generate-og-images.js      # Gerador de OG images
│   ├── generate-infographics.js   # Gerador de infográficos comparativos
│   └── optimize-images.js         # Conversão WebP
├── data/catalogs/
│   └── *.json             # Catálogos de produtos (auto-detectados)
├── js/main.js             # JavaScript principal
├── css/main.css           # Estilos principais
├── dist/                  # Arquivos gerados (deploy)
└── assets/icons/          # Ícones PWA
```

## 🔧 Ferramentas e Infraestrutura

### Deploy
- **Plataforma**: Netlify
- **URL Produção**: https://majestic-biscuit-69e50b.netlify.app/
- **Deploy**: Automático via GitHub push
- **Repo**: https://github.com/adrianoapsant-cloud/comparatop-site.git

### Comandos de Build
```bash
cd "C:\Users\Adriano Antonio\Desktop\backup"

# Verificação pré-build (SEMPRE RODAR PRIMEIRO!)
node tools/preflight-check.js

# Build completo
node tools/build.js
node tools/minify.js
node tools/generate-og-images.js
node tools/generate-infographics.js

# Deploy
git add -A && git commit -m "mensagem" && git push origin main
```

## ✅ Funcionalidades Implementadas

### Fase A: SEO Schema ✅
- [x] FAQPage Schema (por categoria)
- [x] HowTo Schema (função pronta)
- [x] Product Schema com Review

### Fase B: Engagement ✅
- [x] Newsletter inteligente (30s + exit-intent)
- [x] WhatsApp removido (não faz sentido para comparador)

### Fase C: Performance ✅
- [x] Preconnect hints
- [x] PWA (manifest + service worker)
- [x] Scripts com defer

### Imagens e Feeds ✅
- [x] Google Images Sitemap
- [x] Pinterest/Google/Facebook/Bing feeds
- [x] OG images automáticos
- [x] Infográficos comparativos

## 🔄 ESCALABILIDADE - IMPORTANTE!

### O que É Escalável (Funciona para QUALQUER categoria)
- ✅ `loadCatalogs()` - detecta TODOS os arquivos em `data/catalogs/`
- ✅ Geração de páginas de produto
- ✅ Geração de páginas de comparação
- ✅ FAQ Schema (se category.faq existir no JSON)
- ✅ Sitemap com imagens
- ✅ Feeds de produtos
- ✅ OG images
- ✅ Infográficos

### O que PRECISA de Ajuste ao Adicionar Categorias
⚠️ **build.js (linhas 1387, 1518, 1720-1760)**:
- `google_product_category` hardcoded para "Geladeiras"
- Navegação do sidebar com lista de produtos

⚠️ **main.js (várias linhas)**:
- Referências hardcoded a "geladeira" na navegação
- URL patterns `/produto/geladeira/`

### Para Adicionar Nova Categoria CORRETAMENTE:
1. Criar `data/catalogs/[slug].json` seguindo estrutura de geladeira.json
2. Garantir campos: `category.slug`, `category.name`, `category.canonicalPath`, `category.faq`
3. Rodar `node tools/preflight-check.js` para validar
4. Atualizar `google_product_category` em build.js se diferente
5. Adicionar navegação no template.html (sidebar)
6. Build e deploy

### Pre-Flight Check
**SEMPRE rodar antes de build para novas categorias:**
```bash
node tools/preflight-check.js
```
Detecta:
- Catálogos com campos faltando
- Produtos sem dados obrigatórios
- Referências hardcoded que podem quebrar

## 📋 Decisões de UX

### Newsletter
- Aparece após 30s OU exit-intent
- Copy: "O preço baixou? A gente te avisa"
- Lembra se já viu (localStorage)

### WhatsApp Removido
Site comparador ≠ loja. Evita confusão de suporte.

## 🔑 Configurações
- `baseUrl`: em `tools/build.js`
- Cores: #1e3a8a (azul escuro), #3b82f6 (azul claro)
