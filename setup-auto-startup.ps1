# OLoan Auto-Startup Setup (User-level)
# This script creates a Windows Task Scheduler task to auto-start the system

Write-Host "Setting up OLoan Auto-Startup..." -ForegroundColor Green

$taskName = "OLoan Auto Startup"
$scriptPath = "$PSScriptRoot\auto-startup-full.bat"
$workingDir = $PSScriptRoot

# Check if task already exists
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue

if ($existingTask) {
    Write-Host "Task already exists. Removing old task..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

# Create new task action
$action = New-ScheduledTaskAction -Execute $scriptPath -WorkingDirectory $workingDir

# Create trigger (at startup, with 30 second delay)
$trigger = New-ScheduledTaskTrigger -AtStartup
$trigger.Delay = "PT30S"  # 30 second delay

# Create task settings
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

# Create principal (run as current user)
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive

# Register the task
try {
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description "Auto-start OLoan Payment System with Docker and Cloudflare Tunnel"
    Write-Host "✅ Auto-startup task created successfully!" -ForegroundColor Green
    Write-Host "Task Name: $taskName" -ForegroundColor Cyan
    Write-Host "The system will auto-start 30 seconds after Windows boots up." -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to create task: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test the task
Write-Host "`nTesting task creation..." -ForegroundColor Yellow
$task = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue

if ($task) {
    Write-Host "✅ Task verified successfully!" -ForegroundColor Green
    Write-Host "Status: $($task.State)" -ForegroundColor Cyan
    
    Write-Host "`n📋 What happens on startup:" -ForegroundColor Yellow
    Write-Host "1. Docker Desktop starts automatically" -ForegroundColor White
    Write-Host "2. PostgreSQL database container starts" -ForegroundColor White
    Write-Host "3. Next.js application container starts" -ForegroundColor White
    Write-Host "4. Cloudflare tunnel connects for global access" -ForegroundColor White
    Write-Host "5. System accessible at http://localhost:4000" -ForegroundColor White
    
    Write-Host "`n🎯 To test now, run: Start-ScheduledTask -TaskName '$taskName'" -ForegroundColor Green
    Write-Host "🗑️  To remove: Unregister-ScheduledTask -TaskName '$taskName'" -ForegroundColor Gray
} else {
    Write-Host "❌ Task verification failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`nSetup completed! The system will auto-start on next reboot." -ForegroundColor Green
