import React, { useState, useEffect } from 'react';
import SessionManager from '../utils/sessionManager';
import './StaticChatbot.css';

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

const StaticChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [studentSession] = useState(SessionManager.getSession());
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

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

  const loadMessages = () => {
    const storageKey = `chatbot-messages-${studentSession?.id || 'guest'}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([{ text: "Hi! I'm your student guide. Ask me about courses, assignments, or navigation!", isUser: false }]);
    }
  };

  const saveMessages = (newMessages: Message[]) => {
    const storageKey = `chatbot-messages-${studentSession?.id || 'guest'}`;
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
    
    // Greetings first
    if (input === 'hi' || input === 'hello' || input === 'hey') {
      return "Hello! I'm your student guide. What can I help you find today?";
    }
    
    // Navigation help
    if (input.includes('dashboard')) {
      return "📊 Go to your [Dashboard](/dashboard) to see your progress and overview.";
    }
    if (input.includes('assignment') || input.includes('homework')) {
      return "📝 Check your [Assignments](/assignments) page to view and submit your work.";
    }
    if (input.includes('performance') || input.includes('grade') || input.includes('score')) {
      return "📈 View your [Performance](/performance) to see grades and analytics.";
    }
    if (input.includes('profile') || input.includes('settings')) {
      return "⚙️ Update your [Settings](/settings) or complete your profile.";
    }
    if (input.includes('course')) {
      return "📚 Browse [All Courses](/courses) to see everything available.";
    }
    if (input.includes('category') || input.includes('subject')) {
      return "📚 Available categories: Science, Mathematics, Computer Science, English, History, Arts\n\n[Browse All Courses](/courses)";
    }
    
    // Course search by keyword
    const matchingCourses = courses.filter(course => {
      const titleMatch = course.title.toLowerCase().includes(input);
      const descMatch = course.description.toLowerCase().includes(input);
      const categoryLower = course.category.toLowerCase();
      
      // Smart category matching
      if (input.includes('math') && categoryLower === 'mathematics') return true;
      if (input.includes('computer') && categoryLower === 'computer science') return true;
      if (input.includes('science') && categoryLower === 'science') return true;
      if (input.includes('english') && categoryLower === 'english') return true;
      if (input.includes('history') && categoryLower === 'history') return true;
      if (input.includes('art') && categoryLower === 'arts') return true;
      
      return titleMatch || descMatch || categoryLower === input;
    });
    
    if (matchingCourses.length > 0) {
      const courseList = matchingCourses.map(course => `• [${course.title}](/course/${course.id}) (${course.category})`).join('\n');
      return `🎯 **Courses matching "${userInput}":**\n\n${courseList}\n\n[View All Courses](/courses)`;
    }
    
    // If no courses found but it's a category search, show message
    if (['math', 'maths', 'mathematics', 'computer', 'science', 'english', 'history', 'art', 'arts'].includes(input)) {
      return `No ${input} courses found. [Browse All Courses](/courses) to see what's available.`;
    }
    
    // General help
    if (input.includes('help') || input.includes('what') || input.includes('how')) {
      return "🤝 I can help you with:\n\n📚 Find courses by subject\n📝 Navigate to assignments\n📊 Check your dashboard\n📈 View performance\n⚙️ Access settings\n\nJust ask me anything!";
    }
    
    return "🔍 I can help you find courses or navigate the platform. Try asking about specific subjects, assignments, or where to find something!\n\nAvailable categories: Science, Mathematics, Computer Science, English, History, Arts";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { text: input, isUser: true };
    const botResponse: Message = { text: getResponse(input), isUser: false };

    const newMessages = [...messages, userMessage, botResponse];
    setMessages(newMessages);
    saveMessages(newMessages);
    setInput('');
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {!isOpen && (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}
      
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h3>Student Guide</h3>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="chatbot-messages" onScroll={(e) => {
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
          
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about courses, assignments, navigation..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default StaticChatbot;