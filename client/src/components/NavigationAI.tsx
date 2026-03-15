import React, { useState } from 'react';
import { useNavigationAI } from '../hooks/useNavigationAI';
import './NavigationAI.css';

interface NavigationAIProps {
  userId?: string;
  userRole?: string;
}

const NavigationAI: React.FC<NavigationAIProps> = ({ userId, userRole = 'student' }) => {
  const [isOpen, setIsOpen] = useState(false);
  
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
  } = useNavigationAI({ userId, userRole });

  const handleTextCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      processCommand(command);
    }
  };

  const handleSuggestionClick = (suggestion: {text: string, command: string}) => {
    executeQuickCommand(suggestion.command);
  };

  const handleVoiceClick = () => {
    if (isListening) {
      // Stop listening if currently active
      return;
    }
    startListening();
  };

  return (
    <>
      <div className="nav-ai-trigger">
        <button 
          className="nav-ai-btn"
          onClick={() => setIsOpen(!isOpen)}
          title="AI Navigation Assistant"
        >
          🧭
        </button>
      </div>
      
      {isOpen && (
        <div className="nav-ai-container">
          <div className="nav-ai-panel">
        <div className="nav-ai-header">
          <div className="nav-ai-title">
            <span className="nav-ai-icon">🧭</span>
            <h3>Navigation Assistant</h3>
          </div>
          <button 
            className="nav-ai-close"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="nav-ai-content">
          <div className="nav-ai-input-section">
            <form onSubmit={handleTextCommand} className="nav-ai-form">
              <div className="nav-ai-input-group">
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="Type or speak your command..."
                  className="nav-ai-input"
                />
                <button
                  type="button"
                  onClick={handleVoiceClick}
                  className={`nav-ai-voice-btn ${isListening ? 'listening' : ''}`}
                  disabled={!isVoiceSupported}
                  title={isVoiceSupported ? 'Click to speak' : 'Voice not supported'}
                >
                  {isListening ? '🎤' : '🎙️'}
                </button>
                <button type="submit" className="nav-ai-send-btn">
                  ➤
                </button>
              </div>
            </form>
          </div>

          {isProcessing && (
            <div className="nav-ai-processing">
              <div className="nav-ai-spinner"></div>
              <span>Processing command...</span>
            </div>
          )}

          {error && (
            <div className="nav-ai-error">
              <div className="nav-ai-error-message">
                ⚠️ {error}
              </div>
            </div>
          )}

          {response && (
            <div className="nav-ai-response">
              <div className="nav-ai-message">
                {response}
              </div>
            </div>
          )}

          <div className="nav-ai-suggestions">
            <h4>Quick Commands:</h4>
            <div className="nav-ai-suggestion-grid">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className={`nav-ai-suggestion-btn ${suggestion.type}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="suggestion-icon">
                    {suggestion.type === 'course' ? '📚' : 
                     suggestion.type === 'task' ? '📝' : 
                     suggestion.type === 'game' ? '🎮' : '💡'}
                  </span>
                  {suggestion.text}
                </button>
              ))}
            </div>
          </div>

          <div className="nav-ai-examples">
            <p className="nav-ai-help-text">
              Try saying: "Show my Math course", "Go to assignments", "Open Quiz Battle"
            </p>
          </div>
        </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationAI;