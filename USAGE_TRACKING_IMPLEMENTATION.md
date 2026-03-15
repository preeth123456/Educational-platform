# Usage Tracking Implementation

## Overview
Implemented a comprehensive usage tracking system that displays student activity metrics based on actual database data.

## Backend Changes

### 1. New API Endpoint
**File**: `django_backend/auth_app/student_views.py`

Added `dashboard_stats` function that returns:
- **Courses Enrolled**: Count of active enrollments from `student_enrollments` table
- **Video Watch Time**: Total watch time from `video_progress` table (formatted as "Xh Ym")
- **Assignments Submitted**: Count from `quiz_results` table where `quiz_type = 'practice_quiz'`
- **Quizzes Taken**: Count from `quiz_results` table where `quiz_type` is topic/chapter/final quiz
- **Estimated Cost**: Calculated as ₹100 per enrolled course

**API Endpoint**: `GET /api/auth/students/dashboard-stats/?student_id={id}`

**Response Format**:
```json
{
  "status": "success",
  "data": {
    "courses_enrolled": 7,
    "video_watch_time": "2h 30m",
    "assignments_submitted": 5,
    "quizzes_taken": 12,
    "estimated_cost": "₹700.00"
  }
}
```

### 2. URL Configuration
**File**: `django_backend/auth_app/urls.py`

Added route: `path('students/dashboard-stats/', student_views.dashboard_stats, name='dashboard_stats')`

## Frontend Changes

### Updated Component
**File**: `client/src/components/UsageMetricsCard.tsx`

Changes:
1. Updated API endpoint to `/api/auth/students/dashboard-stats/`
2. Modified interface to match backend response format
3. Changed `videoWatchTime` from number to string (already formatted)
4. Changed `totalCost` to `estimatedCost` as string
5. Updated data mapping to use correct field names from API response

## Database Tables Used

1. **student_enrollments**: Tracks course enrollments
2. **video_progress**: Tracks video watch time per student
3. **quiz_results**: Tracks quiz attempts and assignments

## How It Works

1. Student logs in and views dashboard
2. `UsageMetricsCard` component fetches data using student ID
3. Backend queries multiple tables to aggregate usage statistics
4. Data is displayed in a clean card format showing:
   - Courses Enrolled (with icon)
   - Video Watch Time (formatted)
   - Assignments Submitted (count)
   - Quizzes Taken (count)
   - Estimated Cost (at bottom)

## Cost Calculation
- Base rate: ₹100 per course enrolled
- Formula: `courses_enrolled × 100`
- Example: 7 courses = ₹700.00

## Testing
To test the implementation:
1. Ensure Django backend is running on port 8001
2. Login as a student
3. Navigate to dashboard
4. Check "My Usage This Month" section
5. Verify all metrics display correctly

## Future Enhancements
- Add actual assignment submission tracking (separate from quizzes)
- Implement monthly reset for usage tracking
- Add usage history and trends
- Include storage usage metrics
- Add export usage report feature
