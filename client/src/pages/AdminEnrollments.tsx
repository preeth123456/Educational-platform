import React from 'react';
import { FaGraduationCap, FaUsers, FaCheckCircle, FaClock, FaArrowRight, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import '../Dashboard.css';

const AdminEnrollments: React.FC = () => {
  return (
    <AdminLayout>
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          {/* Header */}
          <div className="hero-welcome">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">Enrollment Management</h1>
                <p className="hero-subtitle">Monitor and manage student course enrollments, waitlists, and access controls</p>
              </div>
            </div>
          </div>

          {/* Enrollment Overview Metrics */}
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">
                <FaGraduationCap />
              </div>
              <div className="stat-content">
                <h3>1,245</h3>
                <p>Total Enrollments</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '87%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon">
                <FaCheckCircle />
              </div>
              <div className="stat-content">
                <h3>92%</h3>
                <p>Active Students</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-icon">
                <FaClock />
              </div>
              <div className="stat-content">
                <h3>156</h3>
                <p>Waitlisted</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '35%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>89</h3>
                <p>Courses Offered</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enrollment Management Dashboard */}
          <div className="progress-dashboard">
            <div className="section-header">
              <div className="section-title">
                <FaGraduationCap className="section-icon" />
                <h2>Enrollment Overview</h2>
              </div>
              <button className="view-all-btn">
                Manual Enrollment
                <FaPlus />
              </button>
            </div>

            {/* Enrollment Statistics */}
            <div className="performance-summary">
              <div className="summary-card-large">
                <div className="summary-header">
                  <div className="summary-icon-large">
                    <FaUsers />
                  </div>
                  <div className="summary-content">
                    <h3>Enrollment Trends</h3>
                    <p>Track enrollment patterns, course popularity, and student engagement metrics</p>
                    <div className="performance-stats">
                      <div className="stat-item">
                        <span className="stat-value">+15%</span>
                        <span className="stat-label">Monthly Growth</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">4.2</span>
                        <span className="stat-label">Avg Courses/Student</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">87%</span>
                        <span className="stat-label">Completion Rate</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="summary-cta">
                  View Enrollment Reports
                  <FaArrowRight />
                </button>
              </div>

              <div className="insights-grid">
                <div className="insight-item">
                  <div className="insight-icon">📈</div>
                  <h4>Popular Courses</h4>
                  <p>Mathematics Fundamentals: 245 enrollments, 95% satisfaction</p>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">⏰</div>
                  <h4>Waitlist Management</h4>
                  <p>156 students on waitlist, auto-enrollment enabled</p>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">🎯</div>
                  <h4>Target Demographics</h4>
                  <p>Grade 6-12 students, 60% female, 40% male enrollment</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enrollment Management Cards */}
          <div className="recommended-grid">
            <div className="management-card">
              <div className="management-header">
                <FaSearch className="management-icon" />
                <h3>Search Enrollments</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">Advanced</span>
                  <span className="stat-label">Filters</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Real-time</span>
                  <span className="stat-label">Search</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Export</span>
                  <span className="stat-label">Results</span>
                </div>
              </div>
              <button className="management-btn">Search Students</button>
            </div>

            <div className="management-card">
              <div className="management-header">
                <FaPlus className="management-icon" />
                <h3>Bulk Enrollment</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">CSV</span>
                  <span className="stat-label">Import</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Batch</span>
                  <span className="stat-label">Processing</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Validation</span>
                  <span className="stat-label">Checks</span>
                </div>
              </div>
              <button className="management-btn">Bulk Enroll Students</button>
            </div>

            <div className="management-card">
              <div className="management-header">
                <FaFilter className="management-icon" />
                <h3>Access Control</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">Role-based</span>
                  <span className="stat-label">Permissions</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Time-limited</span>
                  <span className="stat-label">Access</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Auto-expiry</span>
                  <span className="stat-label">Management</span>
                </div>
              </div>
              <button className="management-btn">Manage Permissions</button>
            </div>

            <div className="management-card">
              <div className="management-header">
                <FaGraduationCap className="management-icon" />
                <h3>Course Capacity</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">Dynamic</span>
                  <span className="stat-label">Limits</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Waitlist</span>
                  <span className="stat-label">Management</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Auto</span>
                  <span className="stat-label">Enrollment</span>
                </div>
              </div>
              <button className="management-btn">Set Capacities</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEnrollments;