@echo off
echo Stopping OLoan Payment System...
echo.

REM Stop Cloudflare Tunnel
echo Stopping Cloudflare Tunnel...
taskkill /f /im cloudflared.exe 2>nul
if %errorlevel% equ 0 (
    echo Cloudflare Tunnel stopped.
) else (
    echo Cloudflare Tunnel was not running.
)

REM Stop Docker containers
echo Stopping Docker containers...
docker-compose down

echo.
echo OLoan Payment System stopped successfully!
pause
