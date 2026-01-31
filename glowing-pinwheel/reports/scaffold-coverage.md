# Scaffold Coverage Report

**Data**: 2026-01-22
**Versão**: P3 Multi-Category Architecture

---

## Categorias Suportadas

| Categoria | Schema | Spec | Template Gold | Status |
|-----------|--------|------|---------------|--------|
| `robot-vacuum` | ✅ | ✅ | ✅ `roborock-q7-l5.json` | **COMPLETO** |
| `tv` | ✅ | ✅ | ✅ `lg-c3-65.json` | **COMPLETO** |
| `fridge` | ✅ | ✅ | ⚠️ Minimal | **FUNCIONAL** |
| `air_conditioner` | ✅ | ✅ | ⚠️ Minimal | **FUNCIONAL** |
| `smartwatch` | ✅ | ✅ | ✅ `samsung-galaxy-watch7-44mm-lte.json` | **COMPLETO** |

---

## Categorias Pendentes (48 restantes)

### Prioridade Alta (hardware energy-intensive)
- `smartphone` — Tem produtos no repo, precisa de schema/spec
- `notebook` — Tem benchmark no repo, precisa de schema/spec/template
- `washing_machine` — Alta relevância TCO
- `dryer` — Alta relevância TCO
- `dishwasher` — Alta relevância TCO

### Prioridade Média (eletrônicos)
- `headphones`
- `soundbar`
- `projector`
- `gaming_console`
- `tablet`

### Prioridade Baixa (outros)
- Demais 38 categorias conforme taxonomia ComparaTop

---

## Como Adicionar Nova Categoria

### Passo 1: Criar Schema Zod

```bash
# Criar arquivo
touch src/lib/scaffold/schemas/<category>.ts
```

```typescript
// src/lib/scaffold/schemas/<category>.ts
import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EnergyInputSchema } from './common';

export const <Category>SpecsInputSchema = z.object({
    // Campos obrigatórios
    <requiredField>: z.<type>(),
    
    // Campos recomendados
    <optionalField>: z.<type>().optional(),
});

export const <Category>OpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('<category_id>'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    energy: EnergyInputSchema.optional(),  // Se relevante para TCO
    specs: <Category>SpecsInputSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type <Category>OpusRawInput = z.infer<typeof <Category>OpusRawInputSchema>;
```

### Passo 2: Registrar Schema no Index

```typescript
// src/lib/scaffold/schemas/index.ts

// Adicionar import
import { <Category>OpusRawInputSchema, type <Category>OpusRawInput } from './<category>';

// Adicionar ao SUPPORTED_SCAFFOLD_CATEGORIES
export const SUPPORTED_SCAFFOLD_CATEGORIES = [
    // ... existentes ...
    '<category_id>',
] as const;

// Adicionar ao SCHEMA_BY_CATEGORY
export const SCHEMA_BY_CATEGORY = {
    // ... existentes ...
    '<category_id>': <Category>OpusRawInputSchema,
};

// Adicionar ao OpusRawInput type
export type OpusRawInput = 
    | // ... existentes ...
    | <Category>OpusRawInput;
```

### Passo 3: Criar Spec

```typescript
// src/lib/scaffold/specs/<category>.ts
import type { CategoryScaffoldSpec } from './types';

export const <CATEGORY>_SCAFFOLD_SPEC: CategoryScaffoldSpec = {
    categoryId: '<category_id>',
    energy: {
        baseline: {
            defaultKwhMonth: <number>,
            lifespanYears: <number>,
            maintenanceRate: <decimal>,
        },
        consumptionPriority: ['inmetro', 'label', 'wattsUsage', 'baseline'],
        bounds: {
            hardMin: <n>, hardMax: <n>,
            softMin: <n>, softMax: <n>,
        },
    },
    specs: {
        <specField>: { hardMin: <n>, hardMax: <n>, softMin: <n>, softMax: <n> },
    },
    defaultScores: {
        c1: 7, c2: 7, c3: 7, c4: 7, c5: 7,
        c6: 7, c7: 7, c8: 7, c9: 7, c10: 7,
    },
    deterministicRules: [
        {
            id: '<rule-id>',
            description: '<description>',
            condition: (specs) => <boolean expression>,
            modifier: { scoreKey: 'c<n>', delta: <+-n> },
        },
    ],
};
```

### Passo 4: Registrar Spec no Index

```typescript
// src/lib/scaffold/specs/index.ts
import { <CATEGORY>_SCAFFOLD_SPEC } from './<category>';

export const SCAFFOLD_SPEC_BY_CATEGORY = {
    // ... existentes ...
    '<category_id>': <CATEGORY>_SCAFFOLD_SPEC,
};
```

### Passo 5: (Opcional) Registrar Template Gold

Se existe um mock gold para a categoria:

```typescript
// src/lib/scaffold/templates/index.ts
export const MOCK_TEMPLATE_BY_CATEGORY = {
    // ... existentes ...
    '<category_id>': '<product-id>.json',
};
```

### Passo 6: Criar Sample Input

```bash
# Criar arquivo de teste
touch samples/<category>.input.json
```

### Passo 7: Testar

```bash
# Dry run
npx tsx scripts/scaffold-product.ts --category <category_id> --dry-run --in samples/<category>.input.json

# Se OK, escrita real
npx tsx scripts/scaffold-product.ts --category <category_id> --in samples/<category>.input.json

# Validar
npm run validate:product -- --id=<generated-product-id>
npm run build
npm run integrity:products
```

---

## Regras Determinísticas por Categoria

### robot-vacuum (4 regras)
- `lidar-navigation-bonus`: LiDAR/VSLAM → c1 +1.0
- `auto-empty-base-bonus`: hasSelfEmpty → c9 +1.5
- `ultra-slim-height-bonus`: altura ≤8cm → c5 +0.5
- `self-wash-mop-bonus`: hasSelfWash → c3 +1.0

### tv (4 regras)
- `oled-image-quality`: OLED → c1 +1.0
- `hdmi21-gaming-bonus`: ≥2 HDMI 2.1 → c5 +1.0
- `120hz-gaming-bonus`: 120Hz+ → c5 +0.5
- `vrr-allm-bonus`: VRR + ALLM → c5 +0.5

### fridge (4 regras)
- `frost-free-praticidade`: frostFree → c5 +0.5
- `inverter-efficiency`: inverter → c2 +1.0
- `inverter-noise`: inverter → c4 +0.5
- `large-capacity-bonus`: ≥400L → c1 +0.5

### air_conditioner (4 regras)
- `inverter-efficiency-bonus`: inverter → c1 +1.5
- `dual-inverter-extra`: dual inverter → c1 +0.5
- `inverter-noise-bonus`: inverter → c3 +0.5
- `wifi-smart-bonus`: wifi → c7 +1.5

### smartwatch (4 regras)
- `gps-fitness-bonus`: GPS → c4 +0.5
- `ecg-health-bonus`: ECG → c3 +1.0
- `nfc-payments-bonus`: NFC → c10 +1.0
- `lte-ecosystem-bonus`: LTE → c5 +0.5

---

## Arquivos do Sistema

```
src/lib/scaffold/
├── schemas/
│   ├── index.ts          # Registry + parseOpusRawInput
│   ├── common.ts         # Schemas compartilhados
│   ├── robot-vacuum.ts
│   ├── tv.ts
│   ├── fridge.ts
│   ├── air-conditioner.ts
│   └── smartwatch.ts
├── specs/
│   ├── index.ts          # Registry + getSpec
│   ├── types.ts          # CategoryScaffoldSpec type
│   ├── robot-vacuum.ts
│   ├── tv.ts
│   ├── fridge.ts
│   ├── air-conditioner.ts
│   └── smartwatch.ts
├── templates/
│   └── index.ts          # Registry + loadMockTemplate
└── schemas.ts            # (Legado P2 - pode ser removido)

scripts/
└── scaffold-product.ts   # CLI principal
```

---

## Métricas P3

- **Categorias suportadas**: 5
- **Regras determinísticas**: 20 (4 por categoria)
- **Templates gold**: 3 (robot-vacuum, tv, smartwatch)
- **Templates minimal**: 2 (fridge, air_conditioner)
- **Samples de teste**: 5

---

## Próximos Passos

1. **P3.5**: Adicionar `smartphone` (schema+spec+template)
2. **P4**: Adicionar normalização de valores (aliases)
3. **P5**: Criar templates gold para fridge e air_conditioner
4. **P6**: Adicionar 10+ categorias restantes
