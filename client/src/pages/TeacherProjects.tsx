import React, { useState, useEffect } from 'react';
import { FaPlus, FaUsers, FaFileAlt, FaCalendar, FaUpload, FaEdit, FaTrash, FaEye, FaClock, FaCheckCircle } from 'react-icons/fa';
import { TeacherSidebarDemo } from '../Teacher/components/TeacherSidebar';
import NewHeader from '../Teacher/components/NewHeader';
import SessionManager from '../utils/sessionManager';
import './TeacherProjects.css';

interface Project {
  id: number;
  title: string;
  description: string;
  created_at: string;
  due_date: string | null;
  groups_count: number;
  total_members: number;
  documents_count: number;
  status: 'active' | 'completed' | 'overdue';
}

interface Student {
  id: number;
  name: string;
  email: string;
}

interface ProjectGroup {
  id: number;
  name: string;
  members: Student[];
  submissions_count: number;
}

const TeacherProjects: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectGroups, setProjectGroups] = useState<ProjectGroup[]>([]);
  const [allProjectGroups, setAllProjectGroups] = useState<{[key: number]: ProjectGroup[]}>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    due_date: ''
  });
  
  const [newGroup, setNewGroup] = useState({
    group_name: '',
    members: [] as Student[]
  });
  
  const [studentSearchTerm, setStudentSearchTerm] = useState('');

  const session = SessionManager.getSession();
  const teacherData = {
    name: session?.name || "Teacher",
    role: "Teacher",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  };

  useEffect(() => {
    fetchProjects();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      fetchAllProjectGroups();
    }
  }, [projects]);

  const fetchProjects = async () => {
    try {
      const teacherId = session?.id || 1;
      const response = await fetch(`http://localhost:8001/api/collaboration/teacher-projects/?teacher_id=${teacherId}`);
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      alert('Failed to fetch projects. Please check if the server is running.');
    }
  };

  const fetchStudents = async () => {
    try {
      console.log('Fetching students from admin API...');
      const response = await fetch('http://localhost:8001/api/admin/students/');
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Admin API Response:', data);
      
      if (data.status === 'success' && data.students) {
        // Format students for the group selection
        const formattedStudents = data.students.map((student: any) => ({
          id: student.id,
          name: student.name,
          email: student.mobile_self || 'student@example.com'
        }));
        console.log('Setting formatted students:', formattedStudents);
        setStudents(formattedStudents);
      } else {
        console.log('No students found in response');
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    }
  };

  const fetchProjectDetails = async (projectId: number) => {
    try {
      const response = await fetch(`http://localhost:8001/api/collaboration/project-details/${projectId}/`);
      const data = await response.json();
      setProjectGroups(data.project.groups || []);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const fetchAllProjectGroups = async () => {
    try {
      const groupsData: {[key: number]: ProjectGroup[]} = {};
      for (const project of projects) {
        const response = await fetch(`http://localhost:8001/api/collaboration/project-details/${project.id}/`);
        const data = await response.json();
        groupsData[project.id] = data.project.groups || [];
      }
      setAllProjectGroups(groupsData);
    } catch (error) {
      console.error('Error fetching all project groups:', error);
    }
  };

  const deleteGroup = async (groupId: number) => {
    if (!confirm('Are you sure you want to delete this group?')) return;
    
    try {
      const response = await fetch(`http://localhost:8001/api/collaboration/delete-group/${groupId}/`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('Group deleted successfully!');
        if (selectedProject) {
          fetchProjectDetails(selectedProject.id);
          fetchProjects();
          fetchAllProjectGroups();
        }
      }
    } catch (error) {
      console.error('Error deleting group:', error);
      alert('Failed to delete group.');
    }
  };

  const toggleProjectExpansion = (projectId: number) => {
    if (expandedProject === projectId) {
      setExpandedProject(null);
    } else {
      setExpandedProject(projectId);
      fetchProjectDetails(projectId);
    }
  };

  const createProject = async () => {
    try {
      const teacherId = session?.id || 1;
      const response = await fetch('http://localhost:8001/api/collaboration/teacher-projects/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProject, teacher_id: teacherId })
      });
      
      if (response.ok) {
        const result = await response.json();
        alert('Project created successfully!');
        setShowCreateModal(false);
        setNewProject({ title: '', description: '', due_date: '' });
        fetchProjects();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to create project'}`);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please check if the server is running.');
    }
  };

  const createGroup = async () => {
    if (!selectedProject) return;
    
    try {
      const response = await fetch('http://localhost:8001/api/collaboration/create-project-group/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: selectedProject.id,
          group_name: newGroup.group_name,
          members: newGroup.members.map(m => ({ student_id: m.id, student_name: m.name }))
        })
      });
      
      if (response.ok) {
        alert('Group created successfully!');
        setShowGroupModal(false);
        setNewGroup({ group_name: '', members: [] });
        fetchProjectDetails(selectedProject.id);
        fetchProjects();
        fetchAllProjectGroups();
        setExpandedProject(selectedProject.id);
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const uploadDocument = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProject) return;
    
    const formData = new FormData(event.currentTarget);
    formData.append('project_id', selectedProject.id.toString());
    
    try {
      const response = await fetch('http://localhost:8001/api/collaboration/upload-project-document/', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        setShowDocumentModal(false);
        fetchProjectDetails(selectedProject.id);
        fetchProjects();
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  const toggleStudentSelection = (student: Student) => {
    setNewGroup(prev => ({
      ...prev,
      members: prev.members.find(m => m.id === student.id)
        ? prev.members.filter(m => m.id !== student.id)
        : [...prev.members, student]
    }));
  };

  const openProjectDetails = (project: Project) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
    fetchProjectDetails(project.id);
  };

  const getProjectStatus = (project: Project) => {
    if (!project.due_date) return 'active';
    const dueDate = new Date(project.due_date);
    const now = new Date();
    return dueDate < now ? 'overdue' : 'active';
  };

  return (
    <div className="dashboard-container">
      <TeacherSidebarDemo open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="dashboard-main" style={{ marginLeft: sidebarOpen ? "250px" : "60px" }}>
        <NewHeader
          avatar={teacherData.avatar}
          name={teacherData.name}
          role={teacherData.role}
          searchPlaceholder="Search projects..."
        />
        
        <div className="teacher-projects">
          {/* Header Section */}
          <div className="projects-header">
            <div className="header-content">
              <h1>Project Management Center</h1>
              <p>Create, manage, and track student projects</p>
            </div>
            <button className="create-project-btn" onClick={() => setShowCreateModal(true)}>
              <FaPlus /> Create New Project
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-icon active">📚</div>
              <div className="stat-info">
                <h3>{projects.length}</h3>
                <p>Total Projects</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon groups">👥</div>
              <div className="stat-info">
                <h3>{projects.reduce((sum, p) => sum + p.groups_count, 0)}</h3>
                <p>Active Groups</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon students">🎓</div>
              <div className="stat-info">
                <h3>{projects.reduce((sum, p) => sum + p.total_members, 0)}</h3>
                <p>Students Involved</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon docs">📄</div>
              <div className="stat-info">
                <h3>{projects.reduce((sum, p) => sum + p.documents_count, 0)}</h3>
                <p>Documents Shared</p>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="projects-section">
            <h2>Your Projects</h2>
            {projects.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No Projects Yet</h3>
                <p>Create your first project to start managing student assignments</p>
                <button className="create-first-btn" onClick={() => setShowCreateModal(true)}>
                  Create First Project
                </button>
              </div>
            ) : (
              <div className="projects-grid">
                {projects.map(project => (
                  <div key={project.id} className={`project-card ${getProjectStatus(project)}`}>
                    <div className={`status-badge ${getProjectStatus(project)}`}>
                      {getProjectStatus(project) === 'active' ? <FaCheckCircle /> : <FaClock />}
                      {getProjectStatus(project).toUpperCase()}
                    </div>
                    
                    <div className="project-header">
                      <div className="project-title-section">
                        <h3>{project.title}</h3>
                        {allProjectGroups[project.id] && allProjectGroups[project.id].length > 0 && (
                          <div className="project-group-info">
                            <span className="group-indicator">
                              <FaUsers /> 
                              {allProjectGroups[project.id].length === 1 
                                ? `Group: ${allProjectGroups[project.id][0].name}` 
                                : `${allProjectGroups[project.id].length} Groups`
                              }
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="project-actions">
                        <button onClick={() => { setSelectedProject(project); setShowGroupModal(true); }} title="Add Group">
                          <FaUsers />
                        </button>
                        <button onClick={() => { setSelectedProject(project); setShowDocumentModal(true); }} title="Upload Document">
                          <FaUpload />
                        </button>
                        <button onClick={() => toggleProjectExpansion(project.id)} title="Manage Groups">
                          <FaEdit />
                        </button>
                      </div>
                    </div>
                    
                    <p className="project-description">{project.description}</p>
                    
                    <div className="project-stats">
                      {project.groups_count > 0 && (
                        <div className="stat-item">
                          <FaUsers />
                          <span>{project.groups_count} Groups</span>
                        </div>
                      )}
                      {project.total_members > 0 && (
                        <div className="stat-item">
                          <FaUsers />
                          <span>{project.total_members} Students</span>
                        </div>
                      )}
                      {project.documents_count > 0 && (
                        <div className="stat-item">
                          <FaFileAlt />
                          <span>{project.documents_count} Files</span>
                        </div>
                      )}
                    </div>
                    
                    {project.due_date && (
                      <div className="due-date">
                        <FaCalendar />
                        <span>Due: {new Date(project.due_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {expandedProject === project.id && (
                      <div className="groups-section">
                        <h4>Project Groups:</h4>
                        {projectGroups.length === 0 ? (
                          <p className="no-groups">No groups created yet. Click "Add Group" to create one.</p>
                        ) : (
                          <div className="groups-list">
                            {projectGroups.map(group => (
                              <div key={group.id} className="group-item">
                                <div className="group-info">
                                  <div className="group-header">
                                    <strong>{group.name}</strong>
                                    <span>({group.members?.length || 0} members)</span>
                                  </div>
                                  {group.members && group.members.length > 0 && (
                                    <div className="group-members">
                                      <span className="members-label">Members:</span>
                                      <div className="members-list">
                                        {group.members.map((member, index) => (
                                          <span key={member.id || index} className="member-name">
                                            {member.name || member.student_name}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="group-actions">
                                  <button 
                                    className="delete-group-btn" 
                                    onClick={() => deleteGroup(group.id)}
                                    title="Delete Group"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Create Project Modal */}
          {showCreateModal && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h2>Create New Project</h2>
                  <button className="close-btn" onClick={() => setShowCreateModal(false)}>×</button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Project Title</label>
                    <input
                      type="text"
                      placeholder="Enter project title"
                      value={newProject.title}
                      onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      placeholder="Describe the project objectives and requirements"
                      value={newProject.description}
                      onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Due Date</label>
                    <input
                      type="date"
                      value={newProject.due_date}
                      onChange={(e) => setNewProject(prev => ({ ...prev, due_date: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="cancel-btn" onClick={() => setShowCreateModal(false)}>Cancel</button>
                  <button 
                    className="create-btn" 
                    onClick={createProject}
                    disabled={!newProject.title || !newProject.description}
                  >
                    Create Project
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Create Group Modal */}
          {showGroupModal && (
            <div className="modal-overlay">
              <div className="modal large-modal">
                <div className="modal-header">
                  <h2>Create Project Group</h2>
                  <button className="close-btn" onClick={() => setShowGroupModal(false)}>×</button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Group Name</label>
                    <input
                      type="text"
                      placeholder="Enter group name (e.g., Team Alpha)"
                      value={newGroup.group_name}
                      onChange={(e) => setNewGroup(prev => ({ ...prev, group_name: e.target.value }))}
                    />
                  </div>
                  <div className="students-selection">
                    <label>Select Students for this Group:</label>
                    {students.length === 0 ? (
                      <div className="no-students">
                        <p>No students found. Please add students to the system first.</p>
                      </div>
                    ) : (
                      <>
                        <div className="student-search">
                          <input
                            type="text"
                            placeholder="Search students by name..."
                            value={studentSearchTerm}
                            onChange={(e) => setStudentSearchTerm(e.target.value)}
                            className="search-input"
                          />
                        </div>
                        <div className="students-grid">
                          {students
                            .filter(student => 
                              student.name.toLowerCase().includes(studentSearchTerm.toLowerCase())
                            )
                            .map(student => (
                          <div key={student.id} className="student-card">
                            <input
                              type="checkbox"
                              checked={newGroup.members.some(m => m.id === student.id)}
                              onChange={() => toggleStudentSelection(student)}
                            />
                            <div className="student-info">
                              <div className="student-name">{student.name}</div>
                              <div className="student-email">{student.email}</div>
                            </div>
                          </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  {newGroup.members.length > 0 && (
                    <div className="selected-members">
                      <h4>Selected Members ({newGroup.members.length}):</h4>
                      <div className="members-tags">
                        {newGroup.members.map(member => (
                          <span key={member.id} className="member-tag">{member.name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-actions">
                  <button className="cancel-btn" onClick={() => setShowGroupModal(false)}>Cancel</button>
                  <button className="create-btn" onClick={createGroup} disabled={!newGroup.group_name || newGroup.members.length === 0}>
                    Create Group
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Upload Document Modal */}
          {showDocumentModal && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h2>Upload Project Document</h2>
                  <button className="close-btn" onClick={() => setShowDocumentModal(false)}>×</button>
                </div>
                <form onSubmit={uploadDocument}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Document Title</label>
                      <input type="text" name="title" placeholder="Enter document title" required />
                    </div>
                    <div className="form-group">
                      <label>Select File</label>
                      <input type="file" name="file" accept=".pdf,.doc,.docx,.ppt,.pptx" required />
                      <small>Supported formats: PDF, DOC, DOCX, PPT, PPTX</small>
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="cancel-btn" onClick={() => setShowDocumentModal(false)}>Cancel</button>
                    <button type="submit" className="upload-btn">Upload Document</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherProjects;