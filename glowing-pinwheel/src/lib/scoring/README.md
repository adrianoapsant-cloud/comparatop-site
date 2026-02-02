# Scoring Module

**Versão:** 1  
**SSOT:** `getUnifiedScore()`

## Regras

### Score Cálculo
- **Fórmula:** Média ponderada de c1..c10 por categoria
- **Fallback score ausente:** 7.5 por critério
- **Fallback produto sem scores:** 7.50
- **Precisão:** Sempre 2 casas decimais (`Number(n.toFixed(2))`)
- **Clamp:** Scores individuais são clamped para 0-10

### Pesos
- **DEFAULT_WEIGHTS:** Distribuição uniforme (0.10 cada) - soma = 1.00
- **CATEGORY_WEIGHTS:** Overrides por categoria - cada um soma = 1.00
- **WEIGHTS_VERSION:** Incrementar ao alterar pesos

### Aliases
- `CATEGORY_ALIASES` mapeia alias → canonical
- Exemplo: `"robo-aspiradores" → "robot-vacuum"`
- Usado por `normalizeCategoryId()` antes de buscar pesos

## Arquivos

| Arquivo | Responsabilidade |
|---------|------------------|
| `getUnifiedScore.ts` | Função SSOT para score unificado |
| `category-weights.ts` | Pesos e aliases por categoria |
| `index.ts` | Barrel exports |

## Uso

```typescript
import { getUnifiedScore } from '@/lib/scoring/getUnifiedScore';

const score = getUnifiedScore(product); // 8.51
```

## Versionamento e CI Policy

### ⚠️ Ao alterar pesos em `category-weights.ts`:

1. **Bump `WEIGHTS_VERSION`** no arquivo
2. **Rodar:** `npm run generate:golden`
3. **Commitar:** `scoring-baselines/unifiedScore-vN.json`
4. **Documentar** a mudança no commit

### CI Checks (GitHub Actions)

O workflow `.github/workflows/validate-scores.yml` roda:

| Check | Script | O que valida |
|-------|--------|--------------|
| Validate Scores | `npm run validate:scores` | c1-c10 presentes, range 0-10, pesos somam 1.00 |
| Compare Golden | `npm run compare:golden` | unifiedScore vs golden file (diff ≤ 0.01) |
| Compare Baseline | `npm run compare:score-baseline` | baseScore vs baseline (diff ≤ 0.01) |
| TypeScript | `npm run typecheck` | Sem erros de tipo |

### ❌ Nunca no CI

- `generate:golden` — só local, conscientemente
- `generate:score-baseline` — só em migrações intencionais

