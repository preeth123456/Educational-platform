import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import {
  FaBook, FaBell, FaCheckCircle, FaChartLine, FaClock,
  FaStar, FaPlayCircle, FaUser, FaClipboardList, FaSignOutAlt,
  FaTrophy, FaRocket, FaLightbulb, FaCalendarAlt, FaArrowRight,
  FaGraduationCap, FaMedal, FaFire, FaBullseye, FaChartBar, FaPlus
} from 'react-icons/fa';
import SkillBadges from '../components/SkillBadges';
import BadgeNotification from '../components/BadgeNotification';
import EndorsementWidget from '../components/EndorsementWidget';
import ThemeToggle from '../components/ThemeToggle';
import { useBadgeService } from '../hooks/useBadgeService';
import SessionManager, { StudentSession } from '../utils/sessionManager';
import { getAvatarUrl } from '../utils/avatarUtils';
import { getHeaderProps } from '../utils/headerUtils';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

import StudentLayout from "../components/StudentLayout";
import '../Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Type Definitions
interface Goal {
  title: string;
  description?: string;
  date?: string;
  progress?: number;
  category?: string;
}

interface StudentData {
  name: string;
  role: string;
  college: string;
  location: string;
  avatar: string;
  enrolledCourses: number;
  completedCourses: number;
  averageScore: number;
  totalPoints: number;
  streak: number;
  rank: string;
}

interface Course {
  id: number;
  title: string;
  instructor: string;
  progress?: number;
  nextLesson?: string;
  rating?: number;
  level?: string;
  thumbnail: string;
  category: string;
  timeSpent: string;
}

interface Deadline {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  daysLeft: number;
  priority: 'high' | 'medium' | 'low';
}

interface Activity {
  id: number;
  action: string;
  subject: string;
  course: string;
  time: string;
  type: 'completed' | 'started' | 'submitted' | 'achievement' | 'enrolled';
}

