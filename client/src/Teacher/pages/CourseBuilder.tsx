"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TeacherSidebarDemo from "../components/TeacherSidebar";
import NewHeader from "../components/NewHeader";
import SessionManager from "@/utils/sessionManager";

const CourseBuilderPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [existingCourseId, setExistingCourseId] = useState(null);
  const [currentCourseId, setCurrentCourseId] = useState(null); // Add this for course-specific operations

  // Get course info from URL params
  const searchParams = new URLSearchParams(window.location.search);
  const selectedSubject = searchParams.get('subject') || '';
  const selectedClass = searchParams.get('class') || '';
  const selectedBoard = searchParams.get('board') || '';

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
  const [showInputModal, setShowInputModal] = useState(false);
  const [inputType, setInputType] = useState(""); // 'chapter', 'lesson'
  const [inputValue, setInputValue] = useState("");
  const [availableChapters, setAvailableChapters] = useState([]);
  const [availableLessons, setAvailableLessons] = useState([]);
  const [useExisting, setUseExisting] = useState(false);
  const [currentPath, setCurrentPath] = useState({ chapterIndex: null, lessonIndex: null });
  const [selectedContentType, setSelectedContentType] = useState("");
  const [contentFile, setContentFile] = useState(null);
  const [contentTitle, setContentTitle] = useState("");
  const [contentDescription, setContentDescription] = useState("");
  const [contentUrl, setContentUrl] = useState("");
  const [uploadMethod, setUploadMethod] = useState("file"); // "file" or "url"
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editUseExisting, setEditUseExisting] = useState(false);
  const [editAvailableOptions, setEditAvailableOptions] = useState([]);
  const [editContentType, setEditContentType] = useState("");
  const [editContentDescription, setEditContentDescription] = useState("");
  const [editContentUrl, setEditContentUrl] = useState("");
  const [editContentId, setEditContentId] = useState(null);

  // Load existing course structure on component mount
  useEffect(() => {
    const loadExistingCourse = async () => {
      setLoadingExisting(true);
      try {
        // Clear existing state first
        setCourseStructure({ chapters: [] });

        console.log('Course parameters:', { selectedBoard, selectedClass, selectedSubject });

        // Find or create course for this subject/class/board combination
        const session = JSON.parse(localStorage.getItem('eduyata_user_session') || '{}');
        const teacherId = session.id;

        if (teacherId) {
          const response = await fetch(`http://localhost:8001/api/courses/get_teacher_courses/?teacher_id=${teacherId}`);
          if (response.ok) {
            const data = await response.json();
            const existingCourse = data.data?.find(course =>
              course.category.includes(selectedBoard) &&
              course.category.includes(selectedClass) &&
              course.category.includes(selectedSubject)
            );

            if (existingCourse) {
              setCurrentCourseId(existingCourse.id);
              console.log('Found existing course ID:', existingCourse.id);

              // Load course-specific chapters and lessons
              const chaptersResponse = await fetch(`http://localhost:8001/api/courses/get_chapters/?course_id=${existingCourse.course_id}`);
              if (chaptersResponse.ok) {
                const chaptersData = await chaptersResponse.json();
                if (chaptersData.status === 'success' && chaptersData.data.length > 0) {
                  // Load lessons for each chapter
                  const chaptersWithLessons = [];

                  for (const chapter of chaptersData.data) {
                    const lessonsResponse = await fetch(`http://localhost:8001/api/courses/get_lessons/?chapter_id=${chapter.id}`);
                    let lessons = [];

                    if (lessonsResponse.ok) {
                      const lessonsData = await lessonsResponse.json();
                      if (lessonsData.status === 'success') {
                        // Load lessons with their contents
                        for (const lesson of lessonsData.data) {
                          // Load lesson contents
                          const contentsResponse = await fetch(`http://localhost:8001/api/courses/lesson-contents/?lesson_id=${lesson.id}`);
                          let contents = [];

                          if (contentsResponse.ok) {
                            const contentsData = await contentsResponse.json();
                            if (contentsData.status === 'success') {
                              contents = contentsData.data.map(content => ({
                                id: content.id,
                                type: content.content_type,
                                title: content.title,
                                description: content.description,
                                file_url: content.file_url
                              }));
                            }
                          }

                          lessons.push({
                            id: lesson.id,
                            name: lesson.title,
                            contents: contents
                          });
                        }
                      }
                    }

                    chaptersWithLessons.push({
                      id: chapter.id,
                      name: chapter.title,
                      lessons: lessons
                    });
                  }

                  setCourseStructure({ chapters: chaptersWithLessons });
                  console.log('Loaded course-specific structure:', chaptersWithLessons);
                }
              }
            } else {
              // No existing course found, create one
              console.log('No existing course found, creating new course...');
              const courseData = {
                description: `Complete course for ${selectedSubject} - ${selectedBoard} Class ${selectedClass}`,
                instructor_id: teacherId,
                board: selectedBoard,
                class_level: selectedClass,
                subject: selectedSubject,
                chapter: 'Introduction',
                lesson: 'Getting Started',
                topic: `${selectedSubject} Fundamentals`,
                level: 'beginner',
                duration_hours: 1
              };

              const createResponse = await fetch('http://localhost:8001/api/courses/add_course/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(courseData),
              });

              if (createResponse.ok) {
                const result = await createResponse.json();
                setCurrentCourseId(result.data.id);
                console.log('Created new course with ID:', result.data.id);
                setMessage('New course created! You can now add chapters and lessons.');
              } else {
                console.error('Failed to create course');
                setMessage('Error: Failed to create course');
              }
            }
          }
        }

      } catch (error) {
        console.error('Error loading existing course structure:', error);
      } finally {
        setLoadingExisting(false);
      }
    };

    loadExistingCourse();
  }, [selectedBoard, selectedClass, selectedSubject]);

  const handleEdit = async (type, chapterIndex, lessonIndex = null, contentIndex = null) => {
    let currentValue = "";
    if (type === 'chapter') {
      currentValue = courseStructure.chapters[chapterIndex].name;
      // Fetch available chapters
      try {
        const response = await fetch(`http://localhost:8001/api/auth/chapters/${encodeURIComponent(selectedBoard)}/${encodeURIComponent(selectedClass)}/${encodeURIComponent(selectedSubject)}/`);
        if (response.ok) {
          const data = await response.json();
          setEditAvailableOptions(data.chapters || []);
        }
      } catch (error) {
        console.error('Error fetching chapters:', error);
        setEditAvailableOptions([]);
      }
    } else if (type === 'lesson') {
      currentValue = courseStructure.chapters[chapterIndex].lessons[lessonIndex].name;
      const chapterName = courseStructure.chapters[chapterIndex].name;
      // Fetch available lessons
      try {
        const response = await fetch(`http://localhost:8001/api/auth/lessons/${encodeURIComponent(selectedBoard)}/${encodeURIComponent(selectedClass)}/${encodeURIComponent(selectedSubject)}/${encodeURIComponent(chapterName)}/`);
        if (response.ok) {
          const data = await response.json();
          setEditAvailableOptions(data.lessons || []);
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
        setEditAvailableOptions([]);
      }
    } else if (type === 'content') {
      const content = courseStructure.chapters[chapterIndex].lessons[lessonIndex].contents[contentIndex];
      currentValue = content.title;
      setEditContentType(content.type);
      setEditContentDescription(content.description || "");
      setEditContentUrl(content.file_url || "");
      setEditContentId(content.id || null);
      // For content, we'll allow editing of title, description, and content type
      setEditAvailableOptions(['VIDEO', 'PDF', 'PPT', 'DOC', 'AUDIO', 'ASSESSMENT']);
    }

    setEditMode({ type, chapterIndex, lessonIndex, contentIndex });
    setEditValue(currentValue);
    setEditUseExisting(false);
  };

  const handleEditSave = async () => {
    if (!editValue.trim()) return;

    try {
      // Handle API update for chapters, lessons, and content
      if (editMode.type === 'chapter') {
        const chapterId = courseStructure.chapters[editMode.chapterIndex].id;
        if (chapterId) {
          await fetch(`http://localhost:8001/api/courses/update_chapter/${chapterId}/`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: editValue
            }),
          });
        }
      } else if (editMode.type === 'lesson') {
        const lessonId = courseStructure.chapters[editMode.chapterIndex].lessons[editMode.lessonIndex].id;
        if (lessonId) {
          await fetch(`http://localhost:8001/api/courses/update_lesson/${lessonId}/`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: editValue
            }),
          });
        }
      } else if (editMode.type === 'content' && editContentId) {
        await fetch(`http://localhost:8001/api/courses/lesson-contents/${editContentId}/update/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: editValue,
            content_type: editContentType,
            description: editContentDescription,
            file_url: editContentUrl
          }),
        });
      }
    } catch (error) {
      console.error('Error updating:', error);
      setMessage('Error: Failed to update. Please try again.');
      return;
    }

    setCourseStructure(prev => {
      const newStructure = { ...prev };

      if (editMode.type === 'chapter') {
        newStructure.chapters[editMode.chapterIndex].name = editValue;
      } else if (editMode.type === 'lesson') {
        newStructure.chapters[editMode.chapterIndex].lessons[editMode.lessonIndex].name = editValue;
      } else if (editMode.type === 'content') {
        newStructure.chapters[editMode.chapterIndex].lessons[editMode.lessonIndex].contents[editMode.contentIndex] = {
          ...newStructure.chapters[editMode.chapterIndex].lessons[editMode.lessonIndex].contents[editMode.contentIndex],
          title: editValue,
          type: editContentType,
          description: editContentDescription,
          file_url: editContentUrl
        };
      }

      return newStructure;
    });

    setEditMode(null);
    setEditValue("");
    setEditUseExisting(false);
    setEditAvailableOptions([]);
    setEditContentType("");
    setEditContentDescription("");
    setEditContentUrl("");
    setEditContentId(null);
  };

  const addChapter = async () => {
    // Fetch existing chapters
    try {
      const response = await fetch(`http://localhost:8001/api/auth/chapters/${encodeURIComponent(selectedBoard)}/${encodeURIComponent(selectedClass)}/${encodeURIComponent(selectedSubject)}/`);
      if (response.ok) {
        const data = await response.json();
        setAvailableChapters(data.chapters || []);
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
      setAvailableChapters([]);
    }

    setInputType("chapter");
    setInputValue("");
    setUseExisting(false);
    setShowInputModal(true);
  };

  const addLesson = async (chapterIndex) => {
    const chapterName = courseStructure.chapters[chapterIndex].name;

    // Fetch existing lessons for this chapter
    try {
      const response = await fetch(`http://localhost:8001/api/auth/lessons/${encodeURIComponent(selectedBoard)}/${encodeURIComponent(selectedClass)}/${encodeURIComponent(selectedSubject)}/${encodeURIComponent(chapterName)}/`);
      if (response.ok) {
        const data = await response.json();
        setAvailableLessons(data.lessons || []);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
      setAvailableLessons([]);
    }

    setInputType("lesson");
    setInputValue("");
    setUseExisting(false);
    setCurrentPath({ chapterIndex, lessonIndex: null });
    setShowInputModal(true);
  };

  const handleInputSubmit = async () => {
    if (!inputValue.trim()) return;

    if (inputType === "chapter") {
      try {
        // Call backend API to save chapter to database with course_id
        const response = await fetch("http://localhost:8001/api/courses/add_chapter/", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: inputValue,
            course_id: `COURSE${String(currentCourseId).padStart(4, '0')}` // Convert to COURSE0001 format
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Chapter saved to database:', result);

          // Update local state with the actual chapter ID from database
          setCourseStructure(prev => ({
            ...prev,
            chapters: [...prev.chapters, {
              id: result.data.id, // Store the actual database ID
              name: inputValue,
              lessons: []
            }]
          }));
        } else {
          console.error('Failed to save chapter to database');
          setMessage('Error: Failed to save chapter');
        }
      } catch (error) {
        console.error('Error saving chapter:', error);
        setMessage('Error: Failed to save chapter');
      }
    } else if (inputType === "lesson") {
      try {
        // Get the actual chapter ID from the chapter object
        const chapterId = courseStructure.chapters[currentPath.chapterIndex].id;

        if (!chapterId) {
          setMessage('Error: Chapter ID not found. Please refresh and try again.');
          return;
        }

        // Call backend API to save lesson to database with course_id
        const response = await fetch("http://localhost:8001/api/courses/add_lesson/", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chapter_id: chapterId,
            title: inputValue,
            course_id: `COURSE${String(currentCourseId).padStart(4, '0')}` // Convert to COURSE0001 format
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Lesson saved to database:', result);

          // Update local state
          setCourseStructure(prev => {
            const newStructure = { ...prev };
            newStructure.chapters[currentPath.chapterIndex].lessons.push({
              id: result.data.id,
              name: inputValue,
              contents: []
            });
            return newStructure;
          });
        } else {
          console.error('Failed to save lesson to database');
          setMessage('Error: Failed to save lesson');
        }
      } catch (error) {
        console.error('Error saving lesson:', error);
        setMessage('Error: Failed to save lesson');
      }
    }

    setShowInputModal(false);
    setInputValue("");
  };

  const addContent = (chapterIndex, lessonIndex) => {
    setCurrentPath({ chapterIndex, lessonIndex });
    setShowContentModal(true);
  };

  const handleContentTypeSelect = (contentType) => {
    setSelectedContentType(contentType);
    setContentTitle("");
    setContentDescription("");
    setContentFile(null);
    setContentUrl("");
    setUploadMethod("file");
    setShowUploadForm(true);
    setShowContentModal(false);
  };

  const handleContentUpload = async () => {
    if (!contentTitle.trim()) return;
    if (uploadMethod === "file" && !contentFile) return;
    if (uploadMethod === "url" && !contentUrl.trim()) return;

    try {
      // Get the lesson ID from the current path
      const lessonId = courseStructure.chapters[currentPath.chapterIndex].lessons[currentPath.lessonIndex].id;

      if (!lessonId) {
        setMessage('Error: Lesson ID not found. Please refresh and try again.');
        return;
      }

      // Prepare the content data
      const contentData = {
        lesson_id: lessonId,
        title: contentTitle,
        description: contentDescription,
        content_type: selectedContentType,
        file_url: uploadMethod === "url" ? contentUrl : (contentFile ? contentFile.name : "")
      };

      console.log('Saving lesson content:', contentData);

      // Call backend API to save lesson content
      const response = await fetch("http://localhost:8001/api/courses/lesson-contents/create/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contentData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Lesson content saved to database:', result);

        // Update local state with the saved content
        setCourseStructure(prev => {
          const newStructure = { ...prev };
          newStructure.chapters[currentPath.chapterIndex].lessons[currentPath.lessonIndex].contents.push({
            id: result.data.id,
            type: selectedContentType,
            title: contentTitle,
            description: contentDescription,
            file: uploadMethod === "file" ? contentFile : null,
            file_url: uploadMethod === "url" ? contentUrl : (contentFile ? URL.createObjectURL(contentFile) : "")
          });
          return newStructure;
        });

        setMessage('Content added successfully!');
      } else {
        console.error('Failed to save lesson content to database');
        setMessage('Error: Failed to save content');
      }
    } catch (error) {
      console.error('Error saving lesson content:', error);
      setMessage('Error: Failed to save content');
    }

    setShowUploadForm(false);
    setSelectedContentType("");
    setContentTitle("");
    setContentDescription("");
    setContentFile(null);
    setContentUrl("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      const session = JSON.parse(localStorage.getItem('eduyata_user_session') || '{}');
      const teacherId = session.id;

      // Check if teacher already has a course for this subject/class/board combination
      const response = await fetch(`http://localhost:8001/api/courses/get_teacher_courses/?teacher_id=${teacherId}`);
      if (response.ok) {
        const data = await response.json();
        const existingCourse = data.data?.find(course =>
          course.category.includes(selectedBoard) &&
          course.category.includes(selectedClass) &&
          course.category.includes(selectedSubject)
        );

        if (existingCourse) {
          setMessage('Course updated successfully!');
          setLoading(false);
          return;
        }
      }

      // Only create new course if none exists
      const courseData = {
        description: `Complete course for ${selectedSubject} - ${selectedBoard} Class ${selectedClass}`,
        instructor_id: teacherId,
        board: selectedBoard,
        class_level: selectedClass,
        subject: selectedSubject,
        chapter: courseStructure.chapters[0]?.name || 'General',
        lesson: courseStructure.chapters[0]?.lessons[0]?.name || 'Introduction',
        topic: `${selectedSubject} Fundamentals`,
        level: 'beginner',
        duration_hours: Math.max(1, courseStructure.chapters.length)
      };

      const courseResponse = await fetch("http://localhost:8001/api/courses/add_course/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (courseResponse.ok) {
        setMessage("Course structure created successfully!");
      } else {
        const errorData = await courseResponse.json();
        setMessage(`Error: ${errorData.message || "Failed to create course"}`);
      }

      setTimeout(() => {
        window.location.href = '/teacher-dashboard';
      }, 2000);
    } catch (err) {
      console.error('Error:', err);
      setMessage("Error: Unable to save course");
    } finally {
      setLoading(false);
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
          {loadingExisting ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">Loading existing course data...</div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <button
                  onClick={() => window.history.back()}
                  className="text-blue-500 hover:text-blue-700 mb-4"
                >
                  ← Back to Course Selection
                </button>
                <h1 className="text-3xl font-bold text-gray-800">Build Course Structure</h1>
                <p className="text-gray-600 mt-2">
                  {selectedBoard} • Class {selectedClass} • {selectedSubject}
                </p>
              </div>

              {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.includes("successfully") ? "bg-green-100 border border-green-400 text-green-700" : "bg-red-100 border border-red-400 text-red-700"}`}>
                  {message}
                </div>
              )}

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Course Structure</h2>
                  <button
                    onClick={addChapter}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    + Add Chapter
                  </button>
                </div>

                <div className="space-y-4">
                  {courseStructure.chapters.map((chapter, chapterIndex) => (
                    <div key={chapterIndex} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                          📚 Chapter {chapterIndex + 1}: {chapter.name}
                          <button
                            onClick={() => handleEdit('chapter', chapterIndex)}
                            className="text-blue-500 hover:text-blue-700 text-sm"
                            title="Edit chapter name"
                          >
                            ✏️
                          </button>
                        </h3>
                        <button
                          onClick={() => addLesson(chapterIndex)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
                        >
                          + Add Lesson
                        </button>
                      </div>

                      <div className="ml-6 space-y-3">
                        {chapter.lessons.map((lesson, lessonIndex) => (
                          <div key={lessonIndex} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-gray-700 flex items-center gap-2">
                                📖 Lesson {lessonIndex + 1}: {lesson.name}
                                <button
                                  onClick={() => handleEdit('lesson', chapterIndex, lessonIndex)}
                                  className="text-blue-500 hover:text-blue-700 text-sm"
                                  title="Edit lesson name"
                                >
                                  ✏️
                                </button>
                              </h4>
                              <button
                                onClick={() => addContent(chapterIndex, lessonIndex)}
                                className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition"
                              >
                                + Add Content
                              </button>
                            </div>

                            <div className="ml-6 space-y-1">
                              {lesson.contents.map((content, contentIndex) => (
                                <div key={contentIndex} className="flex items-center justify-between text-sm text-gray-600 bg-white p-2 rounded border">
                                  <div className="flex items-center space-x-2">
                                    <span>
                                      {content.type === 'VIDEO' && '🎥'}
                                      {content.type === 'PDF' && '📄'}
                                      {content.type === 'PPT' && '📊'}
                                      {content.type === 'DOC' && '📝'}
                                      {content.type === 'AUDIO' && '🎵'}
                                      {content.type === 'ASSESSMENT' && '📝'}
                                    </span>
                                    <span className="font-medium">{content.title}</span>
                                    <button
                                      onClick={() => handleEdit('content', chapterIndex, lessonIndex, contentIndex)}
                                      className="text-blue-500 hover:text-blue-700 text-xs"
                                      title="Edit content title"
                                    >
                                      ✏️
                                    </button>
                                  </div>
                                  <span className="text-xs text-gray-400">{content.type}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {courseStructure.chapters.length > 0 && (
                  <button
                    onClick={handleSubmit}
                    disabled={loading || courseStructure.chapters.length === 0}
                    className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-lg font-semibold shadow-lg hover:from-blue-600 hover:to-indigo-700 transition text-lg disabled:opacity-50"
                  >
                    {loading ? "Saving Content..." : courseStructure.chapters.length > 0 ? "Update Course Structure" : "Create Course Structure"}
                  </button>
                )}
              </div>

              {/* Edit Modal */}
              {editMode && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Edit {editMode.type === 'chapter' ? 'Chapter' : editMode.type === 'lesson' ? 'Lesson' : 'Content'} Name
                      </h3>
                      <button
                        onClick={() => setEditMode(null)}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                      >
                        ×
                      </button>
                    </div>

                    {(editMode.type === "chapter" || editMode.type === "lesson") && (
                      <div className="mb-4">
                        <div className="flex space-x-4 mb-3">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={!editUseExisting}
                              onChange={() => setEditUseExisting(false)}
                              className="mr-2"
                            />
                            Custom Name
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={editUseExisting}
                              onChange={() => setEditUseExisting(true)}
                              className="mr-2"
                            />
                            Select Existing
                          </label>
                        </div>
                      </div>
                    )}

                    {editUseExisting && (editMode.type === "chapter" || editMode.type === "lesson") ? (
                      <select
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      >
                        <option value="">Select {editMode.type}...</option>
                        {editAvailableOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : editMode.type === 'content' ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            placeholder="Enter content title..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
                          <select
                            value={editContentType}
                            onChange={(e) => setEditContentType(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          >
                            {editAvailableOptions.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={editContentDescription}
                            onChange={(e) => setEditContentDescription(e.target.value)}
                            placeholder="Enter description..."
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                          <input
                            type="url"
                            value={editContentUrl}
                            onChange={(e) => setEditContentUrl(e.target.value)}
                            placeholder="Enter content URL..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder={`Enter ${editMode.type} name...`}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        onKeyPress={(e) => e.key === 'Enter' && handleEditSave()}
                        autoFocus
                      />
                    )}

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setEditMode(null)}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleEditSave}
                        disabled={!editValue.trim()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Upload Form */}
              {showUploadForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Upload {selectedContentType}
                      </h3>
                      <button
                        onClick={() => setShowUploadForm(false)}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                      >
                        ×
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                        <input
                          type="text"
                          value={contentTitle}
                          onChange={(e) => setContentTitle(e.target.value)}
                          placeholder="Enter content title..."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={contentDescription}
                          onChange={(e) => setContentDescription(e.target.value)}
                          placeholder="Enter description..."
                          rows={3}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Method</label>
                        <div className="flex space-x-4 mb-3">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={uploadMethod === "file"}
                              onChange={() => setUploadMethod("file")}
                              className="mr-2"
                            />
                            Upload File
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={uploadMethod === "url"}
                              onChange={() => setUploadMethod("url")}
                              className="mr-2"
                            />
                            Enter URL
                          </label>
                        </div>
                      </div>

                      {uploadMethod === "file" ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">File *</label>
                          <input
                            type="file"
                            onChange={(e) => setContentFile(e.target.files?.[0] || null)}
                            accept={
                              selectedContentType === 'VIDEO' ? '.mp4,.avi,.mov,.mkv' :
                                selectedContentType === 'PDF' ? '.pdf' :
                                  selectedContentType === 'PPT' ? '.ppt,.pptx' :
                                    selectedContentType === 'DOC' ? '.doc,.docx' :
                                      selectedContentType === 'AUDIO' ? '.mp3,.wav,.m4a' :
                                        selectedContentType === 'ASSESSMENT' ? '.pdf' : '*'
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
                          <input
                            type="url"
                            value={contentUrl}
                            onChange={(e) => setContentUrl(e.target.value)}
                            placeholder={`Enter ${selectedContentType.toLowerCase()} URL...`}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        onClick={() => setShowUploadForm(false)}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleContentUpload}
                        disabled={!contentTitle.trim() || (uploadMethod === "file" && !contentFile) || (uploadMethod === "url" && !contentUrl.trim())}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {showInputModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {inputType === "chapter" && "Add Chapter"}
                        {inputType === "lesson" && "Add Lesson"}
                        {inputType === "content" && "Add Content Name"}
                      </h3>
                      <button
                        onClick={() => setShowInputModal(false)}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                      >
                        ×
                      </button>
                    </div>

                    {(inputType === "chapter" || inputType === "lesson") && (
                      <div className="mb-4">
                        <div className="flex space-x-4 mb-3">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={!useExisting}
                              onChange={() => setUseExisting(false)}
                              className="mr-2"
                            />
                            Create New
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={useExisting}
                              onChange={() => setUseExisting(true)}
                              className="mr-2"
                            />
                            Use Existing
                          </label>
                        </div>
                      </div>
                    )}

                    {useExisting ? (
                      <select
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      >
                        <option value="">Select {inputType}...</option>
                        {inputType === "chapter" && availableChapters.map(chapter => (
                          <option key={chapter} value={chapter}>{chapter}</option>
                        ))}
                        {inputType === "lesson" && availableLessons.map(lesson => (
                          <option key={lesson} value={lesson}>{lesson}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={`Enter ${inputType} name...`}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
                        autoFocus
                      />
                    )}

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowInputModal(false)}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleInputSubmit}
                        disabled={!inputValue.trim()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {showContentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Select Content Type</h3>
                      <button
                        onClick={() => setShowContentModal(false)}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                      >
                        ×
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {['VIDEO', 'PDF', 'PPT', 'DOC', 'AUDIO', 'ASSESSMENT'].map(type => (
                        <button
                          key={type}
                          onClick={() => handleContentTypeSelect(type)}
                          className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition text-center"
                        >
                          <div className="text-2xl mb-2">
                            {type === 'VIDEO' && '🎥'}
                            {type === 'PDF' && '📄'}
                            {type === 'PPT' && '📊'}
                            {type === 'DOC' && '📝'}
                            {type === 'AUDIO' && '🎵'}
                            {type === 'ASSESSMENT' && '📝'}
                          </div>
                          <div className="text-sm font-medium">{type}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseBuilderPage;