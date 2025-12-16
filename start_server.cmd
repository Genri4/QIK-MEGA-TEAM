@echo off
setlocal enabledelayedexpansion
title Cloud.ru AI Worker & NATS Server

echo.
echo ========================================
echo   Cloud.ru AI Worker ^& NATS Server
echo ========================================
echo.

:: ========================================
:: 1. Проверка зависимостей
:: ========================================
echo [1/5] Проверка зависимостей...

where docker >nul 2>nul
if errorlevel 1 (
    echo    ❌ ОШИБКА: Команда "docker" не найдена.
    echo    Установите Docker Desktop или убедитесь, что он добавлен в PATH.
    pause
    exit /b 1
)
echo    ✅ Docker найден

:: Проверка, что Docker Desktop запущен
docker ps >nul 2>&1
if errorlevel 1 (
    echo    ❌ ОШИБКА: Docker не отвечает. Убедитесь, что Docker Desktop запущен.
    pause
    exit /b 1
)

where python >nul 2>nul
if errorlevel 1 (
    echo    ❌ ОШИБКА: Python не найден в PATH.
    pause
    exit /b 1
)
echo    ✅ Python найден

echo.

:: ========================================
:: 2. Настройки окружения
:: ========================================
echo [2/5] Настройка переменных окружения...

rem Замените на ваши актуальные ключи
if "%NATS_URL%"=="" (
    set "NATS_URL=nats://localhost:4222"
    echo    ℹ️  NATS_URL установлена по умолчанию: %NATS_URL%
) else (
    echo    ✅ NATS_URL уже установлена: %NATS_URL%
)

if "%USE_REAL_LLM%"=="" (
    set "USE_REAL_LLM=true"
    echo    ℹ️  USE_REAL_LLM установлена по умолчанию: %USE_REAL_LLM%
)

if "%LLM_API_KEY%"=="" (
    set "LLM_API_KEY=YOUR_QWEN_API_KEY_HERE"
    echo    ⚠️  ВНИМАНИЕ: LLM_API_KEY не установлена. Используется значение по умолчанию.
    echo    ℹ️  Установите переменную окружения или измените её в этом скрипте.
) else (
    if "%LLM_API_KEY%"=="YOUR_QWEN_API_KEY_HERE" (
        echo    ⚠️  ВНИМАНИЕ: LLM_API_KEY использует значение по умолчанию.
    ) else (
        echo    ✅ LLM_API_KEY установлена
    )
)

if "%LLM_BASE_URL%"=="" (
    set "LLM_BASE_URL=https://foundation-models.api.cloud.ru/v1/chat/completions"
    echo    ℹ️  LLM_BASE_URL установлена по умолчанию: %LLM_BASE_URL%
) else (
    echo    ✅ LLM_BASE_URL уже установлена
)

if "%LLM_MODEL%"=="" (
    set "LLM_MODEL=Qwen/Qwen3-Coder-480B-A35B-Instruct"
    echo    ℹ️  LLM_MODEL установлена по умолчанию: %LLM_MODEL%
) else (
    echo    ✅ LLM_MODEL уже установлена
)

if "%GITHUB_PAT%"=="" (
    set "GITHUB_PAT=YOUR_GITHUB_PAT_HERE"
    echo    ℹ️  GITHUB_PAT не установлена (требуется только для CICD операций)
) else (
    if "%GITHUB_PAT%"=="YOUR_GITHUB_PAT_HERE" (
        echo    ℹ️  GITHUB_PAT использует значение по умолчанию
    ) else (
        echo    ✅ GITHUB_PAT установлена
    )
)

rem Настройка путей Python (для Windows)
set "PYTHONPATH=qik-test-qa-server\ai;qik-test-qa-server\ai\apps\worker\src"
echo    ℹ️  PYTHONPATH установлена: %PYTHONPATH%

echo.

:: ========================================
:: 3. Проверка виртуального окружения и зависимостей
:: ========================================
echo [3/5] Проверка виртуального окружения и зависимостей...

set "VENV_ACTIVATED=0"

if exist "qik-test-qa-server\ai\.venv\Scripts\activate.bat" (
    call "qik-test-qa-server\ai\.venv\Scripts\activate.bat"
    echo    ✅ Виртуальное окружение активировано (ai)
    set "VENV_ACTIVATED=1"
) else if exist ".venv\Scripts\activate.bat" (
    call ".venv\Scripts\activate.bat"
    echo    ✅ Виртуальное окружение активировано (корневое)
    set "VENV_ACTIVATED=1"
) else (
    echo    ⚠️  Виртуальное окружение не найдено
    echo    ℹ️  Запустите setup_env.cmd для создания окружения
    echo    ℹ️  Продолжаем без виртуального окружения...
)

