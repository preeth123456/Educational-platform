import React, { useState } from 'react';
import { FaDatabase, FaDownload, FaUpload, FaHistory, FaArrowRight, FaShieldAlt, FaClock, FaCheckCircle, FaTimesCircle, FaCog, FaFileAlt, FaServer, FaCalendarAlt, FaTrash, FaEye, FaPlay } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import '../Dashboard.css';

interface BackupRecord {
  id: string;
  name: string;
  type: 'Auto' | 'Manual';
  date: string;
  size: string;
  status: 'Success' | 'Failed';
}

const AdminBackup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  const [selectedBackup, setSelectedBackup] = useState<BackupRecord | null>(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [dailyEnabled, setDailyEnabled] = useState(false);
  const [weeklyEnabled, setWeeklyEnabled] = useState(false);
  const [dailyTime, setDailyTime] = useState('18:28');
  const [weeklyTime, setWeeklyTime] = useState('18:28');
  const [weeklyDay, setWeeklyDay] = useState('Sunday');
  const [retentionDays, setRetentionDays] = useState('30');
  const [retentionMonths, setRetentionMonths] = useState('12');
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [backupHistory, setBackupHistory] = useState<BackupRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [backupStats, setBackupStats] = useState({
    totalBackups: 0,
    successRate: 0,
    totalSize: 0,
    storageUsed: '0 B',
    totalSpace: '0 B',
    availablePercentage: 0,
    retentionDays: 30
  });

  // Fetch backup history and stats on component mount
  React.useEffect(() => {
    fetchBackupHistory();
    fetchBackupStats();
    fetchBackupSettings();
  }, []);

  const fetchBackupSettings = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/admin/backup/settings/');
      const data = await response.json();
      if (data.status === 'success') {
        setDailyEnabled(data.settings.daily_enabled || false);
        setWeeklyEnabled(data.settings.weekly_enabled || false);
        setDailyTime(data.settings.daily_time || '18:28');
        setWeeklyTime(data.settings.weekly_time || '18:28');
        setWeeklyDay(data.settings.weekly_day || 'Sunday');
        setRetentionDays(data.settings.retention_days.toString());
        setRetentionMonths(data.settings.retention_months.toString());
      }
    } catch (error) {
      console.error('Error fetching backup settings:', error);
    }
  };

  const saveBackupSettings = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/admin/backup/settings/save/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          daily_enabled: dailyEnabled,
          weekly_enabled: weeklyEnabled,
          daily_time: dailyTime,
          weekly_time: weeklyTime,
          weekly_day: weeklyDay,
          retention_days: parseInt(retentionDays),
          retention_months: parseInt(retentionMonths),
          storage_destinations: { local: true, cloud: false, external: false }
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert('Settings saved successfully!');
      }
    } catch (error) {
      alert('Failed to save settings');
    }
  };

  const fetchBackupStats = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/admin/backup/stats/');
      const data = await response.json();

      if (data.status === 'success') {
        setBackupStats({
          totalBackups: data.stats.total_backups,
          successRate: data.stats.success_rate,
          totalSize: data.stats.total_backup_size,
          storageUsed: data.stats.storage_used_formatted,
          totalSpace: data.stats.total_space_formatted,
          availablePercentage: data.stats.available_percentage,
          retentionDays: data.stats.retention_days
        });
      }
    } catch (error) {
      console.error('Error fetching backup stats:', error);
    }
  };

  const fetchBackupHistory = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/admin/backup/history/');
      const data = await response.json();

      if (data.status === 'success') {
        // Convert API data to component format
        const formattedBackups: BackupRecord[] = data.backups.map((backup: any) => ({
          id: backup.id.toString(),
          name: backup.filename.replace('.sql', ''), // Remove .sql extension for display
          type: backup.created_by === 'admin' ? 'Manual' : 'Auto',
          date: new Date(backup.created_at).toLocaleString(),
          size: `${Math.round(backup.file_size / 1024)}KB`,
          status: backup.status === 'success' ? 'Success' : 'Failed'
        }));

        setBackupHistory(formattedBackups);

        // Calculate real statistics
        const totalBackups = data.backups.length;
        const successfulBackups = data.backups.filter((b: any) => b.status === 'success').length;
        const successRate = totalBackups > 0 ? Math.round((successfulBackups / totalBackups) * 100) : 0;
        const totalSize = data.backups.reduce((sum: number, backup: any) => sum + (backup.file_size || 0), 0);

        setBackupStats({
          totalBackups,
          successRate,
          totalSize
        });
      }
    } catch (error) {
      console.error('Error fetching backup history:', error);
      // Keep the existing mock data as fallback
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = (backup: BackupRecord) => {
    setSelectedBackup(backup);
    setShowRestoreModal(true);
  };

  const confirmRestore = () => {
    // Mock restore functionality
    alert(`Restoring backup: ${selectedBackup?.name}`);
    setShowRestoreModal(false);
    setSelectedBackup(null);
  };

  const downloadBackup = async (backup: BackupRecord) => {
    try {
      // Call the backend download API
      const response = await fetch(`http://localhost:8001/api/admin/backup/download/${backup.name}.sql`);

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      // Create a blob from the response
      const blob = await response.blob();

      // Create a download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${backup.name}.sql`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Download error:', error);
      alert(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCreateBackup = async () => {
    try {
      setIsBackingUp(true);
      setBackupProgress(0);

      // Start progress animation
      const progressInterval = setInterval(() => {
        setBackupProgress(prev => {
          if (prev >= 90) {
            return 90; // Stop at 90% until API completes
          }
          return prev + Math.random() * 10;
        });
      }, 300);

      // Call the backend API to create backup
      const response = await fetch('http://localhost:8001/api/admin/backup/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication header if needed
        }
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Complete progress
        clearInterval(progressInterval);
        setBackupProgress(100);

        // Show success message and refresh backup history
        setTimeout(() => {
          setIsBackingUp(false);
          setBackupProgress(0);
          alert(`Backup created successfully!\nFile: ${data.backup.filename}\nSize: ${Math.round(data.backup.file_size / 1024)} KB`);

          // Refresh backup history and stats to show the new backup
          fetchBackupHistory();
          fetchBackupStats();
        }, 1000);
      } else {
        throw new Error(data.message || 'Backup failed');
      }

    } catch (error) {
      console.error('Backup error:', error);
      setIsBackingUp(false);
      setBackupProgress(0);
      alert(`Backup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <AdminLayout>
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          {/* Header */}
          <div className="hero-welcome">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">System Backup & Recovery</h1>
                <p className="hero-subtitle">Manage data backups, restore operations, and system recovery procedures</p>
              </div>
            </div>
          </div>

          {/* Backup Status Metrics */}
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">
                <FaDatabase />
              </div>
              <div className="stat-content">
                <h3>{backupStats.totalBackups}</h3>
                <p>Total Backups</p>
                <div style={{ marginTop: '12px' }}>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    background: '#e2e8f0',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: '100%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '3px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#718096', marginTop: '6px', textAlign: 'center' }}>
                    {backupStats.totalBackups > 0 ? `All ${backupStats.totalBackups} backups completed` : 'No backups yet'}
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon">
                <FaShieldAlt />
              </div>
              <div className="stat-content">
                <h3>{backupStats.successRate}%</h3>
                <p>Backup Success Rate</p>
                <div style={{ marginTop: '12px' }}>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    background: '#e2e8f0',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${backupStats.successRate}%`,
                      background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                      borderRadius: '3px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#718096', marginTop: '6px', textAlign: 'center' }}>
                    {backupStats.successRate >= 95 ? 'Excellent reliability' :
                     backupStats.successRate >= 80 ? 'Good reliability' :
                     backupStats.successRate >= 50 ? 'Fair reliability' : 'Needs attention'}
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-icon">
                <FaServer />
              </div>
              <div className="stat-content">
                <h3>{backupStats.storageUsed} / {backupStats.totalSpace}</h3>
                <p>Storage Used</p>
                <div style={{ marginTop: '12px' }}>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    background: '#e2e8f0',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${100 - backupStats.availablePercentage}%`,
                      background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                      borderRadius: '3px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#718096', marginTop: '6px', textAlign: 'center' }}>{backupStats.availablePercentage}% available</div>
                </div>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon">
                <FaHistory />
              </div>
              <div className="stat-content">
                <h3>{backupStats.retentionDays} Days</h3>
                <p>Retention Period</p>
                <div style={{ marginTop: '12px' }}>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    background: '#e2e8f0',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: '75%',
                      background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
                      borderRadius: '3px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#718096', marginTop: '6px', textAlign: 'center' }}>Auto cleanup active</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)'
          }}>
            <div style={{
              display: 'flex',
              borderBottom: '2px solid #e2e8f0',
              marginBottom: '30px'
            }}>
              <button
                onClick={() => setActiveTab('overview')}
                style={{
                  padding: '15px 30px',
                  border: 'none',
                  background: activeTab === 'overview' ? '#667eea' : 'transparent',
                  color: activeTab === 'overview' ? 'white' : '#4a5568',
                  borderRadius: '10px 10px 0 0',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.3s ease'
                }}
              >
                <FaHistory /> Overview
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                style={{
                  padding: '15px 30px',
                  border: 'none',
                  background: activeTab === 'settings' ? '#667eea' : 'transparent',
                  color: activeTab === 'settings' ? 'white' : '#4a5568',
                  borderRadius: '10px 10px 0 0',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.3s ease'
                }}
              >
                <FaCog /> Settings
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <h3 style={{ margin: 0, color: '#2d3748' }}>Backup History</h3>
                  {isBackingUp ? (
                    <div style={{
                      background: '#f8f9fa',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '16px 20px',
                      minWidth: '300px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px'
                      }}>
                        <FaServer style={{ color: '#667eea' }} />
                        <span style={{ fontWeight: '600', color: '#2d3748' }}>Creating Database Backup...</span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '8px',
                        background: '#e2e8f0',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          width: `${backupProgress}%`,
                          transition: 'width 0.3s ease',
                          borderRadius: '4px'
                        }}></div>
                      </div>
                      <div style={{
                        textAlign: 'center',
                        marginTop: '8px',
                        fontSize: '14px',
                        color: '#718096'
                      }}>
                        {Math.round(backupProgress)}% Complete
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleCreateBackup}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <FaDownload /> Back Up Now
                    </button>
                  )}
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    background: 'white',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}>
                    <thead>
                      <tr style={{ background: '#f8f9fa' }}>
                        <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#4a5568' }}>Name</th>
                        <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#4a5568' }}>Type</th>
                        <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#4a5568' }}>Date</th>
                        <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#4a5568' }}>Size</th>
                        <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#4a5568' }}>Status</th>
                        <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600', color: '#4a5568' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {backupHistory.map((backup) => (
                        <tr
                          key={backup.id}
                          style={{
                            borderBottom: '1px solid #e2e8f0',
                            position: 'relative'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f8f9fa';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                          }}
                        >
                          <td style={{ padding: '15px', fontWeight: '500' }}>{backup.name}</td>
                          <td style={{ padding: '15px' }}>
                            <span style={{
                              background: backup.type === 'Auto' ? '#e6fffa' : '#ebf8ff',
                              color: backup.type === 'Auto' ? '#065f46' : '#1e40af',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              {backup.type}
                            </span>
                          </td>
                          <td style={{ padding: '15px', color: '#718096' }}>{backup.date}</td>
                          <td style={{ padding: '15px', fontWeight: '500' }}>{backup.size}</td>
                          <td style={{ padding: '15px' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              background: backup.status === 'Success' ? '#c6f6d5' : '#fed7d7',
                              color: backup.status === 'Success' ? '#22543d' : '#742a2a',
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              {backup.status === 'Success' ? <FaCheckCircle /> : <FaTimesCircle />}
                              {backup.status}
                            </span>
                          </td>
                          <td style={{ padding: '15px', textAlign: 'center' }}>
                            <div style={{
                              display: 'flex',
                              gap: '8px',
                              justifyContent: 'center',
                              opacity: 0,
                              transition: 'opacity 0.3s ease'
                            }}
                            className="action-buttons"
                            >
                              <button
                                onClick={() => handleRestore(backup)}
                                style={{
                                  background: '#3182ce',
                                  color: 'white',
                                  border: 'none',
                                  padding: '8px 12px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px'
                                }}
                              >
                                <FaPlay /> Restore
                              </button>
                              <button
                                onClick={() => downloadBackup(backup)}
                                style={{
                                  background: '#38a169',
                                  color: 'white',
                                  border: 'none',
                                  padding: '8px 12px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px'
                                }}
                              >
                                <FaDownload /> Download
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h3 style={{ marginBottom: '30px', color: '#2d3748' }}>Backup Configuration</h3>

                {/* Frequency Settings */}
                <div style={{ marginBottom: '40px' }}>
                  <h4 style={{ marginBottom: '20px', color: '#4a5568' }}>Backup Schedule</h4>
                  
                  {/* Daily Backup */}
                  <div style={{
                    padding: '20px',
                    border: `2px solid ${dailyEnabled ? '#667eea' : '#e2e8f0'}`,
                    borderRadius: '10px',
                    background: dailyEnabled ? '#f0f4ff' : 'white',
                    marginBottom: '20px',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <FaCalendarAlt size={24} color={dailyEnabled ? '#667eea' : '#a0aec0'} />
                        <div>
                          <h5 style={{ margin: '0 0 5px 0', color: '#2d3748' }}>Daily Backup</h5>
                          <p style={{ margin: 0, color: '#718096', fontSize: '14px' }}>Automatic backup every day at {dailyTime}</p>
                        </div>
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="checkbox"
                          checked={dailyEnabled}
                          onChange={(e) => setDailyEnabled(e.target.checked)}
                          style={{ transform: 'scale(1.3)' }}
                        />
                        <span style={{ fontWeight: '600', color: '#4a5568' }}>Enable</span>
                      </label>
                    </div>
                    {dailyEnabled && (
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568' }}>Time</label>
                        <input
                          type="time"
                          value={dailyTime}
                          onChange={(e) => setDailyTime(e.target.value)}
                          style={{
                            padding: '10px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Weekly Backup */}
                  <div style={{
                    padding: '20px',
                    border: `2px solid ${weeklyEnabled ? '#667eea' : '#e2e8f0'}`,
                    borderRadius: '10px',
                    background: weeklyEnabled ? '#f0f4ff' : 'white',
                    marginBottom: '20px',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <FaCalendarAlt size={24} color={weeklyEnabled ? '#667eea' : '#a0aec0'} />
                        <div>
                          <h5 style={{ margin: '0 0 5px 0', color: '#2d3748' }}>Weekly Backup</h5>
                          <p style={{ margin: 0, color: '#718096', fontSize: '14px' }}>Automatic backup every {weeklyDay} at {weeklyTime}</p>
                        </div>
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="checkbox"
                          checked={weeklyEnabled}
                          onChange={(e) => setWeeklyEnabled(e.target.checked)}
                          style={{ transform: 'scale(1.3)' }}
                        />
                        <span style={{ fontWeight: '600', color: '#4a5568' }}>Enable</span>
                      </label>
                    </div>
                    {weeklyEnabled && (
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568' }}>Day</label>
                          <select
                            value={weeklyDay}
                            onChange={(e) => setWeeklyDay(e.target.value)}
                            style={{
                              padding: '10px',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              fontSize: '14px'
                            }}
                          >
                            <option value="Sunday">Sunday</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568' }}>Time</label>
                          <input
                            type="time"
                            value={weeklyTime}
                            onChange={(e) => setWeeklyTime(e.target.value)}
                            style={{
                              padding: '10px',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Retention Policy */}
                <div style={{ marginBottom: '40px' }}>
                  <h4 style={{ marginBottom: '20px', color: '#4a5568' }}>Retention Policy</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568' }}>
                        Keep backups for (days)
                      </label>
                      <select
                        value={retentionDays}
                        onChange={(e) => setRetentionDays(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="7">7 days</option>
                        <option value="14">14 days</option>
                        <option value="30">30 days</option>
                        <option value="60">60 days</option>
                        <option value="90">90 days</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568' }}>
                        Archive backups for (months)
                      </label>
                      <select
                        value={retentionMonths}
                        onChange={(e) => setRetentionMonths(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="3">3 months</option>
                        <option value="6">6 months</option>
                        <option value="12">12 months</option>
                        <option value="24">24 months</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Storage Destinations */}
                <div>
                  <h4 style={{ marginBottom: '20px', color: '#4a5568' }}>Storage Destinations</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <div style={{
                      padding: '20px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      background: '#f8f9fa',
                      textAlign: 'center'
                    }}>
                      <FaServer size={24} color="#38a169" style={{ marginBottom: '10px' }} />
                      <h5 style={{ margin: '0 0 5px 0', color: '#2d3748' }}>Local Storage</h5>
                      <p style={{ margin: 0, color: '#38a169', fontSize: '14px', fontWeight: '600' }}>Active</p>
                    </div>
                    <div style={{
                      padding: '20px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      background: '#f8f9fa',
                      textAlign: 'center',
                      opacity: 0.6
                    }}>
                      <FaServer size={24} color="#a0aec0" style={{ marginBottom: '10px' }} />
                      <h5 style={{ margin: '0 0 5px 0', color: '#2d3748' }}>Cloud Storage</h5>
                      <p style={{ margin: 0, color: '#a0aec0', fontSize: '14px', fontWeight: '600' }}>Inactive</p>
                    </div>
                    <div style={{
                      padding: '20px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      background: '#f8f9fa',
                      textAlign: 'center',
                      opacity: 0.6
                    }}>
                      <FaServer size={24} color="#a0aec0" style={{ marginBottom: '10px' }} />
                      <h5 style={{ margin: '0 0 5px 0', color: '#2d3748' }}>External Drive</h5>
                      <p style={{ margin: 0, color: '#a0aec0', fontSize: '14px', fontWeight: '600' }}>Inactive</p>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                  <button
                    onClick={saveBackupSettings}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 30px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Restore Modal */}
          {showRestoreModal && selectedBackup && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '30px',
                maxWidth: '500px',
                width: '90%',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <FaServer size={40} color="#667eea" style={{ marginBottom: '15px' }} />
                  <h3 style={{ margin: '0 0 10px 0', color: '#2d3748' }}>Confirm Restore</h3>
                  <p style={{ margin: 0, color: '#718096' }}>
                    Are you sure you want to restore from this backup point?
                  </p>
                </div>

                <div style={{
                  background: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '10px',
                  marginBottom: '30px'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px' }}>
                    <div>
                      <strong>Name:</strong><br />
                      <span style={{ color: '#4a5568' }}>{selectedBackup.name}</span>
                    </div>
                    <div>
                      <strong>Type:</strong><br />
                      <span style={{ color: '#4a5568' }}>{selectedBackup.type}</span>
                    </div>
                    <div>
                      <strong>Date:</strong><br />
                      <span style={{ color: '#4a5568' }}>{selectedBackup.date}</span>
                    </div>
                    <div>
                      <strong>Size:</strong><br />
                      <span style={{ color: '#4a5568' }}>{selectedBackup.size}</span>
                    </div>
                  </div>
                </div>

                <div style={{
                  background: '#fff5f5',
                  border: '1px solid #feb2b2',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '30px'
                }}>
                  <p style={{
                    margin: 0,
                    color: '#c53030',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <FaTimesCircle />
                    <strong>Warning:</strong> This action will overwrite the current database. Make sure you have a recent backup.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setShowRestoreModal(false)}
                    style={{
                      padding: '12px 24px',
                      border: '1px solid #e2e8f0',
                      background: 'white',
                      color: '#4a5568',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmRestore}
                    style={{
                      padding: '12px 24px',
                      border: 'none',
                      background: '#e53e3e',
                      color: 'white',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Confirm Restore
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        tr:hover .action-buttons {
          opacity: 1 !important;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminBackup;