import React, { useState, useEffect } from 'react';
import { FaBullhorn, FaFilter, FaPaperclip, FaEye } from 'react-icons/fa';
import './AnnouncementsFeed.css';

interface Announcement {
  id: number;
  title: string;
  body: string;
  priority: 'high' | 'medium' | 'low';
  target_group: string;
  attachment_url?: string;
  created_by: string;
  created_at: string;
  viewed: boolean;
}

interface AnnouncementsFeedProps {
  userId: number;
  userRole: 'student' | 'teacher' | 'admin';
}

const AnnouncementsFeed: React.FC<AnnouncementsFeedProps> = ({ userId, userRole }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, [userId]);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`http://localhost:8001/api/announcements/?user_id=${userId}`);
      const data = await response.json();
      if (data.status === 'success') {
        setAnnouncements(data.data);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      // Fallback data
      setAnnouncements([
        {
          id: 1,
          title: 'New Course Available: Advanced React',
          body: 'We are excited to announce a new advanced React course starting next week. This course covers hooks, context, and performance optimization.',
          priority: 'high',
          target_group: 'All Students',
          created_by: 'Admin Team',
          created_at: '2025-01-15T10:00:00Z',
          viewed: false
        },
        {
          id: 2,
          title: 'System Maintenance Scheduled',
          body: 'The learning platform will undergo maintenance on Sunday from 2 AM to 4 AM. Please save your work before this time.',
          priority: 'medium',
          target_group: 'All Users',
          created_by: 'Tech Team',
          created_at: '2025-01-14T15:30:00Z',
          viewed: true
        }
      ]);
    }
  };

  const markAsViewed = async (announcementId: number) => {
    try {
      await fetch(`http://localhost:8001/api/announcements/${announcementId}/view/`, {
        method: 'POST'
      });
      
      setAnnouncements(prev => 
        prev.map(a => a.id === announcementId ? { ...a, viewed: true } : a)
      );
    } catch (error) {
      console.error('Error marking announcement as viewed:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const filteredAnnouncements = announcements.filter(a => 
    filter === 'all' || a.priority === filter
  );

  const toggleExpanded = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
    if (!announcements.find(a => a.id === id)?.viewed) {
      markAsViewed(id);
    }
  };

  return (
    <div className="announcements-feed">
      <div className="announcements-header">
        <h3><FaBullhorn /> Announcements</h3>
        <div className="filter-controls">
          <FaFilter />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="announcements-list">
        {filteredAnnouncements.length === 0 ? (
          <div className="no-announcements">No announcements</div>
        ) : (
          filteredAnnouncements.map(announcement => (
            <div 
              key={announcement.id} 
              className={`announcement-item ${!announcement.viewed ? 'unviewed' : ''}`}
            >
              <div className="announcement-header-item">
                <div className="announcement-meta">
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(announcement.priority) }}
                  >
                    {announcement.priority.toUpperCase()}
                  </span>
                  <span className="target-group">{announcement.target_group}</span>
                  <span className="created-by">by {announcement.created_by}</span>
                </div>
                <div className="announcement-date">
                  {new Date(announcement.created_at).toLocaleDateString()}
                </div>
              </div>

              <h4 
                className="announcement-title"
                onClick={() => toggleExpanded(announcement.id)}
              >
                {announcement.title}
                {!announcement.viewed && <div className="unviewed-indicator"></div>}
              </h4>

              {expandedId === announcement.id && (
                <div className="announcement-body">
                  <p>{announcement.body}</p>
                  {announcement.attachment_url && (
                    <div className="attachment">
                      <FaPaperclip />
                      <a href={announcement.attachment_url} target="_blank" rel="noopener noreferrer">
                        View Attachment
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div className="announcement-actions">
                <button 
                  onClick={() => toggleExpanded(announcement.id)}
                  className="view-btn"
                >
                  <FaEye /> {expandedId === announcement.id ? 'Collapse' : 'Read More'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnnouncementsFeed;
