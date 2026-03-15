import React, { useState, useEffect } from 'react';
import { FaUsers, FaPlus, FaSearch, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import '../Dashboard.css';

interface Student {
  id: number;
  student_id: string;
  name: string;
  gender?: string;
  mobile_self?: string;
  class?: string;
  board?: string;
  date_of_birth?: string;
  address?: string;
  parent_name?: string;
  parent_phone?: string;
  interests: string[];
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
}

const AdminStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
    total_students: 0,
    active_students: 0,
    inactive_students: 0,
    new_this_month: 0
  });

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]);

  const fetchStudents = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8001/api/admin/students/?page=${page}&page_size=10`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setStudents(data.students);
        setPagination(data.pagination);
        setStatistics(data.statistics);
        setCurrentPage(page);
      } else {
        setError(data.message || 'Failed to fetch students');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getTimeAgo = (dateString: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return formatDate(dateString);
  };

  const filteredStudents = students;

  const { total_students, active_students, inactive_students, new_this_month } = statistics;

  if (loading) {
    return (
      <AdminLayout>
        <div className="dashboard-main" style={{ paddingTop: '80px' }}>
          <div className="dashboard-content">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading students...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="dashboard-main" style={{ paddingTop: '80px' }}>
          <div className="dashboard-content">
            <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
              <p>Error: {error}</p>
              <button onClick={fetchStudents} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Retry
              </button>
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
                <h1 className="hero-title">Student Management</h1>
                <p className="hero-subtitle">Manage student accounts, enrollments, and monitor their progress</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>{total_students.toLocaleString()}</h3>
                <p>Total Students</p>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>{active_students.toLocaleString()}</h3>
                <p>Active Students</p>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>{inactive_students.toLocaleString()}</h3>
                <p>Inactive Students</p>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>{new_this_month.toLocaleString()}</h3>
                <p>New This Month</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="dashboard-section">
            <div className="section-header">
              <div className="section-title">
                <FaUsers className="section-icon" />
                <h2>All Students</h2>
              </div>

            </div>

            <div style={{ padding: '1.5rem' }}>
              {/* Search and Filter */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                  <input
                    type="text"
                    placeholder="Search students..."
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
                    minWidth: '120px'
                  }}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Students Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Student</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Class & Board</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Contact</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => {
                      const status = student.profile_completed ? 'Active' : 'Inactive';
                      return (
                        <tr key={student.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '1rem' }}>
                            <div>
                              <div style={{ fontWeight: '500', color: '#111827' }}>{student.name}</div>
                              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>ID: {student.student_id}</div>
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div>
                              <div style={{ fontWeight: '500' }}>{student.class || 'Not specified'}</div>
                              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{student.board || 'Not specified'}</div>
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div>
                              <div style={{ fontSize: '0.875rem' }}>{student.mobile_self || 'No phone'}</div>
                              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{student.parent_phone || 'No parent phone'}</div>
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{ 
                              background: status === 'Active' ? '#d1fae5' : '#fee2e2', 
                              color: status === 'Active' ? '#065f46' : '#991b1b', 
                              padding: '0.25rem 0.75rem', 
                              borderRadius: '9999px', 
                              fontSize: '0.875rem',
                              fontWeight: '500'
                            }}>
                              {status}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                            {formatDate(student.created_at)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredStudents.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    <p>No students found.</p>
                  </div>
                )}
              </div>
              
              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination.total_count)} of {pagination.total_count} students
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
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
                        onClick={() => setCurrentPage(page)}
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
                      onClick={() => setCurrentPage(currentPage + 1)}
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
      </div>
    </AdminLayout>
  );
};

export default AdminStudents;
