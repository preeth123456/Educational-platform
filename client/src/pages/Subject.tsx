import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import VideoPlayer, { VideoPlayerRef } from '../components/VideoPlayer';
import SessionManager from '../utils/sessionManager';
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
import "./SubjectStyles.css";

// YouTube Player API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

type Assessment = {
  id: number;
  type: "Quiz" | "Assignment" | "Exam";
  title: string;
  deadline: string;
  status: "Pending" | "Upcoming" | "Completed";
};

type Game = {
  id: number;
  title: string;
  description: string;
  icon: string;
};

type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
};

type QuizResult = {
  score: number;
  totalQuestions: number;
  answers: number[];
};

type Course = {
  id: number;
  course_id: string;
  title: string;
  description: string;
  instructor_name: string;
  category: string;
  level: string;
  duration_hours: number;
  topics: Record<string, string[]>;
};

type SubjectProps = {
  mockCourseCode?: string;
  courseId?: string;
};

const Subject: React.FC<SubjectProps> = ({ mockCourseCode, courseId }) => {
  const params = useParams<{ courseCode: string }>();
  const currentCourseId = courseId || params.courseCode || "CRS20250001";
  
  // Fallback course data for when API fails or course doesn't exist
  const fallbackCourse: Course = {
    id: parseInt(currentCourseId) || 5,
    course_id: currentCourseId,
    title: "Web Development Fundamentals",
    description: "Learn the fundamentals of web development including web basics, API integration, and project structure management.",
    instructor_name: "Prof. Web Developer",
    category: "Web Development",
    level: "beginner",
    duration_hours: 20,
    topics: {
      "Web": [
        "Introduction",
        "What is the Web and Internet",
        "What is HTTP",
        "Installing web browsers"
      ],
      "API": [
        "What is an API",
        "Planning your web project",
        "Sketching your website design"
      ],
      "Folder": [
        "Choosing Assets",
        "Creating project folder structure"
      ]
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [completed, setCompleted] = useState<string[]>([]);
  const [watchPercentages, setWatchPercentages] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'video' | 'reading'>('video');
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [quizAttempts, setQuizAttempts] = useState<Record<string, boolean>>({});
  const [quizScores, setQuizScores] = useState<Record<string, number[]>>({});
  const [dismissedQuizzes, setDismissedQuizzes] = useState<Record<string, boolean>>({});
  const [selectedContentType, setSelectedContentType] = useState<'pdf' | 'ppt' | 'doc'>('pdf');
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgressLoading, setVideoProgressLoading] = useState(false);
  const [videoProgressLoaded, setVideoProgressLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const videoPlayerRef = useRef<VideoPlayerRef | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const playerRef = useRef<HTMLDivElement | null>(null);


  // Local video mapping for Web Development topics
  const localVideoMapping: Record<string, string> = {
    // Web topic videos
    "Introduction": "/01 The Web and Internet/001 Introduction.mp4",
    "What is the Web and Internet": "/01 The Web and Internet/002 What is the Web and Internet.mp4",
    "What is HTTP": "/01 The Web and Internet/003 What is HTTP.mp4",
    "Installing web browsers": "/01 The Web and Internet/004 Installing web browsers.mp4",
    
    // API topic videos
    "What is an API": "/01 The Web and Internet/005 What is an API.mp4",
    "Planning your web project": "/01 The Web and Internet/006 Planning your web project.mp4",
    "Sketching your website design": "/01 The Web and Internet/007 Sketching your website design.mp4",
    
    // Folder topic videos
    "Choosing Assets": "/01 The Web and Internet/008 Choosing Assets.mp4",
    "Creating project folder structure": "/01 The Web and Internet/009 Creating project folder structure.mp4"
  };

  // Reading material PDF mapping
  const readingMaterials: Record<string, string> = {
    "Introduction": "/pdfs/01-introduction.pdf",
    "What is the Web and Internet": "/pdfs/02-web-and-internet.pdf",
    "What is HTTP": "/pdfs/03-what-is-http.pdf",
    "Installing web browsers": "/pdfs/04-installing-browsers.pdf",
    "What is an API": "/pdfs/05-what-is-api.pdf",
    "Planning your web project": "/pdfs/06-planning-project.pdf",
    "Sketching your website design": "/pdfs/07-sketching-design.pdf",
    "Choosing Assets": "/pdfs/08-choosing-assets.pdf",
    "Creating project folder structure": "/pdfs/09-folder-structure.pdf"
  };

  const additionalMaterials: Record<string, Array<{type: string, url: string, name: string}>> = {
    "Introduction": [
      {type: "ppt", url: "/ppts/01-introduction.pptx", name: "Introduction Slides"},
      {type: "doc", url: "/docs/01-introduction.docx", name: "Introduction Notes"}
    ],
    "What is the Web and Internet": [
      {type: "ppt", url: "/ppts/02-web-internet.pptx", name: "Web & Internet Slides"}
    ]
  };

  const pdfTextContent: Record<string, string> = {
    "Introduction": "Web development is the process of building and maintaining websites...",
    "What is the Web and Internet": `What is the Web and Internet
Contents:
• Definition of the Internet: A global network of interconnected computers that communicate using standardized protocols (TCP/IP).
• Definition of the Web: The World Wide Web (WWW) is a system of interlinked hypertext documents accessed via the Internet using a browser.
• Difference between Internet and Web:
  o Internet = Infrastructure (hardware, networks, cables).
  o Web = Service that runs on the Internet (websites, browsers).
• How it works:
  o You type a URL → Browser sends a request → Web server responds with a web page → Browser displays it.
• Key Components:
  o Web browsers, servers, protocols (HTTP/HTTPS), and web pages.
• Examples:
  o Websites: Google, YouTube, Wikipedia.
  o Services on Internet beyond Web: Email, FTP, VoIP.`,
    "What is HTTP": `Contents:
• Definition: HyperText Transfer Protocol — a set of rules for transferring files (text, images, video, sound) on the Web.
• Role: Foundation of any data exchange on the Web.
• How it works:
  o Browser (client) sends an HTTP request to a web server.
  o Server responds with requested content (HTML, JSON, etc.).
• HTTP Methods:
  o GET (retrieve data), POST (send data), PUT (update data), DELETE (remove data).
• Status Codes:
  o 200 (OK), 404 (Not Found), 500 (Server Error).
• HTTPS:
  o Secure version of HTTP using SSL/TLS for encryption.
• Example:
  o https://www.example.com/page.html`,
    "Installing web browsers": `Contents:
• What is a Web Browser:
  Software that allows users to access and view websites.
• Popular Browsers:
  Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Opera.
• Steps to Install (Example: Google Chrome):
  1. Visit https://www.google.com/chrome.
  2. Click "Download Chrome."
  3. Run the installer and follow on-screen instructions.
• Updating Browsers:
  Keep your browser updated for security and performance improvements.
• Browser Features:
  Tabs, bookmarks, developer tools, extensions, and private mode.
• Tips:
  o Enable automatic updates.
  o Use trusted sources to download browsers.`,
    "What is an API": `What is an API
• Definition: API (Application Programming Interface) is a set of rules that lets one software application interact with another.
• Purpose: Allows communication between different systems.
• Example:
  o Weather app using OpenWeather API to get weather data.
  o Payment gateway API (like Razorpay or PayPal) used by e-commerce sites.
• Types of APIs:
  o Web APIs, REST APIs, GraphQL APIs, and SDKs.
• REST API Basics:
  o Uses HTTP methods (GET, POST, PUT, DELETE).
  o Data often sent in JSON format.
• Benefits:
  o Reusability, scalability, and faster integration.`,
    "Planning your web project": `Planning Your Web Project
• Importance of Planning:
  Planning helps clarify objectives, target audience, and structure.
• Steps:
  1. Define Goal: What is the purpose of your website?
  2. Identify Target Audience: Who will use it?
  3. Gather Requirements: What features are needed (e.g., login, blog, gallery)?
  4. Research Competitors: Analyze similar sites for ideas.
  5. Choose Tools: Decide on frameworks, languages, hosting, and CMS.
  6. Create Sitemap: Visual structure of pages.
• Deliverables:
  o Project plan document, sitemap, timeline, and responsibilities.`,
    "Sketching your website design": `Sketching Your Website Design
• Definition: Sketching is the process of creating rough visual layouts before coding.
• Purpose: Helps visualize layout, user flow, and content placement.
• Tools:
  o Paper and pen, Figma, Adobe XD, Canva, Balsamiq.
• Elements to Sketch:
  o Header, navigation, main content, sidebar, footer.
• Tips:
  o Keep it simple.
  o Focus on user experience (UX) and accessibility.
  o Use grid systems for balance.
• Example:
  Sketch a home page showing logo, nav bar, hero image, and call-to-action button.`,
    "Choosing Assets": `Choosing Assets
• Definition: Assets are the visual and media resources used in your website (images, icons, fonts, videos, etc.).
• Types of Assets:
  o Images, videos, audio, icons, fonts, and animations.
• Where to Get Assets:
  o Free sources: Unsplash, Pexels, Freepik, Google Fonts.
  o Paid sources: Shutterstock, Envato Elements.
• Tips:
  o Optimize image sizes for performance.
  o Use consistent style and color palette.
  o Check licensing terms before use.
• Asset Organization:
  o /assets/images/, /assets/fonts/, /assets/icons/`,
    "Creating project folder structure": `Creating project folder structure:
Organizing a project folder structure simplifies maintenance. It typically includes folders like /css, /js, and /images, with index.html as the root file to start the project.`
  };

  // Quiz questions by subtopic
  const quizQuestions: Record<string, QuizQuestion[]> = {
    "Introduction": [
      {
        id: 1,
        question: "What is web development?",
        options: ["Building mobile apps", "Building and maintaining websites", "Database management", "Network security"],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "Which languages are commonly used in web development?",
        options: ["HTML, CSS, JavaScript", "Java, C++", "Python only", "Assembly language"],
        correctAnswer: 0
      }
    ],
    "What is the Web and Internet": [
      {
        id: 1,
        question: "What does WWW stand for?",
        options: ["World Wide Web", "World Web Wide", "Wide World Web", "Web World Wide"],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "What is the difference between Internet and Web?",
        options: ["They are the same", "Internet is infrastructure, Web is a service", "Web is older than Internet", "Internet is only for emails"],
        correctAnswer: 1
      }
    ],
    "What is HTTP": [
      {
        id: 1,
        question: "What does HTTP stand for?",
        options: ["HyperText Transfer Protocol", "High Tech Transfer Protocol", "HyperText Transport Protocol", "High Transfer Text Protocol"],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "What is the secure version of HTTP?",
        options: ["HTTPSEC", "HTTPS", "SHTTP", "HTTP-S"],
        correctAnswer: 1
      }
    ],
    "Installing web browsers": [
      {
        id: 1,
        question: "Which is a popular web browser?",
        options: ["Notepad", "Chrome", "Excel", "PowerPoint"],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "Why should you keep your browser updated?",
        options: ["For fun", "Security and performance", "To use more memory", "It's not necessary"],
        correctAnswer: 1
      }
    ],
    "What is an API": [
      {
        id: 1,
        question: "What does API stand for?",
        options: ["Application Programming Interface", "Advanced Programming Interface", "Application Program Integration", "Advanced Program Interface"],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "What is the purpose of an API?",
        options: ["To create websites", "To allow software communication", "To store data", "To design interfaces"],
        correctAnswer: 1
      }
    ],
    "Planning your web project": [
      {
        id: 1,
        question: "What is the first step in web project planning?",
        options: ["Writing code", "Defining project scope and goals", "Choosing colors", "Buying domain"],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "Why is planning important in web development?",
        options: ["It's not important", "Helps clarify objectives and structure", "Only for large projects", "To waste time"],
        correctAnswer: 1
      }
    ],
    "Sketching your website design": [
      {
        id: 1,
        question: "What should you create before coding a website?",
        options: ["Database", "Server", "Wireframes and sketches", "Logo only"],
        correctAnswer: 2
      },
      {
        id: 2,
        question: "Which tool can be used for sketching website designs?",
        options: ["Microsoft Word", "Figma", "Calculator", "Music player"],
        correctAnswer: 1
      }
    ],
    "Choosing Assets": [
      {
        id: 1,
        question: "What are assets in web development?",
        options: ["Code files only", "Visual and media resources", "Server configurations", "Database tables"],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "What image format is recommended for web optimization?",
        options: ["BMP", "TIFF", "WebP", "RAW"],
        correctAnswer: 2
      }
    ],
    "Creating project folder structure": [
      {
        id: 1,
        question: "Why is proper folder structure important?",
        options: ["Looks professional", "Easier maintenance and organization", "Faster loading", "Better SEO"],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "What should be included in a typical web project folder?",
        options: ["Only HTML files", "HTML, CSS, JS, and assets folders", "Only images", "Random files"],
        correctAnswer: 1
      }
    ]
  };

  // Fetch course data from API
  type CourseApiResponse = {
    data?: {
      id: number;
      course_id: string;
      title: string;
      description: string;
      instructor_name?: string;
      category: string;
      level: string;
      duration_hours: number;
    };
  };

  const { data: courseResponse = {}, isLoading, error } = useQuery<CourseApiResponse>({
    queryKey: [`course_${currentCourseId}`],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8001/api/courses/get_courses/`);
      if (!response.ok) {
        throw new Error('Failed to fetch course');
      }
      const data = await response.json();
      // Find the specific course by ID
      const courses = data.data || data;
      const course = courses.find((c: any) => c.course_id === currentCourseId || c.id.toString() === currentCourseId);
      return course ? { data: course } : { data: null };
    },
    enabled: true,
    retry: 1
  });

  // Fetch lesson contents for the course
  const { data: lessonContentsResponse } = useQuery({
    queryKey: [`lesson_contents_${currentCourseId}`],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8001/api/courses/lesson-contents/?course_id=${currentCourseId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch lesson contents');
      }
      return response.json();
    },
    enabled: !!currentCourseId,
    retry: 1
  });

  // Convert lesson contents to topics structure
  const getTopicsFromLessonContents = (): Record<string, string[]> => {
    if (!lessonContentsResponse?.data) {
      return getDefaultTopics(courseResponse?.data?.category || "Web Development");
    }

    const topics: Record<string, string[]> = {};
    lessonContentsResponse.data.forEach((content: any) => {
      const chapterTitle = content.chapter_title || 'Chapter 1';
      if (!topics[chapterTitle]) {
        topics[chapterTitle] = [];
      }
      if (!topics[chapterTitle].includes(content.title)) {
        topics[chapterTitle].push(content.title);
      }
    });
    
    return Object.keys(topics).length > 0 ? topics : getDefaultTopics(courseResponse?.data?.category || "Web Development");
  };

  // Default topics structure for courses
  const getDefaultTopics = (category: string): Record<string, string[]> => {
    const topicsByCategory: Record<string, Record<string, string[]>> = {
      "Web Development": {
        "Web": ["Introduction", "What is the Web and Internet", "What is HTTP", "Installing web browsers"],
        "API": ["What is an API", "Planning your web project", "Sketching your website design"],
        "Folder": ["Choosing Assets", "Creating project folder structure"]
      }
    };
    return topicsByCategory[category] || topicsByCategory["Web Development"];
  };

  const course: Course = courseResponse?.data ? {
    id: courseResponse.data.id,
    course_id: courseResponse.data.course_id,
    title: courseResponse.data.title,
    description: courseResponse.data.description,
    instructor_name: courseResponse.data.instructor_name || "Instructor",
    category: courseResponse.data.category,
    level: courseResponse.data.level,
    duration_hours: courseResponse.data.duration_hours,
    topics: getTopicsFromLessonContents()
  } : fallbackCourse;

  const assessments: Assessment[] = [
    { id: 1, type: "Quiz", title: "Web Basics Quiz", deadline: "Today", status: "Pending" },
    { id: 2, type: "Assignment", title: "API Integration", deadline: "May 20, 2025", status: "Upcoming" },
    { id: 3, type: "Exam", title: "Web Development Exam", deadline: "May 28, 2025", status: "Upcoming" }
  ];

  const games: Game[] = [
    { id: 1, title: "Math Challenge", description: "Test your skills in a fun challenge", icon: "🎮" },
    { id: 2, title: "Matrix Escape", description: "Solve puzzles to escape", icon: "🧩" }
  ];



  // Use useQuery for progress data with proper caching
  const { data: progressData } = useQuery({
    queryKey: [`progress_${currentCourseId}`],
    queryFn: async () => {
      const studentSession = SessionManager.getSession();
      if (!studentSession?.id || !course?.id) return null;

      try {
        const response = await fetch(`http://localhost:8001/api/courses/get_progress/?student_id=${studentSession.id}&course_id=${course.id}`);
        if (!response.ok) throw new Error('Failed to fetch progress');
        const data = await response.json();
        console.log('Fetched progress from database:', data);

        // Also save to localStorage as backup
        const userId = studentSession.id;
        localStorage.setItem(`progress_${currentCourseId}_${userId}`, JSON.stringify(data));

        return data;
      } catch (error) {
        console.error('Failed to fetch progress, trying localStorage:', error);
        // Fallback to localStorage
        const userId = studentSession.id;
        const localData = localStorage.getItem(`progress_${currentCourseId}_${userId}`);
        return localData ? JSON.parse(localData) : null;
      }
    },
    enabled: !!course?.id,
    staleTime: 30000, // Cache for 30 seconds
    retry: 1
  });

  // Update state when progress data changes
  useEffect(() => {
    if (progressData?.status === 'success' && progressData.data) {
      console.log('Loading progress data:', progressData.data);

      // Load completed topics first
      if (progressData.data.completed) {
        const completedArray = typeof progressData.data.completed === 'string'
          ? JSON.parse(progressData.data.completed)
          : progressData.data.completed;
        setCompleted(completedArray);
        console.log('Loaded completed:', completedArray);
      }

      // Load quiz attempts
      if (progressData.data.quiz_attempts) {
        const quizAttemptsObj = typeof progressData.data.quiz_attempts === 'string'
          ? JSON.parse(progressData.data.quiz_attempts)
          : progressData.data.quiz_attempts;
        setQuizAttempts(quizAttemptsObj);
      }

      // Load dismissed quizzes
      if (progressData.data.dismissed_quizzes) {
        const dismissedQuizzesObj = typeof progressData.data.dismissed_quizzes === 'string'
          ? JSON.parse(progressData.data.dismissed_quizzes)
          : progressData.data.dismissed_quizzes;
        setDismissedQuizzes(dismissedQuizzesObj);
      }
    }
  }, [progressData]);

  // Load video progress separately when course changes
  useEffect(() => {
    const studentSession = SessionManager.getSession();
    if (studentSession?.id && currentCourseId && !videoProgressLoaded) {
      loadAllVideoProgress();
    }
  }, [currentCourseId, videoProgressLoaded]);

  const updateProgressInDatabase = async (progress: Record<string, number>, completedTopics: string[]) => {
    const studentSession = SessionManager.getSession();
    if (!studentSession?.id || !course?.id) return;

    try {
      const progressData = {
        student_id: parseInt(studentSession.id.toString()),
        course_id: course.id,
        progress: progress,
        completed: completedTopics,
        quiz_attempts: quizAttempts,
        dismissed_quizzes: dismissedQuizzes
      };

      // Save to localStorage first as backup
      const userId = studentSession.id;
      const localData = {
        data: progressData,
        timestamp: Date.now()
      };
      localStorage.setItem(`progress_backup_${currentCourseId}_${userId}`, JSON.stringify(localData));

      const response = await fetch('http://localhost:8001/api/courses/update_progress/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progressData)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Progress updated successfully:', responseData);
        return responseData;
      } else {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }
    } catch (error) {
      console.error('Failed to update progress in database, saved to localStorage:', error);
      // Progress is already saved to localStorage above
    }
  };

  const updateEnrollmentStatus = async (courseId: number, status: string) => {
    const studentSession = SessionManager.getSession();
    if (!studentSession?.id) return;

    try {
      const response = await fetch('http://localhost:8001/api/courses/update_enrollment_status/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: parseInt(studentSession.id.toString()),
          course_id: courseId,
          status: status
        })
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Enrollment status updated successfully:', responseData);
        return responseData;
      } else {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }
    } catch (error) {
      console.error('Failed to update enrollment status:', error);
    }
  };

  const updateProgress = async (subtopic: string, progress: number) => {
    // For individual progress updates, use the same complete object approach
    // to ensure consistency with the database
    const updatedProgress = { ...watchPercentages, [subtopic]: progress };
    await updateProgressInDatabase(updatedProgress, completed);
  };

  const saveVideoProgress = async (videoId: string, progress: number, currentTime: number) => {
    const studentSession = SessionManager.getSession();
    if (!studentSession?.id) return;

    try {
      const response = await fetch('http://localhost:8001/api/courses/save_video_progress/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentSession.id,
          course_id: course.id,
          video_id: videoId,
          progress: progress,
          current_time: currentTime
        })
      });
      
      if (response.ok) {
        console.log('Video progress saved to database');
      }
    } catch (error) {
      console.error('Failed to save video progress:', error);
    }
  };

  const { data: studentStatsResponse } = useQuery<{ data: { highest_score: number; average_score: number; total_attempts: number } }>({
    queryKey: [`student_stats_${currentCourseId}_${selectedSubtopic}`],
    enabled: !!selectedSubtopic,
    retry: 1,
    queryFn: async () => {
      const studentSession = SessionManager.getSession();
      if (!studentSession?.id || !course?.id || !selectedSubtopic) return { data: { highest_score: 0, average_score: 0, total_attempts: 0 } };
      try {
        const response = await fetch(`http://localhost:8001/api/courses/get_student_quiz_stats/?course_id=${course.id}&topic=${selectedSubtopic}&student_id=${studentSession.id}`);
        console.log('Quiz stats API URL:', `http://localhost:8001/api/courses/get_student_quiz_stats/?course_id=${course.id}&topic=${selectedSubtopic}&student_id=${studentSession.id}`);
        if (!response.ok) throw new Error('Failed to fetch student stats');
        const data = await response.json();
        console.log('Quiz stats response:', data);
        return data;
      } catch (error) {
        console.error('Failed to fetch student stats:', error);
        const currentPercentage = quizResult ? Math.round((quizResult.score / quizResult.totalQuestions) * 100) : 0;
        return { data: { highest_score: currentPercentage, average_score: currentPercentage, total_attempts: quizCompleted ? 1 : 0 } };
      }
    }
  });

  const loadQuizStats = async () => {
    const studentSession = SessionManager.getSession();
    if (!studentSession?.id) return;

    try {
      const response = await fetch(`http://localhost:8001/api/courses/get_student_quiz_stats/?student_id=${studentSession.id}&course_id=${course.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setQuizScores(data.data.quiz_scores || {});
        }
      }
    } catch (error) {
      console.error('Failed to load quiz stats:', error);
    }
  };

  const loadAllVideoProgress = async () => {
    const studentSession = SessionManager.getSession();
    if (!studentSession?.id || !course?.id) {
      setVideoProgressLoading(false);
      return;
    }

    console.log('Starting to load video progress for course:', course.id);
    setVideoProgressLoading(true);

    // Set a timeout to ensure loading state doesn't get stuck
    const loadingTimeout = setTimeout(() => {
      console.log('Loading timeout reached, setting loading to false');
      setVideoProgressLoading(false);
    }, 10000); // 10 second timeout

    try {
      // Get all subtopics in the course
      const allSubtopics = Object.values(course.topics).flat();
      console.log('Loading progress for subtopics:', allSubtopics);

      if (allSubtopics.length === 0) {
        console.log('No subtopics found, setting loading to false');
        clearTimeout(loadingTimeout);
        setVideoProgressLoading(false);
        return;
      }

      // Load video progress for each subtopic
      const videoProgressPromises = allSubtopics.map(async (subtopic) => {
        try {
          const response = await fetch(
            `http://localhost:8001/api/courses/get_video_progress/?student_id=${studentSession.id}&course_id=${course.id}&video_id=${encodeURIComponent(subtopic)}`
          );

          if (!response.ok) {
            console.warn(`API call failed for ${subtopic}: ${response.status}`);
            return null;
          }

          const data = await response.json();

          if (data.status === 'success' && data.data && typeof data.data.current_time === 'number') {
            const progress = data.data.duration > 0
              ? Math.round((data.data.current_time / data.data.duration) * 100)
              : 0;
            return { subtopic, progress: Math.min(progress, 100) };
          }
        } catch (error) {
          console.error(`Failed to load video progress for ${subtopic}:`, error);
        }
        return null;
      });

      const results = await Promise.all(videoProgressPromises);
      const validResults = results.filter(result => result !== null);

      console.log('Video progress results:', validResults);

      // Update watchPercentages with loaded video progress
      setWatchPercentages(prev => {
        const updated = { ...prev };
        validResults.forEach(result => {
          if (result) {
            updated[result.subtopic] = result.progress;
          }
        });
        console.log('Updated watchPercentages:', updated);
        return updated;
      });

    } catch (error) {
      console.error('Failed to load all video progress:', error);
    } finally {
      clearTimeout(loadingTimeout);
      console.log('Setting videoProgressLoading to false');
      setVideoProgressLoading(false);
      setVideoProgressLoaded(true);
    }
  };

  useEffect(() => {
    if (course && course.topics) {
      console.log('Course loaded:', course);
      console.log('Available topics:', Object.keys(course.topics));

      // Load progress from localStorage immediately for faster loading
      const studentSession = SessionManager.getSession();
      if (studentSession?.id) {
        const userId = studentSession.id;
        const localData = localStorage.getItem(`progress_backup_${currentCourseId}_${userId}`);
        if (localData) {
          try {
            const parsed = JSON.parse(localData);
            if (parsed.data) {
              console.log('Loading progress from localStorage backup:', parsed.data);

              // Load completed topics first
              if (parsed.data.completed) {
                setCompleted(parsed.data.completed);
              }

              // Load quiz attempts
              if (parsed.data.quiz_attempts) {
                setQuizAttempts(parsed.data.quiz_attempts);
              }

              // Load dismissed quizzes
              if (parsed.data.dismissed_quizzes) {
                setDismissedQuizzes(parsed.data.dismissed_quizzes);
              }
            }
          } catch (error) {
            console.error('Failed to load localStorage progress:', error);
          }
        }
      }

      // Don't auto-select first topic, let user click to expand
      if (!selectedTopic) {
        const firstTopic = Object.keys(course.topics)[0];
        setSelectedTopic(firstTopic);
        if (course.topics[firstTopic]?.length > 0) {
          setSelectedSubtopic(course.topics[firstTopic][0]);
        }
      }
    }

    // Load user theme
    const studentSession = SessionManager.getSession();
    if (studentSession?.id) {
      loadUserTheme(studentSession.id);
    }
  }, [course]);

  // Force video tab when subtopic changes via navigation
  useEffect(() => {
    if (selectedSubtopic) {
      console.log('Subtopic changed to:', selectedSubtopic, 'forcing video tab');
      setActiveTab('video');
    }
  }, [selectedSubtopic]);

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

  // Simulate progress tracking for demo
  const simulateProgress = () => {
    if (selectedSubtopic) {
      const currentProgress = watchPercentages[selectedSubtopic] || 0;
      const newProgress = Math.min(currentProgress + 10, 100);
      
      setWatchPercentages(prev => ({
        ...prev,
        [selectedSubtopic]: newProgress
      }));
      
      if (newProgress >= 90 && !completed.includes(selectedSubtopic)) {
        setCompleted(prev => [...prev, selectedSubtopic]);
      }
    }
  };





  const handleTopicClick = (topic: string) => {
    console.log('Topic clicked:', topic);
    console.log('Course topics:', course.topics);
    console.log('Subtopics for topic:', course.topics[topic]);
    setSelectedTopic(topic);
    if (course.topics[topic]?.length > 0) {
      setSelectedSubtopic(course.topics[topic][0]);
    } else {
      setSelectedSubtopic(null);
    }
  };

  const handleSubtopicClick = (subtopic: string) => {
    console.log('Subtopic clicked:', subtopic);
    setSelectedSubtopic(subtopic);
    // Keep the current active tab instead of changing it
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const markComplete = (subtopic: string) => {
    if (!completed.includes(subtopic)) {
      setCompleted([...completed, subtopic]);
      setWatchPercentages(prev => ({ ...prev, [subtopic]: 100 }));
    }
  };

  const handleVideoProgress = async (progress: number, currentTime?: number) => {
    if (selectedSubtopic) {
      // Update local state
      setWatchPercentages(prev => {
        const updated = { ...prev, [selectedSubtopic]: progress };
        console.log('Updated progress for', selectedSubtopic, ':', progress);
        return updated;
      });

      // Save to database (but don't block UI)
      updateProgress(selectedSubtopic, progress).catch(err =>
        console.error('Failed to update progress:', err)
      );

      if (currentTime !== undefined) {
        saveVideoProgress(selectedSubtopic, progress, currentTime).catch(err =>
          console.error('Failed to save video progress:', err)
        );
      }

      // Reset dismissed quiz if user is replaying the video (progress goes below 100%)
      if (progress < 100 && completed.includes(selectedSubtopic)) {
        setDismissedQuizzes(prev => ({ ...prev, [selectedSubtopic]: false }));
      }

      // Only mark as completed if progress is 100% or more AND not already completed
      if (progress >= 100 && !completed.includes(selectedSubtopic)) {
        const newCompleted = [...completed, selectedSubtopic];
        setCompleted(newCompleted);

        // Ensure 100% progress for completed video
        setWatchPercentages(prev => ({ ...prev, [selectedSubtopic]: 100 }));

        // Update database with completed topics
        const session = SessionManager.getSession();
        if (session?.id && course?.id) {
          const updatedProgress = { ...watchPercentages, [selectedSubtopic]: 100 };
          updateProgressInDatabase(updatedProgress, newCompleted).catch(err =>
            console.error('Failed to update database:', err)
          );
        }

        console.log('Video completed! Updated completed list:', newCompleted);

        // Check if entire course is completed and update enrollment status
        const allSubtopics = Object.values(course.topics).flat();
        const isCourseCompleted = allSubtopics.every(subtopic => newCompleted.includes(subtopic));

        if (isCourseCompleted) {
          console.log('Course completed! Updating enrollment status');
          // Update enrollment status to completed
          updateEnrollmentStatus(course.id, 'completed').catch(err =>
            console.error('Failed to update enrollment status:', err)
          );
        }

        // Auto-show quiz when video is completed (only for completed videos)
        if (selectedSubtopic && quizQuestions[selectedSubtopic]) {
          setTimeout(() => {
            setShowQuiz(true);
          }, 1000);
        }
      }
    }
  };

  const getProgressColor = (percent: number): string => {
    if (percent >= 100) return "progress-complete";
    if (percent >= 80) return "progress-high";
    if (percent >= 40) return "progress-medium";
    return "progress-low";
  };

  const getProgressBadge = (subtopic: string) => {
    const percent = watchPercentages[subtopic] || 0;
    const isCompleted = completed.includes(subtopic);
    if (isCompleted || percent >= 100) return "🏆";
    if (percent >= 80) return "⭐";
    if (percent >= 40) return "🟢";
    if (percent >= 20) return "🟡";
    return "⚪";
  };

  const calculateCourseProgress = () => {
    const allSubtopics = Object.values(course.topics || {}).flat();
    if (allSubtopics.length === 0) return 0;
    const completedCount = allSubtopics.filter(subtopic => 
      completed.includes(subtopic) || (watchPercentages[subtopic] || 0) >= 90
    ).length;
    console.log('Calculating progress - All subtopics:', allSubtopics);
    console.log('Completed subtopics:', completed);
    console.log('Watch percentages:', watchPercentages);
    console.log('Completed count:', completedCount, 'Total:', allSubtopics.length);
    return Math.round((completedCount / allSubtopics.length) * 100);
  };

  const isTopicCompleted = (topic: string) => {
    const topicSubtopics = course.topics[topic] || [];
    return topicSubtopics.every(subtopic => 
      completed.includes(subtopic) || watchPercentages[subtopic] >= 90
    );
  };

  const isSubtopicCompleted = (subtopic: string) => {
    // Only consider completed if explicitly marked as completed in the database
    // Don't auto-complete based on watch percentage to prevent quiz spam
    return completed.includes(subtopic);
  };

  const handleQuizStart = () => {
    if (selectedSubtopic && isSubtopicCompleted(selectedSubtopic)) {
      setShowQuiz(true);
      setCurrentQuestionIndex(0);
      setSelectedAnswers([]);
      setQuizCompleted(false);
      setQuizResult(null);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    const questions = quizQuestions[selectedSubtopic!] || [];
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleQuizSubmit();
    }
  };

  const handleQuizSubmit = async () => {
    const questions = quizQuestions[selectedSubtopic!] || [];
    const score = selectedAnswers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index]?.correctAnswer ? 1 : 0);
    }, 0);
    
    const result: QuizResult = {
      score,
      totalQuestions: questions.length,
      answers: selectedAnswers
    };
    
    setQuizResult(result);
    setQuizCompleted(true);
    
    // Mark quiz as attempted for this subtopic
    if (selectedSubtopic) {
      setQuizAttempts(prev => ({ ...prev, [selectedSubtopic]: true }));
    }
    
    // Store result in database
    await saveQuizResult(result);
    
    // Update quiz scores for stats
    const percentage = Math.round((result.score / result.totalQuestions) * 100);
    if (selectedSubtopic) {
      setQuizScores(prev => ({
        ...prev,
        [selectedSubtopic]: [...(prev[selectedSubtopic] || []), percentage]
      }));
    }
    
    // Save to localStorage
    const session = SessionManager.getSession();
    const userId = session?.id || 'guest';
    localStorage.setItem(`quizAttempts_${currentCourseId}_${userId}`, JSON.stringify(quizAttempts));
    localStorage.setItem(`quizScores_${currentCourseId}_${userId}`, JSON.stringify(quizScores));
  };

  const saveQuizResult = async (result: QuizResult) => {
    const studentSession = SessionManager.getSession();
    if (!studentSession?.id || !selectedSubtopic) return;

    try {
      const quizData = {
        student_id: parseInt(studentSession.id.toString()),
        course_id: course?.id || 5,
        topic: selectedSubtopic,
        score: result.score,
        total_questions: result.totalQuestions,
        answers: result.answers,
        percentage: Math.round((result.score / result.totalQuestions) * 100),
        quiz_type: 'topic_quiz',
        time_taken: 120
      };
      
      console.log('Saving quiz result:', quizData);
      
      const response = await fetch('http://localhost:8001/api/courses/save_quiz_result/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData)
      });
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('Quiz saved successfully:', responseData);
        return responseData;
      } else {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }
    } catch (error) {
      console.error('Failed to save quiz result:', error);
    }
  };

  const closeQuiz = () => {
    setShowQuiz(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setQuizCompleted(false);
    setQuizResult(null);
    // Mark quiz as dismissed when user cancels
    if (selectedSubtopic) {
      setDismissedQuizzes(prev => ({ ...prev, [selectedSubtopic]: true }));
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setQuizCompleted(false);
    setQuizResult(null);
  };

  const handlePlay = () => {
    if (selectedSubtopic && pdfTextContent[selectedSubtopic]) {
      const utterance = new SpeechSynthesisUtterance(pdfTextContent[selectedSubtopic]);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
      setIsPlaying(true);
      utteranceRef.current = utterance;
    }
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const renderContentViewer = () => {
    if (!selectedSubtopic) return null;

    switch (selectedContentType) {
      case 'pdf':
        return readingMaterials[selectedSubtopic] ? (
          <iframe
            src={`${readingMaterials[selectedSubtopic]}#toolbar=0&navpanes=0&scrollbar=0`}
            width="100%"
            height="400px"
            style={{ border: 'none' }}
          />
        ) : (
          <div className="content-placeholder">
            📄 PDF content will be available soon
          </div>
        );
      case 'ppt':
        return (
          <div className="ppt-container">
            <div className="ppt-slide">
              <h2>{selectedSubtopic}</h2>
              <h3>Key Points:</h3>
              <ul>
                <li>Understanding the fundamentals</li>
                <li>Practical applications</li>
                <li>Best practices</li>
              </ul>
            </div>
          </div>
        );
      case 'doc':
        return (
          <div className="doc-container">
            <div className="doc-content">
              <h2>{selectedSubtopic}</h2>
              <div className="doc-text">
                {pdfTextContent[selectedSubtopic] || "Document content will be available soon."}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const downloadMaterial = () => {
    if (selectedSubtopic && readingMaterials[selectedSubtopic]) {
      const link = document.createElement('a');
      link.href = readingMaterials[selectedSubtopic];
      link.download = `${selectedSubtopic}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getCurrentSubtopicIndex = () => {
    if (!selectedTopic || !selectedSubtopic) return -1;
    const subtopics = course.topics[selectedTopic] || [];
    return subtopics.indexOf(selectedSubtopic);
  };

  const navigateToPrevious = async () => {
    if (!selectedTopic) return;
    const subtopics = course.topics[selectedTopic] || [];
    const currentIndex = getCurrentSubtopicIndex();
    if (currentIndex > 0) {
      // Save current video progress before navigating
      if (videoPlayerRef.current && selectedSubtopic) {
        const currentTime = videoPlayerRef.current.getCurrentTime();
        // Get the latest progress from state, or calculate it if needed
        const progress = watchPercentages[selectedSubtopic] || 0;
        await saveVideoProgress(selectedSubtopic, progress, currentTime);
        console.log('Saved progress before navigation:', selectedSubtopic, progress, currentTime);
      }

      const prevSubtopic = subtopics[currentIndex - 1];
      console.log('Navigating to previous subtopic:', prevSubtopic);
      setSelectedSubtopic(prevSubtopic);
    }
  };

  const navigateToNext = async () => {
    if (!selectedTopic) return;
    const subtopics = course.topics[selectedTopic] || [];
    const currentIndex = getCurrentSubtopicIndex();
    if (currentIndex < subtopics.length - 1) {
      // Save current video progress before navigating
      if (videoPlayerRef.current && selectedSubtopic) {
        const currentTime = videoPlayerRef.current.getCurrentTime();
        // Get the latest progress from state
        const progress = watchPercentages[selectedSubtopic] || 0;
        await saveVideoProgress(selectedSubtopic, progress, currentTime);
        console.log('Saved progress before navigation:', selectedSubtopic, progress, currentTime);
      }

      const nextSubtopic = subtopics[currentIndex + 1];
      console.log('Navigating to next subtopic:', nextSubtopic);
      setSelectedSubtopic(nextSubtopic);
    }
  };

  const handleTabChange = (tab: 'video' | 'reading') => {
    if (videoPlayerRef.current) {
      if (tab === 'reading' && activeTab === 'video') {
        pausedTimeRef.current = videoPlayerRef.current.getCurrentTime();
        videoPlayerRef.current.pause();
      } else if (tab === 'video' && activeTab === 'reading') {
        videoPlayerRef.current.setCurrentTime(pausedTimeRef.current);
        videoPlayerRef.current.play();
      }
    }
    setActiveTab(tab);
  };

  const filteredTopics = Object.keys(course.topics || {}).filter(topic =>
    topic.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="subject-loading">
        <div className="spinner"></div>
        <p>Loading course content...</p>
      </div>
    );
  }

  // Show error message if API failed but still render with fallback data
  const showErrorMessage = error && !courseResponse?.data;

  return (
    <div className="subject-page-wrapper">
      {showErrorMessage && (
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          color: '#856404',
          padding: '10px',
          margin: '10px',
          borderRadius: '5px',
          textAlign: 'center'
        }}>
          ⚠️ Could not load course data from server. Showing demo content for Course ID: {currentCourseId}
        </div>
      )}
      <button className="subject-sidebar-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? <FaTimes size={18} /> : <FaChevronRight size={18} />}
      </button>
      {/* Remainder of layout and rendering logic remains unchanged */}
    
    <div className="subject-page-container">
    {/* Sidebar */}
    {isSidebarOpen && (
      <aside className="subject-sidebar">
        <div className="subject-sidebar-header">
          <Link to="/courses" className="back-button">
            <FaArrowLeft /> Back to Courses
          </Link>
          <h3>{course.title}</h3>
          <div className="course-meta-info">
            <div>
              <FaChalkboardTeacher /> {course.instructor_name}
            </div>
            <div>
              <FaCalendarAlt /> {course.level} Level • {course.duration_hours}h
            </div>
          </div>
        </div>

        <div className="sidebar-search">
          <input
            type="text"
            className="topic-search"
            placeholder="Search topics..."
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
              className={`progress-bar-fill ${getProgressColor(calculateCourseProgress())}`}
              style={{ 
                width: `${calculateCourseProgress()}%` 
              }}
            ></div>
          </div>
        </div>

        <h4 className="sidebar-section-title">Course Content</h4>
        <ul className="sidebar-topics">
          {filteredTopics.map((topic, index) => {
            // Calculate topic progress
            const topicSubtopics = course.topics[topic] || [];
            const completedInTopic = topicSubtopics.filter(st => 
              completed.includes(st)
            ).length;
            const topicProgress = `${completedInTopic}/${topicSubtopics.length}`;
            console.log(`Topic ${topic} progress: ${topicProgress}, completed in topic:`, completedInTopic);
            
            console.log(`Rendering topic: ${topic}, selected: ${selectedTopic}, isActive: ${selectedTopic === topic}`);
            
            return (
              <li
                key={index}
                onClick={() => handleTopicClick(topic)}
                className={`topic-item ${selectedTopic === topic ? "active" : ""}`}
              >
                <div className="topic-item-header">
                  <span className="topic-item-name">
                    <FaBook className="topic-icon" /> {topic}
                  </span>
                  <span className="topic-progress-badge">
                    {topicProgress}
                  </span>
                </div>
                
                {selectedTopic === topic && course.topics[topic] && (
                  <ul className="subtopics-list">
                    {course.topics[topic].map((subtopic, idx) => (
                      <li
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubtopicClick(subtopic);
                        }}
                        className={`subtopic-item ${
                          selectedSubtopic === subtopic ? "active" : ""
                        }`}
                      >
                        <span className="subtopic-name">{subtopic}</span>
                        <span className="subtopic-badge">
                          {getProgressBadge(subtopic)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </aside>
    )}

    {/* Main Content Area */}
    <div className="subject-main-content">
      {/* Content Header */}
      <div className="content-header">
        <h2>{selectedTopic || course.title}</h2>
        <p>{selectedSubtopic || course.description}</p>
      </div>

      {/* Content Section with Tabs */}
      {selectedSubtopic && (
        <div className="content-section">
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button 
              className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
              onClick={() => handleTabChange('video')}
            >
              <FaVideo /> Video
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reading' ? 'active' : ''}`}
              onClick={() => handleTabChange('reading')}
            >
              <FaFileAlt /> Reading Material
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'video' && (
              <div className="video-tab">
                <div className="video-container">
                  {localVideoMapping[selectedSubtopic] ? (
                    <VideoPlayer
                      key={selectedSubtopic}
                      videoUrl={localVideoMapping[selectedSubtopic]}
                      courseId={course.id}
                      videoId={selectedSubtopic}
                      onProgressUpdate={handleVideoProgress}
                      ref={videoPlayerRef}
                    />
                  ) : (
                    <div className="video-placeholder">
                      <div className="play-button">
                        <FaPlay />
                      </div>
                      <p>Video content for: {selectedSubtopic}</p>
                      <p className="video-note">Video will be available soon</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reading' && (
              <div className="reading-tab">
                <div className="content-type-buttons">
                  <button 
                    className={`content-type-btn ${selectedContentType === 'pdf' ? 'active' : ''}`}
                    onClick={() => setSelectedContentType('pdf')}
                  >
                    <FaFileAlt /> PDF
                  </button>
                  <button 
                    className={`content-type-btn ${selectedContentType === 'ppt' ? 'active' : ''}`}
                    onClick={() => setSelectedContentType('ppt')}
                  >
                    <FaFilePowerpoint /> PPT
                  </button>
                  <button 
                    className={`content-type-btn ${selectedContentType === 'doc' ? 'active' : ''}`}
                    onClick={() => setSelectedContentType('doc')}
                  >
                    <FaFileWord /> DOC
                  </button>
                </div>
                
                <div className="content-viewer">
                  {renderContentViewer()}
                </div>
                
                <div className="audio-controls">
                  <button 
                    className="audio-btn"
                    onClick={handlePlay}
                    disabled={isPlaying}
                  >
                    <FaPlay /> Play Audio
                  </button>
                  <button 
                    className="audio-btn"
                    onClick={handleStop}
                    disabled={!isPlaying}
                  >
                    <FaStop /> Stop Audio
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Progress tracking */}
          <div className="progress-tracking">
            <div className="progress-label">
              <span>Progress: {videoProgressLoading ? 'Loading...' : `${watchPercentages[selectedSubtopic] || 0}%`}</span>
              {(watchPercentages[selectedSubtopic] || 0) >= 100 && !videoProgressLoading && (
                <span className="completed-badge">Completed ✓</span>
              )}
            </div>
            <div className="progress-bar-container">
              <div
                className={`progress-bar-fill ${getProgressColor(watchPercentages[selectedSubtopic] || 0)}`}
                style={{
                  width: videoProgressLoading ? '0%' : `${watchPercentages[selectedSubtopic] || 0}%`
                }}
              ></div>
            </div>
          </div>
          
          <div className="content-controls">
            <button className="control-btn" onClick={downloadMaterial}>
              <FaFileDownload /> Download Materials
            </button>
          </div>
          
          <div className="subtopic-navigation">
            <button 
              className="nav-btn prev"
              onClick={navigateToPrevious}
              disabled={getCurrentSubtopicIndex() <= 0}
            >
              <FaChevronLeft /> Previous
            </button>
            <button 
              className="nav-btn next"
              onClick={navigateToNext}
              disabled={getCurrentSubtopicIndex() >= (course.topics[selectedTopic!]?.length || 0) - 1}
            >
              Next <FaChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* Subtopic Quiz Section - Only show for truly completed videos */}
      {selectedSubtopic && completed.includes(selectedSubtopic) && !showQuiz && !dismissedQuizzes[selectedSubtopic] && (
        <div className="quiz-prompt">
          <div className="quiz-prompt-content">
            <h3>🎉 Video Completed!</h3>
            <p>You've finished watching "{selectedSubtopic}". Ready for a quick quiz?</p>
            <button className="start-quiz-btn" onClick={handleQuizStart}>
              <FaPen /> {quizAttempts[selectedSubtopic] ? 'Retake Quiz' : 'Start Quiz'}
            </button>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuiz && selectedSubtopic && (
        <div className="quiz-modal">
          <div className="quiz-content">
            {!quizCompleted ? (
              <div className="quiz-question">
                <div className="quiz-header">
                  <h3>Quiz: {selectedSubtopic}</h3>
                  <span className="question-counter">
                    {currentQuestionIndex + 1} / {quizQuestions[selectedSubtopic]?.length || 0}
                  </span>
                </div>
                
                {quizQuestions[selectedSubtopic] && quizQuestions[selectedSubtopic][currentQuestionIndex] && (
                  <div className="question-content">
                    <h4>{quizQuestions[selectedSubtopic][currentQuestionIndex].question}</h4>
                    <div className="answer-options">
                      {quizQuestions[selectedSubtopic][currentQuestionIndex].options.map((option, index) => (
                        <button
                          key={index}
                          className={`option-btn ${selectedAnswers[currentQuestionIndex] === index ? 'selected' : ''}`}
                          onClick={() => handleAnswerSelect(index)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    
                    <div className="quiz-actions">
                      <button className="close-quiz-btn" onClick={closeQuiz}>
                        Cancel
                      </button>
                      <button 
                        className="next-question-btn"
                        onClick={handleNextQuestion}
                        disabled={selectedAnswers[currentQuestionIndex] === undefined}
                      >
                        {currentQuestionIndex === (quizQuestions[selectedSubtopic]?.length || 0) - 1 ? 'Submit' : 'Next'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="quiz-results">
                <h3>Quiz Results: {selectedSubtopic}</h3>
                <div className="score-display">
                  <div className="score-circle">
                    <span className="score-text">
                      {quizResult?.score || 0}/{quizResult?.totalQuestions || 0}
                    </span>
                  </div>
                  <p className="score-percentage">
                    Percentage: {Math.round(((quizResult?.score || 0) / (quizResult?.totalQuestions || 1)) * 100)}%
                  </p>
                </div>
                
                <div className="stats-display">
                  {(() => {
                    const stats = studentStatsResponse?.data;
                    const currentPercentage = quizResult ? Math.round((quizResult.score / quizResult.totalQuestions) * 100) : 0;
                    const allScores = selectedSubtopic && quizScores[selectedSubtopic] ? quizScores[selectedSubtopic] : [];
                    const highestScore = stats?.highest_score || (allScores.length > 0 ? Math.max(...allScores) : currentPercentage);
                    const averageScore = stats?.average_score || (allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : currentPercentage);
                    const totalAttempts = stats?.total_attempts || (quizCompleted ? 1 : 0);
                    return (
                      <>
                        <p>Highest Score: <span>{highestScore}%</span></p>
                        <p>Average Score: <span>{averageScore}%</span></p>
                        <p>Total Attempts: <span>{totalAttempts}</span></p>
                      </>
                    );
                  })()}
                </div>
                
                <div className="quiz-feedback">
                  {((quizResult?.score || 0) / (quizResult?.totalQuestions || 1)) >= 0.8 ? (
                    <p className="success-message">🎉 Outstanding! You've earned the Master Badge! 🌟</p>
                  ) : ((quizResult?.score || 0) / (quizResult?.totalQuestions || 1)) >= 0.6 ? (
                    <p className="good-message">👍 Well done! You've earned the Explorer Badge! 🔍</p>
                  ) : (
                    <p className="retry-message">📚 Nice try! Review and retry for the Learner Badge! 📖</p>
                  )}
                </div>
                
                <div className="quiz-actions">
                  <button className="close-quiz-btn" onClick={closeQuiz}>
                    Close
                  </button>
                  <button className="retake-quiz-btn" onClick={handleRetakeQuiz}>
                    <FaRedo /> Retake Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assessments & Activities Section */}
      <div className="assessments-section">
        <div className="section-header">
          <h3>Upcoming Assessments</h3>
          <button className="view-all-btn">View All</button>
        </div>
        
        <div className="assessment-cards">
          {assessments.map(assessment => (
            <div key={assessment.id} className="assessment-card">
              <div className="assessment-icon">
                {assessment.type === 'Quiz' && <FaPen />}
                {assessment.type === 'Assignment' && <FaFileDownload />}
                {assessment.type === 'Exam' && <FaBook />}
              </div>
              <div className="assessment-details">
                <h4>{assessment.title}</h4>
                <div className="assessment-meta">
                  <span className="assessment-type">{assessment.type}</span>
                  <span className="assessment-deadline">
                    <FaClock /> {assessment.deadline}
                  </span>
                </div>
              </div>
              <div className={`assessment-status ${assessment.status.toLowerCase()}`}>
                {assessment.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gamified Learning Section */}
      <div className="games-section">
        <div className="section-header">
          <h3>Gamified Learning</h3>
          <button className="view-all-btn">View All</button>
        </div>
        
        <div className="game-cards">
          {games.map(game => (
            <div key={game.id} className="game-card">
              <div className="game-icon">{game.icon}</div>
              <div className="game-details">
                <h4>{game.title}</h4>
                <p>{game.description}</p>
              </div>
              <button className="play-game-btn">
                <FaGamepad /> Play
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="achievements-section">
        <div className="section-header">
          <h3>Your Achievements</h3>
        </div>
        
        <div className="achievements-content">
          <div className="achievement-stats">
            <div className="achievement-stat-card">
              <div className="stat-number">{completed.length}</div>
              <div className="stat-label">Topics Completed</div>
            </div>
            <div className="achievement-stat-card">
              <div className="stat-number">85%</div>
              <div className="stat-label">Quiz Average</div>
            </div>
            <div className="achievement-stat-card">
              <div className="stat-number">12</div>
              <div className="stat-label">Study Hours</div>
            </div>
          </div>
          
          <div className="achievement-badges">
            <div className="badge-item">
              <div className="badge-icon">🏆</div>
              <div className="badge-name">Calculus Master</div>
            </div>
            <div className="badge-item">
              <div className="badge-icon">⭐</div>
              <div className="badge-name">Quiz Champion</div>
            </div>
            <div className="badge-item">
              <div className="badge-icon">🎯</div>
              <div className="badge-name">Perfect Attendance</div>
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
