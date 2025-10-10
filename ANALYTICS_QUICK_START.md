# Quick Start Guide - Analytics Testing

## Start Backend Server

```powershell
# Navigate to backend directory
cd E:\learning-management-system\backend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
🚀 Learning Management System Backend running on port 3000
✅ MongoDB connected successfully
📊 Health check: http://localhost:3000/health
🔗 API Base URL: http://localhost:3000/api
```

## Start Frontend Server

Open a **NEW PowerShell terminal** and run:

```powershell
# Navigate to frontend directory
cd E:\learning-management-system\frontend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Test Analytics Connection

1. **Open browser** → http://localhost:5173
2. **Login** with your credentials
3. **Navigate to Analytics** (click "View Detailed Analytics" on Dashboard)
4. **Check browser console** (F12) for any errors
5. **Verify data loads** - You should see charts and statistics

## Quick Verification Checklist

✅ Backend running on port 3000
✅ Frontend running on port 5173  
✅ MongoDB connected (check backend console)
✅ Logged in successfully (check localStorage for 'accessToken')
✅ Analytics page loads without errors

## Troubleshooting

### Backend won't start
```powershell
# Check if port 3000 is in use
netstat -ano | findstr :3000

# If port is occupied, kill the process or change PORT in .env
```

### Frontend shows connection error
- Verify backend is running (should see the 🚀 message)
- Check MongoDB is running
- Verify you're logged in (refresh token should be valid)

### Analytics shows "Failed to load data"
- Open browser console (F12) to see detailed error
- Check Network tab for failed requests
- Verify authentication token exists in localStorage
- Ensure user has some data in MongoDB (sessions, skills)

## Test with Browser Console

After logging in, test the API directly:

```javascript
// Get your token
const token = localStorage.getItem('accessToken');
console.log('Token:', token ? 'Found' : 'Missing');

// Test analytics endpoint
fetch('/api/users/analytics?timeframe=30d&metrics=learning,engagement', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => r.json())
  .then(data => console.log('Analytics:', data))
  .catch(err => console.error('Error:', err));

// Test session stats  
fetch('/api/sessions/stats', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => r.json())
  .then(data => console.log('Session Stats:', data))
  .catch(err => console.error('Error:', err));
```

## What Was Fixed

1. ✅ **Route Order** - Moved specific routes before `/:id` in `backend/src/routes/users.js`
2. ✅ **Endpoint Path** - Changed `/sessions/statistics` → `/sessions/stats`
3. ✅ **Response Handling** - Fixed achievements data extraction
4. ✅ **Error Messages** - Added detailed error reporting in frontend

## Next Steps

If everything works:
- Analytics page should show your learning statistics
- Charts should render with your session data
- No console errors should appear

If issues persist:
- Check `ANALYTICS_CONNECTION_FIX.md` for detailed troubleshooting
- Verify MongoDB has session data for your user
- Check backend logs for any error messages
