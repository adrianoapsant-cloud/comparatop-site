# Scaffold Audit Report: wap-robot-w1000

## Metadados
- **Gerado em**: 2026-01-28T11:34:43.218Z
- **Categoria**: robot-vacuum
- **Status**: draft
- **Template**: Gold
- **Input Hash**: e72781c1

## Produto
| Campo | Valor |
|-------|-------|
| Nome | WAP Robô Aspirador de Pó ROBOT W1000 Mapeamento GYRO |
| Marca | WAP |
| Modelo | ROBOT W1000 |
| Preço | R$ 338,21 |
| ASIN | B0DCW2976L |

## Evidence Map

| Campo | Valor | Source URL | Nota | Status |
|-------|-------|------------|------|--------|
| `product.brand` | WAP | _N/A_ | _-_ | ⚠️ MISSING |
| `product.model` | ROBOT W1000 | _N/A_ | _-_ | ⚠️ MISSING |
| `price.valueBRL` | 338.21 | _N/A_ | _-_ | ⚠️ MISSING |
| `price.sourceUrl` | https://www.amazon.com.br/dp/B0DCW2976L | _N/A_ | _-_ | ⚠️ MISSING |
| `sources[0].url` | https://www.amazon.com.br/dp/B0DCW2976L | _N/A_ | _-_ | ⚠️ MISSING |
| `specs.suctionPa` | 2340 | _N/A_ | _-_ | ⚠️ MISSING |
| `specs.navigationType` | gyroscope | _N/A_ | _-_ | ⚠️ MISSING |
| `specs.hasSelfEmpty` | ✗ | _N/A_ | _-_ | ⚠️ MISSING |


## Rules Fired (Regras Determinísticas)

1. **ultra-slim-height-bonus**: Altura <= 8cm melhora altura (c5) em +0.5 → `c5` += 0.5

## Baseline vs Real

| Dado | Fonte | Valor |
|------|-------|-------|
| Consumo | `wattsUsage` | 1.44 kWh/mês |
| Cálculo | ✅ Input real | 32W × 1.5h/dia × 30 dias ÷ 1000 = 1.44 kWh/mês |


## Normalization Log


| Campo | Raw | Normalizado | Razão |
|-------|-----|-------------|-------|
| `navigationType` | gyroscope | Gyroscope | Alias padronizado |


**Warnings de normalização:**
- mopType: valor 'passivo' não mapeado, mantido original


## Campos Recomendados Ausentes
_Todos os campos recomendados estão presentes._



## Warnings
_Nenhum warning._




## Fontes Consultadas
1. [amazon](https://www.amazon.com.br/dp/B0DCW2976L)

## Próximos Passos
1. [ ] Revisar e ajustar scores em `src/data/generated/products/wap-robot-w1000.ts`
2. [ ] Preencher conteúdo editorial no mock `src/data/generated/mocks/wap-robot-w1000.json`
3. [ ] Adicionar imagem do produto em `public/images/products/wap-robot-w1000.webp`
4. [ ] Rodar `npm run validate:product -- --id=wap-robot-w1000`
5. [ ] Se aprovado, mover para `src/data/products.ts` e status: 'published'
