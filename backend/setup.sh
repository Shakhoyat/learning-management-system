#!/bin/bash

# Learning Management System - Backend Setup Script
# This script sets up the local development environment

echo "🚀 Setting up Learning Management System Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB service."
    echo "   Windows: net start MongoDB (or start mongod manually)"
    echo "   macOS/Linux: brew services start mongodb/brew/mongodb-community (or start mongod manually)"
fi

# Check if Redis is running
if ! pgrep -x "redis-server" > /dev/null; then
    echo "⚠️  Redis is not running. Please start Redis server."
    echo "   Run: redis-server"
fi

# Create logs directory
mkdir -p logs

# Install dependencies for all services
echo "📦 Installing dependencies for all services..."

services=("auth-service" "user-service" "skill-service" "matching-service" "session-service" "payment-service" "notification-service")

for service in "${services[@]}"; do
    echo "Installing dependencies for $service..."
    cd "services/$service"
    npm install
    cd "../.."
done

# Install gateway dependencies
echo "Installing dependencies for gateway..."
cd gateway
npm install
cd ..

# Install workers dependencies
echo "Installing dependencies for workers..."
cd workers
npm install
cd ..

# Install shared dependencies
echo "Installing dependencies for shared..."
cd shared
npm install
cd ..

# Create environment files
echo "📝 Creating environment files..."

services=("auth-service" "user-service" "skill-service" "matching-service" "session-service" "payment-service" "notification-service")

for service in "${services[@]}"; do
    if [ ! -f "services/$service/.env" ]; then
        cp "services/$service/.env.example" "services/$service/.env" 2>/dev/null || echo "# Add your environment variables here" > "services/$service/.env"
        echo "Created .env file for $service"
    fi
done

# Create gateway .env
if [ ! -f "gateway/.env" ]; then
    cp "gateway/.env.example" "gateway/.env" 2>/dev/null || echo "# Add your environment variables here" > "gateway/.env"
    echo "Created .env file for gateway"
fi

# Create workers .env
if [ ! -f "workers/.env" ]; then
    cp "workers/.env.example" "workers/.env" 2>/dev/null || echo "# Add your environment variables here" > "workers/.env"
    echo "Created .env file for workers"
fi

echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your .env files with actual values"
echo "2. Make sure MongoDB and Redis are running"
echo "3. Start all services:"
echo "   npm run dev:all (starts all services individually)"
echo "   OR"
echo "   pm2 start ecosystem.config.js (using PM2)"
echo ""
echo "🌐 Service URLs:"
echo "   Gateway: http://localhost:3000"
echo "   Auth Service: http://localhost:3001"
echo "   User Service: http://localhost:3002"
echo "   Skill Service: http://localhost:3003"
echo "   Matching Service: http://localhost:3004"
echo "   Session Service: http://localhost:3005"
echo "   Payment Service: http://localhost:3006"
echo "   Notification Service: http://localhost:3007"