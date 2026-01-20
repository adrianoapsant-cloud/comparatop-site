---
description: Inicialização padrão ao abrir este workspace
---

# Workflow: Onboarding do Agente

⚠️ **LEIA ISSO ANTES DE QUALQUER AÇÃO!**

## REGRAS CRÍTICAS

### 🔴 PROJETO ÚNICO - NUNCA CONFUNDIR
- O projeto oficial é: **glowing-pinwheel**
- Caminho: `c:/Users/Adriano Antonio/.gemini/antigravity/playground/glowing-pinwheel`
- **IGNORE** qualquer outro projeto (eternal-cosmos, primordial-cassini, etc.)
- Esses são backups antigos ou projetos abandonados

### 🔴 PORTA FIXA = 3000
- O servidor SEMPRE roda na porta **3000** (http://localhost:3000)
- Se a porta estiver ocupada, **MATE todos os processos node antes**:
```bash
taskkill /F /IM node.exe
```
- **NUNCA** use outra porta (3001, 3002, etc.)

### 🔴 ANTES DE INICIAR QUALQUER TRABALHO
1. **Matar processos node residuais**
2. **Iniciar servidor na porta 3000**
3. **Verificar se está funcionando** em http://localhost:3000

### 🔴 BACKUPS
- Quando o usuário pedir backup, **SEMPRE faça backup COMPLETO** para a área de trabalho
- Nome padrão: `backup_glowing-pinwheel_AAAA-MM-DD_HH-MM`
- Inclua TUDO: src, package.json, .env.local, etc.

---

## Passos de Inicialização

### 1. Ler o arquivo de contexto
```
view_file CONTEXT.md
```

Este arquivo contém:
- Arquitetura do projeto
- Sistema de scoring (10 critérios)
- Estado atual do desenvolvimento
- Roteiro de estudo
- Preferências do usuário

### 2. Matar processos node existentes
// turbo
```bash
taskkill /F /IM node.exe
```

### 3. Iniciar servidor limpo
// turbo
```bash
cd "c:/Users/Adriano Antonio/.gemini/antigravity/playground/glowing-pinwheel"
npm run dev
```

### 4. Verificar servidor
Confirme que está rodando em http://localhost:3000

### 5. Perguntar ao usuário
Após ler o contexto, pergunte:
"Li o CONTEXT.md. O que gostaria de fazer hoje?"

---

## Arquivos Críticos para Escanear
- `src/config/categories.ts` - 10 critérios
- `src/lib/scoring.ts` - Algoritmo
- `src/components/ProductDetailPage.tsx` - Página principal
- `CONTEXT.md` - Arquivo de contexto
- `src/lib/scoring/` - Sistema de Scoring Contextual

---

## ⚠️ ERROS A EVITAR

1. **NÃO edite projetos antigos** (eternal-cosmos, primordial-cassini)
2. **NÃO mude a porta do servidor**
3. **NÃO sobrescreva backups sem perguntar ao usuário**
4. **NÃO restaure backups antigos** sem confirmar QUAL backup com o usuário
5. **SEMPRE salve backup completo ANTES de fazer mudanças grandes**

---

## Problemas Conhecidos e Soluções

### "Link não abre" / "Connection refused"
1. Mate todos os processos node: `taskkill /F /IM node.exe`
2. Espere 2 segundos
3. Reinicie o servidor: `npm run dev`

### "Porta ocupada"
1. Mate todos os processos node: `taskkill /F /IM node.exe`
2. Nunca use outra porta - sempre mate e reinicie

### "Código antigo aparecendo"
1. Pare o servidor
2. Delete a pasta `.next`: `Remove-Item -Recurse -Force .next`
3. Reinicie o servidor

### "Notas diferentes / Layout errado"
Verifique se está no projeto correto (glowing-pinwheel) e não em outro
