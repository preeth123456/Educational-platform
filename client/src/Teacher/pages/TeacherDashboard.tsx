import React, { useState, useEffect } from "react";
import NewHeader from "../components/NewHeader";
import { TeacherSidebarDemo } from "../components/TeacherSidebar";
import CreateEndorsement from "../CreateEndorsement";
import ProfileCompletionModal from "../../components/ProfileCompletionModal";
import ComplianceSection from "../../components/ComplianceSection";
import "./TeacherDashboard.css";
import { useLocation } from "wouter";
import SessionManager, { TeacherSession } from "../../utils/sessionManager";

const TeacherDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [, setLocation] = useLocation();
  const [myCourses, setMyCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [showEndorsementModal, setShowEndorsementModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [teacherSession, setTeacherSession] = useState<TeacherSession | null>(null);

  // Get teacher data from session
  const session = SessionManager.getSession();
  const teacherData = {
    name: session?.name || "Teacher",
    role: "Teacher",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  };

  useEffect(() => {
    if (session && session.role === 'teacher') {
      const tSession = session as TeacherSession;
      setTeacherSession(tSession);

      // Show modal if profile not completed
      if (!tSession.profile_completed) {
        setTimeout(() => setShowProfileModal(true), 1500);
      }
    }
  }, []);

  const keyMetrics = [
    { title: "Total Courses Created", value: "12", icon: "📘", color: "orange" },
    { title: "Active Students", value: "216", icon: "🎓", color: "green" },
    { title: "Assignments Pending", value: "24", icon: "✅", color: "yellow" },
    { title: "Avg. Class Performance", value: "82%", icon: "⭐", color: "blue" },
  ];

  const recentActivity = [
    { action: "Aanya Patel submitted JavaScript Assignment", time: "10 min ago", icon: "👤" },
    { action: "You created new assignment Database Quiz", time: "1 hour ago", icon: "📝" },
  ];





  const handleAddAssignment = (courseId: number) => {
    setLocation(`/create-assignment?courseId=${courseId}`);
  };

  // Fetch courses and students
  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacherId = session?.id;
        if (!teacherId) return;

        // Fetch courses
        const coursesResponse = await fetch(`http://localhost:8001/api/teacher/courses/my-courses/?teacher_id=${teacherId}`);
        const coursesResult = await coursesResponse.json();
        if (coursesResponse.ok) {
          setMyCourses(coursesResult.data || []);
        }

        // Fetch real students from database
        const studentsResponse = await fetch('http://localhost:8001/api/auth/students/all/');
        const studentsResult = await studentsResponse.json();
        if (studentsResponse.ok && studentsResult.status === 'success') {
          // Take first 4 students for dashboard display
          const dashboardStudents = studentsResult.data.students.slice(0, 4).map((student: any) => ({
            id: student.id,
            name: student.name,
            class: student.class,
            subject: student.board,
            performance: "N/A" // Can be calculated later based on actual performance data
          }));
          setStudents(dashboardStudents);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setCoursesLoading(false);
        setStudentsLoading(false);
      }
    };

    fetchData();
  }, [session?.id]);

  const handleEndorseStudent = (student: any) => {
    setSelectedStudent(student);
    setShowEndorsementModal(true);
  };

  const handleEndorsementSuccess = () => {
    alert('Endorsement created successfully!');
    setShowEndorsementModal(false);
    setSelectedStudent(null);
  };



  const studentAnalytics = {
    engagement: "76%",
    avgGrades: "79%",
    topPerformers: 15,
    struggling: 7,
    classCompletion: "68%",
    overallProgress: "On Track",
  };

  const upcomingTasks = [
    { title: "Grade JavaScript Quiz", due: "Sep 28" },
    { title: "Prepare Midterm Exam", due: "Oct 02" },
    { title: "Live Session on AI Basics", due: "Oct 05" },
  ];

  const recommendedTools = [
    { title: "AI Grading Assistant", icon: "🤖" },
    { title: "Resource Library", icon: "📖" },
    { title: "Teaching Tips", icon: "💡" },
    { title: "Interactive Quizzes", icon: "📝" },
  ];

  return (
    <div className="dashboard-container">
      <TeacherSidebarDemo open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="dashboard-main" style={{ marginLeft: sidebarOpen ? "250px" : "60px" }}>
        <NewHeader
          avatar={teacherData.avatar}
          name={teacherData.name}
          role={teacherData.role}
          teacherId={session?.id}
          searchPlaceholder="Search..."
        />

        <ProfileCompletionModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          userName={teacherSession?.name || 'Teacher'}
          role="teacher"
        />

        {/* LMS Quick Access */}
        <div className="lms-quick-access">
          <div className="lms-card" onClick={() => setLocation('/teacher-lms')}>
            <div className="lms-icon">🎓</div>
            <div className="lms-content">
              <h2>My Learning Management System</h2>
              <p>Manage your classes, subjects, chapters, lessons and create topics</p>
              <button className="lms-btn">Open LMS →</button>
            </div>
          </div>
        </div>

        {/* Key Metrics - Student Dashboard Style */}
        <div className="stats-grid">
          {keyMetrics.map((metric, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-icon">{metric.icon}</div>
              <div className="stat-content">
                <div className="stat-value">{metric.value}</div>
                <div className="stat-label">{metric.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity and Tasks Row */}
        <div className="activity-tasks-row">
          {/* Recent Activity - Left */}
          <div className="activity-section">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {recentActivity.map((act, idx) => (
                <div key={idx} className="activity-item">
                  <span className="activity-icon">{act.icon}</span>
                  <div className="activity-content">
                    <div className="activity-text">{act.action}</div>
                    <small className="activity-time">{act.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Tasks - Right */}
          <div className="tasks-section">
            <h3>Upcoming Tasks</h3>
            <div className="tasks-list">
              {upcomingTasks.map((task, idx) => (
                <div key={idx} className="task-item">
                  <span className="task-icon">📌</span>
                  <div className="task-content">
                    <div className="task-title">{task.title}</div>
                    <small className="task-due">Due: {task.due}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Access - My Courses */}
        <div className="quick-courses-section">
          <div className="section-header">
            <h3>📚 My Courses - Quick Access</h3>
            <button className="create-course-btn" onClick={() => setLocation("/create-course")}>
              <span className="btn-icon">➕</span>
              New Course
            </button>
          </div>

          <div className="quick-courses-grid">
            {coursesLoading ? (
              <div className="loading-courses">
                <div className="loading-spinner"></div>
                <span>Loading courses...</span>
              </div>
            ) : myCourses.length > 0 ? (
              myCourses.slice(0, 4).map((course: any, index) => (
                <div key={index} className="quick-course-card" onClick={() => setLocation('/my-courses')}>
                  <div className="course-badge">{course.category}</div>
                  <h4>{course.title}</h4>
                  <div className="course-quick-stats">
                    <span>👥 {course.students_count}</span>
                    <span>⏱️ {course.duration_hours}h</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-courses-quick">
                <span className="no-courses-icon">📚</span>
                <p>No courses yet</p>
                <button className="create-first-btn" onClick={() => setLocation("/create-course")}>
                  Create First Course
                </button>
              </div>
            )}

            {myCourses.length > 4 && (
              <div className="view-all-card" onClick={() => setLocation('/my-courses')}>
                <span className="view-all-icon">👁️</span>
                <h4>View All Courses</h4>
                <p>{myCourses.length - 4} more courses</p>
              </div>
            )}
          </div>
        </div>

        {/* Student Monitoring & Analytics */}
        <div className="analytics-section">
          <h3>Student Monitoring & Analytics</h3>
          <div className="analytics-grid">
            <div className="analytics-card">📈 Engagement: {studentAnalytics.engagement}</div>
            <div className="analytics-card">📝 Avg Grades: {studentAnalytics.avgGrades}</div>
            <div className="analytics-card">🏅 Top Performers: {studentAnalytics.topPerformers}</div>
            <div className="analytics-card">⚠️ Struggling Students: {studentAnalytics.struggling}</div>
            <div className="analytics-card">📚 Class Completion: {studentAnalytics.classCompletion}</div>
            <div className="analytics-card">🌟 Progress: {studentAnalytics.overallProgress}</div>
          </div>
        </div>



        {/* Engagement & Reports */}
        <div className="engagement-reports">
          <div className="engagement-section">
            <h3>Engagement</h3>
            <div className="vertical-buttons">
              <button className="engage-btn announce">📢 Announcements</button>
              <button className="engage-btn queries">💬 Student Queries</button>
              <button className="engage-btn forum">🗨️ Forum</button>
            </div>
          </div>
          <div className="reports-section">
            <h3>Reports</h3>
            <div className="vertical-buttons">
              <button className="report-btn weekly">📊 Weekly/Monthly</button>
              <button className="report-btn download">⬇️ Download</button>
              <button className="report-btn student">👩‍🎓 Student Breakdown</button>
            </div>
          </div>
        </div>

        {/* Student Management */}
        <div className="student-management-section">
          <div className="section-header">
            <h3>👥 Student Management</h3>
            <span className="section-subtitle">Endorse students for their skills and achievements</span>
          </div>

          <div className="students-grid">
            {studentsLoading ? (
              <div className="loading-students">
                <div className="loading-spinner"></div>
                <span>Loading students...</span>
              </div>
            ) : students.length > 0 ? (
              students.map((student: any) => (
                <div key={student.id} className="student-card">
                  <div className="student-avatar">
                    <span>{student.name.charAt(0)}</span>
                  </div>
                  <div className="student-info">
                    <h4>{student.name}</h4>
                    <p>{student.class} - {student.subject}</p>
                    <span className="performance">Performance: {student.performance}</span>
                  </div>
                  <button
                    className="endorse-btn"
                    onClick={() => handleEndorseStudent(student)}
                  >
                    🏆 Endorse Skill
                  </button>
                </div>
              ))
            ) : (
              <div className="no-students">
                <span className="no-students-icon">👥</span>
                <p>No students found</p>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Tools */}
        <div className="tools-section">
          <h3>Recommended Tools</h3>
          <div className="tools-grid">
            {recommendedTools.map((tool, idx) => (
              <div key={idx} className="tool-card">
                <div className="tool-icon">{tool.icon}</div>
                <h4>{tool.title}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Section */}
        {teacherSession && (
          <ComplianceSection userId={teacherSession.id} userType="teacher" />
        )}

        {/* Endorsement Modal */}
        <CreateEndorsement
          isOpen={showEndorsementModal}
          onClose={() => setShowEndorsementModal(false)}
          onSuccess={handleEndorsementSuccess}
          teacherId={session?.id || 0}
          preSelectedStudent={selectedStudent || undefined}
        />

      </div>
    </div>
  );
};

export default TeacherDashboard;
