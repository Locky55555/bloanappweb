@echo off
echo Starting OLoan Payment System...
echo.

REM Check if Docker Desktop is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker Desktop is not running. Starting Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo Waiting for Docker Desktop to start...
    timeout /t 30 /nobreak >nul
    
    REM Wait for Docker to be ready
    :wait_docker
    docker info >nul 2>&1
    if %errorlevel% neq 0 (
        echo Still waiting for Docker...
        timeout /t 5 /nobreak >nul
        goto wait_docker
    )
)

echo Docker is ready!
echo.

REM Start the application with database
echo Starting OLoan application and database...
docker-compose up --build -d

REM Wait for services to be ready
echo Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Check if services are running
docker-compose ps

echo.
echo OLoan Payment System is starting up!
echo Web: http://localhost:4000
echo Admin: http://localhost:4000/adminLoan
echo.

REM Start Cloudflare Tunnel
echo Starting Cloudflare Tunnel...
start "Cloudflare Tunnel" cmd /k "cloudflared tunnel --config tunnel.yml run"

echo.
echo System startup complete!
echo Press any key to open web browser...
pause >nul

start http://localhost:4000

echo.
echo To stop the system, run: stop-oloan.bat
pause
