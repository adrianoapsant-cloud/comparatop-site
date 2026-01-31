# Como Cadastrar Produto (Mínimo)

Guia rápido para adicionar um produto ao ComparaTop sem quebrar a página.

## Campos Obrigatórios

| Campo | Tipo | Exemplo |
|-------|------|---------|
| `slug` | string | `"produto-exemplo"` |
| `name` | string | `"Produto Exemplo X1"` |
| `categoryId` | string | `"aspiradores-robo"` |
| `score` | number | `8.2` |
| `price` | object | `{ value: 999, current: "R$ 999" }` |

## Campos Recomendados

| Campo | Tipo | Default se faltando |
|-------|------|---------------------|
| `updatedAt` | ISO string | `"—"` |
| `evidenceLevel` | `"high"/"medium"/"low"` | `"medium"` |
| `shortName` | string | usa `name` |
| `contextualScore.range` | `{ min, max }` | ignorado |
| `tco.range` | `{ min, max, confidence }` | ignorado |

## Exemplo JSON Mínimo

```json
{
  "slug": "meu-produto",
  "name": "Meu Produto X1",
  "shortName": "Produto X1",
  "categoryId": "aspiradores-robo",
  "score": 7.5,
  "price": { "value": 1299, "current": "R$ 1.299" },
  "evidenceLevel": "medium"
}
```

## O que NÃO quebra a página

- `updatedAt` faltando → mostra "—"
- `evidenceLevel` faltando → assume "medium"
- `range` inválido (min > max) → ignorado automaticamente
- `confidenceNotes` faltando → null

## Validar antes de subir

```bash
npm run validate:pdp-completeness [slug]
```
