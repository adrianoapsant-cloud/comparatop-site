# Scoring Baselines

Arquivos de proteção contra regressão silenciosa no sistema de scoring.

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `baseScore-v0.json` | Baseline original (pré-migração HMUM) |
| `unifiedScore-v{N}.json` | Golden file atual (N = WEIGHTS_VERSION) |

## Golden File Policy

### Quando regenerar o golden file:

1. **Alterou DEFAULT_WEIGHTS ou CATEGORY_WEIGHTS?**
   - Bump `WEIGHTS_VERSION` em `src/lib/scoring/category-weights.ts`
   - Execute `npm run generate:golden`
   - Commit o novo arquivo

2. **Adicionou novo produto?**
   - Execute `npm run generate:golden`
   - Commit o arquivo atualizado

3. **Removeu produto?**
   - Execute `npm run generate:golden`
   - Commit o arquivo atualizado

### CI Integration

```bash
# Validar scores (c1-c10 + pesos)
npm run validate:scores

# Comparar com golden file
npm run compare:golden

# Gate completo (inclui validação de scores)
npm run gate:full
```

### Fluxo de Alteração de Pesos

```
1. Editar pesos em category-weights.ts
   ↓
2. Incrementar WEIGHTS_VERSION
   ↓
3. npm run generate:golden
   ↓
4. npm run compare:golden  (deve passar)
   ↓
5. Commit: pesos + golden file
```

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run generate:golden` | Gera `unifiedScore-v{VERSION}.json` |
| `npm run compare:golden` | Compara atual vs golden (falha se diff > 0.01) |
| `npm run generate:score-baseline` | Gera baseline com getBaseScore |
| `npm run compare:score-baseline` | Compara getUnifiedScore vs baseline |
| `npm run validate:scores` | Valida c1-c10 e soma dos pesos |
