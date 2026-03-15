import React, { useState, useEffect } from 'react';
import { FaClock, FaUser, FaShieldAlt, FaEye, FaEdit, FaSignInAlt, FaSignOutAlt, FaBook, FaUserGraduate } from 'react-icons/fa';
import './ActivityTimeline.css';

interface Activity {
  action: string;
  resource_type: string;
  resource_id: number | null;
  details: any;
  timestamp: string;
  description: string;
}

interface ActivityTimelineProps {
  userId: number;
  userType?: string;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ userId, userType = 'student' }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadActivities();
  }, [userId]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8001/api/auth/activity_history/?user_id=${userId}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setActivities(data.data.activities);
      } else {
        setError(data.message || 'Failed to load activity history');
      }
    } catch (err) {
      setError('Error loading activity history');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (action: string) => {
    if (action.includes('login')) return <FaSignInAlt />;
    if (action.includes('logout')) return <FaSignOutAlt />;
    if (action.includes('profile')) return <FaUser />;
    if (action.includes('password')) return <FaShieldAlt />;
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
    return 'primary';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    // If the difference is negative or very small, it's recent
    if (Math.abs(diffMins) < 2) return 'Just now';
    if (Math.abs(diffMins) < 60) return `${Math.abs(diffMins)} minute${Math.abs(diffMins) > 1 ? 's' : ''} ago`;
    if (Math.abs(diffHours) < 24) return `${Math.abs(diffHours)} hour${Math.abs(diffHours) > 1 ? 's' : ''} ago`;
    if (Math.abs(diffDays) < 7) return `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''} ago`;
    
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="activity-timeline-loading">
        <div className="loading-spinner"></div>
        <p>Loading activity history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="activity-timeline-error">
        <p>{error}</p>
        <button onClick={loadActivities} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="activity-timeline">
      <div className="timeline-header">
        <h3>Activity History</h3>
        <p>Your recent activities and actions</p>
      </div>

      {activities.length === 0 ? (
        <div className="no-activities">
          <FaClock size={48} />
          <p>No activities recorded yet</p>
        </div>
      ) : (
        <div className="timeline-container">
          {activities.map((activity, index) => (
            <div key={index} className={`timeline-item ${getActivityColor(activity.action)}`}>
              <div className="timeline-marker">
                {getActivityIcon(activity.action)}
              </div>
              <div className="timeline-content">
                <div className="activity-header">
                  <h4>{activity.description}</h4>
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;