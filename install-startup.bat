@echo off
echo Installing OLoan Payment System as Windows Startup Service...
echo.

REM Create startup folder shortcut
set "startup_folder=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "project_path=%~dp0"

REM Create startup script
echo Creating startup script...
(
echo @echo off
echo cd /d "%project_path%"
echo start "" "%project_path%start-oloan-dev.bat"
) > "%startup_folder%\OLoan-AutoStart.bat"

echo.
echo ✅ OLoan Payment System installed for automatic startup!
echo.
echo The system will now start automatically when Windows boots:
echo - Development server on http://localhost:4000
echo - Cloudflare Tunnel on https://oloan-payment.trycloudflare.com
echo.
echo To remove auto-startup, delete: %startup_folder%\OLoan-AutoStart.bat
echo.
pause
