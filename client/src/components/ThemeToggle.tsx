import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaPalette } from 'react-icons/fa';
import './ThemeToggle.css';

interface ThemeToggleProps {
  studentId: string | number;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ studentId }) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [hasFeatureFlag, setHasFeatureFlag] = useState(false);

  useEffect(() => {
    checkFeatureFlag();
    loadUserTheme();
  }, [studentId]);

  const checkFeatureFlag = async () => {
    try {
      const response = await fetch(`http://localhost:8001/api/feature-flags/check/?flag_name=theme_toggle&user_id=${studentId}&user_type=student`);
      const data = await response.json();
      setHasFeatureFlag(data.has_access);
    } catch (error) {
      console.error('Error checking theme feature flag:', error);
    }
  };

  const loadUserTheme = async () => {
    try {
      const response = await fetch(`http://localhost:8001/api/auth/get_user_preferences/?student_id=${studentId}`);
      const data = await response.json();
      if (data.status === 'success') {
        setTheme(data.data.theme || 'auto');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
    applyTheme(newTheme);
    
    try {
      await fetch('http://localhost:8001/api/auth/update_user_preferences/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          theme: newTheme
        })
      });
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-theme');
    } else if (theme === 'light') {
      root.classList.remove('dark-theme');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark-theme');
      } else {
        root.classList.remove('dark-theme');
      }
    }
  };

  if (!hasFeatureFlag) return null;

  return (
    <div className="theme-toggle">
      <div className="theme-options">
        <button
          className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
          onClick={() => handleThemeChange('light')}
          title="Light Theme"
        >
          <FaSun />
        </button>
        <button
          className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
          onClick={() => handleThemeChange('dark')}
          title="Dark Theme"
        >
          <FaMoon />
        </button>
        <button
          className={`theme-btn ${theme === 'auto' ? 'active' : ''}`}
          onClick={() => handleThemeChange('auto')}
          title="Auto Theme"
        >
          <FaPalette />
        </button>
      </div>
    </div>
  );
};

export default ThemeToggle;