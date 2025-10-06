# Quick Start Guide - Local Development

## Prerequisites Installation

### 1. Install Node.js
- Download from [nodejs.org](https://nodejs.org/)
- Install version 18 or higher
- Verify installation: `node --version`

### 2. Install MongoDB
- Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
- Follow installation instructions for Windows
- Start MongoDB service:
  ```powershell
  net start MongoDB
  ```
  Or start manually:
  ```powershell
  mongod --dbpath C:\data\db
  ```

### 3. Install Redis
- Download Redis for Windows from [github.com/microsoftarchive/redis](https://github.com/microsoftarchive/redis/releases)
- Extract and run `redis-server.exe`
- Alternatively, use Windows Subsystem for Linux (WSL)

### 4. Install PM2 (Optional but Recommended)
```powershell
npm install -g pm2
```

## Project Setup

### 1. Clone and Navigate
```powershell
git clone <your-repo-url>
cd learning-management-system/backend
```

### 2. Run Setup Script
```powershell
# For Windows PowerShell
./setup.ps1

# For Git Bash or Unix-like shells
chmod +x setup.sh && ./setup.sh
```

### 3. Manual Setup (Alternative)
```powershell
# Install main dependencies
npm install

# Install all service dependencies
npm run install:all
```

## Configuration

### Environment Variables
Each service needs a `.env` file. The setup script creates template files. Update them with your values:

#### Auth Service (.env)
```
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/lms_auth
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
BCRYPT_ROUNDS=12
```

#### Payment Service (.env)
```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

#### Notification Service (.env)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## Running the Application

### Option 1: Using PM2 (Recommended)
```powershell
# Start all services
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs

# Stop all services
pm2 stop all

# Restart all services
pm2 restart all
```

### Option 2: Using npm scripts
```powershell
# Start all services in development mode
npm run dev:all

# Start individual services
npm run dev:gateway
npm run dev:auth
npm run dev:user
# ... etc
```

### Option 3: Manual start (separate terminals)
```powershell
# Terminal 1 - Gateway
cd gateway && npm run dev

# Terminal 2 - Auth Service
cd services/auth-service && npm run dev

# Terminal 3 - User Service
cd services/user-service && npm run dev

# ... continue for each service
```

## Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Gateway | http://localhost:3000 | Main API entry point |
| Auth Service | http://localhost:3001 | Authentication & authorization |
| User Service | http://localhost:3002 | User management |
| Skill Service | http://localhost:3003 | Skills & competencies |
| Matching Service | http://localhost:3004 | Learner-tutor matching |
| Session Service | http://localhost:3005 | Learning sessions |
| Payment Service | http://localhost:3006 | Payment processing |
| Notification Service | http://localhost:3007 | Notifications |

## Testing

```powershell
# Run all tests
npm run test:all

# Test specific services
npm run test:services
npm run test:gateway
npm run test:workers

# Lint all code
npm run lint:all
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB service is running: `net start MongoDB`
- Check if port 27017 is available
- Verify connection string in .env files

### Redis Connection Issues
- Ensure Redis server is running
- Check if port 6379 is available
- Verify Redis URL in .env files

### Port Conflicts
- Check if ports 3000-3007 are available
- Modify ports in ecosystem.config.js if needed

### Service Communication Issues
- Ensure all services are running
- Check service URLs in environment variables
- Verify network connectivity between services

## Development Tips

1. Use PM2 for production-like local development
2. Use `npm run dev:all` for active development with hot reloading
3. Check PM2 logs regularly: `pm2 logs`
4. Monitor service health: `pm2 monit`
5. Use separate databases for each service to maintain isolation