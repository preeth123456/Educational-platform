import React, { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
import NewHeader from '../components/NewHeader';
import SessionManager from '../utils/sessionManager';
import { getHeaderProps } from '../utils/headerUtils';
import '../pages/CoursesV2.css';
import EduyataSidebarDemo from '../components/NewSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { useLocation } from 'wouter';
import {
  FaSearch, FaFilter, FaTimes, FaBook, FaStar, FaClock, FaUser, FaGraduationCap,
  FaArrowRight, FaFire, FaTrophy, FaPlayCircle, FaEye, FaHeart
} from 'react-icons/fa';

interface Course {
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
  enrollment_count?: number;
  is_enrolled?: boolean;
  progress?: number;
  status?: string;
  enrollment_date?: string;
  rating?: number;
  students_count?: number;
  video_id?: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMyCourses, setLoadingMyCourses] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [teachers, setTeachers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentSession] = useState(SessionManager.getSession());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    fetchCourses();
    fetchCategories();
    if (studentSession?.id) {
      fetchMyCourses();
      loadUserTheme(studentSession.id);
    }
  }, [selectedCategory, selectedLevel, selectedTeacher, searchTerm, studentSession]);

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

  const fetchCourses = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:8001/api/courses/get_courses/';
      const params = new URLSearchParams();
      
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedLevel) params.append('level', selectedLevel);
      if (searchTerm) params.append('search', searchTerm);
      if (studentSession?.id) params.append('student_id', studentSession.id.toString());
      
      if (params.toString()) {
        url += '?' + params.toString();
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'success') {
        setCourses(data.data);
        // Extract unique teachers from courses
        const uniqueTeachers = [...new Set(data.data.map((course: Course) => course.instructor_name))];
        setTeachers(uniqueTeachers);
      } else {
        setError(data.message || 'Failed to fetch courses');
      }
    } catch (err) {
      setError('Failed to fetch courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/courses/get_categories/');
      const data = await response.json();

      if (data.status === 'success') {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchMyCourses = async () => {
    if (!studentSession?.id) return;
    
    try {
      setLoadingMyCourses(true);
      const response = await fetch(
        `http://localhost:8001/api/courses/my_courses/?student_id=${studentSession.id}`
      );
      const data = await response.json();

      if (data.status === 'success') {
        setMyCourses(data.data);
      }
    } catch (err) {
      console.error('Error fetching my courses:', err);
    } finally {
      setLoadingMyCourses(false);
    }
  };

  const handleEnroll = async (courseId: number) => {
    if (!studentSession) {
      alert('Please login to enroll in courses');
      return;
    }

    try {
      const response = await fetch('http://localhost:8001/api/courses/enroll_course/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentSession.id,
          course_id: courseId
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        alert('Successfully enrolled in course!');
        // Refresh courses to update enrollment status
        fetchCourses();
      } else {
        alert(data.message || 'Failed to enroll in course');
      }
    } catch (err) {
      alert('Failed to enroll in course');
      console.error('Error enrolling in course:', err);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedLevel('');
    setSelectedTeacher('');
    setSearchTerm('');
  };

  const filteredCourses = courses.filter(course => {
    if (selectedCategory && !course.category.includes(selectedCategory)) return false;
    if (selectedLevel && course.level !== selectedLevel) return false;
    if (selectedTeacher && course.instructor_name !== selectedTeacher) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return course.title.toLowerCase().includes(searchLower) || 
             course.description.toLowerCase().includes(searchLower);
    }
    return true;
  });

  const getCategoryIcon = (categoryName: string) => {
    const icons: { [key: string]: any } = {
      'Mathematics': FaBook,
      'Science': FaGraduationCap,
      'English': FaBook,
      'Computer Science': FaGraduationCap,
      'History': FaBook,
      'Arts': FaGraduationCap
    };
    return icons[categoryName] || FaBook;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }} className="courses-main-container">
      <EduyataSidebarDemo open={sidebarOpen} setOpen={setSidebarOpen} />
      <div 
        className="coursesv2-wrapper"
        style={{ 
          flex: 1, 
          paddingTop: '80px', 
          marginLeft: sidebarOpen ? '250px' : '60px', 
          transition: 'margin-left 0.3s ease', 
          width: sidebarOpen ? 'calc(100% - 250px)' : 'calc(100% - 60px)',
          maxWidth: 'none'
        }}
      >
        <NewHeader {...getHeaderProps()} studentId={studentSession?.id} />
      
        {/* Hero Section */}
        <div className="hero-welcome">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Explore <span className="hero-name">Amazing Courses</span> 📚</h1>
              <p className="hero-subtitle one-line">Discover world-class courses from expert instructors and advance your skills</p>
            </div>
          </div>
          </div>

        {/* Search and Filters */}
        <div className="search-filters-section">
          <div className="search-container">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search for courses, instructors, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="clear-search"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <button 
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="filters-panel">
              <div className="filters-row">
                <div className="filters-row-left">
                  <label className="filter-label">Category</label>
                </div>
                <div className="filters-row-right">
                  <label className="filter-label" style={{ margin: 0 }}>Level</label>
                  <select
                    className="level-select"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                  >
                    <option value="">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  <label className="filter-label" style={{ margin: '0 0 0 1rem' }}>Teacher</label>
                  <select
                    className="teacher-select"
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                  >
                    <option value="">All Teachers</option>
                    {teachers.map((teacher) => (
                      <option key={teacher} value={teacher}>
                        {teacher}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="filter-options">
                <button 
                  className={`filter-option ${!selectedCategory ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('')}
                >
                  All Categories
                </button>
                {categories.map((category) => {
                  const IconComponent = getCategoryIcon(category.name);
                  return (
                    <button
                      key={category.id}
                      className={`filter-option ${selectedCategory === category.name ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      <IconComponent className="filter-icon" />
                      {category.name}
                    </button>
                  );
                })}
              </div>

              {(selectedCategory || selectedLevel || selectedTeacher || searchTerm) && (
                <button onClick={clearFilters} className="clear-filters">
                  <FaTimes />
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="results-header">
          <div className="results-info">
            <h2 className="results-title">
              {filteredCourses.length} Course{filteredCourses.length !== 1 ? 's' : ''} Found
            </h2>
        {(selectedCategory || selectedLevel || selectedTeacher || searchTerm) && (
              <div className="active-filters">
                {selectedCategory && (
                  <span className="active-filter">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory('')} className="remove-filter">
                      <FaTimes />
                    </button>
                  </span>
                )}
                {selectedLevel && (
                  <span className="active-filter">
                    Level: {selectedLevel}
                    <button onClick={() => setSelectedLevel('')} className="remove-filter">
                      <FaTimes />
                    </button>
                  </span>
                )}
                {selectedTeacher && (
                  <span className="active-filter">
                    Teacher: {selectedTeacher}
                    <button onClick={() => setSelectedTeacher('')} className="remove-filter">
                      <FaTimes />
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="active-filter">
                    Search: "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="remove-filter">
                      <FaTimes />
              </button>
                  </span>
                )}
              </div>
            )}
          </div>
          {loading && (
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
              <span>Loading courses...</span>
            </div>
          )}
          </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <div className="error-icon">⚠️</div>
            <div className="error-content">
              <h3>Oops! Something went wrong</h3>
              <p>{error}</p>
            </div>
            </div>
          )}

        {/* Courses Grid */}
        {loading ? (
          <div className="courses-grid">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="course-card-skeleton">
                <div className="skeleton-thumbnail"></div>
                <div className="skeleton-content">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-instructor"></div>
                  <div className="skeleton-meta">
                    <div className="skeleton-chip"></div>
                    <div className="skeleton-chip"></div>
                  </div>
                  <div className="skeleton-button"></div>
            </div>
                </div>
              ))}
            </div>
        ) : filteredCourses.length > 0 ? (
          <div className="courses-page-grid">
            {filteredCourses.map((course) => (
              <CourseCard 
                key={course.id}
                course={course}
                onEnroll={handleEnroll}
                showEnrollButton={!course.is_enrolled}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3 className="empty-title">No courses found</h3>
            <p className="empty-description">
              Try adjusting your search criteria or explore our categories
            </p>
            <button onClick={clearFilters} className="explore-btn">
              Explore All Courses
            </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default Courses;
