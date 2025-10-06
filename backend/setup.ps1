# Learning Management System - Backend Setup Script (PowerShell)
# This script sets up the local development environment on Windows

Write-Host "🚀 Setting up Learning Management System Backend..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js v18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if MongoDB is running
$mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
if (-not $mongoProcess) {
    Write-Host "⚠️  MongoDB is not running. Please start MongoDB service." -ForegroundColor Yellow
    Write-Host "   Run: net start MongoDB (or start mongod manually)" -ForegroundColor Yellow
}

# Check if Redis is running
$redisProcess = Get-Process -Name "redis-server" -ErrorAction SilentlyContinue
if (-not $redisProcess) {
    Write-Host "⚠️  Redis is not running. Please start Redis server." -ForegroundColor Yellow
    Write-Host "   Run: redis-server" -ForegroundColor Yellow
}

# Create logs directory
if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs"
}

# Install dependencies for all services
Write-Host "📦 Installing dependencies for all services..." -ForegroundColor Blue

$services = @("auth-service", "user-service", "skill-service", "matching-service", "session-service", "payment-service", "notification-service")

foreach ($service in $services) {
    Write-Host "Installing dependencies for $service..." -ForegroundColor Cyan
    Set-Location "services\$service"
    npm install
    Set-Location "..\..\"
}

# Install gateway dependencies
Write-Host "Installing dependencies for gateway..." -ForegroundColor Cyan
Set-Location "gateway"
npm install
Set-Location ".."

# Install workers dependencies
Write-Host "Installing dependencies for workers..." -ForegroundColor Cyan
Set-Location "workers"
npm install
Set-Location ".."

# Install shared dependencies
Write-Host "Installing dependencies for shared..." -ForegroundColor Cyan
Set-Location "shared"
npm install
Set-Location ".."

# Create environment files
Write-Host "📝 Creating environment files..." -ForegroundColor Blue

foreach ($service in $services) {
    $envPath = "services\$service\.env"
    if (-not (Test-Path $envPath)) {
        $examplePath = "services\$service\.env.example"
        if (Test-Path $examplePath) {
            Copy-Item $examplePath $envPath
        } else {
            "# Add your environment variables here" | Out-File -FilePath $envPath
        }
        Write-Host "Created .env file for $service" -ForegroundColor Green
    }
}

# Create gateway .env
$gatewayEnvPath = "gateway\.env"
if (-not (Test-Path $gatewayEnvPath)) {
    $gatewayExamplePath = "gateway\.env.example"
    if (Test-Path $gatewayExamplePath) {
        Copy-Item $gatewayExamplePath $gatewayEnvPath
    } else {
        "# Add your environment variables here" | Out-File -FilePath $gatewayEnvPath
    }
    Write-Host "Created .env file for gateway" -ForegroundColor Green
}

# Create workers .env
$workersEnvPath = "workers\.env"
if (-not (Test-Path $workersEnvPath)) {
    $workersExamplePath = "workers\.env.example"
    if (Test-Path $workersExamplePath) {
        Copy-Item $workersExamplePath $workersEnvPath
    } else {
        "# Add your environment variables here" | Out-File -FilePath $workersEnvPath
    }
    Write-Host "Created .env file for workers" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure your .env files with actual values"
Write-Host "2. Make sure MongoDB and Redis are running"
Write-Host "3. Start all services:"
Write-Host "   npm run dev:all (starts all services individually)"
Write-Host "   OR"
Write-Host "   pm2 start ecosystem.config.js (using PM2)"
Write-Host ""
Write-Host "🌐 Service URLs:" -ForegroundColor Cyan
Write-Host "   Gateway: http://localhost:3000"
Write-Host "   Auth Service: http://localhost:3001"
Write-Host "   User Service: http://localhost:3002"
Write-Host "   Skill Service: http://localhost:3003"
Write-Host "   Matching Service: http://localhost:3004"
Write-Host "   Session Service: http://localhost:3005"
Write-Host "   Payment Service: http://localhost:3006"
Write-Host "   Notification Service: http://localhost:3007"