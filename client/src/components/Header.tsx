import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  onLoginClick?: () => void;
}

export default function Header({ onLoginClick }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div>
            <a href="#" className="logo" style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/images/eduiyata logo.png" alt="Eduyata Logo" style={{ height: '40px', width: 'auto', display: 'block' }} />
            </a>
          </div>
          
          <nav className="nav">
            <a href="#" className="nav-link">{t('common.home')}</a>
            <a href="#features" className="nav-link">{t('common.features')}</a>
            <div className="dropdown">
              <button 
                className="dropdown-toggle"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                {t('common.modules')} <i className="fas fa-chevron-down"></i>
              </button>
              <div 
                className="dropdown-menu"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <a href="#" className="dropdown-item">{t('nav.aiBuddy')}</a>
                <a href="#" className="dropdown-item">{t('nav.gamification')}</a>
                <a href="#" className="dropdown-item">{t('nav.arScienceLab')}</a>
              </div>
            </div>
            <a href="#" className="nav-link">{t('common.courses')}</a>
          </nav>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <LanguageSwitcher compact />
            <button
              className="btn btn-login"
              style={{ background: '#fff', color: '#6C63FF', border: '2px solid #6C63FF', fontWeight: 600 }}
              onClick={onLoginClick}
            >
              {t('common.login')}
            </button>
            <button className="btn btn-primary">
              {t('common.joinFree')}
            </button>
            <button className="mobile-menu-toggle">
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
