# 🔴 DISCUSSÃO TÉCNICA: CSR vs SSR/SSG para ComparaTop

**Data:** 2025-12-24  
**Contexto:** Site de comparação de produtos com links de afiliados  
**Stack Atual:** HTML/CSS/JS puro (SPA com client-side rendering)

---

## 📋 SITUAÇÃO ATUAL

### O que já foi implementado:
- ✅ Rotas SEO-friendly via History API (`/produto/geladeira/brm44hb`)
- ✅ Meta tags dinâmicas (title, description, canonical, OpenGraph)
- ✅ Schema.org JSON-LD injetado via JavaScript
- ✅ Sitemap.xml com URLs corretas
- ✅ nginx.conf com SPA fallback (`try_files $uri $uri/ /index.html`)
- ✅ GA4 com eventos de conversão
- ✅ CSS responsivo (1024/768/480px)
- ✅ Páginas legais (privacidade, termos)

### O problema crítico identificado:

O site usa **Client-Side Rendering (CSR)**. Quando um bot (Googlebot, Facebook crawler, ou `curl`) acessa qualquer rota:

```
Request: GET /produto/geladeira/brm44hb
Response: index.html (HTML vazio, sem conteúdo)
         ↓
         JavaScript executa e preenche o conteúdo
         ↓
         Problema: Bots que não executam JS veem página vazia
```

### Prova técnica (simulação):

```bash
curl -sL https://comparatop.com.br/produto/geladeira/brm44hb | head -n 50
```

**Resultado esperado (atualmente):**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <title>ComparaTop - Compare antes de comprar</title>
    <meta name="description" content="Compare eletrodomésticos...">
    <!-- Metas genéricas, não do produto -->
</head>
<body>
    <div class="app-layout">
        <!-- Conteúdo vazio, preenchido via JS -->
    </div>
    <script src="/js/router.js"></script>
    ...
</body>
</html>
```

**O que DEVERIA aparecer para SEO:**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <title>Brastemp BRM44HB 375L - Review e Preços | ComparaTop</title>
    <meta name="description" content="Análise completa da geladeira Brastemp BRM44HB...">
    <meta property="og:title" content="Brastemp BRM44HB 375L...">
    <script type="application/ld+json">{"@type":"Product",...}</script>
</head>
<body>
    <h1>Brastemp BRM44HB 375L Frost Free</h1>
    <p>Capacidade: 375L, Consumo: 41 kWh/mês...</p>
    <!-- Conteúdo visível SEM JavaScript -->
</body>
</html>
```

---

## 🎯 REQUISITOS DOS REVISORES (P0)

1. **Curl e view-source** devem mostrar:
   - H1 preenchido com nome do produto
   - Texto principal (specs, descrição)
   - JSON-LD completo no HTML inicial
   - OG tags específicas do produto

2. **Rotas inexistentes** devem retornar **HTTP 404 real** (não 200 com index.html)

3. **Comparações** devem ser páginas indexáveis (`/comparar/brm44hb-vs-tf55.html`)

---

## 🔧 OPÇÕES DE SOLUÇÃO

### Opção 1: Static Pre-rendering (Build-time)

**Descrição:** Criar um script Node.js que lê o JSON de produtos e gera arquivos `.html` estáticos para cada rota no momento do build.

**Estrutura resultante:**
```
/var/www/comparatop/
├── index.html              (home estática)
├── produto/
│   └── geladeira/
│       ├── brm44hb.html    (página do produto)
│       └── tf55.html
├── comparar/
│   └── brm44hb-vs-tf55.html
├── categoria/
│   └── geladeira.html
```

**Prós:**
- Não requer framework novo
- Performance máxima (HTML estático)
- Fácil de hospedar (qualquer servidor)
- Pode manter o JS atual para interatividade

**Contras:**
- Precisa re-buildar quando dados mudam
- Script de build adicional a manter
- Não é dinâmico (se preço muda, precisa rebuild)

