import React, { useState, useEffect } from 'react';
import GrievanceForm from '../components/GrievanceForm';
import StudentLayout from '../components/StudentLayout';
import SessionManager from '../utils/sessionManager';

interface Grievance {
  id: number;
  case_id: string;
  grievance_type: string;
  priority: string;
  status: string;
  title: string;
  created_at: string;
  assigned_investigator?: number;
}

const GrievancePage: React.FC = () => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const session = SessionManager.getSession();
  const userId = session?.id;
  const userType = session?.role === 'teacher' ? 'teacher' : 'student';

  useEffect(() => {
    if (userId) {
      fetchGrievances();
    }
  }, []);

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      let url = `/api/collaboration/grievances/?user_id=${userId}&user_type=${userType}`;
      let res = await fetch(url);
      
      if (!res.ok || res.headers.get('content-type')?.includes('text/html')) {
        url = `http://localhost:8001/api/collaboration/grievances/?user_id=${userId}&user_type=${userType}`;
        res = await fetch(url);
      }
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setGrievances(data.cases || []);
    } catch (error) {
      console.error('Error fetching grievances:', error);
      setGrievances([]);
    } finally {
      setLoading(false);
    }
  };

  const viewGrievance = async (caseId: string) => {
    try {
      let res = await fetch(`/api/collaboration/grievances/${caseId}/`);
      
      if (!res.ok || res.headers.get('content-type')?.includes('text/html')) {
        res = await fetch(`http://localhost:8001/api/collaboration/grievances/${caseId}/`);
      }
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setSelectedGrievance(data.case);
    } catch (error) {
      console.error('Error fetching case details:', error);
    }
  };

  const deleteGrievance = async (caseId: string) => {
    try {
      let response = await fetch(`/api/collaboration/grievances/${caseId}/delete/`, {
        method: 'DELETE'
      });
      
      if (!response.ok || response.headers.get('content-type')?.includes('text/html')) {
        response = await fetch(`http://localhost:8001/api/collaboration/grievances/${caseId}/delete/`, {
          method: 'DELETE'
        });
      }
      
      if (response.ok) {
        fetchGrievances();
        alert('Grievance deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting grievance:', error);
    }
  };

  const handleGrievanceSubmit = (result: any) => {
    alert(`Grievance submitted successfully! Case ID: ${result.case_id}`);
    setShowForm(false);
    fetchGrievances();
  };

  return (
    <StudentLayout>
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', paddingTop: '100px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>Grievance Management</h1>
          <button 
            onClick={() => setShowForm(true)} 
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              boxShadow: '0 4px 6px rgba(220, 38, 38, 0.2)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
          >
            + Submit Grievance
          </button>
        </div>

        {showForm && (
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>Submit New Grievance</h2>
              <button 
                onClick={() => setShowForm(false)} 
                style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
              >
                ×
              </button>
            </div>
            <GrievanceForm 
              userId={userId} 
              userType={userType} 
              onSubmit={handleGrievanceSubmit}
            />
          </div>
        )}

        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase' }}>Case ID</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase' }}>Title</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase' }}>Type</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase' }}>Priority</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase' }}>Created</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                    Loading...
                  </td>
                </tr>
              ) : grievances.length > 0 ? grievances.map((g) => (
                <tr key={g.id} style={{ borderTop: '1px solid #e5e7eb', cursor: 'pointer' }}>
                  <td style={{ padding: '1rem 1.5rem', color: '#dc2626', fontWeight: '500' }} onClick={() => viewGrievance(g.case_id)}>{g.case_id}</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#1f2937' }} onClick={() => viewGrievance(g.case_id)}>{g.title}</td>
                  <td style={{ padding: '1rem 1.5rem' }} onClick={() => viewGrievance(g.case_id)}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      backgroundColor: '#fef3c7',
                      color: '#92400e'
                    }}>
                      {g.grievance_type.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }} onClick={() => viewGrievance(g.case_id)}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      backgroundColor: g.priority === 'high' ? '#fecaca' : g.priority === 'critical' ? '#fee2e2' : '#dbeafe',
                      color: g.priority === 'high' ? '#991b1b' : g.priority === 'critical' ? '#7f1d1d' : '#1e40af'
                    }}>
                      {g.priority.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }} onClick={() => viewGrievance(g.case_id)}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      backgroundColor: g.status === 'submitted' ? '#dbeafe' : g.status === 'resolved' ? '#d1fae5' : g.status === 'under_investigation' ? '#fed7aa' : '#fef3c7',
                      color: g.status === 'submitted' ? '#1e40af' : g.status === 'resolved' ? '#065f46' : g.status === 'under_investigation' ? '#9a3412' : '#92400e'
                    }}>
                      {g.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#6b7280' }} onClick={() => viewGrievance(g.case_id)}>{g.created_at}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this grievance?')) {
                          deleteGrievance(g.case_id);
                        }
                      }}
                      style={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.375rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                    No grievances yet. Submit your first grievance!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Grievance Detail Modal */}
        {selectedGrievance && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedGrievance(null)}>
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', maxWidth: '800px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>{selectedGrievance.title}</h2>
                <button onClick={() => setSelectedGrievance(null)} style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Case ID</div>
                  <div style={{ fontWeight: '500' }}>{selectedGrievance.case_id}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Type</div>
                  <div style={{ fontWeight: '500' }}>{selectedGrievance.grievance_type?.replace('_', ' ')}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Priority</div>
                  <div style={{ fontWeight: '500' }}>{selectedGrievance.priority}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Status</div>
                  <div style={{ fontWeight: '500' }}>{selectedGrievance.status?.replace('_', ' ')}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Created</div>
                  <div style={{ fontWeight: '500' }}>{selectedGrievance.created_at}</div>
                </div>
                {selectedGrievance.assigned_investigator && (
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Investigator</div>
                    <div style={{ fontWeight: '500' }}>Admin #{selectedGrievance.assigned_investigator}</div>
                  </div>
                )}
              </div>
              
              <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Description</div>
                <div>{selectedGrievance.description}</div>
              </div>
              
              {selectedGrievance.investigation_notes && (
                <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem', borderLeft: '3px solid #3b82f6' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1e40af' }}>Investigation Notes</div>
                  <div>{selectedGrievance.investigation_notes}</div>
                </div>
              )}
              
              {selectedGrievance.resolution_summary && (
                <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', borderLeft: '3px solid #22c55e' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#16a34a' }}>Resolution</div>
                  <div>{selectedGrievance.resolution_summary}</div>
                </div>
              )}
              
              {selectedGrievance.evidence && selectedGrievance.evidence.length > 0 && (
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Evidence ({selectedGrievance.evidence.length})</h3>
                  {selectedGrievance.evidence.map((evidence: any) => (
                    <div key={evidence.id} style={{ marginBottom: '0.5rem', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>📎</span>
                        <a href={`http://localhost:8001/media/${evidence.file_path}`} target="_blank" rel="noopener noreferrer" 
                           style={{ color: '#dc2626', textDecoration: 'underline', fontWeight: '500' }}>
                          {evidence.file_name}
                        </a>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>Uploaded: {evidence.uploaded_at}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedGrievance.timeline && selectedGrievance.timeline.length > 0 && (
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                  <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Investigation Timeline</h3>
                  {selectedGrievance.timeline.map((entry: any) => (
                    <div key={entry.id} style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: entry.performed_by_type === 'admin' ? '#eff6ff' : '#f9fafb', borderRadius: '0.5rem', borderLeft: entry.performed_by_type === 'admin' ? '3px solid #dc2626' : '3px solid #6b7280' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: '600', color: entry.performed_by_type === 'admin' ? '#dc2626' : '#374151', marginBottom: '0.5rem' }}>
                        {entry.action.replace('_', ' ').toUpperCase()}
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}>{entry.description}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        By {entry.performed_by_type} #{entry.performed_by} • {entry.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default GrievancePage;