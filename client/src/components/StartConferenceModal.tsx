import React, { useState } from 'react';
import SessionManager from '@/utils/sessionManager';

interface StartConferenceModalProps {
  classroomId: number;
  classroomTitle: string;
  onClose: () => void;
  onConferenceStarted: (conferenceData: any) => void;
}

const StartConferenceModal: React.FC<StartConferenceModalProps> = ({
  classroomId,
  classroomTitle,
  onClose,
  onConferenceStarted
}) => {
  const [loading, setLoading] = useState(false);
  const [maxParticipants, setMaxParticipants] = useState(50);

  const session = SessionManager.getSession();

  const startConference = async () => {
    setLoading(true);
    try {
      // Create conference
      const response = await fetch(`http://localhost:8001/api/classrooms/${classroomId}/conferences/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduled_start: new Date().toISOString(),
          max_participants: maxParticipants
        })
      });

      const result = await response.json();
      if (result.success) {
        // Start the conference
        const startResponse = await fetch(`http://localhost:8001/api/classrooms/conferences/${result.conference.id}/start/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (startResponse.ok) {
          onConferenceStarted({
            ...result.conference,
            status: 'live'
          });
          onClose();
        }
      }
    } catch (error) {
      console.error('Error starting conference:', error);
      alert('Failed to start conference. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h3>🎥 Start Live Class</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="conference-info">
            <p><strong>Classroom:</strong> {classroomTitle}</p>
            <p><strong>Host:</strong> {session?.name}</p>
            
            <div className="form-group">
              <label>Max Participants:</label>
              <input
                type="number"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
                min="2"
                max="100"
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            
            <div className="conference-features">
              <h4>Features Available:</h4>
              <ul>
                <li>✅ HD Video & Audio</li>
                <li>✅ Screen Sharing</li>
                <li>✅ Chat Messaging</li>
                <li>✅ Recording (Optional)</li>
                <li>✅ Participant Management</li>
              </ul>
            </div>
          </div>
          
          <div className="modal-actions">
            <button 
              className="btn-primary" 
              onClick={startConference}
              disabled={loading}
              style={{ width: '100%', padding: '12px' }}
            >
              {loading ? 'Starting...' : '🚀 Start Live Class'}
            </button>
            <button className="btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartConferenceModal;