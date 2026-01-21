# Runbook: Data Correction Feature - Release/QA

## Bloco 1) Runbook de Deploy

### 1.1 Aplicar Migration

**Caminho padrão do projeto:** Dashboard (SQL Editor)

1. Acesse [app.supabase.com](https://app.supabase.com) → seu projeto
2. **SQL Editor** no menu lateral
3. Cole o conteúdo de:
   ```
   supabase/migrations/20260121_feedback_data_correction.sql
   ```
4. Clique **Run**

**Alternativa via CLI:**
```bash
supabase login
supabase link --project-ref <seu-project-ref>
supabase db push
```

---

### 1.2 Verificar Migration

**Query 1 - Confirmar colunas criadas:**
```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'feedback_logs'
  AND column_name IN ('element_id', 'feedback_type', 'suggested_fix', 'status')
ORDER BY column_name;
```

**Resultado esperado:** 4 rows com as novas colunas.

**Query 2 - Smoke test (insert + select):**
```sql
-- INSERT de teste
INSERT INTO feedback_logs (
    element_id, feedback_type, reason_text, status, rating
) VALUES (
    'test_smoke', 'content_error', 'Smoke test - pode deletar', 'new', false
)
RETURNING id, element_id, feedback_type, status;

-- DELETE do teste
DELETE FROM feedback_logs WHERE element_id = 'test_smoke';
```

**Query 3 - Verificar tabela api_rate_limits:**
```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'api_rate_limits'
ORDER BY column_name;
```

---

### 1.3 Rollback (se necessário)

**Baixo risco** - colunas são aditivas (ADD COLUMN), não quebram registros existentes.

Se precisar reverter:
```sql
ALTER TABLE feedback_logs 
    DROP COLUMN IF EXISTS element_id,
    DROP COLUMN IF EXISTS feedback_type,
    DROP COLUMN IF EXISTS suggested_fix,
    DROP COLUMN IF EXISTS status;

DROP TABLE IF EXISTS api_rate_limits;
```

---

### 1.4 Config Checklist (Env Vars)

| Variável | Uso | Comportamento se ausente |
|----------|-----|--------------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto | API falha com 501 |
| `SUPABASE_SERVICE_ROLE_KEY` | Insert server-side | **Fallback seguro:** console.log + retorna `{ ok: true, mode: 'dev' }` |

**Verificar em `.env.local`:**
```bash
grep -E "(SUPABASE_URL|SERVICE_ROLE)" .env.local
```

---

## Bloco 2) QA Checklist

### 2.1 UI/UX (PDP)

| # | Teste | Como verificar | ✅/❌ |
|---|-------|---------------|------|
| 1 | CTA aparece abaixo da Ficha Técnica | Abrir qualquer PDP (ex: `/produto/roborock-q7-l5`) | |
| 2 | Modal abre ao clicar CTA | Clicar "Corrigir esta seção" | |
| 3 | Modal fecha com ESC | Pressionar ESC com modal aberto | |
| 4 | Modal fecha clicando fora | Clicar no backdrop escuro | |
| 5 | Modal fecha com botão X | Clicar no X no header | |
| 6 | Textarea comment obrigatório | Tentar submeter vazio | |
| 7 | Estado loading ao submeter | Submeter e observar spinner | |
| 8 | Estado success após envio | Observar botão verde + toast | |
| 9 | Toast aparece | Verificar canto da tela | |
| 10 | Mobile não quebra layout | DevTools → Toggle device (iPhone 12) | |

---

### 2.2 Network/API

**Teste de request:**
```bash
# Testar API diretamente
curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "feedbackType": "content_error",
    "elementId": "pdp_specs",
    "comment": "Teste de QA - pode deletar",
    "pageUrl": "http://localhost:3000/produto/teste"
  }'
```

**Resposta esperada (200):**
```json
{"ok":true,"id":"uuid-aqui","message":"Obrigado! Vamos revisar e corrigir. 🔍"}
```

**Teste de rate limit:**
```bash
# Rodar 11 vezes seguidas (limite = 10/hora)
for i in {1..11}; do
  curl -s -X POST http://localhost:3000/api/feedback \
    -H "Content-Type: application/json" \
    -d '{"feedbackType":"content_error","elementId":"test","comment":"Rate limit test '$i'"}' \
    | jq '.ok, .message'
done
```

**Resposta esperada no 11º:**
```json
{"ok":false,"message":"Limite de envios atingido. Tente novamente em 1 hora."}
```
Status code: 429

---

### 2.3 Banco (Supabase)

**Query para verificar row inserida:**
```sql
SELECT 
    id, 
    element_id, 
    feedback_type, 
    reason_text AS comment,
    suggested_fix,
    status,
    created_at,
    user_agent
FROM feedback_logs
WHERE feedback_type = 'content_error'
ORDER BY created_at DESC
LIMIT 5;
```

**Checklist de campos:**
- [ ] `element_id` = 'pdp_specs'
- [ ] `feedback_type` = 'content_error'
- [ ] `status` = 'new'
- [ ] `created_at` preenchido
- [ ] `reason_text` contém o comentário

**Limpar dados de teste:**
```sql
DELETE FROM feedback_logs 
WHERE reason_text ILIKE '%teste%' OR reason_text ILIKE '%test%';

DELETE FROM api_rate_limits WHERE endpoint = 'feedback';
```

---

## Bloco 3) Self-Review de Código

### 3.1 Arquivos Tocados

| Path | Motivo |
|------|--------|
| `supabase/migrations/20260121_feedback_data_correction.sql` | Nova migration (colunas + índices) |
| `src/app/api/feedback/route.ts` | Union schema + rate limit por IP |
| `src/components/feedback/DataCorrectionModal.tsx` | Novo modal de correção |
| `src/components/feedback/InlineDataCorrectionCTA.tsx` | Novo CTA inline |
| `src/components/feedback/index.ts` | Barrel export |
| `src/components/TechSpecsAccordion.tsx` | Adicionado CTA + prop productSlug |
| `docs/implementation_plan_feedback.md` | Documentação |

---

### 3.2 Retrocompatibilidade do `/api/feedback`

**Campos antigos aceitos (FeedbackWidget):**
```typescript
{ rating, productSku?, categorySlug?, pageUrl?, reason?, reasonText? }
```

**Campos novos aceitos (DataCorrectionModal):**
```typescript
{ feedbackType: 'content_error', elementId, comment, suggestedFix?, productSlug?, pageUrl? }
```

**Decisão do union schema:**
- Se `feedbackType === 'content_error'` → usa DataCorrectionSchema
- Senão → assume LegacyFeedbackSchema

**Código de discriminação (route.ts:174):**
```typescript
const isDataCorrection = 'feedbackType' in data && data.feedbackType === 'content_error';
```

---

### 3.3 Segurança/Privacidade

| Item | Status | Nota |
|------|--------|------|
| Email/telefone salvos? | ❌ Não | Feedback é anônimo |
| user_agent salvo? | ✅ Sim | Para debug de browser issues |
| Necessário user_agent? | ⚠️ Opcional | Pode remover se não usar |
| IP salvo? | ❌ Não | Apenas rate limit in-memory |
| PII no payload? | ❌ Não | Só comment/suggested_fix controlados |

---

### 3.4 Observabilidade

**Logs atuais:**
```typescript
console.log('[Feedback] Would save:', data);        // Dev mode
console.error('[Feedback] Insert error:', error);   // Produção
```

**Dados sensíveis logados?** ❌ Não - apenas meta, não payload completo

**Recomendação futura:** Adicionar structured logging com campos sanitizados.

---

## Próximo Passo (após QA passar)

**Escopo do next PR:** Adicionar CTA em 1 seção adicional

**Candidatas:**
1. `OwnershipInsights.tsx` (TCO) - elementId: `pdp_tco`
2. `BenchmarksSection` (Performance) - elementId: `pdp_benchmarks`

**Plano:**
1. Importar `InlineDataCorrectionCTA` 
2. Adicionar antes do fechamento do componente
3. Passar `elementId` e `sectionLabel` apropriados
4. Testar build + visual

**Estimativa:** ~15 minutos de código + teste
