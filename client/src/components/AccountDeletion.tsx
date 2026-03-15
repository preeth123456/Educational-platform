import React, { useState, useEffect } from 'react';
import { FaTrash, FaExclamationTriangle, FaUndo, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';

interface AccountDeletionProps {
  studentId: number;
  onMessage: (message: string) => void;
}

interface DeletionStatus {
  has_pending_deletion: boolean;
  deletion_status?: 'pending' | 'processing';
  scheduled_date?: string;
  requested_at?: string;
}

const AccountDeletion: React.FC<AccountDeletionProps> = ({ studentId, onMessage }) => {
  const [loading, setLoading] = useState(false);
  const [deletionStatus, setDeletionStatus] = useState<DeletionStatus | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reason, setReason] = useState('');
  const [confirmText, setConfirmText] = useState('');

  useEffect(() => {
    loadDeletionStatus();
  }, [studentId]);

  const loadDeletionStatus = async () => {
    try {
      const response = await fetch(`http://localhost:8001/api/auth/deletion_status/?student_id=${studentId}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setDeletionStatus(data);
      }
    } catch (error) {
      console.error('Error loading deletion status:', error);
    }
  };

  const requestDeletion = async () => {
    if (confirmText !== 'DELETE MY ACCOUNT') {
      onMessage('Please type "DELETE MY ACCOUNT" to confirm');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8001/api/auth/request_deletion/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentId,
          reason: reason
        }),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        onMessage('Account deletion requested. You have 30 days to cancel this request.');
        setShowConfirmation(false);
        setReason('');
        setConfirmText('');
        loadDeletionStatus();
      } else {
        onMessage('Error requesting account deletion: ' + data.message);
      }
    } catch (error) {
      onMessage('Error requesting account deletion');
    }
    setLoading(false);
  };

  const cancelDeletion = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8001/api/auth/cancel_deletion/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentId
        }),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        onMessage('Account deletion request cancelled successfully.');
        loadDeletionStatus();
      } else {
        onMessage('Error cancelling deletion request: ' + data.message);
      }
    } catch (error) {
      onMessage('Error cancelling deletion request');
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysRemaining = (scheduledDate: string) => {
    const now = new Date();
    const scheduled = new Date(scheduledDate);
    const diffTime = scheduled.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (deletionStatus?.has_pending_deletion) {
    const daysRemaining = deletionStatus.scheduled_date ? getDaysRemaining(deletionStatus.scheduled_date) : 0;
    
    return (
      <div className="account-deletion-section">
        <div className="section-header">
          <h2>Account Deletion</h2>
          <p>Manage your account deletion request</p>
        </div>

        <div className="deletion-pending">
          <div className="warning-header">
            <FaExclamationTriangle className="warning-icon" />
            <h3>Account Deletion Scheduled</h3>
          </div>

          <div className="deletion-info">
            <div className="info-box">
              <div className="info-content">
                <div className="info-row">
                  <FaCalendarAlt className="info-icon" />
                  <strong>Scheduled for:</strong>
                  <span className="scheduled-date">{deletionStatus.scheduled_date ? formatDate(deletionStatus.scheduled_date) : 'Unknown'}</span>
                </div>
                <div className="info-row">
                  <FaInfoCircle className="info-icon" />
                  <strong>Days remaining:</strong>
                  <span className={`days-remaining ${daysRemaining <= 7 ? 'urgent' : ''}`}>{daysRemaining} days</span>
                </div>
              </div>
            </div>
          </div>

          {deletionStatus.deletion_status === 'pending' && (
            <div className="cancel-section">
              <p>
                You can cancel your account deletion request at any time before the scheduled date.
                After cancellation, you can continue using your account normally.
              </p>
              
              <button
                className="cancel-btn"
                onClick={cancelDeletion}
                disabled={loading}
              >
                <FaUndo />
                {loading ? 'Cancelling...' : 'Cancel Deletion Request'}
              </button>
            </div>
          )}

          {deletionStatus.deletion_status === 'processing' && (
            <div className="processing-notice">
              <p>
                Your account deletion is currently being processed. This cannot be cancelled.
                All your data will be permanently removed from our systems.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="account-deletion-section">
      <div className="section-header">
        <h2>Delete Account</h2>
        <p>Permanently delete your account and all associated data</p>
      </div>

      <div className="deletion-warning">
        <FaExclamationTriangle className="warning-icon" />
        <div className="warning-content">
          <h3>This action cannot be undone</h3>
          <p>
            Deleting your account will permanently remove all your data including:
          </p>
          <ul>
            <li>Profile information and personal data</li>
            <li>Course progress and learning history</li>
            <li>Quiz results and scores</li>
            <li>Badges and achievements</li>
            <li>All activity records</li>
          </ul>
        </div>
      </div>

      <div className="grace-period-info">
        <h3>30-Day Grace Period</h3>
        <p>
          After requesting deletion, you have 30 days to change your mind.
          During this period, your account will remain active and you can cancel the deletion request.
          After 30 days, your account and all data will be permanently deleted.
        </p>
      </div>

      {!showConfirmation ? (
        <button
          className="delete-request-btn"
          onClick={() => setShowConfirmation(true)}
        >
          <FaTrash />
          Request Account Deletion
        </button>
      ) : (
        <div className="confirmation-form">
          <h3>Confirm Account Deletion</h3>
          
          <div className="form-group">
            <label>Reason for deletion (optional)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Help us improve by telling us why you're leaving..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>
              Type <strong>"DELETE MY ACCOUNT"</strong> to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE MY ACCOUNT"
            />
          </div>

          <div className="confirmation-actions">
            <button
              className="cancel-btn"
              onClick={() => {
                setShowConfirmation(false);
                setReason('');
                setConfirmText('');
              }}
            >
              Cancel
            </button>
            
            <button
              className="confirm-delete-btn"
              onClick={requestDeletion}
              disabled={loading || confirmText !== 'DELETE MY ACCOUNT'}
            >
              <FaTrash />
              {loading ? 'Processing...' : 'Confirm Deletion'}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .account-deletion-section {
          background: linear-gradient(135deg, #fff5f5 0%, #ffebee 100%);
          color: #2c3e50;
          border-radius: 12px;
          padding: 24px;
          margin-top: 24px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          border: 1px solid #ffcdd2;
        }

        .section-header h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 600;
          color: #c62828;
        }

        .section-header p {
          margin: 0 0 24px 0;
          color: #546e7a;
        }

        .deletion-warning {
          background: rgba(255,255,255,0.7);
          border: 1px solid #ffab91;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
          display: flex;
          gap: 16px;
        }

        .warning-icon {
          font-size: 24px;
          flex-shrink: 0;
          margin-top: 4px;
          color: #d32f2f;
        }

        .warning-content h3 {
          margin: 0 0 12px 0;
          font-size: 18px;
          color: #c62828;
        }

        .warning-content p {
          margin: 0 0 12px 0;
          color: #424242;
        }

        .warning-content ul {
          margin: 0;
          padding-left: 20px;
        }

        .warning-content li {
          margin-bottom: 4px;
          color: #424242;
        }

        .grace-period-info {
          background: rgba(255,255,255,0.8);
          border: 1px solid #ffcdd2;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .grace-period-info h3 {
          margin: 0 0 12px 0;
          font-size: 18px;
          color: #2c3e50;
        }

        .grace-period-info p {
          margin: 0;
          color: #424242;
          line-height: 1.6;
        }

        .delete-request-btn {
          background: linear-gradient(45deg, #dc3545, #c82333);
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .delete-request-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(220,53,69,0.3);
        }

        .confirmation-form {
          background: rgba(255,255,255,0.8);
          border: 1px solid #ffcdd2;
          border-radius: 8px;
          padding: 24px;
        }

        .confirmation-form h3 {
          margin: 0 0 20px 0;
          font-size: 18px;
          color: #2c3e50;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #2c3e50;
        }

        .form-group textarea,
        .form-group input {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          background: rgba(255,255,255,0.9);
          color: #333;
        }

        .confirmation-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .cancel-btn {
          background: #6c757d;
          color: white;
          border: 1px solid #6c757d;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .cancel-btn:hover {
          background: #5a6268;
        }

        .confirm-delete-btn {
          background: linear-gradient(45deg, #dc3545, #c82333);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .confirm-delete-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(220,53,69,0.3);
        }

        .confirm-delete-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .deletion-pending {
          background: rgba(255,255,255,0.8);
          border: 1px solid #ffcdd2;
          border-radius: 8px;
          padding: 24px;
        }

        .warning-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .warning-header h3 {
          margin: 0;
          font-size: 18px;
          color: #2c3e50;
        }

        .deletion-info {
          margin-bottom: 24px;
        }

        .info-box {
          background: #ff4444;
          border: 2px solid #cc0000;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .info-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .info-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .info-icon {
          color: #ffffff;
          font-size: 18px;
          flex-shrink: 0;
        }

        .info-row strong {
          color: #ffffff;
          font-weight: 600;
          font-size: 16px;
          min-width: 140px;
        }

        .scheduled-date {
          color: #8a2be2 !important;
          font-weight: 700;
          font-size: 18px;
        }

        .days-remaining {
          color: #8a2be2 !important;
          font-weight: 700;
          font-size: 20px;
        }

        .urgent {
          color: #ff5722 !important;
          font-weight: 700;
          text-shadow: 0 0 4px rgba(255,87,34,0.3);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }

        .cancel-section {
          border-top: 1px solid #ffcdd2;
          padding-top: 20px;
        }

        .cancel-section p {
          margin: 0 0 16px 0;
          color: #424242;
        }

        .processing-notice {
          border-top: 1px solid #ffcdd2;
          padding-top: 20px;
        }

        .processing-notice p {
          margin: 0;
          font-weight: 500;
          color: #424242;
        }
      `}</style>
    </div>
  );
};

export default AccountDeletion;