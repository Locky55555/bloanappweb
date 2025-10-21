@echo off
REM Uninstall OLoan Windows Startup Service
REM Run as Administrator

echo Uninstalling OLoan Payment System from Windows Startup...
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script must be run as Administrator!
    echo Right-click and select "Run as administrator"
    pause
    exit /b 1
)

set "task_name=OLoan Payment System Auto-Start"

REM Stop any running processes


echo Stopping OLoan processes...
taskkill /f /im cloudflared.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1
docker-compose -f "%~dp0docker-compose.yml" down >nul 2>&1

REM Delete scheduled task
echo Removing Windows Startup Task...
schtasks /delete /tn "%task_name%" /f

if %errorlevel% equ 0 (
    echo.
    echo ✅ SUCCESS: OLoan Payment System removed from Windows Startup
    echo.
    echo The system will no longer start automatically on boot.
    echo You can still start it manually using:
    echo - start-oloan.bat (Production with Docker)
    echo - start-oloan-dev.bat (Development mode)
    echo.
) else (
    echo.
    echo ❌ Task not found or already removed
    echo.
)

pause
