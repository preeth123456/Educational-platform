import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SessionManager from '@/utils/sessionManager';

interface TeacherSubject {
  subject: string;
  classes: string[];
  boards: string[];
}

const CreateCourseForm = () => {
  const [teacherSubjects, setTeacherSubjects] = useState<TeacherSubject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [level, setLevel] = useState('beginner');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();
  const session = SessionManager.getSession();

  useEffect(() => {
    loadTeacherSubjects();
  }, []);

  useEffect(() => {
    // Auto-generate course title when selections change
    if (selectedSubject && selectedClass && selectedBoard) {
      const autoTitle = `${selectedBoard} Class ${selectedClass} ${selectedSubject}`;
      setCourseTitle(autoTitle);
      setCourseDescription(`Complete course for ${selectedSubject} - ${selectedBoard} Class ${selectedClass}`);
    }
  }, [selectedSubject, selectedClass, selectedBoard]);

  const loadTeacherSubjects = async () => {
    try {
      const response = await fetch(`http://localhost:8001/api/courses/get_teacher_lms_data/${session?.id}/`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          // Transform the data to match our interface
          const subjects: TeacherSubject[] = [];
          const teacherInfo = data.data.teacher_info;
          
          Object.entries(teacherInfo.subject_classes).forEach(([subject, classes]) => {
            subjects.push({
              subject,
              classes: classes as string[],
              boards: teacherInfo.boards
            });
          });
          
          setTeacherSubjects(subjects);
        }
      }
    } catch (error) {
      console.error('Error loading teacher subjects:', error);
    }
  };

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    setSelectedClass('');
    setSelectedBoard('');
  };

  const getAvailableClasses = () => {
    const subject = teacherSubjects.find(s => s.subject === selectedSubject);
    return subject ? subject.classes : [];
  };

  const getAvailableBoards = () => {
    const subject = teacherSubjects.find(s => s.subject === selectedSubject);
    return subject ? subject.boards : [];
  };

  const handleCreateCourse = async () => {
    if (!selectedSubject || !selectedClass || !selectedBoard || !courseTitle.trim()) {
      setMessage('Please fill all required fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Check if course already exists
      const checkResponse = await fetch(`http://localhost:8001/api/courses/get_teacher_courses/?teacher_id=${session?.id}`);
      if (checkResponse.ok) {
        const data = await checkResponse.json();
        const existingCourse = data.data?.find((course: any) => 
          course.category.includes(selectedBoard) && 
          course.category.includes(selectedClass) && 
          course.category.includes(selectedSubject)
        );
        
        if (existingCourse) {
          setMessage('Course already exists for this subject/class/board combination');
          setLoading(false);
          return;
        }
      }

      // Create new course
      const courseData = {
        description: courseDescription,
        instructor_id: session?.id,
        board: selectedBoard,
        class_level: selectedClass,
        subject: selectedSubject,
        chapter: 'Introduction',
        lesson: 'Getting Started',
        topic: `${selectedSubject} Fundamentals`,
        level: level,
        duration_hours: parseInt(duration) || 1
      };

      const response = await fetch('http://localhost:8001/api/courses/add_course/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('Course created successfully!');
        
        // Navigate to course builder
        setTimeout(() => {
          navigate(`/course-builder?subject=${selectedSubject}&class=${selectedClass}&board=${selectedBoard}`);
        }, 1500);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message || 'Failed to create course'}`);
      }
    } catch (error) {
      console.error('Error creating course:', error);
      setMessage('Error: Unable to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Course</h2>
      
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subject Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Subject *</label>
          <select
            value={selectedSubject}
            onChange={(e) => handleSubjectChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Choose a subject...</option>
            {teacherSubjects.map((subject) => (
              <option key={subject.subject} value={subject.subject}>
                {subject.subject}
              </option>
            ))}
          </select>
        </div>

        {/* Class Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Class *</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            disabled={!selectedSubject}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:bg-gray-100"
          >
            <option value="">Choose a class...</option>
            {getAvailableClasses().map((cls) => (
              <option key={cls} value={cls}>
                Class {cls}
              </option>
            ))}
          </select>
        </div>

        {/* Board Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Board *</label>
          <select
            value={selectedBoard}
            onChange={(e) => setSelectedBoard(e.target.value)}
            disabled={!selectedClass}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none disabled:bg-gray-100"
          >
            <option value="">Choose a board...</option>
            {getAvailableBoards().map((board) => (
              <option key={board} value={board}>
                {board}
              </option>
            ))}
          </select>
        </div>

        {/* Level Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Course Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Course Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
          <input
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Enter course title..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Course Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Course Description</label>
          <textarea
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            placeholder="Enter course description..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration (hours)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g., 10"
            min="1"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Course Preview */}
      {selectedSubject && selectedClass && selectedBoard && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Course Preview</h3>
          <div className="text-sm text-gray-600">
            <p><strong>Subject:</strong> {selectedSubject}</p>
            <p><strong>Class:</strong> {selectedClass}</p>
            <p><strong>Board:</strong> {selectedBoard}</p>
            <p><strong>Level:</strong> {level}</p>
            <p><strong>Title:</strong> {courseTitle}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={() => navigate('/teacher-dashboard')}
          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleCreateCourse}
          disabled={loading || !selectedSubject || !selectedClass || !selectedBoard}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Course & Build Structure'}
        </button>
      </div>
    </div>
  );
};

export default CreateCourseForm;