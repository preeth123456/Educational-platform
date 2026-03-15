import React, { useState, useEffect } from "react";
import NewHeader from "@/components/NewHeader";
import { TeacherSidebarDemo } from "@/components/TeacherSidebar";
import SessionManager from "../utils/sessionManager";
import "../Dashboard.css";
import "./TeacherDashboard.css";

const TeacherDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    total_courses: 0,
    active_students: 0,
    assignments_pending: 0,
    avg_performance: '0%'
  });
  const [loading, setLoading] = useState(true);

  // Mock data for teacher dashboard
  const teacherData = {
    name: "Ms. Priya Sharma",
    role: "Teacher",
    department: "Computer Science",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const session = SessionManager.getSession();
      console.log('Full session data:', session);
      
      // Try multiple ways to get teacher ID
      let teacherId = null;
      if (session) {
        teacherId = session.teacherId || session.teacher_id || session.id;
        console.log('Extracted teacher ID:', teacherId);
      }
      
      if (!teacherId) {
        console.error('No teacher ID found in session. Session keys:', Object.keys(session || {}));
        // Use fallback data
        setDashboardStats({
          total_courses: 12,
          active_students: 216,
          assignments_pending: 24,
          avg_performance: '82%'
        });
        setLoading(false);
        return;
      }

      console.log('Fetching stats for teacher ID:', teacherId);
      const response = await fetch(`http://localhost:8001/api/auth/teacher-dashboard-stats/${teacherId}/`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.status === 'success') {
        setDashboardStats(result.stats);
      } else {
        console.error('API returned error:', result.error);
        // Use fallback data
        setDashboardStats({
          total_courses: 12,
          active_students: 216,
          assignments_pending: 24,
          avg_performance: '82%'
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Use fallback data on error
      setDashboardStats({
        total_courses: 12,
        active_students: 216,
        assignments_pending: 24,
        avg_performance: '82%'
      });
    } finally {
      setLoading(false);
    }
  };

  const keyMetrics = [
    {
      title: "Total Courses Created",
      value: loading ? "..." : String(dashboardStats.total_courses || 0),
      icon: "📘",
      color: "purple"
    },
    {
      title: "Active Students",
      value: loading ? "..." : String(dashboardStats.active_students || 0),
      icon: "🎓",
      color: "green"
    },
    {
      title: "Assignments Pending",
      value: loading ? "..." : String(dashboardStats.assignments_pending || 0),
      icon: "✅",
      color: "yellow"
    },
    {
      title: "Avg. Class Performance",
      value: loading ? "..." : (dashboardStats.avg_performance || '0%'),
      icon: "⭐",
      color: "red"
    }
  ];

  const todaySchedule = [
    {
      time: "08:30 - 10:00",
      class: "Introduction to Programming",
      course: "CS101 - Batch 2023",
      room: "Lab 102",
      status: "Completed"
    },
    {
      time: "10:15 - 11:45",
      class: "Web Development",
      course: "CS304 - Batch 2022",
      room: "Room 205",
      status: "Completed"
    },
    {
      time: "13:00 - 14:30",
      class: "Data Structures",
      course: "CS201 - Batch 2022",
      room: "Lab 104",
      status: "In Progress"
    }
  ];

  const recentActivity = [
    {
      action: "Aanya Patel submitted JavaScript Assignment",
      time: "10 minutes ago",
      icon: "👤",
      type: "submission"
    },
    {
      action: "You created a new assignment Database Quiz",
      time: "1 hour ago",
      icon: "📝",
      type: "assignment"
    }
  ];

  const performanceMetrics = [
    { label: "Class Average", value: "78%", color: "purple" },
    { label: "Highest Score", value: "96%", color: "green" },
    { label: "Lowest Score", value: "42%", color: "red" },
    { label: "Participation", value: "89%", color: "orange" }
  ];

  const resources = [
    {
      title: "Course Syllabus Templates",
      description: "PDF documents",
      icon: "📄"
    },
    {
      title: "Teaching Resources Portal",
      description: "Videos & learning materials",
      icon: "🎥"
    },
    {
      title: "Department Handbook",
      description: "Guidelines & policies",
      icon: "📖"
    },
    {
      title: "Academic Calendar",
      description: "Important dates & events",
      icon: "📅"
    }
  ];

  const upcomingAssignments = [
    {
      title: "JavaScript Fundamentals Quiz",
      details: "30 minutes • 25 questions",
      class: "CS304 - Web Development",
      dueDate: "May 16, 2023",
      status: "Published"
    },
    {
      title: "Database Design Project",
      details: "Group project • 3-4 members",
      class: "CS201 - Data Structures",
      dueDate: "May 20, 2023",
      status: "Draft"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "green";
      case "In Progress": return "purple";
      case "Upcoming": return "gray";
      case "Published": return "purple";
      case "Draft": return "gray";
      case "Scheduled": return "red";
      default: return "gray";
    }
  };

  return (
    <div className="dashboard-container">
      <TeacherSidebarDemo open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="dashboard-main" style={{ 
        marginLeft: sidebarOpen ? '250px' : '60px',
        transition: 'margin-left 0.3s ease',
        width: `calc(100% - ${sidebarOpen ? '250px' : '60px'})`
      }}>
        <NewHeader 
          avatar={teacherData.avatar} 
          name={SessionManager.getSession()?.name || teacherData.name} 
          role={teacherData.role} 
          searchPlaceholder="Search dashboard..." 
          onSearch={(query) => console.log('Search:', query)} 
        />
        
        <div className="teacher-dashboard-root">
          {/* Header Section */}
          <div className="teacher-dashboard-header">
            <div className="teacher-dashboard-title">
              <h1>Welcome back, {SessionManager.getSession()?.name || 'Teacher'}! 👋</h1>
            </div>
            <div className="teacher-dashboard-date">
              <span>Today: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Key Metrics Section */}
          <div className="stats-grid">
            {keyMetrics.map((metric, index) => (
              <div key={index} className="stat-card">
                <div className={`stat-icon ${metric.color}`}>{metric.icon}</div>
                <div>
                  <h3>{metric.value}</h3>
                  <p>{metric.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="teacher-content-grid">
            {/* Today's Schedule */}
            <div className="teacher-schedule-section">
              <h3>Today's Schedule</h3>
              <div className="teacher-schedule-table">
                <table>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Class</th>
                      <th>Room</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todaySchedule.map((item, index) => (
                      <tr key={index}>
                        <td>{item.time}</td>
                        <td>
                          <div>
                            <div className="class-name">{item.class}</div>
                            <div className="course-code">{item.course}</div>
                          </div>
                        </td>
                        <td>{item.room}</td>
                        <td>
                          <span className={`status-badge status-${getStatusColor(item.status).toLowerCase()}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="teacher-activity-section">
              <h3>Recent Activity</h3>
              <div className="teacher-activity-list">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="teacher-activity-item">
                    <div className="activity-icon">{activity.icon}</div>
                    <div className="activity-content">
                      <div className="activity-text">{activity.action}</div>
                      <div className="activity-time">{activity.time}</div>
                    </div>
                  </div>
                ))}
                <div className="activity-view-all">
                  <a href="#">View all activity →</a>
        </div>
      </div>
      </div>
    </div>

          {/* Performance and Resources Grid */}
          <div className="teacher-performance-resources-grid">
            {/* Class Performance */}
            <div className="teacher-performance-section">
              <h3>Class Performance</h3>
              <div className="performance-header">
                <select className="class-selector">
                  <option>CS101 - Introduction to Programming</option>
                </select>
                <div className="performance-tabs">
                  <button className="tab-btn">Weekly</button>
                  <button className="tab-btn active">Monthly</button>
                  <button className="tab-btn">Semester</button>
                </div>
              </div>
              <div className="performance-chart-placeholder">
                <div className="chart-icon">📊</div>
                <p>Performance trends chart would appear here</p>
                <small>Showing average scores across assignments and tests</small>
              </div>
              <div className="performance-metrics">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className={`performance-metric performance-${metric.color}`}>
                    <div className="metric-label">{metric.label}</div>
                    <div className="metric-value">{metric.value}</div>
      </div>
                ))}
              </div>
            </div>

            {/* Resources & Links */}
            <div className="teacher-resources-section">
              <h3>Resources & Links</h3>
              <div className="resources-list">
                {resources.map((resource, index) => (
                  <div key={index} className="resource-item">
                    <div className="resource-icon">{resource.icon}</div>
                    <div className="resource-content">
                      <div className="resource-title">{resource.title}</div>
                      <div className="resource-description">{resource.description}</div>
                    </div>
                  </div>
                ))}
                <button className="add-resource-btn">+ Add Custom Link</button>
              </div>
            </div>
          </div>

          {/* Bottom Grid - Assignments and Quick Actions */}
          <div className="teacher-bottom-grid">
            {/* Upcoming Assignments */}
            <div className="teacher-assignments-section">
              <div className="assignments-header">
                <h3>Upcoming Assignments</h3>
                <button className="create-assignment-btn">+ Create New</button>
              </div>
              <div className="assignments-table">
                <table>
                  <thead>
                    <tr>
                      <th>Assignment</th>
                      <th>Class</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingAssignments.map((assignment, index) => (
                      <tr key={index}>
                        <td>
                          <div>
                            <div className="assignment-title">{assignment.title}</div>
                            <div className="assignment-details">{assignment.details}</div>
                          </div>
                        </td>
                        <td>{assignment.class}</td>
                        <td>{assignment.dueDate}</td>
                        <td>
                          <span className={`status-badge status-${getStatusColor(assignment.status).toLowerCase()}`}>
                            {assignment.status}
                          </span>
                        </td>
                        <td>
                          <div className="assignment-actions">
                            <button className="action-btn">✏️</button>
                            <button className="action-btn">⋮</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="assignments-view-all">
                  <a href="#">View all assignments →</a>
                </div>
      </div>
    </div>

            {/* Quick Actions */}
            <div className="teacher-quick-actions-section">
              <h3>Quick Actions</h3>
              <div className="quick-actions-list">
                <div className="quick-action-item">
                  <div className="quick-action-icon">📝</div>
                  <div className="quick-action-content">
                    <div className="quick-action-title">Create Assignment</div>
                    <div className="quick-action-desc">New quiz or project</div>
                  </div>
                </div>
                <div className="quick-action-item">
                  <div className="quick-action-icon">📧</div>
                  <div className="quick-action-content">
                    <div className="quick-action-title">Send Announcement</div>
                    <div className="quick-action-desc">Class-wide message</div>
                  </div>
                </div>
                <div className="quick-action-item">
                  <div className="quick-action-icon">📈</div>
                  <div className="quick-action-content">
                    <div className="quick-action-title">View Analytics</div>
                    <div className="quick-action-desc">Performance reports</div>
                  </div>
                </div>
                <div className="quick-action-item">
                  <div className="quick-action-icon">⚠️</div>
                  <div className="quick-action-content">
                    <div className="quick-action-title">Report Breach</div>
                    <div className="quick-action-desc">Data security incident</div>
                  </div>
                </div>
                <div className="quick-action-item">
                  <div className="quick-action-icon">⚙️</div>
                  <div className="quick-action-content">
                    <div className="quick-action-title">Settings</div>
                    <div className="quick-action-desc">Preferences & config</div>
                  </div>
                </div>
        </div>
      </div>
    </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
