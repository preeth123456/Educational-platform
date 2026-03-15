import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { 
  FaUsers, FaChalkboardTeacher, FaBook, FaGraduationCap, FaChartLine,
  FaSignOutAlt, FaBell, FaCog, FaShieldAlt, FaArrowRight, FaPlus,
  FaCheckCircle, FaExclamationTriangle, FaEye, FaCalendarAlt,
  FaFileAlt, FaUserGraduate, FaUserTie, FaClipboardList, FaAward, FaStar,
  FaDollarSign, FaEnvelope, FaDatabase, FaChartBar, FaPlayCircle, FaTrophy,
  FaRocket, FaLightbulb, FaBullseye, FaFire, FaMedal, FaBookOpen, FaClock, FaTimes, FaCheck, FaSearch
} from 'react-icons/fa';
import SessionManager from '../utils/sessionManager';
import AdminLayoutCourse from '../components/AdminLayoutCourse';
// import AdminDebug from '../components/AdminDebug';
import '../Dashboard.css';
import './NormalAdminCourseDashboard.css';

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
  thumbnail_url?: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface EmailHistory {
  id: number;
  teacher_name: string;
  email: string;
  course_title: string;
  status: string;
  sent_date: string;
}

const NormalAdminCourseDashboard: React.FC = () => {
  const [, navigate] = useLocation();
  const [adminData, setAdminData] = useState({ name: '', email: '' });
  const [dashboardStats, setDashboardStats] = useState({
    total_students: 0,
    total_courses: 0,
    total_enrollments: 0,
    recent_enrollments: 0
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseStats, setCourseStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [emailHistory, setEmailHistory] = useState<EmailHistory[]>([]);
  const [showEmailHistory, setShowEmailHistory] = useState(false);
  const [showCourseApprovals, setShowCourseApprovals] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [modalFilters, setModalFilters] = useState({ search: '', category: 'All', status: 'all' });
  const [modalTitle, setModalTitle] = useState('');


  useEffect(() => {
    const session = SessionManager.getSession();
    if (session) {
      setAdminData({ name: session.name, email: session.email || '' });
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const coursesResponse = await fetch('http://localhost:8001/api/courses/get_courses/');
      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        console.log('Dashboard courses data:', coursesData);
        const coursesArray = coursesData.data || [];
        
        // Process courses and set default status to pending if not set
        const processedCourses = coursesArray.map((course: any) => ({
          ...course,
          status: course.status || 'pending'
        }));
        
        setCourses(processedCourses);
        
        const stats = {
          pending: processedCourses.filter((c: Course) => c.status === 'pending').length,
          approved: processedCourses.filter((c: Course) => c.status === 'approved').length,
          rejected: processedCourses.filter((c: Course) => c.status === 'rejected').length
        };
        
        console.log('Course stats:', stats);
        console.log('Pending courses:', processedCourses.filter((c: Course) => c.status === 'pending'));
        setCourseStats(stats);
        
        setDashboardStats({
          total_students: 2847,
          total_courses: processedCourses.length,
          total_enrollments: 1245,
          recent_enrollments: 156
        });
        
        // Fetch email history data
        const emailHistoryData = processedCourses
          .filter((course: Course) => course.status === 'approved' || course.status === 'rejected')
          .map((course: Course) => ({
            id: course.id,
            teacher_name: course.instructor_name || 'Unknown',
            email: course.instructor_email || 'No email',
            course_title: course.title,
            status: course.status,
            sent_date: new Date().toISOString().split('T')[0]
          }));
        setEmailHistory(emailHistoryData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatClick = (status: string, title: string) => {
    console.log('Stat clicked:', { status, title });
    setModalFilters({ search: '', category: 'All', status });
    setModalTitle(title);
    setShowCoursesModal(true);
  };

  const stats = [
    { 
      title: 'Pending Courses', 
      value: courseStats.pending.toString(), 
      change: 'Need Review', 
      icon: FaClock, 
      color: 'warning',
      trend: 'up',
      status: 'pending'
    },
    { 
      title: 'Approved Courses', 
      value: courseStats.approved.toString(), 
      change: 'Active', 
      icon: FaCheckCircle, 
      color: 'success',
      trend: 'up',
      status: 'approved'
    },
    { 
      title: 'Rejected Courses', 
      value: courseStats.rejected.toString(), 
      change: 'Declined', 
      icon: FaTimes, 
      color: 'danger',
      trend: 'down',
      status: 'rejected'
    },
    { 
      title: 'Total Courses', 
      value: dashboardStats.total_courses.toString(), 
      change: 'All Courses', 
      icon: FaBook, 
      color: 'info',
      trend: 'up',
      status: 'all'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'Course approved', subject: 'Advanced Mathematics', course: 'Mathematics', time: '2 minutes ago', type: 'completed', icon: FaCheckCircle },
    { id: 2, action: 'Course submitted for review', subject: 'Physics Fundamentals', course: 'Physics', time: '15 minutes ago', type: 'submitted', icon: FaClock },
    { id: 3, action: 'Course rejected', subject: 'Basic Chemistry', course: 'Chemistry', time: '1 hour ago', type: 'started', icon: FaTimes },
    { id: 4, action: 'Course approved', subject: 'Web Development', course: 'Computer Science', time: '2 hours ago', type: 'completed', icon: FaCheckCircle },
    { id: 5, action: 'Email notification sent', subject: 'Course Approval Notice', course: '', time: '3 hours ago', type: 'achievement', icon: FaEnvelope }
  ];

  const pendingApprovals = [
    { id: 1, type: 'Teacher Application', name: 'Dr. Thimmaiah', subject: 'Mathematics', status: 'pending' },
    { id: 2, type: 'Course Proposal', name: 'Advanced Physics', teacher: 'Prof. Jagadeesh', status: 'review' },
    { id: 3, type: 'Student Appeal', name: 'Grade Review Request', student: 'Mallikarjun', status: 'urgent' }
  ];

  const systemAlerts = [
    { id: 1, type: 'warning', message: 'Server storage at 85% capacity', time: '1 hour ago' },
    { id: 2, type: 'info', message: 'Scheduled maintenance tonight at 2 AM', time: '3 hours ago' },
    { id: 3, type: 'success', message: 'Database backup completed successfully', time: '6 hours ago' }
  ];

  const quickActions = [
    { title: 'Add Student', description: 'Register new student account', icon: FaUserGraduate, color: 'primary' },
    { title: 'Add Teacher', description: 'Create teacher profile', icon: FaChalkboardTeacher, color: 'success' },
    { title: 'New Course', description: 'Add course to catalog', icon: FaBook, color: 'info' },
    { title: 'Generate Report', description: 'Create system report', icon: FaFileAlt, color: 'warning' }
  ];

  const managementCards = [
    {
      title: 'Course Approvals',
      icon: FaCheckCircle,
      stats: [
        { number: courseStats.pending.toString(), label: 'Pending' },
        { number: courseStats.approved.toString(), label: 'Approved' },
        { number: courseStats.rejected.toString(), label: 'Rejected' }
      ],
      action: 'Review Courses',
      onClick: () => setShowCourseApprovals(true)
    },
    {
      title: 'Course Quality',
      icon: FaBook,
      stats: [
        { number: '4.8', label: 'Avg Rating' },
        { number: '92%', label: 'Approval Rate' },
        { number: '85%', label: 'Quality Score' }
      ],
      action: 'Quality Reports'
    },
    {
      title: 'Instructor Communication',
      icon: FaEnvelope,
      stats: [
        { number: emailHistory.length.toString(), label: 'Emails Sent' },
        { number: '98%', label: 'Delivery Rate' },
        { number: '24h', label: 'Avg Response' }
      ],
      action: 'Email History',
      onClick: () => setShowEmailHistory(true)
    },
    {
      title: 'Course Analytics',
      icon: FaChartLine,
      stats: [
        { number: '89', label: 'Total Courses' },
        { number: '23', label: 'Categories' },
        { number: '15', label: 'This Week' }
      ],
      action: 'View Analytics'
    }
  ];

  return (
    <AdminLayoutCourse>
      <div className="dashboard-main">
        <div className="dashboard-content">
          {/* Hero Welcome Section */}
          <div className="hero-welcome">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">Course Approval Dashboard 📚</h1>
                <p className="hero-subtitle one-line">Review and approve course submissions. Manage course quality and instructor communications.</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid" style={{ marginTop: '2rem' }}>
            {isLoading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                Loading dashboard data...
              </div>
            ) : (
              stats.map((stat, index) => (
                <div 
                  key={index} 
                  className={`stat-card ${stat.color}`}
                  onClick={() => handleStatClick(stat.status, stat.title)}
                  style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div className="stat-icon">
                    <stat.icon />
                  </div>
                  <div className="stat-content">
                    <h3>{stat.value}</h3>
                    <p>{stat.title}</p>
                  </div>
                </div>
              ))
            )}
          </div>



          {/* Main Dashboard Grid */}
          <div className="learning-goals-row">
            {/* Pending Approvals */}
            <div className="dashboard-section continue-learning">
              <div className="section-header">
                <div className="section-title">
                  <FaClock className="section-icon" />
                  <h2>Pending Course Approvals</h2>
                </div>
                <button className="view-all-btn" onClick={() => navigate('/admin/courses')}>
                  View All Courses
                  <FaArrowRight />
                </button>
              </div>
              <div className="approvals-list">
                {courses.filter(course => course.status === 'pending').slice(0, 2).map(course => (
                  <div key={course.id} className="approval-item" style={{ cursor: 'default' }}>
                    <div className="approval-content">
                      <div className="approval-type">Course Submission</div>
                      <div className="approval-name">{course.title}</div>
                      <div className="approval-subject">{course.category}</div>
                      <div className="approval-teacher">by {course.instructor_name}</div>
                      <div className="approval-details">
                        <span className="course-level">{course.level}</span>
                        <span className="course-duration">{course.duration_hours}h</span>
                        <span className="course-price">${course.price}</span>
                      </div>
                    </div>
                    <div className="approval-actions">
                      <button className="approve-btn" onClick={() => navigate('/admin/courses')}>
                        <FaCheck /> Review
                      </button>
                    </div>
                  </div>
                ))}
                {courses.filter(course => course.status === 'pending').length === 0 && (
                  <div className="no-pending">
                    <FaCheckCircle style={{ fontSize: '2rem', color: '#10b981', marginBottom: '1rem' }} />
                    <p>No pending course approvals</p>
                  </div>
                )}
              </div>
            </div>

            {/* System Alerts */}
            <div className="goals-section" style={{ minHeight: '600px' }}>
              <div className="section-header">
                <div className="section-title">
                  <FaBook className="section-icon" />
                  <h2>Recent Course Actions</h2>
                </div>
              </div>
              <div className="alerts-list">
                {courses.slice(0, 6).map(course => (
                  <div key={course.id} className={`alert-item ${course.status === 'approved' ? 'success' : course.status === 'rejected' ? 'warning' : 'info'}`}>
                    <div className="alert-icon">
                      {course.status === 'approved' && <FaCheckCircle />}
                      {course.status === 'rejected' && <FaTimes />}
                      {course.status === 'pending' && <FaClock />}
                    </div>
                    <div className="alert-content">
                      <div className="alert-message">{course.title}</div>
                      <div className="alert-time">Status: {course.status} • by {course.instructor_name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Dashboard - Admin Analytics */}
          <div className="progress-dashboard">
            <div className="section-header">
              <div className="section-title">
                <FaChartLine className="section-icon" />
                <h2>Platform Analytics Overview</h2>
              </div>
              <button className="view-all-btn">
                Detailed Analytics
                <FaArrowRight />
              </button>
            </div>
            
            {/* Progress Metrics Row */}
            <div className="progress-metrics-row">
              <div className="progress-metric">
                <div className="metric-circle">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle" strokeDasharray="92, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="20.35" className="percentage">92%</text>
                  </svg>
                </div>
                <div className="metric-info">
                  <h4>Platform Uptime</h4>
                  <p className="metric-trend positive">+2% this month</p>
                </div>
              </div>
              
              <div className="progress-metric">
                <div className="metric-circle orange">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle orange" strokeDasharray="78, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="20.35" className="percentage">78%</text>
                  </svg>
                </div>
                <div className="metric-info">
                  <h4>User Engagement</h4>
                  <p className="metric-trend positive">+5% this week</p>
                </div>
              </div>
              
              <div className="streak-card">
                <div className="streak-flame">🚀</div>
                <div className="streak-info">
                  <h4>15 Days Growth</h4>
                  <p>Consistent growth!</p>
                </div>
              </div>
            </div>
            
            {/* Overall Performance Summary */}
            <div className="performance-summary">
              <div className="summary-card-large">
                <div className="summary-header">
                  <div className="summary-icon-large">
                    <FaTrophy />
                  </div>
                  <div className="summary-content">
                    <h3>Platform Performance Excellent</h3>
                    <p>Your platform is performing exceptionally well across all metrics!</p>
                    <div className="performance-stats">
                      <div className="stat-item">
                        <span className="stat-value">2.8K</span>
                        <span className="stat-label">Active Users</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">89</span>
                        <span className="stat-label">Courses Live</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">$24K</span>
                        <span className="stat-label">Monthly Revenue</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="summary-cta">
                  View Complete Dashboard
                  <FaArrowRight />
                </button>
              </div>
              
              <div className="insights-grid">
                <div className="insight-item">
                  <div className="insight-icon">📈</div>
                  <h4>Revenue Growth</h4>
                  <p>Monthly revenue increased by 15% with 1,892 successful transactions</p>
                </div>
                
                <div className="insight-item">
                  <div className="insight-icon">👥</div>
                  <h4>User Acquisition</h4>
                  <p>156 new students registered this week, 12% increase from last week</p>
                </div>
                
                <div className="insight-item">
                  <div className="insight-icon">🎯</div>
                  <h4>Course Completion</h4>
                  <p>85% average completion rate across all courses, exceeding target</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Grid - Recent Activity */}
          <div className="bottom-grid">
            <div className="activity-section" style={{ minHeight: 'auto' }}>
              <div className="section-header">
                <div className="section-title">
                  <FaChartBar className="section-icon" />
                  <h2>Recent Course Activity</h2>
                </div>
              </div>
              
              <div className="activity-list">
                {recentActivities.slice(0, 3).map(activity => (
                  <div key={activity.id} className={`activity-item ${activity.type}`}>
                    <div className="activity-icon">
                      {activity.type === 'completed' && <FaCheckCircle />}
                      {activity.type === 'submitted' && <FaClipboardList />}
                      {activity.type === 'started' && <FaPlayCircle />}
                      {activity.type === 'achievement' && <FaMedal />}
                      {activity.type === 'enrolled' && <FaBook />}
                    </div>
                    <div className="activity-content">
                      <div className="activity-text">
                        <span className="activity-action">{activity.action}:</span> {activity.subject}
                      </div>
                      {activity.course && <div className="activity-course">{activity.course}</div>}
                      <div className="activity-time">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reminders-section">
              <div className="dashboard-section" style={{ minHeight: 'auto' }}>
                <div className="section-header" style={{ marginBottom: '0.5rem' }}>
                  <div className="section-title">
                    <FaBell className="section-icon" />
                    <h2>Course Notifications</h2>
                  </div>
                </div>
                <div className="admin-notifications">
                  <div className="notification-item urgent">
                    <FaClock className="notification-icon" />
                    <div className="notification-content">
                      <h4>{courseStats.pending} Courses Pending Review</h4>
                      <p>Review and approve course submissions</p>
                      <span className="notification-time">Action Required</span>
                    </div>
                  </div>
                  <div className="notification-item normal">
                    <FaEnvelope className="notification-icon" />
                    <div className="notification-content">
                      <h4>Email Notifications Sent</h4>
                      <p>Course approval emails delivered to instructors</p>
                      <span className="notification-time">2 hours ago</span>
                    </div>
                  </div>
                  <div className="notification-item normal">
                    <FaCheckCircle className="notification-icon" />
                    <div className="notification-content">
                      <h4>Course Quality Report</h4>
                      <p>Weekly course approval analytics available</p>
                      <span className="notification-time">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Management Sections */}
          <div className="recommended-grid">
            {managementCards.map((card, index) => (
              <div key={index} className="management-card">
                <div className="management-header">
                  <card.icon className="management-icon" />
                  <h3>{card.title}</h3>
                </div>
                <div className="management-stats">
                  {card.stats.map((stat, idx) => (
                    <div key={idx} className="management-stat" 
                         style={{ cursor: card.title === 'Course Approvals' ? 'pointer' : 'default' }}
                         onClick={() => {
                           if (card.title === 'Course Approvals') {
                             setSelectedStatus(stat.label.toLowerCase());
                             setShowCourseApprovals(true);
                           }
                         }}>
                      <span className="stat-number">{stat.number}</span>
                      <span className="stat-label">{stat.label}</span>
                    </div>
                  ))}
                </div>
                <button className="management-btn" onClick={card.onClick}>{card.action}</button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Email History Modal */}
        {showEmailHistory && (
          <div className="modal-overlay" onClick={() => setShowEmailHistory(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
              <div className="modal-header">
                <h2>Email History</h2>
                <button className="modal-close" onClick={() => setShowEmailHistory(false)}>
                  <FaTimes />
                </button>
              </div>
              
              <div className="modal-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {emailHistory.length === 0 ? (
                  <p>No email history available</p>
                ) : (
                  <div className="email-history-list">
                    {emailHistory.map((email, index) => (
                      <div key={index} className="email-history-item" style={{
                        padding: '1rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        marginBottom: '0.5rem',
                        backgroundColor: '#f8fafc'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1a365d' }}>{email.teacher_name}</h4>
                            <p style={{ margin: '0 0 0.25rem 0', color: '#4a5568', fontSize: '0.9rem' }}>
                              <strong>Email:</strong> {email.email}
                            </p>
                            <p style={{ margin: '0 0 0.25rem 0', color: '#4a5568', fontSize: '0.9rem' }}>
                              <strong>Course:</strong> {email.course_title}
                            </p>
                            <p style={{ margin: '0', color: '#4a5568', fontSize: '0.9rem' }}>
                              <strong>Date:</strong> {email.sent_date}
                            </p>
                          </div>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backgroundColor: email.status === 'approved' ? '#10b981' : '#ef4444',
                            color: 'white'
                          }}>
                            {email.status === 'approved' ? 'Approved' : 'Rejected'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Course Approvals Modal */}
        {showCourseApprovals && (
          <div className="modal-overlay" onClick={() => { setShowCourseApprovals(false); setSelectedStatus(''); }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
              <div className="modal-header">
                <h2>{selectedStatus ? `${selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} Courses` : 'Course Approvals'}</h2>
                <button className="modal-close" onClick={() => { setShowCourseApprovals(false); setSelectedStatus(''); }}>
                  <FaTimes />
                </button>
              </div>
              
              <div className="modal-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {(() => {
                  const filteredCourses = selectedStatus ? courses.filter(course => course.status === selectedStatus) : courses;
                  return filteredCourses.length === 0 ? (
                    <p>No {selectedStatus || ''} courses available</p>
                  ) : (
                    <div className="course-approvals-list">
                      {filteredCourses.map((course, index) => (
                        <div key={index} className="course-approval-item" style={{
                          padding: '1rem',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          marginBottom: '0.5rem',
                          backgroundColor: '#f8fafc',
                          cursor: 'default'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h4 style={{ margin: '0 0 0.5rem 0', color: '#1a365d' }}>{course.title}</h4>
                              <p style={{ margin: '0 0 0.25rem 0', color: '#4a5568', fontSize: '0.9rem' }}>
                                <strong>Course ID:</strong> {course.course_id}
                              </p>
                              <p style={{ margin: '0 0 0.25rem 0', color: '#4a5568', fontSize: '0.9rem' }}>
                                <strong>Category:</strong> {course.category}
                              </p>
                              <p style={{ margin: '0', color: '#4a5568', fontSize: '0.9rem' }}>
                                <strong>Description:</strong> {course.description.length > 100 ? `${course.description.substring(0, 100)}...` : course.description}
                              </p>
                            </div>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              backgroundColor: course.status === 'approved' ? '#10b981' : course.status === 'rejected' ? '#ef4444' : '#f59e0b',
                              color: 'white'
                            }}>
                              {course.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()
                }
              </div>
            </div>
          </div>
        )}
        
        {/* Courses Modal */}
        {showCoursesModal && (
          <div className="modal-overlay" onClick={() => setShowCoursesModal(false)}>
            <div className="courses-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{modalTitle}</h2>
                <button className="modal-close" onClick={() => setShowCoursesModal(false)}>
                  <FaTimes />
                </button>
              </div>
              
              {/* Search and Filters */}
              <div className="modal-filters">
                <div className="search-wrapper">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by instructor name, category, or course title..."
                    value={modalFilters.search}
                    onChange={(e) => setModalFilters({ ...modalFilters, search: e.target.value })}
                    className="search-input"
                  />
                </div>
                <select
                  value={modalFilters.category}
                  onChange={(e) => setModalFilters({ ...modalFilters, category: e.target.value })}
                  className="filter-select"
                >
                  <option value="All">All Categories</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                </select>
              </div>
              
              {/* Courses List */}
              <div className="modal-courses-list">
                {(() => {
                  const filteredModalCourses = courses.filter((course: Course) => {
                    const matchesSearch = !modalFilters.search || 
                      course.title.toLowerCase().includes(modalFilters.search.toLowerCase()) ||
                      (course.instructor_name || '').toLowerCase().includes(modalFilters.search.toLowerCase()) ||
                      course.category.toLowerCase().includes(modalFilters.search.toLowerCase());
                    const matchesCategory = modalFilters.category === 'All' || course.category === modalFilters.category;
                    const matchesStatus = modalFilters.status === 'all' || course.status === modalFilters.status;
                    return matchesSearch && matchesCategory && matchesStatus;
                  });
                  
                  console.log('Modal Filters:', modalFilters);
                  console.log('Filtered Modal Courses:', filteredModalCourses);
                  console.log('All Courses:', courses);
                  
                  return filteredModalCourses.length === 0 ? (
                    <div className="no-courses">
                      <FaBook style={{ fontSize: '3rem', color: '#d1d5db', marginBottom: '1rem' }} />
                      <p>No courses found matching your criteria</p>
                    </div>
                  ) : (
                    filteredModalCourses.map((course, index) => (
                      <div 
                        key={index} 
                        className="modal-course-item"
                      >
                        <div className="course-info">
                          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#1f2937' }}>
                            {course.title}
                          </h4>
                          <div style={{ fontSize: '0.9rem', color: '#4a5568', lineHeight: '1.5' }}>
                            <div><strong>Course ID:</strong> {course.course_id || 'N/A'}</div>
                            <div><strong>Category:</strong> {course.category || 'N/A'}</div>
                            <div><strong>Instructor:</strong> {course.instructor_name || 'Unknown'}</div>
                          </div>
                        </div>
                        <div className="course-status" style={{ alignSelf: 'flex-start' }}>
                          <span className={`status-badge status-${course.status}`}>
                            {course.status}
                          </span>
                        </div>
                      </div>
                    ))
                  );
                })()
                }
              </div>
              
              <div className="modal-footer">
                <button 
                  className="view-all-btn"
                  onClick={() => {
                    setShowCoursesModal(false);
                    navigate('/admin/courses');
                  }}
                >
                  View All in Admin Courses
                </button>
              </div>
            </div>
          </div>
        )}
        

      </div>
    </AdminLayoutCourse>
  );
};

export default NormalAdminCourseDashboard;