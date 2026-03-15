import React, { useState } from "react";
import NewHeader from "@/components/NewHeader";
import { TeacherSidebarDemo } from "@/components/TeacherSidebar";
import "../Dashboard.css";
import "./TeacherSubmissions.css";

const TeacherSubmissions: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for teacher
  const teacherData = {
    name: "Ms. Priya Sharma",
    role: "Teacher",
    department: "Computer Science",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  };

  const submissions = [
    {
      id: 1,
      assignment: "JavaScript Assignment",
      student: "Aanya Patel",
      class: "CS304 - Web Development",
      submitted: "May 14, 2023 • 10:45 AM",
      status: "Pending Review",
      score: null,
      actions: ["View Submission", "Grade Now"]
    },
    {
      id: 2,
      assignment: "Database Quiz",
      student: "Raj Mehta",
      class: "CS201 - Data Structures",
      submitted: "May 13, 2023 • 02:15 PM",
      status: "Graded",
      score: "85/100",
      actions: ["View Submission"]
    },
    {
      id: 3,
      assignment: "Python Functions Lab",
      student: "Neha Singh",
      class: "CS105 - Python Programming",
      submitted: "May 12, 2023 • 09:30 AM",
      status: "Graded",
      score: "92/100",
      actions: ["View Submission"]
    },
    {
      id: 4,
      assignment: "HTML Project",
      student: "Arjun Kumar",
      class: "CS304 - Web Development",
      submitted: "May 10, 2023 • 11:20 AM",
      status: "Late Submission",
      score: "75/100",
      actions: ["View Submission"]
    },
    {
      id: 5,
      assignment: "Algorithm Analysis",
      student: "Maya Gupta",
      class: "CS201 - Data Structures",
      submitted: "May 10, 2023 • 08:45 AM",
      status: "Pending Review",
      score: null,
      actions: ["View Submission", "Grade Now"]
    },
    {
      id: 6,
      assignment: "Database Quiz",
      student: "Rohit Sharma",
      class: "CS201 - Data Structures",
      submitted: "May 09, 2023 • 03:30 PM",
      status: "Graded",
      score: "78/100",
      actions: ["View Submission"]
    }
  ];

  const filters = ["All", "Pending Review", "Graded", "Late"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending Review": return "orange";
      case "Graded": return "green";
      case "Late Submission": return "red";
      default: return "gray";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending Review": return "⏳";
      case "Graded": return "✅";
      case "Late Submission": return "❌";
      default: return "📄";
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesFilter = activeFilter === "All" || submission.status === activeFilter;
    const matchesSearch = searchQuery === "" || 
      submission.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.assignment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.class.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleViewSubmission = (submissionId: number) => {
    console.log('Viewing submission:', submissionId);
    // Handle view submission logic
  };

  const handleGradeNow = (submissionId: number) => {
    console.log('Grading submission:', submissionId);
    // Handle grading logic
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
          name={teacherData.name} 
          role={teacherData.role} 
          searchPlaceholder="Search submissions..." 
          onSearch={(query) => console.log('Search:', query)} 
        />
        
        <div className="submissions-root">
          {/* Header Section */}
          <div className="submissions-header">
            <div className="submissions-title">
              <h1>👤 Student Submissions</h1>
              <p>Review and grade student work</p>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="submissions-controls">
            <div className="search-section">
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by student, assignment or class..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            <div className="filter-section">
              {filters.map((filter) => (
                <button
                  key={filter}
                  className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Submissions Grid */}
          <div className="submissions-grid">
            {filteredSubmissions.map((submission) => (
              <div key={submission.id} className="submission-card">
                <div className="submission-header">
                  <div className="submission-status">
                    <span className={`status-badge status-${getStatusColor(submission.status).toLowerCase()}`}>
                      {getStatusIcon(submission.status)} {submission.status}
                    </span>
                  </div>
                  {submission.score && (
                    <div className="submission-score">
                      Score: <span className="score-value">{submission.score}</span>
                    </div>
                  )}
                </div>
                
                <div className="submission-content">
                  <h3 className="assignment-title">{submission.assignment}</h3>
                  <div className="submission-details">
                    <div className="detail-item">
                      <span className="detail-label">Student:</span>
                      <span className="detail-value">{submission.student}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Class:</span>
                      <span className="detail-value">{submission.class}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Submitted:</span>
                      <span className="detail-value">{submission.submitted}</span>
                    </div>
                  </div>
                </div>
                
                <div className="submission-actions">
                  {submission.actions.map((action, index) => (
                    <button
                      key={index}
                      className={`action-btn ${action === 'Grade Now' ? 'primary' : 'secondary'}`}
                      onClick={() => {
                        if (action === 'View Submission') {
                          handleViewSubmission(submission.id);
                        } else if (action === 'Grade Now') {
                          handleGradeNow(submission.id);
                        }
                      }}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredSubmissions.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No submissions found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherSubmissions; 
