import React, { useState } from 'react';
import SessionManager from '@/utils/sessionManager';

interface JoinClassroomModalProps {
  onClose: () => void;
  onJoinSuccess: () => void;
}

const JoinClassroomModal: React.FC<JoinClassroomModalProps> = ({ onClose, onJoinSuccess }) => {
  const [classroomCode, setClassroomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const session = SessionManager.getSession();

  const joinClassroom = async () => {
    if (!classroomCode.trim()) {
      setError('Please enter a classroom code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8001/api/classrooms/join/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classroom_code: classroomCode.toUpperCase(),
          student_id: session?.id
        })
      });

      const result = await response.json();
      
      if (result.success) {
        if (result.joined) {
          alert('Successfully joined the classroom!');
        } else {
          alert('You are already enrolled in this classroom.');
        }
        onJoinSuccess();
        onClose();
      } else {
        setError(result.error || 'Failed to join classroom');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h3>🏫 Join Virtual Classroom</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="join-form">
            <p>Enter the classroom code provided by your teacher:</p>
            <input
              type="text"
              placeholder="Enter 8-character code"
              value={classroomCode}
              onChange={(e) => setClassroomCode(e.target.value.toUpperCase())}
              maxLength={8}
              style={{ textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center' }}
            />
            {error && <p className="error-message">{error}</p>}
            
            <div className="modal-actions">
              <button 
                className="btn-primary" 
                onClick={joinClassroom}
                disabled={loading}
              >
                {loading ? 'Joining...' : 'Join Classroom'}
              </button>
              <button className="btn-secondary" onClick={onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinClassroomModal;