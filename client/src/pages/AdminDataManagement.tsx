import React, { useState, useEffect } from 'react';
import { FaDownload, FaTrash, FaUsers, FaEye, FaCalendarAlt, FaSync } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';

interface ExportData {
  id: number;
  student_id: number;
  student_name: string;
  format: 'pdf';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  expires_at: string;
  export_count: number;
}

interface DeletionRequest {
  id: number;
  student_id: number;
  student_name: string;
  requested_at: string;
  scheduled_deletion_at: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  reason: string;
}

const AdminDataManagement: React.FC = () => {
  const [exports, setExports] = useState<ExportData[]>([]);
  const [deletions, setDeletions] = useState<DeletionRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadExports(), loadDeletions(), loadSystemStats()]);
    setLoading(false);
  };

  const loadExports = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/auth/admin/all_exports/');
      const data = await response.json();
      if (data.status === 'success') {
        setExports(data.data);
      }
    } catch (error) {
      console.error('Error loading exports:', error);
    }
  };

  const loadDeletions = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/auth/admin/deletion_requests/');
      const data = await response.json();
      if (data.status === 'success') {
        // Group by student_id and keep only the most recent request per student
        const groupedByStudent = data.data.reduce((acc: any, deletion: DeletionRequest) => {
          const studentId = deletion.student_id;
          if (!acc[studentId] || new Date(deletion.requested_at) > new Date(acc[studentId].requested_at)) {
            acc[studentId] = deletion;
          }
          return acc;
        }, {});
        
        // Convert back to array and sort by requested date (newest first)
        const uniqueDeletions = Object.values(groupedByStudent).sort((a: any, b: any) => 
          new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime()
        );
        
        setDeletions(uniqueDeletions as DeletionRequest[]);
      }
    } catch (error) {
      console.error('Error loading deletions:', error);
    }
  };

  const loadSystemStats = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/auth/retention_stats/');
      const data = await response.json();
      if (data.status === 'success') {
        // Stats loaded but we're using frontend calculations for now
        console.log('Backend stats:', data.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const deleteExport = async (exportId: number) => {
    if (!confirm('Delete this export?')) return;
    try {
      const response = await fetch(`http://localhost:8001/api/auth/delete_export/${exportId}/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMessage('Export deleted');
        loadExports();
      }
    } catch (error) {
      setMessage('Error deleting export');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const processDeletion = async (deletionId: number) => {
    if (!confirm('Process this deletion? This cannot be undone.')) return;
    try {
      const response = await fetch('http://localhost:8001/api/auth/admin/process_deletion/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deletion_request_id: deletionId, processed_by: 'admin' }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setMessage('Deletion processed');
        loadDeletions();
      }
    } catch (error) {
      setMessage('Error processing deletion');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysRemaining = (scheduledDate: string) => {
    const now = new Date();
    const scheduled = new Date(scheduledDate);
    const diffTime = scheduled.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return (
    <AdminLayout>
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Data Management</h1>
          <p style={{ color: '#6c757d' }}>Monitor student data exports and account deletions</p>
        </div>

        {message && (
          <div style={{
            padding: '12px',
            marginBottom: '20px',
            borderRadius: '6px',
            background: message.includes('Error') ? '#f8d7da' : '#d4edda',
            color: message.includes('Error') ? '#721c24' : '#155724',
            border: `1px solid ${message.includes('Error') ? '#f5c6cb' : '#c3e6cb'}`
          }}>
            {message}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ color: '#2c3e50' }}>📊 Quick Stats</h2>
          <button 
            onClick={loadData} 
            disabled={loading}
            style={{
              padding: '8px 16px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaSync className={loading ? 'spinning' : ''} />
            Refresh
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '30px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderLeft: '4px solid #007bff' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>{loading ? '...' : exports.length}</h3>
            <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>Total Exports</p>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderLeft: '4px solid #28a745' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>{loading ? '...' : exports.filter(e => e.status === 'completed').length}</h3>
            <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>Completed Exports</p>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderLeft: '4px solid #dc3545' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>{loading ? '...' : deletions.filter(d => d.status === 'pending' && getDaysRemaining(d.scheduled_deletion_at) > 0).length}</h3>
            <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>Waiting (Grace Period)</p>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderLeft: '4px solid #ffc107' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>{loading ? '...' : deletions.filter(d => d.status === 'pending' && getDaysRemaining(d.scheduled_deletion_at) <= 0).length}</h3>
            <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>Ready for Deletion</p>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderLeft: '4px solid #6c757d' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>{loading ? '...' : deletions.filter(d => d.status === 'completed').length}</h3>
            <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>Already Deleted</p>
          </div>
        </div>

        {/* Data Exports Section */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '20px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaDownload /> Data Exports
          </h2>
          
          {exports.length === 0 ? (
            <p style={{ color: '#6c757d', textAlign: 'center', padding: '20px' }}>No exports found</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Student</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Format</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Created</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Expires</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Total Exports</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {exports.slice(0, 10).map((exp) => (
                    <tr key={exp.id}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                        <div>
                          <strong>{exp.student_name}</strong>
                          <br />
                          <small style={{ color: '#6c757d' }}>ID: {exp.student_id}</small>
                        </div>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: '#e3f2fd',
                          color: '#1976d2'
                        }}>
                          PDF
                        </span>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: 'white',
                          background: exp.status === 'completed' ? '#28a745' : exp.status === 'failed' ? '#dc3545' : '#ffc107'
                        }}>
                          {exp.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{formatDate(exp.created_at)}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{formatDate(exp.expires_at)}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: '#e3f2fd',
                          color: '#1976d2'
                        }}>
                          {exp.export_count} times
                        </span>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                        <button
                          onClick={() => deleteExport(exp.id)}
                          style={{
                            padding: '6px 12px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Account Deletions Section */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaTrash /> Account Deletions
          </h2>
          
          {deletions.length === 0 ? (
            <p style={{ color: '#6c757d', textAlign: 'center', padding: '20px' }}>No deletion requests found</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Student</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Requested</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Scheduled</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Days Left</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deletions.slice(0, 10).map((del) => {
                    const daysRemaining = getDaysRemaining(del.scheduled_deletion_at);
                    return (
                      <tr key={del.id} style={{
                        background: daysRemaining <= 0 ? '#fff5f5' : daysRemaining <= 3 ? '#fff8e1' : 'white'
                      }}>
                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaUsers />
                            <div>
                              <strong>{del.student_name}</strong>
                              <br />
                              <small style={{ color: '#6c757d' }}>ID: {del.student_id}</small>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{formatDate(del.requested_at)}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FaCalendarAlt />
                            {formatDate(del.scheduled_deletion_at)}
                          </div>
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: daysRemaining <= 0 ? '#ffebee' : daysRemaining <= 3 ? '#fff3e0' : '#e8f5e8',
                            color: daysRemaining <= 0 ? '#c62828' : daysRemaining <= 3 ? '#ef6c00' : '#2e7d32'
                          }}>
                            {daysRemaining === 0 ? 'Today' : `${daysRemaining} days`}
                          </span>
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: 'white',
                            background: del.status === 'pending' ? '#ffc107' : del.status === 'completed' ? '#28a745' : '#6c757d'
                          }}>
                            {del.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                          {del.status === 'pending' && daysRemaining <= 0 && (
                            <button
                              onClick={() => processDeletion(del.id)}
                              style={{
                                padding: '6px 12px',
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              <FaTrash /> Process
                            </button>
                          )}
                          {del.status === 'cancelled' && (
                            <span style={{ color: '#6c757d', fontSize: '12px' }}>Cancelled by student</span>
                          )}
                          {del.status === 'completed' && (
                            <span style={{ color: '#28a745', fontSize: '12px' }}>✓ Completed</span>
                          )}
                          {del.status === 'pending' && daysRemaining > 0 && (
                            <span style={{ color: '#ffc107', fontSize: '12px' }}>Waiting ({daysRemaining} days)</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <style jsx>{`
          .spinning {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </AdminLayout>
  );
};

export default AdminDataManagement;