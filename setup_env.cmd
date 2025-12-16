@echo off
setlocal enabledelayedexpansion
title Cloud.ru AI Environment Setup

echo.
echo ========================================
echo   Cloud.ru AI Environment Setup
echo ========================================
echo.

:: ========================================
:: 1. Проверка Python
:: ========================================
echo [1/4] Проверка Python...

where python >nul 2>nul
if errorlevel 1 (
    echo    ❌ ОШИБКА: Python не найден в PATH.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('python --version 2^>^&1') do echo    ✅ %%i

echo.

:: ========================================
:: 2. Создание виртуального окружения
:: ========================================
echo [2/4] Создание виртуального окружения...

if exist "qik-test-qa-server\ai\.venv" (
    echo    ℹ️  Виртуальное окружение уже существует: qik-test-qa-server\ai\.venv
    set /p RECREATE="Пересоздать? (y/n): "
    if /i "!RECREATE!"=="y" (
        echo    Удаляем старое окружение...
        rmdir /s /q "qik-test-qa-server\ai\.venv" 2>nul
        echo    Создаем новое окружение...
        cd qik-test-qa-server\ai
        python -m venv .venv
        cd ..\..
        echo    ✅ Виртуальное окружение создано
    ) else (
        echo    ✅ Используем существующее окружение
    )
) else (
    echo    Создаем виртуальное окружение...
    if not exist "qik-test-qa-server\ai" (
        echo    ❌ ОШИБКА: Директория qik-test-qa-server\ai не найдена
        pause
        exit /b 1
    )
    cd qik-test-qa-server\ai
    python -m venv .venv
    cd ..\..
    echo    ✅ Виртуальное окружение создано
)

echo.

:: ========================================
:: 3. Активация и обновление pip
:: ========================================
echo [3/4] Активация окружения и обновление pip...

if exist "qik-test-qa-server\ai\.venv\Scripts\activate.bat" (
    call "qik-test-qa-server\ai\.venv\Scripts\activate.bat"
    echo    ✅ Виртуальное окружение активировано
    
    echo    Обновляем pip...
    python -m pip install --upgrade pip >nul 2>&1
    if errorlevel 1 (
        echo    ⚠️  Не удалось обновить pip, продолжаем...
    ) else (
        echo    ✅ pip обновлен
    )
) else (
    echo    ❌ ОШИБКА: Не удалось активировать виртуальное окружение
    pause
    exit /b 1
)

echo.

:: ========================================
:: 4. Установка зависимостей
:: ========================================
echo [4/4] Установка зависимостей...

if not exist "qik-test-qa-server\ai\requirements.txt" (
    echo    ❌ ОШИБКА: Файл requirements.txt не найден
    echo    Путь: qik-test-qa-server\ai\requirements.txt
    pause
    exit /b 1
)

echo    Устанавливаем зависимости из requirements.txt...
echo    Это может занять несколько минут...
echo.

cd qik-test-qa-server\ai
pip install -r requirements.txt
if errorlevel 1 (
    echo.
    echo    ❌ ОШИБКА: Не удалось установить зависимости
    cd ..\..
    pause
    exit /b 1
)
cd ..\..

echo.
echo    ✅ Зависимости установлены

echo.
echo ========================================
echo   Проверка установленных пакетов
echo ========================================
echo.

python -c "import nats" 2>nul
if errorlevel 1 (
    echo    ❌ nats-py не установлен
) else (
    echo    ✅ nats-py установлен
)

python -c "import openai" 2>nul
if errorlevel 1 (
    echo    ❌ openai не установлен
) else (
    echo    ✅ openai установлен
)

python -c "import fastapi" 2>nul
if errorlevel 1 (
    echo    ⚠️  fastapi не установлен (опционально)
) else (
    echo    ✅ fastapi установлен
)

echo.
echo ========================================
echo   ✅ Установка завершена!
echo ========================================
echo.
echo Следующие шаги:
echo 1. Установите переменные окружения (см. README.md)
echo 2. Запустите: start_server.cmd
echo.

pause

