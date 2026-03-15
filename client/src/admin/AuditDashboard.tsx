// SECURITY CONFIG POLICIES FILE - Security policies management interface
import React, { useState, useEffect } from 'react';
import { 
  FaShieldAlt, FaUsers, FaExclamationTriangle, FaCheck, 
  FaFilter, FaDownload, FaSearch, FaEye, FaClock,
  FaChartLine, FaUserShield, FaDatabase, FaEdit, FaPlay, FaPause, FaPlus, FaUser
} from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import './AuditDashboard.css';

interface AuditLog {
  id: number;
  user_id: number;
  user_type: string;
  action: string;
  resource_type: string;
  resource_id: number | null;
  details: any;
  ip_address: string;
  user_agent: string;
  timestamp: string;
}

interface SecurityEvent {
  id: number;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id: number | null;
  description: string;
  metadata: any;
  ip_address: string;
  resolved: boolean;
  timestamp: string;
}

interface AuditSummary {
  activity_by_type: Record<string, number>;
  top_actions: Array<{ action: string; count: number }>;
  security_events: Record<string, number>;
  daily_activity: Array<{ date: string; count: number }>;
  unresolved_events: number;
}

const AuditDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [activePolicyTab, setActivePolicyTab] = useState('rules');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [evidenceList, setEvidenceList] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [complianceRules, setComplianceRules] = useState<any[]>([]);
  const [newRule, setNewRule] = useState({ name: '', description: '', severity: 'medium', category: 'security' });
  const [summary, setSummary] = useState<AuditSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    user_type: '',
    action: '',
    severity: '',
    start_date: '',
    end_date: '',
    resolved: ''
  });
  const [incidentFilters, setIncidentFilters] = useState({
    severity: '',
    status: ''
  });

  useEffect(() => {
    loadSummary();
    loadAuditLogs();
    loadSecurityEvents();
    loadEvidence();
    loadIncidents();
    loadComplianceRules();
  }, []);

  const loadSummary = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/admin/audit_summary/');
      const data = await response.json();
      if (data.status === 'success') {
        setSummary(data.data);
      }
    } catch (error) {
      console.error('Error loading audit summary:', error);
    }
  };

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await fetch(`http://localhost:8001/api/admin/audit_logs/?${params}`);
      const data = await response.json();
      if (data.status === 'success') {
        setAuditLogs(data.data.logs);
      }
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSecurityEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.severity) params.append('severity', filters.severity);
      if (filters.resolved) params.append('resolved', filters.resolved);
      
      const response = await fetch(`http://localhost:8001/api/admin/security_events/?${params}`);
      const data = await response.json();
      if (data.status === 'success') {
        setSecurityEvents(data.data.events);
      }
    } catch (error) {
      console.error('Error loading security events:', error);
    }
  };

  const resolveSecurityEvent = async (eventId: number) => {
    try {
      const response = await fetch('http://localhost:8001/api/admin/resolve_security_event/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId })
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        loadSecurityEvents();
        loadSummary();
      }
    } catch (error) {
      console.error('Error resolving security event:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    const sev = severity ? severity.toLowerCase() : 'medium';
    switch (sev) {
      case 'critical': return '#e74c3c';
      case 'high': return '#f39c12';
      case 'medium': return '#f1c40f';
      case 'low': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const loadEvidence = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/compliance/evidence/');
      const data = await response.json();
      if (data.status === 'success') {
        setEvidenceList(data.data.logs || []);
      }
    } catch (error) {
      console.error('Error loading evidence:', error);
      setEvidenceList([]);
    }
  };

  const loadIncidents = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/compliance/incidents/');
      const data = await response.json();
      setIncidents(data || []);
    } catch (error) {
      console.error('Error loading incidents:', error);
      setIncidents([]);
    }
  };

  const loadComplianceRules = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/compliance/rules-raw/');
      const data = await response.json();
      setComplianceRules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading compliance rules:', error);
      setComplianceRules([]);
    }
  };

  const getCategoryFromRule = (rule: any) => {
    const name = (rule.name || '').toLowerCase();
    const description = (rule.description || '').toLowerCase();
    
    if (name.includes('password') || description.includes('password')) {
      return 'Password';
    }
    if (name.includes('account') || name.includes('lockout') || description.includes('account') || description.includes('lockout')) {
      return 'Account';
    }
    if (name.includes('audit') || description.includes('audit')) {
      return 'Audit';
    }
    if (name.includes('access') || description.includes('access')) {
      return 'Access';
    }
    return 'Security';
  };

  const createComplianceRule = async () => {
    if (!newRule.name || !newRule.description) return;
    try {
      const response = await fetch('http://localhost:8001/api/compliance/rules-raw/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRule)
      });
      const data = await response.json();
      console.log('Create rule response:', data);
      if (data.id) {
        loadComplianceRules();
        setNewRule({ name: '', description: '', severity: 'medium', category: 'security' });
      }
    } catch (error) {
      console.error('Error creating rule:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="audit-dashboard" style={{ paddingTop: '100px' }}>
        <div className="dashboard-header">
          <h1>Audit & Security Dashboard</h1>
          <p>Monitor system activities and security events</p>
        </div>

        <div className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FaChartLine /> Overview
          </button>
          <button 
            className={`tab ${activeTab === 'health' ? 'active' : ''}`}
            onClick={() => setActiveTab('health')}
          >
            <FaClock /> System Health
          </button>
          <button 
            className={`tab ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            <FaDatabase /> Audit Logs
          </button>
          <button 
            className={`tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <FaShieldAlt /> Security Events
          </button>
          <button 
            className={`tab ${activeTab === 'policies' ? 'active' : ''}`}
            onClick={() => setActiveTab('policies')}
          >
            <FaUserShield /> Security Policies
          </button>
        </div>

        {activeTab === 'overview' && summary && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <FaUsers />
                </div>
                <div className="stat-content">
                  <h3>{Object.values(summary.activity_by_type).reduce((a, b) => a + b, 0)}</h3>
                  <p>Total Activities (7 days)</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon danger">
                  <FaExclamationTriangle />
                </div>
                <div className="stat-content">
                  <h3>{summary.unresolved_events}</h3>
                  <p>Unresolved Security Events</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon warning">
                  <FaShieldAlt />
                </div>
                <div className="stat-content">
                  <h3>{Object.values(summary.security_events).reduce((a, b) => a + b, 0)}</h3>
                  <p>Security Events (7 days)</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon success">
                  <FaUserShield />
                </div>
                <div className="stat-content">
                  <h3>{summary.activity_by_type.student || 0}</h3>
                  <p>Student Activities</p>
                </div>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-card">
                <h3>Activity by User Type</h3>
                <div className="activity-breakdown">
                  {Object.entries(summary.activity_by_type).map(([type, count]) => (
                    <div key={type} className="activity-item">
                      <span className="activity-type">{type}</span>
                      <span className="activity-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="chart-card">
                <h3>Top Actions</h3>
                <div className="top-actions">
                  {summary.top_actions.slice(0, 5).map((action, index) => (
                    <div key={index} className="action-item">
                      <span className="action-name">{action.action}</span>
                      <span className="action-count">{action.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="logs-section">
            <div className="filters-bar">
              <div className="filter-group">
                <select 
                  value={filters.user_type} 
                  onChange={(e) => setFilters({...filters, user_type: e.target.value})}
                >
                  <option value="">All User Types</option>
                  <option value="student">Students</option>
                  <option value="teacher">Teachers</option>
                  <option value="admin">Admins</option>
                </select>
                
                <input 
                  type="text" 
                  placeholder="Search action..." 
                  value={filters.action}
                  onChange={(e) => setFilters({...filters, action: e.target.value})}
                />
                
                <input 
                  type="date" 
                  value={filters.start_date}
                  onChange={(e) => setFilters({...filters, start_date: e.target.value})}
                />
                
                <input 
                  type="date" 
                  value={filters.end_date}
                  onChange={(e) => setFilters({...filters, end_date: e.target.value})}
                />
                
                <button onClick={loadAuditLogs} className="filter-btn">
                  <FaSearch /> Filter
                </button>
              </div>
            </div>

            <div className="logs-table">
              <table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Resource</th>
                    <th>IP Address</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{formatTimestamp(log.timestamp)}</td>
                      <td>
                        <span className={`user-badge ${log.user_type}`}>
                          {log.user_type} #{log.user_id}
                        </span>
                      </td>
                      <td>{log.action}</td>
                      <td>{log.resource_type}</td>
                      <td>{log.ip_address}</td>
                      <td>
                        {log.details?.status_code && (
                          <span className={`status ${log.details.status_code < 400 ? 'success' : 'error'}`}>
                            {log.details.status_code}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="security-section">
            <div className="filters-bar">
              <div className="filter-group">
                <select 
                  value={filters.severity} 
                  onChange={(e) => setFilters({...filters, severity: e.target.value})}
                >
                  <option value="">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                
                <select 
                  value={filters.resolved} 
                  onChange={(e) => setFilters({...filters, resolved: e.target.value})}
                >
                  <option value="">All Events</option>
                  <option value="false">Unresolved</option>
                  <option value="true">Resolved</option>
                </select>
                
                <button onClick={loadSecurityEvents} className="filter-btn">
                  <FaSearch /> Filter
                </button>
              </div>
            </div>

            <div className="security-events">
              {securityEvents.map((event) => (
                <div key={event.id} className={`security-event ${event.severity} ${event.resolved ? 'resolved' : ''}`}>
                  <div className="event-header">
                    <div className="event-info">
                      <span 
                        className="severity-badge" 
                        style={{ backgroundColor: getSeverityColor(event.severity) }}
                      >
                        {event.severity.toUpperCase()}
                      </span>
                      <span className="event-type">{event.event_type}</span>
                      <span className="event-time">{formatTimestamp(event.timestamp)}</span>
                    </div>
                    
                    {!event.resolved && (
                      <button 
                        onClick={() => resolveSecurityEvent(event.id)}
                        className="resolve-btn"
                      >
                        <FaCheck /> Resolve
                      </button>
                    )}
                  </div>
                  
                  <div className="event-description">
                    {event.description}
                  </div>
                  
                  <div className="event-details">
                    <span>IP: {event.ip_address}</span>
                    {event.user_id && <span>User ID: {event.user_id}</span>}
                    {event.resolved && <span className="resolved-badge">✓ Resolved</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'policies' && (
          <div className="policies-section">
            <div className="policies-header">
              <h2>Security Policies</h2>
              <p>Manage session and security policies</p>
            </div>
            
            <div className="policies-tabs">
              <button 
                className={`policy-tab ${activePolicyTab === 'rules' ? 'active' : ''}`}
                onClick={() => setActivePolicyTab('rules')}
              >
                <FaUserShield /> Security Rules
              </button>
              <button 
                className={`policy-tab ${activePolicyTab === 'evidence' ? 'active' : ''}`}
                onClick={() => setActivePolicyTab('evidence')}
              >
                <FaDatabase /> Evidence
              </button>
              <button 
                className={`policy-tab ${activePolicyTab === 'incident' ? 'active' : ''}`}
                onClick={() => setActivePolicyTab('incident')}
              >
                <FaExclamationTriangle /> Incident
              </button>
            </div>

            {activePolicyTab === 'rules' && (
              <div className="rules-section">
                <div className="rules-header">
                  <div className="header-content">
                    <h3><FaShieldAlt /> Security Rules</h3>
                    <p>Manage compliance and security rules for your platform</p>
                  </div>
                  <div className="rules-stats">
                    <div className="stat-item">
                      <span className="stat-number">{complianceRules.length}</span>
                      <span className="stat-label">Total Rules</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{complianceRules.filter(r => r.is_active).length}</span>
                      <span className="stat-label">Active</span>
                    </div>
                  </div>
                </div>
                
                <div className="create-rule-card">
                  <div className="card-header">
                    <h4><FaPlus /> Create New Rule</h4>
                  </div>
                  <div className="rule-form">
                    <div className="form-group">
                      <label>Rule Name</label>
                      <input 
                        type="text" 
                        placeholder="Enter rule name" 
                        value={newRule.name}
                        onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Severity</label>
                        <select 
                          value={newRule.severity}
                          onChange={(e) => setNewRule({...newRule, severity: e.target.value})}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Category</label>
                        <select 
                          value={newRule.category}
                          onChange={(e) => setNewRule({...newRule, category: e.target.value})}
                        >
                          <option value="security">Security</option>
                          <option value="password">Password</option>
                          <option value="access">Access</option>
                          <option value="audit">Audit</option>
                          <option value="compliance">Compliance</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea 
                        placeholder="Describe the rule and its purpose" 
                        value={newRule.description}
                        onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <button 
                      onClick={createComplianceRule} 
                      className="create-btn"
                      disabled={!newRule.name || !newRule.description}
                    >
                      <FaCheck /> Create Rule
                    </button>
                  </div>
                </div>
                
                <div className="rules-grid">
                  {complianceRules.length === 0 ? (
                    <div className="empty-state">
                      <FaShieldAlt size={48} />
                      <h4>No Security Rules</h4>
                      <p>Create your first security rule to start managing compliance</p>
                    </div>
                  ) : (
                    complianceRules.map((rule, index) => (
                      <div key={rule.id || index} className={`rule-card modern ${rule.is_active ? 'active' : 'inactive'}`}>
                        <div className="rule-card-header">
                          <div className="rule-title-section">
                            <h4 className="rule-name">{rule.name || 'Unnamed Rule'}</h4>
                            <div className="rule-badges">
                              <span className={`status-indicator ${rule.is_active ? 'active' : 'inactive'}`}>
                                <span className="status-dot"></span>
                                {rule.is_active ? 'Active' : 'Inactive'}
                              </span>
                              <span className={`category-tag ${getCategoryFromRule(rule).toLowerCase()}`}>{getCategoryFromRule(rule)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="rule-content">
                          <p className="rule-description">{rule.description || 'No description provided'}</p>
                        </div>
                        
                        <div className="rule-footer">
                          <div className="rule-meta">
                            <span className="meta-item">
                              <FaClock className="meta-icon" /> 
                              {rule.created_at ? new Date(rule.created_at).toLocaleDateString() : 'Unknown'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activePolicyTab === 'settings' && (
              <div className="policies-grid">
                <div className="policy-card">
                  <h3>Session Management</h3>
                  <div className="policy-settings">
                    <div className="setting-item">
                      <label>Max Concurrent Sessions</label>
                      <input type="number" defaultValue="3" />
                    </div>
                    <div className="setting-item">
                      <label>Session Timeout (minutes)</label>
                      <input type="number" defaultValue="1440" />
                    </div>
                    <div className="setting-item">
                      <label>Max Devices per User</label>
                      <input type="number" defaultValue="5" />
                    </div>
                    <div className="setting-item">
                      <label>Require Device Approval</label>
                      <input type="checkbox" />
                    </div>
                  </div>
                </div>
                
                <div className="policy-card">
                  <h3>Account Security</h3>
                  <div className="policy-settings">
                    <div className="setting-item">
                      <label>Max Login Attempts</label>
                      <input type="number" defaultValue="5" />
                    </div>
                    <div className="setting-item">
                      <label>Lockout Duration (minutes)</label>
                      <input type="number" defaultValue="10" />
                    </div>
                    <div className="setting-item">
                      <label>Password Min Length</label>
                      <input type="number" defaultValue="6" />
                    </div>
                    <div className="setting-item">
                      <label>Auto Logout Inactive</label>
                      <input type="checkbox" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePolicyTab === 'evidence' && (
              <div className="evidence-section">
                {evidenceList.length === 0 ? (
                  <div className="empty-state">
                    <FaDatabase size={48} />
                    <h4>No Evidence Records</h4>
                    <p>No audit logs found in the system</p>
                  </div>
                ) : (
                  <div className="evidence-cards">
                    {evidenceList.map((evidence, index) => (
                      <div key={evidence.id || index} className="evidence-card">
                        <div className="evidence-header">
                          <div className="evidence-info">
                            <span className="evidence-time">
                              <FaClock /> {formatTimestamp(evidence.timestamp)}
                            </span>
                            <div className="badges-group">
                              {evidence.action && evidence.action.toLowerCase().includes('password') && (
                                <span className="category-badge password">
                                  <FaShieldAlt /> Password
                                </span>
                              )}
                              {evidence.action && evidence.action.toLowerCase().includes('login') && (
                                <span className="category-badge login">
                                  <FaUser /> Login
                                </span>
                              )}
                              {evidence.action && evidence.action.toLowerCase().includes('compliance') && (
                                <span className="category-badge compliance">
                                  <FaCheck /> Compliance
                                </span>
                              )}
                              <span className={`status-badge ${evidence.status ? evidence.status.toLowerCase() : 'unknown'}`}>
                                {evidence.status || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="evidence-content">
                          <div className="evidence-row">
                            <span className="label">User:</span>
                            <span className={`user-badge ${evidence.actor_type ? evidence.actor_type.toLowerCase() : 'unknown'}`}>
                              <FaUser /> {evidence.actor_type || 'User'} #{evidence.actor_id || evidence.user_id || 'N/A'}
                            </span>
                          </div>
                          
                          <div className="evidence-row">
                            <span className="label">Action:</span>
                            <span className="action-text">{evidence.action}</span>
                          </div>
                          
                          <div className="evidence-row">
                            <span className="label">Resource:</span>
                            <span className="resource-text">{evidence.resource_type}</span>
                          </div>
                          
                          <div className="evidence-row">
                            <span className="label">IP Address:</span>
                            <span className="ip-text">{evidence.ip_address}</span>
                          </div>
                          

                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activePolicyTab === 'incident' && (
              <div className="incident-section">
                <div className="incident-header">
                  <h3>Security Incidents</h3>
                  <p>Monitor and manage security incidents</p>
                </div>
                
                <div className="incidents-list">
                  {incidents.map((incident) => (
                    <div key={incident.id} className={`incident-card ${incident.severity ? incident.severity.toLowerCase() : 'medium'}`}>
                      <div className="incident-header">
                        <div className="incident-info">
                          <span 
                            className="severity-badge" 
                            style={{ backgroundColor: getSeverityColor(incident.severity ? incident.severity.toLowerCase() : 'medium') }}
                          >
                            {incident.severity ? incident.severity.toUpperCase() : 'MEDIUM'}
                          </span>
                          <span className="incident-type">{incident.incident_type || incident.type || 'Unknown'}</span>
                          <span className="incident-time">{formatTimestamp(incident.created_at)}</span>
                        </div>
                        
                        <div className="incident-status">
                          <span className={`status-badge ${incident.status ? incident.status.toLowerCase() : 'open'}`}>
                            {incident.status ? incident.status.toUpperCase() : 'OPEN'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="incident-description">
                        {incident.description || 'No description available'}
                      </div>
                      
                      <div className="incident-details">
                        <span>Rule: {incident.rule_id || 'N/A'}</span>
                        <span>ID: {incident.id}</span>
                        {incident.resolved_at && <span>Resolved: {formatTimestamp(incident.resolved_at)}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activePolicyTab === 'settings' && (
              <div className="policies-actions">
                <button className="save-btn">
                  <FaCheck /> Save Policies
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AuditDashboard;
