# Course Management System Setup Guide

## 🎯 Overview
The Course Management System allows students to browse, enroll in, and track progress through various courses. It includes:

- **Course Browsing**: Search and filter courses by category, level, and keywords
- **Course Enrollment**: Students can enroll in courses
- **Progress Tracking**: Track completion and progress through courses
- **Course Details**: Detailed course information with instructor details

## 🗄️ Database Setup

### Option 1: Using phpMyAdmin
1. Open phpMyAdmin in your browser: `http://localhost/phpmyadmin`
2. Select the `eduyata_db` database
3. Go to the "SQL" tab
4. Copy and paste the contents of `server/api/course_setup.sql`
5. Click "Go" to execute the script

### Option 2: Using MySQL Command Line
```bash
mysql -u root -p eduyata_db < server/api/course_setup.sql
```

## 🚀 Features Implemented

### Backend (PHP)
- ✅ **Course Model** (`server/api/models/Course.php`)
  - Get all published courses
  - Filter by category, level, search
  - Get course details with enrollment status
  - Get course categories

- ✅ **Enrollment Model** (`server/api/models/Enrollment.php`)
  - Enroll students in courses
  - Track enrollment status and progress
  - Calculate course progress

- ✅ **API Endpoints**
  - `GET /courses/get_courses.php` - List all courses with filtering
  - `GET /courses/get_course.php` - Get single course details
  - `POST /courses/enroll_course.php` - Enroll in a course
  - `GET /courses/get_categories.php` - Get course categories

### Frontend (React/TypeScript)
- ✅ **CourseCard Component** (`client/src/components/CourseCard.tsx`)
  - Beautiful course cards with thumbnails
  - Course information display
  - Enrollment status indicators
  - Level and category badges

- ✅ **Courses Page** (`client/src/pages/Courses.tsx`)
  - Course browsing with search and filters
  - Category and level filtering
  - Responsive grid layout
  - Loading states and error handling

- ✅ **Course Detail Page** (`client/src/pages/CourseDetail.tsx`)
  - Detailed course information
  - Instructor details
  - Enrollment functionality
  - Progress tracking for enrolled students

## 🎨 Sample Data Included

### Categories
- 📐 Mathematics
- 🔬 Science  
- 📚 English
- 💻 Computer Science
- 🏛️ History
- 🎨 Arts

### Sample Courses
1. **Advanced Calculus & Applications** - Mathematics (Advanced)
2. **Web Development Bootcamp** - Computer Science (Intermediate)
3. **Physics Fundamentals** - Science (Beginner)
4. **Creative Writing Workshop** - English (Intermediate)

### Sample Teachers
- Dr. Sarah Johnson (Mathematics)
- Prof. Michael Chen (Physics)
- Ms. Emily Rodriguez (English)

## 🔗 Navigation

The course system is integrated into the existing navigation:

- **Dashboard**: "Browse Courses" button links to `/courses`
- **Courses Page**: `/courses` - Browse all available courses
- **Course Detail**: `/course/:id` - View specific course details

## 🧪 Testing

### Test Database Connection
```bash
cd server/api
php test_course_db.php
```

### Test API Endpoints
1. **Get all courses**: `http://localhost/AIEduPro/server/api/courses/get_courses.php`
2. **Get categories**: `http://localhost/AIEduPro/server/api/courses/get_categories.php`
3. **Get course details**: `http://localhost/AIEduPro/server/api/courses/get_course.php?id=1`

## 🎯 Next Steps

The course management system is now ready! Students can:

1. **Browse Courses**: Visit `/courses` to see all available courses
2. **Search & Filter**: Use the search bar and filters to find specific courses
3. **View Details**: Click on any course to see detailed information
4. **Enroll**: Click "Enroll Now" to join a course
5. **Track Progress**: View enrollment status and progress

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure XAMPP is running
   - Check database credentials in `server/api/config/database.php`

2. **CORS Errors**
   - Ensure `.htaccess` file is properly configured
   - Check that CORS headers are being sent

3. **Course Images Not Loading**
   - Images fallback to a default placeholder
   - Check internet connection for external image URLs

4. **Enrollment Fails**
   - Ensure student is logged in
   - Check that course exists and is published
   - Verify student ID is correct

### Debug Tools
- Use browser developer tools to check network requests
- Check browser console for JavaScript errors
- Use `test_course_db.php` to verify database setup

## 🎉 Success!

Your course management system is now fully functional! Students can browse, search, and enroll in courses with a beautiful, responsive interface. 