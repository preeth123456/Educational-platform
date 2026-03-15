import React, { useState, useEffect } from 'react';
import SessionManager from '../utils/sessionManager';
import StudentLayout from '../components/StudentLayout';

interface Ticket {
  id: number;
  ticket_id: string;
  category: string;
  priority: string;
  status: string;
  subject: string;
  created_at: string;
  responses_count: number;
}

const SupportTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [form, setForm] = useState({
    category: 'general',
    subject: '',
    description: '',
    file: null as File | null
  });

  const session = SessionManager.getSession();
  const userId = session?.id;
  const userType = session?.role === 'teacher' ? 'teacher' : 'student';

  useEffect(() => {
    if (userId) {
      fetchTickets();
    }
  }, []);

  const fetchTickets = async () => {
    try {
      // Try proxy first, fallback to direct URL
      let url = `/api/collaboration/support/tickets/?user_id=${userId}&user_type=${userType}`;
      let res = await fetch(url);
      
      // If proxy fails (returns HTML), try direct Django URL
      if (!res.ok || res.headers.get('content-type')?.includes('text/html')) {
        url = `http://localhost:8001/api/collaboration/support/tickets/?user_id=${userId}&user_type=${userType}`;
        res = await fetch(url);
      }
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setTickets([]);
    }
  };

  const viewTicket = async (ticketId: string) => {
    try {
      // Try proxy first, fallback to direct URL
      let res = await fetch(`/api/collaboration/support/tickets/${ticketId}/`);
      
      // If proxy fails (returns HTML), try direct Django URL
      if (!res.ok || res.headers.get('content-type')?.includes('text/html')) {
        res = await fetch(`http://localhost:8001/api/collaboration/support/tickets/${ticketId}/`);
      }
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setSelectedTicket(data.ticket);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
    }
  };

  const deleteTicket = async (ticketId) => {
    try {
      let response = await fetch(`/api/collaboration/support/tickets/${ticketId}/delete/`, {
        method: 'DELETE'
      });
      
      if (!response.ok || response.headers.get('content-type')?.includes('text/html')) {
        response = await fetch(`http://localhost:8001/api/collaboration/support/tickets/${ticketId}/delete/`, {
          method: 'DELETE'
        });
      }
      
      if (response.ok) {
        fetchTickets();
        alert('Ticket deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Creating ticket with:', { userId, userType, ...form });
      
      const formData = new FormData();
      formData.append('user_id', String(userId));
      formData.append('user_type', userType);
      formData.append('category', form.category);
      formData.append('subject', form.subject);
      formData.append('description', form.description);
      if (form.file) {
        formData.append('file', form.file);
      }
      
      // Try proxy first, fallback to direct URL
      let res = await fetch('/api/collaboration/support/tickets/create/', {
        method: 'POST',
        body: formData
      });
      
      // If proxy fails (returns HTML), try direct Django URL
      if (!res.ok || res.headers.get('content-type')?.includes('text/html')) {
        res = await fetch('http://localhost:8001/api/collaboration/support/tickets/create/', {
          method: 'POST',
          body: formData
        });
      }
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Create ticket response:', data);
      if (data.success) {
        alert('Ticket created successfully!');
        setShowForm(false);
        setForm({ category: 'general', subject: '', description: '', file: null });
        fetchTickets();
      } else {
        alert('Error: ' + (data.error || 'Failed to create ticket'));
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Error creating ticket');
    }
  };

  return (
    <StudentLayout>
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', paddingTop: '100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>Support Tickets</h1>
        <button 
          onClick={() => setShowForm(true)} 
          style={{
            backgroundColor: '#6366f1',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            boxShadow: '0 4px 6px rgba(99, 102, 241, 0.2)',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}
        >
          + Create Ticket
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>Create New Ticket</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Category</label>
              <select 
                value={form.category} 
                onChange={(e) => setForm({...form, category: e.target.value})} 
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              >
                <option value="technical">Technical Issue</option>
                <option value="course">Course Related</option>
                <option value="payment">Payment</option>
                <option value="account">Account</option>
                <option value="general">General</option>
              </select>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Subject</label>
              <input 
                type="text" 
                placeholder="Brief description of your issue" 
                value={form.subject} 
                onChange={(e) => setForm({...form, subject: e.target.value})} 
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
                required 
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Description</label>
              <textarea 
                placeholder="Provide detailed information about your issue" 
                value={form.description} 
                onChange={(e) => setForm({...form, description: e.target.value})} 
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  minHeight: '120px',
                  resize: 'vertical'
                }}
                rows={4} 
                required 
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Attachment (Optional)</label>
              <input 
                type="file" 
                onChange={(e) => setForm({...form, file: e.target.files?.[0] || null})} 
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                type="submit" 
                style={{
                  backgroundColor: '#6366f1',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                Submit Ticket
              </button>
              <button 
                type="button" 
                onClick={() => setShowForm(false)} 
                style={{
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
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
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase' }}>Ticket ID</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase' }}>Subject</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase' }}>Category</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase' }}>Created</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length > 0 ? tickets.map((t) => (
              <tr key={t.id} style={{ borderTop: '1px solid #e5e7eb', cursor: 'pointer' }}>
                <td style={{ padding: '1rem 1.5rem', color: '#6366f1', fontWeight: '500' }} onClick={() => viewTicket(t.ticket_id)}>{t.ticket_id}</td>
                <td style={{ padding: '1rem 1.5rem', color: '#1f2937' }} onClick={() => viewTicket(t.ticket_id)}>{t.subject}</td>
                <td style={{ padding: '1rem 1.5rem' }} onClick={() => viewTicket(t.ticket_id)}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    backgroundColor: '#dbeafe',
                    color: '#1e40af'
                  }}>
                    {t.category}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem' }} onClick={() => viewTicket(t.ticket_id)}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    backgroundColor: t.status === 'open' ? '#dbeafe' : t.status === 'resolved' ? '#d1fae5' : '#fef3c7',
                    color: t.status === 'open' ? '#1e40af' : t.status === 'resolved' ? '#065f46' : '#92400e'
                  }}>
                    {t.status}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', color: '#6b7280' }} onClick={() => viewTicket(t.ticket_id)}>{t.created_at}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to delete this ticket?')) {
                        deleteTicket(t.ticket_id);
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
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                  No tickets yet. Create your first support ticket!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedTicket(null)}>
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>{selectedTicket.subject}</h2>
              <button onClick={() => setSelectedTicket(null)} style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <div>{selectedTicket.description}</div>
              {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Attachments:</div>
                  {selectedTicket.attachments.map((att: any) => (
                    <a key={att.id} href={att.file_path} target="_blank" style={{ display: 'block', color: '#6366f1', textDecoration: 'underline', marginTop: '0.25rem' }}>{att.file_name}</a>
                  ))}
                </div>
              )}
            </div>
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Responses</h3>
              {selectedTicket.responses.length > 0 ? selectedTicket.responses.map((r: any) => (
                <div key={r.id} style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: r.responder_type === 'admin' ? '#eff6ff' : '#f9fafb', borderRadius: '0.5rem', borderLeft: r.responder_type === 'admin' ? '3px solid #6366f1' : 'none' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6366f1', marginBottom: '0.5rem' }}>{r.responder_type}</div>
                  <div>{r.message}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>{r.created_at}</div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>No responses yet</div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </StudentLayout>
  );
};

export default SupportTickets;