**Esforço estimado:** Médio (1-2 dias)

---

### Opção 2: Migrar para Next.js (App Router)

**Descrição:** Refatorar o projeto para Next.js com Static Site Generation (SSG) ou Incremental Static Regeneration (ISR).

**Prós:**
- SSG/ISR nativo
- Pode atualizar páginas sem full rebuild (ISR)
- Ecossistema maduro
- Roteamento automático
- Pode usar o mesmo CSS

**Contras:**
- Refatoração significativa
- Curva de aprendizado (React/Next)
- Hosting mais complexo (Node.js server ou Vercel)
- Mais dependências

**Esforço estimado:** Alto (3-5 dias)

---

### Opção 3: Migrar para Astro

**Descrição:** Usar Astro que compila para HTML estático por padrão, com "islands" de JS onde necessário.

**Prós:**
- Zero JavaScript por padrão (melhor performance)
- Pode usar componentes de qualquer framework
- SSG nativo
- Mais simples que Next.js para sites estáticos

**Contras:**
- Framework novo para aprender
- Refatoração necessária
- Ecossistema menor que Next.js

**Esforço estimado:** Alto (3-4 dias)

---

### Opção 4: Pre-render Service (Prerender.io / Rendertron)

**Descrição:** Manter SPA atual e usar um serviço de pré-renderização que detecta bots e serve HTML renderizado.

**Prós:**
- Sem mudança no código atual
- Funciona imediatamente

**Contras:**
- Custo mensal ($20-100/mês)
- Latência adicional para bots
- Dependência de serviço terceiro
- Não resolve 404 real

**Esforço estimado:** Baixo (algumas horas de config)

---

## 📊 COMPARATIVO

| Critério | Pre-render Script | Next.js | Astro | Prerender.io |
|----------|-------------------|---------|-------|--------------|
| Sem refatoração | ⚠️ Parcial | ❌ | ❌ | ✅ |
| Performance | ✅ Máxima | ✅ Boa | ✅ Máxima | ⚠️ Média |
| Custo de hosting | ✅ Zero | ⚠️ Node | ✅ Zero | ❌ Pago |
| Manutenção | ⚠️ Script build | ✅ Integrado | ✅ Integrado | ❌ Externo |
| 404 real | ✅ Fácil | ✅ Nativo | ✅ Nativo | ❌ Difícil |
| Esforço | 🟡 Médio | 🔴 Alto | 🔴 Alto | 🟢 Baixo |

---

## 📁 CONTEXTO ADICIONAL

### Estrutura de dados atual:
```
/data/catalogs/geladeira.json
├── category: { name, slug }
├── products: {
│     "brm44hb": { name, brand, specs, editorialScores, offers, voc }
│     "tf55": { ... }
│   }
```

### Volume atual:
- 1 categoria (geladeiras)
- 2 produtos
- Previsão: 5-10 categorias, 50-100 produtos em 2026

### Hosting planejado:
- VPS com nginx
- Sem Node.js server atualmente
- SSL via Let's Encrypt

---

## ❓ PERGUNTAS PARA DISCUSSÃO

1. **Qual solução vocês recomendam** considerando o tamanho atual do projeto e crescimento planejado?

2. **Static Pre-rendering é suficiente** para um site com ~100 produtos? Ou seria melhor investir em um framework desde já?

3. **Existem outras soluções** que não consideramos?

4. **Sobre 404 real:** No contexto de SPA com pre-rendering, qual a melhor forma de implementar?

5. **Re-build automático:** Se optarmos por static pre-render, qual a melhor estratégia para rebuildar quando preços mudam (webhook, cron, manual)?

---

## 🎯 DECISÃO ESPERADA

Preciso de uma recomendação clara sobre qual caminho seguir, considerando:
- Menor tempo de implementação
- Menor custo de manutenção
- Escalabilidade para 2026
- SEO efetivo (bots veem conteúdo)

---

*Aguardo input para prosseguir com a implementação.*
