# 📦 Como Adicionar Produtos - ComparaTop

> Guia operacional para cadastro de produtos seguindo SSOT

---

## 🎯 Pré-requisitos

1. Dados do produto (specs, preço, imagens)
2. Fontes/evidências documentadas
3. Scores já calculados (c1-c10)

---

## 📋 Passo a Passo

### 1. Preparar dados no formato ProductIntake

```typescript
// src/data/products.ts - adicionar ao array

const novoProduto = {
  // === OBRIGATÓRIOS ===
  id: 'marca-modelo-tamanho',  // slug único
  categoryId: 'tv',            // ID da categoria
  name: 'Marca Modelo 65"',    // nome completo
  brand: 'Marca',
  price: 4999,                 // BRL

  // === SCORES (obrigatório) ===
  scores: {
    c1: 8.5, c2: 9.0, c3: 7.5, c4: 8.0, c5: 8.5,
    c6: 9.0, c7: 8.0, c8: 7.5, c9: 8.5, c10: 7.0,
  },

  // === OPCIONAIS ===
  shortName: 'Modelo 65"',
  imageUrl: '/images/produtos/marca-modelo.jpg',
  benefitSubtitle: 'O melhor custo-benefício em TVs 4K',
  badges: ['best-value'],
  lastUpdated: '2026-01-19',

  // === EVIDÊNCIAS (recomendado) ===
  evidence: [
    {
      claim: 'Preço base R$ 4.999',
      sourceUrl: 'https://amazon.com.br/...',
      capturedAt: '2026-01-19',
      confidence: 0.95,
      sourceType: 'official',
    },
  ],
};
```

### 2. Verificar categoria

Se a categoria já existe em `src/data/categories.ts`, pular.

Para **nova categoria**, ver seção abaixo.

### 3. Validar produto

```bash
npm run integrity:products
```

Deve retornar:
- ✅ OK: produto passa no schema
- ⚠️ WARN: campos opcionais faltando
- ❌ FAIL: erros críticos (corrigir antes de publicar)

### 4. Verificar reflexos

Após adicionar, o produto aparece automaticamente em:
- **Home** (se estiver entre os top)
- **PLP** (categoria correspondente)
- **VS** (disponível para comparação)

---

## 🆕 Adicionar Nova Categoria

### 1. Definir extensão de schema

```typescript
// src/lib/schemas/product-intake.ts

export const NovaCategExtensionSchema = z.object({
  categoryId: z.literal('nova_categ'),
  technicalSpecs: z.object({
    campoEspecifico1: z.number(),
    campoEspecifico2: z.string(),
  }).partial(),
});
```

### 2. Adicionar ao discriminated union

```typescript
export const ProductIntakeSchema = z.discriminatedUnion('categoryId', [
  // ... existentes
  BaseProductInputSchema.merge(NovaCategExtensionSchema),
]);
```

### 3. Registrar categoria

```typescript
// src/data/categories.ts

export const CATEGORIES = {
  // ... existentes
  nova_categ: {
    id: 'nova_categ',
    name: 'Nova Categoria',
    slug: 'nova-categoria',
    // ...
  },
};
```

---

## ✅ Checklist Final

- [ ] ID único (sem duplicatas)
- [ ] CategoryId válido
- [ ] Scores c1-c10 preenchidos
- [ ] Preço positivo
- [ ] `npm run integrity:products` passa
- [ ] Evidências documentadas (para campos críticos)

---

## 🔧 Comandos Úteis

```bash
# Validar produtos
npm run integrity:products

# Build completo
npm run build

# Suite completa
npm run integrity
```

---

## ⚠️ ProductHealth

| Status | Significado | Ação |
|--------|-------------|------|
| OK | Produto publicável | ✅ Pronto |
| WARN | Campos faltando | ⚠️ Revisar antes de publicar |
| FAIL | Erros críticos | ❌ Corrigir antes de build |

---

*Última atualização: 2026-01-19*
