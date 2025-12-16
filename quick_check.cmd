@echo off
title Cloud.ru AI Quick Check

echo.
echo ========================================
echo   Cloud.ru AI Quick Check
echo ========================================
echo.

echo Проверка основных компонентов...
echo.

:: Проверка Docker
where docker >nul 2>nul
if errorlevel 1 (
    echo ❌ Docker не найден
) else (
    docker ps >nul 2>&1
    if errorlevel 1 (
        echo ❌ Docker не работает
    ) else (
        echo ✅ Docker работает
    )
)

:: Проверка Python
where python >nul 2>nul
if errorlevel 1 (
    echo ❌ Python не найден
) else (
    echo ✅ Python найден
)

:: Проверка NATS
docker ps --filter "name=nats" --format "{{.Status}}" 2>nul | findstr /i "Up" >nul
if errorlevel 1 (
    echo ⚠️  NATS не запущен (запустите start_server.cmd)
) else (
    echo ✅ NATS запущен
)

:: Проверка виртуального окружения
if exist "qik-test-qa-server\ai\.venv\Scripts\activate.bat" (
    echo ✅ Виртуальное окружение найдено (ai)
) else if exist ".venv\Scripts\activate.bat" (
    echo ✅ Виртуальное окружение найдено (корневое)
) else (
    echo ⚠️  Виртуальное окружение не найдено
)

echo.
echo Для полной проверки запустите: check_system.cmd
echo.

pause

