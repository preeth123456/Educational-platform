import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaHistory, FaSave } from 'react-icons/fa';

interface ConsentSettings {
  data_collection: boolean;
  progress_sharing: boolean;
  achievement_visibility: boolean;
  parent_notifications: boolean;
  marketing_communications: boolean;
}

interface ConsentHistoryItem {
  consent_type: string;
  action: string;
  timestamp: string;
  ip_address: string;
}

interface PrivacyDashboardProps {
  studentId: number;
  onUpdate?: (message: string) => void;
}

const PrivacyDashboard: React.FC<PrivacyDashboardProps> = ({ studentId, onUpdate }) => {
  const [consents, setConsents] = useState<ConsentSettings>({
    data_collection: false,
    progress_sharing: false,
    achievement_visibility: false,
    parent_notifications: true,
    marketing_communications: false,
  });
  const [history, setHistory] = useState<ConsentHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const consentDescriptions = {
    data_collection: {
      title: 'Data Collection & Analytics',
      description: 'Allow collection of learning analytics and usage data to improve your experience and provide personalized recommendations.'
    },
    progress_sharing: {
      title: 'Progress Sharing with Teachers',
      description: 'Share your learning progress, quiz scores, and assignment completion with your teachers for better guidance.'
    },
    achievement_visibility: {
      title: 'Achievement Visibility',
      description: 'Make your badges, achievements, and leaderboard rankings visible to other students in your class.'
    },
    parent_notifications: {
      title: 'Parent Notifications',
      description: 'Send notifications about your progress, achievements, and important updates to your parents.'
    },
    marketing_communications: {
      title: 'Marketing Communications',
      description: 'Receive promotional emails about new courses, features, and educational opportunities.'
    }
  };

  useEffect(() => {
    loadConsentStatus();
  }, [studentId]);

  const loadConsentStatus = async () => {
    try {
      const response = await fetch(`http://localhost:8001/api/auth/consent_status/?student_id=${studentId}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setConsents(data.data);
      }
    } catch (error) {
      console.error('Error loading consent status:', error);
    }
  };

  const loadConsentHistory = async () => {
    try {
      const response = await fetch(`http://localhost:8001/api/auth/consent_history/?student_id=${studentId}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setHistory(data.data);
      }
    } catch (error) {
      console.error('Error loading consent history:', error);
    }
  };

  const handleConsentChange = (consentType: keyof ConsentSettings, value: boolean) => {
    setConsents(prev => ({
      ...prev,
      [consentType]: value
    }));
  };

  const handleSaveConsents = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8001/api/auth/bulk_consent/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentId,
          consents: consents
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        onUpdate?.('Privacy settings updated successfully!');
      } else {
        onUpdate?.('Error updating privacy settings: ' + data.message);
      }
    } catch (error) {
      onUpdate?.('Error updating privacy settings');
    }
    setLoading(false);
  };

  const formatConsentType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="privacy-dashboard">
      <div className="section-header">
        <h2><FaShieldAlt /> Privacy & Consent Management</h2>
        <p>Control how your data is used and shared. Your privacy is important to us.</p>
      </div>

      <div className="privacy-notice">
        <h3>Your Privacy Rights</h3>
        <p>
          You have full control over your personal data. You can grant or revoke consent for different 
          types of data processing at any time. Changes take effect immediately and are logged for transparency.
        </p>
      </div>

      <div className="consent-controls">
        {Object.entries(consentDescriptions).map(([key, info]) => (
          <div key={key} className="consent-item">
            <div className="consent-info">
              <h3>{info.title}</h3>
              <p>{info.description}</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={consents[key as keyof ConsentSettings]}
                onChange={(e) => handleConsentChange(key as keyof ConsentSettings, e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        ))}
      </div>

      <div className="privacy-actions">
        <button 
          className="save-btn"
          onClick={handleSaveConsents}
          disabled={loading}
        >
          <FaSave />
          {loading ? 'Saving...' : 'Save Privacy Settings'}
        </button>

        <button 
          className="history-btn"
          onClick={() => {
            setShowHistory(!showHistory);
            if (!showHistory) loadConsentHistory();
          }}
        >
          <FaHistory />
          {showHistory ? 'Hide' : 'View'} Consent History
        </button>
      </div>

      {showHistory && (
        <div className="consent-history">
          <h3>Consent Change History</h3>
          {history.length === 0 ? (
            <p>No consent changes recorded yet.</p>
          ) : (
            <div className="history-list">
              {history.map((item, index) => (
                <div key={index} className="history-item">
                  <div className="history-details">
                    <strong>{formatConsentType(item.consent_type)}</strong>
                    <span className={`action ${item.action}`}>{item.action}</span>
                  </div>
                  <div className="history-meta">
                    <span>{formatTimestamp(item.timestamp)}</span>
                    {item.ip_address && <span>IP: {item.ip_address}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PrivacyDashboard;