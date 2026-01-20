---
description: Como iniciar o servidor de desenvolvimento do ComparaTop com verificação de Ready
---

# Protocolo de Inicialização do Servidor de Desenvolvimento

Este workflow garante que o servidor esteja **completamente pronto** antes de tentar acessá-lo pelo browser, evitando travamentos em `about:blank`.

## Passo 1: Verificar se já existe um servidor rodando

Antes de iniciar, verifique se já existe um servidor rodando verificando o estado do terminal ou as portas ativas.

// turbo
```bash
# Verificar portas em uso (PowerShell)
netstat -ano | findstr ":3000 :3001 :3002"
```

Se houver servidores rodando, pergunte ao usuário se deve encerrá-los primeiro.

## Passo 2: Iniciar o Servidor

Escolha o projeto correto baseado no contexto:

### Warped-Equinox (AI Platform - Porta 3001) - PADRÃO
```bash
cd "c:\Users\Adriano Antonio\Desktop\Projeto_ComparaTop_Oficial\glowing-pinwheel\warped-equinox"
npm run dev
```

### Glowing-Pinwheel (Main Store - Porta 3000)
```bash
cd "c:\Users\Adriano Antonio\Desktop\Projeto_ComparaTop_Oficial\glowing-pinwheel"
npm run dev
```

### Roundtrips-v6-POC (Testing - Porta 3002)
```bash
cd "c:\Users\Adriano Antonio\Desktop\Projeto_ComparaTop_Oficial\glowing-pinwheel\roundtrips-v6-poc"
npm run dev
```

## Passo 3: AGUARDAR até ver "Ready" no output

**CRÍTICO:** Use `command_status` para verificar o output do servidor.

O servidor está pronto quando você vir uma das seguintes mensagens:
- `✓ Ready in XXXms`
- `ready - started server`
- `Local: http://localhost:XXXX`

**NUNCA acesse o browser antes de ver "Ready"!**

### Verificação de Ready
```
Use command_status com o CommandId retornado pelo run_command.
Aguarde WaitDurationSeconds=5 para dar tempo de compilar.
Procure por "Ready" ou "started server" no output.
```

## Passo 4: Verificar conectividade HTTP (OPCIONAL mas recomendado)

Antes de usar o browser subagent, faça um teste HTTP simples:

// turbo
```bash
# PowerShell - testar se o servidor responde
Invoke-WebRequest -Uri "http://localhost:3001" -Method HEAD -TimeoutSec 5 -UseBasicParsing | Select-Object StatusCode
```

Se retornar `StatusCode: 200`, o servidor está respondendo.

## Passo 5: Acessar pelo Browser

SOMENTE após confirmar que o servidor está Ready, use o browser_subagent com estas instruções:

```
INSTRUÇÕES OBRIGATÓRIAS para o browser_subagent:

1. Navegar DIRETAMENTE para a URL (ex: http://localhost:3001)
2. NÃO esperar indefinidamente - timeout máximo de 15 segundos
3. Se a página não carregar em 15s, RETORNAR e reportar o erro
4. Capturar screenshot assim que a página carregar
5. Reportar o estado da página e retornar
```

## Troubleshooting

### Problema: Travou em about:blank
**Causa:** O browser foi acionado antes do servidor estar Ready
**Solução:** Sempre verificar "Ready" no command_status antes de usar browser_subagent

### Problema: Porta já em uso
**Causa:** Servidor anterior não foi encerrado
**Solução:** 
```powershell
# Encontrar processo na porta
netstat -ano | findstr ":3001"
# Encerrar processo (substitua PID)
taskkill /PID <PID> /F
```

### Problema: Servidor iniciou mas não responde
**Causa:** Erro de compilação ou dependências
**Solução:** Verificar o output do terminal por erros de TypeScript ou módulos faltando