const Dashboard: React.FC = () => {
  const [activeTab] = useState('overview');

  const [goals, setGoals] = useState<Goal[]>([
    { title: "Complete Calculus Course", description: "Finish all modules and assignments", progress: 75, category: "Mathematics" },
    { title: "Learn React Basics", description: "Complete 5 React projects", progress: 30, category: "Programming" }
  ]);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [goalDate, setGoalDate] = useState("");
  const [studentSession, setStudentSession] = useState<StudentSession | null>(null);
  const [dashboardStats, setDashboardStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    completedVideos: 0,
    inProgressCourses: 0
  });
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [, navigate] = useLocation();
  const { newBadges, clearNewBadges } = useBadgeService();
  const [showBadgeNotification, setShowBadgeNotification] = useState(false);
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);

  // Get student session data
  useEffect(() => {
    const session = SessionManager.getSession();
    if (!session) {
      navigate('/login');
      return;
    }

    // Type cast to StudentSession since this is the student dashboard
    const studentSession = session as StudentSession;
    setStudentSession(studentSession);
    
    // Use student_id string for API calls, not database ID
    const studentId = studentSession.student_id || studentSession.id;
    fetchDashboardStats(studentId);
    fetchRecentCourses(studentId);
    fetchRecentActivity(studentId);
    loadUserTheme(studentId);
  }, [navigate]);

  const loadUserTheme = async (studentId: string | number) => {
    try {
      const response = await fetch(`http://localhost:8001/api/auth/get_user_preferences/?student_id=${studentId}`);
      const data = await response.json();

      if (data.status === 'success') {
        applyTheme(data.data.theme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-theme');
    } else if (theme === 'light') {
      root.classList.remove('dark-theme');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark-theme');
      } else {
        root.classList.remove('dark-theme');
      }
    }
  };

  const fetchDashboardStats = async (studentId: string | number) => {
    try {
      const response = await fetch(`http://localhost:8001/api/courses/dashboard_stats/?student_id=${studentId}`);
      const data = await response.json();

      if (data.status === 'success') {
        setDashboardStats({
          enrolledCourses: data.data.enrolled_courses,
          completedCourses: data.data.completed_courses,
          completedVideos: data.data.completed_videos || 0,
          inProgressCourses: data.data.in_progress_courses
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchRecentCourses = async (studentId: string | number) => {
    try {
      const response = await fetch(`http://localhost:8001/api/courses/my_courses/?student_id=${studentId}`);
      const data = await response.json();

      if (data.status === 'success') {
        const recent = data.data.slice(0, 2).map((course: any) => ({
          id: course.id,
          title: course.title,
          instructor: course.instructor_name || 'Instructor',
          progress: Math.round(course.progress_percentage || 0),
          thumbnail: course.thumbnail_url || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&h=500',
          category: course.category || 'General'
        }));
        setRecentCourses(recent);
      }
    } catch (error) {
      console.error('Error fetching recent courses:', error);
    }
  };

  const todayStr = new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const studentData: StudentData & { gender?: string } = {
    name: studentSession?.name || "Student",
    role: "Student",
    college: studentSession?.class || "Class",
    location: studentSession?.board || "Board",
    avatar: studentSession?.profile_picture || getAvatarUrl(studentSession?.gender),
    gender: studentSession?.gender || "",
    enrolledCourses: dashboardStats.enrolledCourses,
    completedCourses: dashboardStats.completedCourses,
    averageScore: 85,
    totalPoints: 1250,
    streak: 7,
    rank: "Top 15%"
  };

  const deadlines: Deadline[] = [
    { id: 1, title: "Calculus Assignment 3", course: "Advanced Calculus", dueDate: "May 15, 2025", daysLeft: 3, priority: 'high' },
    { id: 2, title: "React Project Submission", course: "Web Dev Bootcamp", dueDate: "May 20, 2025", daysLeft: 8, priority: 'medium' },
    { id: 3, title: "Quiz: Integration Methods", course: "Advanced Calculus", dueDate: "May 18, 2025", daysLeft: 6, priority: 'high' }
  ];

  const fetchRecentActivity = async (studentId: string | number) => {
    try {
      const response = await fetch(`http://localhost:8001/api/courses/recent_activity/?student_id=${studentId}`);
      const data = await response.json();

      if (data.status === 'success') {
        const activities = data.data.map((activity: any) => ({
          id: activity.id,
          action: activity.action,
          subject: activity.subject,
          course: activity.course_name || '',
          time: activity.time_ago,
          type: activity.activity_type
        }));
        setActivity(activities);
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      setActivity([
        { id: 1, action: "Completed lesson", subject: "Derivatives", course: "Calculus", time: "2 hours ago", type: 'completed' },
        { id: 2, action: "Submitted assignment", subject: "JS Functions", course: "Web Dev", time: "Yesterday", type: 'submitted' },
        { id: 3, action: "Started new course", subject: "Creative Writing", course: "", time: "3 days ago", type: 'started' },
        { id: 4, action: "Achieved badge", subject: "Fast Learner", course: "", time: "1 week ago", type: 'achievement' }
      ]);
    }
  };

  const handleAddGoal = () => {
    if (goalTitle.trim()) {
      setGoals([...goals, { title: goalTitle.trim(), description: goalDescription.trim(), date: goalDate, progress: 0 }]);
      setGoalTitle("");
      setGoalDescription("");
      setGoalDate("");
      setIsGoalModalOpen(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = isGoalModalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isGoalModalOpen]);

  useEffect(() => {
    if (newBadges.length > 0 && !showBadgeNotification) {
      setShowBadgeNotification(true);
      setCurrentBadgeIndex(0);
    }
  }, [newBadges, showBadgeNotification]);

  const handleBadgeNotificationClose = () => {
    if (currentBadgeIndex < newBadges.length - 1) {
      setCurrentBadgeIndex(currentBadgeIndex + 1);
    } else {
      setShowBadgeNotification(false);
      clearNewBadges();
      setCurrentBadgeIndex(0);
    }
  };

  return (
    <StudentLayout>
      <ThemeToggle studentId={studentSession?.student_id || studentSession?.id || 0} />
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          <div className="hero-welcome">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">Welcome back, <span className="hero-name">{studentData.name}</span>! 👋</h1>
                <p className="hero-subtitle one-line">Ready to continue your learning journey? Let's make today productive!</p>
              </div>
              <div className="hero-right">
                <div className="hero-date">{todayStr}</div>
                <div className="hero-stats">
                  <div className="hero-stat">
                    <FaFire className="hero-stat-icon" />
                    <span>{studentData.streak} day streak</span>
                  </div>
                  <div className="hero-stat">
                    <FaTrophy className="hero-stat-icon" />
                    <span>{studentData.rank}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">
                <FaBook />
              </div>
              <div className="stat-content">
                <h3>{studentData.enrolledCourses}</h3>
                <p>Enrolled Courses</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="stat-card success">
              <div className="stat-icon">
                <FaCheckCircle />
              </div>
              <div className="stat-content">
                <h3>{dashboardStats.completedVideos}</h3>
                <p>Completed Videos</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="stat-card info">
              <div className="stat-icon">
                <FaChartLine />
              </div>
              <div className="stat-content">
                <h3>{studentData.averageScore}%</h3>
                <p>Average Score</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${studentData.averageScore}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="stat-card warning">
              <div className="stat-icon">
                <FaStar />
              </div>
              <div className="stat-content">
                <h3>{studentData.totalPoints}</h3>
                <p>Total Points</p>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="learning-goals-row">
            <div className="dashboard-section continue-learning">
              <div className="section-header">
                <div className="section-title">
                  <FaPlayCircle className="section-icon" />
                  <h2>Continue Learning</h2>
                </div>
                <Link to="/courses" className="view-all-btn">
                  View All Courses
                  <FaArrowRight />
                </Link>
              </div>

              <div className="courses-grid">
                {recentCourses.length > 0 ? (
                  recentCourses.map(course => (
                    <div key={course.id} className="course-progress-card">
                      <div className="course-thumbnail" style={{ backgroundImage: `url(${course.thumbnail})` }}>
                        <div className="course-overlay">
                          <div className="course-category">{course.category}</div>
                          <div className="course-progress-ring">
                            <svg viewBox="0 0 36 36">
                              <path
                                className="progress-ring-bg"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className="progress-ring-fill"
                                strokeDasharray={`${course.progress}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <text x="18" y="20.35" className="progress-text">{course.progress}%</text>
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="course-info">
                        <h3 className="course-title">{course.title}</h3>
                        <p className="course-instructor">By {course.instructor}</p>
                        <div className="course-meta">
                          <span className="meta-chip">
                            Progress: {course.progress}%
                          </span>
                        </div>
                        <button
                          className="continue-btn"
                          onClick={() => navigate(`/course/${course.id}/learn`)}
                        >
                          <FaPlayCircle />
                          Continue Learning
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-courses-message">
                    <FaBook className="no-courses-icon" />
                    <p>No courses enrolled yet</p>
                    <Link to="/courses" className="browse-courses-btn">
                      Browse Courses
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="goals-section">
              <div className="section-header">
                <div className="section-title">
                  <FaBullseye className="section-icon" />
                  <h2>My Learning Goals</h2>
                </div>
                <button className="add-goal-btn" onClick={() => setIsGoalModalOpen(true)}>
                  <FaPlus />
                  Add Goal
                </button>
              </div>

              <div className="goals-list">
                {goals.map((goal, idx) => (
                  <div key={idx} className="goal-card">
                    <div className="goal-header">
                      <h3 className="goal-title">{goal.title}</h3>
                      <span className="goal-category">{goal.category}</span>
                    </div>
                    {goal.description && <p className="goal-description">{goal.description}</p>}
                    <div className="goal-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${goal.progress}%` }}></div>
                      </div>
                      <span className="progress-text">{goal.progress}%</span>
                    </div>
                    {goal.date && <div className="goal-date">Target: {goal.date}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="quick-actions">
            <Link to="/courses" className="action-card primary">
              <div className="action-icon">
                <FaRocket />
              </div>
              <h3>Start New Course</h3>
              <p>Explore our catalog and find your next challenge</p>
            </Link>

            <div className="action-card success">
              <div className="action-icon">
                <FaTrophy />
              </div>
              <h3>Take Assessment</h3>
              <p>Test your knowledge and track progress</p>
            </div>

            <div className="action-card info">
              <div className="action-icon">
                <FaLightbulb />
              </div>
              <h3>Learning Tips</h3>
              <p>Get personalized recommendations</p>
            </div>
          </div>

          <div className="bottom-grid">
            <div className="deadlines-section">
              <div className="section-header">
                <div className="section-title">
                  <FaCalendarAlt className="section-icon" />
                  <h2>Upcoming Deadlines</h2>
                </div>
              </div>

              <div className="deadlines-list">
                {deadlines.map(item => (
                  <div key={item.id} className={`deadline-card ${item.priority}`}>
                    <div className="deadline-priority"></div>
                    <div className="deadline-content">
                      <h3 className="deadline-title">{item.title}</h3>
                      <p className="deadline-course">{item.course}</p>
                      <div className="deadline-time">
                        <FaClock className="deadline-icon" />
                        <span className="days-left">{item.daysLeft} days left</span>
                        <span className="due-date">{item.dueDate}</span>
                      </div>
                    </div>
                    <button className="deadline-action">View</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="activity-section">
              <div className="section-header">
                <div className="section-title">
                  <FaChartBar className="section-icon" />
                  <h2>Recent Activity</h2>
                </div>
              </div>

              <div className="activity-list">
                {activity.length > 0 ? (
                  activity.map(act => (
                    <div key={act.id} className={`activity-item ${act.type}`}>
                      <div className="activity-icon">
                        {act.type === 'completed' && <FaCheckCircle />}
                        {act.type === 'submitted' && <FaClipboardList />}
                        {act.type === 'started' && <FaPlayCircle />}
                        {act.type === 'achievement' && <FaMedal />}
                        {act.type === 'enrolled' && <FaBook />}
                      </div>
                      <div className="activity-content">
                        <div className="activity-text">
                          <span className="activity-action">{act.action}:</span> {act.subject}
                        </div>
                        {act.course && <div className="activity-course">{act.course}</div>}
                        <div className="activity-time">{act.time}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-activity-message">
                    <FaChartBar className="no-activity-icon" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="badges-endorsements-grid">
              <SkillBadges studentId={studentSession?.student_id || studentSession?.id || 0} compact={true} />
              <EndorsementWidget studentId={studentSession?.student_id || studentSession?.id || 0} />
            </div>
          </div>

          {isGoalModalOpen && (
            <div className="modal-overlay" onClick={() => setIsGoalModalOpen(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Add New Goal</h3>
                  <button className="modal-close" onClick={() => setIsGoalModalOpen(false)}>×</button>
                </div>
                
                <div className="modal-body">
                  <div className="form-group">
                    <label>Goal Title *</label>
                    <input
                      type="text"
                      value={goalTitle}
                      onChange={e => setGoalTitle(e.target.value)}
                      placeholder="e.g., Complete React Course"
                      className="form-input"
                      autoFocus
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={goalDescription}
                      onChange={e => setGoalDescription(e.target.value)}
                      placeholder="Describe your goal..."
                      className="form-textarea"
                      rows={3}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Target Date</label>
                    <input
                      type="date"
                      value={goalDate}
                      onChange={e => setGoalDate(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button onClick={() => setIsGoalModalOpen(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button onClick={handleAddGoal} className="btn-primary">
                    Add Goal
                  </button>
                </div>
              </div>
            </div>
          )}

          {showBadgeNotification && newBadges.length > 0 && (
            <BadgeNotification
              badge={newBadges[currentBadgeIndex]}
              onClose={handleBadgeNotificationClose}
              autoClose={true}
              duration={6000}
            />
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default Dashboard;