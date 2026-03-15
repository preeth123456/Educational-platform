import React from 'react';
import { FaChartLine, FaUsers, FaBook, FaTrophy, FaArrowRight, FaClock, FaStar } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import '../Dashboard.css';

const AdminPerformance: React.FC = () => {
  return (
    <AdminLayout>
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          {/* Header */}
          <div className="hero-welcome">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">Performance Analytics</h1>
                <p className="hero-subtitle">Monitor system performance, user engagement, and learning outcomes across the platform</p>
              </div>
            </div>
          </div>

          {/* Key Performance Metrics */}
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>78%</h3>
                <p>User Engagement</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon">
                <FaBook />
              </div>
              <div className="stat-content">
                <h3>85%</h3>
                <p>Course Completion</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-icon">
                <FaClock />
              </div>
              <div className="stat-content">
                <h3>45min</h3>
                <p>Avg Session Time</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon">
                <FaStar />
              </div>
              <div className="stat-content">
                <h3>4.8</h3>
                <p>Average Rating</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '96%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Dashboard */}
          <div className="progress-dashboard">
            <div className="section-header">
              <div className="section-title">
                <FaChartLine className="section-icon" />
                <h2>Platform Performance Metrics</h2>
              </div>
              <button className="view-all-btn">
                Export Performance Report
                <FaArrowRight />
              </button>
            </div>

            {/* Performance Metrics Row */}
            <div className="progress-metrics-row">
              <div className="progress-metric">
                <div className="metric-circle">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="20.35" className="percentage">85%</text>
                  </svg>
                </div>
                <div className="metric-info">
                  <h4>Course Completion</h4>
                  <p className="metric-trend positive">+8% this month</p>
                </div>
              </div>

              <div className="progress-metric">
                <div className="metric-circle orange">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle orange" strokeDasharray="92, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="20.35" className="percentage">92%</text>
                  </svg>
                </div>
                <div className="metric-info">
                  <h4>User Satisfaction</h4>
                  <p className="metric-trend positive">+3% this week</p>
                </div>
              </div>

              <div className="streak-card">
                <div className="streak-flame">🚀</div>
                <div className="streak-info">
                  <h4>Performance Trend</h4>
                  <p>Excellent progress!</p>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="performance-summary">
              <div className="summary-card-large">
                <div className="summary-header">
                  <div className="summary-icon-large">
                    <FaTrophy />
                  </div>
                  <div className="summary-content">
                    <h3>Outstanding Performance Metrics</h3>
                    <p>Your platform is achieving exceptional results across all performance indicators!</p>
                    <div className="performance-stats">
                      <div className="stat-item">
                        <span className="stat-value">85%</span>
                        <span className="stat-label">Completion Rate</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">4.8/5</span>
                        <span className="stat-label">User Rating</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">78%</span>
                        <span className="stat-label">Engagement</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="summary-cta">
                  View Detailed Performance
                  <FaArrowRight />
                </button>
              </div>

              <div className="insights-grid">
                <div className="insight-item">
                  <div className="insight-icon">📚</div>
                  <h4>Learning Outcomes</h4>
                  <p>85% course completion rate with comprehensive assessment tracking</p>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">⏱️</div>
                  <h4>Session Analytics</h4>
                  <p>Average 45-minute sessions with peak engagement during lessons</p>
                </div>

                <div className="insight-item">
                  <div className="insight-icon">⭐</div>
                  <h4>Quality Metrics</h4>
                  <p>4.8/5 average rating with 92% user satisfaction score</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Performance Reports */}
          <div className="recommended-grid">
            <div className="management-card">
              <div className="management-header">
                <FaUsers className="management-icon" />
                <h3>User Performance</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">2,847</span>
                  <span className="stat-label">Active Users</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">78%</span>
                  <span className="stat-label">Engagement Rate</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">45min</span>
                  <span className="stat-label">Avg Session</span>
                </div>
              </div>
              <button className="management-btn">View User Analytics</button>
            </div>

            <div className="management-card">
              <div className="management-header">
                <FaBook className="management-icon" />
                <h3>Course Performance</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">89</span>
                  <span className="stat-label">Total Courses</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">85%</span>
                  <span className="stat-label">Completion Rate</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">4.8</span>
                  <span className="stat-label">Avg Rating</span>
                </div>
              </div>
              <button className="management-btn">View Course Analytics</button>
            </div>

            <div className="management-card">
              <div className="management-header">
                <FaChartLine className="management-icon" />
                <h3>System Performance</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">99.9%</span>
                  <span className="stat-label">Uptime</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">1.2s</span>
                  <span className="stat-label">Avg Response</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">0.1%</span>
                  <span className="stat-label">Error Rate</span>
                </div>
              </div>
              <button className="management-btn">View System Metrics</button>
            </div>

            <div className="management-card">
              <div className="management-header">
                <FaTrophy className="management-icon" />
                <h3>Learning Achievements</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">1,245</span>
                  <span className="stat-label">Certificates Issued</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">892</span>
                  <span className="stat-label">Completed Courses</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">95%</span>
                  <span className="stat-label">Pass Rate</span>
                </div>
              </div>
              <button className="management-btn">View Achievement Reports</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPerformance;