import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { 
  FaUsers, FaChalkboardTeacher, FaBook, FaGraduationCap, FaChartLine,
  FaSignOutAlt, FaBell, FaCog, FaShieldAlt, FaArrowRight, FaPlus,
  FaCheckCircle, FaExclamationTriangle, FaEye, FaCalendarAlt,
  FaFileAlt, FaUserGraduate, FaUserTie, FaClipboardList, FaAward, FaStar,
  FaDollarSign, FaEnvelope, FaDatabase, FaChartBar, FaPlayCircle, FaTrophy,
  FaRocket, FaLightbulb, FaCrosshairs, FaFire, FaMedal, FaBookOpen, FaFlag
} from 'react-icons/fa';
import SessionManager from '../utils/sessionManager';
import AdminLayout from '../components/AdminLayout';
import '../Dashboard.css';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const [, navigate] = useLocation();
  const [adminData, setAdminData] = useState({ name: '', email: '' });
  const [dashboardStats, setDashboardStats] = useState({
    total_students: 0,
    active_teachers: 0,
    total_courses: 0,
    monthly_revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [auditStats, setAuditStats] = useState({
    total_events: 0,
    login_events: 0,
    admin_actions: 0,
    integrity_status: 'Valid'
  });

  useEffect(() => {
    const session = SessionManager.getSession();
    if (!session) {
      navigate('/admin-login');
      return;
    }
    setAdminData({ name: session.name, email: session.email || '' });
    fetchDashboardStats();
    fetchAuditStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/admin/dashboard-stats/');
      const result = await response.json();
      
      if (response.ok) {
        setDashboardStats(result.stats);
      } else {
        console.error('Failed to fetch dashboard stats:', result.error);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditStats = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/audit/dashboard/stats/');
      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        const data = result.data;
        console.log('Audit API Response:', data); // Debug log
        
        const totalEvents = Object.values(data.activity_by_type || {}).reduce((a: number, b: number) => a + b, 0);
        const loginEvents = data.top_actions?.find((action: any) => action.action === 'login')?.count || 0;
        
        // Get admin actions from timeline API
        const timelineResponse = await fetch('http://localhost:8001/api/audit/forensic/timeline/?limit=100');
        const timelineResult = await timelineResponse.json();
        let adminActionsCount = 0;
        
        if (timelineResult.status === 'success') {
          adminActionsCount = timelineResult.data.timeline.filter(
            (event: any) => event.source === 'admin_action'
          ).length;
        }
        
        setAuditStats({
          total_events: totalEvents,
          login_events: loginEvents,
          admin_actions: adminActionsCount,
          integrity_status: 'Valid'
        });
      }
    } catch (error) {
      console.error('Error fetching audit stats:', error);
    }
  };

  const stats = [
    { 
      title: 'Total Students', 
      value: '2,847', 
      change: '+12%', 
      icon: FaUsers, 
      color: 'primary',
      trend: 'up'
    },
    { 
      title: 'Active Teachers', 
      value: '156', 
      change: '+5%', 
      icon: FaChalkboardTeacher, 
      color: 'success',
      trend: 'up'
    },
    { 
      title: 'Total Courses', 
      value: '89', 
      change: '+8%', 
      icon: FaBook, 
      color: 'info',
      trend: 'up'
    },
    { 
      title: 'Monthly Revenue', 
      value: '$24,580', 
      change: '+15%', 
      icon: FaDollarSign, 
      color: 'warning',
      trend: 'up'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'New student registered', subject: 'Kallesh', course: '', time: '2 minutes ago', type: 'enrolled', icon: FaUserGraduate },
    { id: 2, action: 'Course updated', subject: 'Advanced Physics', course: 'Physics', time: '15 minutes ago', type: 'completed', icon: FaBook },
    { id: 3, action: 'Assignment submitted', subject: 'Calculus Quiz', course: 'Mathematics', time: '1 hour ago', type: 'submitted', icon: FaClipboardList },
    { id: 4, action: 'New teacher approved', subject: 'Dr. Narasimha', course: '', time: '2 hours ago', type: 'achievement', icon: FaUserTie },
    { id: 5, action: 'System backup completed', subject: 'Database Backup', course: '', time: '3 hours ago', type: 'started', icon: FaCog }
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
      title: 'User Management',
      icon: FaUsers,
      stats: [
        { number: loading ? '...' : dashboardStats.total_students.toLocaleString(), label: 'Students' },
        { number: loading ? '...' : dashboardStats.active_teachers.toString(), label: 'Teachers' },
        { number: '12', label: 'Admins' }
      ],
      action: 'Manage Users'
    },
    {
      title: 'Course Management',
      icon: FaBook,
      stats: [
        { number: loading ? '...' : dashboardStats.total_courses.toString(), label: 'Active Courses' },
        { number: '23', label: 'Categories' },
        { number: '1,245', label: 'Enrollments' }
      ],
      action: 'Manage Courses'
    },
    {
      title: 'Financial Management',
      icon: FaDollarSign,
      stats: [
        { number: loading ? '...' : `$${dashboardStats.monthly_revenue.toLocaleString()}`, label: 'Monthly Revenue' },
        { number: '1,892', label: 'Transactions' },
        { number: '94%', label: 'Payment Success' }
      ],
      action: 'View Financial Reports'
    },
    {
      title: 'Analytics & Reports',
      icon: FaChartLine,
      stats: [
        { number: '85%', label: 'Completion Rate' },
        { number: '4.8', label: 'Avg Rating' },
        { number: '92%', label: 'Satisfaction' }
      ],
      action: 'View Analytics'
    },
    {
      title: 'Session Management',
      icon: FaShieldAlt,
      stats: [
        { number: '247', label: 'Active Sessions' },
        { number: '1,892', label: 'Total Devices' },
        { number: '99.2%', label: 'Security Score' }
      ],
      action: 'Manage Sessions'
    }
  ];

  return (
    <AdminLayout>
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          {/* Hero Welcome Section */}
          <div className="hero-welcome">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">Welcome back, <span className="hero-name">{adminData.name}</span>! 👋</h1>
                <p className="hero-subtitle one-line">Here's what's happening with your platform today. Manage users, courses, and monitor system performance.</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid" style={{ marginTop: '2rem' }}>
            <div className="stat-card primary">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #a855f7, #9333ea)' }}>
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>{loading ? '...' : dashboardStats.total_students.toLocaleString()}</h3>
                <p>Total Students</p>
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '0.375rem', overflow: 'hidden' }}>
                    <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #a855f7, #9333ea)', borderRadius: '0.375rem', transition: 'width 0.25s ease-in-out' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                <FaChalkboardTeacher />
              </div>
              <div className="stat-content">
                <h3>{loading ? '...' : dashboardStats.active_teachers}</h3>
                <p>Active Teachers</p>
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '0.375rem', overflow: 'hidden' }}>
                    <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, #22c55e, #16a34a)', borderRadius: '0.375rem', transition: 'width 0.25s ease-in-out' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}>
                <FaBook />
              </div>
              <div className="stat-content">
                <h3>{loading ? '...' : dashboardStats.total_courses}</h3>
                <p>Total Courses</p>
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '0.375rem', overflow: 'hidden' }}>
                    <div style={{ width: '78%', height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #0284c7)', borderRadius: '0.375rem', transition: 'width 0.25s ease-in-out' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                <FaDollarSign />
              </div>
              <div className="stat-content">
                <h3>{loading ? '...' : `$${dashboardStats.monthly_revenue.toLocaleString()}`}</h3>
                <p>Monthly Revenue</p>
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '0.375rem', overflow: 'hidden' }}>
                    <div style={{ width: '95%', height: '100%', background: 'linear-gradient(90deg, #f59e0b, #d97706)', borderRadius: '0.375rem', transition: 'width 0.25s ease-in-out' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Flags Section */}
          <div className="dashboard-section" style={{ marginTop: '2rem' }}>
            <div className="section-header">
              <div className="section-title">
                <FaFlag className="section-icon" />
                <h2>Feature Flags & Experiments</h2>
              </div>
              <button 
                onClick={() => navigate('/admin/feature-flags')}
                className="view-all-btn"
              >
                Manage Flags
                <FaArrowRight />
              </button>
            </div>
            <div style={{ padding: '1rem' }}>
              <p style={{ color: 'var(--gray-600)', margin: 0, fontSize: '0.9rem' }}>Control feature rollouts and experiments. Create flags, target specific users, and safely test new features before full deployment.</p>
            </div>
          </div>

          {/* Usage Tracking Section */}
          <div className="dashboard-section" style={{ marginTop: '2rem' }}>
            <div className="section-header">
              <div className="section-title">
                <FaChartLine className="section-icon" />
                <h2>Usage Tracking & Metering</h2>
              </div>
              <button 
                onClick={() => navigate('/admin/usage')}
                className="view-all-btn"
              >
                View Details
                <FaArrowRight />
              </button>
            </div>
            <div style={{ padding: '1rem' }}>
              <p style={{ color: 'var(--gray-600)', margin: 0, fontSize: '0.9rem' }}>Monitor platform usage and billing metrics. Track student activity, video watch time, assignments, and calculate usage costs.</p>
            </div>
          </div>



          {/* Main Dashboard Grid */}
          <div className="learning-goals-row">
            {/* Pending Approvals */}
            <div className="dashboard-section continue-learning">
              <div className="section-header">
                <div className="section-title">
                  <FaCheckCircle className="section-icon" />
                  <h2>Pending Approvals</h2>
                </div>
                <button className="view-all-btn">
                  View All
                  <FaArrowRight />
                </button>
              </div>
              <div className="approvals-list">
                {pendingApprovals.map(approval => (
                  <div key={approval.id} className="approval-item">
                    <div className="approval-content">
                      <div className="approval-type">{approval.type}</div>
                      <div className="approval-name">{approval.name}</div>
                      {approval.subject && <div className="approval-subject">{approval.subject}</div>}
                      {approval.teacher && <div className="approval-teacher">by {approval.teacher}</div>}
                      {approval.student && <div className="approval-student">by {approval.student}</div>}
                    </div>
                    <div className="approval-actions">
                      <button className="approve-btn">Approve</button>
                      <button className="reject-btn">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Alerts */}
            <div className="goals-section">
              <div className="section-header">
                <div className="section-title">
                  <FaExclamationTriangle className="section-icon" />
                  <h2>System Alerts</h2>
                </div>
              </div>
              <div className="alerts-list">
                {systemAlerts.map(alert => (
                  <div key={alert.id} className={`alert-item ${alert.type}`}>
                    <div className="alert-icon">
                      {alert.type === 'warning' && <FaExclamationTriangle />}
                      {alert.type === 'info' && <FaBell />}
                      {alert.type === 'success' && <FaCheckCircle />}
                    </div>
                    <div className="alert-content">
                      <div className="alert-message">{alert.message}</div>
                      <div className="alert-time">{alert.time}</div>
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
                        <span className="stat-value">{loading ? '...' : `${(dashboardStats.total_students / 1000).toFixed(1)}K`}</span>
                        <span className="stat-label">Active Users</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">{loading ? '...' : dashboardStats.total_courses}</span>
                        <span className="stat-label">Courses Live</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">{loading ? '...' : `$${(dashboardStats.monthly_revenue / 1000).toFixed(0)}K`}</span>
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
            <div className="activity-section">
              <div className="section-header">
                <div className="section-title">
                  <FaChartBar className="section-icon" />
                  <h2>Recent Platform Activity</h2>
                </div>
              </div>
              
              <div className="activity-list">
                {recentActivities.map(activity => (
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
              <div className="dashboard-section">
                <div className="section-header">
                  <div className="section-title">
                    <FaBell className="section-icon" />
                    <h2>Admin Notifications</h2>
                  </div>
                </div>
                <div className="admin-notifications">
                  <div className="notification-item urgent">
                    <FaExclamationTriangle className="notification-icon" />
                    <div className="notification-content">
                      <h4>Server Maintenance Required</h4>
                      <p>Schedule maintenance for optimal performance</p>
                      <span className="notification-time">Due: Tonight</span>
                    </div>
                  </div>
                  <div className="notification-item normal">
                    <FaUsers className="notification-icon" />
                    <div className="notification-content">
                      <h4>3 Teacher Applications</h4>
                      <p>Review and approve pending applications</p>
                      <span className="notification-time">2 days ago</span>
                    </div>
                  </div>
                  <div className="notification-item normal">
                    <FaChartLine className="notification-icon" />
                    <div className="notification-content">
                      <h4>Monthly Report Ready</h4>
                      <p>Platform analytics report is available</p>
                      <span className="notification-time">1 week ago</span>
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
                    <div key={idx} className="management-stat">
                      <span className="stat-number">{stat.number}</span>
                      <span className="stat-label">{stat.label}</span>
                    </div>
                  ))}
                </div>
                <button className="management-btn">{card.action}</button>
              </div>
            ))}
          </div>

          {/* Audit System Section */}
          <div className="dashboard-section audit-section" style={{ marginTop: '2rem' }}>
            <div className="section-header">
              <div className="section-title">
                <FaShieldAlt className="section-icon" style={{ color: '#3b82f6' }} />
                <h2 style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '700' }}>🔍 Security Audit & Activity Monitoring</h2>
              </div>
              <button 
                onClick={() => navigate('/admin/audit-viewer')}
                className="view-all-btn audit-btn"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                }}
              >
                View Audit Logs
                <FaArrowRight style={{ marginLeft: '8px' }} />
              </button>
            </div>
            <div className="audit-preview" style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div className="audit-stats-row" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '20px'
              }}>
                <div className="audit-stat-card" style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                  transition: 'transform 0.3s ease'
                }}>
                  <div className="audit-stat-icon" style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
                  <div className="audit-stat-content">
                    <h4 style={{ 
                      fontSize: '28px', 
                      fontWeight: '700', 
                      margin: '0 0 4px 0',
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>{loading ? '...' : auditStats.total_events}</h4>
                    <p style={{ 
                      fontSize: '12px', 
                      margin: 0, 
                      opacity: 0.9,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontWeight: '500'
                    }}>Total Events Logged</p>
                  </div>
                </div>
                <div className="audit-stat-card" style={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  boxShadow: '0 4px 15px rgba(240, 147, 251, 0.3)',
                  transition: 'transform 0.3s ease'
                }}>
                  <div className="audit-stat-icon" style={{ fontSize: '24px', marginBottom: '8px' }}>🔐</div>
                  <div className="audit-stat-content">
                    <h4 style={{ 
                      fontSize: '28px', 
                      fontWeight: '700', 
                      margin: '0 0 4px 0',
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>{loading ? '...' : auditStats.login_events}</h4>
                    <p style={{ 
                      fontSize: '12px', 
                      margin: 0, 
                      opacity: 0.9,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontWeight: '500'
                    }}>Login Events Today</p>
                  </div>
                </div>
                <div className="audit-stat-card" style={{
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)',
                  transition: 'transform 0.3s ease'
                }}>
                  <div className="audit-stat-icon" style={{ fontSize: '24px', marginBottom: '8px' }}>⚙️</div>
                  <div className="audit-stat-content">
                    <h4 style={{ 
                      fontSize: '28px', 
                      fontWeight: '700', 
                      margin: '0 0 4px 0',
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>{loading ? '...' : auditStats.admin_actions}</h4>
                    <p style={{ 
                      fontSize: '12px', 
                      margin: 0, 
                      opacity: 0.9,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontWeight: '500'
                    }}>Admin Actions</p>
                  </div>
                </div>
                <div className="audit-stat-card" style={{
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  boxShadow: '0 4px 15px rgba(67, 233, 123, 0.3)',
                  transition: 'transform 0.3s ease'
                }}>
                  <div className="audit-stat-icon" style={{ fontSize: '24px', marginBottom: '8px' }}>✅</div>
                  <div className="audit-stat-content">
                    <h4 style={{ 
                      fontSize: '28px', 
                      fontWeight: '700', 
                      margin: '0 0 4px 0',
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>{auditStats.integrity_status}</h4>
                    <p style={{ 
                      fontSize: '12px', 
                      margin: 0, 
                      opacity: 0.9,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontWeight: '500'
                    }}>Integrity Status</p>
                  </div>
                </div>
              </div>
              <div style={{ 
                padding: '20px', 
                background: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{
                    width: '4px',
                    height: '20px',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    borderRadius: '2px',
                    marginRight: '12px'
                  }}></div>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: '16px', 
                    fontWeight: '600',
                    color: '#1e293b'
                  }}>Comprehensive Security Monitoring</h3>
                </div>
                <p style={{ 
                  color: '#64748b', 
                  fontSize: '14px', 
                  lineHeight: '1.6',
                  margin: 0,
                  fontWeight: '500'
                }}>Monitor all platform activities including logins, data access, admin actions, and policy changes. Complete forensic audit trail for security investigations and compliance with tamper-proof integrity verification.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
