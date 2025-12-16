@echo off
setlocal enabledelayedexpansion
title Cloud.ru AI System Checker

echo.
echo ========================================
echo   Cloud.ru AI System Checker
echo ========================================
echo.

set "ERRORS=0"
set "WARNINGS=0"

:: ========================================
:: 1. Проверка Docker
:: ========================================
echo [1/7] Проверка Docker...
where docker >nul 2>nul
if errorlevel 1 (
    echo    ❌ Docker не найден в PATH
    set /a ERRORS+=1
) else (
    echo    ✅ Docker найден
    docker --version >nul 2>&1
    if errorlevel 1 (
        echo    ⚠️  Docker установлен, но не работает
        set /a WARNINGS+=1
    ) else (
        for /f "tokens=*" %%i in ('docker --version') do echo    ℹ️  %%i
    )
)

:: Проверка Docker Desktop (Windows)
tasklist /FI "IMAGENAME eq Docker Desktop.exe" 2>nul | find /I /N "Docker Desktop.exe">nul
if errorlevel 1 (
    echo    ⚠️  Docker Desktop может быть не запущен
    set /a WARNINGS+=1
) else (
    echo    ✅ Docker Desktop запущен
)

echo.

:: ========================================
:: 2. Проверка Python
:: ========================================
echo [2/7] Проверка Python...
where python >nul 2>nul
if errorlevel 1 (
    echo    ❌ Python не найден в PATH
    set /a ERRORS+=1
) else (
    echo    ✅ Python найден
    for /f "tokens=*" %%i in ('python --version 2^>^&1') do echo    ℹ️  %%i
    
    :: Проверка версии Python (минимум 3.8)
    python -c "import sys; exit(0 if sys.version_info >= (3, 8) else 1)" 2>nul
    if errorlevel 1 (
        echo    ⚠️  Требуется Python 3.8 или выше
        set /a WARNINGS+=1
    )
)

echo.

:: ========================================
:: 3. Проверка виртуального окружения
:: ========================================
echo [3/7] Проверка виртуального окружения...

set "VENV_FOUND=0"

if exist "qik-test-qa-server\ai\.venv\Scripts\activate.bat" (
    echo    ✅ Виртуальное окружение найдено (qik-test-qa-server\ai\.venv)
    set "VENV_FOUND=1"
    set "VENV_PATH=qik-test-qa-server\ai\.venv\Scripts\python.exe"
) else if exist ".venv\Scripts\activate.bat" (
    echo    ✅ Виртуальное окружение найдено (.venv)
    set "VENV_FOUND=1"
    set "VENV_PATH=.venv\Scripts\python.exe"
) else (
    echo    ⚠️  Виртуальное окружение не найдено
    echo    ℹ️  Запустите setup_env.cmd для создания окружения
    set /a WARNINGS+=1
)

:: Проверка установленных пакетов
if !VENV_FOUND!==1 (
    if exist "!VENV_PATH!" (
        echo    ℹ️  Проверка ключевых зависимостей...
        
        "!VENV_PATH!" -c "import nats" 2>nul
        if errorlevel 1 (
            echo    ❌ nats-py не установлен (КРИТИЧНО!)
            echo    ℹ️  Запустите setup_env.cmd для установки зависимостей
            set /a ERRORS+=1
        ) else (
            echo    ✅ nats-py установлен
        )
        
        "!VENV_PATH!" -c "import openai" 2>nul
        if errorlevel 1 (
            echo    ⚠️  openai не установлен
            set /a WARNINGS+=1
        ) else (
            echo    ✅ openai установлен
        )
        
        "!VENV_PATH!" -c "import fastapi" 2>nul
        if errorlevel 1 (
            echo    ℹ️  fastapi не установлен (опционально)
        ) else (
            echo    ✅ fastapi установлен
        )
    )
)

echo.

:: ========================================
:: 4. Проверка структуры проекта
:: ========================================
echo [4/7] Проверка структуры проекта...
set "MISSING_FILES=0"

if not exist "qik-test-qa-server\ai\requirements.txt" (
    echo    ❌ Не найден: qik-test-qa-server\ai\requirements.txt
    set /a MISSING_FILES+=1
    set /a ERRORS+=1
)

if not exist "qik-test-qa-server\ai\apps\worker\src\ai_worker\nats_worker.py" (
    echo    ❌ Не найден: qik-test-qa-server\ai\apps\worker\src\ai_worker\nats_worker.py
    set /a MISSING_FILES+=1
    set /a ERRORS+=1
)

if not exist "qik-test-qa-server\deploy\compose.proxy.yml" (
    echo    ❌ Не найден: qik-test-qa-server\deploy\compose.proxy.yml
    set /a MISSING_FILES+=1
    set /a ERRORS+=1
)

