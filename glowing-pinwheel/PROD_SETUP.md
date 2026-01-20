# ComparaTop — Production Setup Guide

Este documento guia a configuração de produção para deploy na Vercel.

---

## 1. Supabase Setup

### 1.1 Criar Projeto
1. Acesse [supabase.com](https://supabase.com)
2. Crie novo projeto (região: São Paulo se disponível)
3. Anote a senha do banco

### 1.2 Obter Credenciais
Em **Project Settings > API**:
- `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto
- `SUPABASE_ANON_KEY`: anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: service_role key (⚠️ manter secreto)

### 1.3 Rodar Migrations
No **SQL Editor**, execute na ordem:

1. `supabase/migrations/20260114_smart_value_tco.sql`
   - Cria: energy_rates, smart_alerts, calculate_dynamic_tco

2. `supabase/migrations/20260117_energy_profiles.sql`
   - Cria: energy_profiles

### 1.4 Seed inicial
```bash
curl -X POST https://SEU-DOMINIO/api/supabase/seed-energy-rates \
  -H "x-setup-key: SEU_SUPABASE_SETUP_KEY"
```

### 1.5 Verificar
```bash
curl https://SEU-DOMINIO/api/supabase/status \
  -H "x-setup-key: SEU_SUPABASE_SETUP_KEY"
```
Esperar: `configured: true, canConnect: true`

---

## 2. Vercel Environment Variables

### Obrigatórias
| Variável | Descrição |
|----------|-----------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | API Key do Google AI Studio |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_ANON_KEY` | Chave anon do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave service_role (secret) |
| `SUPABASE_SETUP_KEY` | Chave para seed/status (secret) |
| `ADMIN_PASSWORD_HASH` | bcrypt hash da senha admin |
| `ADMIN_LOG_SALT` | Salt para hash de IPs em logs |

### Opcionais
| Variável | Descrição | Default |
|----------|-----------|---------|
| `ADMIN_IP_ALLOWLIST_ENABLED` | Ativar IP allowlist | `false` |
| `ADMIN_ALLOWED_IPS` | IPs permitidos (CSV) | - |
| `LLM_COST_USD_PER_1M_INPUT` | Custo por 1M tokens input | `0.15` |
| `LLM_COST_USD_PER_1M_OUTPUT` | Custo por 1M tokens output | `0.60` |
| `IMMU_API_KEY` | Chave para /api/health/prod | - |

---

## 3. Checklist Pós-Deploy

### Automatizado
```bash
curl https://SEU-DOMINIO/api/health/prod \
  -H "x-api-key: SEU_IMMU_API_KEY"
```
Esperar: `"ok": true`

### Manual
1. **Supabase**: `/api/supabase/status` → configured=true
2. **Energy Rates**: `/api/energy-rates?state=SP` → source="supabase"
3. **Smart Alerts**: POST retorna 200, não 501
4. **Chat**: "melhor TV até 5000" → responde com consumo
5. **DEV Routes**: `/dev/immunity-insights` → 404

---

## 4. Segurança

### Confirmado ✅
- `/dev/*` retorna 404 em produção
- `/admin` requer autenticação
- Rotas internas: X-Robots-Tag noindex
- AI bots bloqueados em rotas internas
- robots.txt bloqueia /admin, /dev, /api internos

---

## 5. Troubleshooting

### "configured: false"
→ Verificar NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY

### "canConnect: false"
→ Verificar se IP da Vercel está liberado no Supabase (se usar allowlist)

### "source: mock" em energy-rates
→ Migrations não aplicadas ou tabela vazia. Rodar seed.

### 501 em smart-alerts
→ Supabase não configurado. Verificar env vars.
