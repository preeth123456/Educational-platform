import React, { useState } from 'react';
import { FaShieldAlt, FaInfoCircle } from 'react-icons/fa';

interface PrivacyNoticeProps {
  onAccept: (consents: ConsentSettings) => void;
  onDecline?: () => void;
  isRequired?: boolean;
}

interface ConsentSettings {
  data_collection: boolean;
  progress_sharing: boolean;
  achievement_visibility: boolean;
  parent_notifications: boolean;
  marketing_communications: boolean;
}

const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({ 
  onAccept, 
  onDecline, 
  isRequired = true 
}) => {
  const [consents, setConsents] = useState<ConsentSettings>({
    data_collection: false,
    progress_sharing: false,
    achievement_visibility: false,
    parent_notifications: true, // Default to true for safety
    marketing_communications: false,
  });
  const [showDetails, setShowDetails] = useState(false);

  const consentDescriptions = {
    data_collection: {
      title: 'Learning Analytics',
      description: 'We collect data about how you use the platform to provide personalized learning recommendations and improve our services.',
      required: false
    },
    progress_sharing: {
      title: 'Progress Sharing',
      description: 'Your learning progress and quiz results will be shared with your teachers to help them provide better guidance.',
      required: false
    },
    achievement_visibility: {
      title: 'Achievement Sharing',
      description: 'Your badges and achievements will be visible to other students in your class for motivation and healthy competition.',
      required: false
    },
    parent_notifications: {
      title: 'Parent Notifications',
      description: 'Important updates about your progress and achievements will be sent to your parents.',
      required: false
    },
    marketing_communications: {
      title: 'Marketing Communications',
      description: 'Receive emails about new courses, features, and educational opportunities that might interest you.',
      required: false
    }
  };

  const handleConsentChange = (consentType: keyof ConsentSettings, value: boolean) => {
    setConsents(prev => ({
      ...prev,
      [consentType]: value
    }));
  };

  const handleAccept = () => {
    onAccept(consents);
  };

  return (
    <div className="privacy-notice-overlay">
      <div className="privacy-notice-modal">
        <div className="privacy-header">
          <FaShieldAlt className="privacy-icon" />
          <h2>Privacy & Data Usage</h2>
        </div>

        <div className="privacy-content">
          <div className="privacy-intro">
            <p>
              Welcome to Eduyata! We respect your privacy and want to be transparent about how we use your data. 
              Please review and choose your privacy preferences below.
            </p>
          </div>

          <div className="essential-notice">
            <FaInfoCircle />
            <p>
              <strong>Essential Data:</strong> We collect basic account information (name, class, board) 
              and learning progress data necessary for the platform to function. This cannot be disabled.
            </p>
          </div>

          <div className="consent-section">
            <h3>Optional Data Usage</h3>
            <p>You can choose to allow or deny the following data uses:</p>

            <div className="consent-list">
              {Object.entries(consentDescriptions).map(([key, info]) => (
                <div key={key} className="consent-option">
                  <div className="consent-header">
                    <label className="consent-label">
                      <input
                        type="checkbox"
                        checked={consents[key as keyof ConsentSettings]}
                        onChange={(e) => handleConsentChange(key as keyof ConsentSettings, e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      <strong>{info.title}</strong>
                    </label>
                  </div>
                  <p className="consent-description">{info.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="privacy-details-toggle">
            <button 
              className="details-btn"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide' : 'Show'} Detailed Privacy Policy
            </button>
          </div>

          {showDetails && (
            <div className="privacy-details">
              <h4>Data Collection & Usage Details</h4>
              <ul>
                <li><strong>Account Data:</strong> Name, class, board, contact information for account management</li>
                <li><strong>Learning Data:</strong> Quiz scores, lesson progress, time spent on activities</li>
                <li><strong>Usage Data:</strong> Pages visited, features used, device information (if analytics enabled)</li>
                <li><strong>Communication Data:</strong> Messages with teachers, support interactions</li>
              </ul>
              
              <h4>Your Rights</h4>
              <ul>
                <li>You can change these preferences anytime in your Settings</li>
                <li>You can request to see all data we have about you</li>
                <li>You can request deletion of your account and data</li>
                <li>We will never sell your personal data to third parties</li>
              </ul>
            </div>
          )}
        </div>

        <div className="privacy-actions">
          <button 
            className="accept-btn primary"
            onClick={handleAccept}
          >
            Continue with Selected Preferences
          </button>
          
          {!isRequired && onDecline && (
            <button 
              className="decline-btn secondary"
              onClick={onDecline}
            >
              Decline & Exit
            </button>
          )}
        </div>

        <div className="privacy-footer">
          <p>
            By continuing, you agree to our Terms of Service and acknowledge our Privacy Policy. 
            You can modify these preferences anytime in your account settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyNotice;