import React, { useState, useEffect } from 'react';
import { FaUsers, FaFileAlt, FaCalendar, FaDownload } from 'react-icons/fa';
import './StudentProjects.css';

interface ProjectData {
  project_id: number;
  project_title: string;
  project_description: string;
  due_date: string | null;
  group_id: number;
  group_name: string;
  members: Array<{
    student_id: number;
    student_name: string;
  }>;
  documents: Array<{
    id: number;
    title: string;
    file_url: string | null;
  }>;
  submissions_count: number;
}

const StudentProjects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentProjects();
  }, []);

  const fetchStudentProjects = async () => {
    try {
      // Get student ID from session or props
      const studentId = 1; // Replace with actual student ID from session
      
      const response = await fetch(`http://localhost:8001/api/collaboration/student-projects/?student_id=${studentId}`);
      const data = await response.json();
      setProjects(data.projects);
    } catch (error) {
      console.error('Error fetching student projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = (fileUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="student-projects loading">
        <div className="loading-spinner">Loading your projects...</div>
      </div>
    );
  }

  return (
    <div className="student-projects">
      <div className="projects-header">
        <h1>My Assigned Projects</h1>
        <div className="projects-count">
          {projects.length} Active Project{projects.length !== 1 ? 's' : ''}
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="no-projects">
          <div className="no-projects-icon">📚</div>
          <h2>No Projects Assigned</h2>
          <p>You haven't been assigned to any projects yet. Check back later!</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <div key={`${project.project_id}-${project.group_id}`} className="project-card">
              <div className="project-header">
                <h3>{project.project_title}</h3>
                <div className="group-badge">{project.group_name}</div>
              </div>
              
              <p className="project-description">{project.project_description}</p>
              
              <div className="project-info">
                <div className="info-item">
                  <FaUsers />
                  <span>{project.members.length} Members</span>
                </div>
                <div className="info-item">
                  <FaFileAlt />
                  <span>{project.documents.length} Documents</span>
                </div>
                {project.due_date && (
                  <div className="info-item due-date">
                    <FaCalendar />
                    <span>Due: {new Date(project.due_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="team-members">
                <h4>Team Members:</h4>
                <div className="members-list">
                  {project.members.map(member => (
                    <span key={member.student_id} className="member-tag">
                      {member.student_name}
                    </span>
                  ))}
                </div>
              </div>

              {project.documents.length > 0 && (
                <div className="project-documents">
                  <h4>Project Documents:</h4>
                  <div className="documents-list">
                    {project.documents.map(doc => (
                      <div key={doc.id} className="document-item">
                        <span className="doc-title">{doc.title}</span>
                        {doc.file_url && (
                          <button
                            className="download-btn"
                            onClick={() => downloadDocument(doc.file_url!, doc.title)}
                          >
                            <FaDownload />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="project-status">
                <div className="status-item">
                  <span className="status-label">Submissions:</span>
                  <span className="status-value">{project.submissions_count}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Status:</span>
                  <span className="status-value active">Active</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentProjects;