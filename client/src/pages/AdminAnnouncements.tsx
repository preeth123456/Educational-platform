import React, { useState, useEffect } from 'react';
import { FaBullhorn, FaUsers, FaChalkboardTeacher, FaPaperPlane, FaHistory, FaTrash, FaEye } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import '../Dashboard.css';

interface Announcement {
  id: string;
  title: string;
  message: string;
  targetAudience: 'students' | 'teachers' | 'all';
  sentAt: Date;
  status: 'sent' | 'sending' | 'failed';
}

const AdminAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    targetAudience: 'all' as 'students' | 'teachers' | 'all'
  });

  const [isSending, setIsSending] = useState(false);

  // Load announcements from API
  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const response = await fetch('http://localhost:8001/api/courses/admin_announcements/');
        const data = await response.json();

        if (data.status === 'success') {
          const formattedAnnouncements: Announcement[] = data.data.map((item: any) => ({
            id: item.id.toString(),
            title: item.title,
            message: item.message,
            targetAudience: item.target_audience as 'students' | 'teachers' | 'all',
            sentAt: new Date(item.sent_at),
            status: item.status as 'sent' | 'sending' | 'failed'
          }));

          setAnnouncements(formattedAnnouncements);
        }
      } catch (error) {
        console.error('Error loading announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnnouncements();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(announcements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnnouncements = announcements.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSendAnnouncement = async () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.message.trim()) {
      alert('Please fill in both title and message');
      return;
    }

    setIsSending(true);

    try {
      // Call the backend API
      const response = await fetch('http://localhost:8001/api/courses/admin_announcement/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newAnnouncement.title,
          message: newAnnouncement.message,
          target_audience: newAnnouncement.targetAudience
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Reload announcements from API to get the latest data
        const loadAnnouncements = async () => {
          try {
            const response = await fetch('http://localhost:8001/api/courses/admin_announcements/');
            const data = await response.json();

            if (data.status === 'success') {
              const formattedAnnouncements: Announcement[] = data.data.map((item: any) => ({
                id: item.id.toString(),
                title: item.title,
                message: item.message,
                targetAudience: item.target_audience as 'students' | 'teachers' | 'all',
                sentAt: new Date(item.sent_at),
                status: item.status as 'sent' | 'sending' | 'failed'
              }));

              setAnnouncements(formattedAnnouncements);
            }
          } catch (error) {
            console.error('Error reloading announcements:', error);
          }
        };

        await loadAnnouncements();

        // Reset form
        setNewAnnouncement({
          title: '',
          message: '',
          targetAudience: 'all'
        });

        alert(`Announcement sent successfully! ${data.message}`);

      } else {
        throw new Error(data.message || 'Failed to send announcement');
      }

    } catch (error) {
      console.error('Error sending announcement:', error);
      alert('Failed to send announcement. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(prev => prev.filter(ann => ann.id !== id));
    }
  };

  const getAudienceLabel = (audience: string) => {
    switch (audience) {
      case 'students': return 'Students';
      case 'teachers': return 'Teachers';
      case 'all': return 'All Users';
      default: return audience;
    }
  };

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'students': return <FaUsers className="audience-icon students" />;
      case 'teachers': return <FaChalkboardTeacher className="audience-icon teachers" />;
      case 'all': return <FaBullhorn className="audience-icon all" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'success';
      case 'sending': return 'warning';
      case 'failed': return 'danger';
      default: return 'info';
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
                <h1 className="hero-title">Announcements</h1>
                <p className="hero-subtitle">Send important messages, reminders, and updates to students and teachers</p>
              </div>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header" style={{ marginBottom: '0' }}>
              <div className="section-title">
                <FaBullhorn className="section-icon" />
                <h2>Send New Announcement</h2>
              </div>
            </div>

            <div className="announcement-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Announcement Title</label>
                  <input
                    type="text"
                    id="title"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Holiday Announcement, Exam Reminder"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="audience">Target Audience</label>
                  <select
                    id="audience"
                    value={newAnnouncement.targetAudience}
                    onChange={(e) => setNewAnnouncement(prev => ({
                      ...prev,
                      targetAudience: e.target.value as 'students' | 'teachers' | 'all'
                    }))}
                    className="form-input"
                  >
                    <option value="all">All Users (Students & Teachers)</option>
                    <option value="students">Students Only</option>
                    <option value="teachers">Teachers Only</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  value={newAnnouncement.message}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter your announcement message here..."
                  className="form-textarea"
                  rows={6}
                />
              </div>

              <div className="form-actions">
                <button
                  onClick={handleSendAnnouncement}
                  disabled={isSending}
                  className="btn-primary"
                >
                  {isSending ? (
                    <>
                      <div className="spinner"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Send Announcement
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Announcement History */}
          <div className="dashboard-section">
            <div className="section-header" style={{ marginBottom: '0' }}>
              <div className="section-title">
                <FaHistory className="section-icon" />
                <h2>Announcement History</h2>
              </div>
            </div>

            <div className="announcements-list">
              {announcements.length === 0 ? (
                <div className="no-announcements">
                  <FaBullhorn className="no-icon" />
                  <h3>No announcements sent yet</h3>
                  <p>Create your first announcement above</p>
                </div>
              ) : (
                <>
                  <div style={{
                    padding: '10px 20px',
                    borderBottom: '1px solid #e2e8f0',
                    background: '#f8f9fa'
                  }}>
                    <h3 style={{ margin: 0, color: '#2d3748' }}>
                      Announcement History ({startIndex + 1}-{Math.min(endIndex, announcements.length)} of {announcements.length})
                    </h3>
                  </div>

                  {currentAnnouncements.map((announcement) => {
                    return (
                      <div key={announcement.id} className="announcement-card">
                    <div className="announcement-header">
                      <div className="announcement-title-section">
                        <h3>{announcement.title}</h3>
                        <div className="announcement-meta">
                          {getAudienceIcon(announcement.targetAudience)}
                          <span className="audience-label">
                            {getAudienceLabel(announcement.targetAudience)}
                          </span>
                          <span className="sent-date">
                            {announcement.sentAt.toLocaleDateString()} at {announcement.sentAt.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <div className="announcement-actions">
                        <span className={`status-badge ${getStatusColor(announcement.status)}`}>
                          {announcement.status}
                        </span>
                        <button
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
                          className="btn-icon delete-btn"
                          title="Delete announcement"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    <div className="announcement-content">
                      <p>{announcement.message}</p>
                    </div>

                    <div className="announcement-footer">
                      <div className="delivery-info">
                        {announcement.targetAudience === 'students' && (
                          <span className="delivery-method">
                            <FaEye /> Delivered via in-app notifications
                          </span>
                        )}
                        {announcement.targetAudience === 'teachers' && (
                          <span className="delivery-method">
                            <FaPaperPlane /> Delivered via email
                          </span>
                        )}
                        {announcement.targetAudience === 'all' && (
                          <span className="delivery-method">
                            <FaEye /> Students: in-app notifications | <FaPaperPlane /> Teachers: email
                          </span>
                        )}
                      </div>
                    </div>
                      </div>
                    );
                  })}

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div style={{
                      padding: '20px',
                      borderTop: '1px solid #e2e8f0',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          backgroundColor: currentPage === 1 ? '#f3f4f6' : 'white',
                          color: currentPage === 1 ? '#9ca3af' : '#374151',
                          borderRadius: '6px',
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        ‹ Previous
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            backgroundColor: currentPage === page ? '#667eea' : 'white',
                            color: currentPage === page ? 'white' : '#374151',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: currentPage === page ? '600' : '400',
                            transition: 'all 0.2s ease',
                            minWidth: '40px'
                          }}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={{
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          backgroundColor: currentPage === totalPages ? '#f3f4f6' : 'white',
                          color: currentPage === totalPages ? '#9ca3af' : '#374151',
                          borderRadius: '6px',
                          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        Next ›
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnnouncements;