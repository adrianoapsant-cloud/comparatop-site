# Scaffold Audit Report: samsung-qn85c-55

## Metadados
- **Gerado em**: 2026-01-22T13:41:07.137Z
- **Categoria**: tv
- **Status**: draft
- **Template**: Gold
- **Input Hash**: 27622e8f

## Produto
| Campo | Valor |
|-------|-------|
| Nome | Samsung QN85C 55" 4K Neo QLED |
| Marca | Samsung |
| Modelo | QN85C 55 |
| Preço | R$ 4.999 |
| ASIN | B0C6VJBTGQ |

## Evidence Map

| Campo | Valor | Source URL | Nota | Status |
|-------|-------|------------|------|--------|
| `product.brand` | Samsung | _N/A_ | _-_ | ⚠️ MISSING |
| `product.model` | QN85C 55 | _N/A_ | _-_ | ⚠️ MISSING |
| `price.valueBRL` | 4999 | _N/A_ | _-_ | ⚠️ MISSING |
| `price.sourceUrl` | https://amazon.com.br/dp/B0C6VJBTGQ | _N/A_ | _-_ | ⚠️ MISSING |
| `sources[0].url` | https://amazon.com.br/dp/B0C6VJBTGQ | _N/A_ | _-_ | ⚠️ MISSING |
| `specs.screenSize` | 55 | [link](https://samsung.com.br/qn85c) | Ficha técnica oficial | ✅ OK |
| `specs.panelType` | Neo QLED | [link](https://samsung.com.br/qn85c) | Ficha técnica oficial | ✅ OK |
| `specs.resolution` | 4K | [link](https://samsung.com.br/qn85c) | Ficha técnica oficial | ✅ OK |
| `specs.refreshRate` | 120 | [link](https://samsung.com.br/qn85c) | Ficha técnica oficial | ✅ OK |


## Rules Fired (Regras Determinísticas)

1. **hdmi21-gaming-bonus**: HDMI 2.1 (>=2 portas) melhora gaming (c5) em +1.0 → `c5` += 1
2. **120hz-gaming-bonus**: 120Hz+ melhora gaming (c5) em +0.5 → `c5` += 0.5

## Baseline vs Real

| Dado | Fonte | Valor |
|------|-------|-------|
| Consumo | `wattsUsage` | 15 kWh/mês |
| Cálculo | ✅ Input real | 100W × 5h/dia × 30 dias ÷ 1000 = 15.00 kWh/mês |


## Normalization Log

_Nenhuma normalização aplicada._





## Campos Recomendados Ausentes
_Todos os campos recomendados estão presentes._



## Warnings
_Nenhum warning._




## Fontes Consultadas
1. [amazon](https://amazon.com.br/dp/B0C6VJBTGQ)
2. [manufacturer](https://samsung.com.br/qn85c)

## Próximos Passos
1. [ ] Revisar e ajustar scores em `src/data/generated/products/samsung-qn85c-55.ts`
2. [ ] Preencher conteúdo editorial no mock `src/data/generated/mocks/samsung-qn85c-55.json`
3. [ ] Adicionar imagem do produto em `public/images/products/samsung-qn85c-55.webp`
4. [ ] Rodar `npm run validate:product -- --id=samsung-qn85c-55`
5. [ ] Se aprovado, mover para `src/data/products.ts` e status: 'published'
