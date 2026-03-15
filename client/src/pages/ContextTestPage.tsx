import React from 'react';
import ContextSwitcher from '../components/ContextSwitcher';
import PermissionWrapper from '../components/PermissionWrapper';
import { useContextManager } from '../hooks/useContextManager';
import SessionManager from '../utils/sessionManager';
import AdminLayout from '../components/AdminLayout';
import { FaCog, FaShieldAlt, FaDatabase, FaUsers, FaKey, FaChartLine } from 'react-icons/fa';
import '../Dashboard.css';
import './AdminDashboard.css';

const ContextTestPage: React.FC = () => {
  const { currentContext, availableContexts, loading } = useContextManager();
  const session = SessionManager.getSession();

  if (!session) {
    return <div>Please login first</div>;
  }

  return (
    <AdminLayout>
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          {/* Hero Welcome Section */}
          <div className="hero-welcome">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">Context Switching Test Page 🔄</h1>
                <p className="hero-subtitle one-line">Test and validate context switching functionality across different user roles and permissions.</p>
              </div>
            </div>
          </div>

          {/* Current User Session */}
          <div className="stats-grid" style={{ marginTop: '2rem' }}>
            <div className="stat-card primary">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #a855f7, #9333ea)' }}>
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>{session.name}</h3>
                <p>Current User</p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                  Role: {session.role} | ID: {session.id}
                </div>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                <FaKey />
              </div>
              <div className="stat-content">
                <h3>{currentContext?.context_name || 'None'}</h3>
                <p>Active Context</p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                  Type: {currentContext?.context_type || 'N/A'}
                </div>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}>
                <FaShieldAlt />
              </div>
              <div className="stat-content">
                <h3>{Object.keys(currentContext?.permissions || {}).length}</h3>
                <p>Active Permissions</p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                  Security Level: {currentContext?.permissions ? 'Active' : 'Basic'}
                </div>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                <FaDatabase />
              </div>
              <div className="stat-content">
                <h3>{availableContexts.length}</h3>
                <p>Available Contexts</p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                  Ready to switch
                </div>
              </div>
            </div>
          </div>

          {/* Context Switcher Section */}
          <div className="learning-goals-row">
            <div className="dashboard-section continue-learning">
              <div className="section-header">
                <div className="section-title">
                  <FaCog className="section-icon" />
                  <h2>Context Switcher</h2>
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <ContextSwitcher onContextChange={(context) => console.log('Context changed:', context)} />
              </div>
            </div>

            <div className="goals-section">
              <div className="section-header">
                <div className="section-title">
                  <FaChartLine className="section-icon" />
                  <h2>Current Context Details</h2>
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                {loading ? (
                  <p>Loading...</p>
                ) : currentContext ? (
                  <div>
                    <div style={{ marginBottom: '1rem' }}>
                      <strong>Name:</strong> {currentContext.context_name}
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <strong>Type:</strong> {currentContext.context_type}
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <strong>ID:</strong> {currentContext.context_id}
                    </div>
                    <div>
                      <strong>Permissions:</strong>
                      <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {Object.entries(currentContext.permissions || {}).map(([key, value]) => (
                          <span key={key} style={{ 
                            padding: '0.25rem 0.5rem', 
                            borderRadius: '0.375rem', 
                            fontSize: '0.75rem',
                            backgroundColor: value ? '#dcfce7' : '#fef2f2',
                            color: value ? '#166534' : '#991b1b'
                          }}>
                            {key}: {value ? '✅' : '❌'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>No context loaded</p>
                )}
              </div>
            </div>
          </div>

          {/* Available Contexts */}
          <div className="dashboard-section" style={{ marginBottom: '2rem' }}>
            <div className="section-header">
              <div className="section-title">
                <FaDatabase className="section-icon" />
                <h2>Available Contexts</h2>
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {availableContexts.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                  {availableContexts.map((context) => (
                    <div key={context.id} style={{
                      padding: '1rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      backgroundColor: '#f9fafb'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{context.context_name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Type: {context.context_type}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No contexts available</p>
              )}
            </div>
          </div>

          {/* Permission Testing */}
          <div className="dashboard-section" style={{ marginBottom: '2rem' }}>
            <div className="section-header">
              <div className="section-title">
                <FaShieldAlt className="section-icon" />
                <h2>Permission-Based Content Testing</h2>
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <PermissionWrapper permission="view_courses">
                  <div className="alert-item success">
                    <div className="alert-icon">✅</div>
                    <div className="alert-content">
                      <div className="alert-message">You can view courses (view_courses permission)</div>
                    </div>
                  </div>
                </PermissionWrapper>

                <PermissionWrapper permission="manage_teachers">
                  <div className="alert-item success">
                    <div className="alert-icon">✅</div>
                    <div className="alert-content">
                      <div className="alert-message">You can manage teachers (manage_teachers permission)</div>
                    </div>
                  </div>
                </PermissionWrapper>

                <PermissionWrapper permission="submit_assignments">
                  <div className="alert-item success">
                    <div className="alert-icon">✅</div>
                    <div className="alert-content">
                      <div className="alert-message">You can submit assignments (submit_assignments permission)</div>
                    </div>
                  </div>
                </PermissionWrapper>

                <PermissionWrapper 
                  permission="admin_only" 
                  fallback={
                    <div className="alert-item warning">
                      <div className="alert-icon">❌</div>
                      <div className="alert-content">
                        <div className="alert-message">Admin only content (no permission)</div>
                      </div>
                    </div>
                  }
                >
                  <div className="alert-item success">
                    <div className="alert-icon">✅</div>
                    <div className="alert-content">
                      <div className="alert-message">Admin only content visible</div>
                    </div>
                  </div>
                </PermissionWrapper>
              </div>
            </div>
          </div>

          {/* System Settings Sections */}
          <div className="recommended-grid">
            <div className="management-card">
              <div className="management-header">
                <FaCog className="management-icon" />
                <h3>System Settings</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">Active</span>
                  <span className="stat-label">Context Test</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">{availableContexts.length}</span>
                  <span className="stat-label">Contexts</span>
                </div>
              </div>
              <button className="management-btn">Manage Settings</button>
            </div>

            <div className="management-card">
              <div className="management-header">
                <FaUsers className="management-icon" />
                <h3>Session Management</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">{session.sessionToken ? 'Active' : 'N/A'}</span>
                  <span className="stat-label">Session</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">{session.deviceInfo ? 'Tracked' : 'N/A'}</span>
                  <span className="stat-label">Device</span>
                </div>
              </div>
              <button className="management-btn">View Sessions</button>
            </div>

            <div className="management-card">
              <div className="management-header">
                <FaShieldAlt className="management-icon" />
                <h3>Audit & Security</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">Logged</span>
                  <span className="stat-label">Context Switches</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Tracked</span>
                  <span className="stat-label">IP Address</span>
                </div>
              </div>
              <button className="management-btn">View Audit Logs</button>
            </div>

            <div className="management-card">
              <div className="management-header">
                <FaDatabase className="management-icon" />
                <h3>Settings & Backup</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">Active</span>
                  <span className="stat-label">Context Settings</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Backed Up</span>
                  <span className="stat-label">Data Status</span>
                </div>
              </div>
              <button className="management-btn">Manage Backup</button>
            </div>
          </div>

          {/* Session Manager Testing */}
          <div className="dashboard-section" style={{ marginTop: '2rem' }}>
            <div className="section-header">
              <div className="section-title">
                <FaCog className="section-icon" />
                <h2>Session Manager Testing</h2>
              </div>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                className="approve-btn"
                onClick={() => console.log('Current permissions:', SessionManager.getUserPermissions())}
              >
                Log Current Permissions
              </button>
              <button 
                className="approve-btn"
                onClick={() => console.log('Has view_courses:', SessionManager.hasPermission('view_courses'))}
              >
                Check view_courses Permission
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContextTestPage;