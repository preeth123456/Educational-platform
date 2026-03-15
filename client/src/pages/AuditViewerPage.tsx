import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';

interface AuditEvent {
  source: string;
  actor_id: number;
  actor_type: string;
  event_type: string;
  target_type: string;
  target_id?: string;
  metadata?: any;
  ip_address: string;
  timestamp: string;
}

const AuditViewerPage: React.FC = () => {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<AuditEvent[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, admin: 0, login: 0, dataAccess: 0 });

  useEffect(() => {
    fetchAuditEvents();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [events, filter]);

  const fetchAuditEvents = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/audit/forensic/timeline/?limit=50');
      const result = await response.json();
      
      if (result.status === 'success') {
        setEvents(result.data.timeline);
        calculateStats(result.data.timeline);
      }
    } catch (error) {
      console.error('Error fetching audit events:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (eventList: AuditEvent[]) => {
    const total = eventList.length;
    const admin = eventList.filter(e => e.source === 'admin_action').length;
    const login = eventList.filter(e => e.event_type === 'login').length;
    const dataAccess = eventList.filter(e => 
      e.source === 'data_access' || 
      e.event_type.includes('export') ||
      e.event_type.includes('api_student_data') ||
      e.event_type.includes('api_student_grades')
    ).length;
    setStats({ total, admin, login, dataAccess });
  };

  const applyFilter = () => {
    let filtered = events;
    
    switch (filter) {
      case 'login':
        filtered = events.filter(e => e.event_type === 'login' || e.event_type.includes('logout'));
        break;
      case 'data':
        filtered = events.filter(e => 
          e.source === 'data_access' || 
          e.event_type.includes('export') ||
          e.event_type.includes('api_student_data') ||
          e.event_type.includes('api_student_grades')
        );
        break;
      case 'admin':
        filtered = events.filter(e => e.source === 'admin_action' || e.actor_type === 'admin');
        break;
      default:
        filtered = events;
    }
    
    setFilteredEvents(filtered);
  };

  const getEventIcon = (event: AuditEvent) => {
    if (event.event_type === 'login') return '🔐';
    if (event.source === 'admin_action') return '🛡️';
    if (event.event_type.includes('export')) return '📄';
    if (event.event_type.includes('policy')) return '⚙️';
    return '👁️';
  };

  const getRiskLevel = (event: AuditEvent) => {
    if (event.source === 'admin_action') return 'high-risk';
    if (event.event_type.includes('export')) return 'medium-risk';
    return 'low-risk';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <AdminLayout>
      <div style={{ paddingTop: '80px' }}>
        <div className="audit-viewer">
          <div className="audit-header">
            <h2 style={{ 
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent', 
              fontWeight: '700',
              fontSize: '28px',
              margin: 0
            }}>🔍 Activity Audit Trail</h2>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  fontWeight: '500',
                  background: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Activities</option>
                <option value="login">Login/Logout</option>
                <option value="data">Data Access</option>
                <option value="admin">Admin Actions</option>
              </select>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
                }}
              >
                🔄 Refresh Logs
              </button>
            </div>
          </div>

          <div className="audit-stats" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: '16px', 
            margin: '24px 0' 
          }}>
            <div className="stat-card" style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '20px', 
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              transition: 'transform 0.3s ease'
            }}>
              <span className="stat-number" style={{ 
                fontSize: '28px', 
                fontWeight: '700', 
                display: 'block',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {loading ? '...' : filteredEvents.length}
              </span>
              <span className="stat-label" style={{ 
                fontSize: '12px', 
                opacity: 0.9,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: '500'
              }}>Filtered Events</span>
            </div>
            <div className="stat-card" style={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              padding: '20px', 
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)',
              transition: 'transform 0.3s ease'
            }}>
              <span className="stat-number" style={{ 
                fontSize: '28px', 
                fontWeight: '700', 
                display: 'block',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {stats.admin}
              </span>
              <span className="stat-label" style={{ 
                fontSize: '12px', 
                opacity: 0.9,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: '500'
              }}>Admin Actions</span>
            </div>
            <div className="stat-card" style={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              padding: '20px', 
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(240, 147, 251, 0.3)',
              transition: 'transform 0.3s ease'
            }}>
              <span className="stat-number" style={{ 
                fontSize: '28px', 
                fontWeight: '700', 
                display: 'block',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {stats.login}
              </span>
              <span className="stat-label" style={{ 
                fontSize: '12px', 
                opacity: 0.9,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: '500'
              }}>Login Events</span>
            </div>
            <div className="stat-card" style={{ 
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
              padding: '20px', 
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(67, 233, 123, 0.3)',
              transition: 'transform 0.3s ease'
            }}>
              <span className="stat-number" style={{ 
                fontSize: '28px', 
                fontWeight: '700', 
                display: 'block',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {stats.dataAccess}
              </span>
              <span className="stat-label" style={{ 
                fontSize: '12px', 
                opacity: 0.9,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: '500'
              }}>Data Access</span>
            </div>
          </div>

          <div className="audit-timeline">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>Loading events...</div>
            ) : filteredEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                No events found for selected filter
              </div>
            ) : (
              filteredEvents.map((event, index) => (
                <div key={index} className={`audit-event ${getRiskLevel(event)}`} style={{
                  display: 'flex',
                  padding: '15px',
                  margin: '10px 0',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  backgroundColor: '#fff'
                }}>
                  <div className="event-icon" style={{ fontSize: '24px', marginRight: '15px' }}>
                    {getEventIcon(event)}
                  </div>
                  <div className="event-details" style={{ flex: 1 }}>
                    <div className="event-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className="event-action" style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                        {event.event_type}
                      </span>
                      <span className="event-time" style={{ color: '#666', fontSize: '14px' }}>
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </div>
                    <div className="event-info" style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#666' }}>
                      <span className="actor-info">
                        {event.actor_type.toUpperCase()} ID: {event.actor_id}
                      </span>
                      <span className="target-info">
                        Target: {event.target_type}{event.target_id ? ` (${event.target_id})` : ''}
                      </span>
                      <span className="ip-info">
                        IP: {event.ip_address}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AuditViewerPage;