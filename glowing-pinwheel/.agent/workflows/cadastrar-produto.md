---
description: Como cadastrar um novo produto no ComparaTop
---

# Cadastro de Novo Produto

## 🚨 REGRA #1: NUNCA COPIE DE OUTRA CATEGORIA

> [!CAUTION]
> **NÃO copie estrutura de produtos de outras categorias!**
> Cada categoria tem seus próprios 10 Dores com pesos diferentes.
> Copiar causa "vazamento" de critérios errados.

---

## ✅ PROCESSO CORRETO (Preventivo)

### Passo 1: Gerar Template da Categoria

Antes de qualquer coisa, gere o template com critérios corretos:

```typescript
import { generateProductTemplate } from '@/lib/product-template-generator';

// Gera template com os 10 Dores CORRETOS para a categoria
const template = generateProductTemplate('smartphone', 'samsung-galaxy-a56-5g');
console.log(template);
```

Ou consulte os critérios em:
```
src/lib/product-template-generator.ts → CATEGORY_CRITERIA
```

### Passo 2: Preencher o Template

Use o template gerado (que já tem os critérios certos) e preencha os valores.

---

## 🎯 REFERÊNCIA GOLD-STANDARD: Roborock Q7 L5

> [!IMPORTANT]
> Use **sempre** o cadastro do Roborock Q7 L5 como referência de **ESTRUTURA**:
> - `src/data/products.ts` → linhas 1165-1324
> - `src/data/mocks/roborock-q7-l5.json` → estrutura completa do JSON
> 
> Mas use os **CRITÉRIOS** específicos da categoria do seu produto!

---

## Divisão de Responsabilidades

| Quem | O que faz |
|------|-----------|
| **Assistente** | Estrutura + Dados factuais (specs, preço, ASIN) |
| **Gemini API** | Conteúdo editorial (se chamado via API) |
| **Geradores Automáticos** | Fallback para seções quando JSON mock não existe |

---

## 1. Estrutura Obrigatória (products.ts)

Campos **OBRIGATÓRIOS** baseados no Roborock Q7 L5:

```typescript
{
    // === IDENTIFICAÇÃO ===
    id: 'marca-modelo',           // lowercase, sem caracteres especiais
    categoryId: 'categoria',      // tv, fridge, robot-vacuum, smartphone, etc.
    name: 'Nome completo',
    shortName: 'Nome curto',
    brand: 'Marca',
    model: 'Modelo',
    price: 0000,
    asin: 'B0XXXXXXXX',           // OBRIGATÓRIO para afiliado
    imageUrl: '/images/products/nome.svg',
    status: 'published',
    benefitSubtitle: 'Frase de impacto sobre o produto',

    // === SCORES C1-C10 ===
    scores: {
        c1: 0.0,  // Ver critérios da categoria
        c2: 0.0,
        c3: 0.0,
        c4: 0.0,
        c5: 0.0,
        c6: 0.0,
        c7: 0.0,
        c8: 0.0,
        c9: 0.0,
        c10: 0.0,
    },

    // === SPECS PARA SIMULADORES ===
    specs: {
        // Campos variam por categoria - ver seção abaixo
    },

    // === SPECS TÉCNICOS DETALHADOS ===
    technicalSpecs: {
        // Campos específicos para exibição e cálculos
    },

    // === SCORE REASONS (OBRIGATÓRIO!) ===
    scoreReasons: {
        c1: 'Justificativa para nota c1',
        c2: 'Justificativa para nota c2',
        // ... todos os critérios relevantes
    },

    // === VOC - VOICE OF CUSTOMER (OBRIGATÓRIO!) ===
    voc: {
        totalReviews: 0000,
        averageRating: 4.2,
        oneLiner: 'Resumo em uma frase',
        summary: 'Resumo das avaliações em 2-3 sentenças',
        pros: ['Pro 1', 'Pro 2', 'Pro 3'],
        cons: ['Con 1', 'Con 2', 'Con 3'],
        sources: [
            { name: 'Amazon Brasil', url: 'https://...', count: 0000 },
        ],
    },

    // === PAIN POINTS SOLVED (OBRIGATÓRIO!) ===
    painPointsSolved: ['Dor 1', 'Dor 2', 'Dor 3'],

    // === FEATURE BENEFITS (OBRIGATÓRIO!) ===
    featureBenefits: [
        { icon: 'IconName', title: 'Título', description: 'Descrição' },
        // Mínimo 4 features
    ],

    // === OFFERS ===
    offers: [
        {
            store: 'Amazon',
            storeSlug: 'amazon',
            price: 0000,
            url: 'https://www.amazon.com.br/dp/ASIN',
            affiliateUrl: 'https://amzn.to/slug',
            inStock: true,
            lastChecked: 'YYYY-MM-DD',
        },
    ],

    // === MAIN COMPETITOR (OBRIGATÓRIO!) ===
    mainCompetitor: {
        id: 'produto-rival',
        name: 'Nome completo do rival',
        shortName: 'Nome curto',
        imageUrl: '/images/products/rival.svg',
        price: 0000,
        score: 0.00,
        keyDifferences: [
            { label: 'Diferença', current: 'Valor', rival: 'Valor', winner: 'current' },
            { label: 'Diferença', current: 'Valor', rival: 'Valor', winner: 'rival' },
            { label: 'Diferença', current: 'Valor', rival: 'Valor', winner: 'draw' },
        ],
    },

    // === METADATA ===
    badges: ['best-value' | 'premium-pick' | 'budget-pick'],
    lastUpdated: 'YYYY-MM-DD',
    gallery: ['/images/products/produto.svg'],
}
```

---

## 2. Specs por Categoria

### TV (`categoryId: 'tv'`)
```typescript
specs: {
    screenSize: 55,     // polegadas
    resolution: '4K',
    panelType: 'OLED',
    refreshRate: 120,
    hdmiPorts: 4,
    width: 145, height: 83, depth: 5,
}
```

### Geladeira (`categoryId: 'fridge'`)
```typescript
specs: {
    capacity: 460,      // litros
    energyClass: 'A',
    inverter: true,
    noiseLevel: 38,     // dB
    width: 70, height: 186, depth: 72,
}
```

### Robô Aspirador (`categoryId: 'robot-vacuum'`)
```typescript
specs: {
    suctionPower: 8000, // Pa
    batteryCapacity: 5200, // mAh
    dustbinCapacity: 470, // ml
    waterTankCapacity: 350, // ml
    noiseLevel: 65, // dB
    height: 9.8, // cm
}
```

### Smartphone (`categoryId: 'smartphone'`)
```typescript
specs: {
    screenSize: 6.7,    // polegadas
    storage: 128,       // GB
    ram: 8,             // GB
    batteryCapacity: 5000, // mAh
    cameraMain: 50,     // MP
}
```

---

## 3. O que é Gerado AUTOMATICAMENTE

Se os campos acima estão preenchidos, as seguintes seções são geradas automaticamente no PDP **SEM precisar de JSON mock**:

| Seção | Fonte | Automático? |
|-------|-------|-------------|
| Hero | products.ts | ✅ |
| DNA Chart | products.ts (scores) | ✅ |
| Feature Benefits | products.ts (featureBenefits) | ✅ |
| VoC Section | products.ts (voc) | ✅ |
| Offers Grid | products.ts (offers) | ✅ |
| VS Battle Bar | products.ts (mainCompetitor) | ✅ |
| Audit Verdict | ⚡ **Auto-gerado de scores + painPointsSolved** | ✅ |
| Simulators | ⚡ **Auto-gerado de specs** | ✅ |

---

## 4. JSON Mock (Opcional - Override Manual)

Se quiser dados **curados manualmente** em vez de auto-gerados, crie JSON em:
`src/data/mocks/{product-id}.json`

Estrutura completa (ver `roborock-q7-l5.json` como referência):

```json
{
    "product": { "id": "...", "name": "...", "brand": "...", "category": "..." },
    "header": { "overallScore": 8.36, "scoreLabel": "Muito Bom", "badges": [...] },
    "auditVerdict": { "solution": {...}, "attentionPoint": {...}, "dontBuyIf": {...} },
    "productDna": { "dimensions": [...] },
    "simulators": { "sizeAlert": {...}, "soundAlert": {...}, "energyAlert": {...} },
    "decisionFAQ": [...]  // Perguntas que quebram objeção de compra
}
```

---

## 5. Mapeamento SIC (OBRIGATÓRIO para TCO)

Adicionar em `src/data/components/product-mappings.ts`:

```typescript
{
    productId: 'marca-modelo',
    productName: 'Nome completo',
    categoryId: 'categoria',
    mappingConfidence: 0.80,
    mappingSource: 'inferred',
    lastUpdated: 'YYYY-MM-DD',
    components: [
        { componentId: 'componente_id', quantity: 1, criticality: 'fatal' | 'high' | 'medium' | 'low' },
    ],
},
```

---

## 6. Checklist OBRIGATÓRIO

Antes de finalizar, verificar:

- [ ] ID lowercase sem caracteres especiais
- [ ] CategoryId correto
- [ ] ASIN preenchido
- [ ] **Scores c1-c10 TODOS preenchidos** (não deixar vazio!)
- [ ] **scoreReasons para scores relevantes**
- [ ] **voc completo** (totalReviews, pros, cons, sources)
- [ ] **featureBenefits** (mínimo 4)
- [ ] **painPointsSolved** (mínimo 3)
- [ ] mainCompetitor com keyDifferences
- [ ] specs com campos para Simuladores
- [ ] Mapeamento SIC adicionado

---

## 7. Nova Categoria?

Se o produto é de categoria **não configurada**, use:
> `/cadastrar-categoria` - Workflow para nova categoria

**NÃO cadastre produtos sem antes configurar a categoria.**
