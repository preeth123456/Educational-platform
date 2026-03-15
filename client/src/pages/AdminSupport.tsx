import React, { useState, useEffect } from 'react';
import SessionManager from '../utils/sessionManager';
import AdminLayout from '../components/AdminLayout';

const AdminSupport: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [response, setResponse] = useState('');

  const session = SessionManager.getSession();
  const adminId = session?.id;

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch('http://localhost:8001/api/collaboration/support/tickets/?user_type=admin');
      const data = await res.json();
      console.log('Fetched support tickets:', data.tickets);
      setTickets(data.tickets || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const viewTicket = async (ticketId: string) => {
    const res = await fetch(`http://localhost:8001/api/collaboration/support/tickets/${ticketId}/`);
    const data = await res.json();
    setSelected(data.ticket);
  };

  const sendResponse = async () => {
    await fetch('http://localhost:8001/api/collaboration/support/tickets/response/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticket_id: selected.id,
        responder_id: adminId,
        responder_type: 'admin',
        message: response
      })
    });
    setResponse('');
    viewTicket(selected.ticket_id);
  };

  const updateStatus = async (status: string) => {
    await fetch('http://localhost:8001/api/collaboration/support/tickets/status/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticket_id: selected.id, status })
    });
    fetchTickets();
    viewTicket(selected.ticket_id);
  };

  return (
    <AdminLayout>
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', paddingTop: '100px' }}>
        {/* Hero Welcome Section */}
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '1rem', padding: '2rem', marginBottom: '2rem', color: 'white', boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#000000' }}>Support Tickets Management</h1>
              <p style={{ fontSize: '1rem', opacity: 0.9 }}>Manage and respond to user support requests</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{tickets.length}</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Total Tickets</div>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ width: '35%', backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxHeight: '75vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>All Tickets ({tickets.length})</h2>
            {tickets.length > 0 ? tickets.map((t) => (
              <div 
                key={t.id} 
                onClick={() => viewTicket(t.ticket_id)} 
                style={{ 
                  padding: '1rem', 
                  borderBottom: '1px solid #e5e7eb', 
                  cursor: 'pointer', 
                  backgroundColor: selected?.ticket_id === t.ticket_id ? '#f3f4f6' : 'transparent',
                  borderRadius: '0.5rem',
                  marginBottom: '0.5rem'
                }}
              >
                <div style={{ fontWeight: '600', color: '#6366f1', fontSize: '0.875rem' }}>{t.ticket_id}</div>
                <div style={{ fontSize: '0.95rem', color: '#1f2937', marginTop: '0.5rem', fontWeight: '500' }}>{t.subject}</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', backgroundColor: t.status === 'open' ? '#dbeafe' : t.status === 'resolved' ? '#d1fae5' : t.status === 'escalated' ? '#fee2e2' : '#fef3c7', color: t.status === 'open' ? '#1e40af' : t.status === 'resolved' ? '#065f46' : t.status === 'escalated' ? '#dc2626' : '#92400e' }}>{t.status}</span>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{t.category}</span>
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>No tickets yet</div>
            )}
          </div>

          {selected ? (
            <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '2px solid #e5e7eb' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>{selected.subject}</h2>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                  <span>Raised by: <strong style={{ color: '#6366f1' }}>{selected.user_name || `${selected.user_type} (ID: ${selected.user_id})`}</strong></span>
                  <span>•</span>
                  <span>Category: <strong>{selected.category}</strong></span>
                  <span>•</span>
                  <span>Priority: <strong>{selected.priority}</strong></span>
                </div>
                <p style={{ color: '#4b5563', marginBottom: '1rem' }}>{selected.description}</p>
                {selected.attachments && selected.attachments.length > 0 && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Attachments:</div>
                    {selected.attachments.map((att: any) => (
                      <a key={att.id} href={`http://localhost:8001${att.file_path}`} target="_blank" style={{ display: 'block', color: '#6366f1', fontSize: '0.875rem', marginTop: '0.25rem' }}>{att.file_name}</a>
                    ))}
                  </div>
                )}
                <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '1rem' }}>Created: {selected.created_at}</div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                <button onClick={() => updateStatus('in_progress')} style={{ backgroundColor: '#fbbf24', color: 'white', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}>In Progress</button>
                <button onClick={() => updateStatus('resolved')} style={{ backgroundColor: '#10b981', color: 'white', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}>Resolved</button>
                <button onClick={() => updateStatus('escalated')} style={{ backgroundColor: '#ef4444', color: 'white', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}>Escalate</button>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '1.125rem' }}>Conversation</h3>
                {selected.responses.length > 0 ? selected.responses.map((r: any) => (
                  <div key={r.id} style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.75rem', borderLeft: '3px solid #6366f1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6366f1', textTransform: 'capitalize' }}>{r.responder_type}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{r.created_at}</div>
                    </div>
                    <div style={{ color: '#374151' }}>{r.message}</div>
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>No responses yet</div>
                )}
              </div>

              <div style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '0.75rem' }}>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600' }}>Add Response</label>
                <textarea value={response} onChange={(e) => setResponse(e.target.value)} placeholder="Type your response..." style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '0.5rem', padding: '0.75rem', minHeight: '100px', resize: 'vertical' }} />
                <button onClick={sendResponse} style={{ marginTop: '1rem', backgroundColor: '#6366f1', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '500' }}>Send Response</button>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '1rem', padding: '3rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Select a Ticket</h3>
                <p>Choose a ticket from the list to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSupport;
