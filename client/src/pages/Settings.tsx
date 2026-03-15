import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBell, FaLock, FaPalette, FaSave, FaHistory, FaShieldAlt, FaDatabase } from 'react-icons/fa';
import StudentLayout from '../components/StudentLayout';
import RealTimeActivityHistory from '../components/RealTimeActivityHistory';
import PrivacyDashboard from '../components/PrivacyDashboard';
import DataExport from '../components/DataExport';
import AccountDeletion from '../components/AccountDeletion';
import SessionManager, { StudentSession } from '../utils/sessionManager';
import { useLocation } from 'wouter';
import './Settings.css';

interface StudentProfile {
  name: string;
  gender: string;
  mobile_self: string;
  class_level: string;
  board: string;
  date_of_birth: string;
  address: string;
  parent_name: string;
  parent_phone: string;
  interests: string;
  profile_picture: string;
}

interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  assignment_reminders: boolean;
  course_updates: boolean;
  achievement_alerts: boolean;
}

interface AppPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dashboard_layout: 'compact' | 'detailed';
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [studentSession, setStudentSession] = useState<StudentSession | null>(null);
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [profile, setProfile] = useState<StudentProfile>({
    name: '',
    gender: '',
    mobile_self: '',
    class_level: '',
    board: '',
    date_of_birth: '',
    address: '',
    parent_name: '',
    parent_phone: '',
    interests: '',
    profile_picture: ''
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: true,
    assignment_reminders: true,
    course_updates: true,
    achievement_alerts: true
  });

  const [preferences, setPreferences] = useState<AppPreferences>({
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    dashboard_layout: 'detailed'
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    const session = SessionManager.getSession() as StudentSession;
    if (!session) {
      navigate('/login');
      return;
    }
    setStudentSession(session);
    loadUserPreferences(session.id);
  }, [navigate]);

  useEffect(() => {
    applyTheme(preferences.theme);
  }, [preferences.theme]);

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-theme');
    } else if (theme === 'light') {
      root.classList.remove('dark-theme');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark-theme');
      } else {
        root.classList.remove('dark-theme');
      }
    }
  };

  const loadUserPreferences = async (studentId: number) => {
    try {
      const response = await fetch(`http://localhost:8001/api/auth/get_user_preferences/?student_id=${studentId}`);
      const data = await response.json();

      if (data.status === 'success') {
        setNotifications({
          email_notifications: data.data.email_notifications,
          push_notifications: data.data.push_notifications,
          assignment_reminders: data.data.assignment_reminders,
          course_updates: data.data.course_updates,
          achievement_alerts: data.data.achievement_alerts
        });
        setPreferences({
          theme: data.data.theme,
          language: data.data.language,
          timezone: data.data.timezone,
          dashboard_layout: data.data.dashboard_layout
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const loadStudentProfile = async (studentId: number) => {
    try {
      const response = await fetch(`http://localhost:8001/api/auth/student_profile/?student_id=${studentId}`);
      const data = await response.json();

      if (data.status === 'success') {
        setProfile({
          name: data.data.name || '',
          gender: data.data.gender || '',
          mobile_self: data.data.mobile_self || '',
          class_level: data.data.class_level || '',
          board: data.data.board || '',
          date_of_birth: data.data.date_of_birth || '',
          address: data.data.address || '',
          parent_name: data.data.parent_name || '',
          parent_phone: data.data.parent_phone || '',
          interests: data.data.interests || '',
          profile_picture: data.data.profile_picture || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleProfileUpdate = async () => {
    if (!studentSession) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8001/api/auth/update_profile/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentSession.id,
          ...profile
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setMessage('Profile updated successfully!');
        // Update session data
        const updatedSession = { ...studentSession, ...profile };
        SessionManager.saveSession(updatedSession);
        setStudentSession(updatedSession);
      } else {
        setMessage('Error updating profile: ' + data.message);
      }
    } catch (error) {
      setMessage('Error updating profile');
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePasswordChange = async () => {
    if (!studentSession) return;

    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage('New passwords do not match');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8001/api/auth/change_password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentSession.id,
          current_password: passwordData.current_password,
          new_password: passwordData.new_password
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setMessage('Password changed successfully!');
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      } else {
        setMessage('Error changing password: ' + data.message);
      }
    } catch (error) {
      setMessage('Error changing password');
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleNotificationUpdate = async () => {
    if (!studentSession) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8001/api/auth/update_user_preferences/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentSession.id,
          ...notifications
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setMessage('Notification settings updated successfully!');
      } else {
        setMessage('Error updating settings: ' + data.message);
      }
    } catch (error) {
      setMessage('Error updating notification settings');
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePreferencesUpdate = async () => {
    if (!studentSession) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8001/api/auth/update_user_preferences/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentSession.id,
          ...preferences
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setMessage('Preferences updated successfully!');
        applyTheme(preferences.theme);
      } else {
        setMessage('Error updating preferences: ' + data.message);
      }
    } catch (error) {
      setMessage('Error updating preferences');
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const { t } = useTranslation();

  const tabs = [
    { id: 'notifications', label: t('settings.notifications'), icon: <FaBell /> },
    { id: 'privacy', label: t('settings.privacy'), icon: <FaShieldAlt /> },
    { id: 'security', label: t('settings.security'), icon: <FaLock /> },
    { id: 'preferences', label: t('settings.preferences'), icon: <FaPalette /> },
    { id: 'data', label: t('settings.dataManagement') || 'Data Management', icon: <FaDatabase /> },
    { id: 'activity', label: t('settings.activityHistory'), icon: <FaHistory /> }
  ];

  return (
    <StudentLayout>
      <div className="settings-container">
        <div className="settings-header">
          <h1>{t('settings.title')}</h1>
          <p>{t('settings.subtitle')}</p>
        </div>

        {message && (
          <div className={`settings-message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="settings-content">
          <div className="settings-sidebar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="settings-main">
            {activeTab === 'notifications' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>{t('settings.notificationSettings')}</h2>
                  <p>{t('settings.notificationDesc')}</p>
                </div>

                <div className="notification-settings">
                  <div className="notification-item">
                    <div className="notification-info">
                      <h3>{t('settings.emailNotifications')}</h3>
                      <p>{t('settings.emailNotificationsDesc')}</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.email_notifications}
                        onChange={(e) => setNotifications({ ...notifications, email_notifications: e.target.checked })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <h3>{t('settings.pushNotifications')}</h3>
                      <p>{t('settings.pushNotificationsDesc')}</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.push_notifications}
                        onChange={(e) => setNotifications({ ...notifications, push_notifications: e.target.checked })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <h3>{t('settings.assignmentReminders')}</h3>
                      <p>{t('settings.assignmentRemindersDesc')}</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.assignment_reminders}
                        onChange={(e) => setNotifications({ ...notifications, assignment_reminders: e.target.checked })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <h3>{t('settings.courseUpdates')}</h3>
                      <p>{t('settings.courseUpdatesDesc')}</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.course_updates}
                        onChange={(e) => setNotifications({ ...notifications, course_updates: e.target.checked })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <h3>{t('settings.achievementAlerts')}</h3>
                      <p>{t('settings.achievementAlertsDesc')}</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.achievement_alerts}
                        onChange={(e) => setNotifications({ ...notifications, achievement_alerts: e.target.checked })}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                <button
                  className="save-btn"
                  onClick={handleNotificationUpdate}
                  disabled={loading}
                >
                  <FaSave />
                  {loading ? t('settings.saving') : t('common.save')}
                </button>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="settings-section">
                <PrivacyDashboard
                  studentId={studentSession?.id || 0}
                  onUpdate={setMessage}
                />
              </div>
            )}

            {activeTab === 'security' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>{t('settings.securitySettings')}</h2>
                  <p>{t('settings.securityDesc')}</p>
                </div>

                <div className="security-section">
                  <h3>{t('settings.changePassword')}</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>{t('settings.currentPassword')}</label>
                      <input
                        type="password"
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>{t('settings.newPassword')}</label>
                      <input
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>{t('settings.confirmNewPassword')}</label>
                      <input
                        type="password"
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    className="save-btn"
                    onClick={handlePasswordChange}
                    disabled={loading}
                  >
                    <FaLock />
                    {loading ? t('settings.saving') : t('settings.changePassword')}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>{t('settings.appPreferences')}</h2>
                  <p>{t('settings.appPreferencesDesc')}</p>
                </div>

                <div className="preferences-grid">
                  <div className="preference-item">
                    <label>{t('settings.theme')}</label>
                    <select
                      value={preferences.theme}
                      onChange={(e) => setPreferences({ ...preferences, theme: e.target.value as 'light' | 'dark' | 'auto' })}
                    >
                      <option value="light">{t('settings.themeLight')}</option>
                      <option value="dark">{t('settings.themeDark')}</option>
                      <option value="auto">{t('settings.themeAuto')}</option>
                    </select>
                  </div>

                  <div className="preference-item">
                    <label>{t('settings.language')}</label>
                    <select
                      value={preferences.language}
                      onChange={(e) => {
                        setPreferences({ ...preferences, language: e.target.value });
                        // Also update i18n language
                        import('../i18n/i18n').then(({ changeLanguage }) => {
                          changeLanguage(e.target.value);
                        });
                      }}
                    >
                      <option value="en">English</option>
                      <option value="hi">हिंदी (Hindi)</option>
                      <option value="kn">ಕನ್ನಡ (Kannada)</option>
                      <option value="te">తెలుగు (Telugu)</option>
                    </select>
                  </div>

                  <div className="preference-item">
                    <label>{t('settings.dashboardLayout')}</label>
                    <select
                      value={preferences.dashboard_layout}
                      onChange={(e) => setPreferences({ ...preferences, dashboard_layout: e.target.value as 'compact' | 'detailed' })}
                    >
                      <option value="detailed">{t('settings.layoutDetailed')}</option>
                      <option value="compact">{t('settings.layoutCompact')}</option>
                    </select>
                  </div>
                </div>

                <button
                  className="save-btn"
                  onClick={handlePreferencesUpdate}
                  disabled={loading}
                >
                  <FaSave />
                  {loading ? t('settings.saving') : t('settings.savePreferences')}
                </button>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2 style={{ color: '#1e293b' }}>Data Management</h2>
                  <p style={{ color: '#64748b' }}>Export your data and manage your account</p>
                </div>

                <div className="data-management-tabs">
                  <div className="data-tab-content">
                    <DataExport
                      studentId={studentSession?.id || 13}
                      onMessage={setMessage}
                    />

                    <div style={{ marginTop: '32px' }}>
                      <AccountDeletion
                        studentId={studentSession?.id || 13}
                        onMessage={setMessage}
                      />
                    </div>

                    <div style={{ marginTop: '32px' }} className="privacy-info-section">
                      <div className="privacy-section">
                        <div className="section-header">
                          <h2><FaShieldAlt /> Your Privacy Rights</h2>
                          <p>Understanding your data rights and how we protect your privacy</p>
                        </div>

                        <div className="rights-grid">
                          <div className="right-item">
                            <div className="right-icon">
                              <FaShieldAlt />
                            </div>
                            <div className="right-content">
                              <h3>Right to Access</h3>
                              <p>You can request and download all your personal data at any time using the export feature above.</p>
                            </div>
                          </div>
                          <div className="right-item">
                            <div className="right-icon">
                              <FaShieldAlt />
                            </div>
                            <div className="right-content">
                              <h3>Right to Erasure</h3>
                              <p>You can request deletion of your account and all associated data with a 30-day grace period.</p>
                            </div>
                          </div>
                          <div className="right-item">
                            <div className="right-icon">
                              <FaShieldAlt />
                            </div>
                            <div className="right-content">
                              <h3>Data Portability</h3>
                              <p>Export your data in structured formats (JSON/CSV) for transfer to other platforms.</p>
                            </div>
                          </div>
                          <div className="right-item">
                            <div className="right-icon">
                              <FaShieldAlt />
                            </div>
                            <div className="right-content">
                              <h3>Data Retention</h3>
                              <p>We retain your data according to our retention policies and legal requirements.</p>
                            </div>
                          </div>
                        </div>

                        <div className="retention-info">
                          <h3>📅 Data Retention Periods</h3>
                          <div className="retention-grid">
                            <div className="retention-item">
                              <strong>Profile Data:</strong> <span>7 years after account closure</span>
                            </div>
                            <div className="retention-item">
                              <strong>Learning Progress:</strong> <span>5 years after completion</span>
                            </div>
                            <div className="retention-item">
                              <strong>Quiz Results:</strong> <span>3 years after completion</span>
                            </div>
                            <div className="retention-item">
                              <strong>Activity Logs:</strong> <span>1 year after activity</span>
                            </div>
                            <div className="retention-item">
                              <strong>Session Data:</strong> <span>3 months after session</span>
                            </div>
                          </div>
                        </div>

                        <div className="privacy-contact">
                          <h3>🤝 Privacy Questions?</h3>
                          <p>If you have questions about your privacy rights or data handling, please contact our privacy team.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <style>{`
                  .privacy-section {
                    background: linear-gradient(135deg, #f3e5f5 0%, #e8f5e8 100%);
                    color: #2c3e50;
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                    border: 1px solid #e1f5fe;
                  }
                  
                  .privacy-section .section-header h2 {
                    margin: 0 0 8px 0;
                    font-size: 24px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #1565c0;
                  }
                  
                  .privacy-section .section-header p {
                    margin: 0 0 24px 0;
                    color: #546e7a;
                  }
                  
                  .rights-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 16px;
                    margin-bottom: 24px;
                  }
                  
                  .right-item {
                    background: rgba(255,255,255,0.8);
                    padding: 20px;
                    border-radius: 8px;
                    display: flex;
                    gap: 16px;
                    border: 1px solid #e0e0e0;
                    transition: all 0.3s ease;
                  }
                  
                  .right-icon {
                    width: 40px;
                    height: 40px;
                    background: #e3f2fd;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    flex-shrink: 0;
                    color: #1565c0;
                  }
                  
                  .right-content h3 {
                    margin: 0 0 8px 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: #2e7d32;
                  }
                  
                  .right-content p {
                    margin: 0;
                    line-height: 1.5;
                    font-size: 14px;
                    color: #424242;
                  }
                  
                  .retention-info {
                    background: rgba(255,255,255,0.6);
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 20px;
                    border: 1px solid #e8f5e8;
                  }
                  
                  .retention-info h3 {
                    margin: 0 0 16px 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: #2e7d32;
                  }
                  
                  .retention-item {
                    background: rgba(255,255,255,0.7);
                    padding: 12px 16px;
                    border-radius: 6px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border: 1px solid #e8f5e8;
                  }
                  
                  .retention-item strong {
                    font-weight: 600;
                    color: #2c3e50;
                  }
                  
                  .retention-item span {
                    font-size: 14px;
                    color: #546e7a;
                  }
                  
                  .privacy-contact {
                    background: rgba(255,255,255,0.6);
                    border-radius: 8px;
                    padding: 20px;
                    text-align: center;
                    border: 1px solid #e8f5e8;
                  }
                  
                  .privacy-contact h3 {
                    margin: 0 0 12px 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: #2e7d32;
                  }
                  
                  .privacy-contact p {
                    margin: 0;
                    line-height: 1.6;
                    color: #424242;
                  }
                `}</style>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>{t('settings.activityHistory')}</h2>
                  <p>Your recent platform activities and login history</p>
                </div>

                <RealTimeActivityHistory 
                  userId={studentSession?.id || 0} 
                  userType="student" 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default Settings;