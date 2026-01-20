@echo off
echo 🧹 Limpando processos Node.js...
taskkill /F /IM node.exe >nul 2>&1
echo ✅ Processos limpos!
timeout /t 2 /nobreak >nul
echo 🚀 Iniciando servidor de desenvolvimento...
npm run dev
