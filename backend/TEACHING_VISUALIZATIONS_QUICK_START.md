# Teaching Analytics Visualizations - Quick Start Guide

## 🚀 Setup in 3 Steps

### Step 1: Create Database Indexes
```powershell
cd backend
node create-visualization-indexes.js
```

**Expected Output**: 
- ✅ 5 indexes for StudentEngagement
- ✅ 6 indexes for StudentPerformance  
- ✅ 6 indexes for AttendanceAssignment
- 🎉 17 total indexes created

---

### Step 2: Seed Sample Data
```powershell
node seed-teaching-visualizations.js
```

**Expected Output**:
- ✅ ~1,250 engagement records
- ✅ ~1,500 performance records
- ✅ ~2,400 attendance/assignment records
- 🎉 Ready for visualization!

---

### Step 3: Test API Endpoints

#### Test with authentication token
```powershell
# Set your token (replace with actual token from login)
$token = "your_jwt_token_here"

# Test Engagement Heatmap
curl http://localhost:3000/api/analytics/teaching/engagement-heatmap -H "Authorization: Bearer $token"

# Test Score Distribution
curl http://localhost:3000/api/analytics/teaching/score-distribution -H "Authorization: Bearer $token"

# Test Calendar Heatmap
curl http://localhost:3000/api/analytics/teaching/calendar-heatmap -H "Authorization: Bearer $token"
```

---

## 📊 Three New Endpoints

### 1. 🎯 Activity Heatmap (Day vs. Time)
**Endpoint**: `GET /api/analytics/teaching/engagement-heatmap`

**What it shows**:
- 7×24 grid showing when students are most active
- Engagement scores by day of week and hour
- Peak activity times
- Low-activity periods to address

**Query Parameters**:
- `startDate` (optional): Default is 30 days ago
- `endDate` (optional): Default is now
- `studentId` (optional): Filter for specific student

**Response**: 168 data points (7 days × 24 hours) with activity metrics

---

### 2. 📊 Score Distribution Histogram
**Endpoint**: `GET /api/analytics/teaching/score-distribution`

**What it shows**:
- How scores are distributed across 0-100 range
- Mean, median, mode, standard deviation
- Grade distribution (A+, A, B+, etc.)
- Outliers (students performing outside normal range)
- AI-powered insights

**Query Parameters**:
- `startDate` (optional): Default is 90 days ago
- `endDate` (optional): Default is now
- `category` (optional): quiz|test|assignment|overall (default: overall)
- `binSize` (optional): Score range per bin (default: 10)

**Response**: Histogram bins, statistics, outliers, insights

---

### 3. ⏰ Calendar Heatmap (Attendance & Assignments)
**Endpoint**: `GET /api/analytics/teaching/calendar-heatmap`

**What it shows**:
- Daily consistency scores (0-100)
- Attendance patterns over time
- Assignment submission rates
- Streaks and trends
- Weekly/monthly summaries

**Query Parameters**:
- `startDate` (optional): Default is 180 days ago (6 months)
- `endDate` (optional): Default is now
- `studentId` (optional): Filter for specific student

**Response**: Calendar data, statistics, weekly stats, insights

---

## 🔧 Troubleshooting

### Issue: "No tutors or learners found"
**Solution**: Run the main seeding script first:
```powershell
node seed-database.js
```

### Issue: "Authorization required"
**Solution**: 
1. Login to get a token: `POST /api/auth/login`
2. Use token in Authorization header
3. Make sure user role is "tutor"

### Issue: "No data returned"
**Solution**: Run the visualization seeding script:
```powershell
node seed-teaching-visualizations.js
```

---

## 📈 Data Models Summary

| Model | Purpose | Records Created |
|-------|---------|-----------------|
| StudentEngagement | Activity heatmap (day × time) | ~1,250 |
| StudentPerformance | Score distribution histogram | ~1,500 |
| AttendanceAssignment | Calendar heatmap | ~2,400 |

---

## 🎨 Frontend Integration (Coming Next)

After backend setup, create these React components:

1. **ActivityHeatmapChart.jsx**
   - 7×24 grid visualization
   - Color intensity based on engagement
   - Tooltip with activity details

2. **ScoreDistributionChart.jsx**
   - Bar chart histogram
   - Statistics display
   - Outlier highlighting

3. **CalendarHeatmapChart.jsx**
   - Calendar grid (6 months)
   - Color-coded consistency
   - Streak indicators

---

## ✅ Verification

After setup, verify:
- [ ] All indexes created (17 total)
- [ ] Sample data seeded (5,150+ records)
- [ ] All 3 endpoints respond with data
- [ ] Response time < 500ms
- [ ] Data includes recent dates
- [ ] Statistics calculated correctly

---

## 📚 Documentation

- Full docs: `TEACHING_VISUALIZATIONS_IMPLEMENTATION.md`
- API details: See "API Endpoints" section
- Frontend examples: See "Frontend Integration Guide"

---

## 🎯 Key Benefits

✅ **Instant Insights**: See student engagement patterns at a glance  
✅ **Data-Driven**: Make scheduling decisions based on activity peaks  
✅ **Early Detection**: Identify struggling students via outliers  
✅ **Consistency Tracking**: Monitor attendance and submission patterns  
✅ **Performance Analysis**: Understand class-wide score distribution  

---

**Ready to visualize your teaching analytics!** 🚀
