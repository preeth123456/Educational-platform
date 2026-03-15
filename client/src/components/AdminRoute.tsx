import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import SessionManager from '../utils/sessionManager';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [, navigate] = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminAuth = () => {
      console.log('AdminRoute: Checking admin authentication...');
      
      const session = SessionManager.getSession();
      const sessionToken = localStorage.getItem('session_token');
      const adminToken = localStorage.getItem('admin_token');
      
      console.log('AdminRoute: Session:', session);
      console.log('AdminRoute: Session role:', session?.role);
      console.log('AdminRoute: Session token:', sessionToken);
      console.log('AdminRoute: Admin token:', adminToken);

      // Check if user has admin role and valid token
      if (!session || session.role !== 'admin' || (!sessionToken && !adminToken)) {
        console.log('AdminRoute: Authentication failed, redirecting to admin login');
        navigate('/admin-login');
        return;
      }

      console.log('AdminRoute: Authentication successful');
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAdminAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Verifying admin access...
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        color: '#ef4444'
      }}>
        <h2>Unauthorized Access</h2>
        <p>You don't have permission to access this area.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
