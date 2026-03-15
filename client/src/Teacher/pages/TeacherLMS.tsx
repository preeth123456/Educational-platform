import React, { useState, useEffect } from 'react';
import { ChevronRight, Plus, Play, BookOpen, Users, Video } from 'lucide-react';
import TeacherSidebarDemo from '../components/TeacherSidebar';
import NewHeader from '../components/NewHeader';
import SessionManager from '../../utils/sessionManager';
import '../styles/TeacherLMS.css';

interface Topic {
  id: number;
  name: string;
  description: string;
  video_url: string;
  created_at: string;
}

interface Lesson {
  name: string;
  topics: Topic[];
}

interface Chapter {
  name: string;
  lessons: { [key: string]: Lesson };
}

interface Subject {
  name: string;
  chapters: { [key: string]: Chapter };
}

interface ClassData {
  name: string;
  subjects: { [key: string]: Subject };
}

const TeacherLMS = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [classData, setClassData] = useState({});
  const [loading, setLoading] = useState(true);

  const [newTopic, setNewTopic] = useState({
    name: '',
    description: '',
    video_url: ''
  });

  const session = SessionManager.getSession();
  const teacherData = {
    name: session?.name || "Teacher",
    role: "Teacher",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  };

  const sidebarWidth = sidebarOpen ? 250 : 60;

  const fetchTeacherClasses = async () => {
    try {
      // Mock data structure for LMS
      const mockData = {
        "10": {
          name: "Class 10",
          subjects: {
            "Mathematics": {
              name: "Mathematics",
              chapters: {
                "Real Numbers": {
                  name: "Real Numbers",
                  lessons: {
                    "Introduction to Real Numbers": { name: "Introduction to Real Numbers", topics: [] },
                    "Euclids Division Lemma": { name: "Euclids Division Lemma", topics: [] },
                    "Fundamental Theorem of Arithmetic": { name: "Fundamental Theorem of Arithmetic", topics: [] }
                  }
                },
                "Polynomials": {
                  name: "Polynomials",
                  lessons: {
                    "Introduction to Polynomials": { name: "Introduction to Polynomials", topics: [] },
                    "Zeros of Polynomials": { name: "Zeros of Polynomials", topics: [] },
                    "Division Algorithm": { name: "Division Algorithm", topics: [] }
                  }
                },
                "Linear Equations": {
                  name: "Linear Equations",
                  lessons: {
                    "Pair of Linear Equations": { name: "Pair of Linear Equations", topics: [] },
                    "Graphical Method": { name: "Graphical Method", topics: [] },
                    "Algebraic Methods": { name: "Algebraic Methods", topics: [] }
                  }
                }
              }
            },
            "Science": {
              name: "Science",
              chapters: {
                "Light": {
                  name: "Light",
                  lessons: {
                    "Reflection of Light": { name: "Reflection of Light", topics: [] },
                    "Refraction of Light": { name: "Refraction of Light", topics: [] }
                  }
                },
                "Life Processes": {
                  name: "Life Processes",
                  lessons: {
                    "Nutrition": { name: "Nutrition", topics: [] },
                    "Respiration": { name: "Respiration", topics: [] }
                  }
                }
              }
            }
          }
        },
        "11": {
          name: "Class 11",
          subjects: {
            "Physics": {
              name: "Physics",
              chapters: {
                "Motion in a Straight Line": {
                  name: "Motion in a Straight Line",
                  lessons: {
                    "Position and Displacement": { name: "Position and Displacement", topics: [] },
                    "Velocity and Acceleration": { name: "Velocity and Acceleration", topics: [] }
                  }
                }
              }
            }
          }
        }
      };

      setClassData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching teacher classes:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherClasses();
  }, []);

  // Show message if no classes available
  if (!loading && Object.keys(classData).length === 0) {
    return (
      <div className="flex">
        <TeacherSidebarDemo open={sidebarOpen} setOpen={setSidebarOpen} />

        <div style={{ marginLeft: sidebarWidth + 16, flex: 1, transition: "all 0.3s ease", minHeight: "100vh" }}>
          <div style={{ position: "fixed", top: 0, left: sidebarWidth, right: 0, zIndex: 999 }}>
            <NewHeader avatar={teacherData.avatar} name={teacherData.name} role={teacherData.role} teacherId={session?.id} />
          </div>

          <div className="lms-container pt-32">
            <div className="max-w-4xl mx-auto px-8 text-center">
              <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
                <div className="text-8xl mb-6">📚</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">No Classes Available</h2>
                <p className="text-gray-600 text-lg mb-6">
                  It looks like you haven't been assigned any classes yet, or there might be an issue loading your data.
                </p>
                <p className="text-gray-500">
                  Please contact your administrator or check your registration details.
                </p>
                <button
                  onClick={fetchTeacherClasses}
                  className="lms-cta mt-6"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleCreateTopic = async () => {
    if (!newTopic.name || !selectedClass || !selectedSubject || !selectedChapter || !selectedLesson) {
      alert('Please fill all required fields and select a lesson');
      return;
    }

    // Create new topic with mock ID
    const newTopicData = {
      id: Date.now(),
      name: newTopic.name,
      description: newTopic.description,
      video_url: newTopic.video_url,
      created_at: new Date().toISOString()
    };

    // Update local state
    setClassData(prev => {
      const updated = { ...prev };
      if (!updated[selectedClass].subjects[selectedSubject].chapters[selectedChapter].lessons[selectedLesson].topics) {
        updated[selectedClass].subjects[selectedSubject].chapters[selectedChapter].lessons[selectedLesson].topics = [];
      }
      updated[selectedClass].subjects[selectedSubject].chapters[selectedChapter].lessons[selectedLesson].topics.push(newTopicData);
      return updated;
    });

    setNewTopic({ name: '', description: '', video_url: '' });
    setShowTopicModal(false);
    alert('Topic created successfully!');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex">
      <TeacherSidebarDemo open={sidebarOpen} setOpen={setSidebarOpen} />

      <div style={{ marginLeft: sidebarWidth + 16, flex: 1, transition: "all 0.3s ease", minHeight: "100vh" }}>
        <div style={{ position: "fixed", top: 0, left: sidebarWidth, right: 0, zIndex: 999 }}>
          <NewHeader avatar={teacherData.avatar} name={teacherData.name} role={teacherData.role} teacherId={session?.id} />
        </div>

        <div className="lms-container">
          {/* Hero Header */}
          <div className="lms-hero pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-8">
              <div className="flex justify-between items-center">
                <div className="text-white">
                  <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                      🎓
                    </div>
                    Learning Management System
                  </h1>
                  <p className="text-indigo-100 text-lg">Create and manage your educational content with ease</p>
                </div>
                {selectedLesson && (
                  <button
                    onClick={() => setShowTopicModal(true)}
                    className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl flex items-center gap-3 hover:bg-white/30 transition-all shadow-xl border border-white/30"
                  >
                    <Plus size={24} />
                    <span className="font-semibold">Create New Topic</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-8 -mt-8">

            <div className="grid grid-cols-12 gap-8">
              {/* Classes Panel */}
              <div className="col-span-3">
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="lms-card-accent p-3 rounded-2xl">
                      <Users size={24} className="text-slate-700" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">My Classes</h2>
                      <p className="text-sm text-gray-500">Select a class to start</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {Object.keys(classData).map(className => (
                      <div
                        key={className}
                        onClick={() => {
                          setSelectedClass(className);
                          setSelectedSubject('');
                          setSelectedChapter('');
                          setSelectedLesson('');
                        }}
                        className={`group p-4 rounded-2xl cursor-pointer transition-all duration-300 ${selectedClass === className
                            ? 'selected-class shadow-sm transform scale-102'
                            : 'hover:bg-gray-50 hover:shadow-md border border-gray-100'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`font-bold text-lg ${selectedClass === className ? 'text-strong' : 'text-gray-800'
                              }`}>Class {className}</div>
                            <div className={`text-sm ${selectedClass === className ? 'muted' : 'text-gray-500'
                              }`}>
                              {Object.keys(classData[className]?.subjects || {}).length} subjects
                            </div>
                          </div>
                          <div className={`text-2xl transition-transform group-hover:scale-110 ${selectedClass === className ? 'rotate-12' : ''
                            }`}>
                            📚
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Subjects Panel */}
              <div className="col-span-3">
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="lms-card-accent p-3 rounded-2xl">
                      <BookOpen size={24} className="text-slate-700" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Subjects</h2>
                      <p className="text-sm text-gray-500">Choose your subject</p>
                    </div>
                  </div>
                  {selectedClass ? (
                    <div className="space-y-3">
                      {Object.keys(classData[selectedClass]?.subjects || {}).map(subjectName => (
                        <div
                          key={subjectName}
                          onClick={() => {
                            setSelectedSubject(subjectName);
                            setSelectedChapter('');
                            setSelectedLesson('');
                          }}
                          className={`group p-4 rounded-2xl cursor-pointer transition-all duration-300 ${selectedSubject === subjectName
                              ? 'selected-subject shadow-sm transform scale-102'
                              : 'hover:bg-gray-50 hover:shadow-md border border-gray-100'
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className={`font-bold ${selectedSubject === subjectName ? 'text-strong' : 'text-gray-800'
                                }`}>{subjectName}</div>
                              <div className={`text-sm ${selectedSubject === subjectName ? 'muted' : 'text-gray-500'
                                }`}>
                                {Object.keys(classData[selectedClass].subjects[subjectName]?.chapters || {}).length} chapters
                              </div>
                            </div>
                            <div className={`text-xl transition-transform group-hover:scale-110 ${selectedSubject === subjectName ? 'rotate-12' : ''
                              }`}>
                              {subjectName === 'Mathematics' ? '🔢' : subjectName === 'Science' ? '🔬' : '📖'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4 opacity-20">📚</div>
                      <p className="text-gray-400">Select a class first</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Chapters Panel */}
              <div className="col-span-3">
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="lms-card-accent p-3 rounded-2xl">
                      <BookOpen size={24} className="text-slate-700" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Chapters</h2>
                      <p className="text-sm text-gray-500">Browse chapters</p>
                    </div>
                  </div>
                  {selectedSubject ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                      {Object.keys(classData[selectedClass]?.subjects[selectedSubject]?.chapters || {}).map(chapterName => (
                        <div
                          key={chapterName}
                          onClick={() => {
                            setSelectedChapter(chapterName);
                            setSelectedLesson('');
                          }}
                          className={`group p-4 rounded-2xl cursor-pointer transition-all duration-300 ${selectedChapter === chapterName
                              ? 'selected-chapter shadow-sm transform scale-102'
                              : 'hover:bg-gray-50 hover:shadow-md border border-gray-100'
                            }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className={`font-bold text-sm leading-tight mb-1 ${selectedChapter === chapterName ? 'text-strong' : 'text-gray-800'
                                }`}>{chapterName}</div>
                              <div className={`text-xs ${selectedChapter === chapterName ? 'muted' : 'text-gray-500'
                                }`}>
                                {Object.keys(classData[selectedClass].subjects[selectedSubject].chapters[chapterName]?.lessons || {}).length} lessons
                              </div>
                            </div>
                            <div className={`text-lg transition-transform group-hover:scale-110 ${selectedChapter === chapterName ? 'rotate-12' : ''
                              }`}>
                              📑
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4 opacity-20">📖</div>
                      <p className="text-gray-400">Select a subject first</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Lessons & Topics Panel */}
              <div className="col-span-3">
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="lms-card-accent p-3 rounded-2xl">
                      <Video size={24} className="text-slate-700" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Lessons & Topics</h2>
                      <p className="text-sm text-gray-500">Manage your content</p>
                    </div>
                  </div>
                  {selectedChapter ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                      {Object.entries(classData[selectedClass]?.subjects[selectedSubject]?.chapters[selectedChapter]?.lessons || {}).map(([lessonName, lesson]) => (
                        <div key={lessonName} className="border-2 border-gray-100 rounded-2xl overflow-hidden">
                          <div
                            onClick={() => setSelectedLesson(selectedLesson === lessonName ? '' : lessonName)}
                            className={`cursor-pointer p-4 transition-all duration-300 ${selectedLesson === lessonName
                                ? 'selected-lesson'
                                : 'hover:bg-gray-50 bg-white'
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`text-xl ${selectedLesson === lessonName ? 'animate-bounce' : ''
                                  }`}>
                                  🎯
                                </div>
                                <div>
                                  <span className={`font-bold ${selectedLesson === lessonName ? 'text-white' : 'text-gray-800'
                                    }`}>{lessonName}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`text-xs px-3 py-1 rounded-full font-medium ${selectedLesson === lessonName
                                    ? 'selected-pill'
                                    : 'bg-gray-200 text-gray-600'
                                  }`}>
                                  {lesson.topics?.length || 0} topics
                                </span>
                                <ChevronRight size={20} className={`transition-transform duration-300 ${selectedLesson === lessonName ? 'rotate-90' : ''
                                  }`} />
                              </div>
                            </div>
                          </div>

                          {selectedLesson === lessonName && (
                            <div className="p-4 bg-gray-50">
                              {lesson.topics?.length > 0 ? (
                                <div className="space-y-4">
                                  {lesson.topics.map(topic => (
                                    <div key={topic.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                      <div className="flex items-start gap-4">
                                        <div className="lms-card-accent p-3 rounded-xl">
                                          <Play size={20} className="text-slate-700" />
                                        </div>
                                        <div className="flex-1">
                                          <h4 className="font-bold text-gray-800 mb-2 text-lg">{topic.name}</h4>
                                          {topic.description && (
                                            <p className="text-gray-600 mb-4 leading-relaxed">{topic.description}</p>
                                          )}
                                          {topic.video_url && (
                                            <a
                                              href={topic.video_url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-700 transition-all duration-300 shadow-lg"
                                            >
                                              <Video size={16} />
                                              Watch Video
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-12">
                                  <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                    <Video size={32} className="text-gray-400" />
                                  </div>
                                  <p className="text-gray-500 font-medium mb-2">No topics created yet</p>
                                  <p className="text-gray-400 text-sm">Click "Create New Topic" to add your first topic</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="text-8xl mb-6 opacity-20">🎯</div>
                      <p className="text-gray-400 text-lg">Select a chapter to view lessons</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Topic Modal */}
      {showTopicModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Plus size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Create New Topic</h3>
                <p className="text-sm text-gray-600">Add a new topic to {selectedLesson}</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Topic Title *</label>
                <input
                  type="text"
                  value={newTopic.name}
                  onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                  placeholder="e.g., Introduction to Quadratic Equations"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Description</label>
                <textarea
                  value={newTopic.description}
                  onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                  rows={4}
                  placeholder="Describe what students will learn in this topic..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Video Link</label>
                <input
                  type="url"
                  value={newTopic.video_url}
                  onChange={(e) => setNewTopic({ ...newTopic, video_url: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                  placeholder="https://youtube.com/watch?v=... or any video URL"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowTopicModal(false)}
                className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTopic}
                disabled={!newTopic.name}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Topic
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherLMS;
