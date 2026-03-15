import React, { useState, useEffect } from 'react';
import { FaChalkboardTeacher, FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaCheck, FaTimes, FaBan, FaUnlock, FaEnvelope, FaPhone, FaGraduationCap, FaBook, FaCalendarAlt, FaArrowLeft, FaYoutube, FaFileAlt, FaCheckCircle, FaExclamationCircle, FaDownload, FaUser, FaIdCard, FaBriefcase, FaAward, FaCamera, FaStethoscope, FaArrowRight } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import '../Dashboard.css';

interface Teacher {
  id: number;
  name: string;
  email: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Blocked';
  document_status?: 'Pending' | 'Verified' | 'Incomplete';
  created_at: string;
  date_updated: string;
}

const AdminTeachers: React.FC = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [reason, setReason] = useState('');
  const [processingAction, setProcessingAction] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationTeacher, setVerificationTeacher] = useState<Teacher | null>(null);
  const [teacherDocuments, setTeacherDocuments] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationStatus, setVerificationStatus] = useState<{[key: string]: 'pending' | 'verified' | 'rejected'}>({});
  const [verificationRemarks, setVerificationRemarks] = useState('');
  const [processingVerification, setProcessingVerification] = useState(false);
  const [showVerifySection, setShowVerifySection] = useState(false);
  const [showPendingApprovals, setShowPendingApprovals] = useState(false);
  const [mockTeachers] = useState([
    { 
      id: 1, 
      name: 'Dr. Manjunath', 
      email: 'manjunath@gmail.com', 
      phone: '+91 9876543210',
      subjects: ['Mathematics', 'Physics'], 
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
      status: 'Approved', 
      coursesAssigned: 3, 
      joinedAt: '2023-12-10',
      qualifications: 'MSc Chemistry, PhD in Organic Chemistry',
      experience: '8 years',
      bio: 'Passionate chemistry educator specializing in organic synthesis and pharmaceutical chemistry. Known for innovative teaching methods and student engagement.',
      address: 'Mysore, Karnataka',
      specialization: 'Organic Chemistry',
      rating: 4.6,
      totalStudents: 145,
      board: 'ICSE'
    },
    { 
      id: 3, 
      name: 'Dr. Santosh', 
      email: 'santosh@gmail.com', 
      phone: '+91 7654321098',
      subjects: ['Biology', 'Botany'], 
      status: 'Blocked', 
      coursesAssigned: 2, 
      joinedAt: '2023-11-20',
      qualifications: 'PhD Biology, MSc Botany',
      experience: '15 years',
      bio: 'Senior biology professor with extensive research in plant genetics and molecular biology. Former head of department at prestigious university.',
      address: 'Hubli, Karnataka',
      specialization: 'Plant Biology',
      rating: 4.9,
      totalStudents: 89,
      board: 'State Board'
    },
    { 
      id: 4, 
      name: 'Dr. Priya Sharma', 
      email: 'priya.sharma@gmail.com', 
      phone: '+91 9123456789',
      subjects: ['English', 'Literature'], 
      status: 'Pending', 
      coursesAssigned: 0, 
      joinedAt: '2024-01-20',
      qualifications: 'PhD in English Literature from JNU',
      experience: '10 years',
      bio: 'Passionate English literature professor with expertise in contemporary and classical literature.',
      address: 'Delhi, India',
      specialization: 'Contemporary Literature',
      rating: 4.7,
      totalStudents: 0,
      board: 'CBSE'
    },
    { 
      id: 5, 
      name: 'Prof. Rajesh Kumar', 
      email: 'rajesh.kumar@gmail.com', 
      phone: '+91 8234567890',
      subjects: ['Computer Science', 'Programming'], 
      status: 'Pending', 
      coursesAssigned: 0, 
      joinedAt: '2024-01-18',
      qualifications: 'MTech Computer Science from IIT Delhi',
      experience: '14 years',
      bio: 'Experienced computer science educator specializing in algorithms and software engineering.',
      address: 'Gurgaon, Haryana',
      specialization: 'Software Engineering',
      rating: 4.9,
      totalStudents: 0,
      board: 'CBSE'
    },
    { 
      id: 6, 
      name: 'Ms. Anita Patel', 
      email: 'anita.patel@gmail.com', 
      phone: '+91 7345678901',
      subjects: ['History', 'Social Studies'], 
      status: 'Pending', 
      coursesAssigned: 0, 
      joinedAt: '2024-01-22',
      qualifications: 'MA History from Mumbai University',
      experience: '9 years',
      bio: 'Dedicated history teacher with focus on Indian history and cultural studies.',
      address: 'Mumbai, Maharashtra',
      specialization: 'Indian History',
      rating: 4.5,
      totalStudents: 0,
      board: 'State Board'
    },
    { 
      id: 7, 
      name: 'Dr. Vikram Singh', 
      email: 'vikram.singh@gmail.com', 
      phone: '+91 6456789012',
      subjects: ['Geography', 'Environmental Science'], 
      status: 'Pending', 
      coursesAssigned: 0, 
      joinedAt: '2024-01-25',
      qualifications: 'PhD Geography from BHU',
      experience: '11 years',
      bio: 'Environmental geography expert with research focus on climate change.',
      address: 'Varanasi, UP',
      specialization: 'Environmental Geography',
      rating: 4.6,
      totalStudents: 0,
      board: 'ICSE'
    },
    { 
      id: 8, 
      name: 'Prof. Meera Nair', 
      email: 'meera.nair@gmail.com', 
      phone: '+91 9876543211',
      subjects: ['Physics', 'Quantum Physics'], 
      status: 'Pending', 
      coursesAssigned: 0, 
      joinedAt: '2024-01-28',
      qualifications: 'PhD Physics from IIT Bombay',
      experience: '13 years',
      bio: 'Quantum physics researcher with expertise in theoretical physics.',
      address: 'Mumbai, Maharashtra',
      specialization: 'Quantum Physics',
      rating: 4.8,
      totalStudents: 0,
      board: 'CBSE'
    },
    { 
      id: 9, 
      name: 'Dr. Arjun Reddy', 
      email: 'arjun.reddy@gmail.com', 
      phone: '+91 8765432110',
      subjects: ['Economics', 'Statistics'], 
      status: 'Pending', 
      coursesAssigned: 0, 
      joinedAt: '2024-01-30',
      qualifications: 'PhD Economics from Delhi School of Economics',
      experience: '16 years',
      bio: 'Economics professor specializing in macroeconomics and statistical analysis.',
      address: 'Hyderabad, Telangana',
      specialization: 'Macroeconomics',
      rating: 4.7,
      totalStudents: 0,
      board: 'State Board'
    },
    { 
      id: 10, 
      name: 'Ms. Kavya Iyer', 
      email: 'kavya.iyer@gmail.com', 
      phone: '+91 7654321099',
      subjects: ['Tamil', 'Sanskrit'], 
      status: 'Pending', 
      coursesAssigned: 0, 
      joinedAt: '2024-02-01',
      qualifications: 'MA Tamil Literature, MA Sanskrit',
      experience: '7 years',
      bio: 'Language expert specializing in classical Tamil and Sanskrit literature.',
      address: 'Chennai, Tamil Nadu',
      specialization: 'Classical Languages',
      rating: 4.6,
      totalStudents: 0,
      board: 'State Board'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    page_size: 10,
    has_next: false,
    has_previous: false
  });
  const [statistics, setStatistics] = useState({
    total_teachers: 0,
    pending_teachers: 0,
    approved_teachers: 0,
    verified_pending: 0,
    rejected_teachers: 0
  });

  // Fetch teachers from backend
  const fetchTeachers = async (page = 1) => {
    try {
      const response = await fetch(`http://localhost:8001/api/admin/teachers/?page=${page}&page_size=10`);
      const data = await response.json();
      console.log('Fetched teachers:', data);
      
      if (data.status === 'success') {
        const backendTeachers = (data.teachers || []).map((t: any) => ({
          id: t.id,
          name: t.name,
          email: t.email,
          status: t.is_active === false ? 'Pending' : 
                  t.approval_status === 'approved' ? 'Approved' : 
                  t.approval_status === 'rejected' ? 'Rejected' : 'Pending',
          document_status: t.document_status || 'Pending Verification',
          created_at: t.created_at,
          date_updated: t.created_at,
          subjects: Object.keys(t.subject_classes || {}),
          courses_assigned: 0,
          phone: t.mobile,
          qualifications: t.qualification || t.highest_qualification || 'Not specified',
          experience: `${t.experience_years || 0} years`,
          bio: t.bio || 'No bio available',
          address: 'Not specified',
          specialization: Object.keys(t.subject_classes || {})[0] || 'General',
          rating: 0,
          totalStudents: 0,
          board: Array.isArray(t.boards) ? t.boards.join(', ') : 'Not specified'
        }));
        
        setTeachers(backendTeachers);
        setPagination(data.pagination);
        setStatistics(data.statistics);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      console.error('Failed to fetch teachers from backend, using empty list');
      setTeachers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTeachers(currentPage);
  }, [currentPage]);

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
      phone: 'Not specified'
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
      
      console.log('Making API call to:', endpoint);
      console.log('Request data:', { reason: reason.trim() });
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: reason.trim() })
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Success response:', data);
        
        // Refresh teachers data from backend
        await fetchTeachers();
        
        // Show success message
        alert(`Teacher ${actionType === 'approve' ? 'approved' : 'rejected'} and email sent successfully!`);
        
        // Close modals but maintain current view
        setShowReasonModal(false);
        setSelectedTeacher(null);
        setReason('');
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          alert(`Error: ${errorData.message}`);
        } catch {
          alert(`Error: ${response.status} - ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      alert(`Network error: ${error.message}. Make sure Django server is running on port 8001.`);
    } finally {
      setProcessingAction(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return { bg: '#fef3c7', color: '#92400e' };
      case 'Approved': return { bg: '#d1fae5', color: '#065f46' };
      case 'Rejected': return { bg: '#fee2e2', color: '#991b1b' };
      case 'Blocked': return { bg: '#f3f4f6', color: '#374151' };
      default: return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="dashboard-main" style={{ paddingTop: '80px' }}>
          <div className="dashboard-content">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading teachers...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          {/* Header */}
          <div className="hero-welcome">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">Teacher Management</h1>
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
            <div 
              className="stat-card danger"
              onClick={() => {
                setShowVerifySection(true);
                setShowPendingApprovals(false);
              }}
              style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="stat-icon">
                <FaFileAlt />
              </div>
              <div className="stat-content">
                <h3>{statistics.pending_teachers}</h3>
                <p>Verify Teachers</p>
              </div>
            </div>
            <div 
              className="stat-card warning"
              onClick={() => {
                setShowPendingApprovals(true);
                setShowVerifySection(false);
              }}
              style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="stat-icon">
                <FaChalkboardTeacher />
              </div>
              <div className="stat-content">
                <h3>{statistics.verified_pending}</h3>
                <p>Pending Approvals</p>
              </div>
            </div>
            <div 
              className="stat-card success"
              onClick={() => {
                setShowVerifySection(false);
                setShowPendingApprovals(false);
                setFilterStatus('Approved');
              }}
              style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="stat-icon">
                <FaChalkboardTeacher />
              </div>
              <div className="stat-content">
                <h3>{statistics.approved_teachers}</h3>
                <p>Approved Teachers</p>
              </div>
            </div>
            <div 
              className="stat-card info"
              onClick={() => {
                setShowVerifySection(false);
                setShowPendingApprovals(false);
                setFilterStatus('Rejected');
              }}
              style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
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
          {!showVerifySection && !showPendingApprovals && (
            <div className="dashboard-section">
              <div className="section-header">
                <div className="section-title">
                  <FaChalkboardTeacher className="section-icon" />
                  <h2>All Teachers</h2>
                </div>
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
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Blocked">Blocked</option>
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
                                {teacher.status === 'Pending' && teacher.document_status === 'Verified' && (
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
                  
                  {/* Pagination */}
                  {pagination.total_pages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination.total_count)} of {pagination.total_count} teachers
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => fetchTeachers(currentPage - 1)}
                          disabled={!pagination.has_previous}
                          style={{
                            padding: '0.5rem 1rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            background: pagination.has_previous ? 'white' : '#f9fafb',
                            color: pagination.has_previous ? '#374151' : '#9ca3af',
                            cursor: pagination.has_previous ? 'pointer' : 'not-allowed'
                          }}
                        >
                          Previous
                        </button>
                        
                        {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => fetchTeachers(page)}
                            style={{
                              padding: '0.5rem 0.75rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              background: page === currentPage ? '#3b82f6' : 'white',
                              color: page === currentPage ? 'white' : '#374151',
                              cursor: 'pointer'
                            }}
                          >
                            {page}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => fetchTeachers(currentPage + 1)}
                          disabled={!pagination.has_next}
                          style={{
                            padding: '0.5rem 1rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            background: pagination.has_next ? 'white' : '#f9fafb',
                            color: pagination.has_next ? '#374151' : '#9ca3af',
                            cursor: pagination.has_next ? 'pointer' : 'not-allowed'
                          }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pending Approvals Section */}
          {showPendingApprovals && (
            <div className="dashboard-section">
              <div className="section-header">
                <div className="section-title">
                  <FaChalkboardTeacher className="section-icon" />
                  <h2>Pending Approvals - Verified Teachers</h2>
                </div>
              </div>

              <div style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ position: 'relative', maxWidth: '400px' }}>
                    <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                    <input
                      type="text"
                      placeholder="Search verified teachers..."
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
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Teacher</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Subjects</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Document Status</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Applied Date</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTeachers.filter(t => t.status === 'Pending' && t.document_status === 'Verified').map((teacher) => {
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
                              <span style={{ 
                                background: '#d1fae5', 
                                color: '#065f46', 
                                padding: '0.25rem 0.75rem', 
                                borderRadius: '9999px', 
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}>
                                <FaCheckCircle />
                                Verified
                              </span>
                            </td>
                            <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                              {new Date(teacher.created_at).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                  onClick={() => handleApprove(teacher)}
                                  style={{
                                    background: '#16a34a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                  }}
                                >
                                  <FaCheck /> Approve
                                </button>
                                <button
                                  onClick={() => handleReject(teacher)}
                                  style={{
                                    background: '#dc2626',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                  }}
                                >
                                  <FaTimes /> Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filteredTeachers.filter(t => t.status === 'Pending' && t.document_status === 'Verified').length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                      <p>No verified teachers pending approval.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Verify Teachers Section */}
          {showVerifySection && (
            <div className="dashboard-section">
              <div className="section-header">
                <div className="section-title">
                  <FaFileAlt className="section-icon" />
                  <h2>Document Verification</h2>
                </div>
              </div>

              <div style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ position: 'relative', maxWidth: '400px' }}>
                    <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                    <input
                      type="text"
                      placeholder="Search teachers..."
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
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Teacher</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Document Status</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Applied Date</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTeachers.filter(t => t.status === 'Pending').map((teacher) => {
                        const docStatus = teacher.document_status || 'Pending Verification';
                        const statusStyle = docStatus === 'Verified' ? 
                          { bg: '#d1fae5', color: '#065f46', icon: <FaCheckCircle /> } :
                          docStatus === 'Incomplete' ?
                          { bg: '#fee2e2', color: '#991b1b', icon: <FaTimes /> } :
                          { bg: '#fef3c7', color: '#92400e', icon: <FaExclamationCircle /> };
                        
                        return (
                          <tr key={teacher.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <td style={{ padding: '1rem' }}>
                              <div>
                                <div style={{ fontWeight: '500', color: '#111827' }}>{teacher.name}</div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{teacher.email}</div>
                              </div>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <span style={{ 
                                background: statusStyle.bg, 
                                color: statusStyle.color, 
                                padding: '0.25rem 0.75rem', 
                                borderRadius: '9999px', 
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}>
                                {statusStyle.icon}
                                {docStatus}
                              </span>
                            </td>
                            <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                              {new Date(teacher.created_at).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <button
                                onClick={async () => {
                                  setVerificationTeacher(teacher);
                                  setCurrentStep(1);
                                  setVerificationStatus({});
                                  
                                  // Fetch teacher documents
                                  try {
                                    const backendTeacher = await fetch(`http://localhost:8001/api/admin/teachers/?status=all`)
                                      .then(res => res.json())
                                      .then(data => data.teachers.find((t: any) => t.id === teacher.id));
                                    
                                    if (backendTeacher?.teacher_id) {
                                      console.log('Fetching documents for teacher:', backendTeacher.teacher_id);
                                      const docResponse = await fetch(`http://localhost:8001/api/admin/teachers/${backendTeacher.teacher_id}/documents/`);
                                      console.log('Document response status:', docResponse.status);
                                      
                                      if (docResponse.ok) {
                                        const docData = await docResponse.json();
                                        console.log('Document data received:', docData);
                                        setTeacherDocuments(docData);
                                      } else {
                                        console.error('Failed to fetch documents:', docResponse.status, docResponse.statusText);
                                        const errorText = await docResponse.text();
                                        console.error('Error response:', errorText);
                                      }
                                    } else {
                                      console.error('No teacher_id found for teacher:', teacher.id);
                                    }
                                  } catch (error) {
                                    console.error('Error fetching teacher documents:', error);
                                  }
                                  
                                  setShowVerificationModal(true);
                                }}
                                style={{
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '8px',
                                  padding: '0.75rem 1.25rem',
                                  fontSize: '0.875rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  fontWeight: '600',
                                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                                }}
                              >
                                <FaEye />
                                Start Verification
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filteredTeachers.filter(t => t.status === 'Pending').length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                      <p>No teachers found for verification.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}



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
                          {getMockTeacherData(selectedTeacher).subjects.map((subject: string, idx: number) => (
                            <span key={idx} style={{ 
                              background: '#f3e8ff', 
                              color: '#7c3aed', 
                              padding: '0.75rem 1.25rem', 
                              borderRadius: '9999px', 
                              fontSize: '0.9rem',
                              fontWeight: '600'
                            }}>
                              {subject}
                            </span>
                          ))}
                        </div>
                        <div style={{ 
                          background: '#fef7ff', 
                          padding: '0.75rem 1rem', 
                          borderRadius: '8px',
                          border: '1px solid #f3e8ff'
                        }}>
                          <span style={{ fontWeight: '500', color: '#7c3aed' }}>Specialization: {getMockTeacherData(selectedTeacher).specialization}</span>
                        </div>
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

                  {/* Approve/Reject Buttons for Pending Teachers with Verified Documents */}
                  {selectedTeacher.status === 'Pending' && selectedTeacher.document_status === 'Verified' && (
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

          {/* Teacher Verification Modal */}
          {showVerificationModal && verificationTeacher && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1003,
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                borderRadius: '20px',
                width: '95vw',
                height: '90vh',
                maxWidth: '1400px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '2rem',
                  borderRadius: '20px 20px 0 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700' }}>Teacher Verification Process</h2>
                    <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>{verificationTeacher.name} - {verificationTeacher.email}</p>
                  </div>
                  <button
                    onClick={() => setShowVerificationModal(false)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      color: 'white',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>

                <div style={{
                  padding: '1.5rem 2rem',
                  background: 'white',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
                    {[1, 2, 3].map((step) => (
                      <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: currentStep >= step ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#e5e7eb',
                          color: currentStep >= step ? 'white' : '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '600',
                          fontSize: '1.1rem',
                          boxShadow: currentStep >= step ? '0 4px 12px rgba(16, 185, 129, 0.4)' : 'none',
                          transition: 'all 0.3s ease'
                        }}>
                          {currentStep > step ? <FaCheck /> : step}
                        </div>
                        <span style={{
                          fontWeight: '600',
                          color: currentStep >= step ? '#10b981' : '#6b7280',
                          fontSize: '0.9rem'
                        }}>
                          {step === 1 ? 'Documents' : step === 2 ? 'Verification' : 'Decision'}
                        </span>
                        {step < 3 && (
                          <FaArrowRight style={{
                            color: currentStep > step ? '#10b981' : '#d1d5db',
                            marginLeft: '1rem'
                          }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{
                  flex: 1,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '1px',
                  background: '#e2e8f0',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: 'white',
                    padding: '2rem',
                    overflowY: 'auto'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1.5rem',
                      padding: '1rem',
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 100%)',
                      borderRadius: '12px',
                      border: '2px solid #facc15'
                    }}>
                      <FaFileAlt style={{ fontSize: '1.5rem', color: '#a16207' }} />
                      <h3 style={{ margin: 0, color: '#a16207', fontSize: '1.2rem', fontWeight: '700' }}>Teacher Documents</h3>
                    </div>
                    
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                      {teacherDocuments ? (
                        Object.entries(teacherDocuments.documents || {}).map(([docType, docData]: [string, any], index) => {
                          if (!docData?.url) return null;
                          
                          const docConfig = {
                            profile_picture: { icon: FaCamera, title: 'Profile Photo', color: '#8b5cf6' },
                            cv_file: { icon: FaFileAlt, title: 'Resume/CV', color: '#ea580c' },
                            government_id_file: { icon: FaIdCard, title: 'Government ID', color: '#10b981' },
                            degree_certificate_file: { icon: FaAward, title: 'Degree Certificate', color: '#f59e0b' },
                            experience_proof_file: { icon: FaBriefcase, title: 'Experience Proof', color: '#ef4444' }
                          }[docType] || { icon: FaFileAlt, title: docType.replace('_', ' '), color: '#6b7280' };
                          
                          return (
                            <div key={index} style={{
                              padding: '2rem',
                              background: `linear-gradient(135deg, ${docConfig.color}15 0%, ${docConfig.color}25 100%)`,
                              borderRadius: '16px',
                              border: `3px solid ${docConfig.color}40`,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '1rem',
                              textAlign: 'center'
                            }}>
                              <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '20px',
                                background: docConfig.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '2rem'
                              }}>
                                <docConfig.icon />
                              </div>
                              <div>
                                <div style={{ fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>{docConfig.title}</div>
                                <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>
                                  {docData.metadata?.reuploaded && (
                                    <div style={{ 
                                      background: '#fef3c7', 
                                      color: '#92400e', 
                                      padding: '0.25rem 0.5rem', 
                                      borderRadius: '4px', 
                                      fontSize: '0.75rem', 
                                      marginBottom: '0.5rem',
                                      fontWeight: '600'
                                    }}>
                                      🔄 REUPLOADED
                                    </div>
                                  )}
                                  {docData.metadata?.original_filename || 'Document'}
                                </div>
                                {docData.url.includes('.pdf') ? (
                                  <iframe 
                                    src={`http://localhost:8001${docData.url}`} 
                                    style={{ width: '200px', height: '150px', border: 'none', borderRadius: '8px' }}
                                    title={docConfig.title}
                                  />
                                ) : (
                                  <img 
                                    src={`http://localhost:8001${docData.url}`} 
                                    alt={docConfig.title}
                                    style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                                  />
                                )}
                                <div style={{ marginTop: '1rem' }}>
                                  <a 
                                    href={`http://localhost:8001${docData.url}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{ color: docConfig.color, textDecoration: 'none' }}
                                  >
                                    <FaDownload style={{ cursor: 'pointer' }} />
                                  </a>
                                </div>
                              </div>
                            </div>
                          );
                        }).filter(Boolean)
                      ) : (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                          Loading documents...
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{
                    background: 'white',
                    padding: '2rem',
                    overflowY: 'auto'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1.5rem',
                      padding: '1rem',
                      background: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)',
                      borderRadius: '12px',
                      border: '2px solid #3b82f6'
                    }}>
                      <FaCheckCircle style={{ fontSize: '1.5rem', color: '#1d4ed8' }} />
                      <h3 style={{ margin: 0, color: '#1d4ed8', fontSize: '1.2rem', fontWeight: '700' }}>Verify Documents</h3>
                    </div>
                    
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      {teacherDocuments ? Object.keys(teacherDocuments.documents || {}).filter(key => teacherDocuments.documents[key]?.url).map((docType, index) => {
                        const docName = {
                          'profile_picture': 'Profile Picture',
                          'cv_file': 'Resume/CV',
                          'government_id_file': 'Government ID',
                          'degree_certificate_file': 'Degree Certificate',
                          'experience_proof_file': 'Experience Proof'
                        }[docType] || docType.replace('_', ' ');
                        const status = verificationStatus[docType] || 'pending';
                        return (
                          <div key={index} style={{
                            padding: '1.25rem',
                            background: status === 'verified' ? '#f0fdf4' : '#f8fafc',
                            borderRadius: '12px',
                            border: `2px solid ${status === 'verified' ? '#10b981' : '#e2e8f0'}`
                          }}>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '0.75rem'
                            }}>
                              <span style={{ fontWeight: '600', color: '#1f2937' }}>{docName}</span>
                              <div style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                background: status === 'verified' ? '#10b981' : '#6b7280',
                                color: 'white'
                              }}>
                                {status === 'verified' ? 'VERIFIED' : 'PENDING'}
                              </div>
                            </div>
                            <label style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              cursor: 'pointer'
                            }}>
                              <input
                                type="checkbox"
                                checked={status === 'verified'}
                                onChange={() => {
                                  setVerificationStatus(prev => ({ 
                                    ...prev, 
                                    [docType]: status === 'verified' ? 'pending' : 'verified' 
                                  }));
                                  const allDocs = Object.keys(teacherDocuments.documents || {}).filter(key => teacherDocuments.documents[key]?.url);
                                  const newStatus = { ...verificationStatus, [docType]: status === 'verified' ? 'pending' : 'verified' };
                                  const allVerified = allDocs.every(doc => newStatus[doc] === 'verified');
                                  if (allVerified) {
                                    setTimeout(() => setCurrentStep(3), 500);
                                  }
                                }}
                                style={{ width: '20px', height: '20px', accentColor: '#10b981' }}
                              />
                              <FaCheck style={{ color: status === 'verified' ? '#10b981' : '#9ca3af' }} />
                              Verified
                            </label>
                          </div>
                        );
                      }) : (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                          Loading verification options...
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{
                    background: 'white',
                    padding: '2rem',
                    overflowY: 'auto'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1.5rem',
                      padding: '1rem',
                      background: 'linear-gradient(135deg, #f3e8ff 0%, #c084fc 100%)',
                      borderRadius: '12px',
                      border: '2px solid #8b5cf6'
                    }}>
                      <FaUser style={{ fontSize: '1.5rem', color: '#7c3aed' }} />
                      <h3 style={{ margin: 0, color: '#7c3aed', fontSize: '1.2rem', fontWeight: '700' }}>Final Decision</h3>
                    </div>
                    
                    <div style={{
                      padding: '1.5rem',
                      background: 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)',
                      borderRadius: '12px',
                      marginBottom: '1.5rem',
                      border: '2px solid #3b82f6'
                    }}>
                      <h4 style={{ margin: '0 0 1rem 0', color: '#1e40af' }}>Teacher Profile</h4>
                      <div style={{ display: 'grid', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <FaUser style={{ color: '#3b82f6' }} />
                          <div>
                            <div style={{ fontWeight: '600', color: '#1f2937' }}>Name</div>
                            <div style={{ color: '#4b5563' }}>{verificationTeacher.name}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <FaFileAlt style={{ color: '#3b82f6' }} />
                          <div>
                            <div style={{ fontWeight: '600', color: '#1f2937' }}>Email</div>
                            <div style={{ color: '#4b5563' }}>{verificationTeacher.email}</div>
                          </div>
                        </div>
                        {teacherDocuments?.teacher && (
                          <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <FaPhone style={{ color: '#3b82f6' }} />
                              <div>
                                <div style={{ fontWeight: '600', color: '#1f2937' }}>Mobile</div>
                                <div style={{ color: '#4b5563' }}>{teacherDocuments.teacher.mobile}</div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <FaGraduationCap style={{ color: '#3b82f6' }} />
                              <div>
                                <div style={{ fontWeight: '600', color: '#1f2937' }}>Qualification</div>
                                <div style={{ color: '#4b5563' }}>{teacherDocuments.teacher.qualification}</div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: '#374151'
                      }}>Final Remarks</label>
                      <textarea
                        value={verificationRemarks}
                        onChange={(e) => setVerificationRemarks(e.target.value)}
                        placeholder="Specify which documents need attention (e.g., 'Government ID is unclear', 'Degree certificate is missing', 'Experience proof does not match')..."
                        style={{
                          width: '100%',
                          minHeight: '100px',
                          padding: '0.75rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          resize: 'vertical'
                        }}
                      />
                      <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                        💡 Tip: Be specific about which documents need correction for faster resubmission
                      </p>
                    </div>
                    
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      <button
                        onClick={async () => {
                          setProcessingVerification(true);
                          try {
                            const response = await fetch(`http://localhost:8001/api/admin/verify_documents/${verificationTeacher.id}/`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ document_status: 'Verified' })
                            });
                            if (response.ok) {
                              await fetchTeachers();
                              alert('Documents verified and email sent! Teacher moved to Pending Approvals.');
                            }
                          } catch (error) {
                            console.error('Error verifying documents:', error);
                          }
                          setShowVerificationModal(false);
                          setProcessingVerification(false);
                          setVerificationRemarks('');
                          setCurrentStep(1);
                          setVerificationStatus({});
                        }}
                        disabled={processingVerification}
                        style={{
                          padding: '1rem',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '1rem',
                          fontWeight: '700',
                          cursor: processingVerification ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          opacity: processingVerification ? 0.7 : 1
                        }}
                      >
                        <FaCheck /> {processingVerification ? 'Processing...' : 'DOCUMENTS VERIFIED'}
                      </button>
                      <button
                        onClick={async () => {
                          setProcessingVerification(true);
                          try {
                            const response = await fetch(`http://localhost:8001/api/admin/verify_documents/${verificationTeacher.id}/`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ 
                                document_status: 'Incomplete',
                                remarks: verificationRemarks
                              })
                            });
                            if (response.ok) {
                              await fetchTeachers();
                              alert('Documents marked as incomplete and email sent!');
                            }
                          } catch (error) {
                            console.error('Error marking documents incomplete:', error);
                          }
                          setShowVerificationModal(false);
                          setProcessingVerification(false);
                          setVerificationRemarks('');
                          setCurrentStep(1);
                          setVerificationStatus({});
                        }}
                        disabled={processingVerification}
                        style={{
                          padding: '1rem',
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '1rem',
                          fontWeight: '700',
                          cursor: processingVerification ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          opacity: processingVerification ? 0.7 : 1
                        }}
                      >
                        <FaTimes /> {processingVerification ? 'Processing...' : 'DOCUMENTS INCOMPLETE'}
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: '1.5rem 2rem',
                  background: 'white',
                  borderTop: '1px solid #e2e8f0',
                  borderRadius: '0 0 20px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <button
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: currentStep === 1 ? '#f3f4f6' : '#6b7280',
                      color: currentStep === 1 ? '#9ca3af' : 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <FaArrowLeft /> Previous
                  </button>
                  
                  <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '500' }}>
                    Step {currentStep} of 3
                  </div>
                  
                  <button
                    onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                    disabled={currentStep === 3}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: currentStep === 3 ? '#f3f4f6' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: currentStep === 3 ? '#9ca3af' : 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: currentStep === 3 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    Next <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTeachers;
