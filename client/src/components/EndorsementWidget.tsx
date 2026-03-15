import React, { useState, useEffect } from 'react';
import { FaTrophy, FaArrowRight } from 'react-icons/fa';
import { Link } from 'wouter';
import EndorsementCard from './EndorsementCard';
import './EndorsementWidget.css';

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

interface EndorsementWidgetProps {
  studentId: number;
}

const EndorsementWidget: React.FC<EndorsementWidgetProps> = ({ studentId }) => {
  const [endorsements, setEndorsements] = useState<Endorsement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentEndorsements();
  }, [studentId]);

  const fetchRecentEndorsements = async () => {
    try {
      const response = await fetch(`http://localhost:8001/api/auth/endorsements/student/?student_id=${studentId}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        // Get the 3 most recent endorsements
        setEndorsements(data.data.endorsements.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching endorsements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="endorsement-widget">
        <div className="widget-header">
          <div className="widget-title">
            <FaTrophy className="widget-icon" />
            <h3>Skill Endorsements</h3>
          </div>
        </div>
        <div className="widget-loading">
          <div className="loading-spinner"></div>
          <p>Loading endorsements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="endorsement-widget">
      <div className="widget-header">
        <div className="widget-title">
          <FaTrophy className="widget-icon" />
          <h3>Skill Endorsements</h3>
        </div>
        <div className="widget-summary">
          <span className="endorsement-count">{endorsements.length}</span>
          <span className="endorsement-label">Recent</span>
        </div>
      </div>
      
      <div className="widget-content">
        {endorsements.length > 0 ? (
          <>
            <div className="recent-endorsements">
              {endorsements.map(endorsement => (
                <EndorsementCard 
                  key={endorsement.id} 
                  endorsement={endorsement} 
                  compact={true} 
                />
              ))}
            </div>
            <Link to="/endorsements" className="view-all-endorsements">
              View All Endorsements
              <FaArrowRight />
            </Link>
          </>
        ) : (
          <div className="no-endorsements">
            <FaTrophy className="no-endorsements-icon" />
            <p>No endorsements yet</p>
            <span className="no-endorsements-text">
              Keep learning to earn endorsements from teachers and peers!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EndorsementWidget;