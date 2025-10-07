#!/bin/bash

# Setup script for extended backend services
echo "🚀 Setting up extended backend services..."

# Install dependencies for Skill Service
echo "📦 Installing Skill Service dependencies..."
cd services/skill-service
npm install

# Install dependencies for Session Service (add uuid)
echo "📦 Installing Session Service dependencies..."
cd ../session-service
npm install

# Install dependencies for Payment Service
echo "📦 Installing Payment Service dependencies..."
cd ../payment-service
npm install

# Install dependencies for Notification Service
echo "📦 Installing Notification Service dependencies..."
cd ../notification-service
npm install

echo "✅ All services are ready!"
echo ""
echo "🔧 Extended Services Summary:"
echo "- Skill Service (Port 3003): Full CRUD with skill relationships"
echo "- Session Service (Port 3005): Complete session management"
echo "- Payment Service (Port 3006): Mock payment processing"
echo "- Notification Service (Port 3007): User notifications system"
echo ""
echo "🚀 To start all services:"
echo "npm run dev:all"
echo ""
echo "🔍 To test individual services:"
echo "curl http://localhost:3003/health  # Skill Service"
echo "curl http://localhost:3005/health  # Session Service"
echo "curl http://localhost:3006/health  # Payment Service" 
echo "curl http://localhost:3007/health  # Notification Service"