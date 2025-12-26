# 📊 Guia de Validação GA4 Events

## Pré-requisitos

1. **ID GA4 configurado** em `js/analytics.js`:
```javascript
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Substituir pelo seu ID real
```

2. **Scripts carregados** no `index.html` (antes de `</body>`):
```html
<!-- GA4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
</script>

<!-- Analytics Module -->
<script src="/js/analytics.js"></script>
<script src="/js/analytics-events.js"></script>
```

---

## Eventos Implementados

| Evento | Trigger | Parâmetros |
|--------|---------|------------|
| `cta_offer_click` | Clique em "Ver Oferta" | productId, retailer, price, position, pageType |
| `compare_add` | Adicionar à comparação | productId |
| `compare_view` | Abrir modal de comparação | product_ids, product_count |
| `email_submit` | Enviar email (newsletter) | context |
| `scroll_depth` | Scroll 25/50/75/90% | percent, page_path |
| `page_view` | Navegação entre páginas | page_path, page_title |

---

## Como Testar no GA4 DebugView

### 1. Ativar Debug Mode

Adicione ao final da URL do site: `?gtm_debug=1`

Ou no console do Chrome:
```javascript
gtag('config', 'G-XXXXXXXXXX', { debug_mode: true });
```

### 2. Abra o GA4 DebugView

1. Acesse [analytics.google.com](https://analytics.google.com)
2. Vá em **Admin** → **DebugView**
3. Mantenha a janela aberta enquanto testa

### 3. Executar Testes

**Teste 1: cta_offer_click**
```
1. Navegue para /produto/geladeira/brm44hb/
2. Clique em "Ver Oferta" de qualquer varejista
3. No DebugView, verifique evento "cta_offer_click" com params:
   - product_id: brm44hb
   - retailer: Amazon (ou outro)
   - price: 3199 (ou valor atual)
   - position: 1
   - page_type: product
```

**Teste 2: compare_add**
```
1. Na página do produto, clique em "Comparar"
2. No DebugView, verifique evento "compare_add" com:
   - product_id: brm44hb
```

**Teste 3: compare_view**
```
1. Adicione 2 produtos à comparação
2. Clique no botão da barra de comparação
3. No DebugView, verifique evento "compare_view" com:
   - product_ids: brm44hb,tf55
   - product_count: 2
```

**Teste 4: scroll_depth**
```
1. Role a página para baixo (25%, 50%, 75%, 90%)
2. No DebugView, verifique eventos "scroll_depth" com:
   - percent: 25, 50, 75, 90
   - page_path: /produto/geladeira/brm44hb/
```

---

## Integração Manual (via data attributes)

Para elementos que não estão no template, adicione:

```html
<!-- Link de oferta -->
<a href="https://amzn.to/xxx" 
   data-track-offer 
   data-product-id="brm44hb"
   data-retailer="Amazon"
   data-price="3199"
   data-position="1">
   Ver Oferta
</a>

<!-- Botão de comparar -->
<button 
   data-track-compare-add 
   data-product-id="brm44hb">
   Comparar
</button>
```

---

## Integração Programática

```javascript
// Oferta clicada
GA4Track.offerClick('brm44hb', 'Amazon', 3199.00, 1);

// Produto adicionado à comparação
GA4Track.compareAdd('brm44hb');

// Email enviado
GA4Track.emailSubmit('newsletter');

// Ou diretamente via Analytics
Analytics.trackOfferClick('brm44hb', 'Amazon', 3199.00, 1, 'product');
Analytics.trackCompareAdd('brm44hb');
Analytics.trackCompareView(['brm44hb', 'tf55']);
Analytics.trackEmailSubmit('price_alert');
```

---

## Checklist de Validação

| Evento | Status |
|--------|--------|
| cta_offer_click aparece no DebugView | ⬜ |
| compare_add aparece no DebugView | ⬜ |
| compare_view aparece no DebugView | ⬜ |
| scroll_depth (25/50/75/90) | ⬜ |
| page_view em navegação | ⬜ |

---

## Prints para Anexar ao Relatório

1. Screenshot do DebugView mostrando `cta_offer_click`
2. Screenshot do DebugView mostrando `compare_view`
3. Screenshot do Realtime Events mostrando eventos chegando

---

*Guia criado em 24/12/2025*
