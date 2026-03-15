import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import UsageMetricsCard from '../components/UsageMetricsCard';
import UsageChart from '../components/UsageChart';
import { usageTrackingService, UsageEvent } from '../services/usageTrackingService';
import { FaChartLine, FaClock, FaFileAlt, FaTrophy, FaBook, FaArrowRight, FaCheckCircle, FaClipboardList } from 'react-icons/fa';
import StudentLayout from '../components/StudentLayout';
import SessionManager from '../utils/sessionManager';

export default function StudentUsagePage() {
  const [recentActivity, setRecentActivity] = useState<UsageEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentSession] = useState(SessionManager.getSession());

  const currentUserId = studentSession?.id || 1;

  useEffect(() => {
    loadRecentActivity();
  }, []);

  const loadRecentActivity = async () => {
    setLoading(true);
    
    try {
      // Fetch real activity from backend
      const response = await fetch(`http://localhost:8001/api/courses/recent_activity/?student_id=${currentUserId}`);
      const result = await response.json();
      
      if (result.status === 'success') {
        const activities = result.data.slice(0, 10).map((activity: any) => ({
          id: activity.id,
          userId: currentUserId,
          userType: 'student' as const,
          action: activity.activity_type || 'activity',
          resourceId: activity.resource_id || '',
          quantity: 1,
          unit: 'count' as const,
          timestamp: activity.created_at || new Date().toISOString(),
          metadata: {
            courseName: activity.course_name,
            videoTitle: activity.subject
          }
        }));
        setRecentActivity(activities);
      } else {
        setRecentActivity([]);
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      setRecentActivity([]);
    }
    
    setLoading(false);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'video_watch':
        return <FaClock />;
      case 'assignment_submission':
        return <FaClipboardList />;
      case 'quiz_attempt':
        return <FaTrophy />;
      case 'course_enrollment':
        return <FaBook />;
      default:
        return <FaCheckCircle />;
    }
  };

  const getActionLabel = (action: string) => {
    return action
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <StudentLayout>
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          {/* Hero Welcome Section */}
          <div className="hero-welcome">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">My Usage & Activity</h1>
                <p className="hero-subtitle one-line">Track your learning activity and monitor your platform usage</p>
              </div>
            </div>
          </div>

          {/* Usage Metrics */}
          <div style={{ marginTop: '2rem' }}>
            <UsageMetricsCard userId={currentUserId} userType="student" />
          </div>

          {/* Usage Chart */}
          <div style={{ marginTop: '2rem' }}>
            <UsageChart userId={currentUserId} title="My Activity This Week" />
          </div>

          {/* Recent Activity */}
          <div className="dashboard-section" style={{ marginTop: '2rem' }}>
            <div className="section-header">
              <div className="section-title">
                <FaChartLine className="section-icon" />
                <h2>Recent Activity</h2>
              </div>
            </div>
            <div style={{ padding: '1rem' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>Loading activity...</p>
                </div>
              ) : recentActivity.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  <FaChartLine style={{ fontSize: '3rem', color: '#d1d5db', margin: '0 auto 1rem' }} />
                  <p>No recent activity found.</p>
                  <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Start learning to see your activity here!</p>
                </div>
              ) : (
                <div className="activity-list">
                  {recentActivity.map((event) => (
                    <div key={event.id} className="activity-item">
                      <div className="activity-icon">
                        {getActionIcon(event.action)}
                      </div>
                      <div className="activity-content">
                        <div className="activity-text">
                          <span className="activity-action">{getActionLabel(event.action)}:</span>{' '}
                          {event.metadata?.courseName || event.metadata?.videoTitle || event.resourceId}
                        </div>
                        <div className="activity-time">{new Date(event.timestamp).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pricing Info */}
          <div className="dashboard-section" style={{ marginTop: '2rem' }}>
            <div className="section-header">
              <div className="section-title">
                <FaTrophy className="section-icon" />
                <h2>Usage Pricing</h2>
              </div>
            </div>
            <div style={{ padding: '1rem' }}>
              <div className="stats-grid">
                <div className="stat-card primary">
                  <div className="stat-icon">
                    <FaBook />
                  </div>
                  <div className="stat-content">
                    <h3>₹99</h3>
                    <p>Course Enrollment</p>
                  </div>
                </div>
                <div className="stat-card success">
                  <div className="stat-icon">
                    <FaClock />
                  </div>
                  <div className="stat-content">
                    <h3>₹5</h3>
                    <p>Video Watch (per hour)</p>
                  </div>
                </div>
                <div className="stat-card info">
                  <div className="stat-icon">
                    <FaClipboardList />
                  </div>
                  <div className="stat-content">
                    <h3>₹10</h3>
                    <p>Assignment Submission</p>
                  </div>
                </div>
                <div className="stat-card warning">
                  <div className="stat-icon">
                    <FaTrophy />
                  </div>
                  <div className="stat-content">
                    <h3>₹5</h3>
                    <p>Quiz Attempt</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions" style={{ marginTop: '2rem' }}>
            <Link to="/courses" className="action-card primary">
              <div className="action-icon">
                <FaBook />
              </div>
              <h3>Browse Courses</h3>
              <p>Explore more courses to increase your learning</p>
            </Link>

            <Link to="/dashboard" className="action-card success">
              <div className="action-icon">
                <FaChartLine />
              </div>
              <h3>View Dashboard</h3>
              <p>Check your overall progress and achievements</p>
            </Link>

            <Link to="/performance" className="action-card info">
              <div className="action-icon">
                <FaTrophy />
              </div>
              <h3>Performance</h3>
              <p>Analyze your detailed performance metrics</p>
            </Link>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
