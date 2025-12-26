@echo off
REM ==========================================================
REM ComparaTop - Image Sync (Safe Mode)
REM ==========================================================
REM Este script SINCRONIZA imagens com deleção CONTROLADA.
REM ATENÇÃO: Pode deletar arquivos do R2 que não existem localmente!
REM
REM Proteções:
REM   - Dry-run obrigatório primeiro (--dry-run)
REM   - Limite de deleções (--max-delete 50)
REM   - Backup antes de deletar (--backup-dir)
REM
REM Uso: scripts\images-sync-safe.bat [--execute]
REM   Sem argumentos: dry-run (mostra o que faria)
REM   Com --execute:  executa de verdade
REM ==========================================================

setlocal

REM Configuração
set REMOTE=comparatop-r2:comparatop-images
set BACKUP_REMOTE=comparatop-r2:comparatop-images-trash
set LOCAL=.\assets\images
set LOG_DIR=.\logs
set TIMESTAMP=%date:~-4,4%%date:~-7,2%%date:~-10,2%_%time:~0,2%%time:~3,2%
set LOG_FILE=%LOG_DIR%\rclone-sync-%TIMESTAMP%.log
set MAX_DELETE=50

REM Criar pasta de logs se não existir
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

echo ==========================================================
echo  ComparaTop - Image Sync (Safe Mode)
echo ==========================================================
echo.
echo  Origem:        %LOCAL%
echo  Destino:       %REMOTE%
echo  Backup:        %BACKUP_REMOTE%/%TIMESTAMP%/
echo  Max Delete:    %MAX_DELETE% arquivos
echo  Log:           %LOG_FILE%
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

REM Verificar modo
if "%1"=="--execute" (
    echo  MODO: EXECUTE (sync real com delecao)
    echo.
    echo  ATENCAO: Arquivos podem ser DELETADOS do R2!
    echo  Deletados irao para: %BACKUP_REMOTE%/%TIMESTAMP%/
    echo.
    set /p CONFIRM="Tem certeza? (s/N): "
    if /i not "%CONFIRM%"=="s" (
        echo.
        echo [CANCELADO] Operacao cancelada pelo usuario.
        pause
        exit /b 0
    )
    set DRY_RUN=
) else (
    echo  MODO: DRY-RUN (apenas simulacao, nada sera alterado)
    echo.
    set DRY_RUN=--dry-run
)

echo ==========================================================
echo.
echo [INFO] Iniciando sync...
echo.

rclone sync "%LOCAL%" "%REMOTE%" ^
    %DRY_RUN% ^
    --progress ^
    --transfers 4 ^
    --checkers 8 ^
    --max-delete %MAX_DELETE% ^
    --backup-dir "%BACKUP_REMOTE%/%TIMESTAMP%" ^
    --log-file="%LOG_FILE%" ^
    --log-level INFO ^
    --stats 10s ^
    --stats-one-line

set RESULT=%ERRORLEVEL%

echo.
if %RESULT% equ 0 (
    if "%DRY_RUN%"=="--dry-run" (
        echo [OK] Dry-run concluido. Nenhuma alteracao foi feita.
        echo.
        echo Para executar de verdade, rode:
        echo   scripts\images-sync-safe.bat --execute
    ) else (
        echo [OK] Sync concluido com sucesso!
        echo.
        echo Arquivos deletados foram movidos para:
        echo   %BACKUP_REMOTE%/%TIMESTAMP%/
    )
) else (
    echo [ERRO] Falha no sync. Codigo: %RESULT%
    echo.
    if %RESULT% equ 7 (
        echo O limite de %MAX_DELETE% delecoes foi atingido.
        echo Verifique manualmente ou aumente --max-delete.
    )
)

echo.
echo Verifique o log: %LOG_FILE%
echo.
pause
