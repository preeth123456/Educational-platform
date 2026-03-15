import React, { useState } from "react";
import NewHeader from "@/components/NewHeader";
import { TeacherSidebarDemo } from "@/components/TeacherSidebar";
import "../Dashboard.css";
import "./TeacherClasses.css";

const TeacherClasses: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock data for teacher
  const teacherData = {
    name: "Ms. Priya Sharma",
    role: "Teacher",
    department: "Computer Science",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  };

  const classes = [
    {
      id: 1,
      code: "CS101",
      title: "Introduction to Programming",
      students: 45,
      progress: 65,
      schedule: "Monday, Wednesday 08:30-10:00",
      location: "Lab 102",
      color: "linear-gradient(135deg, hsl(262, 83%, 75%) 0%, hsl(262, 83%, 68%) 100%)"
    },
    {
      id: 2,
      code: "CS201",
      title: "Data Structures",
      students: 38,
      progress: 48,
      schedule: "Tuesday, Thursday 13:00-14:30",
      location: "Lab 104",
      color: "linear-gradient(135deg, hsl(262, 83%, 75%) 0%, hsl(262, 83%, 68%) 100%)"
    },
    {
      id: 3,
      code: "CS304",
      title: "Web Development",
      students: 42,
      progress: 70,
      schedule: "Monday, Wednesday 10:15-11:45",
      location: "Room 205",
      color: "linear-gradient(135deg, hsl(262, 83%, 75%) 0%, hsl(262, 83%, 68%) 100%)"
    },
    {
      id: 4,
      code: "CS105",
      title: "Python Programming",
      students: 50,
      progress: 35,
      schedule: "Tuesday, Thursday 15:00-16:30",
      location: "Room 201",
      color: "linear-gradient(135deg, hsl(262, 83%, 75%) 0%, hsl(262, 83%, 68%) 100%)"
    }
  ];

  const handleViewClass = (classId: number) => {
    console.log('Viewing class:', classId);
    // Handle view class logic
  };

  const handleManageClass = (classId: number) => {
    console.log('Managing class:', classId);
    // Handle manage class logic
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
          searchPlaceholder="Search classes..." 
          onSearch={(query) => console.log('Search:', query)} 
        />
        
        <div className="classes-root">
          {/* Header Section */}
          <div className="classes-header">
            <div className="classes-title">
              <h1>📁 My Classes</h1>
              <p>Manage your course sections and student groups</p>
            </div>
          </div>

          {/* Classes Grid */}
          <div className="classes-grid">
            {classes.map((classItem) => (
              <div key={classItem.id} className="class-card">
                {/* Class Header with Progress */}
                <div className="class-header" style={{ background: classItem.color }}>
                  <div className="class-code">{classItem.code}</div>
                  <div className="class-progress">
                    <svg width="32" height="32" viewBox="0 0 32 32">
                      <circle
                        cx="16"
                        cy="16"
                        r="12"
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth="2.5"
                        fill="none"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r="12"
                        stroke="white"
                        strokeWidth="2.5"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 12}`}
                        strokeDashoffset={`${2 * Math.PI * 12 * (1 - classItem.progress / 100)}`}
                        strokeLinecap="round"
                        transform="rotate(-90 16 16)"
                      />
                      <text
                        x="16"
                        y="16"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="8"
                        fontWeight="600"
                      >
                        {classItem.progress}%
                      </text>
                    </svg>
                  </div>
                </div>

                {/* Class Content */}
                <div className="class-content">
                  <h3 className="class-title">{classItem.title}</h3>
                  
                  <div className="class-details">
                    <div className="detail-item">
                      <span className="detail-icon">👥</span>
                      <span className="detail-text">{classItem.students} students</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span className="detail-text">{classItem.schedule}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📚</span>
                      <span className="detail-text">{classItem.location}</span>
                    </div>
                  </div>
                </div>

                {/* Class Actions */}
                <div className="class-actions">
                  <button
                    className="action-btn primary"
                    onClick={() => handleViewClass(classItem.id)}
                  >
                    View Class
                  </button>
                  <button
                    className="action-btn secondary"
                    onClick={() => handleManageClass(classItem.id)}
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {classes.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📁</div>
              <h3>No classes found</h3>
              <p>You haven't been assigned to any classes yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherClasses; 
