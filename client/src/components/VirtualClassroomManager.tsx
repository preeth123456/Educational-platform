import React, { useState, useEffect } from 'react';
import SessionManager from '@/utils/sessionManager';
import StartConferenceModal from './StartConferenceModal';
import VideoConferenceRoom from './VideoConferenceRoom';
import './VirtualClassroom.css';

interface VirtualClassroom {
  id: number;
  classroom_id: string;
  title: string;
  description: string;
  classroom_code: string;
  student_count: number;
  created_at: string;
}

interface VirtualClassroomManagerProps {
  courseId: number;
  courseTitle: string;
  onClose: () => void;
}

const VirtualClassroomManager: React.FC<VirtualClassroomManagerProps> = ({ courseId, courseTitle, onClose }) => {
  const [classrooms, setClassrooms] = useState<VirtualClassroom[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<VirtualClassroom | null>(null);
  const [newClassroom, setNewClassroom] = useState({ title: '', description: '', max_students: 50 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sessions');
  const [sessions, setSessions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [resources, setResources] = useState([]);
  const [conferences, setConferences] = useState([]);
  const [showStartConference, setShowStartConference] = useState(false);
  const [showVideoRoom, setShowVideoRoom] = useState(false);
  const [currentConference, setCurrentConference] = useState<any>(null);
  const [newSession, setNewSession] = useState({ title: '', description: '', scheduled_date: '', duration_minutes: 60 });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '', is_urgent: false });
  const [newResource, setNewResource] = useState({ title: '', description: '', resource_type: 'document', file_url: '' });

  const session = SessionManager.getSession();

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const response = await fetch(`http://localhost:8001/api/classrooms/teacher/?teacher_id=${session?.id}`);
      const result = await response.json();
      if (result.success) {
        setClassrooms(result.classrooms);
      }
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const createClassroom = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/classrooms/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: courseId,
          teacher_id: session?.id,
          ...newClassroom
        })
      });
      const result = await response.json();
      if (result.success) {
        setShowCreateModal(false);
        setNewClassroom({ title: '', description: '', max_students: 50 });
        fetchClassrooms();
      }
    } catch (error) {
      console.error('Error creating classroom:', error);
    }
  };

  const manageClassroom = (classroom: VirtualClassroom) => {
    setSelectedClassroom(classroom);
    setShowManageModal(true);
    fetchClassroomData(classroom.id);
  };

  const fetchClassroomData = async (classroomId: number) => {
    try {
      // Fetch sessions
      const sessionsResponse = await fetch(`http://localhost:8001/api/classrooms/${classroomId}/sessions/`);
      const sessionsResult = await sessionsResponse.json();
      if (sessionsResult.success) {
        setSessions(sessionsResult.sessions);
      }
      
      // Fetch announcements
      const announcementsResponse = await fetch(`http://localhost:8001/api/classrooms/${classroomId}/announcements/`);
      const announcementsResult = await announcementsResponse.json();
      if (announcementsResult.success) {
        setAnnouncements(announcementsResult.announcements);
      }
      
      // Fetch resources
      const resourcesResponse = await fetch(`http://localhost:8001/api/classrooms/${classroomId}/resources/`);
      const resourcesResult = await resourcesResponse.json();
      if (resourcesResult.success) {
        setResources(resourcesResult.resources);
      }
      
      // Fetch conferences
      const conferencesResponse = await fetch(`http://localhost:8001/api/classrooms/${classroomId}/conferences/`);
      const conferencesResult = await conferencesResponse.json();
      if (conferencesResult.success) {
        setConferences(conferencesResult.conferences);
      }
    } catch (error) {
      console.error('Error fetching classroom data:', error);
    }
  };

  const addSession = async () => {
    if (!selectedClassroom || !newSession.title || !newSession.scheduled_date) return;
    
    try {
      const response = await fetch(`http://localhost:8001/api/classrooms/${selectedClassroom.id}/sessions/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSession)
      });
      
      const result = await response.json();
      if (result.success) {
        setNewSession({ title: '', description: '', scheduled_date: '', duration_minutes: 60 });
        fetchClassroomData(selectedClassroom.id); // Refresh sessions
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const addAnnouncement = async () => {
    if (!selectedClassroom || !newAnnouncement.title || !newAnnouncement.message) return;
    
    try {
      const response = await fetch(`http://localhost:8001/api/classrooms/${selectedClassroom.id}/announcements/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newAnnouncement,
          teacher_id: session?.id
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setNewAnnouncement({ title: '', message: '', is_urgent: false });
        fetchClassroomData(selectedClassroom.id);
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };

  const addResource = async () => {
    if (!selectedClassroom || !newResource.title || !newResource.file_url) return;
    
    try {
      const response = await fetch(`http://localhost:8001/api/classrooms/${selectedClassroom.id}/resources/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newResource,
          teacher_id: session?.id
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setNewResource({ title: '', description: '', resource_type: 'document', file_url: '' });
        fetchClassroomData(selectedClassroom.id);
      }
    } catch (error) {
      console.error('Error creating resource:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: showManageModal ? '1000px' : '800px', width: '90%' }}>
        <div className="modal-header">
          <h2>🏫 Virtual Classrooms - {courseTitle}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {!showManageModal ? (
            <>
              <div className="classroom-actions">
                <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                  ➕ Create New Classroom
                </button>
              </div>

              {loading ? (
                <div className="loading">Loading classrooms...</div>
              ) : (
                <div className="classrooms-grid">
                  {classrooms.map(classroom => (
                    <div key={classroom.id} className="classroom-card">
                      <div className="classroom-header">
                        <h3>{classroom.title}</h3>
                        <span className="classroom-code">Code: {classroom.classroom_code}</span>
                      </div>
                      <p>{classroom.description}</p>
                      <div className="classroom-stats">
                        <span>👥 {classroom.student_count} students</span>
                        <span>📅 {new Date(classroom.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="classroom-actions">
                        <button className="btn-secondary" onClick={() => manageClassroom(classroom)}>Manage</button>
                        <button className="btn-primary" onClick={() => { setSelectedClassroom(classroom); setShowStartConference(true); }}>🎥 Start Live Class</button>
                        <button className="btn-outline" onClick={() => navigator.clipboard.writeText(classroom.classroom_code)}>Copy Code</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="classroom-management">
              <div className="management-header">
                <h3>{selectedClassroom?.title}</h3>
                <button className="btn-secondary" onClick={() => setShowManageModal(false)}>← Back</button>
              </div>
              
              <div className="management-tabs">
                <button className={activeTab === 'sessions' ? 'tab active' : 'tab'} onClick={() => setActiveTab('sessions')}>📅 Sessions</button>
                <button className={activeTab === 'conferences' ? 'tab active' : 'tab'} onClick={() => setActiveTab('conferences')}>🎥 Live Classes</button>
                <button className={activeTab === 'announcements' ? 'tab active' : 'tab'} onClick={() => setActiveTab('announcements')}>📢 Announcements</button>
                <button className={activeTab === 'resources' ? 'tab active' : 'tab'} onClick={() => setActiveTab('resources')}>📁 Resources</button>
                <button className={activeTab === 'students' ? 'tab active' : 'tab'} onClick={() => setActiveTab('students')}>👥 Students</button>
              </div>

              <div className="tab-content">
                {activeTab === 'sessions' && (
                  <div className="sessions-tab">
                    <div className="add-form">
                      <h4>Schedule New Session</h4>
                      <input type="text" placeholder="Session Title" value={newSession.title} onChange={(e) => setNewSession({...newSession, title: e.target.value})} />
                      <input type="datetime-local" value={newSession.scheduled_date} onChange={(e) => setNewSession({...newSession, scheduled_date: e.target.value})} />
                      <input type="number" placeholder="Duration (minutes)" value={newSession.duration_minutes} onChange={(e) => setNewSession({...newSession, duration_minutes: parseInt(e.target.value)})} />
                      <button className="btn-primary" onClick={addSession}>Add Session</button>
                    </div>
                    <div className="sessions-list">
                      {sessions.map((session: any) => (
                        <div key={session.id} className="session-item">
                          <h5>{session.title}</h5>
                          <p>📅 {new Date(session.scheduled_date).toLocaleString()}</p>
                          <span className={`status ${session.status}`}>{session.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'conferences' && (
                  <div className="conferences-tab">
                    <div className="conferences-header">
                      <h4>Live Video Classes</h4>
                      <button className="btn-primary" onClick={() => setShowStartConference(true)}>
                        🎥 Start New Live Class
                      </button>
                    </div>
                    <div className="conferences-list">
                      {conferences.map((conference: any) => (
                        <div key={conference.id} className={`conference-item ${conference.status}`}>
                          <div className="conference-header">
                            <h5>{conference.meeting_id}</h5>
                            <span className={`status ${conference.status}`}>{conference.status}</span>
                          </div>
                          <div className="conference-details">
                            <p>📅 {conference.scheduled_start ? new Date(conference.scheduled_start).toLocaleString() : 'Not scheduled'}</p>
                            <p>👥 Max: {conference.max_participants} participants</p>
                          </div>
                          {conference.status === 'live' && (
                            <button 
                              className="btn-primary"
                              onClick={() => {
                                setCurrentConference(conference);
                                setShowVideoRoom(true);
                              }}
                            >
                              🔴 Join Live Class
                            </button>
                          )}
                        </div>
                      ))}
                      {conferences.length === 0 && (
                        <div className="empty-state">
                          <p>No live classes created yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'announcements' && (
                  <div className="announcements-tab">
                    <div className="add-form">
                      <h4>Create Announcement</h4>
                      <input type="text" placeholder="Title" value={newAnnouncement.title} onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})} />
                      <textarea placeholder="Message" value={newAnnouncement.message} onChange={(e) => setNewAnnouncement({...newAnnouncement, message: e.target.value})} />
                      <label><input type="checkbox" checked={newAnnouncement.is_urgent} onChange={(e) => setNewAnnouncement({...newAnnouncement, is_urgent: e.target.checked})} /> Urgent</label>
                      <button className="btn-primary" onClick={addAnnouncement}>Post Announcement</button>
                    </div>
                    <div className="announcements-list">
                      {announcements.map((announcement: any) => (
                        <div key={announcement.id} className={`announcement-item ${announcement.is_urgent ? 'urgent' : ''}`}>
                          <h5>{announcement.title} {announcement.is_urgent && '🚨'}</h5>
                          <p>{announcement.message}</p>
                          <small>📅 {announcement.created_at}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div className="resources-tab">
                    <div className="add-form">
                      <h4>Add Resource</h4>
                      <input type="text" placeholder="Resource Title" value={newResource.title} onChange={(e) => setNewResource({...newResource, title: e.target.value})} />
                      <select value={newResource.resource_type} onChange={(e) => setNewResource({...newResource, resource_type: e.target.value})}>
                        <option value="document">📄 Document</option>
                        <option value="video">🎥 Video</option>
                        <option value="link">🔗 Link</option>
                        <option value="image">🖼️ Image</option>
                      </select>
                      <input type="url" placeholder="File URL" value={newResource.file_url} onChange={(e) => setNewResource({...newResource, file_url: e.target.value})} />
                      <button className="btn-primary" onClick={addResource}>Add Resource</button>
                    </div>
                    <div className="resources-list">
                      {resources.map((resource: any) => (
                        <div key={resource.id} className="resource-item">
                          <h5>{resource.title}</h5>
                          <p>Type: {resource.resource_type}</p>
                          <a href={resource.file_url} target="_blank" rel="noopener noreferrer">Open Resource</a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'students' && (
                  <div className="students-tab">
                    <div className="join-info">
                      <h4>Student Enrollment</h4>
                      <p>Share this code with students: <strong>{selectedClassroom?.classroom_code}</strong></p>
                      <button className="btn-outline" onClick={() => navigator.clipboard.writeText(selectedClassroom?.classroom_code || '')}>Copy Code</button>
                    </div>
                    <div className="students-list">
                      <h5>Enrolled Students ({selectedClassroom?.student_count})</h5>
                      <p>Students will appear here once they join using the classroom code.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {showCreateModal && (
            <div className="create-modal">
              <h3>Create New Virtual Classroom</h3>
              <input type="text" placeholder="Classroom Title" value={newClassroom.title} onChange={(e) => setNewClassroom({...newClassroom, title: e.target.value})} />
              <textarea placeholder="Description" value={newClassroom.description} onChange={(e) => setNewClassroom({...newClassroom, description: e.target.value})} />
              <input type="number" placeholder="Max Students" value={newClassroom.max_students} onChange={(e) => setNewClassroom({...newClassroom, max_students: parseInt(e.target.value)})} />
              <div className="modal-actions">
                <button className="btn-primary" onClick={createClassroom}>Create</button>
                <button className="btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
              </div>
            </div>
          )}

          {showStartConference && selectedClassroom && (
            <StartConferenceModal
              classroomId={selectedClassroom.id}
              classroomTitle={selectedClassroom.title}
              onClose={() => setShowStartConference(false)}
              onConferenceStarted={(conferenceData) => {
                setCurrentConference(conferenceData);
                setShowVideoRoom(true);
              }}
            />
          )}

          {showVideoRoom && currentConference && (
            <VideoConferenceRoom
              meetingId={currentConference.meeting_id}
              userName={session?.name || 'Teacher'}
              isHost={true}
              onClose={() => {
                setShowVideoRoom(false);
                setCurrentConference(null);
                if (selectedClassroom) {
                  fetchClassroomData(selectedClassroom.id);
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualClassroomManager;