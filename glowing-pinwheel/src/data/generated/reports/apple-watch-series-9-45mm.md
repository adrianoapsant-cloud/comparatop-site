# Scaffold Audit Report: apple-watch-series-9-45mm

## Metadados
- **Gerado em**: 2026-01-22T11:56:59.410Z
- **Categoria**: smartwatch
- **Status**: draft
- **Template**: Gold
- **Input Hash**: 890d8772

## Produto
| Campo | Valor |
|-------|-------|
| Nome | Apple Watch Series 9 45mm GPS+Cellular |
| Marca | Apple |
| Modelo | Watch Series 9 45mm |
| Preço | R$ 4.999 |
| ASIN | B0CWATCHEXAMPLE |

## Energia Derivada
- **Fonte**: `baseline`
- **Consumo**: 0.1 kWh/mês
- **Cálculo**: Baseline da categoria: 0.1 kWh/mês

## Regras Determinísticas Aplicadas

- **gps-fitness-bonus**: GPS melhora fitness (c4) em +0.5 → c4 += 0.5
- **ecg-health-bonus**: ECG melhora sensores de saúde (c3) em +1.0 → c3 += 1
- **nfc-payments-bonus**: NFC melhora pagamentos (c10) em +1.0 → c10 += 1
- **lte-ecosystem-bonus**: LTE melhora ecossistema (c5) em +0.5 → c5 += 0.5

## Campos Recomendados Ausentes
_Todos os campos recomendados estão presentes._



## Warnings
_Nenhum warning._



## Fontes Consultadas
1. [amazon](https://www.amazon.com.br/dp/B0CWATCHEXAMPLE)
2. [manufacturer](https://www.apple.com/br/shop/buy-watch/apple-watch)

## Próximos Passos
1. [ ] Revisar e ajustar scores em `src/data/generated/products/apple-watch-series-9-45mm.ts`
2. [ ] Preencher conteúdo editorial no mock `src/data/generated/mocks/apple-watch-series-9-45mm.json`
3. [ ] Adicionar imagem do produto em `public/images/products/apple-watch-series-9-45mm.webp`
4. [ ] Rodar `npm run validate:product -- --id=apple-watch-series-9-45mm`
5. [ ] Se aprovado, mover para `src/data/products.ts` e status: 'published'
