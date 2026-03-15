import React, { useState, useEffect, useRef } from 'react';
import { FaClock, FaUser, FaShieldAlt, FaEye, FaEdit, FaSignInAlt, FaSignOutAlt, FaBook, FaUserGraduate, FaDownload, FaSyncAlt } from 'react-icons/fa';
import './RealTimeActivityHistory.css';

interface Activity {
  id: number;
  action: string;
  resource_type: string;
  resource_id: number | null;
  details: any;
  timestamp: string;
  description: string;
  ip_address?: string;
  user_agent?: string;
}

interface RealTimeActivityHistoryProps {
  userId: number;
  userType?: string;
}

const RealTimeActivityHistory: React.FC<RealTimeActivityHistoryProps> = ({ userId, userType = 'student' }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadActivities();
    
    // Set up real-time polling every 5 seconds
    intervalRef.current = setInterval(() => {
      loadActivities(false); // Don't show loading on refresh
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [userId]);

  const loadActivities = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      
      const response = await fetch(`http://localhost:8001/api/auth/realtime_activity_history/?user_id=${userId}&user_type=${userType}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setActivities(data.data.activities);
        setLastUpdate(new Date());
        setError('');
      } else {
        setError(data.message || 'Failed to load activity history');
      }
    } catch (err) {
      setError('Error loading activity history');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const getActivityIcon = (action: string) => {
    if (action.includes('login')) return <FaSignInAlt />;
    if (action.includes('logout')) return <FaSignOutAlt />;
    if (action.includes('profile') || action.includes('update_profile')) return <FaUser />;
    if (action.includes('password')) return <FaShieldAlt />;
    if (action.includes('export_data')) return <FaDownload />;
    if (action.includes('view')) return <FaEye />;
    if (action.includes('update') || action.includes('edit')) return <FaEdit />;
    if (action.includes('course')) return <FaBook />;
    if (action.includes('enroll')) return <FaUserGraduate />;
    return <FaClock />;
  };

  const getActivityColor = (action: string) => {
    if (action.includes('failed')) return 'danger';
    if (action.includes('login') || action.includes('success')) return 'success';
    if (action.includes('security') || action.includes('password')) return 'warning';
    if (action.includes('export_data')) return 'info';
    if (action.includes('update_profile')) return 'primary';
    return 'primary';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Shows exact date and time
  };

  const formatActivityDescription = (activity: Activity) => {
    const descriptions: { [key: string]: string } = {
      'login': 'Successfully logged in',
      'login_success': 'Successfully logged in',
      'login_failed': 'Failed login attempt',
      'logout': 'Logged out',
      'update_profile': 'Updated profile information',
      'export_data': 'Exported personal data',
      'view_profile': 'Viewed profile',
      'change_password': 'Changed password',
      'access_course': `Accessed ${activity.resource_type}`,
      'enroll_course': 'Enrolled in course',
      'update_progress': 'Updated learning progress',
      'view_resource': `Viewed ${activity.resource_type}`,
      'create_resource': `Created ${activity.resource_type}`,
      'update_resource': `Updated ${activity.resource_type}`,
      'delete_resource': `Deleted ${activity.resource_type}`,
    };
    
    return descriptions[activity.action] || activity.description || `${activity.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} on ${activity.resource_type}`;
  };

  if (loading) {
    return (
      <div className="activity-timeline-loading">
        <div className="loading-spinner"></div>
        <p>Loading real-time activity history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="activity-timeline-error">
        <p>{error}</p>
        <button onClick={() => loadActivities()} className="retry-btn">
          <FaSyncAlt /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="activity-timeline">
      <div className="timeline-header">
        <div>
          <h3>Real-Time Activity History</h3>
          <p>Your recent activities with live updates</p>
        </div>
        <div className="timeline-controls">
          <span className="last-update">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
          <button 
            onClick={() => loadActivities()} 
            className="refresh-btn"
            title="Refresh now"
          >
            <FaSyncAlt />
          </button>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="no-activities">
          <FaClock size={48} />
          <p>No activities recorded yet</p>
        </div>
      ) : (
        <div className="timeline-container">
          {activities.map((activity, index) => (
            <div key={`${activity.id}-${index}`} className={`timeline-item ${getActivityColor(activity.action)}`}>
              <div className="timeline-marker">
                {getActivityIcon(activity.action)}
              </div>
              <div className="timeline-content">
                <div className="activity-header">
                  <h4>{formatActivityDescription(activity)}</h4>
                  <span className="activity-time">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
                <div className="activity-details">
                  <span className="activity-type">{activity.resource_type}</span>
                  {activity.details && activity.details.status_code && (
                    <span className={`status-code ${activity.details.status_code < 400 ? 'success' : 'error'}`}>
                      {activity.details.status_code}
                    </span>
                  )}
                </div>
                {activity.details && activity.details.path && (
                  <div className="activity-path">
                    <small>{activity.details.method} {activity.details.path}</small>
                  </div>
                )}
                {activity.ip_address && (
                  <div className="activity-meta">
                    <small>IP: {activity.ip_address}</small>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="timeline-footer">
        <small>
          🔄 Auto-refreshes every 5 seconds • 
          📊 Showing last 50 activities • 
          🕒 Times shown in your local timezone
        </small>
      </div>
    </div>
  );
};

export default RealTimeActivityHistory;