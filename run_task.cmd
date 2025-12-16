@echo off
setlocal enabledelayedexpansion
title Cloud.ru AI Task Runner

echo.
echo ========================================
echo   Cloud.ru AI Task Runner
echo ========================================
echo.

:: ========================================
:: 1. Проверка зависимостей
:: ========================================
echo [1/4] Проверка зависимостей...

where python >nul 2>nul
if errorlevel 1 (
    echo    ❌ ОШИБКА: Python не найден в PATH.
    pause
    exit /b 1
)
echo    ✅ Python найден

echo.

:: ========================================
:: 2. Проверка NATS
:: ========================================
echo [2/4] Проверка NATS...

docker ps --filter "name=nats" --format "{{.Status}}" 2>nul | findstr /i "Up" >nul
if errorlevel 1 (
    echo    ⚠️  ВНИМАНИЕ: NATS контейнер не запущен или не найден
    echo    ℹ️  Запустите start_server.cmd для запуска NATS
    echo.
    set /p CONTINUE="Продолжить без проверки NATS? (y/n): "
    if /i not "!CONTINUE!"=="y" (
        echo    Отмена операции
        pause
        exit /b 1
    )
) else (
    echo    ✅ NATS контейнер запущен
)

netstat -an 2>nul | findstr ":4222" >nul
if errorlevel 1 (
    echo    ⚠️  ВНИМАНИЕ: Порт 4222 не прослушивается
) else (
    echo    ✅ Порт 4222 доступен
)

echo.

:: ========================================
:: 3. Настройка окружения
:: ========================================
echo [3/4] Настройка окружения...

if "%NATS_URL%"=="" (
    set "NATS_URL=nats://localhost:4222"
    echo    ℹ️  NATS_URL установлена: %NATS_URL%
) else (
    echo    ✅ NATS_URL уже установлена: %NATS_URL%
)

rem Активация виртуального окружения
if exist "qik-test-qa-server\ai\.venv\Scripts\activate.bat" (
    call "qik-test-qa-server\ai\.venv\Scripts\activate.bat"
    echo    ✅ Виртуальное окружение активировано (ai)
) else if exist ".venv\Scripts\activate.bat" (
    call ".venv\Scripts\activate.bat"
    echo    ✅ Виртуальное окружение активировано (корневое)
) else (
    echo    ⚠️  Виртуальное окружение не найдено. Продолжаем без venv.
)

echo.

:: ========================================
:: 4. Выбор режима и запуск
:: ========================================
echo [4/4] Выбор режима...
echo.
echo Доступные режимы:
echo   [1] ui   - Manual UI Tests (15+ кейсов в Markdown)
echo   [2] api  - Manual API Specs (15+ кейсов в Markdown)
echo   [3] e2e  - E2E Playwright Code (Python + pytest)
echo   [4] api_tests - API Tests (Python + pytest, httpx)
echo   [5] cicd - CI/CD Push (требует run_id)
echo   [6] gen  - Simple Generate Test
echo.

set /p MODE="Введите режим (ui, api, e2e, api_tests, cicd, gen): "

if /i "%MODE%"=="" (
    echo    ❌ Ошибка: Режим не указан
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Запуск задачи: %MODE%
echo ========================================
echo.

rem Определение файла для запуска
set "FILE="
set "DESCRIPTION="

if /i "%MODE%"=="ui" (
    set "FILE=nats_publish_generate_ui.py"
    set "DESCRIPTION=Генерация ручных UI тестов"
) else if /i "%MODE%"=="api" (
    set "FILE=nats_publish_generate_api.py"
    set "DESCRIPTION=Генерация ручных API тестов"
) else if /i "%MODE%"=="e2e" (
    set "FILE=nats_publish_generate_e2e.py"
    set "DESCRIPTION=Генерация E2E Playwright тестов"
) else if /i "%MODE%"=="api_tests" (
    set "FILE=nats_publish_generate_api_tests.py"
    set "DESCRIPTION=Генерация API тестов (pytest)"
) else if /i "%MODE%"=="cicd" (
    set "FILE=nats_publish_cicd_push.py"
    set "DESCRIPTION=CI/CD Push (требует run_id)"
    echo    ⚠️  ВНИМАНИЕ: Режим CICD требует run_id от предыдущей генерации
    echo    ℹ️  Убедитесь, что у вас есть run_id перед запуском
    echo.
) else if /i "%MODE%"=="gen" (
    set "FILE=nats_publish_generate.py"
    set "DESCRIPTION=Простая генерация тестов"
) else (
    echo    ❌ Ошибка: Неизвестный режим "%MODE%"
    echo    Доступные режимы: ui, api, e2e, api_tests, cicd, gen
    pause
    exit /b 1
)

echo    ℹ️  Режим: %DESCRIPTION%
echo    ℹ️  Файл: %FILE%
echo    ℹ️  NATS URL: %NATS_URL%
echo.

rem Для режима cicd - дополнительная проверка
if /i "%MODE%"=="cicd" (
    if "%RUN_ID%"=="" (
        echo    ⚠️  RUN_ID не установлен
        set /p RUN_ID_INPUT="Введите run_id (или нажмите Enter для продолжения): "
        if not "!RUN_ID_INPUT!"=="" (
            set "RUN_ID=!RUN_ID_INPUT!"
        )
    )
)

echo    Запускаем задачу...
echo.

rem Переход в директорию ai для корректной работы модулей
if exist "qik-test-qa-server\ai" (
    cd qik-test-qa-server\ai
    
    rem Проверка существования файла
    if not exist "%FILE%" (
        echo    ❌ ОШИБКА: Файл не найден: %FILE%
        echo    ℹ️  Текущая директория: %CD%
        cd ..\..
        pause
        exit /b 1
    )
) else (
    echo    ❌ ОШИБКА: Директория qik-test-qa-server\ai не найдена
    echo    ℹ️  Убедитесь, что вы запускаете скрипт из корня проекта
    pause
    exit /b 1
)

rem Запуск Python скрипта
python "%FILE%"
set "EXIT_CODE=!errorlevel!"

cd ..\..

echo.
echo ========================================
if !EXIT_CODE!==0 (
    echo   ✅ Задача завершена успешно
) else (
    echo   ❌ Задача завершена с ошибкой (код: !EXIT_CODE!)
)
echo ========================================
echo.

pause
exit /b !EXIT_CODE!
