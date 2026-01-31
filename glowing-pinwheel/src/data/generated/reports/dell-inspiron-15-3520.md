# Scaffold Audit Report: dell-inspiron-15-3520

## Metadados
- **Gerado em**: 2026-01-22T13:01:06.167Z
- **Categoria**: laptop
- **Status**: draft
- **Template**: Minimal (sem template gold)
- **Input Hash**: f9e2df32

## Produto
| Campo | Valor |
|-------|-------|
| Nome | Dell Inspiron 15 3520 i5-1235U 16GB 512GB SSD |
| Marca | Dell |
| Modelo | Inspiron 15 3520 |
| Preço | R$ 3.299 |
| ASIN | B0DEMO00001 |

## Energia Derivada
- **Fonte**: `baseline`
- **Consumo**: 10 kWh/mês
- **Cálculo**: Baseline da categoria: 10 kWh/mês

## Regras Determinísticas Aplicadas

- **ssd-storage-bonus**: SSD >= 512GB melhora armazenamento (c9) em +0.5 → c9 += 0.5
- **ram-16gb-bonus**: RAM >= 16GB melhora desempenho (c1) em +0.5 → c1 += 0.5

## Campos Recomendados Ausentes
_Todos os campos recomendados estão presentes._



## Warnings
_Nenhum warning._



## Fontes Consultadas
1. [amazon](https://amazon.com.br/dp/B0DEMO00001)
2. [manufacturer](https://dell.com.br/inspiron-3520)

## Próximos Passos
1. [ ] Revisar e ajustar scores em `src/data/generated/products/dell-inspiron-15-3520.ts`
2. [ ] Preencher conteúdo editorial no mock `src/data/generated/mocks/dell-inspiron-15-3520.json`
3. [ ] Adicionar imagem do produto em `public/images/products/dell-inspiron-15-3520.webp`
4. [ ] Rodar `npm run validate:product -- --id=dell-inspiron-15-3520`
5. [ ] Se aprovado, mover para `src/data/products.ts` e status: 'published'
