import React, { useState, useEffect } from 'react';
import { FaPalette, FaToggleOn, FaToggleOff, FaRocket } from 'react-icons/fa';
import StudentLayout from '../components/StudentLayout';
import SessionManager, { StudentSession } from '../utils/sessionManager';
import { useLocation } from 'wouter';
import './StudentFeatures.css';

interface FeatureFlag {
  name: string;
  description: string;
  is_enabled: boolean;
  has_access: boolean;
}

const StudentFeatures: React.FC = () => {
  const [features, setFeatures] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentSession, setStudentSession] = useState<StudentSession | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    const session = SessionManager.getSession();
    console.log('Raw session from SessionManager:', session);
    
    if (!session) {
      console.log('No session found, redirecting to login');
      navigate('/login');
      return;
    }
    
    console.log('Session loaded:', session);
    setStudentSession(session);
    
    // Check current theme
    const isDark = document.documentElement.classList.contains('dark-theme');
    setCurrentTheme(isDark ? 'dark' : 'light');
    
    const studentId = session.student_id || session.id;
    console.log('Using student ID for features:', studentId);
    
    setTimeout(() => {
      fetchStudentFeatures(studentId);
    }, 100);
  }, [navigate]);

  const fetchStudentFeatures = async (studentId: string | number) => {
    try {
      setLoading(true);
      console.log('Fetching features for student:', studentId);
      console.log('Student session:', studentSession);
      
      // TEMPORARY FIX: Use actual student ID from session
      const actualStudentId = studentSession?.student_id || studentId || 'STU20251807';
      console.log('Using student ID:', actualStudentId);
      
      // Get all enabled feature flags
      const flagsResponse = await fetch('http://localhost:8001/api/feature-flags/');
      const flagsData = await flagsResponse.json();
      console.log('Flags response:', flagsData);
      
      if (flagsData.success) {
        const enabledFlags = flagsData.flags.filter((flag: any) => flag.is_enabled);
        console.log('Enabled flags:', enabledFlags);
        
        // Check access for each flag using the hardcoded student ID
        const featuresWithAccess = await Promise.all(
          enabledFlags.map(async (flag: any) => {
            try {
              console.log(`Checking access for flag ${flag.name} with user_id: ${actualStudentId}`);
              let accessResponse = await fetch(
                `http://localhost:8001/api/feature-flags/check/?flag_name=${encodeURIComponent(flag.name)}&user_id=${actualStudentId}&user_type=student`
              );
              let accessData = await accessResponse.json();
              console.log(`Access check result for ${flag.name}:`, accessData);
              
              return {
                ...flag,
                has_access: accessData.has_access || false
              };
            } catch (error) {
              console.error(`Error checking access for ${flag.name}:`, error);
              return {
                ...flag,
                has_access: false
              };
            }
          })
        );
        
        console.log('Features with access:', featuresWithAccess);
        // Only show features the student has access to
        const accessibleFeatures = featuresWithAccess.filter(feature => feature.has_access);
        console.log('Accessible features:', accessibleFeatures);
        setFeatures(accessibleFeatures);
      }
    } catch (error) {
      console.error('Error fetching student features:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'auto') => {
    try {
      // Apply theme immediately
      const root = document.documentElement;
      if (newTheme === 'dark') {
        root.classList.add('dark-theme');
      } else if (newTheme === 'light') {
        root.classList.remove('dark-theme');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark-theme');
        } else {
          root.classList.remove('dark-theme');
        }
      }

      // Save preference
      await fetch('http://localhost:8001/api/auth/update_user_preferences/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentSession?.student_id || studentSession?.id,
          theme: newTheme
        })
      });
      
      // Log feature usage
      await fetch('http://localhost:8001/api/feature-flags/log-usage/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flag_name: 'theme_toggle',
          user_id: studentSession?.student_id || 'STU20251807',
          user_type: 'student'
        })
      });
      
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  const [currentTheme, setCurrentTheme] = useState('light');

  const toggleTheme = async () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    
    // Apply theme immediately
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark-theme');
    } else {
      root.classList.remove('dark-theme');
    }
    
    try {
      // Log feature usage
      const response = await fetch('http://localhost:8001/api/feature-flags/log-usage/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flag_name: 'theme_toggle',
          user_id: studentSession?.student_id || studentSession?.id || 'STU20251807',
          user_type: 'student'
        })
      });
      
      const result = await response.json();
      console.log('Usage logged:', result);
      
    } catch (error) {
      console.error('Error logging usage:', error);
    }
  };

  const renderFeatureControl = (feature: FeatureFlag) => {
    switch (feature.name) {
      case 'theme_toggle':
        return (
          <div className="theme-controls">
            <button 
              className={`theme-toggle-btn ${currentTheme}`}
              onClick={toggleTheme}
            >
              {currentTheme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        );
      default:
        return (
          <div className="feature-status">
            <FaToggleOn className="toggle-icon enabled" />
            <span>Enabled</span>
          </div>
        );
    }
  };

  const getFeatureIcon = (featureName: string) => {
    switch (featureName) {
      case 'theme_toggle':
        return <FaPalette />;
      default:
        return <FaToggleOn />;
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="features-page">
          <div className="loading">Loading features...</div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="features-page">
        <div className="features-header">
          <h1>My Features</h1>
          <p>Manage your available features and preferences</p>
        </div>

        {features.length === 0 ? (
          <div className="no-features">
            <FaRocket className="no-features-icon" />
            <h3>No Features Available</h3>
            <p>You don't have access to any special features yet, but exciting tools are coming your way!</p>
          </div>
        ) : (
          <div className="features-grid">
            {features.map((feature) => (
              <div key={feature.name} className="feature-card">
                <div className="feature-header">
                  <div className="feature-icon">
                    {getFeatureIcon(feature.name)}
                  </div>
                  <div className="feature-info">
                    <h3>{feature.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                    <p>{feature.description}</p>
                  </div>
                </div>
                <div className="feature-controls">
                  {renderFeatureControl(feature)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentFeatures;