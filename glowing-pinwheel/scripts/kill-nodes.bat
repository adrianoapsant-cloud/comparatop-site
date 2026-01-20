@echo off
echo 🧹 Matando todos os processos Node.js...
taskkill /F /IM node.exe >nul 2>&1
echo ✅ Todos os processos Node.js foram encerrados!
