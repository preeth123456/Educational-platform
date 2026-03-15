import React, { useState, useEffect } from 'react';
import { 
  FaCog, FaUserShield, FaBell, FaPalette, FaLock, FaArrowRight, 
  FaGlobe, FaDatabase, FaSave, FaSearch, FaSync, FaHistory,
  FaEnvelope, FaCloud, FaKey, FaPlug, FaCheck, FaTimes, FaEdit,
  FaExclamationTriangle, FaCheckCircle
} from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import '../Dashboard.css';

interface PlatformConfig {
  id: number;
  key: string;
  value: string;
  typed_value: any;
  display_value: string;
  value_type: string;
  category: string;
  description: string;
  is_sensitive: boolean;
  is_editable: boolean;
  updated_by_name: string;
  updated_at: string;
}

interface ConfigChangeLog {
  id: number;
  config_key: string;
  old_value: string;
  new_value: string;
  changed_by_name: string;
  changed_by_role: string;
  changed_at: string;
}

interface CategoryInfo {
  category: string;
  display_name: string;
  count: number;
  icon: React.ReactNode;
}

const API_BASE = 'http://localhost:8001/api/admin/config';

const categoryIcons: Record<string, React.ReactNode> = {
  general: <FaGlobe />,
  email: <FaEnvelope />,
  storage: <FaCloud />,
  security: <FaLock />,
  api: <FaKey />,
  notification: <FaBell />,
  appearance: <FaPalette />,
  integration: <FaPlug />,
};

const categoryDisplayNames: Record<string, string> = {
  general: 'General Settings',
  email: 'Email Configuration',
  storage: 'Storage Settings',
  security: 'Security Settings',
  api: 'API Settings',
  notification: 'Notification Settings',
  appearance: 'Appearance Settings',
  integration: 'Integration Settings',
};

