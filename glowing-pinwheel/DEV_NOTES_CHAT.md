# ComparaTop Chat - Notas de Desenvolvimento
*Atualizado: 2026-01-17 07:52*

## Arquitetura Atual

| Projeto | Porta | Função |
|---------|-------|--------|
| **glowing-pinwheel** | **3000** | **Loja + Chat API ativo** |
| warped-equinox | 3001 | Backend v6 alternativo (não usado) |

## Endpoint Ativo

```
Frontend → POST /api/chat (porta 3000)
         → glowing-pinwheel/src/app/api/chat/route.ts
```

**NÃO há proxy para warped-equinox** - o chat roda local no 3000.

## Payload do Chat

```json
{
  "messages": [{ "role": "user", "content": "..." }],
  "catalogSnapshot": {
    "lastResults": [{ "id", "name", "brand", "price", "score" }],
    "focusIds": ["id1", "id2"]
  },
  "sessionId": "uuid"
}
```

## Intents Determinísticos

| Intent | Trigger | Handler |
|--------|---------|---------|
| `COMPARE` | "compare", "top 2" | Top 2 do snapshot por score |
| `BUDGET_RANKING` | "até R$ 5000", "até 5k" | `parseBudget()` → `pickTopByBudget()` |
| `DETAILS` | "consumo", "kwh", "manual" | `getProductDetails()` |
| `LLM_FLOW` | fallback | Gemini com tools |

## Digital Immunity (Observabilidade)

**Endpoint de inspeção**:
```
GET /api/immunity/recent?limit=20
```

**Arquivos**:
- `src/lib/immunity/types.ts` - Interface ImmunityEvent
- `src/lib/immunity/ingest.ts` - Logger JSONL + QStash opcional
- `src/app/api/immunity/recent/route.ts` - Endpoint de inspeção

**Env vars opcionais** (para produção):
- `IMMU_API_KEY` - Protege endpoint em prod
- `IMMU_QSTASH_URL` - URL do queue
- `IMMU_QSTASH_TOKEN` - Token do queue

**Logs gravados em**: `.immunity/immunity.jsonl`

**Campos**: ts, requestId, sessionId, chat.userMessage, chat.assistantText, chat.intents, chat.mode, llm, tools, latency

## Arquivos Críticos

- `src/app/api/chat/route.ts` - Handler principal
- `src/contexts/ChatContext.tsx` - Client: sendMessage, snapshot
- `src/lib/ai/data-retrieval.ts` - Catálogo de produtos
- `src/lib/immunity/` - Observabilidade

## Multi-Intent v1.1 — Testes
*Atualizado: 2026-01-17*

O chat responde a múltiplas intents (CATALOG + COMPARE + DETAILS + MANUAL + BUDGET) no mesmo turno, sem chamar LLM.

### Prompts de Teste

| # | Mensagem | Esperado |
|---|----------|----------|
| 1 | `"tem manual? quais TVs voces tem?"` | Catálogo + Manuais (sem COMPARE) |
| 2 | `"quais TVs voces tem e compare as 2 melhores"` | Catálogo + Compare + Cards |
| 3 | `"melhor TV ate 5000 e quanto gasta por mes"` | Budget + Consumo mensal |
| 4 | `"compare as 2 melhores TVs e mande o manual"` | Compare TVs + Manuais (não geladeiras) |

### Critérios de Aceite

- ✅ Não dispara COMPARE com "tem" 
- ✅ BUDGET + DETAILS respondem no mesmo turno
- ✅ Snapshot vazio filtra por categoria mencionada
- ✅ Seção de manuais aparece quando `manual=true`

### Funções Principais

- `detectIntents(text)` → DetectedIntents (com múltiplas flags)
- `countIntents(intents)` → número de intents
- `handleDeterministicMulti(ctx)` → { text, cards, intentsUsed }

### Como Testar

```bash
# Teste 1: Catálogo + Manual
curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"tem manual? quais TVs voces tem?"}],"sessionId":"test"}'

# Teste 3: Budget + Consumo
curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"melhor TV ate 5000 e quanto gasta por mes"}],"sessionId":"test"}'
```

## BUY_LINK Intent — Links de Compra
*Atualizado: 2026-01-17*

Retorna links de compra do catálogo quando o usuário pedir.

### Triggers

- "link de compra"
- "me manda o link"
- "onde compro"
- "ver oferta"
- "comprar agora"
- "quero comprar"
- "link da amazon/magalu"

### Exemplo de Mensagem

```
Usuario: me envie o link de compra da Samsung QN90C
Chat: 🛒 **Links de Compra**
→ **Samsung QN90C Neo QLED 65"** - R$ 4.199
  [🔗 Ver Oferta na Amazon](https://amzn.to/samsung-qn90c-65)
```

