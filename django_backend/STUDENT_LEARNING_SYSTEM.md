# Student Learning System APIs - Implementation Guide

## Overview
Three new APIs have been implemented to support the student course learning experience at `http://localhost:5173/course/1/learn`.

## API Endpoints

### 1. Get Course Details
**Endpoint:** `GET /api/courses/course/{course_id}/details/`
**Purpose:** Get course basic info, teacher details, approval status

**Example Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "course_id": "COURSE0001",
    "title": "ICSE Class 1st Mathematics - Chapter 1 - Lesson 1 - Topic 1",
    "description": "Course description",
    "category": "ICSE - 1st - Mathematics",
    "level": "Beginner",
    "duration_hours": 10,
    "price": 0.0,
    "thumbnail_url": "",
    "teacher": {
      "id": 1,
      "name": "Teacher Name",
      "qualification": "M.Sc Mathematics",
      "email": "teacher@example.com"
    }
  }
}
```

### 2. Get Course Structure
**Endpoint:** `GET /api/courses/course/{course_id}/structure/`
**Purpose:** Get complete hierarchical structure: course → chapters → lessons → content

**Example Response:**
```json
{
  "status": "success",
  "data": {
    "course": {
      "id": 1,
      "title": "Course Title"
    },
    "chapters": [
      {
        "id": 1,
        "title": "Chapter 1: Introduction",
        "chapter_no": 1,
        "created_at": "2024-01-02T10:00:00",
        "lessons": [
          {
            "id": 1,
            "title": "Lesson 1: Basics",
            "lesson_no": 1,
            "created_at": "2024-01-02T10:30:00",
            "contents": [
              {
                "id": 1,
                "title": "Introduction Video",
                "description": "Welcome video",
                "content_type": "VIDEO",
                "file_url": "/videos/intro.mp4",
                "content_order": 1,
                "created_at": "2024-01-02T11:00:00"
              },
              {
                "id": 2,
                "title": "Study Material",
                "description": "PDF notes",
                "content_type": "PDF",
                "file_url": "/pdfs/notes.pdf",
                "content_order": 2,
                "created_at": "2024-01-02T11:15:00"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### 3. Check Enrollment
**Endpoint:** `GET /api/courses/course/{course_id}/enrollment/{student_id}/`
**Purpose:** Verify if student is enrolled in this course

**Example Response:**
```json
{
  "status": "success",
  "data": {
    "is_enrolled": true,
    "enrollment_id": 1,
    "enrollment_status": "enrolled",
    "enrollment_date": "2024-01-01T09:00:00",
    "progress_percentage": 25.5
  }
}
```

## Frontend Implementation Guide

### React Component Structure
```
/course/1/learn
├── CourseHeader (course title, teacher info)
├── ChapterSidebar (collapsible chapters/lessons)
├── LessonContent (main content area)
│   ├── VideoPlayer (for VIDEO content)
│   ├── PDFViewer (for PDF content)
│   ├── TextContent (for TEXT content)
│   └── QuizComponent (for QUIZ content)
└── ProgressTracker (completion percentage)
```

### API Usage Flow
1. **Page Load:** Call `check_enrollment` to verify student access
2. **If Enrolled:** Call `get_course_details` and `get_course_structure`
3. **Render UI:** Display course with first lesson by default
4. **Navigation:** Allow clicking through chapters/lessons
5. **Content Display:** Show appropriate viewer based on content_type

### Key Features to Implement
- ✅ Only show approved courses (status = 1)
- ✅ Verify student enrollment before showing content
- ✅ Hierarchical navigation (chapters → lessons → content)
- ✅ Multiple content types (VIDEO, PDF, TEXT, QUIZ)
- ✅ Teacher information display
- ✅ Progress tracking integration

### Content Type Handling
```javascript
const renderContent = (content) => {
  switch(content.content_type) {
    case 'VIDEO':
      return <VideoPlayer src={content.file_url} title={content.title} />;
    case 'PDF':
      return <PDFViewer src={content.file_url} title={content.title} />;
    case 'TEXT':
      return <TextContent content={content.description} />;
    case 'QUIZ':
      return <QuizComponent quizData={content} />;
    default:
      return <div>Unsupported content type</div>;
  }
};
```

### Error Handling
- Course not found or not approved → Redirect to courses page
- Student not enrolled → Show enrollment prompt
- API errors → Show error message with retry option

## Database Schema Used
- **courses** (status = 1 for approved)
- **chapters** (ordered by chapter_no)
- **lessons** (ordered by lesson_no)
- **lesson_contents** (ordered by content_order)
- **student_enrollments** (enrollment verification)

## Testing
Run the test script to verify APIs:
```bash
cd django_backend
python test_student_apis.py
```

## Next Steps
1. Implement the React frontend components
2. Add video player with progress tracking
3. Add PDF viewer component
4. Integrate with existing progress tracking APIs
5. Add navigation between lessons
6. Implement content completion tracking