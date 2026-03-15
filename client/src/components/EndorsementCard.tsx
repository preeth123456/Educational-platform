import React from 'react';
import { FaUser, FaChalkboardTeacher, FaTrophy, FaCalendarAlt } from 'react-icons/fa';
import './EndorsementCard.css';

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

interface EndorsementCardProps {
  endorsement: Endorsement;
  compact?: boolean;
}

const EndorsementCard: React.FC<EndorsementCardProps> = ({ endorsement, compact = false }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#9C27B0';
      default: return '#757575';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'beginner': return '⭐';
      case 'intermediate': return '🏅';
      case 'advanced': return '🏆';
      default: return '⭐';
    }
  };

  if (compact) {
    return (
      <div className="endorsement-card-compact">
        <div className="endorsement-icon" style={{ color: getLevelColor(endorsement.level) }}>
          {getLevelIcon(endorsement.level)}
        </div>
        <div className="endorsement-info">
          <span className="skill-name">{endorsement.skill_name}</span>
          <span className="endorser-name">by {endorsement.endorser_name}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="endorsement-card">
      <div className="endorsement-header">
        <div className="skill-info">
          <h3 className="skill-name">{endorsement.skill_name}</h3>
          <span className="skill-category">{endorsement.skill_category}</span>
        </div>
        <div className="level-badge" style={{ backgroundColor: getLevelColor(endorsement.level) }}>
          {getLevelIcon(endorsement.level)} {endorsement.level}
        </div>
      </div>

      <div className="endorser-info">
        <div className="endorser-icon">
          {endorsement.endorser_type === 'teacher' ? <FaChalkboardTeacher /> : <FaUser />}
        </div>
        <div className="endorser-details">
          <span className="endorser-name">{endorsement.endorser_name}</span>
          <span className="endorser-type">{endorsement.endorser_type}</span>
        </div>
      </div>

      {endorsement.message && (
        <div className="endorsement-message">
          <p>"{endorsement.message}"</p>
        </div>
      )}

      {endorsement.evidence_type && (
        <div className="evidence-info">
          <span className="evidence-type">{endorsement.evidence_type}</span>
          {endorsement.evidence_score && (
            <span className="evidence-score">{endorsement.evidence_score}%</span>
          )}
        </div>
      )}

      <div className="endorsement-footer">
        <div className="date-info">
          <FaCalendarAlt />
          <span>{new Date(endorsement.created_at).toLocaleDateString()}</span>
        </div>
        {endorsement.is_ai_suggested && (
          <span className="ai-badge">AI Suggested</span>
        )}
      </div>
    </div>
  );
};

export default EndorsementCard;