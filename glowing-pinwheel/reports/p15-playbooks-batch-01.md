# P15 Playbooks Import — Batch 01

**Data**: 2026-01-22 14:07 (Brasília)
**Status**: ✅ Batch 01 Completo

---

## Categorias Importadas (3)

| Categoria | categoryId | Pesos | Status |
|-----------|------------|-------|--------|
| Smart TVs | `tv` | 100% ✓ | ✅ OK |
| Smartphones | `smartphone` | 100% ✓ | ✅ OK |
| Refrigeradores | `fridge` | 98% | ⚠️ NEEDS_HUMAN |

---

## ⚠️ NEEDS_HUMAN: Fridge (Pesos = 98%)

### Problema
Os pesos do playbook de Refrigeradores somam **98%** em vez de 100%.

```
c1: 18% + c2: 15% + c3: 12% + c4: 10% + c5: 10% + 
c6: 8% + c7: 8% + c8: 7% + c9: 6% + c10: 4% = 98%
```

**Faltam 2%** para completar 100%.

### Sugestão
Adicionar 2% em um dos critérios mais importantes:
- `c1` (TCO) → 18% → 20%
- `c2` (Materiais/Ferrugem) → 15% → 17%

### Arquivo
`src/config/category-playbooks/fridge.ts` contém `NEEDS_HUMAN_FRIDGE` com detalhes.

---

## Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `src/config/category-playbooks/tv.ts` | Playbook TV (10 critérios) |
| `src/config/category-playbooks/smartphone.ts` | Playbook Smartphone (10 critérios) |
| `src/config/category-playbooks/fridge.ts` | Playbook Fridge (NEEDS_HUMAN) |
| `src/config/category-playbooks/index.ts` | Index com registry |

---

## Comandos Executados

| Comando | Exit Code |
|---------|-----------|
| `npm run build` | 0 ✓ |
| `npm run census` | 0 ✓ |
| `npm run integrity:placeholders` | 0 ✓ |

---

## Diffs Principais (Labels/Pesos)

### TV (antes → depois)

| scoreKey | Label Anterior | Label Playbook |
|----------|---------------|----------------|
| c1 | Custo-Benefício | **Confiabilidade & Longevidade** |
| c2 | Processamento de Imagem | **Contraste & Pretos** |
| c3 | Confiabilidade | **Custo-Benefício Real** |
| c4 | Fluidez do Sistema | **Desempenho em Sala Clara** |
| c5 | Desempenho Game | **Sistema & Fluidez** |
| c6 | Brilho e Reflexo | **Fluidez de Movimento (Gamer)** |
| c7 | Pós-Venda | **Suporte Pós-Venda** |
| c8 | Qualidade de Som | **Áudio & Integração** |
| c9 | Conectividade | **Upscaling (TV Aberta)** |
| c10 | Design e Instalação | **Design & Construção** |

### Pesos TV

| scoreKey | Peso Anterior | Peso Playbook |
|----------|--------------|---------------|
| c1 | ~10% | **20%** |
| c2 | ~10% | **15%** |
| c3 | ~10% | **15%** |
| c4 | ~10% | **10%** |
| c5 | ~10% | **10%** |
| c6 | ~10% | **5%** |
| c7 | ~10% | **10%** |
| c8 | ~10% | **5%** |
| c9 | ~10% | **5%** |
| c10 | ~10% | **5%** |

---

## Próximos Passos

1. **Adriano decidir**: Onde adicionar os 2% faltantes em `fridge`
2. **Batch 02**: Processar próximas 3 categorias do TXT
3. **Opcional**: Atualizar `src/config/categories.ts` com labels/pesos dos playbooks

---

## Como Usar os Playbooks

```typescript
import { getPlaybook, validatePlaybookWeights } from '@/config/category-playbooks';

const tvPlaybook = getPlaybook('tv');
const { valid, sum } = validatePlaybookWeights(tvPlaybook);
// valid: true, sum: 100
```
