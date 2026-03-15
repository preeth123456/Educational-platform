import React, { useState, useEffect } from 'react';
import { FaUsers, FaPlus, FaComments, FaShare, FaTrophy, FaSearch, FaFire, FaStar } from 'react-icons/fa';
import Layout from '../components/Layout';
import SessionManager from '../utils/sessionManager';
import './Collaboration.css';

interface CollaborationGroup {
  id: number;
  name: string;
  description: string;
  subject: string;
  member_count: number;
  created_by: string;
  created_at: string;
  unread_messages: number;
}

const Collaboration: React.FC = () => {
  const [groups, setGroups] = useState<CollaborationGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const session = SessionManager.getSession();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch(`http://localhost:8001/api/collaboration/groups/?student_id=${session?.id}`);
      const data = await response.json();
      if (data.status === 'success') {
        setGroups(data.groups);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || group.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const subjects = ['All', ...Array.from(new Set(groups.map(g => g.subject)))];

  return (
    <Layout>
      <div className="collaboration-container">
        {/* Hero Section */}
        <div className="collaboration-hero">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                <FaUsers className="hero-icon" />
                Collaboration Hub
              </h1>
              <p className="hero-subtitle">
                Connect, Learn, and Grow Together with Your Peers
              </p>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <FaUsers className="stat-icon" />
                <div>
                  <div className="stat-number">{groups.length}</div>
                  <div className="stat-label">Groups Joined</div>
                </div>
              </div>
              <div className="stat-item">
                <FaComments className="stat-icon" />
                <div>
                  <div className="stat-number">{groups.reduce((sum, g) => sum + g.unread_messages, 0)}</div>
                  <div className="stat-label">New Messages</div>
                </div>
              </div>
              <div className="stat-item">
                <FaTrophy className="stat-icon" />
                <div>
                  <div className="stat-number">250</div>
                  <div className="stat-label">Points Earned</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="collaboration-controls">
          <div className="search-section">
            <div className="search-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="subject-filter"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="create-group-btn"
          >
            <FaPlus /> Create Group
          </button>
        </div>

        {/* Groups Grid */}
        <div className="groups-section">
          <h2 className="section-title">
            <FaFire className="section-icon" />
            Active Study Groups
          </h2>
          
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading your groups...</p>
            </div>
          ) : (
            <div className="groups-grid">
              {filteredGroups.map(group => (
                <div key={group.id} className="group-card">
                  <div className="group-header">
                    <div className="group-subject">{group.subject}</div>
                    {group.unread_messages > 0 && (
                      <div className="unread-badge">{group.unread_messages}</div>
                    )}
                  </div>
                  
                  <div className="group-content">
                    <h3 className="group-name">{group.name}</h3>
                    <p className="group-description">{group.description}</p>
                    
                    <div className="group-meta">
                      <div className="meta-item">
                        <FaUsers className="meta-icon" />
                        <span>{group.member_count} members</span>
                      </div>
                      <div className="meta-item">
                        <FaStar className="meta-icon" />
                        <span>Created by {group.created_by}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group-actions">
                    <button className="action-btn primary">
                      <FaComments /> Join Discussion
                    </button>
                    <button className="action-btn secondary">
                      <FaShare /> Share Files
                    </button>
                  </div>
                </div>
              ))}
              
              {filteredGroups.length === 0 && !loading && (
                <div className="empty-state">
                  <FaUsers className="empty-icon" />
                  <h3>No Groups Found</h3>
                  <p>Create or join a study group to start collaborating!</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="create-first-group-btn"
                  >
                    <FaPlus /> Create Your First Group
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Create Group Modal */}
        {showCreateModal && (
          <CreateGroupModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              fetchGroups();
            }}
          />
        )}
      </div>
    </Layout>
  );
};

const CreateGroupModal: React.FC<{
  onClose: () => void;
  onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subject: 'Mathematics'
  });
  const [loading, setLoading] = useState(false);

  const session = SessionManager.getSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8001/api/collaboration/groups/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          student_id: session?.id
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Study Group</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="create-group-form">
          <div className="form-group">
            <label>Group Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Advanced Mathematics Study Group"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Subject</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="English">English</option>
              <option value="History">History</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe what this group is about..."
              rows={3}
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Collaboration;