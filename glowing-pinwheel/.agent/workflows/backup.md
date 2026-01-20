---
description: Como fazer backup completo do projeto ComparaTop
---

# Backup do Projeto ComparaTop

## ⚠️ ATENÇÃO: LEIA ANTES DE FAZER QUALQUER COISA

### O Projeto Principal Ativo É:
```
c:\Users\Adriano Antonio\.gemini\antigravity\playground\eternal-cosmos
```

### O Backup Completo Mais Recente É:
```
C:\Users\Adriano Antonio\Desktop\backup_COMPLETO_2026-01-10_20-40
```

**NÃO USE** outros projetos como:
- ❌ `glowing-pinwheel` (projeto temporário de testes)
- ❌ `primordial-cassini` (versão antiga, migrado para eternal-cosmos)
- ❌ Qualquer outro workspace que não seja `eternal-cosmos`

## Histórico de Projetos (para referência)

| Data | Projeto Ativo | Notas |
|------|---------------|-------|
| Até 09/01/2026 | `primordial-cassini` | Projeto original |
| 10/01/2026 | `eternal-cosmos` | Migração + scoring contextual |

## Como Fazer Backup Completo

// turbo-all

1. Execute o comando de cópia:
```powershell
Copy-Item -Path "c:\Users\Adriano Antonio\.gemini\antigravity\playground\eternal-cosmos" -Destination "C:\Users\Adriano Antonio\Desktop\backup_COMPLETO_YYYY-MM-DD_HH-MM" -Recurse -Force
```
Substitua `YYYY-MM-DD_HH-MM` pela data e hora atual.

2. Aguarde a conclusão (~60 segundos devido ao node_modules).

3. Atualize os arquivos de contexto na área de trabalho:
   - `ComparaTop_Ferramentas.md` - Atualize a data e caminho do backup
   - `ComparaTop_Contexto.md` - Atualize a data

## Verificação do Backup

O backup está correto se tiver TODOS esses diretórios em `src/`:
```
src/
├── actions/           # Server actions
├── api/               # API routes
├── app/               # Next.js App Router (páginas)
├── components/        # 9+ pastas (ai, comparison, demo, engines, pdp, product, scoring, seo, ui)
├── config/            # Configurações
├── contexts/          # React contexts
├── core/              # Core utilities
├── data/              # Dados + rules/ + mocks/
├── hooks/             # Custom hooks
├── lib/               # Libraries + scoring/
└── types/             # TypeScript types
```

**Se faltar qualquer uma dessas pastas, o backup está INCOMPLETO!**

## Último Backup Consolidado
- **Data:** 2026-01-10 às 20:40
- **Local:** `C:\Users\Adriano Antonio\Desktop\backup_COMPLETO_2026-01-10_20-40`
- **Conteúdo:** 
  - Base do projeto (primordial_cassini 09/01)
  - Sistema de Scoring Contextual (10 tipos, 52 regras JSON)
  - Demo page em `/ferramentas/demo-scoring`
