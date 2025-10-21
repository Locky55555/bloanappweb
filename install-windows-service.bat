@echo off
REM Install OLoan as Windows Startup Service
REM Run as Administrator

echo Installing OLoan Payment System as Windows Startup Service...
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script must be run as Administrator!
    echo Right-click and select "Run as administrator"
    pause
    exit /b 1
)

set "project_path=%~dp0"
set "task_name=OLoan Payment System Auto-Start"

REM Delete existing task if it exists
schtasks /delete /tn "%task_name%" /f >nul 2>&1

REM Create scheduled task to run at startup
echo Creating Windows Startup Task...
schtasks /create /tn "%task_name%" /tr "\"%project_path%auto-startup-full.bat\"" /sc onstart /ru "SYSTEM" /rl highest /f

if %errorlevel% equ 0 (
    echo.
    echo ✅ SUCCESS: OLoan Payment System installed as Windows Service!
    echo.
    echo The system will now start automatically when Windows boots:
    echo - Docker Desktop + PostgreSQL Database
    echo - Next.js Web Application
    echo - Cloudflare Tunnel for global access
    echo.
    echo URLs after startup:
    echo - Local: http://localhost:4000
    echo - Global: https://oloan-payment.trycloudflare.com
    echo.
    echo To remove auto-startup:
    echo schtasks /delete /tn "%task_name%" /f
    echo.
) else (
    echo.
    echo ❌ ERROR: Failed to create startup task
    echo Please check Windows Task Scheduler permissions
    echo.
)

pause
