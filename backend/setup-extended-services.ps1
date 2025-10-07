# PowerShell setup script for extended backend services
Write-Host "🚀 Setting up extended backend services..." -ForegroundColor Green

# Install dependencies for Skill Service
Write-Host "📦 Installing Skill Service dependencies..." -ForegroundColor Yellow
Set-Location "services\skill-service"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install Skill Service dependencies" -ForegroundColor Red
    exit 1
}

# Install dependencies for Session Service (add uuid)
Write-Host "📦 Installing Session Service dependencies..." -ForegroundColor Yellow
Set-Location "..\session-service"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install Session Service dependencies" -ForegroundColor Red
    exit 1
}

# Install dependencies for Payment Service
Write-Host "📦 Installing Payment Service dependencies..." -ForegroundColor Yellow
Set-Location "..\payment-service"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install Payment Service dependencies" -ForegroundColor Red
    exit 1
}

# Install dependencies for Notification Service
Write-Host "📦 Installing Notification Service dependencies..." -ForegroundColor Yellow
Set-Location "..\notification-service"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install Notification Service dependencies" -ForegroundColor Red
    exit 1
}

# Return to backend root
Set-Location "..\..\"

Write-Host "✅ All services are ready!" -ForegroundColor Green
Write-Host ""
Write-Host "🔧 Extended Services Summary:" -ForegroundColor Cyan
Write-Host "- Skill Service (Port 3003): Full CRUD with skill relationships" -ForegroundColor White
Write-Host "- Session Service (Port 3005): Complete session management" -ForegroundColor White
Write-Host "- Payment Service (Port 3006): Mock payment processing" -ForegroundColor White
Write-Host "- Notification Service (Port 3007): User notifications system" -ForegroundColor White
Write-Host ""
Write-Host "🚀 To start all services:" -ForegroundColor Cyan
Write-Host "npm run dev:all" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔍 To test individual services:" -ForegroundColor Cyan
Write-Host "curl http://localhost:3003/health  # Skill Service" -ForegroundColor Yellow
Write-Host "curl http://localhost:3005/health  # Session Service" -ForegroundColor Yellow
Write-Host "curl http://localhost:3006/health  # Payment Service" -ForegroundColor Yellow
Write-Host "curl http://localhost:3007/health  # Notification Service" -ForegroundColor Yellow