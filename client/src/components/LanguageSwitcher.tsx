import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage, availableLanguages, getCurrentLanguage } from '../i18n/i18n';
import { FaGlobe, FaChevronDown } from 'react-icons/fa';

interface LanguageSwitcherProps {
  compact?: boolean; // For header usage with smaller size
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ compact = false }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = availableLanguages.find(l => l.code === i18n.language) || availableLanguages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div 
      ref={dropdownRef}
      className="language-switcher"
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="language-trigger"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: compact ? '6px 10px' : '8px 14px',
          background: 'rgba(108, 99, 255, 0.1)',
          border: '1px solid rgba(108, 99, 255, 0.2)',
          borderRadius: '8px',
          cursor: 'pointer',
          color: '#6C63FF',
          fontWeight: 500,
          fontSize: compact ? '13px' : '14px',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(108, 99, 255, 0.15)';
          e.currentTarget.style.borderColor = '#6C63FF';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(108, 99, 255, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(108, 99, 255, 0.2)';
        }}
      >
        <FaGlobe size={compact ? 14 : 16} />
        <span>{currentLang.flag} {compact ? currentLang.code.toUpperCase() : currentLang.name}</span>
        <FaChevronDown 
          size={10} 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', 
            transition: 'transform 0.2s ease' 
          }} 
        />
      </button>

      {isOpen && (
        <div
          className="language-dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '6px',
            background: '#fff',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            minWidth: '160px',
            zIndex: 1000,
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: i18n.language === lang.code ? 'rgba(108, 99, 255, 0.1)' : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                color: i18n.language === lang.code ? '#6C63FF' : '#333',
                fontWeight: i18n.language === lang.code ? 600 : 400,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (i18n.language !== lang.code) {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = i18n.language === lang.code ? 'rgba(108, 99, 255, 0.1)' : 'transparent';
              }}
            >
              <span style={{ fontSize: '18px' }}>{lang.flag}</span>
              <div>
                <div style={{ fontSize: '14px' }}>{lang.name}</div>
                <div style={{ fontSize: '12px', color: '#888' }}>{lang.nativeName}</div>
              </div>
              {i18n.language === lang.code && (
                <span style={{ marginLeft: 'auto', color: '#6C63FF' }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher;
