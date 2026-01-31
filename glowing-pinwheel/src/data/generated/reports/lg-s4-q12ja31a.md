# Scaffold Audit Report: lg-s4-q12ja31a

## Metadados
- **Gerado em**: 2026-01-22T11:56:57.045Z
- **Categoria**: air_conditioner
- **Status**: draft
- **Template**: Minimal (sem template gold)
- **Input Hash**: ee2bf6ae

## Produto
| Campo | Valor |
|-------|-------|
| Nome | LG Dual Inverter Voice S4-Q12JA31A 12000 BTUs |
| Marca | LG |
| Modelo | S4-Q12JA31A |
| Preço | R$ 2.799 |
| ASIN | B0CACEXAMPLE |

## Energia Derivada
- **Fonte**: `label`
- **Consumo**: 45.5 kWh/mês
- **Cálculo**: Etiqueta: 45.5 kWh/mês

## Regras Determinísticas Aplicadas

- **inverter-efficiency-bonus**: Inverter melhora eficiência (c1) em +1.5 → c1 += 1.5
- **dual-inverter-extra**: Dual Inverter melhora eficiência (c1) em +0.5 adicional → c1 += 0.5
- **inverter-noise-bonus**: Inverter melhora ruído (c3) em +0.5 → c3 += 0.5
- **wifi-smart-bonus**: WiFi melhora conectividade (c7) em +1.5 → c7 += 1.5

## Campos Recomendados Ausentes
_Todos os campos recomendados estão presentes._



## Warnings
_Nenhum warning._



## Fontes Consultadas
1. [amazon](https://www.amazon.com.br/dp/B0CACEXAMPLE)
2. [manufacturer](https://www.lg.com.br/ar-condicionado-dual-inverter)

## Próximos Passos
1. [ ] Revisar e ajustar scores em `src/data/generated/products/lg-s4-q12ja31a.ts`
2. [ ] Preencher conteúdo editorial no mock `src/data/generated/mocks/lg-s4-q12ja31a.json`
3. [ ] Adicionar imagem do produto em `public/images/products/lg-s4-q12ja31a.webp`
4. [ ] Rodar `npm run validate:product -- --id=lg-s4-q12ja31a`
5. [ ] Se aprovado, mover para `src/data/products.ts` e status: 'published'
