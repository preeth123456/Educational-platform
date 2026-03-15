import React, { useState, useEffect } from 'react';
import SessionManager from '../utils/sessionManager';
import { TeacherSidebarDemo } from '../Teacher/components/TeacherSidebar';
import NewHeader from '../Teacher/components/NewHeader';
import { getAvatarUrl } from '../components/NewHeader';
import '../Dashboard.css';

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

interface Grievance {
  id: number;
  case_id: string;
  grievance_type: string;
  priority: string;
  status: string;
  title: string;
  created_at: string;
}

const TeacherSupportPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('help');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [selectedGrievance, setSelectedGrievance] = useState<any>(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [showGrievanceForm, setShowGrievanceForm] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    category: 'general',
    subject: '',
    description: '',
    file: null as File | null
  });
  const [grievanceForm, setGrievanceForm] = useState({
    grievance_type: 'academic',
    title: '',
    description: '',
    incident_date: '',
    evidence: [] as File[]
  });

  const session = SessionManager.getSession();
  const userId = session?.id;
  const userType = 'teacher';

  const helpCategories = [
    {
      title: "Technical Issues",
      description: "Platform problems, course upload issues, grading system",
      action: "Create Support Ticket",
      type: "ticket",
      icon: "🔧"
    },
    {
      title: "Course Management", 
      description: "Content creation, student management, assessment tools",
      action: "Create Support Ticket",
      type: "ticket",
      icon: "📚"
    },
    {
      title: "Payment & Billing",
      description: "Salary issues, payment delays, contract disputes",
      action: "Create Support Ticket", 
      type: "ticket",
      icon: "💳"
    },
    {
      title: "Workplace Issues",
      description: "Unfair treatment, discrimination, harassment by admin/students",
      action: "File Grievance",
      type: "grievance",
      icon: "⚖️"
    },
    {
      title: "Policy Disputes",
      description: "Contract violations, unfair policies, academic freedom",
      action: "File Grievance", 
      type: "grievance",
      icon: "🚨"
    }
  ];

  useEffect(() => {
    if (activeTab === 'ticket') fetchTickets();
    if (activeTab === 'grievance') fetchGrievances();
  }, [activeTab]);

  const fetchTickets = async () => {
    try {
      let url = `/api/collaboration/support/tickets/?user_id=${userId}&user_type=${userType}`;
      let res = await fetch(url);
      
      if (!res.ok || res.headers.get('content-type')?.includes('text/html')) {
        url = `http://localhost:8001/api/collaboration/support/tickets/?user_id=${userId}&user_type=${userType}`;
        res = await fetch(url);
      }
      
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const viewTicket = async (ticketId: string) => {
    try {
      let res = await fetch(`/api/collaboration/support/tickets/${ticketId}/`);
      
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

  const fetchGrievances = async () => {
    try {
      let url = `/api/collaboration/grievances/?user_id=${userId}&user_type=${userType}`;
      let res = await fetch(url);
      
      if (!res.ok || res.headers.get('content-type')?.includes('text/html')) {
        url = `http://localhost:8001/api/collaboration/grievances/?user_id=${userId}&user_type=${userType}`;
        res = await fetch(url);
      }
      
      const data = await res.json();
      setGrievances(data.cases || []);
    } catch (error) {
      console.error('Error fetching grievances:', error);
    }
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('user_id', String(userId));
      formData.append('user_type', userType);
      formData.append('category', ticketForm.category);
      formData.append('subject', ticketForm.subject);
      formData.append('description', ticketForm.description);
      if (ticketForm.file) formData.append('file', ticketForm.file);
      
      let res = await fetch('/api/collaboration/support/tickets/create/', {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok || res.headers.get('content-type')?.includes('text/html')) {
        res = await fetch('http://localhost:8001/api/collaboration/support/tickets/create/', {
          method: 'POST',
          body: formData
        });
      }
      
      if (res.ok) {
        alert('Ticket created successfully!');
        setShowTicketForm(false);
        setTicketForm({ category: 'general', subject: '', description: '', file: null });
        fetchTickets();
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const handleGrievanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('complainant_id', String(userId));
      formData.append('complainant_type', userType);
      formData.append('grievance_type', grievanceForm.grievance_type);
      formData.append('title', grievanceForm.title);
      formData.append('description', grievanceForm.description);
      if (grievanceForm.incident_date) formData.append('incident_date', grievanceForm.incident_date);
      
      grievanceForm.evidence.forEach(file => {
        formData.append('evidence', file);
      });
      
      let res = await fetch('/api/collaboration/grievances/submit/', {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok || res.headers.get('content-type')?.includes('text/html')) {
        res = await fetch('http://localhost:8001/api/collaboration/grievances/submit/', {
          method: 'POST',
          body: formData
        });
      }
      
      if (res.ok) {
        const data = await res.json();
        alert(`Grievance submitted successfully! Case ID: ${data.case_id}`);
        setShowGrievanceForm(false);
        setGrievanceForm({ grievance_type: 'academic', title: '', description: '', incident_date: '', evidence: [] });
        fetchGrievances();
      }
    } catch (error) {
      console.error('Error submitting grievance:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <TeacherSidebarDemo open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="dashboard-main" style={{ marginLeft: sidebarOpen ? "250px" : "60px" }}>
        <NewHeader
          avatar={getAvatarUrl('teacher')}
          name={session?.name || 'Teacher'}
          role="Teacher"
          searchPlaceholder="Search..."
        />
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>Teacher Support & Help Center</h1>
      </div>
      
      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('help')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500',
            backgroundColor: activeTab === 'help' ? '#6366f1' : '#e5e7eb',
            color: activeTab === 'help' ? 'white' : '#374151'
          }}
        >
          Get Help
        </button>
        <button
          onClick={() => setActiveTab('ticket')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500',
            backgroundColor: activeTab === 'ticket' ? '#6366f1' : '#e5e7eb',
            color: activeTab === 'ticket' ? 'white' : '#374151'
          }}
        >
          Support Tickets ({tickets.length})
        </button>
        <button
          onClick={() => setActiveTab('grievance')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500',
            backgroundColor: activeTab === 'grievance' ? '#dc2626' : '#e5e7eb',
            color: activeTab === 'grievance' ? 'white' : '#374151'
          }}
        >
          Grievances ({grievances.length})
        </button>
      </div>

      {/* Help Categories */}
      {activeTab === 'help' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {helpCategories.map((category, index) => (
            <div key={index} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ fontSize: '2rem' }}>{category.icon}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{category.title}</h3>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{category.description}</p>
                  <button
                    onClick={() => {
                      setActiveTab(category.type);
                      if (category.type === 'ticket') setShowTicketForm(true);
                      if (category.type === 'grievance') setShowGrievanceForm(true);
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '500',
                      backgroundColor: category.type === 'grievance' ? '#dc2626' : '#6366f1',
                      color: 'white'
                    }}
                  >
                    {category.action}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Support Tickets Tab */}
      {activeTab === 'ticket' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Support Tickets</h2>
            <button 
              onClick={() => setShowTicketForm(true)}
              style={{
                backgroundColor: '#6366f1',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              + Create Ticket
            </button>
          </div>

          {showTicketForm && (
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Create Support Ticket</h3>
              <form onSubmit={handleTicketSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Category</label>
                  <select 
                    value={ticketForm.category} 
                    onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
                  >
                    <option value="technical">Technical Issue</option>
                    <option value="course">Course Management</option>
                    <option value="payment">Payment</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Subject</label>
                  <input 
                    type="text" 
                    value={ticketForm.subject} 
                    onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
                    required 
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                  <textarea 
                    value={ticketForm.description} 
                    onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', minHeight: '100px' }}
                    required 
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Attachment (Optional)</label>
                  <input 
                    type="file" 
                    onChange={(e) => setTicketForm({...ticketForm, file: e.target.files?.[0] || null})}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" style={{ backgroundColor: '#6366f1', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>
                    Submit Ticket
                  </button>
                  <button type="button" onClick={() => setShowTicketForm(false)} style={{ backgroundColor: '#e5e7eb', color: '#374151', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Ticket ID</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Subject</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Category</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length > 0 ? tickets.map((t) => (
                  <tr key={t.id} style={{ borderTop: '1px solid #e5e7eb', cursor: 'pointer' }}>
                    <td style={{ padding: '1rem', color: '#6366f1', fontWeight: '500' }} onClick={() => viewTicket(t.ticket_id)}>{t.ticket_id}</td>
                    <td style={{ padding: '1rem' }} onClick={() => viewTicket(t.ticket_id)}>{t.subject}</td>
                    <td style={{ padding: '1rem' }} onClick={() => viewTicket(t.ticket_id)}>{t.category}</td>
                    <td style={{ padding: '1rem' }} onClick={() => viewTicket(t.ticket_id)}>{t.status}</td>
                    <td style={{ padding: '1rem', color: '#6b7280' }} onClick={() => viewTicket(t.ticket_id)}>{t.created_at}</td>
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
        </div>
      )}

      {/* Grievances Tab */}
      {activeTab === 'grievance' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Grievances</h2>
            <button 
              onClick={() => setShowGrievanceForm(true)}
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
              + File Grievance
            </button>
          </div>

          {showGrievanceForm && (
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>File Grievance</h3>
              <form onSubmit={handleGrievanceSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Type</label>
                  <select 
                    value={grievanceForm.grievance_type} 
                    onChange={(e) => setGrievanceForm({...grievanceForm, grievance_type: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
                  >
                    <option value="academic">Academic Issue</option>
                    <option value="harassment">Harassment</option>
                    <option value="discrimination">Discrimination</option>
                    <option value="unfair_treatment">Unfair Treatment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Title</label>
                  <input 
                    type="text" 
                    value={grievanceForm.title} 
                    onChange={(e) => setGrievanceForm({...grievanceForm, title: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
                    required 
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                  <textarea 
                    value={grievanceForm.description} 
                    onChange={(e) => setGrievanceForm({...grievanceForm, description: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', minHeight: '120px' }}
                    required 
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Incident Date (Optional)</label>
                  <input 
                    type="date" 
                    value={grievanceForm.incident_date} 
                    onChange={(e) => setGrievanceForm({...grievanceForm, incident_date: e.target.value})}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Evidence Files (Optional)</label>
                  <input 
                    type="file" 
                    multiple
                    onChange={(e) => setGrievanceForm({...grievanceForm, evidence: Array.from(e.target.files || [])})}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
                  />
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>You can select multiple files as evidence</div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" style={{ backgroundColor: '#dc2626', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>
                    Submit Grievance
                  </button>
                  <button type="button" onClick={() => setShowGrievanceForm(false)} style={{ backgroundColor: '#e5e7eb', color: '#374151', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Case ID</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Title</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Type</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {grievances.length > 0 ? grievances.map((g) => (
                  <tr key={g.id} style={{ borderTop: '1px solid #e5e7eb', cursor: 'pointer' }}>
                    <td style={{ padding: '1rem', color: '#dc2626', fontWeight: '500' }} onClick={() => viewGrievance(g.case_id)}>{g.case_id}</td>
                    <td style={{ padding: '1rem' }} onClick={() => viewGrievance(g.case_id)}>{g.title}</td>
                    <td style={{ padding: '1rem' }} onClick={() => viewGrievance(g.case_id)}>{g.grievance_type.replace('_', ' ')}</td>
                    <td style={{ padding: '1rem' }} onClick={() => viewGrievance(g.case_id)}>{g.status.replace('_', ' ')}</td>
                    <td style={{ padding: '1rem', color: '#6b7280' }} onClick={() => viewGrievance(g.case_id)}>{g.created_at}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                      No grievances yet. File your first grievance!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
                {selectedTicket.responses && selectedTicket.responses.length > 0 ? selectedTicket.responses.map((r: any) => (
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
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Status</div>
                  <div style={{ fontWeight: '500' }}>{selectedGrievance.status?.replace('_', ' ')}</div>
                </div>
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
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default TeacherSupportPage;