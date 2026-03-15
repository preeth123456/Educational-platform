import React from 'react';
import { useRoute } from 'wouter';
import { FaArrowLeft, FaEnvelope, FaPhone, FaGraduationCap, FaBook, FaCalendarAlt, FaCheck, FaTimes, FaBan, FaUnlock } from 'react-icons/fa';
import { Link } from 'wouter';
import AdminLayout from '../components/AdminLayout';
import '../Dashboard.css';

const AdminTeacherProfile: React.FC = () => {
  const [match, params] = useRoute('/admin/teacher/:id');
  const teacherId = params?.id;

  const teacher = {
    id: teacherId,
    name: 'Dr. Manjunath',
    email: 'manjunath@gmail.com',
    phone: '+91 8123814344',
    subjects: ['Mathematics', 'Physics'],
    qualifications: 'PhD in Mathematics from MIT',
    bio: 'Experienced educator with 10+ years in teaching advanced mathematics and physics.',
    status: 'Pending',
    coursesAssigned: [
      { id: 1, title: 'Advanced Calculus', students: 45 },
      { id: 2, title: 'Linear Algebra', students: 32 }
    ],
    joinedAt: '2024-01-15',
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    youtubeLink: 'https://www.youtube.com/watch?v=F_7WUK7htRg&pp=ygUbY2JzZSBhcHBsaWVkIG1hdGhzIDEwIGNsYXNz',
    experience: '10+ years teaching experience',
    location: 'Bangalore, India'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return { bg: '#d1fae5', color: '#065f46' };
      case 'Pending': return { bg: '#fef3c7', color: '#92400e' };
      case 'Blocked': return { bg: '#fee2e2', color: '#991b1b' };
      case 'Rejected': return { bg: '#f3f4f6', color: '#6b7280' };
      default: return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  const statusStyle = getStatusColor(teacher.status);

  return (
    <AdminLayout>
      <div style={{ paddingTop: '80px' }}>
        <div>
          <div className="hero-welcome">
            <div className="hero-content">
              <div className="hero-text">
                <Link to="/admin/teachers" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6C63FF', textDecoration: 'none', marginBottom: '1rem' }}>
                  <FaArrowLeft />
                  Back to Teachers
                </Link>
                <h1 className="hero-title">Teacher Profile</h1>
                <p className="hero-subtitle">View and manage teacher information</p>
              </div>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <div className="section-title">
                <img 
                  src={teacher.profilePicture} 
                  alt={teacher.name}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '0.75rem' }}
                />
                <div>
                  <h2 style={{ margin: 0 }}>{teacher.name}</h2>
                  <span style={{ 
                    background: statusStyle.bg, 
                    color: statusStyle.color,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {teacher.status}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ padding: '1rem', position: 'relative' }}>
              {/* Approve/Reject Buttons in Corner */}
              {teacher.name === 'Dr. Manjunath' && (
                <div style={{ 
                  position: 'absolute', 
                  top: '1rem', 
                  right: '1rem', 
                  display: 'flex', 
                  gap: '0.5rem',
                  zIndex: 10
                }}>
                  <button 
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <FaCheck /> Approve
                  </button>
                  <button 
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <FaTimes /> Reject
                  </button>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <h3 style={{ marginBottom: '0.75rem', color: '#374151' }}>Personal Information</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <FaEnvelope style={{ color: '#6b7280' }} />
                      <span>{teacher.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <FaPhone style={{ color: '#6b7280' }} />
                      <span>{teacher.phone}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <FaCalendarAlt style={{ color: '#6b7280' }} />
                      <span>Joined: {new Date(teacher.joinedAt).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <FaGraduationCap style={{ color: '#6b7280', marginTop: '0.25rem' }} />
                      <span>{teacher.qualifications}</span>
                    </div>
                  </div>
                  <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem', color: '#374151' }}>Bio</h4>
                  <p style={{ color: '#6b7280', lineHeight: '1.6', margin: 0 }}>{teacher.bio}</p>
                  
                  {/* Experience & Location */}
                  <div style={{ 
                    marginTop: '1rem', 
                    padding: '0.75rem', 
                    background: '#f8f9fa', 
                    borderRadius: '8px', 
                    border: '1px solid #e9ecef' 
                  }}>
                    <h4 style={{ marginBottom: '0.5rem', color: '#374151' }}>Experience & Location</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <span style={{ color: '#6b7280' }}>📍 {teacher.location}</span>
                      <span style={{ color: '#6b7280' }}>💼 {teacher.experience}</span>
                    </div>
                  </div>
                  
                  {/* YouTube Link */}
                  <div style={{ marginTop: '0.75rem' }}>
                    <a 
                      href={teacher.youtubeLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#dc2626',
                        textDecoration: 'none',
                        fontWeight: '500',
                        fontSize: '0.9rem'
                      }}
                    >
                      🎥 CBSE Applied Maths 10 Class Demo
                    </a>
                  </div>
                </div>

                <div>
                  <h3 style={{ marginBottom: '0.75rem', color: '#374151' }}>Teaching Information</h3>
                  <h4 style={{ marginBottom: '0.5rem', color: '#374151' }}>Subjects</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {teacher.subjects.map((subject, idx) => (
                      <span key={idx} style={{ 
                        background: '#f3e8ff', 
                        color: '#7c3aed', 
                        padding: '0.5rem 1rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}>
                        {subject}
                      </span>
                    ))}
                  </div>
                  <h4 style={{ marginBottom: '0.5rem', color: '#374151' }}>Courses Assigned</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {teacher.coursesAssigned.map((course) => (
                      <div key={course.id} style={{ 
                        background: '#f9fafb', 
                        padding: '1rem', 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: '500', color: '#111827' }}>{course.title}</div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{course.students} students enrolled</div>
                          </div>
                          <FaBook style={{ color: '#6b7280' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* YOUTUBE VIDEO SECTION */}
              <div style={{ 
                marginTop: '1.5rem', 
                padding: '1.5rem', 
                background: '#ffffff', 
                borderRadius: '12px', 
                border: '2px solid #e5e7eb',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <h2 style={{ 
                  marginBottom: '1rem', 
                  color: '#1f2937', 
                  fontSize: '1.5rem', 
                  fontWeight: '700',
                  textAlign: 'center'
                }}>
                  📹 Teaching Demo Video
                </h2>
                <p style={{ 
                  color: '#6b7280', 
                  marginBottom: '2rem', 
                  textAlign: 'center',
                  fontSize: '1rem'
                }}>
                  Watch Dr. Manjunath's Applied Mathematics teaching demonstration
                </p>
                
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <iframe 
                    width="500" 
                    height="300"
                    src="https://www.youtube.com/embed/SlpEHuPHL-Q"
                    title="Mathematics Teaching Demo"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ 
                      borderRadius: '12px', 
                      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                      border: '3px solid #6366f1'
                    }}
                  ></iframe>
                </div>
                
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <a 
                    href={teacher.youtubeLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      display: 'inline-block',
                      padding: '1rem 2rem',
                      background: '#dc2626',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '1.1rem',
                      boxShadow: '0 4px 8px rgba(220, 38, 38, 0.3)'
                    }}
                  >
                    🎥 Watch Full Video on YouTube
                  </a>
                </div>
              </div>

              {/* APPROVE REJECT BUTTONS */}
              <div style={{ 
                marginTop: '1.5rem', 
                padding: '1.5rem', 
                background: '#f8fafc', 
                borderRadius: '12px', 
                border: '2px solid #cbd5e1',
                textAlign: 'center'
              }}>
                <h2 style={{ 
                  marginBottom: '1rem', 
                  color: '#1f2937', 
                  fontSize: '1.5rem', 
                  fontWeight: '700'
                }}>
                  ⚖️ Make Your Decision
                </h2>
                <p style={{ 
                  color: '#6b7280', 
                  marginBottom: '2rem',
                  fontSize: '1rem'
                }}>
                  After reviewing the profile and video, approve or reject this teacher
                </p>
                
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '1rem 2.5rem',
                      background: '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 6px 12px rgba(22, 163, 74, 0.4)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <FaCheck style={{ fontSize: '1.3rem' }} /> 
                    APPROVE TEACHER
                  </button>
                  
                  <button 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '1rem 2.5rem',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 6px 12px rgba(220, 38, 38, 0.4)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <FaTimes style={{ fontSize: '1.3rem' }} /> 
                    REJECT TEACHER
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTeacherProfile;
