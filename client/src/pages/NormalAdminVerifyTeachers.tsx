import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaSearch, FaDownload, FaCheck, FaTimes, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import NormalAdminLayout from '../components/NormalAdminLayout';
import '../Dashboard.css';

interface Teacher {
  id: number;
  name: string;
  email: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
  date_updated: string;
  document_status?: 'Pending Verification' | 'Verified' | 'Verification Rejected';
}

const NormalAdminVerifyTeachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [verificationRemarks, setVerificationRemarks] = useState('');
  const [processingVerification, setProcessingVerification] = useState(false);

  const [mockTeachers] = useState([
    { 
      id: 1, 
      name: 'Dr. Manjunath', 
      email: 'manjunath@gmail.com', 
      status: 'Pending', 
      joinedAt: '2024-01-15',
      documents: {
        degree: 'degree_certificate.pdf',
        idProof: 'id_proof.pdf',
        experience: 'experience_cert.pdf'
      }
    },
    { 
      id: 2, 
      name: 'Prof. Priya Sharma', 
      email: 'priya.sharma@gmail.com', 
      status: 'Pending', 
      joinedAt: '2024-01-20',
      documents: {
        degree: 'degree_certificate.pdf',
        idProof: 'id_proof.pdf',
        experience: 'experience_cert.pdf'
      }
    },
    { 
      id: 3, 
      name: 'Dr. Vikram Singh', 
      email: 'vikram.singh@gmail.com', 
      status: 'Pending', 
      joinedAt: '2024-01-25',
      documents: {
        degree: 'degree_certificate.pdf',
        idProof: 'id_proof.pdf',
        experience: 'experience_cert.pdf'
      }
    }
  ]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('http://localhost:8001/api/auth/admin/teachers/');
        const data = await response.json();
        
        if (response.ok) {
          setTeachers(data.teachers.map((t: any) => ({
            id: t.id,
            name: t.name,
            email: t.email,
            status: 'Pending' as 'Pending' | 'Approved' | 'Rejected',
            created_at: t.created_at,
            date_updated: t.date_updated,
            document_status: t.document_status || 'Pending Verification'
          })));
        } else {
          console.error('Failed to fetch teachers:', data.error);
          // Fallback to mock data if API fails
          setTeachers(mockTeachers.map(t => ({
            id: t.id,
            name: t.name,
            email: t.email,
            status: t.status as 'Pending' | 'Approved' | 'Rejected',
            created_at: t.joinedAt,
            date_updated: t.joinedAt,
            document_status: t.id === 1 ? 'Pending Verification' : t.id === 2 ? 'Verified' : 'Verification Rejected'
          })));
        }
      } catch (error) {
        console.error('Error fetching teachers:', error);
        // Fallback to mock data if API fails
        setTeachers(mockTeachers.map(t => ({
          id: t.id,
          name: t.name,
          email: t.email,
          status: t.status as 'Pending' | 'Approved' | 'Rejected',
          created_at: t.joinedAt,
          date_updated: t.joinedAt,
          document_status: t.id === 1 ? 'Pending Verification' : t.id === 2 ? 'Verified' : 'Verification Rejected'
        })));
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerifyDocuments = (status: 'Verified' | 'Verification Rejected') => {
    if (!selectedTeacher) return;
    
    setProcessingVerification(true);
    
    // Simulate API call
    setTimeout(() => {
      setTeachers(prev => prev.map(t => 
        t.id === selectedTeacher.id 
          ? { ...t, document_status: status }
          : t
      ));
      
      setShowDocumentModal(false);
      setVerificationRemarks('');
      setProcessingVerification(false);
      
      alert(`Documents ${status === 'Verified' ? 'verified' : 'rejected'} successfully!`);
    }, 1000);
  };

  const getDocumentStatusStyle = (status: string) => {
    switch (status) {
      case 'Verified': return { bg: '#d1fae5', color: '#065f46', icon: <FaCheckCircle /> };
      case 'Verification Rejected': return { bg: '#fee2e2', color: '#991b1b', icon: <FaTimes /> };
      default: return { bg: '#fef3c7', color: '#92400e', icon: <FaExclamationCircle /> };
    }
  };

  if (loading) {
    return (
      <NormalAdminLayout>
        <div className="dashboard-main" style={{ paddingTop: '80px' }}>
          <div className="dashboard-content">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading teachers for verification...</p>
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
                <h1 className="hero-title">Document Verification</h1>
                <p className="hero-subtitle">Verify teacher credentials and documents before approval</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card warning">
              <div className="stat-icon">
                <FaExclamationCircle />
              </div>
              <div className="stat-content">
                <h3>{teachers.filter(t => t.document_status === 'Pending Verification').length}</h3>
                <p>Pending Verification</p>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon">
                <FaCheckCircle />
              </div>
              <div className="stat-content">
                <h3>{teachers.filter(t => t.document_status === 'Verified').length}</h3>
                <p>Verified</p>
              </div>
            </div>
            <div className="stat-card danger">
              <div className="stat-icon">
                <FaTimes />
              </div>
              <div className="stat-content">
                <h3>{teachers.filter(t => t.document_status === 'Verification Rejected').length}</h3>
                <p>Rejected</p>
              </div>
            </div>
            <div className="stat-card primary">
              <div className="stat-icon">
                <FaFileAlt />
              </div>
              <div className="stat-content">
                <h3>{teachers.length}</h3>
                <p>Total Applications</p>
              </div>
            </div>
          </div>

          {/* Document Verification Section */}
          <div className="dashboard-section">
            <div className="section-header">
              <div className="section-title">
                <FaFileAlt className="section-icon" />
                <h2>Teacher Document Verification</h2>
              </div>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {/* Search */}
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

              {/* Teachers Table */}
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
                    {filteredTeachers.map((teacher) => {
                      const docStatus = teacher.document_status || 'Pending Verification';
                      const statusStyle = getDocumentStatusStyle(docStatus);
                      
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
                              onClick={() => {
                                setSelectedTeacher(teacher);
                                setShowDocumentModal(true);
                              }}
                              style={{
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.5rem 1rem',
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                              }}
                            >
                              <FaFileAlt />
                              View Documents
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredTeachers.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    <p>No teachers found matching your search.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Document Verification Modal */}
          {showDocumentModal && selectedTeacher && (
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
              zIndex: 1002
            }}>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2rem',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflowY: 'auto'
              }}>
                <h3 style={{ marginBottom: '1.5rem', color: '#374151' }}>
                  Document Verification - {selectedTeacher.name}
                </h3>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ marginBottom: '1rem', color: '#374151' }}>Uploaded Documents for Verification</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ 
                      padding: '1rem', 
                      background: '#f0f9ff', 
                      borderRadius: '8px',
                      border: '1px solid #bae6fd',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📜</div>
                      <div style={{ fontWeight: '500', color: '#0369a1' }}>Degree Certificate</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>PhD_Certificate.pdf</div>
                    </div>
                    <div style={{ 
                      padding: '1rem', 
                      background: '#f0fdf4', 
                      borderRadius: '8px',
                      border: '1px solid #bbf7d0',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🆔</div>
                      <div style={{ fontWeight: '500', color: '#166534' }}>Government ID Proof</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Aadhaar_Card.pdf</div>
                    </div>
                    <div style={{ 
                      padding: '1rem', 
                      background: '#fefce8', 
                      borderRadius: '8px',
                      border: '1px solid #fde047',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💼</div>
                      <div style={{ fontWeight: '500', color: '#a16207' }}>Experience Certificate</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Experience_Letter.pdf</div>
                    </div>
                    <div style={{ 
                      padding: '1rem', 
                      background: '#fdf2f8', 
                      borderRadius: '8px',
                      border: '1px solid #fbcfe8',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
                      <div style={{ fontWeight: '500', color: '#be185d' }}>Teaching License</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Teaching_License.pdf</div>
                    </div>
                    <div style={{ 
                      padding: '1rem', 
                      background: '#f5f3ff', 
                      borderRadius: '8px',
                      border: '1px solid #d8b4fe',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
                      <div style={{ fontWeight: '500', color: '#7c3aed' }}>Background Verification</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Police_Clearance.pdf</div>
                    </div>
                    <div style={{ 
                      padding: '1rem', 
                      background: '#ecfdf5', 
                      borderRadius: '8px',
                      border: '1px solid #a7f3d0',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</div>
                      <div style={{ fontWeight: '500', color: '#059669' }}>Profile Photo</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Profile_Picture.jpg</div>
                    </div>
                    <div style={{ 
                      padding: '1rem', 
                      background: '#fef7ff', 
                      borderRadius: '8px',
                      border: '1px solid #f3e8ff',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏥</div>
                      <div style={{ fontWeight: '500', color: '#7c3aed' }}>Medical Certificate</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Medical_Report.pdf</div>
                    </div>
                    <div style={{ 
                      padding: '1rem', 
                      background: '#fff7ed', 
                      borderRadius: '8px',
                      border: '1px solid #fed7aa',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
                      <div style={{ fontWeight: '500', color: '#ea580c' }}>Resume/CV</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Teacher_Resume.pdf</div>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    fontWeight: '500', 
                    color: '#374151' 
                  }}>
                    Verification Remarks
                  </label>
                  <textarea
                    value={verificationRemarks}
                    onChange={(e) => setVerificationRemarks(e.target.value)}
                    placeholder="Add remarks about document verification..."
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      setShowDocumentModal(false);
                      setVerificationRemarks('');
                    }}
                    disabled={processingVerification}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#f3f4f6',
                      color: '#374151',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: processingVerification ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleVerifyDocuments('Verification Rejected')}
                    disabled={processingVerification}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: processingVerification ? 'not-allowed' : 'pointer',
                      opacity: processingVerification ? 0.7 : 1
                    }}
                  >
                    {processingVerification ? 'Processing...' : 'Reject Verification'}
                  </button>
                  <button
                    onClick={() => handleVerifyDocuments('Verified')}
                    disabled={processingVerification}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: processingVerification ? 'not-allowed' : 'pointer',
                      opacity: processingVerification ? 0.7 : 1
                    }}
                  >
                    {processingVerification ? 'Processing...' : 'Verify Documents'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </NormalAdminLayout>
  );
};

export default NormalAdminVerifyTeachers;
