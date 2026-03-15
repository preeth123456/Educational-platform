import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import NewHeader from '../components/NewHeader';
import SessionManager from '../utils/sessionManager';
import { getHeaderProps } from '../utils/headerUtils';
import { usageTrackingService } from '../services/usageTrackingService';
import './CourseStyles.css';

interface CourseDetail {
  id: number;
  course_id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration_hours: number;
  price: number;
  thumbnail_url: string;
  instructor_name: string;
  qualification: string;
  experience_years: number;
  enrollment_count: number;
  is_enrolled: boolean;
  enrollment_data?: {
    enrollment_date: string;
    progress_percentage: number;
    status: string;
  };
}

interface CourseDetailProps {
  courseId: string;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ courseId }) => {
  const [, setLocation] = useLocation();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [studentSession] = useState(SessionManager.getSession());

  // Fetch course structure data
  const [courseStructure, setCourseStructure] = useState<any>(null);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetail();
      fetchCourseStructure();
    }
    if (studentSession?.id) {
      loadUserTheme(studentSession.id);
    }
  }, [courseId, studentSession]);

  const fetchCourseStructure = async () => {
    try {
      const response = await fetch(`http://localhost:8001/api/courses/course/${courseId}/structure/`);
      const data = await response.json();
      if (data.status === 'success') {
        setCourseStructure(data.data);
      }
    } catch (error) {
      console.error('Error fetching course structure:', error);
    }
  };

  const loadUserTheme = async (studentId: number) => {
    try {
      const response = await fetch(`http://localhost:8001/api/auth/get_user_preferences/?student_id=${studentId}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        applyTheme(data.data.theme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-theme');
    } else if (theme === 'light') {
      root.classList.remove('dark-theme');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark-theme');
      } else {
        root.classList.remove('dark-theme');
      }
    }
  };

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`http://localhost:8001/api/courses/get_courses/?student_id=${studentSession?.id || ''}`);
      const data = await response.json();
      
      if (data.status === 'success' && data.data.length > 0) {
        const courseData = data.data.find((c: any) => c.id.toString() === courseId || c.course_id === courseId);
        
        if (courseData) {
          setCourse({
            ...courseData,
            experience_years: 8,
            enrollment_count: courseData.students_count,
            enrollment_data: courseData.is_enrolled && courseData.enrollment_data ? {
              enrollment_date: courseData.enrollment_data.enrollment_date,
              progress_percentage: courseData.enrollment_data.progress_percentage,
              status: 'enrolled'
            } : null
          });
        } else {
          setError('Course not found');
        }
      } else {
        setError('Course not found');
      }
    } catch (err) {
      setError('Failed to fetch course details');
      console.error('Error fetching course details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!studentSession) {
      alert('Please login to enroll in this course');
      return;
    }

    if (!course) return;

    try {
      setEnrolling(true);
      const response = await fetch('http://localhost:8001/api/courses/enroll_course/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentSession.id,
          course_id: course.id
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        alert('Successfully enrolled in course!');
        
        // Track course enrollment
        if (studentSession?.id) {
          usageTrackingService.trackUsage({
            userId: studentSession.id,
            userType: 'student',
            action: 'course_enrollment',
            resourceId: course.id.toString(),
            quantity: 1,
            unit: 'count',
            metadata: { courseTitle: course.title, courseCategory: course.category }
          });
        }
        
        // Refresh course details to update enrollment status
        fetchCourseDetail();
      } else {
        alert(data.message || 'Failed to enroll in course');
      }
    } catch (err) {
      alert('Failed to enroll in course');
      console.error('Error enrolling in course:', err);
    } finally {
      setEnrolling(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Mathematics': '📐',
      'Science': '🔬',
      'English': '📚',
      'Computer Science': '💻',
      'History': '🏛️',
      'Arts': '🎨'
    };
    return icons[category] || '📖';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 course-detail-container">
        <NewHeader {...getHeaderProps()} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 course-detail-container">
        <NewHeader {...getHeaderProps()} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The course you are looking for does not exist.'}</p>
            <button
              onClick={() => setLocation('/courses')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Back to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 course-detail-container">
      <NewHeader {...getHeaderProps()} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <button 
                onClick={() => setLocation('/courses')}
                className="hover:text-blue-600"
              >
                Courses
              </button>
            </li>
            <li>/</li>
            <li className="text-gray-900">{course.title}</li>
          </ol>
        </nav>

        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            <img 
              src={course.thumbnail_url} 
              alt={course.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500';
              }}
            />
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                {course.level}
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {getCategoryIcon(course.category)} {course.category}
              </span>
            </div>
            {course.is_enrolled && (
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✓ Enrolled
                </span>
              </div>
            )}
          </div>

          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-medium">
                    {course.instructor_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{course.instructor_name}</p>
                  <p className="text-sm text-gray-500">{course.qualification}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span>⏱️ {course.duration_hours} hours</span>
                <span>👥 {course.enrollment_count} students enrolled</span>
                <span>🎓 {course.experience_years} years experience</span>
              </div>
            </div>

            <div className="flex justify-end">
              {!course.is_enrolled ? (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              ) : (
                <button
                  onClick={() => setLocation(`/course/${course.id}/learn`)}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                >
                  Continue Learning
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Course Description */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Course</h2>
          <p className="text-gray-600 leading-relaxed mb-6">{course.description}</p>
          
        {/* Course Structure */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">📚 Course Structure</h2>
          
          {courseStructure?.chapters?.map((chapter, index) => (
            <div key={chapter.id} className="mb-6 border border-gray-200 rounded-lg">
              <div className={`p-4 border-b border-gray-200 ${
                index % 4 === 0 ? 'bg-blue-50' :
                index % 4 === 1 ? 'bg-green-50' :
                index % 4 === 2 ? 'bg-purple-50' : 'bg-orange-50'
              }`}>
                <h3 className={`text-lg font-semibold ${
                  index % 4 === 0 ? 'text-blue-900' :
                  index % 4 === 1 ? 'text-green-900' :
                  index % 4 === 2 ? 'text-purple-900' : 'text-orange-900'
                }`}>
                  Chapter {chapter.chapter_no}: {chapter.title}
                </h3>
                <p className={`text-sm mt-1 ${
                  index % 4 === 0 ? 'text-blue-700' :
                  index % 4 === 1 ? 'text-green-700' :
                  index % 4 === 2 ? 'text-purple-700' : 'text-orange-700'
                }`}>
                  {chapter.lessons?.length || 0} lessons
                </p>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">📖 Lessons</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {chapter.lessons?.map((lesson) => (
                        <li key={lesson.id}>• {lesson.title}</li>
                      )) || <li className="text-gray-400">No lessons available</li>}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">📹 Content</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {chapter.lessons?.map((lesson) => (
                        lesson.contents?.map((content) => (
                          <li key={content.id}>• {content.title} ({content.content_type})</li>
                        ))
                      )).flat() || <li className="text-gray-400">No content available</li>}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )) || (
            <div className="text-center py-8 text-gray-500">
              <p>Course structure will be available soon</p>
            </div>
          )}
        </div>

          {/* Learning Objectives */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">🎯 Learning Objectives</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-600">Master fundamental number system concepts</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-600">Solve polynomial equations effectively</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-600">Apply linear equations to real-world problems</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-600">Understand coordinate geometry principles</span>
              </div>
            </div>
          </div>

          {/* Prerequisites */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">📋 Prerequisites</h3>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <ul className="text-yellow-800 space-y-2">
                <li>• Basic arithmetic operations</li>
                <li>• Understanding of fractions and decimals</li>
                <li>• Elementary algebra concepts</li>
                <li>• Class 8 Mathematics completion</li>
              </ul>
            </div>
          </div>

          {/* Assessment Methods */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 Assessment Methods</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">40%</div>
                <div className="text-sm text-blue-700">Chapter Tests</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">35%</div>
                <div className="text-sm text-green-700">Assignments</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">25%</div>
                <div className="text-sm text-purple-700">Final Exam</div>
              </div>
            </div>
          </div>

          {/* Course Timeline */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">⏰ Course Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-4"></div>
                <div className="flex-1">
                  <div className="font-medium">Week 1-2: Number System</div>
                  <div className="text-sm text-gray-600">Foundation concepts and practice</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-4"></div>
                <div className="flex-1">
                  <div className="font-medium">Week 3-4: Polynomials</div>
                  <div className="text-sm text-gray-600">Theory and problem solving</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded-full mr-4"></div>
                <div className="flex-1">
                  <div className="font-medium">Week 5-6: Linear Equations</div>
                  <div className="text-sm text-gray-600">Applications and graphing</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-500 rounded-full mr-4"></div>
                <div className="flex-1">
                  <div className="font-medium">Week 7-8: Coordinate Geometry</div>
                  <div className="text-sm text-gray-600">Advanced concepts and review</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enrollment Status */}
        {course.is_enrolled && course.enrollment_data && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {course.enrollment_data.progress_percentage}%
                </div>
                <div className="text-sm text-gray-500">Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {course.enrollment_data.status}
                </div>
                <div className="text-sm text-gray-500">Status</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Date(course.enrollment_data.enrollment_date).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-500">Enrolled</div>
              </div>
            </div>
          </div>
        )}

        {/* What You'll Learn */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Resources & Materials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">📚 Required Materials</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• NCERT Mathematics Textbook Class 9</li>
                <li>• Scientific calculator</li>
                <li>• Graph paper and ruler</li>
                <li>• Practice workbook (provided)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">🔗 Additional Resources</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Interactive online exercises</li>
                <li>• Video lecture recordings</li>
                <li>• Practice test papers</li>
                <li>• Doubt clearing sessions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Instructor Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Meet Your Instructor</h2>
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">
                {course.instructor_name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">{course.instructor_name}</h3>
              <p className="text-gray-600 mb-2">{course.qualification}</p>
              <p className="text-sm text-gray-500 mb-3">
                {course.experience_years} years of teaching experience in Mathematics
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Specialization:</span>
                  <div className="text-gray-600">Algebra & Geometry</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Students Taught:</span>
                  <div className="text-gray-600">500+ students</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Rating:</span>
                  <div className="text-yellow-600">★★★★★ 4.8/5</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Features */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">🎥</div>
              <div className="font-medium text-gray-900">HD Video Lectures</div>
              <div className="text-sm text-gray-600">20+ hours of content</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">📝</div>
              <div className="font-medium text-gray-900">Practice Tests</div>
              <div className="text-sm text-gray-600">50+ questions</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-2">📱</div>
              <div className="font-medium text-gray-900">Mobile Access</div>
              <div className="text-sm text-gray-600">Learn anywhere</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl mb-2">🏆</div>
              <div className="font-medium text-gray-900">Certificate</div>
              <div className="text-sm text-gray-600">Upon completion</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail; 