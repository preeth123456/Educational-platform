import React, { useState, useEffect } from 'react';
import { ChevronDown, Trophy, BookOpen, FileText, Users, TrendingUp, Award, Clock, CheckCircle, Plus, Download, ExternalLink, Upload, X, Search, Filter, Star, Calendar, BarChart } from 'lucide-react';
import TeacherSidebarDemo from '../components/TeacherSidebar';
import NewHeader from '../components/NewHeader';
import SessionManager from '../../utils/sessionManager';
import '../styles/TeacherPerformance.css';

interface Student {
  id: number;
  name: string;
  avatar: string;
  email: string;
  rollNumber: string;
  dailyStreak: number;
  hoursWatched: number;
  quizScore: number;
  assignmentsSubmitted: number;
  totalAssignments: number;
  coursesCompleted: number;
  totalCourses: number;
  progress: number;
  rank: number;
  lastActive: string;
  attendanceRate: number;
  averageGrade: string;
  assignmentStatus: 'completed' | 'pending' | 'overdue';
  recentQuizzes: {
    title: string;
    score: number;
    date: string;
    rank: number;
  }[];
}

interface QuizLeaderboard {
  quizTitle: string;
  date: string;
  topPerformers: {
    rank: number;
    name: string;
    score: number;
    avatar: string;
  }[];
}

interface ReadingMaterial {
  id: number;
  title: string;
  type: 'article' | 'ebook' | 'reference';
  description: string;
  url?: string;
  file?: string;
  uploadDate: string;
  downloads: number;
  rating: number;
  tags: string[];
}

interface ClassData {
  className: string;
  totalStudents: number;
  averageScore: number;
  students: Student[];
}

