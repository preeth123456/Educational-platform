"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import "./NewHeader.css";
import { Search, Bell, Settings, User, LogOut, Moon, Sun, HelpCircle } from "lucide-react";


interface NewHeaderProps {
  avatar?: string;
  name: string;
  role: string;
  gender?: string;
  teacherId?: number;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  onLogout?: () => void;
}

// Function to get avatar based on gender
export const getAvatarUrl = (gender?: string, customAvatar?: string) => {
  if (customAvatar) return customAvatar;

  const maleAvatar = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  const femaleAvatar = 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png';
  const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png';

  if (!gender) return defaultAvatar;
  if (gender.toLowerCase() === 'male') return maleAvatar;
  if (gender.toLowerCase() === 'female') return femaleAvatar;
  return defaultAvatar;
};

export const NewHeader: React.FC<NewHeaderProps> = ({
  avatar,
  name,
  role,
  gender,
  teacherId,
  searchPlaceholder = "Search for courses, students...",
  onSearch,
  onLogout
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [, navigate] = useLocation();
  const [notifications, setNotifications] = useState<any[]>([]);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (teacherId) {
          console.log('Fetching notifications for teacher:', teacherId);
          // Use the new unified notifications API
          const response = await fetch(`http://localhost:8001/api/notifications/?user_type=teacher&user_id=${teacherId}`);
          const data = await response.json();
          console.log('Teacher notifications response:', data);
          if (data.success) {
            // Map the new API response format to the expected format
            const mappedNotifications = (data.notifications || []).map((n: any) => ({
              id: n.id,
              title: n.title,
              message: n.message,
              time: formatTimeAgo(n.created_at),
              unread: n.status === 'unread',
              type: n.type,
              priority: n.priority
            }));
            console.log('Setting teacher notifications:', mappedNotifications);
            setNotifications(mappedNotifications);
          }
        }
      } catch (error) {
        console.error('Error fetching teacher notifications:', error);
      }
    };

    // Helper function to format time
    const formatTimeAgo = (dateString: string) => {
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

    if (teacherId) {
      fetchNotifications();
    }
  }, [teacherId]);



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleLogout = () => {
    onLogout?.();
  };

  const handleNotificationClick = async (notification: any) => {
    // Mark as read using unified notifications API
    if (notification.unread && teacherId) {
      try {
        await fetch(`http://localhost:8001/api/notifications/${notification.id}/read/`, {
          method: 'POST'
        });

        // Update local state - mark as read but keep in list
        setNotifications(prev =>
          prev.map(n => n.id === notification.id ? { ...n, unread: false } : n)
        );
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    // Navigate based on notification content (check both title and message)
    const content = (notification.title + ' ' + notification.message).toLowerCase();

    if (content.includes('course')) {
      navigate('/my-courses');
    } else if (content.includes('student') || content.includes('enroll')) {
      navigate('/teacher-students');
    } else if (content.includes('assignment') || content.includes('submission')) {
      navigate('/teacher-assignments');
    } else if (content.includes('lms') || content.includes('content')) {
      navigate('/teacher-lms');
    } else if (content.includes('performance') || content.includes('grade')) {
      navigate('/teacher-performance');
    }

    setShowNotifications(false);
  };

  const handleMarkAllRead = async () => {
    if (!teacherId) return;

    try {
      // Use unified notifications API
      await fetch('http://localhost:8001/api/notifications/read-all/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: teacherId, user_type: 'teacher' })
      });

      // Update local state - mark all as read
      setNotifications(prev =>
        prev.map(n => ({ ...n, unread: false }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Add dark mode logic here
  };

  return (
    <header className="new-header">
      <div className="header-container">
        {/* Logo/Brand Section */}
        <div className="header-brand">
          <div className="brand-logo">
            <img src="/images/eduiyata logo.png" alt="Eduyata Logo" className="logo-image" />
          </div>
        </div>

        {/* Search Section */}
        <div className="header-search">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </form>
        </div>

        {/* Right Section - Actions & Profile */}
        <div className="header-actions">
          {/* Dark Mode Toggle */}
          <button
            className="header-action-btn"
            onClick={toggleDarkMode}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Help Button */}
          <button className="header-action-btn" title="Help">
            <HelpCircle size={20} />
          </button>

          {/* Settings Button */}
          <button className="header-action-btn" title="Settings">
            <Settings size={20} />
          </button>

          {/* Notifications */}
          <div className="notifications-wrapper" ref={notificationsRef}>
            <button
              className="header-action-btn notifications-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
            >
              <Bell size={20} />
              {notifications.filter(n => n.unread).length > 0 && (
                <span className="notification-badge">
                  {notifications.filter(n => n.unread).length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  <button className="mark-all-read" onClick={handleMarkAllRead}>Mark all read</button>
                </div>
                <div className="notifications-list">
                  {notifications.length === 0 ? (
                    <div className="no-notifications">No notifications</div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${notification.unread ? 'unread' : ''}`}
                        onClick={() => handleNotificationClick(notification)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="notification-content">
                          <p className="notification-title">{notification.title}</p>
                          <p className="notification-message">{notification.message}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                        {notification.unread && <div className="unread-indicator" />}
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="user-profile-wrapper">
            <button
              className="user-profile-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <img
                src={getAvatarUrl(gender, avatar)}
                alt={name}
                className="user-avatar"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getAvatarUrl(gender);
                }}
              />
              <div className="user-info">
                <span className="user-name">{name}</span>
                <span className="user-role">{role}</span>
              </div>
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="user-menu-dropdown">
                <div className="user-menu-header">
                  <img
                    src={getAvatarUrl(gender, avatar)}
                    alt={name}
                    className="menu-avatar"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getAvatarUrl(gender);
                    }}
                  />
                  <div className="menu-user-info">
                    <span className="menu-user-name">{name}</span>
                    <span className="menu-user-role">{role}</span>
                  </div>
                </div>
                <div className="user-menu-items">
                  <button
                    className="menu-item"
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/student-info');
                    }}
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </button>
                  <button className="menu-item">
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                  <button className="menu-item" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NewHeader; 
