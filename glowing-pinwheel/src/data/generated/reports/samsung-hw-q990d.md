# Scaffold Audit Report: samsung-hw-q990d

## Metadados
- **Gerado em**: 2026-01-22T13:01:08.564Z
- **Categoria**: soundbar
- **Status**: draft
- **Template**: Minimal (sem template gold)
- **Input Hash**: a0295ba6

## Produto
| Campo | Valor |
|-------|-------|
| Nome | Samsung HW-Q990D 11.1.4 Dolby Atmos |
| Marca | Samsung |
| Modelo | HW-Q990D |
| Preço | R$ 4.999 |
| ASIN | B0DEMO00005 |

## Energia Derivada
- **Fonte**: `baseline`
- **Consumo**: 3 kWh/mês
- **Cálculo**: Baseline da categoria: 3 kWh/mês

## Regras Determinísticas Aplicadas

- **dolby-atmos-bonus**: Dolby Atmos melhora surround (c4) em +1.5 → c4 += 1.5
- **subwoofer-bonus**: Subwoofer incluso melhora graves (c2) em +1.0 → c2 += 1
- **earc-bonus**: eARC melhora conectividade (c5) em +0.5 → c5 += 0.5

## Campos Recomendados Ausentes
_Todos os campos recomendados estão presentes._



## Warnings
_Nenhum warning._



## Fontes Consultadas
1. [amazon](https://amazon.com.br/dp/B0DEMO00005)
2. [manufacturer](https://samsung.com.br/hw-q990d)

## Próximos Passos
1. [ ] Revisar e ajustar scores em `src/data/generated/products/samsung-hw-q990d.ts`
2. [ ] Preencher conteúdo editorial no mock `src/data/generated/mocks/samsung-hw-q990d.json`
3. [ ] Adicionar imagem do produto em `public/images/products/samsung-hw-q990d.webp`
4. [ ] Rodar `npm run validate:product -- --id=samsung-hw-q990d`
5. [ ] Se aprovado, mover para `src/data/products.ts` e status: 'published'
