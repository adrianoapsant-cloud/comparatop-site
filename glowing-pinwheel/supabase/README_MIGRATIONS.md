# Supabase Migrations

## Executar Migration

### Via Supabase Dashboard (SQL Editor)

1. Acesse seu projeto em [app.supabase.com](https://app.supabase.com)
2. Navegue para **SQL Editor** no menu lateral
3. Cole o conteúdo de `migrations/20260114_smart_value_tco.sql`
4. Clique em **Run**

### Via Supabase CLI (opcional)

```bash
# Instalar CLI
npm install -g supabase

# Login
supabase login

# Linkar projeto
supabase link --project-ref <seu-project-ref>

# Rodar migrations
supabase db push
```

---

## Tabelas Criadas

| Tabela | Descrição |
|--------|-----------|
| `energy_rates` | Tarifas de energia por estado (UF) |
| `smart_alerts` | Alertas de preço/TCO dos usuários |

---

## Popular Dados Iniciais

A migration já inclui seed data para `energy_rates` com todas as 27 UFs.

Se precisar resetar os dados:

```sql
-- Atualizar tarifa de um estado
UPDATE energy_rates 
SET rate_kwh = 0.95, updated_at = NOW()
WHERE state_code = 'SP';

-- Verificar todas as tarifas
SELECT state_code, state_name, rate_kwh 
FROM energy_rates 
ORDER BY state_code;
```

---

## Configurar Variáveis de Ambiente

Copie `.env.example` para `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

> **IMPORTANTE**: `SUPABASE_SERVICE_ROLE_KEY` é server-only e nunca deve ser exposta no client.

---

## Fallback

Se as variáveis não estiverem configuradas:
- `/api/energy-rates` usa dados mock de `src/lib/tco/energy-rates.ts`
- `/api/smart-alerts` retorna 501 e o frontend salva em localStorage
