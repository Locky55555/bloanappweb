# OLoan Windows Service Installation (PowerShell Admin Script)
Write-Host "Installing OLoan Payment System as Windows Startup Service..." -ForegroundColor Green
Write-Host ""

# Set variables
$projectPath = "d:\Odee-Link\oloanappweblocal\"
$taskName = "OLoan Payment System Auto-Start"
$scriptPath = "$projectPath\auto-startup-full.bat"

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as administrator'" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Running as Administrator" -ForegroundColor Green

# Delete existing task if it exists
Write-Host "Removing existing task (if any)..." -ForegroundColor Yellow
try {
    schtasks /delete /tn "$taskName" /f 2>$null
    Write-Host "Previous task removed" -ForegroundColor Gray
} catch {
    Write-Host "No previous task found" -ForegroundColor Gray
}

# Create scheduled task
Write-Host "Creating Windows Startup Task..." -ForegroundColor Yellow
$result = schtasks /create /tn "$taskName" /tr "`"$scriptPath`"" /sc onstart /ru "SYSTEM" /rl highest /f

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ SUCCESS: OLoan Payment System installed as Windows Service!" -ForegroundColor Green
    Write-Host ""
    Write-Host "The system will now start automatically when Windows boots:" -ForegroundColor Cyan
    Write-Host "- Docker Desktop + PostgreSQL Database" -ForegroundColor White
    Write-Host "- Next.js Web Application" -ForegroundColor White
    Write-Host "- Cloudflare Tunnel for global access" -ForegroundColor White
    Write-Host ""
    Write-Host "URLs after startup:" -ForegroundColor Cyan
    Write-Host "- Local: http://localhost:4000" -ForegroundColor White
    Write-Host "- Global: https://oloan-payment.trycloudflare.com" -ForegroundColor White
    Write-Host ""
    Write-Host "To remove auto-startup:" -ForegroundColor Yellow
    Write-Host "schtasks /delete /tn `"$taskName`" /f" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ ERROR: Failed to create startup task" -ForegroundColor Red
    Write-Host "Please check Windows Task Scheduler permissions" -ForegroundColor Yellow
    Write-Host ""
}

Read-Host "Press Enter to continue"
