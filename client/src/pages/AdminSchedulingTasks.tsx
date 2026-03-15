import React, { useState } from 'react';
import { FaCalendarAlt, FaTasks, FaClock, FaCheck, FaArrowRight, FaPlus, FaCalendar, FaBell, FaTimes } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import '../Dashboard.css';

interface Schedule {
  id: number;
  event_name: string;
  event_datetime: string;
  event_type: string;
  assigned_to: string;
  reminder_1_day: boolean;
  reminder_1_hour: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const AdminSchedulingTasks: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [schedulesLoading, setSchedulesLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    event_name: '',
    event_datetime: '',
    event_type: 'Assessment',
    assigned_to: 'Admin team',
    reminder_1_day: false,
    reminder_1_hour: false
  });
  const [loading, setLoading] = useState(false);

  // Fetch schedules on component mount
  React.useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/auth/get_schedules/');
      const data = await response.json();
      if (data.schedules) {
        setSchedules(data.schedules);
        setCurrentPage(1); // Reset to first page when new data loads
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setSchedulesLoading(false);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(schedules.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSchedules = schedules.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Scroll to form when it's shown
  React.useEffect(() => {
    if (showForm) {
      setTimeout(() => {
        const formElement = document.getElementById('schedule-form');
        if (formElement) {
          formElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100); // Small delay to ensure form is rendered
    }
  }, [showForm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8001/api/auth/create_schedule/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        alert('Schedule created successfully!');
        setShowForm(false);
        setFormData({
          event_name: '',
          event_datetime: '',
          event_type: 'Assessment',
          assigned_to: 'Admin team',
          reminder_1_day: false,
          reminder_1_hour: false
        });
        // Refresh schedules list
        fetchSchedules();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert('Failed to create schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          {/* Header */}
          <div className="hero-welcome">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">Scheduling & Task Tracking</h1>
                <p className="hero-subtitle">Manage schedules, track tasks, and coordinate administrative workflows</p>
              </div>
            </div>
          </div>

          {/* Scheduling Overview Metrics */}
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">
                <FaCalendarAlt />
              </div>
              <div className="stat-content">
                <h3>47</h3>
                <p>Scheduled Events</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon">
                <FaTasks />
              </div>
              <div className="stat-content">
                <h3>156</h3>
                <p>Active Tasks</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-icon">
                <FaCheck />
              </div>
              <div className="stat-content">
                <h3>89%</h3>
                <p>Task Completion</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '89%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon">
                <FaClock />
              </div>
              <div className="stat-content">
                <h3>12</h3>
                <p>Overdue Tasks</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Management */}
          <div className="progress-dashboard">
            <div className="section-header" style={{ marginBottom: '0' }}>
              <div className="section-title">
                <FaCalendarAlt className="section-icon" />
                <h2>Schedule Management</h2>
              </div>
              <button className="view-all-btn" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancel' : 'New Schedule'}
                {showForm ? <FaTimes /> : <FaPlus />}
              </button>
            </div>

            {/* Schedule History */}
            <div style={{ marginTop: '0px' }}>

              {schedulesLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p>Loading schedules...</p>
                </div>
              ) : schedules.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <FaCalendarAlt size={48} style={{ color: '#cbd5e0', marginBottom: '16px' }} />
                  <h3 style={{ color: '#4a5568', marginBottom: '8px' }}>No Schedules Yet</h3>
                  <p style={{ color: '#718096' }}>Create your first schedule using the button above</p>
                </div>
              ) : (
                <div style={{
                  background: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    padding: '20px',
                    borderBottom: '1px solid #e2e8f0',
                    background: '#f8f9fa'
                  }}>
                    <h3 style={{ margin: 0, color: '#2d3748' }}>
                      Recent Schedules ({startIndex + 1}-{Math.min(endIndex, schedules.length)} of {schedules.length})
                    </h3>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse'
                    }}>
                      <thead>
                        <tr style={{ background: '#f8f9fa' }}>
                          <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#4a5568', borderBottom: '1px solid #e2e8f0' }}>Event Name</th>
                          <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#4a5568', borderBottom: '1px solid #e2e8f0' }}>Date & Time</th>
                          <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#4a5568', borderBottom: '1px solid #e2e8f0' }}>Type</th>
                          <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#4a5568', borderBottom: '1px solid #e2e8f0' }}>Assigned To</th>
                          <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#4a5568', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentSchedules.map((schedule) => (
                          <tr key={schedule.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '12px 16px', color: '#2d3748', fontWeight: '500' }}>
                              {schedule.event_name}
                            </td>
                            <td style={{ padding: '12px 16px', color: '#4a5568' }}>
                              {new Date(schedule.event_datetime).toLocaleString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor: schedule.event_type === 'Assessment' ? '#fef3c7' :
                                               schedule.event_type === 'Course' ? '#dbeafe' :
                                               schedule.event_type === 'Maintenance' ? '#fee2e2' : '#f3e8ff',
                                color: schedule.event_type === 'Assessment' ? '#92400e' :
                                       schedule.event_type === 'Course' ? '#1e40af' :
                                       schedule.event_type === 'Maintenance' ? '#dc2626' : '#7c3aed'
                              }}>
                                {schedule.event_type}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', color: '#4a5568' }}>
                              {schedule.assigned_to}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500',
                                backgroundColor: new Date(schedule.event_datetime) > new Date() ? '#d1fae5' : '#fee2e2',
                                color: new Date(schedule.event_datetime) > new Date() ? '#065f46' : '#dc2626'
                              }}>
                                {new Date(schedule.event_datetime) > new Date() ? 'Upcoming' : 'Past'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div style={{
                      padding: '20px',
                      borderTop: '1px solid #e2e8f0',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          backgroundColor: currentPage === 1 ? '#f3f4f6' : 'white',
                          color: currentPage === 1 ? '#9ca3af' : '#374151',
                          borderRadius: '6px',
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        ‹ Previous
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            backgroundColor: currentPage === page ? '#667eea' : 'white',
                            color: currentPage === page ? 'white' : '#374151',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: currentPage === page ? '600' : '400',
                            transition: 'all 0.2s ease',
                            minWidth: '40px'
                          }}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={{
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          backgroundColor: currentPage === totalPages ? '#f3f4f6' : 'white',
                          color: currentPage === totalPages ? '#9ca3af' : '#374151',
                          borderRadius: '6px',
                          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        Next ›
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Inline Schedule Form */}
              {showForm && (
                <div id="schedule-form" style={{
                marginTop: '25px',
                padding: '25px',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                {/* Header */}
                <div style={{
                  textAlign: 'center',
                  marginBottom: '25px'
                }}>
                  <h3 style={{
                    margin: '0 0 5px 0',
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#1f2937'
                  }}>
                    Create New Schedule
                  </h3>
                  <p style={{
                    margin: 0,
                    color: '#6b7280',
                    fontSize: '14px'
                  }}>
                    Fill in the details below to schedule a new event
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px',
                    marginBottom: '25px'
                  }}>
                    {/* Event Name */}
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '13px'
                      }}>
                        Event Name
                      </label>
                      <input
                        type="text"
                        name="event_name"
                        value={formData.event_name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter event name"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          transition: 'all 0.2s ease',
                          outline: 'none',
                          boxSizing: 'border-box',
                          backgroundColor: 'white'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#667eea';
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    {/* Date & Time */}
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '13px'
                      }}>
                        Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        name="event_datetime"
                        value={formData.event_datetime}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          transition: 'all 0.2s ease',
                          outline: 'none',
                          boxSizing: 'border-box',
                          backgroundColor: 'white',
                          cursor: 'pointer'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#667eea';
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    {/* Type */}
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '13px'
                      }}>
                        Type
                      </label>
                      <select
                        name="event_type"
                        value={formData.event_type}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          backgroundColor: 'white',
                          transition: 'all 0.2s ease',
                          outline: 'none',
                          boxSizing: 'border-box',
                          cursor: 'pointer'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#667eea';
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        <option value="Assessment">Assessment</option>
                        <option value="Course">Course</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="General">General</option>
                      </select>
                    </div>

                    {/* Assigned To */}
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '13px'
                      }}>
                        Assigned To
                      </label>
                      <select
                        name="assigned_to"
                        value={formData.assigned_to}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          backgroundColor: 'white',
                          transition: 'all 0.2s ease',
                          outline: 'none',
                          boxSizing: 'border-box',
                          cursor: 'pointer'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#667eea';
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        <option value="Admin team">Admin team</option>
                        <option value="Faculty">Faculty</option>
                        <option value="Students">Students</option>
                        <option value="Everyone">Everyone</option>
                      </select>
                    </div>
                  </div>

                  {/* Reminder Alerts */}
                  <div style={{ marginBottom: '25px' }}>
                    <label style={{
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '13px',
                      display: 'block',
                      marginBottom: '10px'
                    }}>
                      Optional Reminder Alerts
                    </label>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        <input
                          type="checkbox"
                          name="reminder_1_day"
                          checked={formData.reminder_1_day}
                          onChange={handleInputChange}
                          style={{
                            marginRight: '10px',
                            width: '16px',
                            height: '16px',
                            accentColor: '#667eea',
                            cursor: 'pointer'
                          }}
                        />
                        <span>1 day before</span>
                      </label>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        <input
                          type="checkbox"
                          name="reminder_1_hour"
                          checked={formData.reminder_1_hour}
                          onChange={handleInputChange}
                          style={{
                            marginRight: '10px',
                            width: '16px',
                            height: '16px',
                            accentColor: '#667eea',
                            cursor: 'pointer'
                          }}
                        />
                        <span>1 hour before</span>
                      </label>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingTop: '20px',
                    borderTop: '1px solid #e5e7eb'
                  }}>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        padding: '12px 24px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        opacity: loading ? 0.7 : 1,
                        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                      }}
                      onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                        if (!loading) e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                        if (!loading) e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {loading ? 'Creating...' : 'Create Schedule'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

    </AdminLayout>
  );
};

export default AdminSchedulingTasks;