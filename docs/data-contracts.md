# ComparaTop - Contratos de Dados

> **Versão:** 2.0.0  
> **Atualizado:** 2025-12-25

Este documento define os schemas e contratos de dados do ComparaTop.

## Schemas

Os schemas formais estão em `/schemas/`:

- `product.schema.json` - Produto
- `category.schema.json` - Categoria
- `catalog.schema.json` - Catálogo completo

## Product

### Campos Obrigatórios

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | Slug único (ex: `brm44hb`) |
| `name` | string | Nome completo |
| `brand` | string | Marca |
| `model` | string | Modelo |

### Campos Opcionais

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `imageUrl` | string (URI) | URL da imagem |
| `imageKeys` | object | Chaves para CDN |
| `specs` | object | Especificações técnicas |
| `offers` | array | Lista de ofertas |
| `editorialScores` | object | Notas editoriais |
| `thirdPartyRatings` | array | Avaliações externas |
| `voc` | object | Voice of Customer |
| `faq` | array | Perguntas frequentes |

### Exemplo Completo

```json
{
  "id": "brm44hb",
  "name": "Geladeira Brastemp BRM44HB Frost Free 375L",
  "brand": "Brastemp",
  "model": "BRM44HB",
  "imageUrl": "/assets/products/brm44hb-hero.webp",
  "imageKeys": {
    "hero": "products/geladeira/brm44hb/hero.webp",
    "thumb": "products/geladeira/brm44hb/thumb.webp"
  },
  "specs": {
    "capacidade_total": 375,
    "capacidade_freezer": 100,
    "consumo_kwh": 35.8,
    "selo_procel": "A",
    "frost_free": true,
    "inverse": false,
    "altura_cm": 169,
    "largura_cm": 63,
    "profundidade_cm": 69,
    "peso_kg": 63,
    "voltagem": "220V",
    "garantia_meses": 12,
    "cor": "Inox"
  },
  "offers": [
    {
      "retailer": "amazon",
      "price": 2899.00,
      "priceOriginal": 3299.00,
      "url": "https://www.amazon.com.br/dp/B08XYZ123?tag=comparatop-20",
      "productId": "B08XYZ123",
      "installments": "10x R$ 289,90",
      "inStock": true,
      "lastChecked": "2025-12-25T10:00:00Z"
    },
    {
      "retailer": "magalu",
      "price": 2799.00,
      "url": "https://www.magazineluiza.com.br/geladeira-brastemp/p/abc123",
      "productId": "abc123"
    }
  ],
  "editorialScores": {
    "overall": 8.5,
    "topics": {
      "eficiencia_energetica": {
        "score": 9.0,
        "note": "Selo A com consumo abaixo da média"
      },
      "capacidade_interna": {
        "score": 8.0,
        "note": "375L atende famílias de 3-4 pessoas"
      },
      "qualidade_construcao": {
        "score": 8.5,
        "note": "Acabamento inox de qualidade"
      }
    },
    "lastUpdated": "2025-12-23"
  },
  "thirdPartyRatings": [
    {
      "source": "Amazon",
      "sourceUrl": "https://amazon.com.br/dp/B08XYZ123",
      "rating": 4.6,
      "maxRating": 5,
      "reviewCount": 1250,
      "lastUpdated": "2025-12-20"
    }
  ],
  "voc": {
    "oneLiner": "Geladeira silenciosa e econômica para famílias médias",
    "thirtySecondSummary": "A BRM44HB é elogiada pela eficiência energética e nível de ruído baixo. Principal crítica: alguns usuários relatam condensação na porta.",
    "pros": [
      {
        "topic": "Consumo",
        "detail": "Selo A gasta em média R$ 30/mês de energia"
      },
      {
        "topic": "Silenciosa",
        "detail": "Muitos reviews destacam o baixo ruído"
      }
    ],
    "cons": [
      {
        "topic": "Condensação",
        "detail": "Relatos de gotas na porta em dias úmidos"
      }
    ],
    "dataSources": [
      {
        "name": "Amazon Reviews",
        "url": "https://amazon.com.br/dp/B08XYZ123#reviews",
        "sampleSize": 500
      }
    ]
  }
}
```

## Category

### Campos Obrigatórios

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | ID único (ex: `geladeira`) |
| `name` | string | Nome singular |
| `slug` | string | Slug para URLs |

### Exemplo

```json
{
  "id": "geladeira",
  "name": "Geladeiras",
  "namePlural": "Geladeiras",
  "slug": "geladeira",
  "canonicalPath": "/geladeiras/",
  "icon": "❄️",
  "enabled": true,
  "description": "Compare as melhores geladeiras do Brasil.",
  "importantSpecs": [
    "capacidade_total",
    "consumo_kwh",
    "selo_procel"
  ],
  "editorialTopics": [
    {
      "id": "eficiencia_energetica",
      "label": "Eficiência Energética",
      "weight": 0.20,
      "description": "Consumo mensal e selo Procel"
    }
  ]
}
```

## Offer

### Campos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `retailer` | string | Sim* | ID da loja |
| `price` | number | Sim | Preço em BRL |
| `priceOriginal` | number | Não | Preço antes desconto |
| `url` | string | Não | URL do produto |
| `productId` | string | Não | ID na loja |
| `installments` | string | Não | Parcelamento |
| `inStock` | boolean | Não | Disponível |
| `lastChecked` | datetime | Não | Última verificação |

*Aceita `retailer`, `retailerId`, `retailerName` ou `store`

### Retailer IDs Válidos

Definidos em `config/affiliates.yml`:

- `amazon`
- `mercado_livre`
- `magalu`
- `shopee`
- `casas_bahia`
- `americanas`

## Catalog

Arquivo JSON por categoria (`data/catalogs/{slug}.json`):

```json
{
  "category": {
    "id": "geladeira",
    "name": "Geladeiras",
    "slug": "geladeira",
    ...
  },
  "products": {
    "brm44hb": { ... },
    "tf55": { ... }
  },
  "meta": {
    "version": "2.0.0",
    "lastUpdated": "2025-12-25",
    "productCount": 2
  }
}
```

## Regras de Slug/Canonical

### Slugs

- Apenas `a-z`, `0-9`, `-`
- Mínimo 2, máximo 80 caracteres
- Sem espaços, acentos ou caracteres especiais
- Lowercase sempre

### Conversão

```
"Geladeira Brastemp BRM44HB" → "brm44hb"
"Ar-Condicionado Split 12000" → "ar-condicionado-split-12000"
```

### Canonical URLs

| Tipo | Padrão |
|------|--------|
| Home | `https://comparatop.com.br/` |
| Categoria | `https://comparatop.com.br/geladeiras/` |
| Produto | `https://comparatop.com.br/produto/geladeira/brm44hb/` |
| Comparação | `https://comparatop.com.br/comparar/brm44hb-vs-tf55/` |

**Regras:**
- Sempre trailing slash
- Sempre HTTPS
- Sem www
- Sem parâmetros de tracking na canonical

## Validação

### Comando

```bash
npm run validate
```

### Output Esperado

```
🔍 ComparaTop - Validação de Dados

=== Validando schemas ===
✅ product.schema.json válido
✅ category.schema.json válido
✅ catalog.schema.json válido

=== Validando catálogos ===
✅ geladeira.json: 2 produtos válidos

=== RESUMO ===
Catálogos: 1
Produtos: 2
Erros: 0

🟢 APROVADO
```

### Erros Comuns

```
❌ products.brm44hb.specs.capacidade_total: deve ser number
   Recebido: "375L" (string)
   Esperado: 375 (number)

❌ products.tf55.offers[0].price: deve ser > 0
   Recebido: 0
```

## Migrações

### Adicionar campo novo

1. Adicionar ao schema com `default` ou como opcional
2. Atualizar catálogos existentes
3. Validar: `npm run validate`

### Remover campo

1. Remover do(s) catálogo(s)
2. Remover do schema
3. Validar e fazer build

### Renomear campo

1. Adicionar campo novo (manter antigo como deprecated)
2. Migrar dados
3. Remover campo antigo
4. Atualizar schema
