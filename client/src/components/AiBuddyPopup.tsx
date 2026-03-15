import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import "./AiBuddyPopup.css";

interface AiBuddyPopupProps {
  studentName: string;
}

const SpeakingAvatar = ({ speaking }: { speaking: boolean }) => (
  <div className="ai-speaking-avatar">
    <div className={`ai-avatar-face ${speaking ? "speaking" : ""}`}>
      <span role="img" aria-label="AI Buddy" className="ai-avatar-emoji">🤖</span>
      <div className={`ai-avatar-mouth ${speaking ? "open" : ""}`}></div>
    </div>
    {speaking && <div className="ai-avatar-soundwave"></div>}
  </div>
);

const AiBuddyPopup: React.FC<AiBuddyPopupProps> = ({ studentName }) => {
  const [location] = useLocation(); // wouter's current path
  const [mode, setMode] = useState<"welcome" | "chat" | "hidden">("welcome");
  const [speaking, setSpeaking] = useState(true);
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isFirstChatOpen, setIsFirstChatOpen] = useState(true);

  // Load messages from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ai-chat-messages");
    if (saved) setMessages(JSON.parse(saved));
    else setMessages([{ from: "bot", text: "Hey there! What would you like help with today?" }]);
  }, []);

  // Save messages to localStorage on change
  useEffect(() => {
    localStorage.setItem("ai-chat-messages", JSON.stringify(messages));
  }, [messages]);

  // Reset chatbox on route change
  const [hasMounted, setHasMounted] = useState(false);

useEffect(() => {
  if (hasMounted) {
    setMode("hidden");
    setSpeaking(false);
  } else {
    setHasMounted(true);
  }
}, [location]);


  // Animate speaking mouth
  useEffect(() => {
    if (mode === "welcome" && speaking) {
      const timer = setTimeout(() => setSpeaking(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [speaking, mode]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage = { from: "user", text: input };
    setMessages(prev => [...prev, newMessage]);
    setInput("");

    setTimeout(() => {
      setMessages(prev => [...prev, { from: "bot", text: "I'm here to help! 😊" }]);
    }, 500);
  };

  // Add greeting when chat is opened
  useEffect(() => {
    if (mode === "chat" && isFirstChatOpen) {
      const greetingMessages = [
        `Hi ${studentName}! 👋`,
        "I'm your Eduyata assistant. How can I help you today?",
        "You can ask me about your courses, assignments, or any other study-related questions."
      ];
      
      // Clear any existing messages
      setMessages([]);
      
      // Add greeting messages with a small delay between them
      greetingMessages.forEach((message, index) => {
        setTimeout(() => {
          setMessages(prev => [...prev, { from: "bot", text: message }]);
        }, index * 800);
      });
      
      setIsFirstChatOpen(false);
    }
  }, [mode, isFirstChatOpen, studentName]);

  if (mode === "hidden") {
    return (
      <button className="ai-floating-btn" onClick={() => setMode("chat")}>
        <span className="ai-avatar-emoji">🤖</span>
      </button>
    );
  }

  if (mode === "welcome") {
    return (
      <div className="ai-popup-container">
        <div className="ai-popup-card">
          <div className="ai-avatar-3d">
            <SpeakingAvatar speaking={speaking} />
          </div>
          <div className="ai-popup-content">
            <div className="ai-popup-header">
              <h3>Hi {studentName} 👋</h3>
              <button className="ai-close" onClick={() => setMode("hidden")}>✖</button>
            </div>
            <p>Welcome back to <strong>Eduyata</strong>!</p>
            <p className="ai-suggestion">
              👉 Revise <strong>Integration</strong> and complete the <strong>MCQ test</strong> before 5 PM.
            </p>
            <div className="ai-buttons">
              <button className="ai-btn continue">✅ Start Learning Now</button>
              <button className="ai-btn alt" onClick={() => setMode("chat")}>💬 Open Chat</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-popup-container">
      <div className="ai-popup-card ai-chatbox">
        <div className="ai-popup-header">
          <div className="ai-popup-title-group">
            <h3>Eduyata Assistant 🤖</h3>
            <button className="ai-plan-btn" onClick={() => setMode("welcome")}>📋 Start Learning Now</button>
          </div>
          <button className="ai-close" onClick={() => setMode("hidden")}>✖</button>
        </div>
        <div className="ai-chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`ai-chat-message ${msg.from}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="ai-chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="ai-input"
          />
          <button onClick={sendMessage} className="ai-btn continue">Send</button>
        </div>
      </div>
    </div>
  );
};

export default AiBuddyPopup;
