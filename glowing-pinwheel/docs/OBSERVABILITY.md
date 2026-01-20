# Observabilidade Runtime

> Sistema de monitoramento mínimo viável (MVP) para saúde de produtos e eventos de fallback.

## Endpoints

### GET /api/health/products

Retorna snapshot de saúde dos produtos cadastrados.

**Resposta:**
```json
{
  "timestamp": "2026-01-19T21:00:00.000Z",
  "overall": "OK",
  "counts": {
    "published_ok": 5,
    "published_warn": 0,
    "published_fail": 0,
    "draft_ok": 5,
    "draft_warn": 9
  },
  "topExamples": [
    {
      "slug": "produto-exemplo",
      "category": "tv",
      "status": "draft",
      "health": "WARN",
      "reasons": ["MISSING_IMAGE"]
    }
  ],
  "notes": "CI falha apenas se published_fail > 0"
}
```

**Status:**
- `OK`: Todos os produtos published estão saudáveis
- `WARN`: Existem produtos com warnings (drafts são permitidos)
- `FAIL`: Existem produtos published com erros críticos

---

### GET /api/health/events

Retorna eventos recentes do ring buffer.

**Query Params:**
| Param | Valores | Default |
|-------|---------|---------|
| category | `product_health`, `fallback`, `route_error` | - |
| level | `info`, `warn`, `error` | - |
| limit | 1-100 | 50 |

**Resposta:**
```json
{
  "timestamp": "2026-01-19T21:00:00.000Z",
  "stats": {
    "total": 5,
    "byLevel": { "info": 0, "warn": 5, "error": 0 },
    "byCategory": { "product_health": 2, "fallback": 3, "route_error": 0 }
  },
  "events": [
    {
      "ts": "2026-01-19T21:00:00.000Z",
      "level": "warn",
      "category": "fallback",
      "message": "2 slug(s) não encontrados",
      "route": "/comparar",
      "data": { "removed": ["slug-invalido"], "kept": ["samsung-qn90c-65"] }
    }
  ]
}
```

---

## Testar Local

1. **Iniciar servidor:**
   ```bash
   npm run dev
   ```

2. **Verificar saúde dos produtos:**
   ```
   http://localhost:3000/api/health/products
   ```

3. **Provocar um fallback:**
   ```
   http://localhost:3000/comparar?slugs=invalido,samsung-qn90c-65,tcl-c735-65
   ```

4. **Ver eventos registrados:**
   ```
   http://localhost:3000/api/health/events?limit=10
   ```

---

## Categorias de Eventos

| Categoria | Quando é logado |
|-----------|-----------------|
| `product_health` | Produtos com health=FAIL são removidos de listas |
| `fallback` | Slugs inválidos são removidos da comparação |
| `route_error` | Produto não encontrado em rota VS |

---

## Adicionar Novos Logs

```typescript
import { logEvent } from '@/lib/observability/logger';

logEvent({
    level: 'warn',           // 'info' | 'warn' | 'error'
    category: 'fallback',    // 'product_health' | 'fallback' | 'route_error'
    message: 'Descrição curta',
    route: '/minha-rota',    // opcional
    data: { ... },           // opcional, dados técnicos
});
```

---

## Notas Técnicas

- **Ring buffer:** Máximo de 300 eventos em memória
- **Deduplicação:** Eventos iguais são ignorados por 60s
- **Serverless:** Buffer reinicia em cold start (aceitável para MVP)
- **Sem PII:** Logs contêm apenas dados técnicos (slugs, códigos de erro)
