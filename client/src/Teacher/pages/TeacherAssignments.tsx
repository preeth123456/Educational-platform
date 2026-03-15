import React, { useState, useEffect } from 'react';
import { Plus, Eye, MessageSquare, Download, Calendar, Users, CheckCircle, Clock, AlertCircle, BookOpen, ChevronRight, ClipboardList } from 'lucide-react';
import TeacherSidebarDemo from '../components/TeacherSidebar';
import NewHeader from '../components/NewHeader';
import SessionManager from '../../utils/sessionManager';
import '../styles/TeacherAssignments.css';

interface Class {
  id: number;
  name: string;
  subject: string;
  totalStudents: number;
}

interface Assignment {
  id: number;
  title: string;
  description: string;
  classId: number;
  className: string;
  subject: string;
  dueDate: string;
  createdDate: string;
  totalSubmissions: number;
  pendingSubmissions: number;
  status: 'active' | 'closed' | 'draft';
}

interface StudentSubmission {
  id: number;
  assignmentId: number;
  studentName: string;
  studentAvatar: string;
  rollNumber: string;
  submissionDate: string;
  status: 'submitted' | 'late' | 'pending';
  grade: number | null;
  feedback: string;
  fileUrl?: string;
}

const TeacherAssignments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const session = SessionManager.getSession();
  const teacherData = {
    name: session?.name || "Teacher",
    role: "Teacher",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  };

  const sidebarWidth = sidebarOpen ? 250 : 60;

  useEffect(() => {
    // Mock classes data
    const mockClasses: Class[] = [
      { id: 1, name: 'Class 10-A', subject: 'Mathematics', totalStudents: 25 },
      { id: 2, name: 'Class 10-B', subject: 'Science', totalStudents: 28 },
      { id: 3, name: 'Class 9-A', subject: 'English', totalStudents: 22 },
      { id: 4, name: 'Class 11-A', subject: 'Physics', totalStudents: 24 }
    ];
    setClasses(mockClasses);

    // Mock assignments data
    const mockAssignments: Assignment[] = [
      {
        id: 1,
        title: 'Algebra Quiz - Linear Equations',
        description: 'Solve the given algebraic equations and show your work',
        classId: 1,
        className: 'Class 10-A',
        subject: 'Mathematics',
        dueDate: '2024-01-25',
        createdDate: '2024-01-15',
        totalSubmissions: 25,
        pendingSubmissions: 3,
        status: 'active'
      },
      {
        id: 2,
        title: 'Geometry Assignment',
        description: 'Problems on triangles and circles',
        classId: 1,
        className: 'Class 10-A',
        subject: 'Mathematics',
        dueDate: '2024-01-30',
        createdDate: '2024-01-18',
        totalSubmissions: 25,
        pendingSubmissions: 5,
        status: 'active'
      },
      {
        id: 3,
        title: 'Physics Lab Report',
        description: 'Write a detailed report on the pendulum experiment',
        classId: 4,
        className: 'Class 11-A',
        subject: 'Physics',
        dueDate: '2024-02-05',
        createdDate: '2024-01-20',
        totalSubmissions: 24,
        pendingSubmissions: 2,
        status: 'active'
      },
      {
        id: 4,
        title: 'Solar System Project',
        description: 'Research project on planets and their characteristics',
        classId: 2,
        className: 'Class 10-B',
        subject: 'Science',
        dueDate: '2024-02-10',
        createdDate: '2024-01-22',
        totalSubmissions: 28,
        pendingSubmissions: 6,
        status: 'active'
      }
    ];
    setAssignments(mockAssignments);
  }, []);

  const getClassAssignments = (classId: number) => {
    return assignments.filter(assignment => assignment.classId === classId);
  };

  const handleViewSubmissions = (assignment: Assignment) => {
    setSelectedAssignment(assignment);

    // Generate submissions based on assignment statistics
    const mockSubmissions: StudentSubmission[] = [];
    const submittedCount = assignment.totalSubmissions - assignment.pendingSubmissions;

    // Add submitted submissions
    for (let i = 1; i <= submittedCount; i++) {
      mockSubmissions.push({
        id: i,
        assignmentId: assignment.id,
        studentName: `Student ${i}`,
        studentAvatar: `https://images.unsplash.com/photo-150${7000000 + i}003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face`,
        rollNumber: `STU${String(i).padStart(3, '0')}`,
        submissionDate: `2024-01-${20 + (i % 5)} ${9 + (i % 12)}:${30 + (i % 30)} AM`,
        status: i <= Math.floor(submittedCount * 0.8) ? 'submitted' : 'late',
        grade: i <= Math.floor(submittedCount * 0.6) ? 85 + (i % 15) : null,
        feedback: i <= Math.floor(submittedCount * 0.6) ? `Good work on assignment ${assignment.id}` : '',
        fileUrl: `assignment${i}.pdf`
      });
    }

    // Add pending submissions
    for (let i = submittedCount + 1; i <= assignment.totalSubmissions; i++) {
      mockSubmissions.push({
        id: i,
        assignmentId: assignment.id,
        studentName: `Student ${i}`,
        studentAvatar: `https://images.unsplash.com/photo-150${7000000 + i}003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face`,
        rollNumber: `STU${String(i).padStart(3, '0')}`,
        submissionDate: '',
        status: 'pending',
        grade: null,
        feedback: '',
      });
    }

    setSubmissions(mockSubmissions);
  };

  const handleGradeSubmission = () => {
    const gradeInput = document.getElementById('grade-input') as HTMLInputElement;
    const feedbackInput = document.getElementById('feedback-input') as HTMLTextAreaElement;

    if (selectedSubmission && gradeInput && feedbackInput) {
      const grade = parseInt(gradeInput.value);
      const feedback = feedbackInput.value;

      if (grade >= 0 && grade <= 100) {
        setSubmissions(prev => prev.map(sub =>
          sub.id === selectedSubmission.id
            ? { ...sub, grade, feedback }
            : sub
        ));
        setSelectedSubmission(null);
      }
    }
  };

  return (
    <div className="flex">
      <TeacherSidebarDemo open={sidebarOpen} setOpen={setSidebarOpen} />

      <div style={{ marginLeft: sidebarWidth + 16, flex: 1, transition: "all 0.3s ease", minHeight: "100vh" }}>
        <div style={{ position: "fixed", top: 0, left: sidebarWidth, right: 0, zIndex: 999 }}>
          <NewHeader avatar={teacherData.avatar} name={teacherData.name} role={teacherData.role} teacherId={session?.id} />
        </div>

        <div className="assignments-dashboard">
          {/* Header Section */}
          <div className="dashboard-header">
            <div className="header-content">
              <div className="header-text">
                <h1 className="dashboard-title">
                  <ClipboardList className="title-icon" />
                  Assignment Management
                </h1>
                <p className="dashboard-subtitle">Create, manage and grade student assignments</p>
              </div>

              <button
                className="create-assignment-btn"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus size={20} />
                Create Assignment
              </button>
            </div>
          </div>

          {!selectedClass && !selectedAssignment ? (
            /* Classes List */
            <div className="classes-container">
              <h2 className="section-title">Select a Class</h2>
              <div className="classes-grid">
                {classes.map((classItem) => (
                  <div key={classItem.id} className="class-card" onClick={() => setSelectedClass(classItem)}>
                    <div className="class-header">
                      <BookOpen size={24} className="class-icon" />
                      <div className="class-info">
                        <h3 className="class-name">{classItem.name}</h3>
                        <p className="class-subject">{classItem.subject}</p>
                      </div>
                      <ChevronRight size={20} className="chevron-icon" />
                    </div>
                    <div className="class-stats">
                      <div className="stat-item">
                        <Users size={16} />
                        <span>{classItem.totalStudents} students</span>
                      </div>
                      <div className="stat-item">
                        <ClipboardList size={16} />
                        <span>{getClassAssignments(classItem.id).length} assignments</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : selectedClass && !selectedAssignment ? (
            /* Class Assignments */
            <div className="class-assignments-container">
              <div className="class-assignments-header">
                <button
                  className="back-btn"
                  onClick={() => setSelectedClass(null)}
                >
                  ← Back to Classes
                </button>
                <h2 className="class-title">{selectedClass.name} - {selectedClass.subject}</h2>
              </div>

              <div className="assignments-grid">
                {getClassAssignments(selectedClass.id).map((assignment) => (
                  <div key={assignment.id} className="assignment-card">
                    <div className="assignment-header">
                      <div className="assignment-info">
                        <h3 className="assignment-title">{assignment.title}</h3>
                        <p className="assignment-description">{assignment.description}</p>
                      </div>
                      <div className={`assignment-status status-${assignment.status}`}>
                        {assignment.status}
                      </div>
                    </div>

                    <div className="assignment-details">
                      <div className="detail-item">
                        <Calendar size={16} />
                        <span>Due: {assignment.dueDate}</span>
                      </div>
                    </div>

                    <div className="assignment-stats">
                      <div className="stat-item">
                        <CheckCircle size={16} className="stat-icon submitted" />
                        <span>{assignment.totalSubmissions - assignment.pendingSubmissions} Submitted</span>
                      </div>
                      <div className="stat-item">
                        <Clock size={16} className="stat-icon pending" />
                        <span>{assignment.pendingSubmissions} Pending</span>
                      </div>
                    </div>

                    <div className="assignment-actions">
                      <button
                        className="action-btn view-btn"
                        onClick={() => handleViewSubmissions(assignment)}
                      >
                        <Eye size={16} />
                        View Submissions
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Submissions View */
            <div className="submissions-container">
              <div className="submissions-header">
                <button
                  className="back-btn"
                  onClick={() => setSelectedAssignment(null)}
                >
                  ← Back to {selectedClass?.name} Assignments
                </button>
                <h2 className="assignment-title">{selectedAssignment?.title} - Submissions</h2>
              </div>

              <div className="submissions-grid">
                {submissions.map((submission) => (
                  <div key={submission.id} className="submission-card">
                    <div className="submission-header">
                      <div className="student-info">
                        <img src={submission.studentAvatar} alt={submission.studentName} className="student-avatar" />
                        <div className="student-details">
                          <h4 className="student-name">{submission.studentName}</h4>
                          <span className="student-roll">{submission.rollNumber}</span>
                        </div>
                      </div>
                      <div className={`submission-status status-${submission.status}`}>
                        {submission.status === 'submitted' && <CheckCircle size={16} />}
                        {submission.status === 'late' && <AlertCircle size={16} />}
                        {submission.status === 'pending' && <Clock size={16} />}
                        {submission.status}
                      </div>
                    </div>

                    {submission.submissionDate && (
                      <div className="submission-date">
                        Submitted: {submission.submissionDate}
                      </div>
                    )}

                    {submission.grade !== null && (
                      <div className="submission-grade">
                        Grade: <span className="grade-value">{submission.grade}/100</span>
                      </div>
                    )}

                    {submission.feedback && (
                      <div className="submission-feedback">
                        <strong>Feedback:</strong> {submission.feedback}
                      </div>
                    )}

                    <div className="submission-actions">
                      {submission.fileUrl && (
                        <button className="action-btn download-btn">
                          <Download size={16} />
                          Download
                        </button>
                      )}
                      {submission.status !== 'pending' && (
                        <button
                          className="action-btn grade-btn"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <MessageSquare size={16} />
                          {submission.grade ? 'Edit Grade' : 'Grade'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Create Assignment Modal */}
          {showCreateModal && (
            <div className="grade-modal">
              <div className="modal-overlay" onClick={() => setShowCreateModal(false)}></div>
              <div className="modal-content create-assignment-modal">
                <div className="modal-header">
                  <h3>Create New Assignment</h3>
                  <button onClick={() => setShowCreateModal(false)} className="close-btn">×</button>
                </div>

                <div className="grade-form">
                  <div className="form-group">
                    <label>Assignment Title *</label>
                    <input
                      type="text"
                      className="grade-input"
                      placeholder="Enter assignment title"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Select Class *</label>
                    <select className="grade-input" required>
                      <option value="">Choose a class</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.name} - {cls.subject}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Due Date *</label>
                    <input
                      type="date"
                      className="grade-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      rows={4}
                      className="feedback-textarea"
                      placeholder="Describe the assignment requirements..."
                      id="assignment-description"
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label>Upload Assignment File</label>
                    <input
                      type="file"
                      className="file-input"
                      accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                      id="assignment-file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadedFile(file);
                        }
                      }}
                    />
                    {uploadedFile && (
                      <div className="file-preview">
                        <span className="file-name">📎 {uploadedFile.name}</span>
                        <span className="file-size">({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
                        <button
                          type="button"
                          className="remove-file-btn"
                          onClick={() => {
                            setUploadedFile(null);
                            const fileInput = document.getElementById('assignment-file') as HTMLInputElement;
                            if (fileInput) fileInput.value = '';
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="form-actions">
                    <button className="cancel-btn" onClick={() => setShowCreateModal(false)}>
                      Cancel
                    </button>
                    <button
                      className="submit-btn"
                      onClick={() => {
                        const title = (document.querySelector('.create-assignment-modal input[type="text"]') as HTMLInputElement)?.value;
                        const classId = (document.querySelector('.create-assignment-modal select') as HTMLSelectElement)?.value;
                        const dueDate = (document.querySelector('.create-assignment-modal input[type="date"]') as HTMLInputElement)?.value;
                        const description = (document.getElementById('assignment-description') as HTMLTextAreaElement)?.value;

                        if (title && classId && dueDate) {
                          const selectedClassData = classes.find(c => c.id.toString() === classId);
                          const newAssignment: Assignment = {
                            id: assignments.length + 1,
                            title,
                            description,
                            classId: parseInt(classId),
                            className: selectedClassData?.name || '',
                            subject: selectedClassData?.subject || '',
                            dueDate,
                            createdDate: new Date().toISOString().split('T')[0],
                            totalSubmissions: selectedClassData?.totalStudents || 0,
                            pendingSubmissions: selectedClassData?.totalStudents || 0,
                            status: 'active'
                          };
                          setAssignments(prev => [...prev, newAssignment]);
                          setShowCreateModal(false);
                          setUploadedFile(null);
                          // Reset form
                          const form = document.querySelector('.create-assignment-modal');
                          if (form) {
                            const inputs = form.querySelectorAll('input, textarea, select');
                            inputs.forEach(input => {
                              if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement) {
                                input.value = '';
                              }
                            });
                          }
                        }
                      }}
                    >
                      Create Assignment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grade Submission Modal */}
          {selectedSubmission && (
            <div className="grade-modal">
              <div className="modal-overlay" onClick={() => setSelectedSubmission(null)}></div>
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Grade Submission - {selectedSubmission.studentName}</h3>
                  <button onClick={() => setSelectedSubmission(null)} className="close-btn">×</button>
                </div>

                <div className="grade-form">
                  <div className="form-group">
                    <label>Grade (out of 100)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={selectedSubmission.grade || ''}
                      className="grade-input"
                      id="grade-input"
                      placeholder="Enter grade (0-100)"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Feedback</label>
                    <textarea
                      rows={4}
                      defaultValue={selectedSubmission.feedback}
                      className="feedback-textarea"
                      placeholder="Provide detailed feedback to help the student improve..."
                      id="feedback-input"
                    ></textarea>
                  </div>

                  <div className="form-actions">
                    <button className="cancel-btn" onClick={() => setSelectedSubmission(null)}>
                      Cancel
                    </button>
                    <button
                      className="submit-btn"
                      onClick={handleGradeSubmission}
                    >
                      Save Grade
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherAssignments;