const AdminSettings: React.FC = () => {
  const [configs, setConfigs] = useState<PlatformConfig[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [changeLogs, setChangeLogs] = useState<ConfigChangeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [showLogs, setShowLogs] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchConfigs();
    fetchCategories();
    
    // Debug: Check if token exists
    const token = localStorage.getItem('admin_token');
    console.log('AdminSettings - Current admin token:', token);
    
    // Temporary: Set token if missing (for testing)
    if (!token) {
      console.log('No admin token found, setting temporary token for testing');
      // Generate a temporary token for testing
      const tempPayload = {
        admin_id: 1,
        name: 'Super Admin',
        email: 'admin@eduyata.com',
        exp: (Date.now() / 1000) + (24 * 60 * 60) // 24 hours from now
      };
      const tempToken = btoa(JSON.stringify(tempPayload));
      localStorage.setItem('admin_token', tempToken);
      console.log('Temporary token set:', tempToken);
    }
  }, []);

  // Helper function to get auth headers with Bearer token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  };

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      
      if (data.success) {
        setConfigs(data.data);
      } else {
        setError(data.message || 'Failed to fetch configurations');
      }
    } catch (err) {
      console.error('Error fetching configs:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/categories/`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      
      if (data.success) {
        const categoriesWithIcons = data.data.map((cat: any) => ({
          ...cat,
          icon: categoryIcons[cat.category] || <FaCog />,
        }));
        setCategories(categoriesWithIcons);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchChangeLogs = async () => {
    try {
      const response = await fetch(`${API_BASE}/logs/`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      
      if (data.success) {
        setChangeLogs(data.data);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  const updateConfig = async (key: string, value: string) => {
    try {
      setSaving(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/${key}/update/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ value }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Configuration "${key}" updated successfully`);
        setConfigs(prev => prev.map(c => 
          c.key === key ? { ...c, value, display_value: value } : c
        ));
        setEditingKey(null);
        setPendingChanges(prev => {
          const newPending = { ...prev };
          delete newPending[key];
          return newPending;
        });
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || 'Failed to update configuration');
      }
    } catch (err) {
      console.error('Error updating config:', err);
      setError('Failed to update configuration');
    } finally {
      setSaving(false);
    }
  };

  const bulkSaveChanges = async () => {
    if (Object.keys(pendingChanges).length === 0) return;
    
    try {
      setSaving(true);
      setError(null);
      
      const configsToUpdate = Object.entries(pendingChanges).map(([key, value]) => ({
        key,
        value,
      }));
      
      const response = await fetch(`${API_BASE}/bulk/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ configs: configsToUpdate }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Updated ${data.updated.length} configurations successfully`);
        setPendingChanges({});
        fetchConfigs();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || 'Failed to update configurations');
      }
    } catch (err) {
      console.error('Error bulk updating:', err);
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleValueChange = (key: string, value: string) => {
    setPendingChanges(prev => ({ ...prev, [key]: value }));
  };

  const startEditing = (config: PlatformConfig) => {
    if (!config.is_editable) return;
    setEditingKey(config.key);
    setEditValue(pendingChanges[config.key] ?? config.value);
  };

  const cancelEditing = () => {
    setEditingKey(null);
    setEditValue('');
  };

  const saveEditing = () => {
    if (editingKey) {
      handleValueChange(editingKey, editValue);
      setEditingKey(null);
    }
  };

  const filteredConfigs = configs.filter(config => {
    const matchesCategory = activeCategory === 'all' || config.category === activeCategory;
    const matchesSearch = config.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          config.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderConfigValue = (config: PlatformConfig) => {
    const currentValue = pendingChanges[config.key] ?? config.value;
    const isEditing = editingKey === config.key;
    const hasChange = pendingChanges[config.key] !== undefined;
    
    if (config.is_sensitive && !isEditing) {
      return <span className="sensitive-value">••••••••</span>;
    }
    
    if (isEditing) {
      if (config.value_type === 'boolean') {
        return (
          <div className="edit-field">
            <select
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="config-select"
            >
              <option value="true">Enabled (true)</option>
              <option value="false">Disabled (false)</option>
            </select>
            <button className="save-btn" onClick={saveEditing}><FaCheck /></button>
            <button className="cancel-btn" onClick={cancelEditing}><FaTimes /></button>
          </div>
        );
      }
      
      return (
        <div className="edit-field">
          <input
            type={config.value_type === 'integer' ? 'number' : 'text'}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="config-input"
            autoFocus
          />
          <button className="save-btn" onClick={saveEditing}><FaCheck /></button>
          <button className="cancel-btn" onClick={cancelEditing}><FaTimes /></button>
        </div>
      );
    }
    
    if (config.value_type === 'boolean') {
      const boolValue = currentValue.toLowerCase() === 'true';
      return (
        <span className={`bool-badge ${boolValue ? 'enabled' : 'disabled'}`}>
          {boolValue ? 'Enabled' : 'Disabled'}
          {hasChange && <span className="change-indicator">*</span>}
        </span>
      );
    }
    
    return (
      <span className="config-value-text">
        {currentValue}
        {hasChange && <span className="change-indicator">*</span>}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          {/* Header */}
          <div className="hero-welcome">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">Platform Configuration</h1>
                <p className="hero-subtitle">
                  Configure platform settings, security options, and system preferences via API
                </p>
              </div>
              <div className="hero-actions">
                <button 
                  className="action-btn secondary"
                  onClick={() => { setShowLogs(!showLogs); fetchChangeLogs(); }}
                >
                  <FaHistory /> Audit Logs
                </button>
                <button 
                  className="action-btn secondary"
                  onClick={fetchConfigs}
                  disabled={loading}
                >
                  <FaSync className={loading ? 'spin' : ''} /> Refresh
                </button>
                {Object.keys(pendingChanges).length > 0 && (
                  <button 
                    className="action-btn primary"
                    onClick={bulkSaveChanges}
                    disabled={saving}
                  >
                    <FaSave /> Save {Object.keys(pendingChanges).length} Changes
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="alert alert-error">
              <FaExclamationTriangle /> {error}
              <button onClick={() => setError(null)}><FaTimes /></button>
            </div>
          )}
          {success && (
            <div className="alert alert-success">
              <FaCheckCircle /> {success}
            </div>
          )}

          {/* Stats Overview */}
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon"><FaCog /></div>
              <div className="stat-content">
                <h3>{configs.length}</h3>
                <p>Total Configurations</p>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon"><FaUserShield /></div>
              <div className="stat-content">
                <h3>{categories.length}</h3>
                <p>Categories</p>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-icon"><FaEdit /></div>
              <div className="stat-content">
                <h3>{configs.filter(c => c.is_editable).length}</h3>
                <p>Editable Settings</p>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon"><FaLock /></div>
              <div className="stat-content">
                <h3>{configs.filter(c => c.is_sensitive).length}</h3>
                <p>Sensitive Settings</p>
              </div>
            </div>
          </div>

          {/* Audit Logs Panel */}
          {showLogs && (
            <div className="progress-dashboard" style={{ marginBottom: '20px' }}>
              <div className="section-header">
                <div className="section-title">
                  <FaHistory className="section-icon" />
                  <h2>Configuration Change History</h2>
                </div>
                <button className="view-all-btn" onClick={() => setShowLogs(false)}>
                  Close <FaTimes />
                </button>
              </div>
              <div className="logs-table">
                <table>
                  <thead>
                    <tr>
                      <th>Config Key</th>
                      <th>Old Value</th>
                      <th>New Value</th>
                      <th>Changed By</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {changeLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                          No change logs found
                        </td>
                      </tr>
                    ) : (
                      changeLogs.slice(0, 20).map(log => (
                        <tr key={log.id}>
                          <td><code>{log.config_key}</code></td>
                          <td className="old-value">{log.old_value || '-'}</td>
                          <td className="new-value">{log.new_value}</td>
                          <td>{log.changed_by_name} ({log.changed_by_role})</td>
                          <td>{formatDate(log.changed_at)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Main Configuration Panel */}
          <div className="config-panel">
            {/* Sidebar - Categories */}
            <div className="config-sidebar">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search configurations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="category-list">
                <button
                  className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('all')}
                >
                  <FaCog />
                  <span>All Settings</span>
                  <span className="count">{configs.length}</span>
                </button>
                
                {categories.map(cat => (
                  <button
                    key={cat.category}
                    className={`category-btn ${activeCategory === cat.category ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.category)}
                  >
                    {cat.icon}
                    <span>{cat.display_name}</span>
                    <span className="count">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Config List */}
            <div className="config-list">
              <div className="config-list-header">
                <h2>
                  {activeCategory === 'all' 
                    ? 'All Configurations' 
                    : categoryDisplayNames[activeCategory] || activeCategory}
                </h2>
                <span className="config-count">{filteredConfigs.length} items</span>
              </div>

              {loading ? (
                <div className="loading-spinner">
                  <FaSync className="spin" /> Loading configurations...
                </div>
              ) : filteredConfigs.length === 0 ? (
                <div className="no-configs">
                  <FaCog />
                  <p>No configurations found</p>
                </div>
              ) : (
                <div className="config-items">
                  {filteredConfigs.map(config => (
                    <div 
                      key={config.key} 
                      className={`config-item ${!config.is_editable ? 'readonly' : ''} ${pendingChanges[config.key] !== undefined ? 'has-change' : ''}`}
                    >
                      <div className="config-main">
                        <div className="config-header">
                          <code className="config-key">{config.key}</code>
                          <div className="config-badges">
                            <span className={`type-badge ${config.value_type}`}>
                              {config.value_type}
                            </span>
                            {config.is_sensitive && (
                              <span className="badge sensitive">
                                <FaLock /> Sensitive
                              </span>
                            )}
                            {!config.is_editable && (
                              <span className="badge readonly">
                                Read-only
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="config-description">{config.description}</p>
                        <div className="config-value-row">
                          <div className="config-value">
                            {renderConfigValue(config)}
                          </div>
                          {config.is_editable && editingKey !== config.key && (
                            <button 
                              className="edit-btn"
                              onClick={() => startEditing(config)}
                            >
                              <FaEdit /> Edit
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="config-meta">
                        <span>Last updated: {formatDate(config.updated_at)}</span>
                        {config.updated_by_name && (
                          <span>by {config.updated_by_name}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }
        
        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .action-btn.primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }
        
        .action-btn.secondary {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          border: 1px solid rgba(102, 126, 234, 0.3);
        }
        
        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          animation: slideIn 0.3s ease;
        }
        
        .alert-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }
        
        .alert-success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #10b981;
        }
        
        .alert button {
          margin-left: auto;
          background: none;
          border: none;
          cursor: pointer;
          color: inherit;
        }
        
        .config-panel {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 20px;
          margin-top: 20px;
        }
        
        .config-sidebar {
          background: white;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          height: fit-content;
          position: sticky;
          top: 100px;
        }
        
        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 15px;
          background: #f5f7fa;
          border-radius: 10px;
          margin-bottom: 15px;
        }
        
        .search-box input {
          border: none;
          background: none;
          outline: none;
          flex: 1;
          font-size: 14px;
        }
        
        .search-box svg {
          color: #9ca3af;
        }
        
        .category-list {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        .category-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 15px;
          border: none;
          background: transparent;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
        }
        
        .category-btn:hover {
          background: #f5f7fa;
        }
        
        .category-btn.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }
        
        .category-btn .count {
          margin-left: auto;
          background: rgba(0, 0, 0, 0.1);
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
        }
        
        .category-btn.active .count {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .config-list {
          background: white;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        
        .config-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .config-list-header h2 {
          margin: 0;
          font-size: 1.3rem;
          color: #1a1a2e;
        }
        
        .config-count {
          color: #9ca3af;
          font-size: 14px;
        }
        
        .config-items {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .config-item {
          border: 1px solid #eef2f7;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.2s ease;
        }
        
        .config-item:hover {
          border-color: #667eea;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
        }
        
        .config-item.has-change {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.05);
        }
        
        .config-item.readonly {
          opacity: 0.7;
        }
        
        .config-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .config-key {
          background: #f5f7fa;
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 14px;
          color: #667eea;
        }
        
        .config-badges {
          display: flex;
          gap: 8px;
        }
        
        .type-badge {
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
        }
        
        .type-badge.string { background: #dbeafe; color: #2563eb; }
        .type-badge.integer { background: #dcfce7; color: #16a34a; }
        .type-badge.boolean { background: #fef3c7; color: #d97706; }
        .type-badge.json { background: #f3e8ff; color: #9333ea; }
        .type-badge.float { background: #fce7f3; color: #db2777; }
        
        .badge {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 11px;
        }
        
        .badge.sensitive {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
        
        .badge.readonly {
          background: rgba(107, 114, 128, 0.1);
          color: #6b7280;
        }
        
        .config-description {
          color: #6b7280;
          font-size: 14px;
          margin: 0 0 15px 0;
        }
        
        .config-value-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .config-value {
          flex: 1;
        }
        
        .config-value-text {
          font-weight: 500;
          color: #1a1a2e;
        }
        
        .sensitive-value {
          color: #9ca3af;
          letter-spacing: 3px;
        }
        
        .bool-badge {
          display: inline-flex;
          align-items: center;
          padding: 5px 15px;
          border-radius: 20px;
          font-weight: 500;
          font-size: 13px;
        }
        
        .bool-badge.enabled {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }
        
        .bool-badge.disabled {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
        
        .change-indicator {
          color: #f59e0b;
          margin-left: 5px;
          font-weight: bold;
        }
        
        .edit-field {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        
        .config-input, .config-select {
          padding: 10px 15px;
          border: 2px solid #667eea;
          border-radius: 8px;
          font-size: 14px;
          min-width: 200px;
          outline: none;
        }
        
        .save-btn, .cancel-btn {
          padding: 10px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .save-btn {
          background: #10b981;
          color: white;
        }
        
        .cancel-btn {
          background: #ef4444;
          color: white;
        }
        
        .edit-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 8px 15px;
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s ease;
        }
        
        .edit-btn:hover {
          background: #667eea;
          color: white;
        }
        
        .config-meta {
          display: flex;
          gap: 15px;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #f0f0f0;
          font-size: 12px;
          color: #9ca3af;
        }
        
        .loading-spinner, .no-configs {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          color: #9ca3af;
        }
        
        .loading-spinner svg, .no-configs svg {
          font-size: 40px;
          margin-bottom: 15px;
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .logs-table {
          overflow-x: auto;
        }
        
        .logs-table table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .logs-table th, .logs-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .logs-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #4a5568;
        }
        
        .logs-table code {
          background: #f5f7fa;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .old-value {
          color: #ef4444;
          text-decoration: line-through;
        }
        
        .new-value {
          color: #10b981;
          font-weight: 500;
        }
        
        @media (max-width: 1024px) {
          .config-panel {
            grid-template-columns: 1fr;
          }
          
          .config-sidebar {
            position: static;
          }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminSettings;