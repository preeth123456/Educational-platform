import React, { useState } from 'react';
import DataManagement from '../components/DataManagement';
import { FaUser, FaCog, FaDatabase, FaBell } from 'react-icons/fa';

interface SettingsPageProps {
  studentId: number;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ studentId }) => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="settings-nav">
        <button
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FaUser />
          Profile
        </button>
        <button
          className={`nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          <FaCog />
          Preferences
        </button>
        <button
          className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <FaBell />
          Notifications
        </button>
        <button
          className={`nav-item ${activeTab === 'data' ? 'active' : ''}`}
          onClick={() => setActiveTab('data')}
        >
          <FaDatabase />
          Data Management
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'profile' && (
          <div className="tab-content">
            <h2>Profile Settings</h2>
            <p>Update your profile information here.</p>
            {/* Profile settings form would go here */}
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="tab-content">
            <h2>Preferences</h2>
            <p>Customize your learning experience.</p>
            {/* Preferences form would go here */}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="tab-content">
            <h2>Notification Settings</h2>
            <p>Manage your notification preferences.</p>
            {/* Notification settings would go here */}
          </div>
        )}

        {activeTab === 'data' && (
          <DataManagement studentId={studentId} />
        )}
      </div>

      <style jsx>{`
        .settings-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
        }

        .settings-header h1 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .settings-header p {
          margin: 0 0 32px 0;
          color: #666;
        }

        .settings-nav {
          display: flex;
          gap: 4px;
          margin-bottom: 32px;
          border-bottom: 1px solid #ddd;
          overflow-x: auto;
        }

        .nav-item {
          background: none;
          border: none;
          padding: 12px 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          border-bottom: 2px solid transparent;
          white-space: nowrap;
          min-width: fit-content;
        }

        .nav-item.active {
          color: #007bff;
          border-bottom-color: #007bff;
        }

        .nav-item:hover {
          color: #007bff;
        }

        .settings-content {
          min-height: 400px;
        }

        .tab-content {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .tab-content h2 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .tab-content p {
          margin: 0;
          color: #666;
        }

        @media (max-width: 768px) {
          .settings-page {
            padding: 16px;
          }

          .settings-nav {
            flex-wrap: wrap;
          }

          .nav-item {
            flex: 1;
            min-width: 120px;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;