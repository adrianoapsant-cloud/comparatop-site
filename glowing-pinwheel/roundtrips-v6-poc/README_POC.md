# 🔄 Roundtrips v6 POC

**POC de Tool Calling com AI SDK v6 + Gemini 2.0 Flash**

## Status: ✅ FUNCIONANDO

O roundtrip texto→tool→texto está operacional.

---

## Versões Testadas

| Pacote | Versão |
|--------|--------|
| `ai` | 6.0.39 |
| `@ai-sdk/google` | 3.0.10 |
| `@ai-sdk/react` | 3.0.41 |
| `zod` | 3.25.76 |
| `next` | 16.1.1 |

---

## Como Rodar

```bash
cd roundtrips-v6-poc
npm install
npm run dev
# Acesse: http://localhost:3002
```

---

## Variáveis de Ambiente

Crie `.env.local`:

```env
GOOGLE_GENERATIVE_AI_API_KEY=sua_chave_aqui
```

> ⚠️ **NÃO usar variáveis Vertex** (GOOGLE_VERTEX_*, GOOGLE_CLOUD_PROJECT, etc.)

---

## Correções Aplicadas (v6)

### 1. Tool Schema: `inputSchema` em vez de `parameters`

**❌ Errado (v4 antigo):**
```ts
tools: {
  search: tool({
    parameters: z.object({ query: z.string() }),  // ❌
    execute: async (args) => {...}
  })
}
```

**✅ Correto (v6):**
```ts
tools: {
  search: tool({
    inputSchema: z.object({ query: z.string().min(1) }),  // ✅
    execute: async (args) => {...}
  })
}
```

### 2. Import do Zod

**❌ Errado:**
```ts
import { z } from 'ai';  // ❌ Não existe no v6
```

**✅ Correto:**
```ts
import { z } from 'zod';  // ✅
```

### 3. Conversão de Mensagens

O `useChat` envia `UIMessage[]`, mas `streamText` espera `ModelMessage[]`:

```ts
import { convertToModelMessages, UIMessage } from 'ai';

const rawMessages = body.messages as UIMessage[];
const messages = await convertToModelMessages(rawMessages);

streamText({
  model: google('gemini-2.0-flash'),
  messages,  // ✅ Agora é ModelMessage[]
  tools: {...}
});
```

---

## Como Testar o Roundtrip

1. Acesse http://localhost:3002
2. Digite: **"busque tvs baratas"**
3. Observe no terminal do servidor:
   ```
   [POC] Tool called: search_products
   [POC] Args: { query: 'tv barata', category: '' }
   ```
4. A UI deve mostrar:
   - Card amarelo com "🔧 Tool: search_products"
   - Resultado da busca
   - Texto final do assistente após processar o resultado

---

## 🧪 Fluxo de Teste: Catalog Snapshot

Os 4 prompts de teste que validam todo o fluxo:

| # | Prompt | Esperado |
|---|--------|----------|
| 1 | "quais TVs vocês têm?" | Lista 5 TVs + badge verde "📦 5 produtos" |
| 2 | "compare as 2 melhores" | Compara LG C3 OLED (9.1) vs Sony X90L (8.7) |
| 3 | "quanto gastam por mês?" | ~19 kWh = R$14,25/mês (LG), ~27 kWh = R$20,25/mês (Sony) |
| 4 | "tem manual?" | Links: lg.com/manual/c3, sony.com/manual/x90l |

### Logs do Servidor Confirmando Fluxo

```
{"event":"INTENT_DETECTION","intent":"catalog"}
{"event":"SNAPSHOT_RECEIVED","hasSnapshot":true,"productCount":5,"focusIds":["3","4"]}
{"event":"MODE_DETAILS","reason":"details_intent_with_snapshot"}
```

---

## Arquitetura Simplificada

```
┌────────────────┐     UIMessage[]      ┌──────────────────┐
│  Client (React)│ ─────────────────────▶│  /api/chat       │
│  useChat()     │                       │                  │
└────────────────┘                       │ convertToModel   │
        ▲                                │ Messages()       │
        │                                │      ▼           │
        │                                │ streamText()     │
        │     UIMessageStream            │   + tools        │
        └────────────────────────────────│      ▼           │
                                         │ Gemini 2.0 Flash │
                                         └──────────────────┘
```

---

## Logs de Debug Confirmando Funcionamento

```
[POC] Provider: @ai-sdk/google (Gemini API, NOT Vertex)
[POC] Model: gemini-2.0-flash
[POC] Messages count: 1
[POC] Tool called: search_products
[POC] Args: { query: 'TV LED', category: 'TV' }
POST /api/chat 200 in 2.2s
```

---

## Nota sobre Bug #9761

O bug [#9761](https://github.com/vercel/ai/issues/9761) afeta **@ai-sdk/google-vertex** (Vertex AI), não **@ai-sdk/google** (Gemini API direta).

Esta POC usa `@ai-sdk/google` e **não é afetada** pelo bug.
