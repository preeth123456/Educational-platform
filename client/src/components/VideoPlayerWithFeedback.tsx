import React, { useState, useEffect } from 'react';
import FeedbackModal from './FeedbackModal';
import { useVideoFeedback } from '../hooks/useVideoFeedback';

interface VideoPlayerWithFeedbackProps {
  videoId: string;
  videoUrl: string;
  videoTitle: string;
  teacherName: string;
  studentId: string;
  teacherId: string;
}

const VideoPlayerWithFeedback: React.FC<VideoPlayerWithFeedbackProps> = ({
  videoId,
  videoUrl,
  videoTitle,
  teacherName,
  studentId,
  teacherId,
}) => {
  const [progress, setProgress] = useState(0);
  const { showFeedbackModal, closeFeedbackModal, submitFeedback } = useVideoFeedback(videoId, progress);

  // Simulate video progress (replace with actual video player progress)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1; // Increment by 1% every 100ms for demo
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleFeedbackSubmit = async (feedback: string, rating: number) => {
    const feedbackData = {
      videoId,
      studentId,
      teacherId,
      rating,
      feedback,
      videoTitle,
    };

    const success = await submitFeedback(feedbackData);
    if (success) {
      // Show success message or handle success
      console.log('Feedback submitted successfully!');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        background: '#000', 
        borderRadius: '12px', 
        padding: '20px', 
        marginBottom: '20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h3>{videoTitle}</h3>
        <p>Teacher: {teacherName}</p>
        <div style={{ 
          background: '#333', 
          height: '200px', 
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          Video Player Placeholder
        </div>
        <div style={{ 
          background: '#333', 
          borderRadius: '8px', 
          padding: '8px',
          marginBottom: '8px'
        }}>
          <div 
            style={{ 
              background: '#6366f1', 
              height: '8px', 
              borderRadius: '4px',
              width: `${progress}%`,
              transition: 'width 0.3s ease'
            }}
          />
        </div>
        <p>Progress: {progress.toFixed(1)}%</p>
      </div>

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={closeFeedbackModal}
        onSubmit={handleFeedbackSubmit}
        videoTitle={videoTitle}
        teacherName={teacherName}
      />
    </div>
  );
};

export default VideoPlayerWithFeedback;