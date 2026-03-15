import React, { useState, useEffect } from 'react';
import { 
  FaGraduationCap, FaSearch, FaCheck, FaTimes, FaUser, FaClock, 
  FaVideo, FaEye, FaBook, FaDollarSign, FaTag, FaPlay, FaFilter
} from 'react-icons/fa';
import AdminLayoutCourse from '../components/AdminLayoutCourse';
import './AdminCourses.css';

interface Course {
  id: number;
  course_id: string;
  title: string;
  description: string;
  instructor_id: number;
  instructor_name?: string;
  instructor_email?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_hours: number;
  price: number;
  thumbnail_url: string;
  video_id?: string;
  status: 'pending' | 'approved' | 'rejected';
}

const NormalAdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: 'All', status: 'all' });
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [message, setMessage] = useState('');

  // Fetch courses with teacher data
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/courses/get_courses/', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        let coursesData = [];
        if (data.data) {
          coursesData = data.data;
        } else if (Array.isArray(data)) {
          coursesData = data;
        } else if (data.courses) {
          coursesData = data.courses;
        }
        
        const processedCourses = coursesData.map((course: any) => ({
          ...course,
          status: course.status || 'pending',
          instructor_name: course.instructor_name || 'Unknown Instructor',
          instructor_email: course.instructor_email || 'No email provided',
          video_id: 'wrpmqMz-m4w',
          thumbnail_url: course.thumbnail_url || 'https://via.placeholder.com/400x200'
        }));
        
        setCourses(processedCourses);
      } else {
        throw new Error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = !filters.search || 
      course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      course.course_id.toLowerCase().includes(filters.search.toLowerCase()) ||
      (course.instructor_name || '').toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === 'All' || course.category === filters.category;
    const matchesStatus = filters.status === 'all' || course.status === filters.status;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    pending: courses.filter(c => c.status === 'pending').length,
    approved: courses.filter(c => c.status === 'approved').length,
    rejected: courses.filter(c => c.status === 'rejected').length
  };

  const handleApproveClick = (courseId: number) => {
    setActionType('approve');
    setMessage('Congratulations! Your course has been approved and is now live on our platform.');
    setShowMessageBox(true);
  };

  const handleRejectClick = (courseId: number) => {
    setActionType('reject');
    setMessage('Your course submission has been rejected. Please review our guidelines and resubmit.');
    setShowMessageBox(true);
  };

  const handleSendMessage = async () => {
    if (!selectedCourse || !actionType) return;
    
    try {
      const endpoint = actionType === 'approve' ? 'admin/approve/' : 'admin/reject/';
      const requestData = { 
        course_id: selectedCourse.id,
        message: message
      };
      
      const response = await fetch(`http://localhost:8001/api/courses/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        setCourses(courses.map(course => 
          course.id === selectedCourse.id ? { ...course, status: actionType === 'approve' ? 'approved' : 'rejected' } : course
        ));
        alert(`Course ${actionType}d successfully and email sent!`);
      } else {
        alert(`Failed to ${actionType} course: ` + (data.message || 'Unknown error'));
      }
    } catch (error) {
      alert(`Error ${actionType}ing course. Please try again.`);
    }
    
    setShowMessageBox(false);
    setIsModalOpen(false);
    setSelectedCourse(null);
    setMessage('');
    setActionType(null);
  };

  const openModal = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
    setShowMessageBox(false);
    setMessage('');
    setActionType(null);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <AdminLayoutCourse>
      <div className="admin-courses-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-left">
            <div className="icon-wrapper">
              <FaGraduationCap className="header-icon" />
            </div>
            <div>
              <h1 className="page-title">Course Management</h1>
              <p className="page-subtitle">Review and manage course submissions</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-pending">
            <FaClock className="stat-icon" />
            <div className="stat-content">
              <div className="stat-number">{stats.pending}</div>
              <div className="stat-label">Pending Review</div>
            </div>
          </div>
          <div className="stat-card stat-approved">
            <FaCheck className="stat-icon" />
            <div className="stat-content">
              <div className="stat-number">{stats.approved}</div>
              <div className="stat-label">Approved</div>
            </div>
          </div>
          <div className="stat-card stat-rejected">
            <FaTimes className="stat-icon" />
            <div className="stat-content">
              <div className="stat-number">{stats.rejected}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>
          <div className="stat-card stat-total">
            <FaBook className="stat-icon" />
            <div className="stat-content">
              <div className="stat-number">{courses.length}</div>
              <div className="stat-label">Total Courses</div>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="filters-bar">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search courses, instructors, or course ID..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="search-input"
            />
          </div>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="filter-select"
          >
            <option value="All">All Categories</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Courses Grid */}
        <div className="courses-grid">
          {loading ? (
            <div className="empty-state">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
              <h3 style={{ color: '#6b7280' }}>Loading courses...</h3>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="empty-state">
              <FaBook className="empty-icon" />
              <h3 className="empty-title">No courses found</h3>
              <p className="empty-text">Try adjusting your filters</p>
            </div>
          ) : (
            filteredCourses.map(course => (
              <div key={course.id} className="course-card">
                <div className="card-header">
                  <span className="course-id">{course.course_id}</span>
                  <span className={`status-badge status-${course.status}`}>
                    {course.status}
                  </span>
                </div>
                
                <div className="card-media">
                  <img 
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="course-thumbnail"
                  />
                  <div className="play-overlay">
                    <FaPlay className="play-icon" />
                  </div>
                </div>
                
                <div className="card-content">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-description">
                    {course.description.length > 100 
                      ? `${course.description.substring(0, 100)}...` 
                      : course.description
                    }
                  </p>
                  
                  <div className="course-meta">
                    <div className="meta-item">
                      <FaUser className="meta-icon" />
                      <span>{course.instructor_name}</span>
                    </div>
                    <div className="meta-item">
                      <FaClock className="meta-icon" />
                      <span>{course.duration_hours}h</span>
                    </div>
                    <div className="meta-item">
                      <FaDollarSign className="meta-icon" />
                      <span>${course.price}</span>
                    </div>
                  </div>
                  
                  <div className="course-tags">
                    <span className="category-tag">{course.category}</span>
                    <span 
                      className="level-tag" 
                      style={{ backgroundColor: getLevelColor(course.level) }}
                    >
                      {course.level}
                    </span>
                  </div>
                </div>
                
                <div className="card-actions">
                  <button 
                    className="btn-view"
                    onClick={() => openModal(course)}
                  >
                    <FaEye /> View Details
                  </button>
                  {course.status === 'pending' && (
                    <>
                      <button 
                        className="btn-approve"
                        onClick={() => {
                          setSelectedCourse(course);
                          handleApproveClick(course.id);
                        }}
                      >
                        <FaCheck /> Approve
                      </button>
                      <button 
                        className="btn-reject"
                        onClick={() => {
                          setSelectedCourse(course);
                          handleRejectClick(course.id);
                        }}
                      >
                        <FaTimes /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Course Details Modal */}
        {isModalOpen && selectedCourse && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedCourse.title}</h2>
                <button className="modal-close" onClick={closeModal}>
                  <FaTimes />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="video-section">
                  <div className="video-wrapper">
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedCourse.video_id}`}
                      title={selectedCourse.title}
                      frameBorder="0"
                      allowFullScreen
                      className="course-video"
                    ></iframe>
                  </div>
                </div>
                
                <div className="details-section">
                  <div className="detail-row">
                    <strong>Course ID:</strong> {selectedCourse.course_id}
                  </div>
                  <div className="detail-row">
                    <strong>Instructor:</strong> {selectedCourse.instructor_name}
                  </div>
                  <div className="detail-row">
                    <strong>Email:</strong> {selectedCourse.instructor_email}
                  </div>
                  <div className="detail-row">
                    <strong>Category:</strong> {selectedCourse.category}
                  </div>
                  <div className="detail-row">
                    <strong>Level:</strong> 
                    <span 
                      className="level-badge" 
                      style={{ backgroundColor: getLevelColor(selectedCourse.level) }}
                    >
                      {selectedCourse.level}
                    </span>
                  </div>
                  <div className="detail-row">
                    <strong>Duration:</strong> {selectedCourse.duration_hours} hours
                  </div>
                  <div className="detail-row">
                    <strong>Price:</strong> ${selectedCourse.price}
                  </div>
                  <div className="detail-row">
                    <strong>Description:</strong>
                    <p className="description-text">{selectedCourse.description}</p>
                  </div>
                </div>
              </div>
              
              {selectedCourse.status === 'pending' && (
                <div className="modal-actions">
                  <button 
                    className="btn-approve-modal"
                    onClick={() => handleApproveClick(selectedCourse.id)}
                  >
                    <FaCheck /> Approve Course
                  </button>
                  <button 
                    className="btn-reject-modal"
                    onClick={() => handleRejectClick(selectedCourse.id)}
                  >
                    <FaTimes /> Reject Course
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Message Box Modal */}
        {showMessageBox && selectedCourse && (
          <div className="modal-overlay" onClick={() => setShowMessageBox(false)}>
            <div className="message-modal" onClick={(e) => e.stopPropagation()}>
              <div className="message-header">
                <h3>{actionType === 'approve' ? 'Approve Course' : 'Reject Course'}</h3>
                <button className="modal-close" onClick={() => setShowMessageBox(false)}>
                  <FaTimes />
                </button>
              </div>
              <div className="message-body">
                <p><strong>Course:</strong> {selectedCourse.title}</p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Enter ${actionType} message...`}
                  className="message-textarea"
                />
              </div>
              <div className="message-actions">
                <button 
                  onClick={() => setShowMessageBox(false)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendMessage}
                  className={`btn-send ${actionType}`}
                >
                  {actionType === 'approve' ? <FaCheck /> : <FaTimes />}
                  Send {actionType === 'approve' ? 'Approval' : 'Rejection'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutCourse>
  );
};

export default NormalAdminCourses;