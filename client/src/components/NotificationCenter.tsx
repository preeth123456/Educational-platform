import React, { useState, useEffect } from 'react';
import { FaBell, FaTimes, FaCheck, FaExclamationTriangle, FaInfo, FaBullhorn, FaEnvelope, FaTrophy } from 'react-icons/fa';
import './NotificationCenter.css';

interface Notification {
  id: number;
  type: 'assessment' | 'course_update' | 'badge' | 'message' | 'announcement' | 'reminder';
  title: string;
  message: string;
  status: 'read' | 'unread';
  created_at: string;
  priority: 'high' | 'medium' | 'low';
}

interface NotificationCenterProps {
  userId: number;
  userType?: 'student' | 'teacher';
}

const API_BASE_URL = 'http://localhost:8001';

const NotificationCenter: React.FC<NotificationCenterProps> = ({ userId, userType = 'student' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId, userType]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/?user_type=${userType}&user_id=${userId}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNotifications(data.notifications);
          setUnreadCount(data.unread_count);
        }
      } else {
        console.error('Failed to fetch notifications');
        // Fallback to empty state
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to empty state on error
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    fetchNotifications();
    // Set up polling to refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      console.log('Fetching notifications for user:', userId);
      
      // Fetch student notifications
      let studentNotifications = [];
      try {
        let response = await fetch(`http://localhost:8001/api/auth/student-notifications/?student_id=${userId}`);
        if (response.ok) {
          const data = await response.json();
          studentNotifications = data.notifications || [];
          console.log('Student notifications:', studentNotifications);
        }
      } catch (error) {
        console.error('Error fetching student notifications:', error);
      }
      
      // Fetch grievance notifications
      let grievanceNotifications = [];
      try {
        let grievanceResponse = await fetch(`http://localhost:8001/api/collaboration/grievances/notifications/?user_id=${userId}&user_type=student`);
        if (grievanceResponse.ok) {
          const data = await grievanceResponse.json();
          grievanceNotifications = data.notifications || [];
          console.log('Grievance notifications:', grievanceNotifications);
        }
      } catch (error) {
        console.error('Error fetching grievance notifications:', error);
      }
      
      // Combine and format notifications
      const allNotifications = [
        ...studentNotifications.map((n: any) => ({
          id: `student_${n.id}`,
          type: 'message' as const,
          title: n.message.includes('grievance') ? '⚖️ Grievance Update' : '📢 Notification',
          message: n.message,
          status: n.is_read ? 'read' as const : 'unread' as const,
          created_at: n.created_at,
          priority: n.message.includes('grievance') ? 'high' as const : 'medium' as const
        })),
        ...grievanceNotifications.map((n: any) => ({
          id: `grievance_${n.id}`,
          type: 'message' as const,
          title: '⚖️ Grievance Update',
          message: n.message,
          status: n.is_read ? 'read' as const : 'unread' as const,
          created_at: n.created_at,
          priority: 'high' as const
        }))
      ];
      
      // Sort by created_at descending
      allNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      console.log('All notifications:', allNotifications);
      setNotifications(allNotifications);
      setUnreadCount(allNotifications.filter(n => n.status === 'unread').length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      // Call API to mark as read
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/${notificationId}/read/`,
        { method: 'POST' }
      );

      if (response.ok) {
        // Update local state
        setNotifications(prev =>
          prev.map(n => n.id === notificationId ? { ...n, status: 'read' } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Still update locally for better UX
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, status: 'read' } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/read-all/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, user_type: userType })
        }
      );

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getIcon = (type: string, title: string) => {
    // Check if it's an announcement based on title or type
    if (title.toLowerCase().includes('announcement') ||
      title.toLowerCase().includes('new course') ||
      title.toLowerCase().includes('maintenance') ||
      title.toLowerCase().includes('welcome') ||
      title.toLowerCase().includes('features') ||
      type === 'announcement') {
      return <FaBullhorn style={{ color: '#8b5cf6' }} />;
    }

    switch (type) {
      case 'assessment': return <FaExclamationTriangle style={{ color: '#ef4444' }} />;
      case 'badge': return <FaTrophy style={{ color: '#f59e0b' }} />;
      case 'course_update': return <FaInfo style={{ color: '#3b82f6' }} />;
      case 'message': return <FaEnvelope style={{ color: '#6b7280' }} />;
      case 'reminder': return <FaBell style={{ color: '#10b981' }} />;
      default: return <FaInfo style={{ color: '#6b7280' }} />;
    }
  };

  const getNotificationLabel = (type: string, title: string) => {
    if (title.toLowerCase().includes('announcement') ||
      title.toLowerCase().includes('new course') ||
      title.toLowerCase().includes('maintenance') ||
      title.toLowerCase().includes('welcome') ||
      title.toLowerCase().includes('features') ||
      type === 'announcement') {
      return 'Announcement';
    }

    switch (type) {
      case 'assessment': return 'Assignment';
      case 'badge': return 'Achievement';
      case 'course_update': return 'Course Update';
      case 'message': return 'Message';
      case 'reminder': return 'Reminder';
      default: return 'Notification';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="notification-center">
      <button
        className="notification-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBell />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-header-actions">
              {unreadCount > 0 && (
                <button
                  className="mark-all-read-btn"
                  onClick={markAllAsRead}
                  title="Mark all as read"
                >
                  <FaCheck /> Mark all read
                </button>
              )}
              <button onClick={() => setIsOpen(false)}>
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="notification-list">
            {loading ? (
              <div className="notification-loading">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="no-notifications">No notifications</div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.status}`}
                  onClick={() => notification.status === 'unread' && markAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {getIcon(notification.type, notification.title)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-header">
                      <h4>{notification.title}</h4>
                      <span className="notification-type-label">
                        {getNotificationLabel(notification.type, notification.title)}
                      </span>
                    </div>
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {formatTime(notification.created_at)}
                    </span>
                  </div>
                  {notification.status === 'unread' && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