### Como Cadastrar Links de Compra

Cada produto pode ter links de compra em `product.offers` no arquivo `src/data/products.ts`:

```typescript
offers: [
  {
    store: 'Amazon',
    storeSlug: 'amazon',
    price: 4199,
    url: 'https://www.amazon.com.br/dp/B0C1J5VKXK',
    affiliateUrl: 'https://amzn.to/samsung-qn90c-65',  // Preferido!
    inStock: true,
    lastChecked: '2026-01-17'
  }
]
```

**Prioridade**: `affiliateUrl` > `url` > sem link

### Arquivos

- `src/lib/catalog/offers.ts` - Helper `getPrimaryOffer()`
- `src/lib/chat/text-format.ts` - `joinBlocks()`, `normalizeSpacing()`
- `src/data/products.ts` - Dados de `offers` por produto

## Friction v1 — Rage Click + Confusion Scroll
*Atualizado: 2026-01-17*

Detecta fricção do usuário e oferece ajuda proativa.

### Detecção

| Evento | Trigger | Cooldown |
|--------|---------|----------|
| `rage_click` | 4 cliques em 900ms (mesmo alvo ou área 80x80px) | 2s |
| `confusion_scroll` | 2+ reversões de direção (>12% delta) em 2.2s | 3s |

### FrictionScore
```
frictionScore = clamp(rageClicks * 25 + confusionScrolls * 20, 0, 100)
```

Badge aparece quando `score >= 60`.

### Como Testar

1. Abra `/categorias/smart-tvs`
2. Faça 4+ cliques rápidos no mesmo filtro → badge amarelo aparece
3. Scroll sobe/desce rápido 2x → incrementa confusionScrolls
4. Clique "Quer ajuda?" → chat envia mensagem pronta

### Verificação API

```bash
# Testar ingestão de friction events
curl -X POST http://localhost:3000/api/immunity/ingest \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","events":[{"type":"rage_click","ts":"...","path":"/categorias/smart-tvs","target":"button"}]}'
# Resposta: {"success":true,"logged":1}
```

### Arquivos

- `src/lib/immunity/client-telemetry.ts` - Detecção + getFrictionSummary()
- `src/components/chat/FrictionBadge.tsx` - Badge UI + CTA
- `src/lib/immunity/types.ts` - FrictionSummary, NavEvent estendido

## Rotas Internas — Proteção Completa
*Atualizado: 2026-01-17*

Rotas internas (`/admin`, `/dev`, `/api/immunity`, `/api/supabase`) são protegidas contra indexação, bots de IA e acesso não autorizado.

### Camadas de Proteção

| Camada | Implementação | Localização |
|--------|---------------|-------------|
| **robots.txt** | Disallow para rotas internas | `src/app/robots.ts` |
| **X-Robots-Tag** | noindex, nofollow, noarchive, nosnippet | `src/middleware.ts` |
| **AI Bot Block** | 404 para user-agents de IA | `src/middleware.ts` |
| **Auth Required** | Cookie admin_session | `src/middleware.ts` |
| **Prod Block** | /dev/* retorna 404 em produção | `src/middleware.ts` |
| **Cache Headers** | no-store, no-cache | `src/middleware.ts` |

### Bots de IA Bloqueados

GPTBot, ChatGPT-User, ClaudeBot, anthropic-ai, Google-Extended, PerplexityBot, CCBot, Bytespider, Amazonbot, Meta-ExternalAgent, Diffbot, etc.

### Como Testar Bloqueio

```bash
# Teste 1: Sem auth → 404 ou redirect
curl -I http://localhost:3000/dev/immunity-insights
# Esperado: 302 → /admin/login (ou 404 em prod)

# Teste 2: Com User-Agent de IA → 404
curl -I http://localhost:3000/admin \
  -H "User-Agent: GPTBot/1.0"
# Esperado: 404 Not Found

# Teste 3: Headers de segurança
curl -I http://localhost:3000/admin \
  -H "Cookie: admin_session=valid_token"
# Esperado: X-Robots-Tag: noindex...
```

### Arquivos de Segurança

- `src/lib/internal-routes.ts` - Definição de rotas internas
- `src/lib/bot/block-ai-bots.ts` - Lista de bots de IA
- `src/lib/http/internalHeaders.ts` - Headers de proteção
- `src/middleware.ts` - Aplicação de todas as proteções

### Nota Importante

> **robots.txt não é garantia!** Bots podem ignorar robots.txt.
> A proteção real é: auth + 404 + bloqueio UA + noindex headers.
> Para 100% privado, seria necessário VPN/IP allowlist (fora do escopo).
