import React, { useState, useEffect } from 'react';
import SessionManager from '@/utils/sessionManager';
import JoinClassroomModal from './JoinClassroomModal';
import VideoConferenceRoom from './VideoConferenceRoom';
import './VirtualClassroom.css';

interface StudentClassroom {
  id: number;
  title: string;
  description: string;
  classroom_code: string;
  teacher_name: string;
}

interface ClassroomResource {
  id: number;
  title: string;
  description: string;
  resource_type: string;
  file_url: string;
  uploaded_at: string;
}

const StudentVirtualClassrooms: React.FC = () => {
  const [classrooms, setClassrooms] = useState<StudentClassroom[]>([]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<StudentClassroom | null>(null);
  const [resources, setResources] = useState<ClassroomResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [showVideoRoom, setShowVideoRoom] = useState(false);
  const [currentConference, setCurrentConference] = useState<any>(null);

  const session = SessionManager.getSession();

  useEffect(() => {
    fetchMyClassrooms();
  }, []);

  const fetchMyClassrooms = async () => {
    try {
      const response = await fetch(`http://localhost:8001/api/classrooms/my-classrooms/?student_id=${session?.id}`);
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

  const fetchClassroomResources = async (classroomId: number) => {
    setResourcesLoading(true);
    try {
      const response = await fetch(`http://localhost:8001/api/classrooms/${classroomId}/resources/`);
      const result = await response.json();
      if (result.success) {
        setResources(result.resources);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setResourcesLoading(false);
    }
  };

  const handleJoinSuccess = () => {
    fetchMyClassrooms();
  };

  const handleViewResources = (classroom: StudentClassroom) => {
    setSelectedClassroom(classroom);
    setShowResourcesModal(true);
    fetchClassroomResources(classroom.id);
  };

  const handleEnterClassroom = async (classroom: StudentClassroom) => {
    try {
      // Check for live conferences
      const response = await fetch(`http://localhost:8001/api/classrooms/${classroom.id}/conferences/`);
      const result = await response.json();
      
      if (result.success) {
        const liveConference = result.conferences.find((conf: any) => conf.status === 'live');
        
        if (liveConference) {
          // Join live conference
          const joinResponse = await fetch(`http://localhost:8001/api/classrooms/conferences/${liveConference.id}/join/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: session?.id,
              user_type: 'student'
            })
          });
          
          const joinResult = await joinResponse.json();
          if (joinResult.success) {
            setCurrentConference(liveConference);
            setShowVideoRoom(true);
          }
        } else {
          alert('No live class is currently running in this classroom.');
        }
      }
    } catch (error) {
      console.error('Error joining classroom:', error);
      alert('Failed to join classroom. Please try again.');
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'document': return '📄';
      case 'video': return '🎥';
      case 'link': return '🔗';
      case 'image': return '🖼️';
      default: return '📁';
    }
  };

  return (
    <div className="student-classrooms">
      <div className="section-header">
        <h2>🏫 My Virtual Classrooms</h2>
        <button className="btn-primary" onClick={() => setShowJoinModal(true)}>
          ➕ Join Classroom
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading your classrooms...</div>
      ) : (
        <div className="classrooms-grid">
          {classrooms.length > 0 ? (
            classrooms.map(classroom => (
              <div key={classroom.id} className="classroom-card">
                <div className="classroom-header">
                  <h3>{classroom.title}</h3>
                  <span className="teacher-name">👨‍🏫 {classroom.teacher_name}</span>
                </div>
                <p>{classroom.description}</p>
                <div className="classroom-actions">
                  <button className="btn-primary" onClick={() => handleEnterClassroom(classroom)}>Enter Classroom</button>
                  <button className="btn-outline" onClick={() => handleViewResources(classroom)}>View Resources</button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🏫</div>
              <h3>No classrooms joined yet</h3>
              <p>Ask your teacher for a classroom code to get started</p>
              <button className="btn-primary" onClick={() => setShowJoinModal(true)}>
                Join Your First Classroom
              </button>
            </div>
          )}
        </div>
      )}

      {showJoinModal && (
        <JoinClassroomModal
          onClose={() => setShowJoinModal(false)}
          onJoinSuccess={handleJoinSuccess}
        />
      )}

      {showResourcesModal && selectedClassroom && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>📁 Resources - {selectedClassroom.title}</h3>
              <button className="close-btn" onClick={() => setShowResourcesModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              {resourcesLoading ? (
                <div className="loading">Loading resources...</div>
              ) : (
                <div className="resources-list">
                  {resources.length > 0 ? (
                    resources.map(resource => (
                      <div key={resource.id} className="resource-item">
                        <div className="resource-header">
                          <span className="resource-icon">{getResourceIcon(resource.resource_type)}</span>
                          <h4>{resource.title}</h4>
                        </div>
                        {resource.description && <p>{resource.description}</p>}
                        <div className="resource-meta">
                          <span className="resource-type">{resource.resource_type}</span>
                          <span className="resource-date">{new Date(resource.uploaded_at).toLocaleDateString()}</span>
                        </div>
                        {resource.file_url && (
                          <a href={resource.file_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                            Open Resource
                          </a>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">📁</div>
                      <h4>No resources available</h4>
                      <p>Your teacher hasn't shared any resources yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showVideoRoom && currentConference && (
        <VideoConferenceRoom
          meetingId={currentConference.meeting_id}
          userName={session?.name || 'Student'}
          isHost={false}
          onClose={() => {
            setShowVideoRoom(false);
            setCurrentConference(null);
          }}
        />
      )}
    </div>
  );
};

export default StudentVirtualClassrooms;