import React, { useState } from 'react';
import { FaUserShield, FaChalkboardTeacher, FaBook, FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import '../Dashboard.css';

interface Admin {
  id: number;
  name: string;
  email: string;
  role: 'Teacher Admin' | 'Course Admin';
  status: 'Active' | 'Inactive';
  joinedDate: string;
  lastLogin: string;
  assignedArea: string;
}

const SuperAdminManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'teacher' | 'course'>('teacher');
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [admins, setAdmins] = useState<Admin[]>([
  ]);

  // Fetch admins from API
  const fetchAdmins = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/admin/admins/');
      if (response.ok) {
        const data = await response.json();
        setAdmins(data.admins);
      } else {
        console.error('Failed to fetch admins');
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAdmins();
  }, []);

  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    role: 'Teacher Admin' as 'Teacher Admin' | 'Course Admin' | 'Both',
    assignedArea: ''
  });

  const filteredAdmins = admins.filter(admin => {
    const matchesTab = activeTab === 'teacher' 
      ? (admin.role === 'Teacher Admin' || admin.role === 'Both')
      : (admin.role === 'Course Admin' || admin.role === 'Both');
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || admin.status === filterStatus;
    return matchesTab && matchesSearch && matchesStatus;
  });

  const handleAddAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email) {
      alert('Please fill in all required fields');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch('http://localhost:8001/api/admin/add_admin/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAdmin)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);
        // Add the new admin to the list immediately
        setAdmins(prev => [data.admin, ...prev]);
        setShowAddModal(false);
        setNewAdmin({ name: '', email: '', role: 'Teacher Admin', assignedArea: '' });
        // Also refresh from server to ensure consistency
        setTimeout(() => fetchAdmins(), 500);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert(`Network error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const toggleAdminStatus = async (adminId: number) => {
    setProcessing(true);
    try {
      const response = await fetch(`http://localhost:8001/api/admin/toggle_admin_status/${adminId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);
        fetchAdmins(); // Refresh the list
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert(`Network error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const deleteAdmin = async (adminId: number) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;
    
    setProcessing(true);
    try {
      const response = await fetch(`http://localhost:8001/api/admin/delete_admin/${adminId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);
        fetchAdmins(); // Refresh the list
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert(`Network error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? { bg: '#d1fae5', color: '#065f46' } : { bg: '#fee2e2', color: '#991b1b' };
  };

  return (
    <AdminLayout>
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          <div className="hero-welcome">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">Admin Management</h1>
                <p className="hero-subtitle">Manage Teacher Admins and Course Admins across the platform</p>
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon"><FaUserShield /></div>
              <div className="stat-content">
                <h3>{admins.length}</h3>
                <p>Total Admins</p>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon"><FaChalkboardTeacher /></div>
              <div className="stat-content">
                <h3>{admins.filter(a => a.role === 'Teacher Admin' || a.role === 'Both').length}</h3>
                <p>Teacher Admins</p>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-icon"><FaBook /></div>
              <div className="stat-content">
                <h3>{admins.filter(a => a.role === 'Course Admin' || a.role === 'Both').length}</h3>
                <p>Course Admins</p>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon"><FaUserShield /></div>
              <div className="stat-content">
                <h3>{admins.filter(a => a.status === 'Active').length}</h3>
                <p>Active Admins</p>
              </div>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <div className="section-title">
                <FaUserShield className="section-icon" />
                <h2>Admin Management</h2>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                <FaPlus /> Add New Admin
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '8px', padding: '4px' }}>
                  <button
                    onClick={() => setActiveTab('teacher')}
                    style={{
                      padding: '0.5rem 1rem',
                      background: activeTab === 'teacher' ? '#3b82f6' : 'transparent',
                      color: activeTab === 'teacher' ? 'white' : '#6b7280',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    👨🏫 Teacher Admins
                  </button>
                  <button
                    onClick={() => setActiveTab('course')}
                    style={{
                      padding: '0.5rem 1rem',
                      background: activeTab === 'course' ? '#3b82f6' : 'transparent',
                      color: activeTab === 'course' ? 'white' : '#6b7280',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    📚 Course Admins
                  </button>
                </div>

                <div style={{ position: 'relative', flex: 1 }}>
                  <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                  <input
                    type="text"
                    placeholder="Search admins by name or email..."
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

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Admin Name</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Email</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Assigned Area</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Last Login</th>

                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmins.map((admin) => {
                      const statusStyle = getStatusColor(admin.status);
                      return (
                        <tr key={admin.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '1rem' }}>
                            <div 
                              onClick={() => setSelectedAdmin(admin)}
                              style={{ cursor: 'pointer' }}
                            >
                              <div style={{ fontWeight: '500', color: '#111827' }}>{admin.name}</div>
                              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{admin.role}</div>
                            </div>
                          </td>
                          <td style={{ padding: '1rem', color: '#6b7280' }}>{admin.email}</td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{ 
                              background: statusStyle.bg, 
                              color: statusStyle.color, 
                              padding: '0.25rem 0.75rem', 
                              borderRadius: '9999px', 
                              fontSize: '0.875rem',
                              fontWeight: '500'
                            }}>
                              {admin.status}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>{admin.assignedArea}</td>
                          <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>{admin.lastLogin}</td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Add Admin Modal */}
          {showAddModal && (
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
                <h3 style={{ marginBottom: '1.5rem', color: '#374151' }}>Add New Admin</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Full Name</label>
                    <input
                      type="text"
                      value={newAdmin.name}
                      onChange={(e) => setNewAdmin(prev => ({ ...prev, name: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Email</label>
                    <input
                      type="email"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Roles</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={newAdmin.role.includes('Teacher Admin') || newAdmin.role === 'Both'}
                          onChange={(e) => {
                            if (e.target.checked) {
                              if (newAdmin.role === 'Course Admin') {
                                setNewAdmin(prev => ({ ...prev, role: 'Both' }));
                              } else {
                                setNewAdmin(prev => ({ ...prev, role: 'Teacher Admin' }));
                              }
                            } else {
                              if (newAdmin.role === 'Both') {
                                setNewAdmin(prev => ({ ...prev, role: 'Course Admin' }));
                              } else {
                                setNewAdmin(prev => ({ ...prev, role: '' }));
                              }
                            }
                          }}
                        />
                        <span>Teacher Admin</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={newAdmin.role.includes('Course Admin') || newAdmin.role === 'Both'}
                          onChange={(e) => {
                            if (e.target.checked) {
                              if (newAdmin.role === 'Teacher Admin') {
                                setNewAdmin(prev => ({ ...prev, role: 'Both' }));
                              } else {
                                setNewAdmin(prev => ({ ...prev, role: 'Course Admin' }));
                              }
                            } else {
                              if (newAdmin.role === 'Both') {
                                setNewAdmin(prev => ({ ...prev, role: 'Teacher Admin' }));
                              } else {
                                setNewAdmin(prev => ({ ...prev, role: '' }));
                              }
                            }
                          }}
                        />
                        <span>Course Admin</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>Assigned Area</label>
                    <input
                      type="text"
                      value={newAdmin.assignedArea}
                      onChange={(e) => setNewAdmin(prev => ({ ...prev, assignedArea: e.target.value }))}
                      placeholder="e.g., Teacher Verification & Approval"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setShowAddModal(false)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#f3f4f6',
                      color: '#374151',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAdmin}
                    disabled={processing}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: processing ? 'not-allowed' : 'pointer',
                      opacity: processing ? 0.7 : 1
                    }}
                  >
                    {processing ? 'Creating...' : 'Create Admin'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Admin Details Modal */}
          {selectedAdmin && (
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
                padding: '2rem',
                maxWidth: '600px',
                width: '90%'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: 0, color: '#374151' }}>Admin Details</h3>
                  <button 
                    onClick={() => setSelectedAdmin(null)}
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontWeight: '500', color: '#374151' }}>Name</label>
                    <p style={{ margin: '0.25rem 0 1rem 0', color: '#6b7280' }}>{selectedAdmin.name}</p>
                  </div>
                  <div>
                    <label style={{ fontWeight: '500', color: '#374151' }}>Email</label>
                    <p style={{ margin: '0.25rem 0 1rem 0', color: '#6b7280' }}>{selectedAdmin.email}</p>
                  </div>
                  <div>
                    <label style={{ fontWeight: '500', color: '#374151' }}>Role</label>
                    <p style={{ margin: '0.25rem 0 1rem 0', color: '#6b7280' }}>{selectedAdmin.role}</p>
                  </div>
                  <div>
                    <label style={{ fontWeight: '500', color: '#374151' }}>Status</label>
                    <p style={{ margin: '0.25rem 0 1rem 0', color: selectedAdmin.status === 'Active' ? '#16a34a' : '#dc2626' }}>{selectedAdmin.status}</p>
                  </div>
                  <div>
                    <label style={{ fontWeight: '500', color: '#374151' }}>Joined Date</label>
                    <p style={{ margin: '0.25rem 0 1rem 0', color: '#6b7280' }}>{new Date(selectedAdmin.joinedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label style={{ fontWeight: '500', color: '#374151' }}>Last Login</label>
                    <p style={{ margin: '0.25rem 0 1rem 0', color: '#6b7280' }}>{selectedAdmin.lastLogin}</p>
                  </div>
                </div>
                
                <div style={{ marginTop: '1rem' }}>
                  <label style={{ fontWeight: '500', color: '#374151' }}>Assigned Area</label>
                  <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>{selectedAdmin.assignedArea}</p>
                </div>

                {loading && (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Loading admins...</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default SuperAdminManagement;
