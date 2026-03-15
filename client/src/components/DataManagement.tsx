import React, { useState } from 'react';
import DataExport from './DataExport';
import AccountDeletion from './AccountDeletion';
import { FaDatabase, FaTrash, FaShieldAlt } from 'react-icons/fa';

interface DataManagementProps {
  studentId: number;
}

const DataManagement: React.FC<DataManagementProps> = ({ studentId }) => {
  const [activeSection, setActiveSection] = useState('export');
  const [message, setMessage] = useState('');

  const handleMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <div className="data-management">
      <div className="header">
        <h1>Data Management</h1>
        <p>Manage your personal data and privacy settings</p>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="tabs">
        <button
          className={`tab ${activeSection === 'export' ? 'active' : ''}`}
          onClick={() => setActiveSection('export')}
        >
          <FaDatabase />
          Export Data
        </button>
        <button
          className={`tab ${activeSection === 'delete' ? 'active' : ''}`}
          onClick={() => setActiveSection('delete')}
        >
          <FaTrash />
          Delete Account
        </button>
        <button
          className={`tab ${activeSection === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveSection('privacy')}
        >
          <FaShieldAlt />
          Privacy Info
        </button>
      </div>

      <div className="content">
        {activeSection === 'export' && (
          <DataExport studentId={studentId} onMessage={handleMessage} />
        )}
        
        {activeSection === 'delete' && (
          <AccountDeletion studentId={studentId} onMessage={handleMessage} />
        )}
        
        {activeSection === 'privacy' && (
          <div className="privacy-info">
            <h2>Your Privacy Rights</h2>
            <div className="rights-grid">
              <div className="right-item">
                <h3>Right to Access</h3>
                <p>You can request and download all your personal data at any time.</p>
              </div>
              <div className="right-item">
                <h3>Right to Erasure</h3>
                <p>You can request deletion of your account and all associated data.</p>
              </div>
              <div className="right-item">
                <h3>Data Portability</h3>
                <p>Export your data in structured formats (JSON/CSV) for transfer.</p>
              </div>
              <div className="right-item">
                <h3>Data Retention</h3>
                <p>We retain your data according to our retention policies and legal requirements.</p>
              </div>
            </div>
            
            <div className="retention-info">
              <h3>Data Retention Periods</h3>
              <ul>
                <li><strong>Profile Data:</strong> 7 years after account closure</li>
                <li><strong>Learning Progress:</strong> 5 years after completion</li>
                <li><strong>Quiz Results:</strong> 3 years after completion</li>
                <li><strong>Activity Logs:</strong> 1 year after activity</li>
                <li><strong>Session Data:</strong> 3 months after session</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .data-management {
          max-width: 1000px;
          margin: 0 auto;
          padding: 24px;
        }

        .header h1 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .header p {
          margin: 0 0 32px 0;
          color: #666;
        }

        .message {
          padding: 12px 16px;
          border-radius: 4px;
          margin-bottom: 24px;
        }

        .message.success {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
        }

        .message.error {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
        }

        .tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 24px;
          border-bottom: 1px solid #ddd;
        }

        .tab {
          background: none;
          border: none;
          padding: 12px 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          border-bottom: 2px solid transparent;
        }

        .tab.active {
          color: #007bff;
          border-bottom-color: #007bff;
        }

        .tab:hover {
          color: #007bff;
        }

        .privacy-info {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .privacy-info h2 {
          margin: 0 0 24px 0;
          color: #333;
        }

        .rights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .right-item {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #007bff;
        }

        .right-item h3 {
          margin: 0 0 12px 0;
          color: #333;
        }

        .right-item p {
          margin: 0;
          color: #666;
          line-height: 1.5;
        }

        .retention-info {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 20px;
        }

        .retention-info h3 {
          margin: 0 0 16px 0;
          color: #856404;
        }

        .retention-info ul {
          margin: 0;
          padding-left: 20px;
        }

        .retention-info li {
          margin-bottom: 8px;
          color: #856404;
        }

        .retention-info strong {
          color: #533f03;
        }
      `}</style>
    </div>
  );
};

export default DataManagement;