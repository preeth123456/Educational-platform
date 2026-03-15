import React from 'react';
import { FaChartLine, FaUsers, FaBook, FaDollarSign, FaArrowRight } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import '../Dashboard.css';

const AdminAnalytics: React.FC = () => {
  return (
    <AdminLayout>
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          {/* Header */}
          <div className="hero-welcome">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">Analytics & Reports</h1>
                <p className="hero-subtitle">Comprehensive insights into platform performance, user engagement, and revenue metrics</p>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>2,847</h3>
                <p>Total Users</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon">
                <FaBook />
              </div>
              <div className="stat-content">
                <h3>89</h3>
                <p>Active Courses</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-icon">
                <FaChartLine />
              </div>
              <div className="stat-content">
                <h3>78%</h3>
                <p>Engagement Rate</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon">
                <FaDollarSign />
              </div>
              <div className="stat-content">
                <h3>$24,580</h3>
                <p>Monthly Revenue</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Dashboard */}
          <div className="progress-dashboard">
            <div className="section-header">
              <div className="section-title">
                <FaChartLine className="section-icon" />
                <h2>Platform Performance Analytics</h2>
              </div>
              <button className="view-all-btn">
                Export Report
                <FaArrowRight />
              </button>
            </div>
            
            {/* Progress Metrics Row */}
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
                <div className="streak-flame">📈</div>
                <div className="streak-info">
                  <h4>Growth Trend</h4>
                  <p>Consistent upward!</p>
                </div>
              </div>
            </div>
            
            {/* Performance Summary */}
            <div className="performance-summary">
              <div className="summary-card-large">
                <div className="summary-header">
                  <div className="summary-icon-large">
                    <FaChartLine />
                  </div>
                  <div className="summary-content">
                    <h3>Exceptional Platform Growth</h3>
                    <p>Your platform is experiencing remarkable growth across all key performance indicators!</p>
                    <div className="performance-stats">
                      <div className="stat-item">
                        <span className="stat-value">15%</span>
                        <span className="stat-label">Revenue Growth</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">12%</span>
                        <span className="stat-label">User Growth</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">8%</span>
                        <span className="stat-label">Engagement Up</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="summary-cta">
                  View Detailed Analytics
                  <FaArrowRight />
                </button>
              </div>
              
              <div className="insights-grid">
                <div className="insight-item">
                  <div className="insight-icon">💰</div>
                  <h4>Revenue Insights</h4>
                  <p>Monthly revenue reached $24,580 with 1,892 successful transactions</p>
                </div>
                
                <div className="insight-item">
                  <div className="insight-icon">👥</div>
                  <h4>User Engagement</h4>
                  <p>78% engagement rate with average session time of 45 minutes</p>
                </div>
                
                <div className="insight-item">
                  <div className="insight-icon">🎓</div>
                  <h4>Learning Outcomes</h4>
                  <p>85% course completion rate with 4.8/5 average course rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Analytics Cards */}
          <div className="recommended-grid">
            <div className="management-card">
              <div className="management-header">
                <FaUsers className="management-icon" />
                <h3>User Analytics</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">2,847</span>
                  <span className="stat-label">Total Users</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">156</span>
                  <span className="stat-label">New This Month</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">78%</span>
                  <span className="stat-label">Active Rate</span>
                </div>
              </div>
              <button className="management-btn">View User Reports</button>
            </div>

            <div className="management-card">
              <div className="management-header">
                <FaBook className="management-icon" />
                <h3>Course Analytics</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">89</span>
                  <span className="stat-label">Total Courses</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">1,245</span>
                  <span className="stat-label">Enrollments</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">85%</span>
                  <span className="stat-label">Completion Rate</span>
                </div>
              </div>
              <button className="management-btn">View Course Reports</button>
            </div>

            <div className="management-card">
              <div className="management-header">
                <FaDollarSign className="management-icon" />
                <h3>Revenue Analytics</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">$24.5K</span>
                  <span className="stat-label">Monthly Revenue</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">1,892</span>
                  <span className="stat-label">Transactions</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">94%</span>
                  <span className="stat-label">Success Rate</span>
                </div>
              </div>
              <button className="management-btn">View Financial Reports</button>
            </div>

            <div className="management-card">
              <div className="management-header">
                <FaChartLine className="management-icon" />
                <h3>Performance Metrics</h3>
              </div>
              <div className="management-stats">
                <div className="management-stat">
                  <span className="stat-number">4.8</span>
                  <span className="stat-label">Avg Rating</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">45min</span>
                  <span className="stat-label">Session Time</span>
                </div>
                <div className="management-stat">
                  <span className="stat-number">92%</span>
                  <span className="stat-label">Satisfaction</span>
                </div>
              </div>
              <button className="management-btn">View Performance Reports</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
