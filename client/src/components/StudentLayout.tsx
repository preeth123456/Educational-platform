import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import NewHeader from './NewHeader';
import EduyataSidebarDemo from './NewSidebar';

import SessionManager, { StudentSession } from '../utils/sessionManager';
import { getHeaderProps } from '../utils/headerUtils';

interface StudentLayoutProps {
  children: React.ReactNode;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [studentSession, setStudentSession] = useState<StudentSession | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    const session = SessionManager.getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    setStudentSession(session);
    loadUserTheme(session.id);
  }, [navigate]);

  const loadUserTheme = async (studentId: number) => {
    try {
      const response = await fetch(`http://localhost:8001/api/auth/get_user_preferences/?student_id=${studentId}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        applyTheme(data.data.theme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-theme');
    } else if (theme === 'light') {
      root.classList.remove('dark-theme');
    } else {
      // Auto theme - check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark-theme');
      } else {
        root.classList.remove('dark-theme');
      }
    }
  };

  // Listen for session updates (triggered by SessionManager.saveSession/clearSession)
  useEffect(() => {
    const refreshSession = () => {
      const session = SessionManager.getSession();
      setStudentSession(session);
    };

    // Custom event dispatched in SessionManager
    window.addEventListener('sessionUpdated', refreshSession);
    // Also handle cross-tab updates
    window.addEventListener('storage', (e) => {
      if (e.key === (SessionManager as any).STORAGE_KEY || e.key === null) {
        refreshSession();
      }
    });

    // Listen for theme changes
    const handleThemeChange = (event: CustomEvent) => {
      applyTheme(event.detail.theme);
    };
    window.addEventListener('themeChanged', handleThemeChange as EventListener);

    return () => {
      window.removeEventListener('sessionUpdated', refreshSession);
      window.removeEventListener('storage', refreshSession as any);
      window.removeEventListener('themeChanged', handleThemeChange as EventListener);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <NewHeader {...getHeaderProps()} studentId={studentSession?.id} />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <EduyataSidebarDemo open={sidebarOpen} setOpen={setSidebarOpen} />
        <div 
          style={{ 
            flex: 1, 
            marginLeft: sidebarOpen ? '250px' : '60px', 
            transition: 'margin-left 0.3s ease'
          }}
        >
          {children}
        </div>
      </div>

    </div>
  );
};

export default StudentLayout;
