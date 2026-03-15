import React, { useState, useEffect } from 'react';
import { FaTrophy, FaArrowLeft, FaUsers, FaChartLine } from 'react-icons/fa';
import { Link } from 'wouter';
import StudentLayout from '../components/StudentLayout';
import SkillBadges from '../components/SkillBadges';
import SessionManager from '../utils/sessionManager';
import './BadgesPage.css';

interface LeaderboardEntry {
  rank: number;
  student_id: number;
  name: string;
  profile_picture: string;
  badge_count: number;
  total_points: number;
}

interface BadgeStats {
  total_badges: number;
  earned_badges: number;
  remaining_badges: number;
  total_points: number;
  completion_percentage: number;
  recent_badges: Array<{
    name: string;
    icon: string;
    earned_at: string;
  }>;
}

const BadgesPage: React.FC = () => {
  const [studentSession, setStudentSession] = useState(SessionManager.getSession());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [badgeStats, setBadgeStats] = useState<BadgeStats | null>(null);
  const [activeView, setActiveView] = useState<'badges' | 'leaderboard' | 'stats'>('badges');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentSession) {
      fetchBadgeStats();
      fetchLeaderboard();
    }
  }, [studentSession]);

  const fetchBadgeStats = async () => {
    try {
      const response = await fetch(`http://localhost:8001/api/auth/badges/stats/?student_id=${studentSession?.id}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setBadgeStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching badge stats:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/auth/badges/leaderboard/?limit=10');
      const data = await response.json();
      
      if (data.status === 'success') {
        setLeaderboard(data.data.leaderboard);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvatarUrl = (profilePicture: string | null) => {
    if (profilePicture) return profilePicture;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent('Student')}&background=6366f1&color=fff&size=40`;
  };

  if (!studentSession) {
    return (
      <StudentLayout>
        <div className="badges-page-error">
          <h2>Please log in to view your badges</h2>
          <Link to="/login">Go to Login</Link>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="badges-page" style={{ paddingTop: '80px' }}>
        <div className="badges-page-header">
          <div className="header-content">
            <Link to="/dashboard" className="back-button">
              <FaArrowLeft />
              Back to Dashboard
            </Link>
            <div className="header-title">
              <h1>
                <FaTrophy className="page-icon" />
                Skill Badges
              </h1>
              <p>Track your learning achievements and compete with other students</p>
            </div>
          </div>

          {badgeStats && (
            <div className="badges-overview">
              <div className="overview-card">
                <div className="overview-stat">
                  <span className="stat-number">{badgeStats.earned_badges}</span>
                  <span className="stat-label">Earned</span>
                </div>
                <div className="overview-stat">
                  <span className="stat-number">{badgeStats.total_points}</span>
                  <span className="stat-label">Points</span>
                </div>
                <div className="overview-stat">
                  <span className="stat-number">{badgeStats.completion_percentage}%</span>
                  <span className="stat-label">Complete</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="badges-navigation">
          <button 
            className={`nav-button ${activeView === 'badges' ? 'active' : ''}`}
            onClick={() => setActiveView('badges')}
          >
            <FaTrophy />
            My Badges
          </button>
          <button 
            className={`nav-button ${activeView === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveView('leaderboard')}
          >
            <FaUsers />
            Leaderboard
          </button>
          <button 
            className={`nav-button ${activeView === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveView('stats')}
          >
            <FaChartLine />
            Statistics
          </button>
        </div>

        <div className="badges-content">
          {activeView === 'badges' && (
            <SkillBadges studentId={studentSession.id} showAll={true} />
          )}

          {activeView === 'leaderboard' && (
            <div className="leaderboard-section">
              <div className="section-header">
                <h2>Badge Leaderboard</h2>
                <p>See how you rank against other students</p>
              </div>

              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading leaderboard...</p>
                </div>
              ) : (
                <div className="leaderboard-list">
                  {leaderboard.map((entry, index) => (
                    <div 
                      key={entry.student_id} 
                      className={`leaderboard-item ${entry.student_id === studentSession.id ? 'current-user' : ''}`}
                    >
                      <div className="rank-badge">
                        {entry.rank <= 3 ? (
                          <span className={`medal rank-${entry.rank}`}>
                            {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                          </span>
                        ) : (
                          <span className="rank-number">#{entry.rank}</span>
                        )}
                      </div>
                      
                      <div className="student-info">
                        <img 
                          src={getAvatarUrl(entry.profile_picture)} 
                          alt={entry.name}
                          className="student-avatar"
                        />
                        <div className="student-details">
                          <h4 className="student-name">
                            {entry.name}
                            {entry.student_id === studentSession.id && <span className="you-badge">You</span>}
                          </h4>
                          <div className="student-stats">
                            <span className="badge-count">{entry.badge_count} badges</span>
                            <span className="point-count">{entry.total_points} points</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeView === 'stats' && badgeStats && (
            <div className="stats-section">
              <div className="section-header">
                <h2>Badge Statistics</h2>
                <p>Detailed breakdown of your badge achievements</p>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🏆</div>
                  <div className="stat-content">
                    <h3>Total Badges</h3>
                    <div className="stat-value">{badgeStats.earned_badges} / {badgeStats.total_badges}</div>
                    <div className="stat-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${badgeStats.completion_percentage}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{badgeStats.completion_percentage}% Complete</span>
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-content">
                    <h3>Total Points</h3>
                    <div className="stat-value">{badgeStats.total_points}</div>
                    <div className="stat-description">Points earned from badges</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🎯</div>
                  <div className="stat-content">
                    <h3>Remaining</h3>
                    <div className="stat-value">{badgeStats.remaining_badges}</div>
                    <div className="stat-description">Badges left to earn</div>
                  </div>
                </div>
              </div>

              {badgeStats.recent_badges.length > 0 && (
                <div className="recent-achievements">
                  <h3>Recent Achievements</h3>
                  <div className="recent-badges-list">
                    {badgeStats.recent_badges.map((badge, index) => (
                      <div key={index} className="recent-badge-item">
                        <span className="badge-icon">{badge.icon}</span>
                        <div className="badge-info">
                          <span className="badge-name">{badge.name}</span>
                          <span className="badge-date">
                            {new Date(badge.earned_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default BadgesPage;