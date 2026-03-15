import React, { useState, useEffect } from 'react';
import { FaChalkboardTeacher, FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaCheck, FaTimes, FaBan, FaUnlock, FaEnvelope, FaPhone, FaGraduationCap, FaBook, FaCalendarAlt, FaArrowLeft, FaYoutube } from 'react-icons/fa';
import NormalAdminLayout from '../components/NormalAdminLayout';
import '../Dashboard.css';

interface Teacher {
  id: number;
  name: string;
  email: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
  date_updated: string;
}

const NormalAdminTeachers: React.FC = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [statistics, setStatistics] = useState({
    total_teachers: 0,
    verify_teachers: 0,
    pending_approvals: 0,
    approved_teachers: 0,
    rejected_teachers: 0
  });
  const [loading, setLoading] = useState(true);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [reason, setReason] = useState('');
  const [processingAction, setProcessingAction] = useState(false);
  const [selectedSubjectForApproval, setSelectedSubjectForApproval] = useState('');
  const [mockTeachers] = useState([
    { 
      id: 1, 
      name: 'Dr. Manjunath', 
      email: 'manjunath@gmail.com', 
      phone: '+91 9876543210',
      subjects: ['Mathematics', 'Physics', 'Statistics', 'Algebra'], 
      status: 'Pending', 
      coursesAssigned: 0, 
      joinedAt: '2024-01-15',
      qualifications: 'PhD in Mathematics from IISc Bangalore',
      experience: '12 years',
      bio: 'Experienced mathematics professor with expertise in advanced calculus, linear algebra, and mathematical physics. Published 25+ research papers in international journals.',
      address: 'Bangalore, Karnataka',
      specialization: 'Applied Mathematics',
      rating: 4.8,
      totalStudents: 0,
      board: 'CBSE',
      demoVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    { 
      id: 2, 
      name: 'Prof. Somashekhar', 
      email: 'somashekhar@gmail.com', 
      phone: '+91 8765432109',
      subjects: ['Chemistry', 'Organic Chemistry'], 
      status: 'Active', 
      coursesAssigned: 3, 
      joinedAt: '2023-12-10',
      qualifications: 'MSc Chemistry, PhD in Organic Chemistry',
      experience: '8 years',
      bio: 'Passionate chemistry educator specializing in organic synthesis and pharmaceutical chemistry. Known for innovative teaching methods and student engagement.',
      address: 'Mysore, Karnataka',
      specialization: 'Organic Chemistry',
      rating: 4.6,
      totalStudents: 145,
      board: 'ICSE',
      demoVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    { 
      id: 3, 
      name: 'Dr. Santosh', 
      email: 'santosh@gmail.com', 
      phone: '+91 7654321098',
      subjects: ['Biology', 'Botany', 'Zoology', 'Genetics'], 
      status: 'Pending', 
      coursesAssigned: 2, 
      joinedAt: '2023-11-20',
      qualifications: 'PhD Biology, MSc Botany',
      experience: '15 years',
      bio: 'Senior biology professor with extensive research in plant genetics and molecular biology. Former head of department at prestigious university.',
      address: 'Hubli, Karnataka',
      specialization: 'Plant Biology',
      rating: 4.9,
      totalStudents: 89,
      board: 'State Board',
      demoVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');


  // Fetch teachers and statistics from backend
  const fetchTeachers = async () => {
    try {
      // Fetch teacher statistics with aggressive cache busting
      const timestamp = new Date().getTime();
      const randomId = Math.random().toString(36).substring(7);
      const sessionId = Math.random().toString(36).substring(2, 15);
      const statsResponse = await fetch(`http://localhost:8001/api/auth/admin/teacher-statistics/?_=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'If-Modified-Since': 'Thu, 01 Jan 1970 00:00:00 GMT'
        },
        cache: 'no-store'
      });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log('Stats API Response:', statsData);
        console.log('Setting statistics to:', statsData.statistics);
        if (statsData.status === 'success') {
          setStatistics(statsData.statistics);
          console.log('Statistics state updated:', statsData.statistics);
        }
      } else {
        console.error('Stats API failed:', statsResponse.status, statsResponse.statusText);
      }

      // Fetch all teachers with details with aggressive cache busting
      const teachersResponse = await fetch(`http://localhost:8001/api/auth/admin/all-teachers/?_=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'If-Modified-Since': 'Thu, 01 Jan 1970 00:00:00 GMT'
        },
        cache: 'no-store'
      });
      if (teachersResponse.ok) {
        const teachersData = await teachersResponse.json();
        console.log('Teachers API Response:', teachersData);
        console.log('First teacher status:', teachersData.teachers?.[0]?.status);
        if (teachersData.status === 'success') {
          // Map the teacher data to include subjects and other details
          const mappedTeachers = teachersData.teachers.map((teacher: any) => ({
            id: teacher.id,
            teacher_id: teacher.teacher_id,
            name: teacher.name,
            email: teacher.email,
            mobile: teacher.mobile,
            subjects: teacher.subjects || [],
            status: teacher.status, // Use status directly from API
            courses_assigned: teacher.courses || 0,
            created_at: teacher.date_joined,
            date_updated: teacher.date_joined,
            qualification: teacher.qualification,
            experience: teacher.experience
          }));
          console.log('Mapped Teachers:', mappedTeachers.slice(0, 3));
          console.log('First mapped teacher status:', mappedTeachers[0]?.status);
          setTeachers(mappedTeachers);
        } else {
          console.error('Failed to fetch teachers:', teachersData.error);
          // Use mock data as fallback
          setTeachers(mockTeachers.map(t => ({
            id: t.id,
            name: t.name,
            email: t.email,
            subjects: t.subjects,
            status: t.status as 'Pending' | 'Approved' | 'Rejected',
            created_at: t.joinedAt,
            date_updated: t.joinedAt,
            courses_assigned: t.coursesAssigned
          })));
        }
      } else {
        console.error('Failed to fetch teachers');
        // Use mock data as fallback
        setTeachers(mockTeachers.map(t => ({
          id: t.id,
          name: t.name,
          email: t.email,
          subjects: t.subjects,
          status: t.status as 'Pending' | 'Approved' | 'Rejected',
          created_at: t.joinedAt,
          date_updated: t.joinedAt,
          courses_assigned: t.coursesAssigned
        })));
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      // Use mock data as fallback
      setTeachers(mockTeachers.map(t => ({
        id: t.id,
        name: t.name,
        email: t.email,
        subjects: t.subjects,
        status: t.status as 'Pending' | 'Approved' | 'Rejected',
        created_at: t.joinedAt,
        date_updated: t.joinedAt,
        courses_assigned: t.coursesAssigned
      })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || teacher.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Get mock teacher data for display
  const getMockTeacherData = (teacher: Teacher) => {
    const mockData = mockTeachers.find(m => m.id === teacher.id);
    return mockData || {
      subjects: ['General'],
      coursesAssigned: 0,
      qualifications: 'Not specified',
      experience: 'Not specified',
      bio: 'No bio available',
      address: 'Not specified',
      specialization: 'General',
      rating: 0,
      totalStudents: 0,
      board: 'Not specified',
      phone: 'Not specified',
      demoVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    };
  };

  const handleApprove = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setActionType('approve');
    setShowReasonModal(true);
  };

  const handleReject = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setActionType('reject');
    setShowReasonModal(true);
  };

  const submitAction = async () => {
    if (!selectedTeacher) return;
    
    setProcessingAction(true);
    try {
      const endpoint = actionType === 'approve' 
        ? `http://localhost:8001/api/admin/approve_teacher/${selectedTeacher.id}/`
        : `http://localhost:8001/api/admin/reject_teacher/${selectedTeacher.id}/`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: reason.trim() })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Update local state
        setTeachers(prev => prev.map(teacher => 
          teacher.id === selectedTeacher.id 
            ? { ...teacher, status: data.teacher.status }
            : teacher
        ));
        
        // Show success message
        alert(`Teacher ${actionType === 'approve' ? 'approved' : 'rejected'} and email sent successfully!`);
        
        // Close modals
        setShowReasonModal(false);
        setSelectedTeacher(null);
        setReason('');
      } else {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          alert(`Error: ${errorData.message}`);
        } catch {
          alert(`Error: ${response.status} - ${response.statusText}`);
        }
      }
    } catch (error) {
      alert(`Network error: ${error.message}. Make sure Django server is running on port 8001.`);
    } finally {
      setProcessingAction(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return { bg: '#d1fae5', color: '#065f46' };
      case 'Pending': return { bg: '#fef3c7', color: '#92400e' };
      case 'Rejected': return { bg: '#fee2e2', color: '#991b1b' };
      default: return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  if (loading) {
    return (
      <NormalAdminLayout>
        <div className="dashboard-main" style={{ paddingTop: '80px' }}>
          <div className="dashboard-content">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading teachers...</p>
            </div>
          </div>
        </div>
      </NormalAdminLayout>
    );
  }



  return (
    <NormalAdminLayout>
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          {/* Header */}
          <div className="hero-welcome">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">Teacher Management Dashboard</h1>
                <p className="hero-subtitle">Manage teacher accounts, approvals, and monitor their performance</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">
                <FaChalkboardTeacher />
              </div>
              <div className="stat-content">
                <h3>{statistics.total_teachers}</h3>
                <p>Total Teachers</p>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon">
                <FaChalkboardTeacher />
              </div>
              <div className="stat-content">
                <h3>{statistics.verify_teachers}</h3>
                <p>Verify Teachers</p>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-icon">
                <FaChalkboardTeacher />
              </div>
              <div className="stat-content">
                <h3>{statistics.pending_approvals}</h3>
                <p>Pending Approvals</p>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon">
                <FaChalkboardTeacher />
              </div>
              <div className="stat-content">
                <h3>{statistics.approved_teachers}</h3>
                <p>Approved Teachers</p>
              </div>
            </div>
            <div className="stat-card danger">
              <div className="stat-icon">
                <FaChalkboardTeacher />
              </div>
              <div className="stat-content">
                <h3>{statistics.rejected_teachers}</h3>
                <p>Rejected Teachers</p>
              </div>
            </div>
          </div>



          {/* Teachers Management */}
          <div className="dashboard-section">
            <div className="section-header">
              <div className="section-title">
                <FaChalkboardTeacher className="section-icon" />
                <h2>All Teachers</h2>
              </div>
              <button
                onClick={() => {
                  // Force complete page reload to bypass all caching
                  window.location.reload();
                }}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                🔄 Force Refresh
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {/* Search and Filter */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                  <input
                    type="text"
                    placeholder="Search teachers by name, email, or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    minWidth: '150px'
                  }}
                >
                  <option value="All">All Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Teachers Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Teacher</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Subjects</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Courses</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Date Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeachers.map((teacher) => {
                      const statusStyle = getStatusColor(teacher.status);
                      const mockData = getMockTeacherData(teacher);
                      return (
                        <tr key={teacher.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '1rem' }}>
                            <div>
                              <div 
                                onClick={() => setSelectedTeacher(teacher)}
                                style={{ 
                                  fontWeight: '500', 
                                  color: '#111827',
                                  cursor: 'pointer'
                                }}
                              >
                                {teacher.name}
                              </div>
                              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{teacher.email}</div>
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                              {(teacher as any).subjects?.map((subject: string, idx: number) => (
                                <span key={idx} style={{ 
                                  background: '#f3e8ff', 
                                  color: '#7c3aed', 
                                  padding: '0.125rem 0.5rem', 
                                  borderRadius: '9999px', 
                                  fontSize: '0.75rem',
                                  fontWeight: '500'
                                }}>
                                  {subject}
                                </span>
                              )) || <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>No subjects</span>}
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ 
                                background: statusStyle.bg, 
                                color: statusStyle.color, 
                                padding: '0.25rem 0.75rem', 
                                borderRadius: '9999px', 
                                fontSize: '0.875rem',
                                fontWeight: '500'
                              }}>
                                {teacher.status}
                              </span>
                              {teacher.status === 'Pending' && (
                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                  <button
                                    onClick={() => handleApprove(teacher)}
                                    style={{
                                      background: '#16a34a',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '4px',
                                      padding: '0.25rem 0.5rem',
                                      fontSize: '0.75rem',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <FaCheck />
                                  </button>
                                  <button
                                    onClick={() => handleReject(teacher)}
                                    style={{
                                      background: '#dc2626',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '4px',
                                      padding: '0.25rem 0.5rem',
                                      fontSize: '0.75rem',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{ 
                              background: '#dbeafe', 
                              color: '#1e40af', 
                              padding: '0.25rem 0.75rem', 
                              borderRadius: '9999px', 
                              fontSize: '0.875rem',
                              fontWeight: '500'
                            }}>
                              {(teacher as any).courses_assigned || 0} courses
                            </span>
                          </td>
                          <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                            {new Date(teacher.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Reason Modal */}
          {showReasonModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1001
            }}>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2rem',
                maxWidth: '500px',
                width: '90%'
              }}>
                <h3 style={{ marginBottom: '1rem', color: '#374151' }}>
                  {actionType === 'approve' ? 'Approve Teacher' : 'Reject Teacher'}
                </h3>
                <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
                  {actionType === 'approve' 
                    ? 'Add an optional welcome message for the teacher:'
                    : 'Please provide a reason for rejection:'}
                </p>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={actionType === 'approve' 
                    ? 'Welcome to Eduyata! We look forward to working with you.'
                    : 'Please specify the reason for rejection...'}
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    resize: 'vertical'
                  }}
                />
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      setShowReasonModal(false);
                      setReason('');
                    }}
                    disabled={processingAction}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#f3f4f6',
                      color: '#374151',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: processingAction ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitAction}
                    disabled={processingAction}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: actionType === 'approve' ? '#16a34a' : '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: processingAction ? 'not-allowed' : 'pointer',
                      opacity: processingAction ? 0.7 : 1
                    }}
                  >
                    {processingAction 
                      ? (actionType === 'approve' ? 'Approving...' : 'Rejecting...')
                      : (actionType === 'approve' ? 'Approve & Send Email' : 'Reject & Send Email')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Teacher Profile Modal */}
          {selectedTeacher && !showReasonModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2.5rem',
                maxWidth: '1000px',
                width: '95%',
                maxHeight: '95vh',
                overflowY: 'auto'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h2 style={{ margin: 0, color: '#374151' }}>Teacher Profile</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      background: '#e0f2fe',
                      color: '#0369a1',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      border: '1px solid #bae6fd'
                    }}>
                      {getMockTeacherData(selectedTeacher).board}
                    </div>
                    <button 
                      onClick={() => setSelectedTeacher(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: '#6b7280'
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                    <div>
                      <h3 style={{ marginBottom: '1.5rem', color: '#374151', fontSize: '1.25rem' }}>Personal Information</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <FaEnvelope style={{ color: '#6b7280', fontSize: '1.1rem' }} />
                          <div>
                            <div style={{ fontWeight: '500', color: '#374151' }}>Email</div>
                            <div style={{ color: '#6b7280' }}>{selectedTeacher.email}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <FaPhone style={{ color: '#6b7280', fontSize: '1.1rem' }} />
                          <div>
                            <div style={{ fontWeight: '500', color: '#374151' }}>Phone</div>
                            <div style={{ color: '#6b7280' }}>{getMockTeacherData(selectedTeacher).phone}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <FaCalendarAlt style={{ color: '#6b7280', fontSize: '1.1rem' }} />
                          <div>
                            <div style={{ fontWeight: '500', color: '#374151' }}>Joined Date</div>
                            <div style={{ color: '#6b7280' }}>{new Date(selectedTeacher.created_at).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                          <FaGraduationCap style={{ color: '#6b7280', marginTop: '0.25rem', fontSize: '1.1rem' }} />
                          <div>
                            <div style={{ fontWeight: '500', color: '#374151' }}>Qualifications</div>
                            <div style={{ color: '#6b7280' }}>{getMockTeacherData(selectedTeacher).qualifications}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <FaBook style={{ color: '#6b7280', fontSize: '1.1rem' }} />
                          <div>
                            <div style={{ fontWeight: '500', color: '#374151' }}>Experience</div>
                            <div style={{ color: '#6b7280' }}>{getMockTeacherData(selectedTeacher).experience}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 style={{ marginBottom: '1.5rem', color: '#374151', fontSize: '1.25rem' }}>Teaching Information</h3>
                      
                      <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ marginBottom: '1rem', color: '#374151' }}>Subjects & Specialization</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                          {getMockTeacherData(selectedTeacher).subjects.map((subject: string, idx: number) => {
                            const isApproved = getMockTeacherData(selectedTeacher).approvedSubjects?.includes(subject);
                            const isSelected = selectedSubjectForApproval === subject;
                            return (
                              <span 
                                key={idx} 
                                onClick={() => {
                                  if (!isApproved) {
                                    setSelectedSubjectForApproval(isSelected ? '' : subject);
                                  }
                                }}
                                style={{ 
                                  background: isApproved ? '#dcfce7' : isSelected ? '#dbeafe' : '#f3e8ff', 
                                  color: isApproved ? '#166534' : isSelected ? '#1e40af' : '#7c3aed', 
                                  padding: '0.75rem 1.25rem', 
                                  borderRadius: '9999px', 
                                  fontSize: '0.9rem',
                                  fontWeight: '600',
                                  cursor: isApproved ? 'default' : 'pointer',
                                  border: isApproved ? '2px solid #16a34a' : isSelected ? '2px solid #3b82f6' : '1px solid transparent'
                                }}
                              >
                                {subject} {isApproved ? '✓' : ''}
                              </span>
                            );
                          })}
                        </div>
                        <div style={{ 
                          background: '#fef7ff', 
                          padding: '0.75rem 1rem', 
                          borderRadius: '8px',
                          border: '1px solid #f3e8ff'
                        }}>
                          <span style={{ fontWeight: '500', color: '#7c3aed' }}>Specialization: {getMockTeacherData(selectedTeacher).specialization}</span>
                        </div>
                        
                        {selectedSubjectForApproval && (
                          <div style={{ 
                            background: '#f0f9ff', 
                            padding: '1rem', 
                            borderRadius: '8px',
                            border: '2px solid #3b82f6',
                            marginTop: '1rem'
                          }}>
                            <p style={{ margin: '0 0 1rem 0', color: '#1e40af', fontWeight: '500' }}>
                              You have selected: <strong>{selectedSubjectForApproval}</strong>
                            </p>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                onClick={() => {
                                  const mockIndex = mockTeachers.findIndex(t => t.id === selectedTeacher.id);
                                  if (mockIndex !== -1) {
                                    if (!mockTeachers[mockIndex].approvedSubjects) {
                                      mockTeachers[mockIndex].approvedSubjects = [];
                                    }
                                    if (!mockTeachers[mockIndex].approvedSubjects.includes(selectedSubjectForApproval)) {
                                      mockTeachers[mockIndex].approvedSubjects.push(selectedSubjectForApproval);
                                    }
                                  }
                                  alert(`${selectedSubjectForApproval} approved for ${selectedTeacher.name}!`);
                                  setSelectedSubjectForApproval('');
                                }}
                                style={{
                                  padding: '0.5rem 1rem',
                                  background: '#16a34a',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '0.875rem',
                                  fontWeight: '500',
                                  cursor: 'pointer'
                                }}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  alert(`${selectedSubjectForApproval} rejected for ${selectedTeacher.name}!`);
                                  setSelectedSubjectForApproval('');
                                }}
                                style={{
                                  padding: '0.5rem 1rem',
                                  background: '#dc2626',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '0.875rem',
                                  fontWeight: '500',
                                  cursor: 'pointer'
                                }}
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div style={{ 
                          background: '#f0f9ff', 
                          padding: '1rem', 
                          borderRadius: '8px',
                          border: '1px solid #e0f2fe'
                        }}>
                          <div style={{ fontWeight: '500', color: '#374151', marginBottom: '0.2rem' }}>Experience & Location</div>
                          <div style={{ color: '#0369a1', marginBottom: '0.2rem' }}>{getMockTeacherData(selectedTeacher).experience}</div>
                          <div style={{ color: '#7c3aed' }}>{getMockTeacherData(selectedTeacher).address}</div>
                        </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#374151', fontSize: '1.25rem' }}>Biography</h3>
                    <div style={{ 
                      background: '#f9fafb', 
                      padding: '1.5rem', 
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      lineHeight: '1.4'
                    }}>
                      <p style={{ color: '#6b7280', margin: 0 }}>{getMockTeacherData(selectedTeacher).bio}</p>
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#374151', fontSize: '1.25rem' }}>Demo Video</h3>
                    <div style={{ 
                      background: '#fef2f2', 
                      padding: '1.5rem', 
                      borderRadius: '8px',
                      border: '1px solid #fecaca',
                      textAlign: 'center'
                    }}>
                      <FaYoutube style={{ fontSize: '2rem', color: '#dc2626', marginBottom: '0.5rem' }} />
                      <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Watch teaching demonstration</p>
                      <a 
                        href={'https://www.youtube.com/watch?v=dQw4w9WgXcQ'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.75rem 1.5rem',
                          background: '#dc2626',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '8px',
                          fontWeight: '500'
                        }}
                      >
                        <FaYoutube /> Watch Demo Video
                      </a>
                    </div>
                  </div>

                  {/* Approve/Reject Buttons for Pending Teachers */}
                  {selectedTeacher.status === 'Pending' && (
                    <div style={{ marginTop: '2rem' }}>
                      <h3 style={{ marginBottom: '1rem', color: '#374151', fontSize: '1.25rem' }}>Approval Decision</h3>
                      <div style={{ 
                        background: '#f8fafc', 
                        padding: '1.5rem', 
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        textAlign: 'center'
                      }}>
                        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Review the teacher profile and make your decision:</p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                          <button 
                            onClick={() => handleApprove(selectedTeacher)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.75rem 1.5rem',
                              background: '#16a34a',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '1rem',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            <FaCheck /> Approve Teacher
                          </button>
                          <button 
                            onClick={() => handleReject(selectedTeacher)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.75rem 1.5rem',
                              background: '#dc2626',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '1rem',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            <FaTimes /> Reject Teacher
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </NormalAdminLayout>
  );
};

export default NormalAdminTeachers;
