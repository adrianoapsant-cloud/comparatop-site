# Scaffold Audit Report: dreame-l20-ultra

## Metadados
- **Gerado em**: 2026-01-22T11:39:52.019Z
- **Categoria**: robot-vacuum
- **Status**: draft
- **Input Hash**: 944c3d4f

## Produto
| Campo | Valor |
|-------|-------|
| Nome | Dreame L20 Ultra Robô Aspirador e Mop com Auto-Limpeza |
| Marca | Dreame |
| Modelo | L20 Ultra |
| Preço | R$ 4.899 |
| ASIN | B0CQXYZ123 |

## Energia Derivada
- **Fonte**: `wattsUsage`
- **Consumo**: 2.93 kWh/mês
- **Cálculo**: 65W × 1.5h/dia × 30 dias ÷ 1000 = 2.92 kWh/mês

## Regras Determinísticas Aplicadas

- **lidar-navigation-bonus**: LiDAR melhora navegação (c1) em +1.0 → c1 += 1
- **auto-empty-base-bonus**: Base auto-esvaziante melhora base (c9) em +1.5 → c9 += 1.5

## Campos Recomendados Ausentes

- `hasAutoEmpty`
- `noiseLevelDb`
- `brushType`

## Warnings
_Nenhum warning._



## Fontes Consultadas
1. [amazon](https://www.amazon.com.br/dp/B0CQXYZ123)
2. [manufacturer](https://www.dreame.com.br/products/l20-ultra)

## Próximos Passos
1. [ ] Revisar e ajustar scores em `src/data/generated/products/dreame-l20-ultra.ts`
2. [ ] Preencher conteúdo editorial no mock `src/data/generated/mocks/dreame-l20-ultra.json`
3. [ ] Adicionar imagem do produto em `public/images/products/dreame-l20-ultra.webp`
4. [ ] Rodar `npm run validate:product -- --id=dreame-l20-ultra`
5. [ ] Se aprovado, mover para `src/data/products.ts` e status: 'published'
