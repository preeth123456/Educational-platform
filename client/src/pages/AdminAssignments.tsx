import React from 'react';
import { FaClipboardList, FaCheck, FaClock, FaUser, FaArrowRight, FaPlus, FaEye, FaEdit } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import '../Dashboard.css';

const AdminAssignments: React.FC = () => {
  return (
    <AdminLayout>
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          {/* Header */}
          <div className="hero-welcome">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">Assignment Management</h1>
                <p className="hero-subtitle">Monitor, review, and manage all assignments across courses and students</p>
              </div>
            </div>
          </div>

          {/* Assignments Overview Metrics */}
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">
                <FaClipboardList />
              </div>
              <div className="stat-content">
                <h3>156</h3>
                <p>Total Assignments</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon">
                <FaCheck />
              </div>
              <div className="stat-content">
                <h3>89%</h3>
                <p>Submission Rate</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '89%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-icon">
                <FaClock />
              </div>
              <div className="stat-content">
                <h3>24</h3>
                <p>Pending Reviews</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon">
                <FaUser />
              </div>
              <div className="stat-content">
                <h3>1,247</h3>
                <p>Student Submissions</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Assignments Management Dashboard */}
          <div className="progress-dashboard">
            <div className="section-header">
              <div className="section-title">
                <FaClipboardList className="section-icon" />
                <h2>Assignment Overview</h2>
              </div>
              <button className="view-all-btn">
                Create Assignment
                <FaPlus />
              </button>
            </div>

            {/* Recent Assignments */}
            <div className="performance-summary">
              <div className="summary-card-large">
                <div className="summary-header">
                  <div className="summary-icon-large">
                    <FaClipboardList />
                  </div>
                  <div className="summary-content">
                    <h3>Assignment Statistics</h3>
                    <p>Comprehensive overview of assignment submissions and performance metrics</p>
                    <div className="performance-stats">
                      <div className="stat-item">
                        <span className="stat-value">89%</span>
                        <span className="stat-label">Completion Rate</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">4.2/5</span>
                        <span className="stat-label">Avg Quality Score</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">2.3 days</span>
                        <span className="stat-label">Avg Submission Time</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="summary-cta">
                  View All Assignments
                  <FaArrowRight />
                </button>
              </div>

              <div className="insights-grid">
                <div className="insight-item">
                  <div className="insight-icon">📝</div>
                  <h4>Mathematics Quiz</h4>
                  <p>Due: Dec 15 | 45 submissions | 92% on time</p>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">🔬</div>
                  <h4>Science Lab Report</h4>
                  <p>Due: Dec 18 | 38 submissions | 15 pending reviews</p>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">💻</div>
                  <h4>Coding Project</h4>
                  <p>Due: Dec 20 | 67 submissions | High quality scores</p>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment Management Cards */}
          <div className="recommended-grid">
            <div className="management-card">
              <div className="management-header">
                <FaEye className="management-icon" />
                <h3>Review Submissions</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">24</span>
                  <span className="stat-label">Pending Reviews</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Priority</span>
                  <span className="stat-label">Flagged</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Bulk</span>
                  <span className="stat-label">Grading</span>
                </div>
              </div>
              <button className="management-btn">Review Assignments</button>
            </div>

            <div className="management-card">
              <div className="management-header">
                <FaPlus className="management-icon" />
                <h3>Create Assignment</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">Template</span>
                  <span className="stat-label">Based</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Auto</span>
                  <span className="stat-label">Grading</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Scheduled</span>
                  <span className="stat-label">Release</span>
                </div>
              </div>
              <button className="management-btn">Create New Assignment</button>
            </div>

            <div className="management-card">
              <div className="management-header">
                <FaEdit className="management-icon" />
                <h3>Assignment Templates</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">15</span>
                  <span className="stat-label">Saved Templates</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Reusable</span>
                  <span className="stat-label">Components</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Customizable</span>
                  <span className="stat-label">Settings</span>
                </div>
              </div>
              <button className="management-btn">Manage Templates</button>
            </div>

            <div className="management-card">
              <div className="management-header">
                <FaClipboardList className="management-icon" />
                <h3>Assignment Analytics</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">Detailed</span>
                  <span className="stat-label">Reports</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Performance</span>
                  <span className="stat-label">Insights</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">Trend</span>
                  <span className="stat-label">Analysis</span>
                </div>
              </div>
              <button className="management-btn">View Analytics</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAssignments;