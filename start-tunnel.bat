@echo off
echo Starting Cloudflare Tunnel...

cd /d "%~dp0"

:: Kill any existing cloudflared processes
taskkill /f /im cloudflared.exe >nul 2>&1

:: Wait a moment
timeout /t 2 /nobreak >nul

:: Start tunnel with output to log file
echo Starting tunnel at %date% %time% >> tunnel.log
cloudflared tunnel --url http://localhost:4000 >> tunnel.log 2>&1
