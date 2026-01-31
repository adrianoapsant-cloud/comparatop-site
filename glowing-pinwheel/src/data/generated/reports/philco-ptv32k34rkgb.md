# Scaffold Audit Report: philco-ptv32k34rkgb

## Metadados
- **Gerado em**: 2026-01-23T18:44:06.225Z
- **Categoria**: tv
- **Status**: draft
- **Template**: Gold
- **Input Hash**: fbb8ad1a

## Produto
| Campo | Valor |
|-------|-------|
| Nome | Smart TV 32 Philco PTV32K34RKGB Roku TV LED Dolby Audio |
| Marca | Philco |
| Modelo | PTV32K34RKGB |
| Preço | R$ 821,75 |
| ASIN | N/A |

## Evidence Map

| Campo | Valor | Source URL | Nota | Status |
|-------|-------|------------|------|--------|
| `product.brand` | Philco | _N/A_ | _-_ | ⚠️ MISSING |
| `product.model` | PTV32K34RKGB | _N/A_ | _-_ | ⚠️ MISSING |
| `price.valueBRL` | 821.75 | [link](https://www.mercadolivre.com.br/smart-tv-32-philco-ptv32k34rkgb-roku-tv-led-dolby-audio/p/MLB39456212) | R$ 821,75 (30% OFF no Pix) | ❌ INVALID |
| `price.sourceUrl` | https://mercadolivre.com/sec/2of6hfR | _N/A_ | _-_ | ⚠️ MISSING |
| `sources[0].url` | https://mercadolivre.com/sec/2of6hfR | _N/A_ | _-_ | ⚠️ MISSING |
| `specs.screenSize` | 32 | [link](https://www.mercadolivre.com.br/smart-tv-32-philco-ptv32k34rkgb-roku-tv-led-dolby-audio/p/MLB39456212) | 32 polegadas (72 x 18 x 45.8 cm) | ❌ INVALID |
| `specs.panelType` | LED | [link](https://www.mercadolivre.com.br/smart-tv-32-philco-ptv32k34rkgb-roku-tv-led-dolby-audio/p/MLB39456212) | LED | ❌ INVALID |
| `specs.resolution` | HD | [link](https://www.mercadolivre.com.br/smart-tv-32-philco-ptv32k34rkgb-roku-tv-led-dolby-audio/p/MLB39456212) | HD (1366 x 768) | ❌ INVALID |
| `specs.refreshRate` | 60 | [link](https://www.mercadolivre.com.br/smart-tv-32-philco-ptv32k34rkgb-roku-tv-led-dolby-audio/p/MLB39456212) | 60 Hz | ❌ INVALID |


## Rules Fired (Regras Determinísticas)
_Nenhuma regra disparou._



## Baseline vs Real

| Dado | Fonte | Valor |
|------|-------|-------|
| Consumo | `wattsUsage` | 7.5 kWh/mês |
| Cálculo | ✅ Input real | 50W × 5h/dia × 30 dias ÷ 1000 = 7.50 kWh/mês |


## Normalization Log

_Nenhuma normalização aplicada._





## Campos Recomendados Ausentes
_Todos os campos recomendados estão presentes._



## Warnings
_Nenhum warning._




## Fontes Consultadas
1. [marketplace](https://mercadolivre.com/sec/2of6hfR)

## Próximos Passos
1. [ ] Revisar e ajustar scores em `src/data/generated/products/philco-ptv32k34rkgb.ts`
2. [ ] Preencher conteúdo editorial no mock `src/data/generated/mocks/philco-ptv32k34rkgb.json`
3. [ ] Adicionar imagem do produto em `public/images/products/philco-ptv32k34rkgb.webp`
4. [ ] Rodar `npm run validate:product -- --id=philco-ptv32k34rkgb`
5. [ ] Se aprovado, mover para `src/data/products.ts` e status: 'published'
