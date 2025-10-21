@echo off
REM OLoan Auto-Startup Script (Full Production Mode)
REM This script runs automatically on Windows boot

echo [%date% %time%] Starting OLoan Payment System (Auto-Startup)... >> "%~dp0startup.log"

REM Set working directory
cd /d "%~dp0"

:: Create log file with timestamp
echo ==================== >> "%~dp0startup.log"
echo Starting at %date% %time% >> "%~dp0startup.log"
echo ==================== >> "%~dp0startup.log"

REM Wait for system to fully boot
timeout /t 30 /nobreak >nul

REM Check if Docker Desktop is installed
if not exist "C:\Program Files\Docker\Docker\Docker Desktop.exe" (
    echo [%date% %time%] Docker Desktop not found. Starting development mode... >> "%~dp0startup.log"
    goto dev_mode
)

REM Start Docker Desktop
echo [%date% %time%] Starting Docker Desktop... >> "%~dp0startup.log"
start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"

REM Wait for Docker Desktop to start (up to 2 minutes)
set /a counter=0
:wait_docker
timeout /t 10 /nobreak >nul
docker info >nul 2>&1
if %errorlevel% equ 0 goto docker_ready
set /a counter+=1
if %counter% lss 12 goto wait_docker

REM If Docker fails to start, use development mode
echo [%date% %time%] Docker failed to start. Using development mode... >> "%~dp0startup.log"
goto dev_mode

:docker_ready
echo [%date% %time%] Docker is ready. Starting containers... >> "%~dp0startup.log"

REM Start Docker containers
echo Checking Docker Desktop...
echo Checking Docker Desktop... >> "%~dp0startup.log"
docker info >nul 2>&1
if errorlevel 1 (
    echo Starting Docker Desktop...
    echo Starting Docker Desktop... >> "%~dp0startup.log"
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo Waiting for Docker to start...
    :wait_docker2
    timeout /t 5 /nobreak >nul
    docker info >nul 2>&1
    if errorlevel 1 goto wait_docker2
    echo Docker Desktop started successfully >> "%~dp0startup.log"
) else (
    echo Docker Desktop already running >> "%~dp0startup.log"
)

echo Starting containers...
echo Starting containers... >> "%~dp0startup.log"
docker-compose up -d --build >> "%~dp0startup.log" 2>&1

REM Wait for containers to be ready
echo Waiting for application to be ready...
echo Waiting for application to be ready... >> "%~dp0startup.log"
timeout /t 15 /nobreak >nul

REM Check if containers are running
docker-compose ps >> "%~dp0startup.log" 2>&1

echo [%date% %time%] Docker containers started successfully >> "%~dp0startup.log"
goto start_tunnel

:dev_mode
echo [%date% %time%] Starting development server... >> "%~dp0startup.log"

REM Start development server
start "OLoan Dev Server" /min cmd /c "cd /d %~dp0 && npm run dev >> startup.log 2>&1"

REM Wait for dev server to start
timeout /t 10 /nobreak >nul

:start_tunnel
REM Start Cloudflare Tunnel
echo [%date% %time%] Starting Cloudflare Tunnel... >> "%~dp0startup.log"
start "Cloudflare Tunnel" /min cmd /c "cd /d %~dp0 && cloudflared tunnel --config tunnel.yml run >> tunnel.log 2>&1"

echo [%date% %time%] OLoan Payment System startup complete! >> "%~dp0startup.log"
echo [%date% %time%] Local: http://localhost:4000 >> "%~dp0startup.log"
echo [%date% %time%] Public: https://oloan-payment.trycloudflare.com >> "%~dp0startup.log"

REM Create desktop notification
powershell -Command "& {Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('OLoan Payment System is now running!`n`nLocal: http://localhost:4000`nPublic: https://oloan-payment.trycloudflare.com', 'OLoan Started', 'OK', 'Information')}"
