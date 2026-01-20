---
description: Como iniciar o servidor de desenvolvimento do ComparaTop
---

# Iniciar Servidor de Desenvolvimento

## IMPORTANTE: Projeto e Diretório Corretos
O projeto ComparaTop está em:
```
C:\Users\Adriano Antonio\Desktop\Projeto_ComparaTop_Oficial\glowing-pinwheel
```

A plataforma AI (Chat) está em:
```
C:\Users\Adriano Antonio\Desktop\Projeto_ComparaTop_Oficial\glowing-pinwheel\warped-equinox
```

## Passos para Iniciar os Servidores

// turbo-all

### 1. Matar processos Node.js antigos (se houver)
```powershell
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
```

### 2. Limpar cache do Next.js (se houver erros)
```cmd
cmd /c "cd /d C:\Users\Adriano Antonio\Desktop\Projeto_ComparaTop_Oficial\glowing-pinwheel && rmdir /s /q .next 2>nul"
```

### 3. Iniciar o servidor da Loja (Terminal 1)
**IMPORTANTE:** Use `cmd /c` para evitar problemas com políticas de execução do PowerShell:
```cmd
cmd /c "cd /d C:\Users\Adriano Antonio\Desktop\Projeto_ComparaTop_Oficial\glowing-pinwheel && npm run dev"
```

### 4. Iniciar o servidor do Chat AI (Terminal 2)
```cmd
cmd /c "cd /d C:\Users\Adriano Antonio\Desktop\Projeto_ComparaTop_Oficial\glowing-pinwheel\warped-equinox && npm run dev"
```

### 5. Verificar se está rodando
- **Loja:** http://localhost:3000
- **Chat AI:** http://localhost:3001

## URLs Importantes
- **Home:** http://localhost:3000
- **Demo Scoring:** http://localhost:3000/ferramentas/demo-scoring
- **Categorias:** http://localhost:3000/categorias/smart-tvs
- **Chat:** http://localhost:3000/chat

## Resolução de Problemas

### Erro: "Can't resolve 'tailwindcss'"
1. Limpar cache: `rmdir /s /q .next`
2. Reinstalar dependências: `npm install`
3. Reiniciar servidor

### Erro: "npm.ps1 cannot be loaded" (Política de Execução)
Use `cmd /c` antes do comando npm:
```cmd
cmd /c "npm run dev"
```

### Porta 3000 ou 3001 já em uso
```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :3001
taskkill /PID <pid> /F
```

## Última Atualização
- **Data:** 2026-01-16 06:55
- **Nota:** Projeto movido para Desktop/Projeto_ComparaTop_Oficial. warped-equinox agora está dentro de glowing-pinwheel.
