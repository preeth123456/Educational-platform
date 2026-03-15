import React, { useState, useEffect } from 'react';
import { FaTrash, FaEye, FaCheck, FaTimes, FaDownload, FaChartBar, FaCog } from 'react-icons/fa';

interface DeletionRequest {
  id: number;
  student_id: number;
  student_name: string;
  requested_at: string;
  scheduled_deletion_at: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  reason: string;
  processed_at?: string;
}

interface RetentionPolicy {
  id: number;
  data_type: string;
  retention_days: number;
  created_at: string;
}

interface RetentionStats {
  total_students: number;
  pending_deletions: number;
  anonymized_records: number;
}

const DataRetentionDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [deletionRequests, setDeletionRequests] = useState<DeletionRequest[]>([]);
  const [retentionPolicies, setRetentionPolicies] = useState<RetentionPolicy[]>([]);
  const [retentionStats, setRetentionStats] = useState<RetentionStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadDeletionRequests();
    loadRetentionPolicies();
    loadRetentionStats();
  }, []);

  const loadDeletionRequests = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/admin/deletion_requests/');
      const data = await response.json();
      
      if (data.status === 'success') {
        setDeletionRequests(data.data);
      }
    } catch (error) {
      console.error('Error loading deletion requests:', error);
    }
  };

  const loadRetentionPolicies = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/auth/retention_policies/');
      const data = await response.json();
      
      if (data.status === 'success') {
        setRetentionPolicies(data.data);
      }
    } catch (error) {
      console.error('Error loading retention policies:', error);
    }
  };

  const loadRetentionStats = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/auth/retention_stats/');
      const data = await response.json();
      
      if (data.status === 'success') {
        setRetentionStats(data.data);
      }
    } catch (error) {
      console.error('Error loading retention stats:', error);
    }
  };

  const processDeletion = async (deletionRequestId: number) => {
    if (!confirm('Are you sure you want to process this deletion request? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8001/api/admin/process_deletion/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deletion_request_id: deletionRequestId,
          processed_by: 1 // Admin ID - should come from session
        }),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setMessage('Account deletion started. This will be processed in the background.');
        loadDeletionRequests();
        loadRetentionStats();
      } else {
        setMessage('Error processing deletion: ' + data.message);
      }
    } catch (error) {
      setMessage('Error processing deletion');
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 5000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysUntilDeletion = (scheduledDate: string) => {
    const now = new Date();
    const scheduled = new Date(scheduledDate);
    const diffTime = scheduled.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'status-pending',
      processing: 'status-processing',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };

    return (
      <span className={`status-badge ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="data-retention-dashboard">
      <div className="dashboard-header">
        <h1>Data Retention & Deletion Management</h1>
        <p>Manage data retention policies and process deletion requests</p>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {retentionStats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FaEye />
            </div>
            <div className="stat-content">
              <h3>{retentionStats.total_students}</h3>
              <p>Total Students</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending">
              <FaTrash />
            </div>
            <div className="stat-content">
              <h3>{retentionStats.pending_deletions}</h3>
              <p>Pending Deletions</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed">
              <FaChartBar />
            </div>
            <div className="stat-content">
              <h3>{retentionStats.anonymized_records}</h3>
              <p>Anonymized Records</p>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          <FaTrash />
          Deletion Requests
        </button>
        <button
          className={`tab ${activeTab === 'policies' ? 'active' : ''}`}
          onClick={() => setActiveTab('policies')}
        >
          <FaCog />
          Retention Policies
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'requests' && (
          <div className="requests-section">
            <div className="section-header">
              <h2>Deletion Requests</h2>
              <button className="refresh-btn" onClick={loadDeletionRequests}>
                Refresh
              </button>
            </div>

            {deletionRequests.length === 0 ? (
              <div className="empty-state">
                <p>No deletion requests found.</p>
              </div>
            ) : (
              <div className="requests-table">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Requested</th>
                      <th>Scheduled</th>
                      <th>Days Left</th>
                      <th>Status</th>
                      <th>Reason</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deletionRequests.map((request) => (
                      <tr key={request.id}>
                        <td>
                          <div className="student-info">
                            <strong>{request.student_name}</strong>
                            <small>ID: {request.student_id}</small>
                          </div>
                        </td>
                        <td>{formatDate(request.requested_at)}</td>
                        <td>{formatDate(request.scheduled_deletion_at)}</td>
                        <td>
                          <span className={getDaysUntilDeletion(request.scheduled_deletion_at) <= 7 ? 'urgent' : ''}>
                            {getDaysUntilDeletion(request.scheduled_deletion_at)} days
                          </span>
                        </td>
                        <td>{getStatusBadge(request.status)}</td>
                        <td>
                          <div className="reason-cell">
                            {request.reason || 'No reason provided'}
                          </div>
                        </td>
                        <td>
                          <div className="actions">
                            {request.status === 'pending' && (
                              <button
                                className="process-btn"
                                onClick={() => processDeletion(request.id)}
                                disabled={loading}
                                title="Process deletion now"
                              >
                                <FaCheck />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'policies' && (
          <div className="policies-section">
            <div className="section-header">
              <h2>Data Retention Policies</h2>
              <button className="refresh-btn" onClick={loadRetentionPolicies}>
                Refresh
              </button>
            </div>

            <div className="policies-table">
              <table>
                <thead>
                  <tr>
                    <th>Data Type</th>
                    <th>Retention Period</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {retentionPolicies.map((policy) => (
                    <tr key={policy.id}>
                      <td>
                        <strong>{policy.data_type.replace('_', ' ').toUpperCase()}</strong>
                      </td>
                      <td>
                        {policy.retention_days} days
                        <small>({Math.round(policy.retention_days / 365 * 10) / 10} years)</small>
                      </td>
                      <td>{formatDate(policy.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="policy-info">
              <h3>Retention Policy Information</h3>
              <ul>
                <li><strong>Student Data:</strong> Core profile information retained for 7 years</li>
                <li><strong>Course Progress:</strong> Learning progress data retained for 5 years</li>
                <li><strong>Quiz Results:</strong> Assessment results retained for 3 years</li>
                <li><strong>Activity Logs:</strong> User activity data retained for 1 year</li>
                <li><strong>Session Data:</strong> Temporary session data retained for 3 months</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .data-retention-dashboard {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header h1 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .dashboard-header p {
          margin: 0 0 24px 0;
          color: #666;
        }

        .message {
          padding: 12px 16px;
          border-radius: 4px;
          margin-bottom: 24px;
        }

        .message.success {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
        }

        .message.error {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #007bff;
          color: white;
          font-size: 20px;
        }

        .stat-icon.pending {
          background: #ffc107;
        }

        .stat-icon.completed {
          background: #28a745;
        }

        .stat-content h3 {
          margin: 0 0 4px 0;
          font-size: 24px;
          color: #333;
        }

        .stat-content p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .dashboard-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 24px;
          border-bottom: 1px solid #ddd;
        }

        .tab {
          background: none;
          border: none;
          padding: 12px 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          border-bottom: 2px solid transparent;
        }

        .tab.active {
          color: #007bff;
          border-bottom-color: #007bff;
        }

        .tab:hover {
          color: #007bff;
        }

        .dashboard-content {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header h2 {
          margin: 0;
          color: #333;
        }

        .refresh-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .refresh-btn:hover {
          background: #0056b3;
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .requests-table,
        .policies-table {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        th {
          background: #f8f9fa;
          font-weight: 600;
          color: #333;
        }

        .student-info strong {
          display: block;
          color: #333;
        }

        .student-info small {
          color: #666;
        }

        .urgent {
          color: #dc3545;
          font-weight: 600;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-pending {
          background: #fff3cd;
          color: #856404;
        }

        .status-processing {
          background: #cce5ff;
          color: #004085;
        }

        .status-completed {
          background: #d4edda;
          color: #155724;
        }

        .status-cancelled {
          background: #f8d7da;
          color: #721c24;
        }

        .reason-cell {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .process-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 6px 8px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .process-btn:hover:not(:disabled) {
          background: #1e7e34;
        }

        .process-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .policy-info {
          margin-top: 32px;
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
        }

        .policy-info h3 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .policy-info ul {
          margin: 0;
          padding-left: 20px;
        }

        .policy-info li {
          margin-bottom: 8px;
          color: #666;
        }

        .policy-info strong {
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default DataRetentionDashboard;