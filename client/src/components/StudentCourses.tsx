import React, { useState, useEffect } from 'react';
import SessionManager from '../utils/sessionManager';
import StudentVirtualClassrooms from './StudentVirtualClassrooms';

interface Course {
  id: number;
  title: string;
  category: string;
  level: string;
  instructor_name: string;
  is_enrolled: boolean;
}

interface StudentInfo {
  id: number;
  name: string;
  class_level: string;
  board: string;
}

const StudentCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');

  useEffect(() => {
    const studentSession = SessionManager.getSession();
    if (studentSession?.id) {
      fetchStudentInfo(studentSession.id);
      fetchCoursesForStudent(studentSession.id);
    }
  }, []);

  const fetchStudentInfo = async (studentId: number) => {
    try {
      const response = await fetch(`http://localhost:8001/api/auth/get_student/?student_id=${studentId}`);
      const data = await response.json();
      if (data.status === 'success') {
        setStudent(data.data);
      }
    } catch (error) {
      console.error('Error fetching student info:', error);
    }
  };

  const fetchCoursesForStudent = async (studentId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8001/api/courses/get_courses/?student_id=${studentId}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setCourses(data.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading courses...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {student && (
        <div style={{ 
          background: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px' 
        }}>
          <h2>Welcome {student.name}</h2>
          <p><strong>Class:</strong> {student.class_level} | <strong>Board:</strong> {student.board}</p>
        </div>
      )}

      <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
        <button 
          onClick={() => setActiveTab('courses')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'courses' ? '#007bff' : 'transparent',
            color: activeTab === 'courses' ? 'white' : '#007bff',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          📚 My Courses
        </button>
        <button 
          onClick={() => setActiveTab('classrooms')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'classrooms' ? '#007bff' : 'transparent',
            color: activeTab === 'classrooms' ? 'white' : '#007bff',
            cursor: 'pointer'
          }}
        >
          🏫 Virtual Classrooms
        </button>
      </div>

      {activeTab === 'courses' && (
        <div style={{ display: 'grid', gap: '15px' }}>
          {courses.map((course) => (
            <div 
              key={course.id} 
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                background: course.is_enrolled ? '#e8f5e8' : '#fff'
              }}
            >
              <h3 style={{ margin: '0 0 10px 0' }}>{course.title}</h3>
              <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#666' }}>
                <span><strong>Category:</strong> {course.category}</span>
                <span><strong>Level:</strong> {course.level}</span>
                <span><strong>Instructor:</strong> {course.instructor_name}</span>
              </div>
              {course.is_enrolled && (
                <div style={{ 
                  marginTop: '10px', 
                  padding: '5px 10px', 
                  background: '#d4edda', 
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: '#155724'
                }}>
                  ✓ Enrolled
                </div>
              )}
            </div>
          ))}
          {courses.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              No courses available for your class and board combination.
            </div>
          )}
        </div>
      )}

      {activeTab === 'classrooms' && (
        <StudentVirtualClassrooms />
      )}
    </div>
  );
};

export default StudentCourses;