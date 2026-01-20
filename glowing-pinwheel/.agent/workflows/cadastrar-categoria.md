---
description: Como cadastrar uma nova categoria no ComparaTop
---

# Cadastro de Nova Categoria

Quando cadastrar uma **nova categoria** de produtos (ex: Notebook, Máquina de Lavar, etc.), siga este checklist para garantir que todas as funcionalidades funcionem corretamente.

## Arquivos que precisam ser atualizados:

### 1. API de Reviews - Detecção de Categoria
**Arquivo**: `src/app/api/reviews/[productId]/route.ts`

Adicionar patterns de ID para a nova categoria:
```typescript
// Exemplo: LAPTOP detection
const laptopPatterns = [
    'notebook', 'laptop', 'macbook', 'dell-', 'lenovo-', 'acer-'
];
```

### 2. API de Reviews - Schema Gemini
**Arquivo**: `src/app/api/reviews/[productId]/route.ts`

Criar schema específico para radar_tooltips e dimension_scores:
```typescript
const LAPTOP_SCHEMA = `
"radar_tooltips": {
    "custo_beneficio": "...",
    "desempenho": "...",
    "tela": "...",
    // ... 10 critérios específicos
}`;
```

### 3. Mapeamento de Campos para DNA
**Arquivo**: `src/hooks/useUnifiedVoice.ts`

Adicionar mapeamento de campos para c1-c10:
```typescript
const LAPTOP_FIELD_MAP: FieldMap = {
    custo_beneficio: 'c1',
    desempenho: 'c2',
    // ...
};
```

### 4. Labels do Gráfico Radar
**Arquivo**: `src/components/ProductRadarChart.tsx`

Adicionar labels para a nova categoria:
```typescript
laptop: {
    c1: '💰 Custo-Benefício',
    c2: '⚡ Desempenho',
    // ...
}
```

### 5. Labels do Gráfico na ProductDetailPage
**Arquivo**: `src/components/ProductDetailPage.tsx`

Buscar por `categoryLabels` e adicionar a nova categoria (há 2 lugares).

### 6. Simuladores Inteligentes
**Arquivo**: `src/lib/simulators-generator.ts`

Adicionar função geradora para a nova categoria:
```typescript
function generateLaptopSimulators(product: Product): SimulatorsData {
    // Lógica específica
}
```

E atualizar `generateSimulatorsData()`:
```typescript
case 'laptop':
    return generateLaptopSimulators(product);
```

### 7. Labels nos Simuladores
**Arquivo**: `src/components/pdp/SimulatorsSection.tsx`

Adicionar labels específicos:
```typescript
laptop: {
    sizeTitle: 'Tamanho da Tela',
    sizeIcon: 'monitor',
    sizeUnit: '"',
    soundTitle: 'Desempenho',
    soundIcon: 'cpu',
},
```

### 8. Componentes SIC (se aplicável)
**Arquivo**: `src/data/components/component-database.ts`

Adicionar componentes da categoria ao banco de dados.

### 9. HMUM Config (Scoring Contextual)
**Arquivo**: `src/config/hmum-configs/[categoria].ts`

Criar configuração de pesos para contextos.

---

## Checklist de Verificação

Após cadastrar a categoria, testar com pelo menos 1 produto:

- [ ] **Gráfico Radar (DNA)**: Labels corretos para a categoria
- [ ] **Tooltips Radar**: Gemini retorna descrições contextualizadas
- [ ] **Barra VS**: mainCompetitor renderiza corretamente
- [ ] **Simuladores Inteligentes**: 3 cards aparecem com dados corretos
- [ ] **Mapa de Componentes**: Seção "Custo Real de Propriedade" aparece
- [ ] **Nota calculada**: Não mostra 7.5 (fallback)
- [ ] **API detecta categoria**: Verificar em `/api/reviews/[productId]?force=true`

---

## Arquivos de Referência

Para ver como as categorias existentes estão configuradas:

| Categoria | ID | Arquivos de referência |
|-----------|----|-----------------------|
| TV | `tv` | Todos configurados, usar como modelo |
| Geladeira | `fridge` | Configurado, bom exemplo |
| Ar Condicionado | `air_conditioner` | Configurado, bom exemplo |
