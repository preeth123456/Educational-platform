"use client";

import React, { useState, useEffect } from "react";
import TeacherSidebarDemo from "../components/TeacherSidebar";
import NewHeader from "../components/NewHeader";
import SessionManager from "@/utils/sessionManager";

const CreateCoursePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [subjectClassMap, setSubjectClassMap] = useState({});
  const [teacherBoards, setTeacherBoards] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedBoard, setSelectedBoard] = useState("");
  const [availableChapters, setAvailableChapters] = useState([]);
  const [availableLessons, setAvailableLessons] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const session = SessionManager.getSession();
  const teacherData = {
    name: session?.name || "Teacher",
    role: "Teacher",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  };

  const [courseStructure, setCourseStructure] = useState({
    chapters: []
  });
  const [showContentModal, setShowContentModal] = useState(false);
  const [currentPath, setCurrentPath] = useState({ chapterIndex: null, lessonIndex: null });

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('eduyata_user_session') || '{}');
    if (!session.id || session.role !== 'teacher') {
      setMessage("You must be logged in as a teacher to create a course.");
      return;
    }
    fetchTeacherData(session.id);
  }, []);

  const fetchTeacherData = async (teacherId) => {
    try {
      // Use the existing teacher_scope endpoint that works
      const response = await fetch(`http://localhost:8001/api/auth/teacher_scope/${teacherId}/`);
      const data = await response.json();

      if (response.ok) {
        // Create subject_classes map from the available data
        const subjects = data.teacher_scope.subjects || [];
        const classes = data.teacher_scope.classes_taught || [];
        const boards = data.teacher_scope.boards || [];

        // Create a simple mapping where each subject can teach all available classes
        const subjectClassMapping = {};
        subjects.forEach(subject => {
          subjectClassMapping[subject] = classes;
        });

        setSubjectClassMap(subjectClassMapping);
        setTeacherBoards(boards);
      } else {
        setMessage("Error fetching teacher data");
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage("Error connecting to server");
    }
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setSelectedClass("");
    setSelectedBoard("");
    setAvailableChapters([]);
    setAvailableLessons([]);
    setShowPopup(true);
  };

  const handleClassSelect = (classLevel) => {
    setSelectedClass(classLevel);
    setSelectedBoard("");
    setAvailableChapters([]);
    setAvailableLessons([]);
  };

  const handleBoardSelect = async (board) => {
    setSelectedBoard(board);
    setAvailableChapters([]);
    setAvailableLessons([]);
    setShowPopup(false);

    // Navigate to course builder page with parameters
    window.location.href = `/course-builder?subject=${encodeURIComponent(selectedSubject)}&class=${encodeURIComponent(selectedClass)}&board=${encodeURIComponent(board)}`;
  };

  const handleChapterChange = async (chapter) => {
    setFormData({ ...formData, chapter, lesson: "", topic: "" });
    setAvailableLessons([]);

    if (selectedBoard && selectedClass && selectedSubject && chapter) {
      try {
        const response = await fetch(`http://localhost:8001/api/auth/lessons/${encodeURIComponent(selectedBoard)}/${encodeURIComponent(selectedClass)}/${encodeURIComponent(selectedSubject)}/${encodeURIComponent(chapter)}/`);
        if (response.ok) {
          const data = await response.json();
          setAvailableLessons(data.lessons || []);
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    }
  };





  const sidebarWidth = sidebarOpen ? 250 : 60;

  return (
    <div className="flex">
      <TeacherSidebarDemo open={sidebarOpen} setOpen={setSidebarOpen} />

      <div style={{ marginLeft: sidebarWidth + 16, flex: 1, transition: "all 0.3s ease", minHeight: "100vh" }}>
        <div style={{ position: "fixed", top: 0, left: sidebarWidth, right: 0, zIndex: 999 }}>
          <NewHeader avatar={teacherData.avatar} name={teacherData.name} role={teacherData.role} teacherId={session?.id} />
        </div>

        <div className="p-8 pt-32 bg-gray-100 min-h-screen">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Course</h1>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${message.includes("successfully") ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
              {message}
            </div>
          )}

          {/* Subject Cards */}
          <div className="bg-white p-8 rounded-xl shadow-lg mb-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 text-xl">📚</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Select Subject</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(subjectClassMap).map(subject => (
                <div
                  key={subject}
                  onClick={() => handleSubjectSelect(subject)}
                  className={`group border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${selectedSubject === subject
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white'
                    }`}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-xl font-bold">{subject.charAt(0)}</span>
                    </div>
                    <div className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors">{subject}</div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
                      <span className="mr-2">🎓</span>
                      Classes you can teach:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {subjectClassMap[subject]?.map(cls => (
                        <span key={cls} className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium shadow-sm">
                          Class {cls}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
                      <span className="mr-2">📋</span>
                      Boards:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {teacherBoards.map(board => (
                        <span key={board} className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium shadow-sm">
                          {board}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
                      Click to create course →
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popup Modal */}
          {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Create Course for {selectedSubject}</h2>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Class Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 text-gray-800">Select Class</h3>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {subjectClassMap[selectedSubject]?.map(cls => (
                      <button
                        key={cls}
                        onClick={() => handleClassSelect(cls)}
                        className={`p-2 rounded-lg border-2 transition-all text-sm ${selectedClass === cls
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                      >
                        Class {cls}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Board Selection */}
                {selectedClass && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3 text-gray-800">Select Board</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {teacherBoards.map(board => (
                        <button
                          key={board}
                          onClick={() => handleBoardSelect(board)}
                          className="p-3 rounded-lg border-2 transition-all border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        >
                          {board}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
};

export default CreateCoursePage;