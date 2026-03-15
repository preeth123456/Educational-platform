import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { FaBell, FaShieldAlt, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import SessionManager from '../utils/sessionManager';
import './AdminHeaderCourse.css';

interface AdminHeaderProps {
  adminId?: number;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ adminId }) => {
  const [, navigate] = useLocation();
  const [adminData, setAdminData] = useState({ name: '', email: '' });
  const [notifications] = useState(3); // Mock notification count

  useEffect(() => {
    const session = SessionManager.getSession();
    if (session) {
      setAdminData({ name: session.name, email: session.email || '' });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    SessionManager.clearSession();
    navigate('/admin-login');
  };

  return (
    <div className="admin-header">
      <div className="admin-header-left">
        <div className="admin-brand">
          <img 
            src="/images/eduiyata logo.png" 
            alt="EduYata Logo" 
            style={{ height: '40px', width: 'auto' }}
          />
          <span>Admin Course Panel</span>
        </div>
      </div>
      
      <div className="admin-header-right">
        <div className="admin-info">
          <div className="admin-avatar">
            <FaUserShield />
          </div>
          <div className="admin-details">
            <span className="admin-name">Welcome, {adminData.name}</span>
            <small className="admin-email">{adminData.email}</small>
          </div>
        </div>
        
        <button className="notification-btn">
          <FaBell />
          {notifications > 0 && <span className="notification-badge">{notifications}</span>}
        </button>
        

      </div>
    </div>
  );
};

export default AdminHeader;