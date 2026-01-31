# Scaffold Audit Report: brastemp-brm56

## Metadados
- **Gerado em**: 2026-01-22T11:56:54.710Z
- **Categoria**: fridge
- **Status**: draft
- **Template**: Minimal (sem template gold)
- **Input Hash**: 1c0c04cc

## Produto
| Campo | Valor |
|-------|-------|
| Nome | Brastemp BRM56 Frost Free Inverse 462L |
| Marca | Brastemp |
| Modelo | BRM56 |
| Preço | R$ 3.899 |
| ASIN | B0CFRIDGEEXAMPLE |

## Energia Derivada
- **Fonte**: `inmetro`
- **Consumo**: 30 kWh/mês
- **Cálculo**: INMETRO 360 kWh/ano ÷ 12 = 30.00 kWh/mês

## Regras Determinísticas Aplicadas

- **frost-free-praticidade**: Frost-free melhora praticidade (c5) em +0.5 → c5 += 0.5
- **inverter-efficiency**: Inverter melhora eficiência (c2) em +1.0 → c2 += 1
- **inverter-noise**: Inverter melhora ruído (c4) em +0.5 → c4 += 0.5
- **large-capacity-bonus**: Capacidade >= 400L melhora capacidade (c1) em +0.5 → c1 += 0.5

## Campos Recomendados Ausentes
_Todos os campos recomendados estão presentes._



## Warnings
_Nenhum warning._



## Fontes Consultadas
1. [amazon](https://www.amazon.com.br/dp/B0CFRIDGEEXAMPLE)
2. [manufacturer](https://www.brastemp.com.br/geladeira-brm56)

## Próximos Passos
1. [ ] Revisar e ajustar scores em `src/data/generated/products/brastemp-brm56.ts`
2. [ ] Preencher conteúdo editorial no mock `src/data/generated/mocks/brastemp-brm56.json`
3. [ ] Adicionar imagem do produto em `public/images/products/brastemp-brm56.webp`
4. [ ] Rodar `npm run validate:product -- --id=brastemp-brm56`
5. [ ] Se aprovado, mover para `src/data/products.ts` e status: 'published'
