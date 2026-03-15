import React, { useState, useEffect } from 'react';
import { FaTrophy, FaArrowLeft, FaChartBar } from 'react-icons/fa';
import { Link } from 'wouter';
import StudentLayout from '../components/StudentLayout';
import EndorsementCard from '../components/EndorsementCard';
import SessionManager from '../utils/sessionManager';
import './EndorsementsPage.css';

interface Endorsement {
  id: number;
  skill_name: string;
  skill_category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  endorser_name: string;
  endorser_type: 'teacher' | 'peer';
  message: string;
  evidence_type?: string;
  evidence_score?: number;
  created_at: string;
  is_ai_suggested: boolean;
}

interface EndorsementStats {
  category: string;
  count: number;
  avg_score: number | null;
}

const EndorsementsPage: React.FC = () => {
  const [studentSession, setStudentSession] = useState(SessionManager.getSession());
  const [endorsements, setEndorsements] = useState<Endorsement[]>([]);
  const [stats, setStats] = useState<EndorsementStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'teacher' | 'peer'>('all');

  useEffect(() => {
    if (studentSession) {
      fetchEndorsements();
      fetchStats();
    }
  }, [studentSession]);

  const fetchEndorsements = async () => {
    try {
      const response = await fetch(`http://localhost:8001/api/auth/endorsements/student/?student_id=${studentSession?.id}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setEndorsements(data.data.endorsements);
      }
    } catch (error) {
      console.error('Error fetching endorsements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`http://localhost:8001/api/auth/endorsements/stats/?student_id=${studentSession?.id}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const filteredEndorsements = endorsements.filter(endorsement => {
    if (activeTab === 'all') return true;
    return endorsement.endorser_type === activeTab;
  });

  const groupedEndorsements = filteredEndorsements.reduce((acc, endorsement) => {
    if (!acc[endorsement.skill_category]) {
      acc[endorsement.skill_category] = [];
    }
    acc[endorsement.skill_category].push(endorsement);
    return acc;
  }, {} as Record<string, Endorsement[]>);

  if (!studentSession) {
    return (
      <StudentLayout>
        <div className="endorsements-page-error">
          <h2>Please log in to view your endorsements</h2>
          <Link to="/login">Go to Login</Link>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="endorsements-page" style={{ paddingTop: '80px' }}>
        <div className="endorsements-header">
          <div className="header-content">
            <Link to="/dashboard" className="back-button">
              <FaArrowLeft />
              Back to Dashboard
            </Link>
            <div className="header-title">
              <h1>
                <FaTrophy className="page-icon" />
                Skill Endorsements
              </h1>
              <p>Recognition from teachers and peers for your demonstrated skills</p>
            </div>
          </div>

          <div className="endorsements-overview">
            <div className="overview-stats">
              <div className="stat-card">
                <span className="stat-number">{endorsements.length}</span>
                <span className="stat-label">Total Endorsements</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{stats.length}</span>
                <span className="stat-label">Skill Categories</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">
                  {endorsements.filter(e => e.endorser_type === 'teacher').length}
                </span>
                <span className="stat-label">Teacher Endorsements</span>
              </div>
            </div>
          </div>
        </div>

        <div className="endorsements-navigation">
          <button 
            className={`nav-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Endorsements ({endorsements.length})
          </button>
          <button 
            className={`nav-button ${activeTab === 'teacher' ? 'active' : ''}`}
            onClick={() => setActiveTab('teacher')}
          >
            Teacher ({endorsements.filter(e => e.endorser_type === 'teacher').length})
          </button>
          <button 
            className={`nav-button ${activeTab === 'peer' ? 'active' : ''}`}
            onClick={() => setActiveTab('peer')}
          >
            Peer ({endorsements.filter(e => e.endorser_type === 'peer').length})
          </button>
        </div>

        <div className="endorsements-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading endorsements...</p>
            </div>
          ) : filteredEndorsements.length > 0 ? (
            <div className="endorsements-by-category">
              {Object.entries(groupedEndorsements).map(([category, categoryEndorsements]) => (
                <div key={category} className="category-section">
                  <div className="category-header">
                    <h2>{category}</h2>
                    <span className="category-count">({categoryEndorsements.length})</span>
                  </div>
                  <div className="endorsements-grid">
                    {categoryEndorsements.map(endorsement => (
                      <EndorsementCard key={endorsement.id} endorsement={endorsement} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FaTrophy className="empty-icon" />
              <h3>No endorsements yet</h3>
              <p>Keep learning and participating to earn endorsements from teachers and peers!</p>
            </div>
          )}
        </div>

        {stats.length > 0 && (
          <div className="stats-section">
            <div className="section-header">
              <h2>
                <FaChartBar />
                Endorsement Statistics
              </h2>
            </div>
            <div className="stats-grid">
              {stats.map(stat => (
                <div key={stat.category} className="stat-category-card">
                  <h3>{stat.category}</h3>
                  <div className="stat-details">
                    <div className="stat-item">
                      <span className="stat-value">{stat.count}</span>
                      <span className="stat-label">Endorsements</span>
                    </div>
                    {stat.avg_score && (
                      <div className="stat-item">
                        <span className="stat-value">{stat.avg_score.toFixed(1)}%</span>
                        <span className="stat-label">Avg Score</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default EndorsementsPage;