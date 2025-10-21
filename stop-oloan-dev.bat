@echo off
echo Stopping OLoan Payment System (Development Mode)...
echo.

REM Stop Cloudflare Tunnel
echo Stopping Cloudflare Tunnel...
taskkill /f /im cloudflared.exe 2>nul
if %errorlevel% equ 0 (
    echo Cloudflare Tunnel stopped.
) else (
    echo Cloudflare Tunnel was not running.
)

REM Stop Node.js development server
echo Stopping development server...
taskkill /f /im node.exe 2>nul
if %errorlevel% equ 0 (
    echo Development server stopped.
) else (
    echo Development server was not running.
)

echo.
echo Development system stopped successfully!
pause
