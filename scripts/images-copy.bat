@echo off
REM ==========================================================
REM ComparaTop - Image Copy (Incremental, Safe)
REM ==========================================================
REM Este script COPIA imagens locais para o R2 sem deletar nada.
REM É o modo mais seguro - só adiciona, nunca remove.
REM
REM Uso: scripts\images-copy.bat
REM ==========================================================

setlocal

REM Configuração
set REMOTE=comparatop-r2:comparatop-images
set LOCAL=.\assets\images
set LOG_DIR=.\logs
set LOG_FILE=%LOG_DIR%\rclone-copy-%date:~-4,4%%date:~-7,2%%date:~-10,2%_%time:~0,2%%time:~3,2%.log

REM Criar pasta de logs se não existir
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

echo ==========================================================
echo  ComparaTop - Image Copy (Incremental)
echo ==========================================================
echo.
echo  Origem:   %LOCAL%
echo  Destino:  %REMOTE%
echo  Log:      %LOG_FILE%
echo.
echo  MODO: COPY (apenas adiciona, nunca deleta)
echo ==========================================================
echo.

REM Verificar se rclone está instalado
where rclone >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERRO] rclone nao encontrado!
    echo.
    echo Instale rclone:
    echo   1. Via Scoop: scoop install rclone
    echo   2. Download: https://rclone.org/downloads/
    echo.
    pause
    exit /b 1
)

REM Verificar se pasta local existe
if not exist "%LOCAL%" (
    echo [ERRO] Pasta local nao encontrada: %LOCAL%
    echo.
    echo Crie a pasta e adicione imagens:
    echo   mkdir assets\images
    echo.
    pause
    exit /b 1
)

REM Executar copy
echo [INFO] Iniciando copia...
echo.

rclone copy "%LOCAL%" "%REMOTE%" ^
    --progress ^
    --transfers 4 ^
    --checkers 8 ^
    --log-file="%LOG_FILE%" ^
    --log-level INFO ^
    --stats 10s ^
    --stats-one-line

if %ERRORLEVEL% equ 0 (
    echo.
    echo [OK] Copia concluida com sucesso!
    echo.
    echo Verifique o log: %LOG_FILE%
) else (
    echo.
    echo [ERRO] Falha na copia. Verifique o log: %LOG_FILE%
)

echo.
pause
