import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import AdminHeaderCourse from './AdminHeaderCourse';
import AdminSidebarCourse from './AdminSidebarCourse';
import SessionManager from '../utils/sessionManager';

interface AdminLayoutCourseProps {
  children: React.ReactNode;
}

const AdminLayoutCourse: React.FC<AdminLayoutCourseProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminSession, setAdminSession] = useState<any>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    const session = SessionManager.getSession();
    if (!session || session.role !== 'admin') {
      navigate('/admin-login');
      return;
    }
    setAdminSession(session);
  }, [navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AdminHeaderCourse adminId={adminSession?.id} />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <AdminSidebarCourse open={sidebarOpen} setOpen={setSidebarOpen} />
        <div 
          style={{ 
            flex: 1, 
            marginLeft: sidebarOpen ? '250px' : '60px', 
            transition: 'margin-left 0.3s ease', 
            width: sidebarOpen ? 'calc(100% - 250px)' : 'calc(100% - 60px)' 
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayoutCourse;