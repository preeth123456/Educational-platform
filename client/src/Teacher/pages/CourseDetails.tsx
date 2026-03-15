import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TeacherSidebarDemo from "../components/TeacherSidebar";
import NewHeader from "../components/NewHeader";
import SessionManager from "@/utils/sessionManager";

const CourseDetails = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [lessonContents, setLessonContents] = useState([]);

  // Get course ID from URL params
  const searchParams = new URLSearchParams(window.location.search);
  const courseId = searchParams.get('courseId');

  const session = SessionManager.getSession();
  const teacherData = {
    name: session?.name || "Teacher",
    role: "Teacher",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) return;

      try {
        // Fetch course details
        const teacherId = session?.id;
        const coursesResponse = await fetch(`http://localhost:8001/api/courses/get_teacher_courses/?teacher_id=${teacherId}`);
        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json();
          const foundCourse = coursesData.data?.find(c => c.id === parseInt(courseId));
          setCourse(foundCourse);
        }

        // Fetch lesson contents
        const contentsResponse = await fetch(`http://localhost:8001/api/courses/lesson-contents/?course_id=${courseId}`);
        if (contentsResponse.ok) {
          const contentsData = await contentsResponse.json();
          setLessonContents(contentsData.data || []);
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, session?.id]);

  const sidebarWidth = sidebarOpen ? 250 : 60;

  if (loading) {
    return (
      <div className="flex">
        <TeacherSidebarDemo open={sidebarOpen} setOpen={setSidebarOpen} />
        <div style={{ marginLeft: sidebarWidth + 16, flex: 1, minHeight: "100vh" }}>
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading course details...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <TeacherSidebarDemo open={sidebarOpen} setOpen={setSidebarOpen} />

      <div style={{ marginLeft: sidebarWidth + 16, flex: 1, transition: "all 0.3s ease", minHeight: "100vh" }}>
        <div style={{ position: "fixed", top: 0, left: sidebarWidth, right: 0, zIndex: 999 }}>
          <NewHeader avatar={teacherData.avatar} name={teacherData.name} role={teacherData.role} teacherId={session?.id} />
        </div>

        <div className="p-8 pt-32 bg-gray-100 min-h-screen">
          <div className="mb-6">
            <button
              onClick={() => window.history.back()}
              className="text-blue-500 hover:text-blue-700 mb-4"
            >
              ← Back to My Courses
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Course Details</h1>
            {course && (
              <p className="text-gray-600 mt-2">{course.title}</p>
            )}
          </div>

          {course && (
            <div className="bg-white p-8 rounded-xl shadow-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Information</h2>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Category:</span>
                      <span className="ml-2 text-gray-600">{course.category}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Level:</span>
                      <span className="ml-2 text-gray-600">{course.level}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Duration:</span>
                      <span className="ml-2 text-gray-600">{course.duration_hours} hours</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Students:</span>
                      <span className="ml-2 text-gray-600">{course.students_count || 0} enrolled</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600">{course.description}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Course Content</h2>

            {lessonContents.length > 0 ? (
              <div className="space-y-4">
                {lessonContents.map((content, index) => (
                  <div key={content.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">
                          {content.content_type === 'VIDEO' && '🎥'}
                          {content.content_type === 'PDF' && '📄'}
                          {content.content_type === 'PPT' && '📊'}
                          {content.content_type === 'DOC' && '📝'}
                          {content.content_type === 'AUDIO' && '🎵'}
                        </span>
                        <div>
                          <h3 className="font-semibold text-gray-800">{content.title}</h3>
                          {content.description && (
                            <p className="text-gray-600 text-sm mt-1">{content.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {content.content_type}
                        </span>
                        {content.file_url && (
                          <a
                            href={content.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 text-sm"
                          >
                            View
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No content added yet</h3>
                <p className="text-gray-600 mb-4">Start adding videos, documents, and other materials to your course</p>
                <button
                  onClick={() => window.location.href = `/course-builder?subject=${encodeURIComponent(course?.category?.split(' - ')[2] || '')}&class=${encodeURIComponent(course?.category?.split(' - ')[1] || '')}&board=${encodeURIComponent(course?.category?.split(' - ')[0] || '')}`}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Add Content
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;