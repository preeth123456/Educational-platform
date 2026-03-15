import React, { useState, useEffect } from 'react';
import { useFeatureFlag } from '../hooks/useFeatureFlag';

const DarkModeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const darkModeEnabled = useFeatureFlag('dark_mode');

  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.body.style.backgroundColor = '#1a1a1a';
      document.body.style.color = '#ffffff';
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      // Dark mode
      document.body.style.backgroundColor = '#1a1a1a';
      document.body.style.color = '#ffffff';
      localStorage.setItem('theme', 'dark');
    } else {
      // Light mode
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
      localStorage.setItem('theme', 'light');
    }
  };

  // Only show button if feature flag is enabled (students only)
  if (!darkModeEnabled) {
    return null;
  }

  return (
    <button
      onClick={toggleDarkMode}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '10px 15px',
        backgroundColor: isDark ? '#333' : '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        zIndex: 1000,
        fontSize: '14px'
      }}
    >
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
};

export default DarkModeToggle;