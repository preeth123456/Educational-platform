import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SessionManager from "@/utils/sessionManager";
import {
  FaArrowLeft,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaBook,
  FaClock,
  FaChevronRight,
  FaChevronLeft,
  FaPlay,
  FaFileDownload,
  FaTimes,
  FaVideo,
  FaFileAlt,
  FaChartLine
} from "react-icons/fa";
import "../../pages/SubjectStyles.css";

const CourseDetails = () => {
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [lessonContents, setLessonContents] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [activeTab, setActiveTab] = useState('video');
  const [expandedChapters, setExpandedChapters] = useState({});
  const [expandedLessons, setExpandedLessons] = useState({});
  const [search, setSearch] = useState("");

  const toggleChapter = (chapterTitle) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterTitle]: !prev[chapterTitle]
    }));
  };

  const toggleLesson = (lessonTitle) => {
    setExpandedLessons(prev => ({
      ...prev,
      [lessonTitle]: !prev[lessonTitle]
    }));
  };

  // Extract chapter and lesson names from course title
  const extractNamesFromCourse = (course) => {
    if (!course?.title) return { chapterName: "Chapter 1", lessonName: "Lesson 1" };
    
    // Parse title format: "ICSE Class 7 Hindi - Chapter 1: Introduction to Hindi - Lesson 1: Introduction to Chapter 1: Introduction to Hindi - Hindi Fundamentals"
    const titleParts = course.title.split(' - ');
    
    let chapterName = "Chapter 1";
    let lessonName = "Lesson 1";
    
    // Find chapter part
    const chapterPart = titleParts.find(part => part.includes('Chapter'));
    if (chapterPart) {
      const chapterMatch = chapterPart.match(/Chapter \d+: (.+)/);
      if (chapterMatch) {
        chapterName = chapterMatch[1]; // Extract the part after "Chapter X: "
      }
    }
    
    // Find lesson part
    const lessonPart = titleParts.find(part => part.includes('Lesson'));
    if (lessonPart) {
      const lessonMatch = lessonPart.match(/Lesson \d+: (.+)/);
      if (lessonMatch) {
        lessonName = lessonMatch[1]; // Extract the part after "Lesson X: "
      }
    }
    
    return { chapterName, lessonName };
  };

  // Group lesson contents into chapters and lessons
  const organizeContent = () => {
    if (lessonContents.length === 0) return {};
    
    // Group content by chapter_title and lesson_title from API response
    const chapters = {};
    
    lessonContents.forEach(content => {
      const chapterTitle = content.chapter_title || "Chapter 1: Introduction to Hindi";
      const lessonTitle = content.lesson_title || "Lesson 1: Introduction";
      
      if (!chapters[chapterTitle]) {
        chapters[chapterTitle] = {};
      }
      if (!chapters[chapterTitle][lessonTitle]) {
        chapters[chapterTitle][lessonTitle] = [];
      }
      
      chapters[chapterTitle][lessonTitle].push(content);
    });
    
    return chapters;
  };

  // Get course ID from URL params
  const searchParams = new URLSearchParams(window.location.search);
  const courseId = searchParams.get('courseId');

  const session = SessionManager.getSession();

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
          
          // Organize content into topics structure
          if (contentsData.data && contentsData.data.length > 0) {
            setSelectedTopic("Course Content");
            setSelectedSubtopic(contentsData.data[0]?.title);
          }
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, session?.id]);

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    if (lessonContents.length > 0) {
      setSelectedSubtopic(lessonContents[0].title);
    }
  };

  const handleSubtopicClick = (subtopic) => {
    setSelectedSubtopic(subtopic);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const getCurrentContent = () => {
    return lessonContents.find(content => content.title === selectedSubtopic);
  };

  const getCurrentContentIndex = () => {
    return lessonContents.findIndex(content => content.title === selectedSubtopic);
  };

  const navigateToPrevious = () => {
    const currentIndex = getCurrentContentIndex();
    if (currentIndex > 0) {
      setSelectedSubtopic(lessonContents[currentIndex - 1].title);
    }
  };

  const navigateToNext = () => {
    const currentIndex = getCurrentContentIndex();
    if (currentIndex < lessonContents.length - 1) {
      setSelectedSubtopic(lessonContents[currentIndex + 1].title);
    }
  };

  const getEmbedUrl = (url, contentType) => {
    if (!url) return null;
    
    if (contentType === 'VIDEO') {
      // YouTube URL conversion
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      
      // Google Drive URL conversion
      if (url.includes('drive.google.com/file/d/')) {
        const fileId = url.split('/file/d/')[1]?.split('/')[0];
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
      if (url.includes('drive.google.com/open?id=')) {
        const fileId = url.split('id=')[1];
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
    
    // For PDFs and other documents
    if (url.includes('drive.google.com/file/d/')) {
      const fileId = url.split('/file/d/')[1]?.split('/')[0];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    
    return url;
  };

  const renderContentViewer = () => {
    const currentContent = getCurrentContent();
    if (!currentContent) return null;

    const embedUrl = getEmbedUrl(currentContent.file_url, currentContent.content_type);

    if (currentContent.content_type === 'VIDEO') {
      return (
        <div className="video-container">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              width="100%"
              height="400px"
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <div className="video-placeholder">
              <div className="play-button">
                <FaPlay />
              </div>
              <p>Video content: {currentContent.title}</p>
              <small>Please check if the video URL is accessible and properly shared</small>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="content-viewer">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              width="100%"
              height="400px"
              frameBorder="0"
            />
          ) : (
            <div className="content-placeholder">
              📄 {currentContent.content_type} content will be available soon
            </div>
          )}
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="subject-loading">
        <div className="spinner"></div>
        <p>Loading course content...</p>
      </div>
    );
  }

  return (
    <div className="subject-page-wrapper">
      <button className="subject-sidebar-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? <FaTimes size={18} /> : <FaChevronRight size={18} />}
      </button>
      
      <div className="subject-page-container">
        {/* Sidebar */}
        {isSidebarOpen && (
          <aside className="subject-sidebar">
            <div className="subject-sidebar-header">
              <button onClick={() => window.history.back()} className="back-button">
                <FaArrowLeft /> Back to My Courses
              </button>
              <h3>{course?.title || 'Course Details'}</h3>
              <div className="course-meta-info">
                <div>
                  <FaChalkboardTeacher /> Teacher View
                </div>
                <div>
                  <FaCalendarAlt /> {course?.level} Level • {course?.duration_hours}h
                </div>
              </div>
            </div>

            <div className="sidebar-search">
              <input
                type="text"
                className="topic-search"
                placeholder="Search content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <h4 className="sidebar-section-title">Course Content</h4>
            <ul className="sidebar-topics">
              {Object.entries(organizeContent()).map(([chapterName, lessons]) => (
                <li key={chapterName} className="topic-item">
                  <div 
                    className="topic-item-header"
                    onClick={() => toggleChapter(chapterName)}
                  >
                    <span className="topic-item-name">
                      <FaBook className="topic-icon" /> {chapterName}
                    </span>
                    <span className="topic-progress-badge">
                      {Object.keys(lessons).length}
                    </span>
                  </div>
                  
                  {expandedChapters[chapterName] && (
                    <ul className="subtopics-list">
                      {Object.entries(lessons).map(([lessonName, contents]) => (
                        <li key={lessonName} className="lesson-item">
                          <div 
                            className="lesson-header"
                            onClick={() => toggleLesson(lessonName)}
                          >
                            <span className="lesson-name">
                              📖 {lessonName}
                            </span>
                            <span className="content-count">
                              {contents.length}
                            </span>
                          </div>
                          
                          {expandedLessons[lessonName] && (
                            <ul className="content-list">
                              {contents
                                .filter(content => content.title.toLowerCase().includes(search.toLowerCase()))
                                .map((content, idx) => (
                                <li
                                  key={idx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSubtopicClick(content.title);
                                  }}
                                  className={`content-item ${
                                    selectedSubtopic === content.title ? "active" : ""
                                  }`}
                                >
                                  <span className="content-name">
                                    {content.content_type === 'VIDEO' && '🎥'}
                                    {content.content_type === 'PDF' && '📄'}
                                    {content.content_type === 'PPT' && '📊'}
                                    {content.content_type === 'DOC' && '📝'}
                                    {content.content_type === 'AUDIO' && '🎵'}
                                    {' '}{content.title}
                                  </span>
                                  <span className="content-type">
                                    {content.content_type}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* Main Content Area */}
        <div className="subject-main-content">
          {/* Content Header */}
          <div className="content-header">
            <h2>{selectedSubtopic || course?.title}</h2>
            <p>{getCurrentContent()?.description || course?.description}</p>
          </div>

          {/* Content Section with Tabs */}
          {selectedSubtopic && (
            <div className="content-section">
              {/* Tab Navigation */}
              <div className="tab-navigation">
                <button 
                  className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
                  onClick={() => setActiveTab('video')}
                >
                  <FaVideo /> Content
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'reading' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reading')}
                >
                  <FaFileAlt /> Details
                </button>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === 'video' && (
                  <div className="video-tab">
                    {renderContentViewer()}
                  </div>
                )}

                {activeTab === 'reading' && (
                  <div className="reading-tab">
                    <div className="content-details">
                      <h3>Content Information</h3>
                      <div className="detail-item">
                        <strong>Type:</strong> {getCurrentContent()?.content_type}
                      </div>
                      <div className="detail-item">
                        <strong>Title:</strong> {getCurrentContent()?.title}
                      </div>
                      <div className="detail-item">
                        <strong>Description:</strong> {getCurrentContent()?.description || 'No description available'}
                      </div>
                      <div className="detail-item">
                        <strong>Order:</strong> {getCurrentContent()?.content_order}
                      </div>
                      {getCurrentContent()?.file_url && (
                        <div className="detail-item">
                          <strong>File URL:</strong> 
                          <a href={getCurrentContent()?.file_url} target="_blank" rel="noopener noreferrer" className="file-link">
                            View Original
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="content-controls">
                {getCurrentContent()?.file_url && (
                  <a
                    href={getCurrentContent()?.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="control-btn"
                  >
                    <FaFileDownload /> Open in New Tab
                  </a>
                )}
              </div>
              
              <div className="subtopic-navigation">
                <button 
                  className="nav-btn prev"
                  onClick={navigateToPrevious}
                  disabled={getCurrentContentIndex() <= 0}
                >
                  <FaChevronLeft /> Previous
                </button>
                <button 
                  className="nav-btn next"
                  onClick={navigateToNext}
                  disabled={getCurrentContentIndex() >= lessonContents.length - 1}
                >
                  Next <FaChevronRight />
                </button>
              </div>
            </div>
          )}

          {/* Course Info Section */}
          {course && (
            <div className="course-info-section">
              <div className="section-header">
                <h3>Course Information</h3>
              </div>
              
              <div className="course-info-cards">
                <div className="info-card">
                  <div className="info-icon">
                    <FaBook />
                  </div>
                  <div className="info-details">
                    <h4>Category</h4>
                    <p>{course.category}</p>
                  </div>
                </div>
                <div className="info-card">
                  <div className="info-icon">
                    <FaClock />
                  </div>
                  <div className="info-details">
                    <h4>Duration</h4>
                    <p>{course.duration_hours} hours</p>
                  </div>
                </div>
                <div className="info-card">
                  <div className="info-icon">
                    <FaChartLine />
                  </div>
                  <div className="info-details">
                    <h4>Level</h4>
                    <p>{course.level}</p>
                  </div>
                </div>
                <div className="info-card">
                  <div className="info-icon">
                    <FaChalkboardTeacher />
                  </div>
                  <div className="info-details">
                    <h4>Students</h4>
                    <p>{course.students_count || 0} enrolled</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {lessonContents.length === 0 && (
            <div className="empty-state-section">
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No content added yet</h3>
                <p>Start adding videos, documents, and other materials to your course</p>
                <button
                  onClick={() => window.location.href = `/course-builder?subject=${encodeURIComponent(course?.category?.split(' - ')[2] || '')}&class=${encodeURIComponent(course?.category?.split(' - ')[1] || '')}&board=${encodeURIComponent(course?.category?.split(' - ')[0] || '')}`}
                  className="create-first-course-btn"
                >
                  Add Content
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;