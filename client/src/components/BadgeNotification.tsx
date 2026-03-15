/* BREACH NOTIFICATION FILE - This file provides badge notification component */

import React, { useState, useEffect } from 'react';
import { FaTrophy, FaTimes, FaShare } from 'react-icons/fa';
import './BadgeNotification.css';

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  difficulty: string;
  points: number;
  color: string;
}

interface BadgeNotificationProps {
  badge: Badge;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const BadgeNotification: React.FC<BadgeNotificationProps> = ({ 
  badge, 
  onClose, 
  autoClose = true, 
  duration = 5000 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto close
    if (autoClose) {
      const closeTimer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(closeTimer);
      };
    }
    
    return () => clearTimeout(timer);
  }, [autoClose, duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const shareBadge = () => {
    if (navigator.share) {
      navigator.share({
        title: `I earned the ${badge.name} badge!`,
        text: `🎉 I just earned the "${badge.name}" badge on Eduyata! ${badge.description}`,
        url: window.location.href
      });
    } else {
      const text = `🎉 I just earned the "${badge.name}" badge on Eduyata! ${badge.description}`;
      navigator.clipboard.writeText(text);
      // You could show a toast here
    }
  };

  return (
    <div className={`badge-notification-overlay ${isVisible ? 'visible' : ''} ${isClosing ? 'closing' : ''}`}>
      <div className="badge-notification" style={{ borderColor: badge.color }}>
        <button className="notification-close" onClick={handleClose}>
          <FaTimes />
        </button>
        
        <div className="notification-content">
          <div className="notification-header">
            <div className="celebration-icon">🎉</div>
            <h3>Badge Earned!</h3>
          </div>
          
          <div className="badge-showcase">
            <div className="badge-icon-large" style={{ color: badge.color }}>
              {badge.icon}
            </div>
            <div className="badge-info">
              <h4 className="badge-name">{badge.name}</h4>
              <p className="badge-description">{badge.description}</p>
              <div className="badge-meta">
                <span className="badge-points">+{badge.points} points</span>
                <span className="badge-difficulty" style={{ color: badge.color }}>
                  {badge.difficulty}
                </span>
              </div>
            </div>
          </div>
          
          <div className="notification-actions">
            <button className="share-btn" onClick={shareBadge}>
              <FaShare />
              Share Achievement
            </button>
            <button className="continue-btn" onClick={handleClose}>
              Continue Learning
            </button>
          </div>
        </div>
        
        {/* Progress bar for auto-close */}
        {autoClose && (
          <div className="auto-close-progress">
            <div 
              className="progress-bar" 
              style={{ 
                animationDuration: `${duration}ms`,
                backgroundColor: badge.color 
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeNotification;