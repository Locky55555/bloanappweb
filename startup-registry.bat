@echo off
echo Setting up OLoan Auto-Startup via Windows Registry...

:: Add registry entry for current user startup
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "OLoan Payment System" /t REG_SZ /d "\"%~dp0auto-startup-full.bat\" auto" /f

if %errorlevel% equ 0 (
    echo ✅ Auto-startup registry entry created successfully!
    echo The system will start automatically when you log in to Windows
    echo.
    echo Registry location: HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run
    echo Entry name: OLoan Payment System
    echo.
    echo To remove auto-startup:
    echo reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "OLoan Payment System" /f
) else (
    echo ❌ Failed to create registry entry
)

echo.
echo Testing current system...
call "%~dp0check-startup-status.bat"

pause