rem Проверка установленных зависимостей
if !VENV_ACTIVATED!==1 (
    echo    ℹ️  Проверка ключевых зависимостей...
    
    python -c "import nats" 2>nul
    if errorlevel 1 (
        echo    ❌ КРИТИЧЕСКАЯ ОШИБКА: nats-py не установлен
        echo    ℹ️  Запустите setup_env.cmd для установки зависимостей
        echo    ℹ️  Или выполните: pip install -r qik-test-qa-server\ai\requirements.txt
        pause
        exit /b 1
    ) else (
        echo    ✅ nats-py установлен
    )
    
    python -c "import openai" 2>nul
    if errorlevel 1 (
        echo    ⚠️  Предупреждение: openai не установлен
        echo    ℹ️  Установите: pip install openai
    ) else (
        echo    ✅ openai установлен
    )
)

echo.

:: ========================================
:: 4. Запуск NATS (Docker)
:: ========================================
echo [4/5] Запуск NATS (Docker)...
echo.

rem Проверка существующего контейнера
docker ps -a --filter "name=nats" --format "{{.Names}}" 2>nul | findstr /i "nats" >nul
if not errorlevel 1 (
    echo    ℹ️  Найден существующий контейнер NATS. Останавливаем...
    docker stop nats >nul 2>&1
    docker rm nats >nul 2>&1
    timeout /t 1 /nobreak >nul
)

rem Проверка существования docker-compose файла
if not exist "qik-test-qa-server\deploy\compose.proxy.yml" (
    echo    ❌ ОШИБКА: Не найден файл qik-test-qa-server\deploy\compose.proxy.yml
    echo    ℹ️  Убедитесь, что вы запускаете скрипт из корня проекта
    pause
    exit /b 1
)

rem Запуск NATS через docker compose
echo    Запускаем NATS. Это может занять время, пока Docker инициализируется...
cd qik-test-qa-server
docker compose -f deploy/compose.proxy.yml up -d nats
if errorlevel 1 (
    echo.
    echo    ❌ КРИТИЧЕСКАЯ ОШИБКА: Не удалось запустить Docker контейнер NATS.
    echo    Убедитесь, что Docker Desktop запущен и полностью инициализирован.
    cd ..
    pause
    exit /b 1
)
cd ..

echo    ✅ NATS запущен в фоновом режиме

rem Ожидание инициализации NATS
echo    ℹ️  Ожидание инициализации NATS (3 секунды)...
timeout /t 3 /nobreak >nul

rem Проверка доступности NATS
echo    ℹ️  Проверка доступности NATS...
docker ps --filter "name=nats" --format "{{.Status}}" 2>nul | findstr /i "Up" >nul
if errorlevel 1 (
    echo    ⚠️  Предупреждение: NATS контейнер может быть ещё не готов
) else (
    echo    ✅ NATS контейнер работает
)

netstat -an 2>nul | findstr ":4222" >nul
if errorlevel 1 (
    echo    ⚠️  Предупреждение: Порт 4222 ещё не прослушивается
) else (
    echo    ✅ Порт 4222 доступен
)

echo.

:: ========================================
:: 5. Запуск AI Worker
:: ========================================
echo [5/5] Запуск AI Worker...
echo.

rem Проверка существования worker модуля
if not exist "qik-test-qa-server\ai\apps\worker\src\ai_worker\nats_worker.py" (
    echo    ❌ ОШИБКА: Не найден модуль worker
    echo    Путь: qik-test-qa-server\ai\apps\worker\src\ai_worker\nats_worker.py
    pause
    exit /b 1
)

rem Установка PYTHONPATH для текущей сессии
set "PYTHONPATH=qik-test-qa-server\ai;qik-test-qa-server\ai\apps\worker\src"

echo    🤖 Запускаем AI Worker...
echo    ℹ️  Worker будет слушать NATS топики: ai.generate_tests, ai.cicd.commit_push
echo    ℹ️  Для остановки нажмите Ctrl+C
echo.
echo    ========================================
echo.

rem Переход в директорию ai для корректной работы модулей
if exist "qik-test-qa-server\ai" (
    cd qik-test-qa-server\ai
) else (
    echo    ❌ ОШИБКА: Директория qik-test-qa-server\ai не найдена
    echo    ℹ️  Убедитесь, что вы запускаете скрипт из корня проекта
    pause
    exit /b 1
)

rem Запуск Python worker
python -m apps.worker.src.ai_worker.nats_worker

rem Если worker завершился с ошибкой
if errorlevel 1 (
    echo.
    echo    ❌ Worker завершился с ошибкой
    cd ..\..
    pause
    exit /b 1
)

cd ..\..
