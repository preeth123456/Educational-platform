import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import SessionManager from '../utils/sessionManager';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <div style={{ height: '80px', flexShrink: 0 }}>
        <AdminHeader adminId={adminSession?.id} />
      </div>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div
          style={{
            flex: 1,
            marginLeft: sidebarOpen ? '250px' : '60px',
            transition: 'margin-left 0.3s ease',
            width: sidebarOpen ? 'calc(100% - 250px)' : 'calc(100% - 60px)',
            overflowY: 'auto',
            height: '100%'
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
