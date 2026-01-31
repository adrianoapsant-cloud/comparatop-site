---
description: verificar inventário de dados do PDP antes de propor simplificações
---

# Workflow: Verificar Fontes de Dados do SimplifiedPDP

**OBRIGATÓRIO** antes de propor qualquer simplificação de seções do PDP.

## Passos

1. **Verificar tipo Product** em `src/types/category.ts`
   - Listar todos os campos opcionais que já existem
   - Campos comuns: `benchmarks`, `featureBenefits`, `priceHistory`, `mainCompetitor`

2. **Verificar products.ts** com busca por nome do campo
   ```
   grep -i "fieldName:" src/data/products.ts
   ```

3. **Verificar geradores existentes** em `src/lib/pdp/`
   - `extract-radar-dimensions.ts`
   - `audit-verdict-generator.ts`
   - `generate-tco.ts`
   - `generate-feature-benefits.ts`

4. **Verificar templates do scaffolder** em `src/lib/scaffold/templates/minimal/`

5. **Verificar mocks** em `src/data/mocks/`

## Inventário Atualizado

Consulte `.agent/pdp-data-inventory.md` para ver o mapeamento completo de seções → fontes de dados.

## Quando Usar

- Antes de dizer "esta seção precisa de simplificação"
- Antes de criar um novo gerador automático
- Ao cadastrar nova categoria
