import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { FaBell, FaShieldAlt, FaSignOutAlt, FaUserShield, FaTimes } from 'react-icons/fa';
import SessionManager from '../utils/sessionManager';
import ContextSwitcher from './ContextSwitcher';
import './AdminHeader.css';
import LanguageSwitcher from './LanguageSwitcher';

interface AdminHeaderProps {
  adminId?: number;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ adminId }) => {
  const [, navigate] = useLocation();
  const [adminData, setAdminData] = useState({ name: '', email: '' });
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const session = SessionManager.getSession();
    if (session) {
      setAdminData({ name: session.name, email: session.email || '' });
    }
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      console.log('Fetching notifications...');
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:8001/api/admin/notifications/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        }
      });
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Notifications data:', data);
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
        console.log('Set notifications:', data.notifications?.length, 'Unread count:', data.unread_count);
      } else {
        console.error('Failed to fetch notifications:', response.status);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:8001/api/admin/notifications/${notificationId}/read/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        }
      });
      if (response.ok) {
        fetchNotifications(); // Refresh notifications
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    SessionManager.clearSession();
    navigate('/admin-login');
  };

  return (
    <div className="admin-header">
      <div className="admin-header-left">
        <div className="admin-brand">
          <img src="/images/eduiyata logo.png" alt="EduYata" className="logo-image" />
          <div className="logo-container">
            <span className="logo-subtitle">Admin Panel</span>
          </div>
        </div>
      </div>
      
      <div className="admin-header-right">
        <ContextSwitcher onContextChange={() => window.location.reload()} />
        
        <div className="admin-info">
          <div className="admin-avatar">
            <FaUserShield />
          </div>
          <div className="admin-details">
            <span className="admin-name">Welcome, {adminData.name}</span>
            <small className="admin-email">{adminData.email}</small>
          </div>
        </div>

        {/* Language Switcher */}
        <LanguageSwitcher compact />
        
        <div className="notification-wrapper">
          <button 
            className="notification-button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              fetchNotifications();
            }}
          >
            <FaBell size={18} />
            {unreadCount > 0 && (
              <span className="notification-count">{unreadCount}</span>
            )}
          </button>
          
          {showNotifications && (
            <>
              <div 
                className="notification-overlay"
                onClick={() => setShowNotifications(false)}
              />
              <div className="notification-panel">
                <div className="notification-panel-header">
                  <h3>Notifications</h3>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="notification-close"
                  >
                    ×
                  </button>
                </div>
                <div className="notification-panel-body">
                  {notifications.length === 0 ? (
                    <div className="notification-empty">
                      <FaBell size={24} color="#ccc" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`notification-card ${!notification.is_read ? 'notification-unread' : ''}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="notification-content">
                          <h4>{notification.title}</h4>
                          <p>{notification.message}</p>
                          <span className="notification-date">{notification.time_ago}</span>
                        </div>
                        {!notification.is_read && <div className="notification-dot" />}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        

      </div>
    </div>
  );
};

export default AdminHeader;
