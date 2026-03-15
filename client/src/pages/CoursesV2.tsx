import React, { useState } from 'react';
import './CoursesV2.css';
import { FaSearch, FaSortAlphaDown, FaThLarge, FaList, FaStar } from 'react-icons/fa';
import EduyataSidebarDemo from '../components/NewSidebar';
import NewHeader from '../components/NewHeader';
import { useLocation } from 'wouter';

const mockStudentData = {
  name: "Virat Kohli",
  role: "Student",
  college: "BASE PU College",
  location: "Bannerghatta road",
  avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120",
};

const categories = [
  { id: 'all', name: 'All Courses' },
  { id: 'mathematics', name: 'Mathematics' },
  { id: 'science', name: 'Science' },
  { id: 'technology', name: 'Technology' },
  { id: 'humanities', name: 'Humanities' },
  { id: 'arts', name: 'Arts' },
  { id: 'physical', name: 'Physical Ed.' },
];

const subjectColors: Record<string, string> = {
  mathematics: '#c2a2fc',
  science: '#b3e6b3',
  technology: '#b3e6e6',
  humanities: '#d1b3ff',
  arts: '#fbc2eb',
  physical: '#ffe082',
  default: '#e0e7ff',
};

const mockCourses = [
  {
    id: 1,
    title: 'Advanced Calculus & Applications',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80',
    subject: 'mathematics',
    rating: 4.9,
    description: 'Master calculus concepts from derivatives to integrals with real-world applications.',
    instructor: 'Prof. Maria Johnson',
    instructorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    enrolled: true,
    progress: 65
  },
  {
    id: 5,
    title: 'Introduction to Artificial Intelligence',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    subject: 'science',
    rating: 4.6,
    description: 'Explore the fundamentals of AI, machine learning, and neural networks.',
    instructor: 'Dr. Sarah Williams',
    instructorAvatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    enrolled: true,
    progress: 42
  },
  {
    id: 2,
    title: 'Web Development Bootcamp',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80',
    subject: 'technology',
    rating: 4.8,
    description: 'Learn full-stack development from HTML and CSS to Node.js and React.',
    instructor: 'Michael Rodriguez',
    instructorAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    enrolled: true,
    progress: 78
  },
  {
    id: 3,
    title: 'Introduction to Literature',
    image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80',
    subject: 'humanities',
    rating: 4.7,
    description: 'Dive into classic and modern literature from around the world.',
    instructor: 'Prof. Emily Davis',
    instructorAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    enrolled: false,
    progress: 0
  },
  {
    id: 4,
    title: 'Modern Art History',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
    subject: 'arts',
    rating: 4.5,
    description: 'Trace the evolution of modern art from Impressionism to today.',
    instructor: 'Prof. James Miller',
    instructorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    enrolled: false,
    progress: 0
  },
  {
    id: 6,
    title: 'Physical Education Basics',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80',
    subject: 'physical',
    rating: 4.3,
    description: 'Stay fit and healthy with foundational physical education concepts.',
    instructor: 'Coach Lisa Brown',
    instructorAvatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    enrolled: false,
    progress: 0
  },
];

export default function CoursesV2() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('title-asc');
  const [view, setView] = useState('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, setLocation] = useLocation();

  const filteredCourses = mockCourses
    .filter(course =>
      (filter === 'all' || course.subject === filter) &&
      (course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.subject.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
      if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      if (sortBy === 'rating-asc') return a.rating - b.rating;
      return 0;
    });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f7f7fa' }}>
      <EduyataSidebarDemo open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="coursesv2-wrapper" style={{ flex: 1, paddingTop: '80px', marginLeft: sidebarOpen ? '250px' : '60px', transition: 'margin-left 0.3s ease', width: sidebarOpen ? 'calc(100% - 250px)' : 'calc(100% - 60px)' }}>
        <NewHeader
          avatar={mockStudentData.avatar}
          name={mockStudentData.name}
          role={mockStudentData.role}
          searchPlaceholder="Search for courses, assignments..."
          onSearch={(query) => console.log('Search:', query)}
        />
        <h1 className="coursesv2-title">My Courses</h1>
        <p className="coursesv2-subtext">Access your enrolled courses and track your progress.</p>

        {/* Move filters above controls */}
        <div className="coursesv2-categories">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`coursesv2-pill${filter === cat.id ? ' active' : ''}`}
              onClick={() => setFilter(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="coursesv2-controls">
          <div className="coursesv2-searchbar">
            <FaSearch className="coursesv2-searchicon" />
            <input
              type="text"
              placeholder="Search by course name or subject..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="coursesv2-sortview">
            <span className="coursesv2-sorticon"><FaSortAlphaDown /></span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="coursesv2-dropdown"
            >
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="rating-desc">Rating (High to Low)</option>
              <option value="rating-asc">Rating (Low to High)</option>
            </select>
            <button
              className={`coursesv2-toggle${view === 'grid' ? ' active' : ''}`}
              onClick={() => setView('grid')}
              aria-label="Grid view"
            >
              <FaThLarge />
            </button>
            <button
              className={`coursesv2-toggle${view === 'list' ? ' active' : ''}`}
              onClick={() => setView('list')}
              aria-label="List view"
            >
              <FaList />
            </button>
          </div>
        </div>

        <div className={`coursesv2-cards ${view}`}> 
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="coursesv2-card"
              style={{ borderColor: subjectColors[course.subject] || subjectColors.default }}
            >
              <img src={course.image} alt={course.title} className="coursesv2-card-img" />
              <div className="coursesv2-card-content">
                <div className="coursesv2-card-row">
                  <span className="coursesv2-tag" style={{ background: subjectColors[course.subject] || subjectColors.default }}>
                    {course.subject}
                  </span>
                  <span className="coursesv2-rating">
                    <FaStar style={{ color: '#f59e0b', marginRight: 4 }} />
                    {course.rating}
                  </span>
                </div>
                <h3 className="coursesv2-card-title">{course.title}</h3>
                <p className="coursesv2-card-desc">{course.description}</p>
                <div className="coursesv2-instructor">
                  <img src={course.instructorAvatar} alt={course.instructor} className="coursesv2-instructor-avatar" />
                  <span className="coursesv2-instructor-name">{course.instructor}</span>
                </div>
                {course.enrolled && (
                  <div className="course-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{course.progress}% Complete</span>
                  </div>
                )}
                <div className="course-footer">
                  {course.enrolled ? (
                    <button 
                      className="continue-btn"
                      onClick={() => setLocation(`/course/${course.id}/learn`)}
                    >
                      Continue Learning
                    </button>
                  ) : (
                    <button 
                      className="enroll-btn"
                      onClick={() => console.log('Enroll in course:', course.id)}
                    >
                      Enroll Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 