import React, { useState, useEffect } from 'react';
import './TeacherVerification.css';

interface Teacher {
  id: number;
  teacher_id: string;
  name: string;
  email: string;
  mobile: string;
  subject_classes: Record<string, string[]>;
  approval_status: string;
  created_at: string;
  qualification: string;
  experience_years: number;
  boards: string[];
  bio: string;
  languages_known: string[];
  teaching_experience_institutes: Array<{name: string, from_year: string, to_year: string}>;
  is_active: boolean;
  profile_completed: boolean;
}

interface Document {
  file_path: string;
  metadata: any;
  url: string;
}

interface TeacherDocuments {
  teacher: Teacher;
  documents: Record<string, Document>;
}

const TeacherVerification: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherDocuments | null>(null);
  const [showDocuments, setShowDocuments] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, [selectedStatus]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8001/api/admin/teachers/?status=${selectedStatus}`);
      const data = await response.json();
      console.log('API Response:', data);
      setTeachers(data.teachers || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      alert('Error loading teachers. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherDocuments = async (teacherId: string) => {
    try {
      const response = await fetch(`http://localhost:8001/api/admin/teachers/${teacherId}/documents/`);
      const data = await response.json();
      setSelectedTeacher(data);
      setShowDocuments(true);
    } catch (error) {
      console.error('Error fetching teacher documents:', error);
    }
  };

  const updateTeacherStatus = async (teacherId: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:8001/api/admin/teachers/${teacherId}/status/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        alert(`Teacher ${status} successfully!`);
        setShowDocuments(false);
        fetchTeachers();
      }
    } catch (error) {
      console.error('Error updating teacher status:', error);
    }
  };

  return (
    <div className="teacher-verification">
      <h1>Teacher Verification</h1>
      
      <div className="status-tabs">
        {['pending', 'document_verified', 'approved', 'rejected', 'all'].map(status => (
          <button
            key={status}
            className={`tab ${selectedStatus === status ? 'active' : ''}`}
            onClick={() => setSelectedStatus(status)}
          >
            {status === 'document_verified' ? 'Document Verified' : status.charAt(0).toUpperCase() + status.slice(1)} ({status === 'all' ? teachers.length : teachers.filter(t => t.approval_status === status).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading teachers...</div>
      ) : (
        <div className="teachers-list">
          {teachers.length === 0 ? (
            <div className="no-teachers">No teachers found for status: {selectedStatus}</div>
          ) : (
            teachers.map(teacher => (
          <div key={teacher.id} className="teacher-card">
            <div className="teacher-info">
              <h3>{teacher.name}</h3>
              <p>ID: {teacher.teacher_id}</p>
              <p>Email: {teacher.email}</p>
              <p>Mobile: {teacher.mobile}</p>
              <p>Qualification: {teacher.qualification}</p>
              <p>Experience: {teacher.experience_years} years</p>
              <p>Subjects: {Object.keys(teacher.subject_classes || {}).join(', ')}</p>
              <p>Boards: {teacher.boards?.join(', ')}</p>
              <span className={`status ${teacher.approval_status}`}>
                {teacher.approval_status}
              </span>
            </div>
            <button 
              className="verify-btn"
              onClick={() => fetchTeacherDocuments(teacher.teacher_id)}
            >
              {teacher.approval_status === 'pending' ? 'Start Verification' : 'View Documents'}
            </button>
          </div>
            ))
          )}
        </div>
      )}

      {showDocuments && selectedTeacher && (
        <div className="modal-overlay">
          <div className="documents-modal">
            <div className="modal-header">
              <h2>Verify Documents - {selectedTeacher.teacher.name}</h2>
              <button onClick={() => setShowDocuments(false)}>×</button>
            </div>
            
            <div className="teacher-profile-section">
              <h3>Teacher Profile</h3>
              <div className="profile-grid">
                <div className="profile-item">
                  <strong>Name:</strong> {selectedTeacher.teacher.name}
                </div>
                <div className="profile-item">
                  <strong>Email:</strong> {selectedTeacher.teacher.email}
                </div>
                <div className="profile-item">
                  <strong>Mobile:</strong> {selectedTeacher.teacher.mobile}
                </div>
                <div className="profile-item">
                  <strong>Qualification:</strong> {selectedTeacher.teacher.qualification}
                </div>
                <div className="profile-item">
                  <strong>Experience:</strong> {selectedTeacher.teacher.experience_years} years
                </div>
                <div className="profile-item">
                  <strong>Boards:</strong> {selectedTeacher.teacher.boards?.join(', ')}
                </div>
                <div className="profile-item">
                  <strong>Languages:</strong> {selectedTeacher.teacher.languages_known?.join(', ')}
                </div>
                {selectedTeacher.teacher.bio && (
                  <div className="profile-item full-width">
                    <strong>Bio:</strong> {selectedTeacher.teacher.bio}
                  </div>
                )}
                <div className="profile-item full-width">
                  <strong>Subject-Class Mapping:</strong>
                  <div className="subject-mapping">
                    {Object.entries(selectedTeacher.teacher.subject_classes || {}).map(([subject, classes]) => (
                      <div key={subject} className="subject-item">
                        <span className="subject-name">{subject}:</span>
                        <span className="classes">Classes {classes.join(', ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {selectedTeacher.teacher.teaching_experience_institutes?.length > 0 && (
                  <div className="profile-item full-width">
                    <strong>Teaching Experience:</strong>
                    <div className="experience-list">
                      {selectedTeacher.teacher.teaching_experience_institutes.map((inst, index) => (
                        <div key={index} className="experience-item">
                          <span className="institute-name">{inst.name}</span>
                          <span className="duration">({inst.from_year} - {inst.to_year})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="documents-section">
              <h3>Documents</h3>
              <div className="documents-grid">
              {Object.entries(selectedTeacher.documents).map(([docType, doc]) => (
                doc.url && (
                  <div key={docType} className="document-item">
                    <h4>{docType.replace('_', ' ').toUpperCase()}</h4>
                    {doc.url.includes('.pdf') ? (
                      <iframe src={`http://localhost:8001${doc.url}`} width="100%" height="300px" />
                    ) : (
                      <img src={`http://localhost:8001${doc.url}`} alt={docType} />
                    )}
                    <p>Original: {doc.metadata?.original_filename}</p>
                  </div>
                )
              ))}
              </div>
            </div>
            
            {(selectedTeacher.teacher.approval_status === 'pending' || selectedTeacher.teacher.approval_status === 'document_verified') && (
              <div className="action-buttons">
                {selectedTeacher.teacher.approval_status === 'pending' && (
                  <button 
                    className="verify-btn"
                    onClick={() => updateTeacherStatus(selectedTeacher.teacher.teacher_id, 'document_verified')}
                  >
                    Document Verified
                  </button>
                )}
                <button 
                  className="approve-btn"
                  onClick={() => updateTeacherStatus(selectedTeacher.teacher.teacher_id, 'approved')}
                >
                  Approve Teacher
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => updateTeacherStatus(selectedTeacher.teacher.teacher_id, 'rejected')}
                >
                  Reject Teacher
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherVerification;