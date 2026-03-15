import React, { useState, useEffect } from 'react';
import { FaUsers, FaChalkboardTeacher, FaBook, FaChartLine, FaBell, FaCheckCircle, FaExclamationTriangle, FaClipboardList, FaPlayCircle, FaMedal, FaChartBar, FaTrophy, FaArrowRight } from 'react-icons/fa';
import NormalAdminLayout from '../components/NormalAdminLayout';
import '../Dashboard.css';

const NormalAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalStudents: 2847,
    totalTeachers: 156,
    totalCourses: 89,
    activeEnrollments: 1892
  });

  const [pendingApprovals] = useState([
    { id: 1, type: 'Teacher', name: 'Dr. Manjunath', subject: 'Mathematics' },
    { id: 2, type: 'Course', name: 'Advanced Physics', teacher: 'Prof. Somashekhar' },
    { id: 3, type: 'Student', name: 'Rahul Kumar', course: 'Chemistry Basics' }
  ]);

  const [recentActivities] = useState([
    { id: 1, type: 'enrolled', action: 'Student enrolled', subject: 'Mathematics Course', time: '2 hours ago' },
    { id: 2, type: 'completed', action: 'Assignment completed', subject: 'Physics Lab Report', time: '4 hours ago' },
    { id: 3, type: 'submitted', action: 'New teacher application', subject: 'Dr. Priya Sharma - English', time: '6 hours ago' },
    { id: 4, type: 'achievement', action: 'Course completion', subject: 'Chemistry Fundamentals', time: '1 day ago' }
  ]);

  return (
    <NormalAdminLayout>
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          {/* Header */}
          <div className="hero-welcome">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">Normal Admin Dashboard</h1>
                <p className="hero-subtitle">Welcome to your admin control center. Monitor and manage your educational platform.</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>{stats.totalStudents.toLocaleString()}</h3>
                <p>Total Students</p>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon">
                <FaChalkboardTeacher />
              </div>
              <div className="stat-content">
                <h3>{stats.totalTeachers}</h3>
                <p>Active Teachers</p>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon">
                <FaBook />
              </div>
              <div className="stat-content">
                <h3>{stats.totalCourses}</h3>
                <p>Available Courses</p>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-icon">
                <FaChartLine />
              </div>
              <div className="stat-content">
                <h3>{stats.activeEnrollments.toLocaleString()}</h3>
                <p>Active Enrollments</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="dashboard-grid">
            {/* Pending Approvals */}
            <div className="dashboard-section">
              <div className="section-header">
                <div className="section-title">
                  <FaBell className="section-icon" />
                  <h2>Pending Approvals</h2>
                </div>
              </div>
              <div className="approvals-list">
                {pendingApprovals.map(approval => (
                  <div key={approval.id} className="approval-item">
                    <div className="approval-content">
                      <div className="approval-type">{approval.type}</div>
                      <div className="approval-name">{approval.name}</div>
                      {approval.subject && <div className="approval-subject">{approval.subject}</div>}
                      {approval.teacher && <div className="approval-teacher">by {approval.teacher}</div>}
                    </div>
                    <div className="approval-actions">
                      <button className="approve-btn">Approve</button>
                      <button className="reject-btn">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="dashboard-section">
              <div className="section-header">
                <div className="section-title">
                  <FaChartBar className="section-icon" />
                  <h2>Recent Activities</h2>
                </div>
              </div>
              <div className="activity-list">
                {recentActivities.map(activity => (
                  <div key={activity.id} className={`activity-item ${activity.type}`}>
                    <div className="activity-icon">
                      {activity.type === 'completed' && <FaCheckCircle />}
                      {activity.type === 'submitted' && <FaClipboardList />}
                      {activity.type === 'enrolled' && <FaPlayCircle />}
                      {activity.type === 'achievement' && <FaMedal />}
                    </div>
                    <div className="activity-content">
                      <div className="activity-text">
                        <span className="activity-action">{activity.action}:</span> {activity.subject}
                      </div>
                      <div className="activity-time">{activity.time}</div>
                    </div>
                  </div>
                ))}
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
                  <h3>Platform Performance Overview</h3>
                  <p>Your educational platform is performing well across all key metrics!</p>
                  <div className="performance-stats">
                    <div className="stat-item">
                      <span className="stat-value">92%</span>
                      <span className="stat-label">Student Satisfaction</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">78%</span>
                      <span className="stat-label">Course Completion</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">156</span>
                      <span className="stat-label">New Enrollments</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="summary-cta">
                View Detailed Reports
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </NormalAdminLayout>
  );
};

export default NormalAdminDashboard;
