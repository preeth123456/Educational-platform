import React, { useState, useEffect } from 'react';
import AiBuddyPopup from './AiBuddyPopup';

interface StudyPageWithAIProps {
  studentName: string;
  courseTitle: string;
  currentLesson: string;
}

const StudyPageWithAI: React.FC<StudyPageWithAIProps> = ({ 
  studentName, 
  courseTitle, 
  currentLesson 
}) => {
  const [currentContent, setCurrentContent] = useState('');
  const [currentTopic, setCurrentTopic] = useState('');

  useEffect(() => {
    // Simulate loading content based on current lesson
    setCurrentTopic(currentLesson);
    setCurrentContent(`This is the content for ${currentLesson} in ${courseTitle}. 
    It covers important concepts that students need to understand...`);
  }, [currentLesson, courseTitle]);

  return (
    <div className="study-page">
      <div className="study-content">
        <h1>{courseTitle}</h1>
        <h2>{currentLesson}</h2>
        
        <div className="lesson-content">
          <p>Your lesson content goes here...</p>
          <p>This could be text, videos, interactive elements, etc.</p>
        </div>

        <div className="study-actions">
          <button className="btn-primary">Continue Learning</button>
          <button className="btn-secondary">Take Quiz</button>
        </div>
      </div>

      {/* AI Buddy Integration */}
      <AiBuddyPopup 
        studentName={studentName}
        currentContent={currentContent}
        currentTopic={currentTopic}
      />
    </div>
  );
};

export default StudyPageWithAI;
