# P14 — Placeholder Guardrail

## O que é "published"

Um produto é considerado **published** quando tem `status === 'published'` em seu objeto.

- Produtos em `src/data/products.ts` são tipicamente published
- Produtos em `src/data/generated/` são drafts (sem status ou status !== 'published')

## O que o script verifica

O script `integrity-placeholders.ts` escaneia:

1. **Produtos em runtime**
   - Todos os produtos exportados de `src/data/products.ts`
   - Produtos gerados de `src/data/generated/`

2. **Mocks associados**
   - `src/data/mocks/<productId>.json`
   - `src/data/generated/mocks/<productId>.json`

3. **Token buscado**: `__CT_TODO__`

## Política de bloqueio

| Situação | Severidade | Exit Code |
|----------|------------|-----------|
| Published + placeholder | ❌ ERROR | 2 |
| Draft + placeholder | ⚠️ WARNING | 0 |
| Nenhum placeholder | ✅ PASS | 0 |

## Como corrigir

Quando o scanner falhar com ERROR:

1. Identificar os produtos listados no output
2. Localizar os paths com placeholders
3. Substituir `__CT_TODO__` por conteúdo real
4. Rodar novamente: `npm run integrity:placeholders`

## Comandos

```bash
# Rodar verificação
npm run integrity:placeholders

# Verificar um produto específico (grep)
grep -r "__CT_TODO__" src/data/products.ts
```

## Integração CI

Adicionar ao pipeline após `npm run integrity:products`:

```yaml
- run: npm run integrity:placeholders
```
