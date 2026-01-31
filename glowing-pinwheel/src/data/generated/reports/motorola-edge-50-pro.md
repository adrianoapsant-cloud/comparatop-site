# Scaffold Audit Report: motorola-edge-50-pro

## Metadados
- **Gerado em**: 2026-01-22T12:30:25.003Z
- **Categoria**: smartphone
- **Status**: draft
- **Template**: Minimal (sem template gold)
- **Input Hash**: 62f47ab8

## Produto
| Campo | Valor |
|-------|-------|
| Nome | Motorola Edge 50 Pro 256GB |
| Marca | Motorola |
| Modelo | Edge 50 Pro |
| Preço | R$ 2.799 |
| ASIN | B0CSMARTEXAMPLE |

## Energia Derivada
- **Fonte**: `baseline`
- **Consumo**: 0.5 kWh/mês
- **Cálculo**: Baseline da categoria: 0.5 kWh/mês

## Regras Determinísticas Aplicadas

- **amoled-display-bonus**: AMOLED/OLED melhora qualidade de tela (c6) em +0.5 → c6 += 0.5
- **5g-connectivity-bonus**: 5G melhora conectividade (c8) em +0.5 → c8 += 0.5
- **ip68-durability-bonus**: IP68 melhora resiliência física (c5) em +1.0 → c5 += 1

## Campos Recomendados Ausentes
_Todos os campos recomendados estão presentes._



## Warnings
_Nenhum warning._



## Fontes Consultadas
1. [amazon](https://www.amazon.com.br/dp/B0CSMARTEXAMPLE)
2. [manufacturer](https://www.motorola.com.br/edge-50-pro)

## Próximos Passos
1. [ ] Revisar e ajustar scores em `src/data/generated/products/motorola-edge-50-pro.ts`
2. [ ] Preencher conteúdo editorial no mock `src/data/generated/mocks/motorola-edge-50-pro.json`
3. [ ] Adicionar imagem do produto em `public/images/products/motorola-edge-50-pro.webp`
4. [ ] Rodar `npm run validate:product -- --id=motorola-edge-50-pro`
5. [ ] Se aprovado, mover para `src/data/products.ts` e status: 'published'
