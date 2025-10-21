@echo off
echo Creating OLoan Auto-Startup Task...

:: Create the scheduled task using schtasks command
schtasks /create /tn "OLoan Auto Startup" /tr "\"%~dp0auto-startup-full.bat\" auto" /sc onstart /delay 0001:00 /rl highest /f

if %errorlevel% equ 0 (
    echo ✅ Auto-startup task created successfully!
    echo Task will run 1 minute after Windows starts
    echo.
    echo To test now: schtasks /run /tn "OLoan Auto Startup"
    echo To remove: schtasks /delete /tn "OLoan Auto Startup" /f
) else (
    echo ❌ Failed to create auto-startup task
    echo You may need to run this as Administrator
)

pause
