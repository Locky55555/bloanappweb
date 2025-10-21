@echo off
echo Checking OLoan Payment System Status...
echo.

set "task_name=OLoan Payment System Auto-Start"

REM Check if startup task exists
schtasks /query /tn "%task_name%" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Windows Startup Service: INSTALLED
    schtasks /query /tn "%task_name%" /fo LIST | findstr "Status:"
) else (
    echo ❌ Windows Startup Service: NOT INSTALLED
)

echo.

REM Check if processes are running
echo Checking running processes:

REM Check Node.js (Development server)
tasklist /fi "imagename eq node.exe" | find "node.exe" >nul
if %errorlevel% equ 0 (
    echo ✅ Node.js Development Server: RUNNING
) else (
    echo ❌ Node.js Development Server: NOT RUNNING
)

REM Check Cloudflare Tunnel
tasklist /fi "imagename eq cloudflared.exe" | find "cloudflared.exe" >nul
if %errorlevel% equ 0 (
    echo ✅ Cloudflare Tunnel: RUNNING
) else (
    echo ❌ Cloudflare Tunnel: NOT RUNNING
)

REM Check Docker
docker info >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Docker: RUNNING
    docker-compose ps 2>nul | find "Up" >nul
    if %errorlevel% equ 0 (
        echo ✅ Docker Containers: RUNNING
    ) else (
        echo ❌ Docker Containers: NOT RUNNING
    )
) else (
    echo ❌ Docker: NOT RUNNING
)

echo.

REM Check URLs
echo Testing URLs:
curl -s -o nul -w "Local (localhost:4000): %%{http_code}\n" http://localhost:4000 2>nul || echo "Local (localhost:4000): NOT ACCESSIBLE"
curl -s -o nul -w "Global (Cloudflare): %%{http_code}\n" https://oloan-payment.trycloudflare.com 2>nul || echo "Global (Cloudflare): NOT ACCESSIBLE"

echo.
echo Log files:
if exist "%~dp0startup.log" (
    echo ✅ startup.log exists (last 3 lines):
    powershell -Command "Get-Content '%~dp0startup.log' | Select-Object -Last 3"
) else (
    echo ❌ startup.log not found
)

echo.
pause
