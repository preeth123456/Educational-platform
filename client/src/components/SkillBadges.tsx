import React, { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaStar, FaFire, FaChartLine, FaBook, FaLock, FaShare, FaBrain } from 'react-icons/fa';
import './SkillBadges.css';

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  color: string;
  earned_at?: string;
  context?: any;
}

interface BadgeData {
  badges: Badge[];
  badges_by_difficulty: {
    beginner: Badge[];
    intermediate: Badge[];
    advanced: Badge[];
  };
  total_badges: number;
  total_points: number;
  badge_counts: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
}

interface SkillBadgesProps {
  studentId: number;
  showAll?: boolean;
  compact?: boolean;
}

const SkillBadges: React.FC<SkillBadgesProps> = ({ studentId, showAll = false, compact = false }) => {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'star': return '⭐';
      case 'brain': return '🧠';
      case 'book': return '📚';
      case 'fire': return '🔥';
      case 'trophy': return '🏆';
      default: return '🏅';
    }
  };
  const [badgeData, setBadgeData] = useState<BadgeData | null>(null);
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);
  const [activeTab, setActiveTab] = useState<'earned' | 'available'>('earned');
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  useEffect(() => {
    fetchBadges();
  }, [studentId]);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      
      // Fetch earned badges
      const earnedResponse = await fetch(`http://localhost:8001/api/auth/badges/student/?student_id=${studentId}`);
      const earnedData = await earnedResponse.json();
      
      // Fetch available badges
      const availableResponse = await fetch(`http://localhost:8001/api/auth/badges/available/?student_id=${studentId}`);
      const availableData = await availableResponse.json();
      
      if (earnedData.status === 'success') {
        setBadgeData(earnedData.data);
      }
      
      if (availableData.status === 'success') {
        setAvailableBadges(availableData.data.available_badges);
      }
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#9C27B0';
      default: return '#757575';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return <FaStar />;
      case 'intermediate': return <FaMedal />;
      case 'advanced': return <FaTrophy />;
      default: return <FaStar />;
    }
  };

  const shareBadge = (badge: Badge) => {
    if (navigator.share) {
      navigator.share({
        title: `I earned the ${badge.name} badge!`,
        text: `🎉 I just earned the "${badge.name}" badge on Eduyata! ${badge.description}`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const text = `🎉 I just earned the "${badge.name}" badge on Eduyata! ${badge.description}`;
      navigator.clipboard.writeText(text);
      alert('Badge achievement copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="badges-loading">
        <div className="loading-spinner"></div>
        <p>Loading badges...</p>
      </div>
    );
  }

  if (compact && badgeData) {
    // Compact view for dashboard
    const recentBadges = badgeData.badges.slice(0, 3);
    const availableToShow = availableBadges.slice(0, 3);
    
    return (
      <div className="badges-compact">
        <div className="badges-header-compact">
          <div className="badges-title">
            <FaTrophy className="badges-icon" />
            <h3>Skill Badges</h3>
          </div>
          <div className="badges-summary">
            <span className="badge-count">{badgeData.total_badges}</span>
            <span className="badge-points">{badgeData.total_points} pts</span>
          </div>
        </div>
        
        <div className="recent-badges">
          {recentBadges.length > 0 ? (
            recentBadges.map(badge => (
              <div key={badge.id} className="badge-item-compact earned" style={{ borderColor: badge.color }}>
                <span className="badge-icon-compact">{getIconComponent(badge.icon)}</span>
                <div className="badge-info-compact">
                  <span className="badge-name-compact">{badge.name}</span>
                  <span className="badge-difficulty-compact">{badge.difficulty}</span>
                </div>
              </div>
            ))
          ) : availableToShow.length > 0 ? (
            <>
              <div className="available-badges-header">
                <span>Available Badges:</span>
              </div>
              {availableToShow.map(badge => (
                <div key={badge.id} className="badge-item-compact available" style={{ borderColor: '#ddd' }}>
                  <span className="badge-icon-compact">{getIconComponent(badge.icon)}</span>
                  <div className="badge-info-compact">
                    <span className="badge-name-compact">{badge.name}</span>
                    <span className="badge-difficulty-compact">{badge.difficulty}</span>
                  </div>
                  <FaLock className="badge-lock-icon" />
                </div>
              ))}
            </>
          ) : (
            <div className="no-badges-compact">
              <FaLock />
              <span>No badges available</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="skill-badges-container">
      <div className="badges-header">
        <div className="badges-title-section">
          <h2>
            <FaTrophy className="section-icon" />
            Skill Badges
          </h2>
          <p>Earn badges by completing lessons, scoring well on quizzes, and maintaining learning streaks!</p>
        </div>
        
        {badgeData && (
          <div className="badges-stats">
            <div className="stat-item">
              <span className="stat-value">{badgeData.total_badges}</span>
              <span className="stat-label">Earned</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{badgeData.total_points}</span>
              <span className="stat-label">Points</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{availableBadges.length}</span>
              <span className="stat-label">Available</span>
            </div>
          </div>
        )}
      </div>

      <div className="badges-tabs">
        <button 
          className={`tab-button ${activeTab === 'earned' ? 'active' : ''}`}
          onClick={() => setActiveTab('earned')}
        >
          <FaTrophy />
          Earned Badges ({badgeData?.total_badges || 0})
        </button>
        <button 
          className={`tab-button ${activeTab === 'available' ? 'active' : ''}`}
          onClick={() => setActiveTab('available')}
        >
          <FaLock />
          Available Badges ({availableBadges.length})
        </button>
      </div>

      <div className="badges-content">
        {activeTab === 'earned' && badgeData && (
          <div className="earned-badges">
            {badgeData.total_badges > 0 ? (
              <div className="badges-by-difficulty">
                {(['beginner', 'intermediate', 'advanced'] as const).map(difficulty => (
                  badgeData.badges_by_difficulty[difficulty].length > 0 && (
                    <div key={difficulty} className="difficulty-section">
                      <div className="difficulty-header">
                        {getDifficultyIcon(difficulty)}
                        <h3>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Badges</h3>
                        <span className="badge-count">({badgeData.badge_counts[difficulty]})</span>
                      </div>
                      
                      <div className="badges-grid">
                        {badgeData.badges_by_difficulty[difficulty].map(badge => (
                          <div 
                            key={badge.id} 
                            className="badge-card earned"
                            style={{ borderColor: badge.color }}
                            onClick={() => setSelectedBadge(badge)}
                          >
                            <div className="badge-icon-large" style={{ color: badge.color }}>
                              {getIconComponent(badge.icon)}
                            </div>
                            <div className="badge-content">
                              <h4 className="badge-name">{badge.name}</h4>
                              <p className="badge-description">{badge.description}</p>
                              <div className="badge-meta">
                                <span className="badge-points">+{badge.points} pts</span>
                                <span className="badge-earned-date">
                                  {badge.earned_at && new Date(badge.earned_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <button 
                              className="share-badge-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                shareBadge(badge);
                              }}
                            >
                              <FaShare />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            ) : (
              <div className="no-badges-message">
                <FaTrophy className="no-badges-icon" />
                <h3>No badges earned yet</h3>
                <p>Start learning to earn your first badge!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'available' && (
          <div className="available-badges">
            {availableBadges.length > 0 ? (
              <div className="badges-grid">
                {availableBadges.map(badge => (
                  <div 
                    key={badge.id} 
                    className="badge-card available"
                    onClick={() => setSelectedBadge(badge)}
                  >
                    <div className="badge-icon-large locked">
                      {getIconComponent(badge.icon)}
                    </div>
                    <div className="badge-content">
                      <h4 className="badge-name">{badge.name}</h4>
                      <p className="badge-description">{badge.description}</p>
                      <div className="badge-meta">
                        <span className="badge-points">+{badge.points} pts</span>
                        <span className="badge-difficulty" style={{ color: getDifficultyColor(badge.difficulty) }}>
                          {badge.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="badge-lock-overlay">
                      <FaLock />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-badges-message">
                <FaLock className="no-badges-icon" />
                <h3>All badges earned!</h3>
                <p>Congratulations! You've earned all available badges.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="badge-modal-overlay" onClick={() => setSelectedBadge(null)}>
          <div className="badge-modal" onClick={e => e.stopPropagation()}>
            <div className="badge-modal-header">
              <div className="badge-modal-icon" style={{ color: selectedBadge.color }}>
                {getIconComponent(selectedBadge.icon)}
              </div>
              <div className="badge-modal-info">
                <h3>{selectedBadge.name}</h3>
                <p>{selectedBadge.description}</p>
                <div className="badge-modal-meta">
                  <span className="badge-points">+{selectedBadge.points} points</span>
                  <span className="badge-difficulty" style={{ color: getDifficultyColor(selectedBadge.difficulty) }}>
                    {selectedBadge.difficulty}
                  </span>
                </div>
              </div>
              <button className="modal-close" onClick={() => setSelectedBadge(null)}>×</button>
            </div>
            
            {selectedBadge.earned_at && (
              <div className="badge-modal-earned">
                <FaFire />
                <span>Earned on {new Date(selectedBadge.earned_at).toLocaleDateString()}</span>
              </div>
            )}
            
            <div className="badge-modal-actions">
              {selectedBadge.earned_at ? (
                <button className="share-btn" onClick={() => shareBadge(selectedBadge)}>
                  <FaShare />
                  Share Achievement
                </button>
              ) : (
                <div className="badge-requirements">
                  <h4>Requirements:</h4>
                  <p>Keep learning to unlock this badge!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillBadges;