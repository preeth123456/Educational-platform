import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import VideoPlayer, { VideoPlayerRef } from '../components/VideoPlayer';
import NewHeader from '../components/NewHeader';
import EduyataSidebarDemo from '../components/NewSidebar';
import SessionManager from '../utils/sessionManager';
import { getHeaderProps } from '../utils/headerUtils';
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
  FaPen,
  FaChartLine,
  FaTrophy,
  FaGamepad,
  FaTimes,
  FaVideo,
  FaFileAlt,
  FaCheck,
  FaRedo,
  FaFile,
  FaFilePowerpoint,
  FaFileWord,
  FaStop,
  FaPause
} from "react-icons/fa";
import "./SubjectNewStyles.css";

// Types
type CourseDetails = {
  id: number;
  course_id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration_hours: number;
  price: number;
  thumbnail_url: string;
  teacher: {
    id: number;
    name: string;
    qualification: string;
    email: string;
  };
};

type Chapter = {
  id: number;
  title: string;
  chapter_no: number;
  created_at: string;
  lessons: Lesson[];
};

type Lesson = {
  id: number;
  title: string;
  lesson_no: number;
  created_at: string;
  contents: LessonContent[];
};

type LessonContent = {
  id: number;
  title: string;
  description: string;
  content_type: string;
  file_url: string;
  content_order: number;
  created_at: string;
};

type CourseStructure = {
  course: {
    id: number;
    title: string;
  };
  chapters: Chapter[];
};

type EnrollmentData = {
  is_enrolled: boolean;
  enrollment_id: number | null;
  enrollment_status: string | null;
  enrollment_date: string | null;
  progress_percentage: number;
};

type SubjectProps = {
  mockCourseCode?: string;
  courseId?: string;
};

const Subject: React.FC<SubjectProps> = ({ mockCourseCode, courseId }) => {
  const params = useParams<{ courseCode: string }>();
  const currentCourseId = courseId || params.courseCode || "1";
  
  // State
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedContent, setSelectedContent] = useState<LessonContent | null>(null);
  const [previousContent, setPreviousContent] = useState<LessonContent | null>(null);
  const [search, setSearch] = useState<string>("");
  const [completed, setCompleted] = useState<string[]>([]);
  const [watchPercentages, setWatchPercentages] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'content' | 'materials'>('content');
  const [studentSession] = useState(SessionManager.getSession());
  const [mainSidebarOpen, setMainSidebarOpen] = useState(false);

  // API Queries
  const { data: courseDetails, isLoading: courseLoading } = useQuery<CourseDetails>({
    queryKey: [`course_details_${currentCourseId}`],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8001/api/courses/course/${currentCourseId}/details/`);
      if (!response.ok) {
        throw new Error('Failed to fetch course details');
      }
      const data = await response.json();
      return data.data;
    },
    enabled: !!currentCourseId,
    retry: 1
  });

  const { data: courseStructure, isLoading: structureLoading } = useQuery<CourseStructure>({
    queryKey: [`course_structure_${currentCourseId}`],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8001/api/courses/course/${currentCourseId}/structure/`);
      if (!response.ok) {
        throw new Error('Failed to fetch course structure');
      }
      const data = await response.json();
      return data.data;
    },
    enabled: !!currentCourseId,
    retry: 1
  });

  const { data: enrollmentData } = useQuery<EnrollmentData>({
    queryKey: [`enrollment_${currentCourseId}_${studentSession?.id}`],
    queryFn: async () => {
      if (!studentSession?.id) throw new Error('No student session');
      const response = await fetch(`http://localhost:8001/api/courses/course/${currentCourseId}/enrollment/${studentSession.id}/`);
      if (!response.ok) {
        throw new Error('Failed to check enrollment');
      }
      const data = await response.json();
      return data.data;
    },
    enabled: !!studentSession?.id && !!currentCourseId,
    retry: 1
  });

  // Effects
  useEffect(() => {
    if (courseStructure?.chapters && courseStructure.chapters.length > 0) {
      // Auto-select first chapter and lesson
      const firstChapter = courseStructure.chapters[0];
      setSelectedChapter(firstChapter);
      
      if (firstChapter.lessons && firstChapter.lessons.length > 0) {
        const firstLesson = firstChapter.lessons[0];
        setSelectedLesson(firstLesson);
        
        if (firstLesson.contents && firstLesson.contents.length > 0) {
          setSelectedContent(firstLesson.contents[0]);
        }
      }
    }
  }, [courseStructure]);

  useEffect(() => {
    if (studentSession?.id) {
      loadUserTheme(studentSession.id);
    }
  }, [studentSession]);

  // Helper functions
  const loadUserTheme = async (studentId: number) => {
    try {
      const response = await fetch(`http://localhost:8001/api/auth/get_user_preferences/?student_id=${studentId}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        applyTheme(data.data.theme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-theme');
    } else if (theme === 'light') {
      root.classList.remove('dark-theme');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark-theme');
      } else {
        root.classList.remove('dark-theme');
      }
    }
  };

  const handleChapterClick = (chapter: Chapter) => {
    if (selectedChapter?.id === chapter.id) {
      // If clicking the same chapter, toggle it closed
      setSelectedChapter(null);
      setSelectedLesson(null);
      setSelectedContent(null);
    } else {
      // If clicking a different chapter, open it
      setSelectedChapter(chapter);
      if (chapter.lessons && chapter.lessons.length > 0) {
        setSelectedLesson(chapter.lessons[0]);
        if (chapter.lessons[0].contents && chapter.lessons[0].contents.length > 0) {
          setSelectedContent(chapter.lessons[0].contents[0]);
        }
      }
    }
  };

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    if (lesson.contents && lesson.contents.length > 0) {
      setSelectedContent(lesson.contents[0]);
    }
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleContentClick = (content: LessonContent) => {
    // Simply mark the clicked content as complete
    handleContentComplete(content.title);
    
    setSelectedContent(content);
    // Set appropriate tab based on content type
    if (content.content_type === 'VIDEO' || content.content_type === 'AUDIO' || content.content_type === 'TEXT') {
      setActiveTab('content');
    } else {
      setActiveTab('materials');
    }
  };

  const handleContentComplete = (contentTitle: string) => {
    if (!completed.includes(contentTitle)) {
      setCompleted(prev => [...prev, contentTitle]);
    }
  };

  const calculateCourseProgress = () => {
    if (!courseStructure?.chapters) return 0;
    
    // Count total content items across all lessons
    const totalContent = courseStructure.chapters.reduce((total, chapter) => {
      return total + (chapter.lessons?.reduce((lessonTotal, lesson) => {
        return lessonTotal + (lesson.contents?.length || 0);
      }, 0) || 0);
    }, 0);
    
    if (totalContent === 0) return 0;
    
    const completedContent = completed.length;
    return Math.min(100, Math.round((completedContent / totalContent) * 100));
  };

  const renderContentViewer = () => {
    if (!selectedContent) {
      return (
        <div className="content-placeholder">
          <div className="placeholder-icon">📚</div>
          <h3>Select a lesson to start learning</h3>
          <p>Choose a chapter and lesson from the sidebar to begin your learning journey.</p>
        </div>
      );
    }

    switch (selectedContent.content_type) {
      case 'VIDEO':
        return (
          <div className="video-container">
            {selectedContent.file_url ? (
              selectedContent.file_url.includes('drive.google.com') ? (
                <div className="google-drive-video">
                  <iframe
                    key={`${selectedLesson?.id}-${selectedContent.id}`}
                    src={selectedContent.file_url.replace('/view?usp=sharing', '/preview').replace('/view', '/preview')}
                    width="100%"
                    height="500px"
                    style={{ border: 'none', borderRadius: '8px' }}
                    title={selectedContent.title}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  />
                </div>
              ) : (
                <VideoPlayer
                  key={`${selectedLesson?.id}-${selectedContent.id}`}
                  videoUrl={selectedContent.file_url}
                  courseId={courseDetails?.id || 0}
                  videoId={`${selectedLesson?.id}-${selectedContent.id}`}
                  onProgressUpdate={(progress) => {
                    console.log('Video progress:', progress);
                    const videoKey = `${selectedLesson?.id}-${selectedContent.id}`;
                    setWatchPercentages(prev => ({ ...prev, [videoKey]: progress }));
                    if (progress >= 95) {
                      handleContentComplete(selectedContent.title);
                    }
                  }}
                />
              )
            ) : (
              <div className="video-placeholder">
                <div className="play-button">
                  <FaPlay />
                </div>
                <p>Video: {selectedContent.title}</p>
                <p className="video-note">Video will be available soon</p>
              </div>
            )}
          </div>
        );
      
      case 'PDF':
        return (
          <div className="pdf-container">
            {selectedContent.file_url ? (
              <div className="pdf-viewer">
                <div className="pdf-header">
                  <h3>{selectedContent.title}</h3>
                  <a 
                    href={selectedContent.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="pdf-open-btn"
                  >
                    <FaFileDownload /> Open PDF
                  </a>
                </div>
                <iframe
                  src={selectedContent.file_url.includes('drive.google.com') 
                    ? selectedContent.file_url.replace('/view', '/preview')
                    : `${selectedContent.file_url}#toolbar=0&navpanes=0&scrollbar=0`
                  }
                  width="100%"
                  height="600px"
                  style={{ border: 'none' }}
                  title={selectedContent.title}
                  onError={() => {
                    console.log('PDF load error, showing fallback');
                  }}
                />
              </div>
            ) : (
              <div className="content-placeholder">
                <FaFileAlt size={48} />
                <h3>{selectedContent.title}</h3>
                <p>{selectedContent.description}</p>
                <p className="content-note">PDF content will be available soon</p>
              </div>
            )}
          </div>
        );
      
      case 'DOC':
        return (
          <div className="doc-container">
            {selectedContent.file_url ? (
              <div className="doc-viewer">
                <div className="doc-header">
                  <h3>{selectedContent.title}</h3>
                  <a 
                    href={selectedContent.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="doc-open-btn"
                  >
                    <FaFileWord /> Open Document
                  </a>
                </div>
                <iframe
                  src={selectedContent.file_url.includes('drive.google.com') 
                    ? selectedContent.file_url.replace('/view', '/preview')
                    : selectedContent.file_url
                  }
                  width="100%"
                  height="600px"
                  style={{ border: 'none' }}
                  title={selectedContent.title}
                />
              </div>
            ) : (
              <div className="content-placeholder">
                <FaFileWord size={48} />
                <h3>{selectedContent.title}</h3>
                <p>{selectedContent.description}</p>
                <p className="content-note">Document content will be available soon</p>
              </div>
            )}
          </div>
        );
      
      case 'PPT':
        return (
          <div className="ppt-container">
            {selectedContent.file_url ? (
              <div className="ppt-viewer">
                <div className="ppt-header">
                  <h3>{selectedContent.title}</h3>
                  <a 
                    href={selectedContent.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ppt-open-btn"
                  >
                    <FaFilePowerpoint /> Open Presentation
                  </a>
                </div>
                <iframe
                  src={selectedContent.file_url.includes('drive.google.com') 
                    ? selectedContent.file_url.replace('/view', '/preview')
                    : selectedContent.file_url
                  }
                  width="100%"
                  height="600px"
                  style={{ border: 'none' }}
                  title={selectedContent.title}
                />
              </div>
            ) : (
              <div className="content-placeholder">
                <FaFilePowerpoint size={48} />
                <h3>{selectedContent.title}</h3>
                <p>{selectedContent.description}</p>
                <p className="content-note">Presentation content will be available soon</p>
              </div>
            )}
          </div>
        );
      
      case 'AUDIO':
        return (
          <div className="audio-container">
            {selectedContent.file_url ? (
              selectedContent.file_url.includes('drive.google.com') ? (
                <div className="audio-viewer">
                  <div className="audio-header">
                    <h3>{selectedContent.title}</h3>
                    <a 
                      href={selectedContent.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="audio-open-btn"
                    >
                      🎵 Open Audio
                    </a>
                  </div>
                  <iframe
                    src={selectedContent.file_url.replace('/view', '/preview')}
                    width="100%"
                    height="400px"
                    style={{ border: 'none' }}
                    title={selectedContent.title}
                  />
                </div>
              ) : (
                <div className="audio-player">
                  <h3>{selectedContent.title}</h3>
                  <audio controls style={{ width: '100%', marginTop: '1rem' }}>
                    <source src={selectedContent.file_url} type="audio/mpeg" />
                    <source src={selectedContent.file_url} type="audio/wav" />
                    <source src={selectedContent.file_url} type="audio/ogg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )
            ) : (
              <div className="content-placeholder">
                🎵
                <h3>{selectedContent.title}</h3>
                <p>{selectedContent.description}</p>
                <p className="content-note">Audio content will be available soon</p>
              </div>
            )}
          </div>
        );
      
      case 'TEXT':
        return (
          <div className="text-container">
            <h3>{selectedContent.title}</h3>
            <div className="text-content">
              {selectedContent.description || "Text content will be available soon."}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="content-placeholder">
            <FaFile size={48} />
            <h3>{selectedContent.title}</h3>
            <p>{selectedContent.description}</p>
            <p className="content-note">Content type: {selectedContent.content_type}</p>
          </div>
        );
    }
  };

  // Loading states
  if (courseLoading || structureLoading) {
    return (
      <div className="subject-loading">
        <div className="spinner"></div>
        <p>Loading course content...</p>
      </div>
    );
  }

  // Check enrollment
  if (enrollmentData && !enrollmentData.is_enrolled) {
    return (
      <div className="enrollment-required">
        <div className="enrollment-message">
          <h2>Enrollment Required</h2>
          <p>You need to be enrolled in this course to access the learning content.</p>
          <Link to={`/course/${currentCourseId}`}>
            <button className="enroll-btn">Go to Course Details</button>
          </Link>
        </div>
      </div>
    );
  }

  if (!courseDetails || !courseStructure) {
    return (
      <div className="error-message">
        <h2>Course Not Found</h2>
        <p>The course you're looking for is not available or has been removed.</p>
        <Link to="/courses">
          <button className="back-btn">Back to Courses</button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }} className="subject-learning-container">
      {/* Main Navigation Sidebar */}
      <EduyataSidebarDemo open={mainSidebarOpen} setOpen={setMainSidebarOpen} />
      
      <div 
        className="subject-page-wrapper"
        style={{
          flex: 1,
          paddingTop: '80px',
          marginLeft: mainSidebarOpen ? '250px' : '60px',
          transition: 'margin-left 0.3s ease',
          width: mainSidebarOpen ? 'calc(100% - 250px)' : 'calc(100% - 60px)',
          maxWidth: 'none'
        }}
      >
        {/* Main Header */}
        <NewHeader {...getHeaderProps()} studentId={studentSession?.id} />
        
        <button 
          className="subject-sidebar-toggle-btn" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <FaTimes size={18} /> : <FaChevronRight size={18} />}
        </button>

        <div className="subject-page-container">
          {/* Course Content Sidebar */}
          {isSidebarOpen && (
            <aside className="subject-sidebar">
              <div className="subject-sidebar-header">
                <Link to="/courses" className="back-button">
                  <FaArrowLeft /> Back to Courses
                </Link>
                <h3>{courseDetails.title}</h3>
                <div className="course-meta-info">
                  <div>
                    <FaChalkboardTeacher /> {courseDetails.teacher.name}
                  </div>
                  <div>
                    <FaCalendarAlt /> {courseDetails.level} Level • {courseDetails.duration_hours}h
                  </div>
                </div>
              </div>

              <div className="sidebar-search">
                <input
                  type="text"
                  className="topic-search"
                  placeholder="Search lessons..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="topic-progress">
                <div className="progress-header">
                  <h4>Course Progress</h4>
                  <span className="progress-percent">
                    {calculateCourseProgress()}%
                  </span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill"
                    style={{ width: `${calculateCourseProgress()}%` }}
                  ></div>
                </div>
              </div>

              <h4 className="sidebar-section-title">Course Content</h4>
              <ul className="sidebar-topics">
                {courseStructure.chapters.map((chapter) => (
                  <li
                    key={chapter.id}
                    onClick={() => handleChapterClick(chapter)}
                    className={`topic-item ${selectedChapter?.id === chapter.id ? "active" : ""}`}
                  >
                    <div className="topic-item-header">
                      <span className="topic-item-name">
                        <FaBook className="topic-icon" /> {chapter.title}
                      </span>
                      <span className="topic-progress-badge">
                        📚 {chapter.lessons?.length || 0} lessons
                      </span>
                    </div>
                    
                    {selectedChapter?.id === chapter.id && chapter.lessons && (
                      <ul className="subtopics-list">
                        {chapter.lessons.map((lesson) => (
                          <li key={lesson.id} className="lesson-container">
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLessonClick(lesson);
                              }}
                              className={`subtopic-item ${
                                selectedLesson?.id === lesson.id ? "active" : ""
                              }`}
                            >
                              <span className="subtopic-name">📖 {lesson.title}</span>
                              <span className="subtopic-badge">
                                🎯 {lesson.contents?.length || 0} items
                              </span>
                            </div>
                            
                            {selectedLesson?.id === lesson.id && lesson.contents && (
                              <ul className="content-list">
                                {lesson.contents.map((content) => (
                                  <li key={content.id}>
                                    <div
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleContentClick(content);
                                      }}
                                      className={`content-item ${
                                        selectedContent?.id === content.id ? "active" : ""
                                      }`}
                                    >
                                      <span className="content-icon">
                                        {content.content_type === 'VIDEO' && <FaVideo />}
                                        {content.content_type === 'PDF' && <FaFileAlt />}
                                        {content.content_type === 'TEXT' && <FaFile />}
                                      </span>
                                      <span className="content-name">{content.title}</span>
                                      <span className="content-type">{content.content_type}</span>
                                      <span className="content-status">
                                        {(() => {
                                          const videoKey = `${lesson.id}-${content.id}`;
                                          const progress = watchPercentages[videoKey] || 0;
                                          const isCompleted = completed.includes(content.title) || progress >= 95;
                                          
                                          if (content.content_type === 'VIDEO') {
                                            return isCompleted ? (
                                              <FaCheck className="text-green-500" />
                                            ) : (
                                              <div className="progress-indicator" style={{ 
                                                width: '16px', 
                                                height: '16px', 
                                                borderRadius: '50%', 
                                                background: `conic-gradient(#4CAF50 ${progress * 3.6}deg, #e0e0e0 0deg)`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '8px',
                                                color: '#666'
                                              }}>
                                                {Math.round(progress)}%
                                              </div>
                                            );
                                          } else {
                                            return isCompleted ? (
                                              <FaCheck className="text-green-500" />
                                            ) : (
                                              <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                                            );
                                          }
                                        })()} 
                                      </span>
                                    </div>
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
              <h2>{selectedChapter?.title || courseDetails.title}</h2>
              <p>{selectedLesson?.title || courseDetails.description}</p>
            </div>

            {/* Content Section with Tabs */}
            {selectedContent && (
              <div className="content-section">
                {/* Tab Navigation */}
                <div className="tab-navigation">
                  <button 
                    className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
                    onClick={() => setActiveTab('content')}
                  >
                    <FaVideo /> Content
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
                    onClick={() => setActiveTab('materials')}
                  >
                    <FaFileAlt /> Materials
                  </button>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                  {activeTab === 'content' && (
                    <div className="content-tab">
                      {selectedContent && (selectedContent.content_type === 'VIDEO' || selectedContent.content_type === 'AUDIO' || selectedContent.content_type === 'TEXT') ? (
                        renderContentViewer()
                      ) : (
                        <div className="content-placeholder">
                          <FaVideo size={48} />
                          <h3>No video content available</h3>
                          <p>Select a video, audio, or text content to view here.</p>
                        </div>
                      )}
                    </div>
                  )}
                  {activeTab === 'materials' && (
                    <div className="materials-tab">
                      {selectedContent && (selectedContent.content_type === 'PDF' || selectedContent.content_type === 'PPT' || selectedContent.content_type === 'DOC') ? (
                        renderContentViewer()
                      ) : (
                        <div className="content-placeholder">
                          <FaFileAlt size={48} />
                          <h3>No material content available</h3>
                          <p>Select a PDF, PPT, or document to view here.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Content Controls */}
                <div className="content-controls">
                </div>
              </div>
            )}

            {/* Course Info Section */}
            <div className="course-info-section">
              <div className="info-card">
                <h3>About This Course</h3>
                <p>{courseDetails.description}</p>
                <div className="course-stats">
                  <div className="stat">
                    <strong>Instructor:</strong> {courseDetails.teacher.name}
                  </div>
                  <div className="stat">
                    <strong>Level:</strong> {courseDetails.level}
                  </div>
                  <div className="stat">
                    <strong>Duration:</strong> {courseDetails.duration_hours} hours
                  </div>
                  <div className="stat">
                    <strong>Category:</strong> {courseDetails.category}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subject;