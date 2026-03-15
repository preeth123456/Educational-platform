import React, { useState, useEffect } from 'react';
import { FaDownload, FaFileExport, FaSpinner, FaCheck, FaExclamationTriangle, FaTrash } from 'react-icons/fa';

interface DataExportProps {
  studentId: number;
  onMessage: (message: string) => void;
}

interface ExportRequest {
  id: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  format: 'pdf';
  created_at: string;
  expires_at: string;
}

const DataExport: React.FC<DataExportProps> = ({ studentId, onMessage }) => {
  const [loading, setLoading] = useState(false);
  const [exportRequests, setExportRequests] = useState<ExportRequest[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<'pdf'>('pdf');

  useEffect(() => {
    loadExportHistory();
  }, [studentId]);

  const loadExportHistory = async () => {
    try {
      const response = await fetch(`http://localhost:8001/api/auth/export_history/?student_id=${studentId}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setExportRequests(data.data);
      }
    } catch (error) {
      console.error('Error loading export history:', error);
    }
  };

  const requestDataExport = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8001/api/auth/export_data/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentId,
          format: selectedFormat
        }),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        onMessage('Data export request submitted. You will be notified when ready.');
        loadExportHistory();
        
        // Poll for status updates
        pollExportStatus(data.export_id);
      } else {
        onMessage('Error requesting data export: ' + data.message);
      }
    } catch (error) {
      onMessage('Error requesting data export');
    }
    setLoading(false);
  };

  const pollExportStatus = async (exportId: number) => {
    const maxAttempts = 30; // 5 minutes with 10-second intervals
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`http://localhost:8001/api/auth/export_status/${exportId}/`);
        const data = await response.json();
        
        if (data.status === 'success') {
          if (data.export_status === 'completed') {
            onMessage('Your data export is ready for download!');
            loadExportHistory();
            return;
          } else if (data.export_status === 'failed') {
            onMessage('Data export failed. Please try again.');
            loadExportHistory();
            return;
          }
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Poll every 10 seconds
        }
      } catch (error) {
        console.error('Error polling export status:', error);
      }
    };

    setTimeout(poll, 10000); // Start polling after 10 seconds
  };

  const downloadExport = async (exportId: number) => {
    try {
      const response = await fetch(`http://localhost:8001/api/auth/download_data/${exportId}/`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Get filename from response headers or use default
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'student_data_export';
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }
        
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        onMessage('Data export downloaded successfully!');
      } else {
        const errorData = await response.json();
        onMessage('Error downloading export: ' + errorData.message);
      }
    } catch (error) {
      onMessage('Error downloading export');
    }
  };

  const deleteExportRequest = async (exportId: number) => {
    try {
      const response = await fetch(`http://localhost:8001/api/auth/delete_export/${exportId}/`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        onMessage('Export request deleted successfully');
        loadExportHistory();
      } else {
        onMessage('Error deleting export request');
      }
    } catch (error) {
      onMessage('Error deleting export request');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'processing':
        return <FaSpinner className="spin" />;
      case 'completed':
        return <FaCheck className="text-green-500" />;
      case 'failed':
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="data-export-section">
      <div className="section-header">
        <h2 style={{color: '#1e293b'}}>Data Export</h2>
        <p style={{color: '#64748b'}}>Download all your personal data and learning history</p>
      </div>

      <div className="export-form">
        <div className="form-group">
          <label>Export Format</label>
          <div className="format-display">
            <div className="format-badge">📄 PDF - Complete Data Report</div>
            <p className="format-description">
              All your data will be exported as a comprehensive PDF document with organized sections and tables.
            </p>
          </div>
        </div>

        <div className="export-info">
          <h3>What's included in your export:</h3>
          <ul>
            <li>Complete profile information with all fields</li>
            <li>Course enrollments and detailed progress tracking</li>
            <li>Quiz results, scores, and performance analytics</li>
            <li>Badges, achievements, and skill endorsements</li>
            <li>Complete activity history and learning timeline</li>
            <li>User preferences and system settings</li>
            <li>Consent history and privacy records</li>
            <li>All database tables and columns connected to your account</li>
          </ul>
        </div>

        <button
          className="export-btn"
          onClick={requestDataExport}
          disabled={loading}
        >
          <FaFileExport />
          {loading ? 'Generating PDF Export...' : 'Generate Complete PDF Export'}
        </button>
      </div>

      {exportRequests.length > 0 && (
        <div className="export-history">
          <h3>Export History</h3>
          <div className="export-list">
            {exportRequests.map((request) => (
              <div key={request.id} className="export-item">
                <div className="export-info">
                  <div className="export-details">
                    <span className="export-format">{request.format.toUpperCase()}</span>
                    <span className="export-date">
                      Requested: {formatDate(request.created_at)}
                    </span>
                    <span className="export-expires">
                      Expires: {formatDate(request.expires_at)}
                    </span>
                  </div>
                  <div className="export-status">
                    {getStatusIcon(request.status)}
                    <span className={`status-text status-${request.status}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                {request.status === 'completed' && (
                  <button
                    className="download-btn"
                    onClick={() => downloadExport(request.id)}
                  >
                    <FaDownload />
                    Download
                  </button>
                )}
                
                {request.status === 'failed' && (
                  <button
                    className="delete-btn"
                    onClick={() => deleteExportRequest(request.id)}
                  >
                    <FaTrash />
                    Clear
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

        <div className="export-notice">
          <p>
            <strong>Note:</strong> PDF export files are available for 7 days after generation.
            Your complete data will be exported as a comprehensive PDF document with all information
            from connected database tables organized in professional format with tables and sections.
          </p>
        </div>

      <style jsx>{`
        .data-export-section {
          background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%);
          color: #2c3e50;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          border: 1px solid #e3f2fd;
        }

        .section-header h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 600;
          color: #1565c0;
        }

        .section-header p {
          margin: 0 0 24px 0;
          color: #546e7a;
        }

        .export-form {
          background: rgba(255,255,255,0.8);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
          border: 1px solid #e1f5fe;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #37474f;
        }

        .format-display {
          background: rgba(255,255,255,0.9);
          padding: 16px;
          border-radius: 8px;
          border: 2px solid #e3f2fd;
        }

        .format-badge {
          display: block;
          background: linear-gradient(45deg, #1976d2, #42a5f5);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 12px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(25,118,210,0.3);
        }

        .format-description {
          margin: 8px 0 0 0;
          color: #546e7a;
          font-size: 14px;
          line-height: 1.4;
        }

        .export-info {
          background: rgba(255,255,255,0.15);
          padding: 16px;
          border-radius: 8px;
          margin: 16px 0;
        }

        .export-info h3 {
          margin: 0 0 12px 0;
          font-size: 16px;
        }

        .export-info ul {
          margin: 0;
          padding-left: 20px;
        }

        .export-info li {
          margin-bottom: 4px;
          opacity: 0.9;
        }

        .export-btn {
          background: linear-gradient(45deg, #28a745, #20c997);
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 8px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.3s ease;
          width: 100%;
          margin-top: 20px;
          box-shadow: 0 4px 12px rgba(40,167,69,0.3);
        }

        .export-btn:hover:not(:disabled) {
          background: #218838;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(40,167,69,0.3);
        }

        .export-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .export-history {
          background: white;
          color: #333;
          border-radius: 8px;
          padding: 20px;
          margin-top: 24px;
        }

        .export-history h3 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .export-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          margin-bottom: 8px;
          transition: all 0.3s ease;
        }

        .export-item:hover {
          border-color: #667eea;
          box-shadow: 0 2px 8px rgba(102,126,234,0.1);
        }

        .export-format {
          font-weight: 600;
          color: #667eea;
          background: rgba(102,126,234,0.1);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .export-date, .export-expires {
          font-size: 12px;
          color: #6c757d;
        }

        .status-pending, .status-processing {
          color: #ffc107;
        }

        .status-completed {
          color: #28a745;
        }

        .status-failed {
          color: #dc3545;
        }

        .download-btn {
          background: linear-gradient(45deg, #28a745, #20c997);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .download-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(40,167,69,0.3);
        }

        .delete-btn {
          background: linear-gradient(45deg, #dc3545, #c82333);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .delete-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(220,53,69,0.3);
        }

        .export-notice {
          background: rgba(255,193,7,0.1);
          border: 1px solid rgba(255,193,7,0.3);
          border-radius: 8px;
          padding: 16px;
          margin-top: 24px;
        }

        .export-notice p {
          margin: 0;
          color: #000000;
          font-size: 14px;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DataExport;