if not exist "qik-test-qa-server\ai\nats_publish_generate.py" (
    echo    ⚠️  Не найден: qik-test-qa-server\ai\nats_publish_generate.py
    set /a WARNINGS+=1
)

if !MISSING_FILES!==0 (
    echo    ✅ Структура проекта корректна
)

echo.

:: ========================================
:: 5. Проверка Docker Compose
:: ========================================
echo [5/7] Проверка Docker Compose...
where docker-compose >nul 2>nul
if errorlevel 1 (
    docker compose version >nul 2>&1
    if errorlevel 1 (
        echo    ⚠️  Docker Compose не найден (используйте: docker compose)
        set /a WARNINGS+=1
    ) else (
        echo    ✅ Docker Compose (v2) найден
        for /f "tokens=*" %%i in ('docker compose version 2^>^&1') do echo    ℹ️  %%i
    )
) else (
    echo    ✅ Docker Compose найден
    for /f "tokens=*" %%i in ('docker-compose --version') do echo    ℹ️  %%i
)

echo.

:: ========================================
:: 6. Проверка NATS контейнера
:: ========================================
echo [6/7] Проверка NATS контейнера...
docker ps -a --filter "name=nats" --format "{{.Names}}" 2>nul | findstr /i "nats" >nul
if errorlevel 1 (
    echo    ℹ️  NATS контейнер не запущен
) else (
    docker ps --filter "name=nats" --format "{{.Status}}" 2>nul | findstr /i "Up" >nul
    if errorlevel 1 (
        echo    ⚠️  NATS контейнер существует, но не запущен
        set /a WARNINGS+=1
    ) else (
        echo    ✅ NATS контейнер запущен
        for /f "tokens=*" %%i in ('docker ps --filter "name=nats" --format "{{.Names}}: {{.Status}}" 2^>nul') do echo    ℹ️  %%i
    )
)

:: Проверка доступности порта 4222
netstat -an 2>nul | findstr ":4222" >nul
if errorlevel 1 (
    echo    ⚠️  Порт 4222 не прослушивается
    set /a WARNINGS+=1
) else (
    echo    ✅ Порт 4222 доступен
)

echo.

:: ========================================
:: 7. Проверка переменных окружения
:: ========================================
echo [7/7] Проверка переменных окружения...
set "ENV_OK=1"

if "%NATS_URL%"=="" (
    echo    ⚠️  NATS_URL не установлена (по умолчанию: nats://localhost:4222)
    set /a WARNINGS+=1
    set "ENV_OK=0"
) else (
    echo    ✅ NATS_URL=%NATS_URL%
)

if "%LLM_API_KEY%"=="" (
    echo    ⚠️  LLM_API_KEY не установлена
    set /a WARNINGS+=1
    set "ENV_OK=0"
) else (
    if "%LLM_API_KEY%"=="YOUR_QWEN_API_KEY_HERE" (
        echo    ⚠️  LLM_API_KEY установлена, но использует значение по умолчанию
        set /a WARNINGS+=1
    ) else (
        echo    ✅ LLM_API_KEY установлена
    )
)

if "%LLM_BASE_URL%"=="" (
    echo    ⚠️  LLM_BASE_URL не установлена
    set /a WARNINGS+=1
    set "ENV_OK=0"
) else (
    echo    ✅ LLM_BASE_URL=%LLM_BASE_URL%
)

if "%LLM_MODEL%"=="" (
    echo    ⚠️  LLM_MODEL не установлена
    set /a WARNINGS+=1
    set "ENV_OK=0"
) else (
    echo    ✅ LLM_MODEL=%LLM_MODEL%
)

if "%USE_REAL_LLM%"=="" (
    echo    ℹ️  USE_REAL_LLM не установлена (по умолчанию: false)
)

echo.

:: ========================================
:: Итоговый отчет
:: ========================================
echo ========================================
echo   Итоговый отчет
echo ========================================
echo.

if %ERRORS%==0 (
    echo ✅ Критических ошибок не обнаружено
) else (
    echo ❌ Обнаружено критических ошибок: %ERRORS%
)

if %WARNINGS%==0 (
    echo ✅ Предупреждений нет
) else (
    echo ⚠️  Обнаружено предупреждений: %WARNINGS%
)

echo.

if %ERRORS%==0 (
    if %WARNINGS%==0 (
        echo ✅ Система готова к работе!
        exit /b 0
    ) else (
        echo ⚠️  Система готова, но есть предупреждения
        exit /b 0
    )
) else (
    echo ❌ Система не готова. Исправьте ошибки перед запуском.
    exit /b 1
)

