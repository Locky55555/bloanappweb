@echo off
echo Starting OLoan Payment System (Development Mode)...
echo.

REM Start development server (uses in-memory data)
echo Starting development server...
start "OLoan Dev Server" cmd /k "cd /d %~dp0 && npm run dev"

REM Wait for dev server to start
echo Waiting for development server to start...
timeout /t 5 /nobreak >nul

REM Start Cloudflare Tunnel
echo Starting Cloudflare Tunnel...
start "Cloudflare Tunnel" cmd /k "cd /d %~dp0 && cloudflared tunnel --config tunnel.yml run"

echo.
echo Development system startup complete!
echo Web: http://localhost:4000
echo Admin: http://localhost:4000/adminLoan
echo.
echo Press any key to open web browser...
pause >nul

start http://localhost:4000

echo.
echo To stop the system, close both command windows or run: stop-oloan-dev.bat
pause