const TeacherPerformance = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showReadingMaterials, setShowReadingMaterials] = useState(false);
  const [classData, setClassData] = useState<{ [key: string]: ClassData }>({});
  const [readingMaterials, setReadingMaterials] = useState<ReadingMaterial[]>([]);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [materialType, setMaterialType] = useState<'article' | 'ebook' | 'reference'>('article');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'article' | 'ebook' | 'reference'>('all');
  const [quizLeaderboard, setQuizLeaderboard] = useState<QuizLeaderboard[]>([]);

  const session = SessionManager.getSession();
  const teacherData = {
    name: session?.name || "Teacher",
    role: "Teacher",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  };

  const sidebarWidth = sidebarOpen ? 250 : 60;

  // Mock data - replace with API calls
  useEffect(() => {
    const mockData = {
      '10': {
        className: 'Class 10',
        totalStudents: 25,
        averageScore: 78.5,
        students: Array.from({ length: 25 }, (_, i) => {
          const names = ['Arjun Sharma', 'Priya Patel', 'Rahul Kumar', 'Sneha Reddy', 'Amit Singh', 'Kavya Gupta', 'Rohan Joshi', 'Ananya Verma', 'Vikash Yadav', 'Pooja Agarwal', 'Siddharth Roy', 'Nisha Kapoor', 'Karan Malhotra', 'Riya Saxena', 'Harsh Pandey', 'Divya Tiwari', 'Aditya Mishra', 'Shreya Dubey', 'Varun Sinha', 'Tanvi Bhatt', 'Nikhil Jain', 'Sakshi Sharma', 'Abhishek Kumar', 'Isha Gupta', 'Manish Rao'];
          const avatars = [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
          ];
          const statuses = ['completed', 'pending', 'overdue'];
          const grades = ['A+', 'A', 'B+', 'B', 'C+'];

          return {
            id: i + 1,
            name: names[i],
            avatar: avatars[i % avatars.length],
            email: `${names[i].toLowerCase().replace(' ', '.')}@school.edu`,
            rollNumber: `CL10-${String(i + 1).padStart(3, '0')}`,
            dailyStreak: Math.floor(Math.random() * 25) + 1,
            hoursWatched: Math.round((Math.random() * 5 + 1) * 10) / 10,
            quizScore: Math.floor(Math.random() * 30) + 70,
            assignmentsSubmitted: Math.floor(Math.random() * 3) + 7,
            totalAssignments: 10,
            coursesCompleted: Math.floor(Math.random() * 3) + 2,
            totalCourses: 5,
            progress: Math.floor(Math.random() * 40) + 60,
            rank: i + 1,
            lastActive: i < 5 ? `${i + 1} hours ago` : `${i} hours ago`,
            attendanceRate: Math.floor(Math.random() * 20) + 80,
            averageGrade: grades[Math.floor(Math.random() * grades.length)],
            assignmentStatus: statuses[Math.floor(Math.random() * statuses.length)],
            recentQuizzes: [
              { title: 'Algebra Quiz', score: Math.floor(Math.random() * 30) + 70, date: '2024-01-15', rank: Math.floor(Math.random() * 5) + 1 },
              { title: 'Geometry Test', score: Math.floor(Math.random() * 30) + 70, date: '2024-01-12', rank: Math.floor(Math.random() * 5) + 1 },
              { title: 'Trigonometry Quiz', score: Math.floor(Math.random() * 30) + 70, date: '2024-01-10', rank: Math.floor(Math.random() * 5) + 1 }
            ]
          };
        })
      },
      '11': {
        className: 'Class 11',
        totalStudents: 22,
        averageScore: 82.3,
        students: Array.from({ length: 22 }, (_, i) => {
          const names = ['Sneha Reddy', 'Amit Kumar', 'Kavya Singh', 'Rohan Gupta', 'Ananya Sharma', 'Vikash Yadav', 'Pooja Agarwal', 'Siddharth Roy', 'Nisha Kapoor', 'Karan Malhotra', 'Riya Saxena', 'Harsh Pandey', 'Divya Tiwari', 'Aditya Mishra', 'Shreya Dubey', 'Varun Sinha', 'Tanvi Bhatt', 'Nikhil Jain', 'Sakshi Sharma', 'Abhishek Kumar', 'Isha Gupta', 'Manish Rao'];
          const avatars = [
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
          ];
          const statuses = ['completed', 'pending', 'overdue'];
          const grades = ['A+', 'A', 'B+', 'B', 'C+'];

          return {
            id: i + 26,
            name: names[i],
            avatar: avatars[i % avatars.length],
            email: `${names[i].toLowerCase().replace(' ', '.')}@school.edu`,
            rollNumber: `CL11-${String(i + 1).padStart(3, '0')}`,
            dailyStreak: Math.floor(Math.random() * 25) + 1,
            hoursWatched: Math.round((Math.random() * 5 + 1) * 10) / 10,
            quizScore: Math.floor(Math.random() * 30) + 70,
            assignmentsSubmitted: Math.floor(Math.random() * 3) + 7,
            totalAssignments: 10,
            coursesCompleted: Math.floor(Math.random() * 4) + 2,
            totalCourses: 6,
            progress: Math.floor(Math.random() * 40) + 60,
            rank: i + 1,
            lastActive: i < 5 ? `${i + 1} hours ago` : `${i} hours ago`,
            attendanceRate: Math.floor(Math.random() * 20) + 80,
            averageGrade: grades[Math.floor(Math.random() * grades.length)],
            assignmentStatus: statuses[Math.floor(Math.random() * statuses.length)],
            recentQuizzes: [
              { title: 'Physics Quiz', score: Math.floor(Math.random() * 30) + 70, date: '2024-01-15', rank: Math.floor(Math.random() * 5) + 1 },
              { title: 'Chemistry Test', score: Math.floor(Math.random() * 30) + 70, date: '2024-01-12', rank: Math.floor(Math.random() * 5) + 1 },
              { title: 'Math Quiz', score: Math.floor(Math.random() * 30) + 70, date: '2024-01-10', rank: Math.floor(Math.random() * 5) + 1 }
            ]
          };
        })
      },
      '12': {
        className: 'Class 12',
        totalStudents: 18,
        averageScore: 85.7,
        students: Array.from({ length: 18 }, (_, i) => {
          const names = ['Vikram Singh', 'Meera Joshi', 'Arjun Nair', 'Priya Kapoor', 'Rohit Sharma', 'Anjali Gupta', 'Karthik Reddy', 'Neha Agarwal', 'Saurabh Jain', 'Ritu Verma', 'Akash Pandey', 'Swati Mishra', 'Deepak Kumar', 'Preeti Singh', 'Rajesh Yadav', 'Sunita Tiwari', 'Manoj Dubey', 'Kavita Sinha'];
          const avatars = [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
          ];
          const statuses = ['completed', 'pending', 'overdue'];
          const grades = ['A+', 'A', 'B+', 'B', 'C+'];

          return {
            id: i + 48,
            name: names[i],
            avatar: avatars[i % avatars.length],
            email: `${names[i].toLowerCase().replace(' ', '.')}@school.edu`,
            rollNumber: `CL12-${String(i + 1).padStart(3, '0')}`,
            dailyStreak: Math.floor(Math.random() * 30) + 1,
            hoursWatched: Math.round((Math.random() * 6 + 2) * 10) / 10,
            quizScore: Math.floor(Math.random() * 25) + 75,
            assignmentsSubmitted: Math.floor(Math.random() * 3) + 8,
            totalAssignments: 10,
            coursesCompleted: Math.floor(Math.random() * 3) + 3,
            totalCourses: 6,
            progress: Math.floor(Math.random() * 30) + 70,
            rank: i + 1,
            lastActive: i < 5 ? `${i + 1} hours ago` : `${i} hours ago`,
            attendanceRate: Math.floor(Math.random() * 15) + 85,
            averageGrade: grades[Math.floor(Math.random() * grades.length)],
            assignmentStatus: statuses[Math.floor(Math.random() * statuses.length)],
            recentQuizzes: [
              { title: 'Calculus Quiz', score: Math.floor(Math.random() * 25) + 75, date: '2024-01-15', rank: Math.floor(Math.random() * 5) + 1 },
              { title: 'Physics Test', score: Math.floor(Math.random() * 25) + 75, date: '2024-01-12', rank: Math.floor(Math.random() * 5) + 1 },
              { title: 'Chemistry Quiz', score: Math.floor(Math.random() * 25) + 75, date: '2024-01-10', rank: Math.floor(Math.random() * 5) + 1 }
            ]
          };
        })
      }
    };
    setClassData(mockData);

    // Mock quiz leaderboard
    const mockLeaderboard: QuizLeaderboard[] = [
      {
        quizTitle: 'Recent Algebra Quiz',
        date: '2024-01-15',
        topPerformers: [
          { rank: 1, name: 'Arjun Sharma', score: 95, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face' },
          { rank: 2, name: 'Priya Patel', score: 88, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face' },
          { rank: 3, name: 'Rahul Kumar', score: 82, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' }
        ]
      },
      {
        quizTitle: 'Geometry Test',
        date: '2024-01-12',
        topPerformers: [
          { rank: 1, name: 'Arjun Sharma', score: 92, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face' },
          { rank: 2, name: 'Sneha Reddy', score: 90, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face' },
          { rank: 3, name: 'Priya Patel', score: 85, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face' }
        ]
      }
    ];
    setQuizLeaderboard(mockLeaderboard);

    // Mock reading materials
    const mockMaterials: ReadingMaterial[] = [
      {
        id: 1,
        title: 'Advanced Mathematics Concepts',
        type: 'ebook',
        description: 'Comprehensive guide to advanced mathematical concepts for Class 10-12',
        file: 'advanced-math.pdf',
        uploadDate: '2024-01-10',
        downloads: 45,
        rating: 4.8,
        tags: ['Mathematics', 'Advanced', 'Concepts']
      },
      {
        id: 2,
        title: 'Scientific Method in Practice',
        type: 'article',
        description: 'Understanding the scientific method through practical examples',
        url: 'https://example.com/scientific-method',
        uploadDate: '2024-01-08',
        downloads: 32,
        rating: 4.6,
        tags: ['Science', 'Method', 'Practice']
      },
      {
        id: 3,
        title: 'Historical Timeline Reference',
        type: 'reference',
        description: 'Complete timeline of major historical events',
        file: 'history-timeline.pdf',
        uploadDate: '2024-01-05',
        downloads: 28,
        rating: 4.7,
        tags: ['History', 'Timeline', 'Reference']
      }
    ];
    setReadingMaterials(mockMaterials);
  }, []);

  const filteredMaterials = readingMaterials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || material.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleAddMaterial = (materialData: any) => {
    const newMaterial: ReadingMaterial = {
      id: readingMaterials.length + 1,
      ...materialData,
      uploadDate: new Date().toISOString().split('T')[0],
      downloads: 0,
      rating: 0
    };
    setReadingMaterials([...readingMaterials, newMaterial]);
    setShowAddMaterial(false);
  };

  const currentClass = classData[selectedClass];

  return (
    <div className="flex">
      <TeacherSidebarDemo open={sidebarOpen} setOpen={setSidebarOpen} />

      <div style={{ marginLeft: sidebarWidth + 16, flex: 1, transition: "all 0.3s ease", minHeight: "100vh" }}>
        <div style={{ position: "fixed", top: 0, left: sidebarWidth, right: 0, zIndex: 999 }}>
          <NewHeader avatar={teacherData.avatar} name={teacherData.name} role={teacherData.role} teacherId={session?.id} />
        </div>

        <div className="performance-dashboard">
          {/* Header Section */}
          <div className="dashboard-header">
            <div className="header-content">
              <div className="header-text">
                <h1 className="dashboard-title">
                  <TrendingUp className="title-icon" />
                  Student Performance Dashboard
                </h1>
                <p className="dashboard-subtitle">Track student progress, quiz scores, and assignment submissions</p>
              </div>

              <div className="header-actions">
                <button
                  className="reading-materials-btn"
                  onClick={() => setShowReadingMaterials(!showReadingMaterials)}
                >
                  <BookOpen size={20} />
                  Reading Materials
                </button>

                <div className="class-selector">
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="class-dropdown"
                  >
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                  <ChevronDown className="dropdown-icon" />
                </div>
              </div>
            </div>
          </div>

          {/* Reading Materials Modal */}
          {showReadingMaterials && (
            <div className="reading-materials-modal">
              <div className="modal-content large">
                <div className="modal-header">
                  <h3>Reading Materials Library</h3>
                  <div className="header-actions">
                    <button
                      className="add-material-btn"
                      onClick={() => setShowAddMaterial(true)}
                    >
                      <Plus size={16} />
                      Add Material
                    </button>
                    <button onClick={() => setShowReadingMaterials(false)} className="close-btn">×</button>
                  </div>
                </div>

                <div className="materials-controls">
                  <div className="search-bar">
                    <Search size={20} className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search materials..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </div>

                  <div className="filter-dropdown">
                    <Filter size={16} />
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as any)}
                      className="filter-select"
                    >
                      <option value="all">All Types</option>
                      <option value="article">Articles</option>
                      <option value="ebook">E-Books</option>
                      <option value="reference">References</option>
                    </select>
                  </div>
                </div>

                <div className="materials-grid">
                  {filteredMaterials.map((material) => (
                    <div key={material.id} className="material-item">
                      <div className="material-header">
                        <div className="material-type-badge">
                          {material.type === 'article' && <FileText size={16} />}
                          {material.type === 'ebook' && <BookOpen size={16} />}
                          {material.type === 'reference' && <Award size={16} />}
                          {material.type}
                        </div>
                        <div className="material-rating">
                          <Star size={14} className="star-icon" />
                          {material.rating.toFixed(1)}
                        </div>
                      </div>

                      <h4 className="material-title">{material.title}</h4>
                      <p className="material-description">{material.description}</p>

                      <div className="material-tags">
                        {material.tags.map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>

                      <div className="material-footer">
                        <div className="material-stats">
                          <span className="download-count">
                            <Download size={14} />
                            {material.downloads}
                          </span>
                          <span className="upload-date">
                            <Calendar size={14} />
                            {material.uploadDate}
                          </span>
                        </div>

                        <div className="material-actions">
                          {material.url && (
                            <button className="action-btn">
                              <ExternalLink size={16} />
                            </button>
                          )}
                          {material.file && (
                            <button className="action-btn">
                              <Download size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Add Material Modal */}
          {showAddMaterial && (
            <div className="add-material-modal">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Add New Material</h3>
                  <button onClick={() => setShowAddMaterial(false)} className="close-btn">×</button>
                </div>

                <div className="add-material-form">
                  <div className="form-group">
                    <label>Material Type</label>
                    <div className="type-selector">
                      <button
                        className={`type-btn ${materialType === 'article' ? 'active' : ''}`}
                        onClick={() => setMaterialType('article')}
                      >
                        <FileText size={20} />
                        Article
                      </button>
                      <button
                        className={`type-btn ${materialType === 'ebook' ? 'active' : ''}`}
                        onClick={() => setMaterialType('ebook')}
                      >
                        <BookOpen size={20} />
                        E-Book
                      </button>
                      <button
                        className={`type-btn ${materialType === 'reference' ? 'active' : ''}`}
                        onClick={() => setMaterialType('reference')}
                      >
                        <Award size={20} />
                        Reference
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Title</label>
                    <input type="text" className="form-input" placeholder="Enter material title" />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea className="form-textarea" placeholder="Enter material description" rows={3}></textarea>
                  </div>

                  <div className="form-group">
                    <label>Tags (comma separated)</label>
                    <input type="text" className="form-input" placeholder="e.g., Mathematics, Advanced, Concepts" />
                  </div>

                  <div className="form-group">
                    <label>{materialType === 'article' ? 'URL' : 'File Upload'}</label>
                    {materialType === 'article' ? (
                      <input type="url" className="form-input" placeholder="https://example.com" />
                    ) : (
                      <div className="file-upload">
                        <Upload size={20} />
                        <span>Click to upload or drag and drop</span>
                        <input type="file" className="file-input" accept=".pdf,.doc,.docx" />
                      </div>
                    )}
                  </div>

                  <div className="form-actions">
                    <button className="cancel-btn" onClick={() => setShowAddMaterial(false)}>Cancel</button>
                    <button className="submit-btn" onClick={() => handleAddMaterial({})}>Add Material</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="main-content">
            <div className="left-section">
              {/* Class Overview Cards */}
              {currentClass && (
                <div className="overview-cards">
                  <div className="overview-card">
                    <div className="card-icon students-icon">
                      <Users size={20} />
                    </div>
                    <div className="card-content">
                      <h3>{currentClass.totalStudents}</h3>
                      <p>Total Students</p>
                    </div>
                  </div>

                  <div className="overview-card">
                    <div className="card-icon score-icon">
                      <Trophy size={20} />
                    </div>
                    <div className="card-content">
                      <h3>{currentClass.averageScore}%</h3>
                      <p>Average Score</p>
                    </div>
                  </div>

                  <div className="overview-card">
                    <div className="card-icon progress-icon">
                      <TrendingUp size={20} />
                    </div>
                    <div className="card-content">
                      <h3>85%</h3>
                      <p>Class Progress</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Student Performance Table */}
              {currentClass && (
                <div className="performance-table-container">
                  <div className="table-header">
                    <h2>Student Performance - {currentClass.className}</h2>
                  </div>

                  <div className="performance-table">
                    <div className="table-row table-header-row">
                      <div className="table-cell">#</div>
                      <div className="table-cell">Student</div>
                      <div className="table-cell">Streak</div>
                      <div className="table-cell">Hours/Day</div>
                      <div className="table-cell">Quiz Score</div>
                      <div className="table-cell">Assignment</div>
                      <div className="table-cell">Action</div>
                    </div>

                    {currentClass.students.map((student, index) => (
                      <div key={student.id} className="table-row student-row">
                        <div className="table-cell">
                          {index + 1}.
                        </div>

                        <div className="table-cell">
                          <div className="student-info">
                            <img src={student.avatar} alt={student.name} className="student-avatar" />
                            <div className="student-details">
                              <span className="student-name">{student.name}</span>
                              <span className="student-roll">{student.rollNumber}</span>
                            </div>
                          </div>
                        </div>

                        <div className="table-cell">
                          🔥 {student.dailyStreak}
                        </div>

                        <div className="table-cell">
                          {student.hoursWatched}h
                        </div>

                        <div className="table-cell">
                          <span className="score-badge">{student.quizScore}%</span>
                        </div>

                        <div className="table-cell">
                          <div className={`assignment-status-badge status-${student.assignmentStatus}`}>
                            {student.assignmentStatus === 'completed' && '✅'}
                            {student.assignmentStatus === 'pending' && '⏳'}
                            {student.assignmentStatus === 'overdue' && '❌'}
                          </div>
                        </div>

                        <div className="table-cell">
                          <button
                            className="view-details-btn"
                            onClick={() => setSelectedStudent(student)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="right-section">
              {/* Recent Quiz Results */}
              <div className="quiz-leaderboard">
                <h3>Recent Quiz Results</h3>
                {quizLeaderboard.map((quiz, index) => (
                  <div key={index} className="quiz-card">
                    <div className="quiz-header">
                      <h4>{quiz.quizTitle}</h4>
                      <span className="quiz-date">{quiz.date}</span>
                    </div>
                    <div className="top-performers">
                      {quiz.topPerformers.map((performer) => (
                        <div key={performer.rank} className={`performer performer-${performer.rank}`}>
                          <div className="performer-rank">#{performer.rank}</div>
                          <img src={performer.avatar} alt={performer.name} className="performer-avatar" />
                          <div className="performer-info">
                            <span className="performer-name">{performer.name}</span>
                            <span className="performer-score">{performer.score}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Overall Performance Summary */}
              <div className="performance-summary" style={{ display: 'block', visibility: 'visible', opacity: 1 }}>
                <h3 style={{ display: 'block', visibility: 'visible' }}>Overall Performance</h3>
                <div className="summary-stats" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="stat-item" style={{ display: 'flex', flexDirection: 'column', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', gap: '8px' }}>
                    <span className="stat-label" style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>Class Average</span>
                    <span className="stat-value" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#3b82f6' }}>{currentClass?.averageScore}%</span>
                  </div>
                  <div className="stat-item" style={{ display: 'flex', flexDirection: 'column', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', gap: '8px' }}>
                    <span className="stat-label" style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>Active Students</span>
                    <span className="stat-value" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#3b82f6' }}>{currentClass?.students.filter(s => s.dailyStreak > 0).length}</span>
                  </div>
                  <div className="stat-item" style={{ display: 'flex', flexDirection: 'column', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', gap: '8px' }}>
                    <span className="stat-label" style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>Assignments Pending</span>
                    <span className="stat-value" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#3b82f6' }}>{currentClass?.students.filter(s => s.assignmentStatus === 'pending').length}</span>
                  </div>
                  <div className="stat-item" style={{ display: 'flex', flexDirection: 'column', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', gap: '8px' }}>
                    <span className="stat-label" style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>Top Performer</span>
                    <span className="stat-value" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#3b82f6' }}>{currentClass?.students[0]?.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Student Detail Modal */}
          {selectedStudent && (
            <div className="student-detail-modal">
              <div className="modal-content large">
                <div className="modal-header">
                  <div className="student-header">
                    <img src={selectedStudent.avatar} alt={selectedStudent.name} className="student-avatar-large" />
                    <div>
                      <h3>{selectedStudent.name}</h3>
                      <p>Rank #{selectedStudent.rank} in {currentClass?.className}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedStudent(null)} className="close-btn">×</button>
                </div>

                <div className="student-detail-content">
                  {/* Student Overview Stats */}
                  <div className="overview-stats">
                    <div className="stat-card">
                      <div className="stat-icon">🔥</div>
                      <div className="stat-content">
                        <div className="stat-value">{selectedStudent.dailyStreak}</div>
                        <div className="stat-label">Day Streak</div>
                        <div className="stat-desc">Consecutive learning days</div>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">⏱️</div>
                      <div className="stat-content">
                        <div className="stat-value">{selectedStudent.hoursWatched}h</div>
                        <div className="stat-label">Daily Hours</div>
                        <div className="stat-desc">Average study time</div>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">🎯</div>
                      <div className="stat-content">
                        <div className="stat-value">{selectedStudent.averageGrade}</div>
                        <div className="stat-label">Grade Average</div>
                        <div className="stat-desc">Current performance</div>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon">📈</div>
                      <div className="stat-content">
                        <div className="stat-value">{selectedStudent.attendanceRate}%</div>
                        <div className="stat-label">Attendance</div>
                        <div className="stat-desc">Class participation</div>
                      </div>
                    </div>
                  </div>

                  {/* Academic Performance */}
                  <div className="academic-section">
                    <h3>📚 Academic Performance</h3>
                    <div className="academic-grid">
                      <div className="academic-card">
                        <div className="academic-header">
                          <span className="academic-title">Quiz Performance</span>
                          <span className="academic-value">{selectedStudent.quizScore}%</span>
                        </div>
                        <div className="progress-bar-academic">
                          <div className="progress-fill-academic" style={{ width: `${selectedStudent.quizScore}%` }}></div>
                        </div>
                        <span className="academic-status">Average score across all quizzes</span>
                      </div>

                      <div className="academic-card">
                        <div className="academic-header">
                          <span className="academic-title">Assignment Progress</span>
                          <span className="academic-value">{selectedStudent.assignmentsSubmitted}/{selectedStudent.totalAssignments}</span>
                        </div>
                        <div className="progress-bar-academic">
                          <div className="progress-fill-academic" style={{ width: `${(selectedStudent.assignmentsSubmitted / selectedStudent.totalAssignments) * 100}%` }}></div>
                        </div>
                        <div className={`assignment-status-badge status-${selectedStudent.assignmentStatus}`}>
                          {selectedStudent.assignmentStatus === 'completed' && '✅ All Complete'}
                          {selectedStudent.assignmentStatus === 'pending' && '⏳ Pending'}
                          {selectedStudent.assignmentStatus === 'overdue' && '❌ Overdue'}
                        </div>
                      </div>

                      <div className="academic-card">
                        <div className="academic-header">
                          <span className="academic-title">Course Completion</span>
                          <span className="academic-value">{selectedStudent.coursesCompleted}/{selectedStudent.totalCourses}</span>
                        </div>
                        <div className="progress-bar-academic">
                          <div className="progress-fill-academic" style={{ width: `${selectedStudent.progress}%` }}></div>
                        </div>
                        <span className="academic-status">{selectedStudent.progress}% overall progress</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Quiz Results */}
                  <div className="quiz-history-section">
                    <h3>🏆 Recent Quiz Results</h3>
                    <div className="quiz-history-grid">
                      {selectedStudent.recentQuizzes.map((quiz, index) => (
                        <div key={index} className="quiz-history-card">
                          <div className="quiz-header">
                            <div className="quiz-title">{quiz.title}</div>
                            <div className={`quiz-rank-badge rank-${quiz.rank}`}>#{quiz.rank}</div>
                          </div>
                          <div className="quiz-score-display">{quiz.score}%</div>
                          <div className="quiz-date">{quiz.date}</div>
                          <div className="quiz-performance-bar">
                            <div className="quiz-performance-fill" style={{ width: `${quiz.score}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherPerformance;
