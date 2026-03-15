import React, { useState, useEffect } from 'react';
import SessionManager from '../utils/sessionManager';
import { useNavigationAI } from '../hooks/useNavigationAI';
import './UnifiedAssistant.css';

interface Message {
  text: string;
  isUser: boolean;
}

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
}

const UnifiedAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [studentSession] = useState(SessionManager.getSession());
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const {
    isListening,
    isProcessing,
    command,
    response,
    suggestions,
    error,
    isVoiceSupported,
    startListening,
    processCommand,
    setCommand,
    executeCommand,
    executeQuickCommand,
  } = useNavigationAI({ userId: studentSession?.id?.toString(), userRole: 'student' });

  useEffect(() => {
    if (studentSession?.id) {
      fetchCourses();
      loadMessages();
    }
  }, [studentSession]);

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    setInput(command);
  }, [command]);

  // Handle navigation responses
  useEffect(() => {
    if (response) {
      const botMessage: Message = { text: response, isUser: false };
      setMessages(prev => {
        const newMessages = [...prev, botMessage];
        saveMessages(newMessages);
        return newMessages;
      });
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [response]);

  const loadMessages = () => {
    const storageKey = `assistant-messages-${studentSession?.id || 'guest'}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([{ text: "Hi! I'm your AI assistant. I can help you navigate, find courses, or answer questions!", isUser: false }]);
    }
  };

  const saveMessages = (newMessages: Message[]) => {
    const storageKey = `assistant-messages-${studentSession?.id || 'guest'}`;
    localStorage.setItem(storageKey, JSON.stringify(newMessages));
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`http://localhost:8001/api/courses/get_courses/?student_id=${studentSession?.id}`);
      const data = await response.json();
      if (data.status === 'success') {
        setCourses(data.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const getResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Greetings
    if (input === 'hi' || input === 'hello' || input === 'hey') {
      return "Hello! I'm your student guide and navigation assistant. I can help you:\n\n🧭 Navigate the platform\n📚 Find and understand courses\n📝 Manage assignments\n📊 Track your progress\n💡 Study tips and guidance\n\nWhat would you like help with?";
    }
    
    // Navigation responses
    if (input.includes('dashboard')) {
      return "📊 Your [Dashboard](/dashboard) shows:\n\n• Course progress overview\n• Recent activity\n• Upcoming deadlines\n• Performance metrics\n\n💡 **Tip:** Check your dashboard daily to stay on track!";
    }
    if (input.includes('assignment') || input.includes('homework')) {
      return "📝 [Assignments](/assignments) help you practice and learn:\n\n• View all pending tasks\n• Submit your work\n• Check due dates\n• See feedback from instructors\n\n💡 **Study Tip:** Break large assignments into smaller tasks and set mini-deadlines!";
    }
    if (input.includes('performance') || input.includes('grade') || input.includes('score')) {
      return "📈 Your [Performance](/performance) page shows:\n\n• Grades and scores\n• Progress analytics\n• Strengths and areas for improvement\n• Learning patterns\n\n💡 **Growth Mindset:** Focus on improvement, not just grades. Every mistake is a learning opportunity!";
    }
    if (input.includes('profile') || input.includes('settings')) {
      return "⚙️ [Settings](/settings) let you customize your experience:\n\n• Update personal information\n• Set learning preferences\n• Manage notifications\n• Privacy controls\n\n💡 **Tip:** Complete your profile to get personalized course recommendations!";
    }
    
    // Learning guidance
    if (input.includes('study') || input.includes('learn') || input.includes('tips')) {
      return "📖 Effective Study Strategies:\n\n🎯 Active Learning: Take notes, ask questions, practice problems\n⏰ Time Management: Use Pomodoro technique (25min study, 5min break)\n🔄 Spaced Repetition: Review material at increasing intervals\n👥 Study Groups: Collaborate with classmates\n🎯 Set Goals: Break learning into achievable milestones\n\n[View Study Resources](/resources)";
    }
    
    if (input.includes('motivation') || input.includes('stuck') || input.includes('difficult')) {
      return "💪 When Learning Gets Tough:\n\n🌱 Growth Mindset: Challenges help you grow stronger\n🎯 Small Steps: Break complex topics into smaller parts\n🤝 Ask for Help: Reach out to instructors or classmates\n🎉 Celebrate Progress: Acknowledge every small win\n⏸️ Take Breaks: Rest is part of effective learning\n\n[Get Support](/support) | [Study Groups](/groups)";
    }
    
    // Course-related guidance
    if (input.includes('course') && !input.includes('find')) {
      return "📚 Making the Most of Your Courses:\n\n📋 Before Starting: Review course outline and objectives\n📝 During Lessons: Take active notes and ask questions\n🔄 After Learning: Practice and review regularly\n📊 Track Progress: Monitor your understanding\n\n[Browse All Courses](/courses) | [My Enrolled Courses](/my-courses)";
    }
    
    // Course search and recommendations
    const matchingCourses = courses.filter(course => {
      const titleMatch = course.title.toLowerCase().includes(input);
      const descMatch = course.description.toLowerCase().includes(input);
      const categoryLower = course.category.toLowerCase();
      
      if (input.includes('math') && categoryLower === 'mathematics') return true;
      if (input.includes('computer') && categoryLower === 'computer science') return true;
      if (input.includes('science') && categoryLower === 'science') return true;
      if (input.includes('programming') && categoryLower === 'computer science') return true;
      if (input.includes('web') && course.title.toLowerCase().includes('web')) return true;
      if (input.includes('ai') && course.title.toLowerCase().includes('artificial')) return true;
      
      return titleMatch || descMatch || categoryLower === input;
    });
    
    if (matchingCourses.length > 0) {
      const courseList = matchingCourses.map(course => 
        `• [${course.title}](/course/${course.id}/learn) - ${course.level} level\n  ${course.description.substring(0, 80)}...`
      ).join('\n\n');
      return `🎯 Courses for "${userInput}":\n\n${courseList}\n\n💡 Learning Path: Start with beginner courses and progress gradually\n\n[View All Courses](/courses)`;
    }
    
    // Time management and productivity
    if (input.includes('time') || input.includes('schedule') || input.includes('organize')) {
      return "⏰ Time Management for Students:\n\n📅 Plan Your Week: Schedule study sessions in advance\n🎯 Prioritize: Focus on important and urgent tasks first\n⏱️ Time Blocking: Dedicate specific hours to specific subjects\n📱 Minimize Distractions: Turn off notifications during study\n🔄 Regular Breaks: 15-20 minutes every 2 hours\n\n[Calendar](/calendar) | [Task Planner](/planner)";
    }
    
    // Exam preparation
    if (input.includes('exam') || input.includes('test') || input.includes('quiz')) {
      return "📋 Exam Preparation Guide:\n\n📖 Review Strategy: Start 1-2 weeks before the exam\n📝 Practice Tests: Take mock exams to identify weak areas\n🧠 Memory Techniques: Use mnemonics and visual aids\n👥 Study Groups: Explain concepts to others\n😴 Rest Well: Get adequate sleep before exams\n\n[Practice Tests](/practice) | [Study Materials](/materials)";
    }
    
    // General help
    if (input.includes('help') || input.includes('what') || input.includes('how')) {
      return "🤝 I'm here to guide and assist you with:\n\n🧭 Navigation: Find any page or feature\n📚 Course Guidance: Choose and succeed in courses\n📝 Study Support: Learning strategies and tips\n📊 Progress Tracking: Monitor your growth\n💡 Academic Advice: Study tips and motivation\n🎯 Goal Setting: Plan your learning journey\n🗣️ Voice Commands: Hands-free navigation\n\nJust ask me anything about learning or navigating the platform!";
    }
    
    // Default response with guidance
    return "🤖 I'm your student guide! I can help you:\n\n🧭 Navigate: \"Go to dashboard\" or \"Show assignments\"\n📚 Find Courses: \"Find math courses\" or \"Show programming\"\n💡 Get Study Tips: \"How to study effectively\"\n📊 Track Progress: \"Check my performance\"\n\nTry asking about courses, study tips, or navigation!";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { text: input, isUser: true };
    
    // Check if it's a navigation command first
    const isNavigationCommand = input.toLowerCase().includes('go to') || 
                               input.toLowerCase().includes('show') || 
                               input.toLowerCase().includes('open') ||
                               input.toLowerCase().includes('navigate');
    
    if (isNavigationCommand) {
      // Use navigation AI for commands
      executeCommand(input);
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      saveMessages(newMessages);
    } else {
      // Use local response for general questions
      const botResponse: Message = { text: getResponse(input), isUser: false };
      const newMessages = [...messages, userMessage, botResponse];
      setMessages(newMessages);
      saveMessages(newMessages);
    }
    
    setInput('');
    setCommand('');
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: {text: string, command: string}) => {
    // Use executeQuickCommand for navigation
    executeQuickCommand(suggestion.command);
    
    // Add user message to chat
    const userMessage: Message = { text: suggestion.text, isUser: true };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    saveMessages(newMessages);
  };

  const handleVoiceClick = () => {
    if (isListening) return;
    startListening();
  };

  return (
    <>
      <div className="unified-assistant-trigger">
        <button 
          className="unified-assistant-btn"
          onClick={() => setIsOpen(!isOpen)}
          title="AI Assistant"
        >
          🤖
        </button>
      </div>
      
      {isOpen && (
        <div className="unified-assistant-container">
          <div className="unified-assistant-panel">
            <div className="unified-assistant-header">
              <div className="unified-assistant-title">
                <span className="unified-assistant-icon">🤖</span>
                <h3>Student Guide & Navigator</h3>
              </div>
              <button 
                className="unified-assistant-close"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="unified-assistant-content">
              <div className="unified-assistant-messages" onScroll={(e) => {
                const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
                setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
              }}>
                {messages.map((message, index) => (
                  <div key={index} className={`message ${message.isUser ? 'user' : 'bot'}`}>
                    {message.text.split('\n').map((line, i) => (
                      <div key={i}>
                        {line.includes('[') && line.includes('](') ? (
                          <span dangerouslySetInnerHTML={{
                            __html: line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
                          }} />
                        ) : (
                          line
                        )}
                      </div>
                    ))}
                  </div>
                ))}
                <div ref={messagesEndRef} />
                {showScrollButton && (
                  <button 
                    className="scroll-to-bottom"
                    onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    ↓
                  </button>
                )}
              </div>

              {showQuickActions && (
                <div className="unified-assistant-suggestions">
                  <div className="suggestion-grid">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className={`suggestion-btn ${suggestion.type}`}
                        onClick={() => {
                          handleSuggestionClick(suggestion);
                          setShowQuickActions(false);
                        }}
                      >
                        <span className="suggestion-icon">
                          {suggestion.type === 'course' ? '📚' : 
                           suggestion.type === 'task' ? '📝' : 
                           suggestion.type === 'game' ? '🎮' : 
                           suggestion.type === 'guidance' ? '💡' :
                           suggestion.type === 'greeting' ? '👋' :
                           suggestion.type === 'progress' ? '📊' : '🧭'}
                        </span>
                        {suggestion.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="unified-assistant-processing">
                  <div className="unified-assistant-spinner"></div>
                  <span>Processing...</span>
                </div>
              )}

              {error && (
                <div className="unified-assistant-error">
                  ⚠️ {error}
                </div>
              )}

              {response && (
                <div className="message bot">
                  {response}
                </div>
              )}

              <div className="unified-assistant-input">
                <button
                  type="button"
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="quick-actions-btn"
                  title="Quick Actions"
                >
                  ⚡
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type or speak your question..."
                />
                <button
                  type="button"
                  onClick={handleVoiceClick}
                  className={`voice-btn ${isListening ? 'listening' : ''}`}
                  disabled={!isVoiceSupported}
                  title={isVoiceSupported ? 'Click to speak' : 'Voice not supported'}
                >
                  {isListening ? '🎤' : '🎙️'}
                </button>
                <button onClick={handleSend}>Send</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UnifiedAssistant;