import React, { useState, useEffect } from "react";
import NewHeader from "../components/NewHeader";
import { TeacherSidebarDemo } from "../components/TeacherSidebar";
import CreateEndorsement from "../CreateEndorsement";
import SessionManager from "../../utils/sessionManager";
import "./TeacherStudents.css";

interface Student {
  id: number;
  name: string;
  class: string;
  board: string;
  mobile: string;
  profile_picture?: string;
  created_at?: string;
}

const TeacherStudents: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEndorsementModal, setShowEndorsementModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const session = SessionManager.getSession();
  const teacherData = {
    name: session?.name || "Teacher",
    role: "Teacher",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/auth/students/all/');
      const data = await response.json();

      if (data.status === 'success') {
        setStudents(data.data.students);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndorseStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowEndorsementModal(true);
  };

  const handleEndorsementSuccess = () => {
    alert('Endorsement created successfully!');
    setShowEndorsementModal(false);
    setSelectedStudent(null);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.board.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff&size=50`;
  };

  return (
    <div className="dashboard-container">
      <TeacherSidebarDemo open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="dashboard-main" style={{ marginLeft: sidebarOpen ? "250px" : "60px" }}>
        <NewHeader
          avatar={teacherData.avatar}
          name={teacherData.name}
          role={teacherData.role}
          teacherId={session?.id}
          searchPlaceholder="Search students..."
        />

        <div className="students-page">
          <div className="page-header">
            <h1>👥 Student Management</h1>
            <p>Manage and endorse your students for their skills and achievements</p>
          </div>

          <div className="students-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search students by name, class, or board..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="students-count">
              {filteredStudents.length} of {students.length} students
            </div>
          </div>

          <div className="students-container">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading students...</p>
              </div>
            ) : filteredStudents.length > 0 ? (
              <div className="students-grid">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="student-card">
                    <div className="student-avatar">
                      <img
                        src={student.profile_picture || getAvatarUrl(student.name)}
                        alt={student.name}
                      />
                    </div>
                    <div className="student-info">
                      <h3>{student.name}</h3>
                      <p className="student-class">{student.class} - {student.board}</p>
                      <p className="student-mobile">📱 {student.mobile}</p>
                      {student.created_at && (
                        <p className="student-joined">
                          Joined: {new Date(student.created_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <button
                      className="endorse-btn"
                      onClick={() => handleEndorseStudent(student)}
                    >
                      🏆 Endorse Skill
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-students">
                <div className="no-students-icon">👥</div>
                <h3>No students found</h3>
                <p>
                  {searchTerm
                    ? `No students match "${searchTerm}"`
                    : "No students registered yet"
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        <CreateEndorsement
          isOpen={showEndorsementModal}
          onClose={() => setShowEndorsementModal(false)}
          onSuccess={handleEndorsementSuccess}
          teacherId={session?.id || 0}
          preSelectedStudent={selectedStudent}
        />
      </div>
    </div>
  );
};

export default TeacherStudents;