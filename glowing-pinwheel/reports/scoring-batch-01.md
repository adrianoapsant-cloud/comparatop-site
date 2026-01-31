# Scoring Batch 01 - 2026-01-22

## P18 PARTE 3: Conversão TXT → TS (Batch 01)

### Resumo

| Métrica | Valor |
|---------|-------|
| Categorias convertidas | 3 |
| Build | ✅ **PASS** (Exit code: 0) |
| NEEDS HUMAN | ❌ Nenhum |

---

## Categorias Convertidas

### 1. washer_dryer (Lava e Seca)

| Campo | Valor |
|-------|-------|
| **categoryId** | `washer_dryer` |
| **Arquivo** | `src/lib/scoring/hmum/configs/washer_dryer.ts` |
| **Fonte TXT** | Linhas 120-135 |
| **Soma dos Pesos** | **100%** (15+15+12+12+10+8+8+8+7+5) |

**Critérios**:
1. Durabilidade Mecânica (Eixo Tripé) - 15%
2. Segurança de Secagem - 15%
3. Reparabilidade & Peças - 12%
4. Capacidade Real (Regra 2/3) - 12%
5. Acústica & Vibração - 10%
6. Preservação Têxtil (Amassados) - 8%
7. Conectividade IoT - 8%
8. Eficiência (Água/Luz) - 8%
9. Agilidade (Ciclos Rápidos) - 7%
10. Suporte Pós-Venda - 5%

---

### 2. stove (Fogões e Cooktops)

| Campo | Valor |
|-------|-------|
| **categoryId** | `stove` |
| **Arquivo** | `src/lib/scoring/hmum/configs/stove.ts` |
| **Fonte TXT** | Linhas 137-152 |
| **Soma dos Pesos** | **100%** (20+15+15+12+10+8+8+5+5+2) |

**Critérios**:
1. Segurança da Mesa (Estilhaço) - 20%
2. Estabilidade das Trempes (Grades) - 15%
3. Segurança de Gás (Válvulas) - 15%
4. Desempenho dos Queimadores - 12%
5. Isolamento do Forno - 10%
6. Durabilidade (Materiais) - 8%
7. Facilidade de Limpeza - 8%
8. Ergonomia (Botões) - 5%
9. Tecnologia (Timer/Grill) - 5%
10. Eficiência Energética (Gás/Luz) - 2%

---

### 3. microwave (Micro-ondas)

| Campo | Valor |
|-------|-------|
| **categoryId** | `microwave` |
| **Arquivo** | `src/lib/scoring/hmum/configs/microwave.ts` |
| **Fonte TXT** | Linhas 172-187 |
| **Soma dos Pesos** | **100%** (20+15+15+12+10+8+8+5+5+2) |

**Critérios**:
1. Integridade da Cavidade (Pintura) - 20%
2. Visibilidade Operacional - 15%
3. Interface (Painel) - 15%
4. Tecnologia de Aquecimento - 12%
5. Ergonomia de Limpeza - 10%
6. Nível de Ruído - 8%
7. Capacidade Útil - 8%
8. Mecânica da Porta - 5%
9. Versatilidade Real - 5%
10. Recursos Supérfluos - 2%

---

## Arquivos Criados/Alterados

| Arquivo | Ação |
|---------|------|
| `src/lib/scoring/hmum/configs/washer_dryer.ts` | ✅ NOVO |
| `src/lib/scoring/hmum/configs/stove.ts` | ✅ NOVO |
| `src/lib/scoring/hmum/configs/microwave.ts` | ✅ NOVO |
| `src/lib/scoring/hmum/configs/index.ts` | ✅ ATUALIZADO (imports + registry) |

---

## Build Result

```
npm run build
Exit code: 0

✓ Compiled successfully
├ ○ /metodologia/hmum
├ ƒ /produto/[slug]
└ ● /vs/[slugs]
```

---

## Status HMUM Atualizado

| Métrica | Antes | Depois |
|---------|-------|--------|
| Configs no registry | 10 | **13** |
| CategoryIds canônicos com config | 10 | **13** |
| missing_scoring_configs | 43 | **40** |

---

## Próximo Batch (02)

Sugestão para as próximas 3 categorias:
1. `dishwasher` (Lava-louças)
2. `freezer` (Freezer)
3. `air_fryer` (Air Fryer)
