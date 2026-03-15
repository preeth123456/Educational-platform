import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

const GrievanceDashboard = ({ adminId }) => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusForm, setStatusForm] = useState({ status: '', notes: '' });

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    setLoading(true);
    try {
      let response = await fetch('http://localhost:8001/api/collaboration/grievances/?user_type=admin');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched grievance cases:', data.cases);
      setCases(data.cases || []);
    } catch (error) {
      console.error('Error fetching cases:', error);
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCaseDetails = async (caseId) => {
    try {
      let response = await fetch(`/api/collaboration/grievances/${caseId}/`);
      
      if (!response.ok || response.headers.get('content-type')?.includes('text/html')) {
        response = await fetch(`http://localhost:8001/api/collaboration/grievances/${caseId}/`);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSelectedCase(data.case);
    } catch (error) {
      console.error('Error fetching case details:', error);
    }
  };

  const assignInvestigator = async (caseId) => {
    try {
      let response = await fetch('/api/collaboration/grievances/assign/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_id: caseId,
          investigator_id: adminId,
          admin_id: adminId
        })
      });
      
      if (!response.ok || response.headers.get('content-type')?.includes('text/html')) {
        response = await fetch('http://localhost:8001/api/collaboration/grievances/assign/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            case_id: caseId,
            investigator_id: adminId,
            admin_id: adminId
          })
        });
      }
      
      if (response.ok) {
        fetchCases();
        fetchCaseDetails(selectedCase.case_id);
      }
    } catch (error) {
      console.error('Error assigning investigator:', error);
    }
  };

  const updateStatus = async () => {
    try {
      let res = await fetch('/api/collaboration/grievances/status/update/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_id: selectedCase.case_id,
          status: statusForm.status,
          notes: statusForm.notes,
          admin_id: adminId
        })
      });

      if (!res.ok || res.headers.get('content-type')?.includes('text/html')) {
        res = await fetch('http://localhost:8001/api/collaboration/grievances/status/update/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            case_id: selectedCase.case_id,
            status: statusForm.status,
            notes: statusForm.notes,
            admin_id: adminId
          })
        });
      }

      if (res.ok) {
        alert('Status updated successfully');
        setShowStatusModal(false);
        setStatusForm({ status: '', notes: '' });
        fetchCases();
        fetchCaseDetails(selectedCase.case_id);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const resolveCase = async (caseId, resolutionSummary) => {
    try {
      let response = await fetch('/api/collaboration/grievances/resolve/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_id: caseId,
          resolution_summary: resolutionSummary,
          resolver_id: adminId
        })
      });
      
      if (!response.ok || response.headers.get('content-type')?.includes('text/html')) {
        response = await fetch('http://localhost:8001/api/collaboration/grievances/resolve/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            case_id: caseId,
            resolution_summary: resolutionSummary,
            resolver_id: adminId
          })
        });
      }
      
      if (response.ok) {
        fetchCases();
        fetchCaseDetails(selectedCase.case_id);
      }
    } catch (error) {
      console.error('Error resolving case:', error);
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', paddingTop: '100px' }}>
        {/* Hero Welcome Section */}
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '1rem', padding: '2rem', marginBottom: '2rem', color: 'white', boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#000000' }}>Grievance Management</h1>
              <p style={{ fontSize: '1rem', opacity: 0.9 }}>Manage and resolve formal disputes and grievances</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{cases.length}</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Total Cases</div>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ width: '35%', backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxHeight: '75vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>All Cases ({cases.length})</h2>
            {cases.length > 0 ? cases.map((case_) => (
              <div 
                key={case_.id} 
                onClick={() => fetchCaseDetails(case_.case_id)} 
                style={{ 
                  padding: '1rem', 
                  borderBottom: '1px solid #e5e7eb', 
                  cursor: 'pointer', 
                  backgroundColor: selectedCase?.case_id === case_.case_id ? '#f3f4f6' : 'transparent',
                  borderRadius: '0.5rem',
                  marginBottom: '0.5rem'
                }}
              >
                <div style={{ fontWeight: '600', color: '#6366f1', fontSize: '0.875rem' }}>{case_.case_id}</div>
                <div style={{ fontSize: '0.95rem', color: '#1f2937', marginTop: '0.5rem', fontWeight: '500' }}>{case_.title}</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', backgroundColor: case_.status === 'submitted' ? '#dbeafe' : case_.status === 'resolved' ? '#d1fae5' : case_.status === 'under_investigation' ? '#fed7aa' : '#fef3c7', color: case_.status === 'submitted' ? '#1e40af' : case_.status === 'resolved' ? '#065f46' : case_.status === 'under_investigation' ? '#ea580c' : '#92400e' }}>{case_.status.replace('_', ' ')}</span>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{case_.grievance_type?.replace('_', ' ')}</span>
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>No cases yet</div>
            )}
          </div>

          {selectedCase ? (
            <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '2px solid #e5e7eb' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>{selectedCase.title}</h2>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                  <span>Filed by: <strong style={{ color: '#6366f1' }}>{selectedCase.complainant_name || `${selectedCase.complainant_type} (ID: ${selectedCase.complainant_id})`}</strong></span>
                  <span>•</span>
                  <span>Type: <strong>{selectedCase.grievance_type?.replace('_', ' ')}</strong></span>
                  <span>•</span>
                  <span>Priority: <strong>{selectedCase.priority}</strong></span>
                </div>
                <p style={{ color: '#4b5563', marginBottom: '1rem' }}>{selectedCase.description}</p>
                {selectedCase.evidence && selectedCase.evidence.length > 0 && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Evidence:</div>
                    {selectedCase.evidence.map((evidence) => (
                      <a key={evidence.id} href={`http://localhost:8001/media/${evidence.file_path}`} target="_blank" style={{ display: 'block', color: '#6366f1', fontSize: '0.875rem', marginTop: '0.25rem' }}>{evidence.file_name}</a>
                    ))}
                  </div>
                )}
                <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '1rem' }}>Created: {selectedCase.created_at}</div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                <button 
                  onClick={() => {
                    setStatusForm({ status: selectedCase.status, notes: '' });
                    setShowStatusModal(true);
                  }} 
                  style={{ backgroundColor: '#dc2626', color: 'white', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}
                >
                  Update Status
                </button>
                {selectedCase.status === 'registered' && (
                  <button onClick={() => assignInvestigator(selectedCase.id)} style={{ backgroundColor: '#f59e0b', color: 'white', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}>Start Investigation</button>
                )}
                {selectedCase.status === 'under_investigation' && (
                  <button onClick={() => {
                    const summary = prompt('Enter resolution summary:');
                    if (summary) resolveCase(selectedCase.id, summary);
                  }} style={{ backgroundColor: '#10b981', color: 'white', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}>Resolve Case</button>
                )}
              </div>

              {selectedCase.investigation_notes && (
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '1.125rem' }}>Investigation Notes</h3>
                  <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.75rem', borderLeft: '3px solid #f59e0b' }}>
                    <div style={{ color: '#374151' }}>{selectedCase.investigation_notes}</div>
                  </div>
                </div>
              )}

              {selectedCase.resolution_summary && (
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
                  <h3 style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '1.125rem' }}>Resolution</h3>
                  <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.75rem', borderLeft: '3px solid #10b981' }}>
                    <div style={{ color: '#374151' }}>{selectedCase.resolution_summary}</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '1rem', padding: '3rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚖️</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Select a Case</h3>
                <p>Choose a grievance case from the list to view details</p>
              </div>
            </div>
          )}
        </div>

        {/* Status Update Modal */}
        {showStatusModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', maxWidth: '500px', width: '90%' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                Update Status - {selectedCase?.case_id}
              </h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Status</label>
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem'
                  }}
                >
                  <option value="submitted">Submitted</option>
                  <option value="under_investigation">Under Investigation</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Notes</label>
                <textarea
                  value={statusForm.notes}
                  onChange={(e) => setStatusForm({ ...statusForm, notes: e.target.value })}
                  placeholder="Add investigation notes or resolution details..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={updateStatus}
                  style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Update Status
                </button>
                <button
                  onClick={() => setShowStatusModal(false)}
                  style={{
                    backgroundColor: '#e5e7eb',
                    color: '#374151',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default GrievanceDashboard;