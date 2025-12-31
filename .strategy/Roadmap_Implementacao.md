# 🚀 Plano Mestre de Implementação - ComparaTop

## Visão Geral
Transformar o ComparaTop de um comparador técnico em um **Motor de Decisão de Compra** escalável para 50+ categorias.

---

## Sprint 1: Fundação Visual (UX Crítica)
> **Objetivo:** Corrigir problemas que quebram credibilidade e conversão

### 1.1 Sanitização de Dados
- [ ] Substituir "N/A", "undefined", "?/10" por "—" ou ocultar linha
- [ ] Fallback para campos vazios em todas as páginas
- [ ] Testar em páginas de produto e comparação

### 1.2 Tabela de Comparação - Mobile UX
- [ ] **Sticky Bottom Bar**: Barra fixa no rodapé com "X produtos selecionados" + botão "Comparar"
- [ ] **Sticky Header**: Cabeçalho fixo com nome/foto dos produtos ao rolar
- [ ] **Highlight de Vencedor**: Célula verde claro para quem vence cada spec
- [ ] **Toggle "Mostrar Diferenças"**: Ocultar linhas idênticas

### 1.3 Página de Produto - Hierarquia
- [ ] Mover bloco Preço + CTA para logo após fotos (acima da dobra)
- [ ] Adicionar Nota ComparaTop (gauge 0-10) no topo
- [ ] Sticky Footer CTA no mobile (miniatura + preço + botão)

---

## Sprint 2: Monetização Básica
> **Objetivo:** Permitir que cliques gerem comissão

### 2.1 Link Master (Amazon)
- [ ] Adicionar campo `asin` no JSON de produtos
- [ ] Configurar `amazonTag` global no build.js
- [ ] Gerar links automaticamente: `amazon.com.br/dp/{asin}?tag={tag}`
- [ ] Fallback: Se sem ASIN, mostrar "Ver na Loja"

### 2.2 Preço Inteligente (Fase Cold Start)
- [ ] Se campo `price` vazio/desatualizado → ocultar valor R$
- [ ] Mostrar apenas botão "Ver Preço Atual na Amazon"
- [ ] Adicionar texto "Atualizado em: {data}" quando tiver preço

### 2.3 Disclaimer Legal
- [ ] Adicionar no footer: "Como Associado da Amazon, ganho por compras qualificadas"
- [ ] Verificar se já tem política de cookies (LGPD)

---

## Sprint 2.5: Infraestrutura & Segurança
> **Objetivo:** Proteger o site de scrapers sem bloquear IAs benéficas

### 2.5.1 Cloudflare DNS
- [ ] Configurar DNS do domínio via Cloudflare (plano gratuito)
- [ ] Ativar "Bot Fight Mode" para bloquear bots maliciosos
- [ ] Criar regras WAF para PERMITIR: GPTBot, Googlebot, Bingbot, CCBot
- [ ] Bloquear tráfego suspeito de países sem atuação

### 2.5.2 Headers de Segurança
- [ ] Adicionar X-Robots-Tag permitindo crawlers
- [ ] Verificar robots.txt está acessível e completo

---

## Sprint 3: Sistema de Scores (Diferenciação)
> **Objetivo:** Implementar QS, VS, GS do Projeto Fênix

### 3.1 QS - Quality Score (Nota ComparaTop)
- [ ] Fórmula: `0.30*reviews + 0.40*reclamações + 0.30*specs`
- [ ] Escala 0-10 (não 0-5 para evitar efeito "tudo é 4.5")
- [ ] Exibir gauge visual na página de produto
- [ ] Tooltip explicando componentes da nota

### 3.2 VS - Value Score (Oportunidade)
- [ ] Calcular média de preço por categoria
- [ ] Se produto < média → selo "Excelente Oportunidade"
- [ ] Se produto = média → selo "Preço Justo"
- [ ] Se produto > média → sem selo (não destacar negativo)

### 3.3 Rankings Dinâmicos
- [ ] Página de categoria ordenada por QS
- [ ] Checkbox "Comparar" em cada card
- [ ] Barra flutuante ao selecionar 2+ produtos

---

## Sprint 4: Navegação e Busca
> **Objetivo:** Escalar para 50 categorias sem quebrar UX

### 4.1 Menu Superior
- [ ] Trocar ícones por "Pílulas" com texto
- [ ] Mostrar top 5-6 categorias visíveis
- [ ] Último item: "Ver Todas +" (abre menu lateral)

### 4.2 Menu Lateral (Hamburger)
- [ ] Agrupar por Pai → Filhos (ex: Cozinha → Geladeira, Fogão)
- [ ] Accordion expansível
- [ ] Contador de produtos por categoria

### 4.3 Busca Avançada (Faceted Search)
- [ ] Filtros laterais dinâmicos baseados nas tags do JSON
- [ ] Fuzzy search (tolera erros de digitação)
- [ ] Autocomplete com categorias populares

---

## Sprint 5: Quiz e Ferramentas Interativas
> **Objetivo:** Capturar leads e criar diferencial competitivo

### 5.1 Quiz Recomendador (Home)
- [ ] Hero Section: "Encontre o produto ideal em 1 minuto"
- [ ] Dropdown de categoria + botão "Iniciar"
- [ ] Modal fullscreen com perguntas
- [ ] Resultado: Top 3 produtos + captura de email (opcional)

### 5.2 Ferramentas por Categoria
- [ ] Calculadora de Consumo (Geladeira, Ar)
- [ ] Verificador de Espaço/Nicho
- [ ] Checklist de Capacidade (Cabe pizza? Cabe barril?)

### 5.3 Páginas de Ferramentas (SEO)
- [ ] URLs dedicadas: `/ferramentas/calculadora-btus-ar-condicionado`
- [ ] Motor Universal reutilizável
- [ ] Cross-link para produtos relevantes

---

## Sprint 6: Conteúdo e SEO Avançado
> **Objetivo:** Capturar tráfego de cauda longa

### 6.1 Guias Dinâmicos (Wiki)
- [ ] Pasta `/content/*.md` com Markdown
- [ ] Shortcodes: `{{top_3_geladeiras_economicas}}`
- [ ] Build gera HTML com produtos atualizados

### 6.2 Páginas Sazonais
- [ ] `/black-friday/geladeiras` (dormindo o ano todo)
- [ ] Top Bar de destaque em novembro/dezembro
- [ ] Conteúdo: "Melhores ofertas de hoje"

### 6.3 Páginas de Presentes (GS)
- [ ] `/presentes/ate-200`
- [ ] `/presentes/para-mae`
- [ ] Toggle "Modo Presente" nas listas
- [ ] Bloco "Por que é presente fácil" (3 bullets)

### 6.4 Schema Markup & Rich Snippets (IA Friendly)
- [ ] JSON-LD dinâmico em páginas de produto: `Product`, `Offer`, `AggregateRating`
- [ ] JSON-LD em páginas de comparação: `ItemList`
- [ ] JSON-LD em guias/wiki: `FAQPage`, `HowTo`
- [ ] Validar com Google Rich Results Test
- [ ] Testar leitura por ChatGPT/Perplexity

### 6.5 Shopping Feeds (Tráfego Orgânico)
- [ ] Script que gera XML diário (padrão Google Merchant Center)
- [ ] Campos: title, price, availability, image_link, link
- [ ] Subir no Google Merchant Center
- [ ] Integrar com Pinterest Catalogs
- [ ] Automatizar rebuild diário

---

## Sprint 7: Automação e Alertas
> **Objetivo:** Construir ativo de email e automatizar preços

### 7.1 Sistema de Alertas de Preço
- [ ] Modal "Avise-me quando baixar" com campo de email + preço alvo
- [ ] Salvar em banco simples (Supabase/Firebase)
- [ ] Script diário verifica preços e dispara email

### 7.2 Régua de Email (Automação)
- [ ] Dia 0: Resultado do quiz/ferramenta
- [ ] Dia 2: Conteúdo educativo
- [ ] Dia 5: Alerta se preço caiu
- [ ] Dia 15: Cross-sell

### 7.3 Amazon PA-API (Após 3 vendas)
- [ ] Script cron 1x/dia atualiza preços no JSON
- [ ] Fallback se API falhar
- [ ] Log de última atualização

---

## ⚠️ Guardrails (NÃO FAZER)

| ❌ Feature | Motivo |
|-----------|--------|
| Gráfico de histórico de preços | Amazon proíbe armazenar/exibir preços antigos |
| Comentários nativos | Spam + moderação impossível |
| Contadores falsos ("14 pessoas vendo") | Dark Pattern, perde credibilidade |
| Editor visual WYSIWYG | Quebra consistência do design em escala |
| Notificação "avise quando baixar" (push) | Complexo demais para o momento |

---

## 📊 Métricas de Sucesso

| Sprint | KPI |
|--------|-----|
| 1 | Zero "undefined" visível, bounce rate mobile < 60% |
| 2 | Primeiro clique com tag de afiliado rastreado |
| 3 | Nota ComparaTop exibida em 100% dos produtos |
| 4 | Busca com 0 resultados < 5% |
| 5 | Taxa de conclusão do quiz > 40% |
| 6 | Páginas /presentes indexadas no Google |
| 7 | 100+ emails capturados/mês |

---

## ⏱️ Estimativa de Tempo

| Sprint | Complexidade | Tempo Estimado |
|--------|--------------|----------------|
| 1 | Média | 2-3 sessões |
| 2 | Baixa | 1-2 sessões |
| 2.5 | Baixa | 1 sessão |
| 3 | Alta | 3-4 sessões |
| 4 | Média | 2-3 sessões |
| 5 | Alta | 4-5 sessões |
| 6 | Média-Alta | 3-4 sessões |
| 7 | Alta | 3-4 sessões |

**Total estimado:** 17-24 sessões de trabalho

---

## ✅ Próximo Passo

**Começar pelo Sprint 1.1 - Sanitização de Dados**

Isso é rápido, elimina problemas de credibilidade e prepara a base para os próximos sprints.
