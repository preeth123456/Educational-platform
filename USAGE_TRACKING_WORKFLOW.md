# 📊 USAGE TRACKING & METERING - COMPLETE WORKFLOW

## **FEATURE OVERVIEW**
Tracks and meters user activities on the platform to calculate billing charges.

---

## **WHAT IT TRACKS**

### **For Students:**
- Course enrollments
- Video watch time (minutes)
- Assignment submissions
- Quiz attempts
- Live class attendance
- Document downloads
- Storage used (MB)

### **For Teachers:**
- Courses created
- Students enrolled in their courses
- Live classes conducted
- Materials uploaded
- Storage used (MB)

### **For Platform:**
- Total active users
- API calls made
- Bandwidth consumed
- Storage usage

---

## **END-TO-END WORKFLOW**

### **Step 1: User Performs Action**
```
Student watches video → System logs event
Teacher creates course → System logs event
Student enrolls in course → System logs event
```

### **Step 2: Event Logging**
```javascript
{
  userId: 123,
  userType: "student",
  action: "video_watch",
  resourceId: "video_456",
  quantity: 45, // minutes watched
  timestamp: "2024-01-15T10:30:00Z",
  metadata: {
    courseId: 789,
    videoTitle: "Introduction to React"
  }
}
```

### **Step 3: Data Aggregation**
```
Hourly: Sum all events per user
Daily: Calculate daily totals
Monthly: Generate billing summary
```

### **Step 4: Usage Summary Generation**
```javascript
{
  userId: 123,
  period: "2024-01",
  metrics: {
    coursesEnrolled: 5,
    videoWatchTime: 1200, // minutes
    assignmentsSubmitted: 15,
    quizzesTaken: 10,
    storageUsed: 250 // MB
  },
  estimatedCost: 499.00 // INR
}
```

### **Step 5: Display to User**
- Student Dashboard: "You've watched 20 hours this month"
- Admin Dashboard: "Total platform usage: 50,000 hours"
- Billing Page: "Your usage charges: ₹499"

---

## **WHERE IT FITS IN YOUR PROJECT**

### **Student Side:**
- **Location:** `client/src/pages/Dashboard.tsx`
- **Add:** Usage metrics card showing their consumption
- **New Page:** `client/src/pages/StudentUsagePage.tsx`

### **Teacher Side:**
- **Location:** `client/src/Teacher/pages/TeacherDashboard.tsx`
- **Add:** Usage metrics for their courses
- **New Page:** `client/src/Teacher/pages/TeacherUsagePage.tsx`

### **Admin Side:**
- **Location:** `client/src/pages/AdminDashboard.tsx`
- **Add:** Platform-wide usage overview
- **New Page:** `client/src/pages/AdminUsagePage.tsx`

---

## **DATA FLOW**

```
User Action
    ↓
usageTrackingService (trackUsage)
    ↓
localStorage (persist data)
    ↓
usageTrackingService (getUsageSummary)
    ↓
UsageMetricsCard (display)
    ↓
AdminUsagePage (full view)
```

---

## **MOCK DATA STRUCTURE**

### **Usage Event:**
```typescript
interface UsageEvent {
  id: string;
  userId: number;
  userType: 'student' | 'teacher' | 'admin';
  action: UsageAction;
  resourceId: string;
  quantity: number;
  unit: 'minutes' | 'count' | 'MB' | 'GB';
  timestamp: string;
  metadata?: Record<string, any>;
}
```

### **Usage Summary:**
```typescript
interface UsageSummary {
  userId: number;
  period: string; // "2024-01"
  coursesEnrolled: number;
  videoWatchTime: number; // minutes
  assignmentsSubmitted: number;
  quizzesTaken: number;
  storageUsed: number; // MB
  liveClassesAttended: number;
  totalCost: number; // INR
}
```

---

## **PRICING LOGIC (Example)**

```typescript
// Per-unit pricing
const PRICING = {
  courseEnrollment: 99,      // ₹99 per course
  videoWatchHour: 5,         // ₹5 per hour
  storageGB: 10,             // ₹10 per GB/month
  liveClassHour: 50,         // ₹50 per hour
};

// Calculate cost
function calculateCost(usage: UsageSummary): number {
  return (
    usage.coursesEnrolled * PRICING.courseEnrollment +
    (usage.videoWatchTime / 60) * PRICING.videoWatchHour +
    (usage.storageUsed / 1024) * PRICING.storageGB +
    (usage.liveClassesAttended * 1) * PRICING.liveClassHour
  );
}
```

---

## **UI COMPONENTS**

### **1. UsageMetricsCard.tsx**
- Displays key usage metrics
- Shows current month usage
- Compares with previous month
- Visual progress bars

### **2. UsageChart.tsx**
- Line chart showing usage over time
- Bar chart for different usage types
- Interactive tooltips

### **3. UsageTable.tsx**
- Detailed usage breakdown
- Filterable by date range
- Exportable to CSV

### **4. AdminUsagePage.tsx**
- Complete usage dashboard
- All users' usage
- Search and filter
- Export reports

---

## **INTEGRATION POINTS**

### **Track Usage When:**
1. Student enrolls in course → `trackUsage('course_enrollment')`
2. Video player updates → `trackUsage('video_watch', minutes)`
3. Assignment submitted → `trackUsage('assignment_submission')`
4. Quiz completed → `trackUsage('quiz_attempt')`
5. File uploaded → `trackUsage('storage_usage', fileSizeMB)`

### **Example Integration:**
```typescript
// In VideoPlayer.tsx
useEffect(() => {
  const interval = setInterval(() => {
    usageTrackingService.trackUsage({
      userId: currentUser.id,
      userType: 'student',
      action: 'video_watch',
      resourceId: videoId,
      quantity: 1, // 1 minute
      unit: 'minutes'
    });
  }, 60000); // Every minute

  return () => clearInterval(interval);
}, []);
```

---

## **FILES TO CREATE**

1. ✅ `client/src/services/usageTrackingService.ts`
2. ✅ `client/src/components/UsageMetricsCard.tsx`
3. ✅ `client/src/components/UsageChart.tsx`
4. ✅ `client/src/pages/AdminUsagePage.tsx`
5. ✅ `client/src/pages/StudentUsagePage.tsx`

---

## **TESTING CHECKLIST**

- [ ] Track usage event successfully
- [ ] View usage in student dashboard
- [ ] View usage in admin dashboard
- [ ] Filter usage by date range
- [ ] Export usage report
- [ ] Calculate cost correctly
- [ ] Display charts properly
- [ ] Data persists in localStorage

---

## **NEXT FEATURE**
After this is complete, we'll build: **Revenue & Transaction Ledger**
