import { useState, useEffect } from 'react';

interface VideoFeedbackData {
  videoId: string;
  studentId: string;
  teacherId: string;
  rating: number;
  feedback: string;
  videoTitle: string;
}

export const useVideoFeedback = (videoId: string, progress: number) => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [hasShownFeedback, setHasShownFeedback] = useState(false);

  useEffect(() => {
    // Show feedback modal when video reaches 100% completion
    if (progress >= 100 && !hasShownFeedback) {
      setShowFeedbackModal(true);
      setHasShownFeedback(true);
    }
  }, [progress, hasShownFeedback]);

  const submitFeedback = async (feedbackData: VideoFeedbackData) => {
    try {
      const response = await fetch('http://localhost:8001/api/courses/video-feedback/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        console.log('Feedback submitted successfully');
        return true;
      } else {
        console.error('Failed to submit feedback');
        return false;
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return false;
    }
  };

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
  };

  return {
    showFeedbackModal,
    closeFeedbackModal,
    submitFeedback,
  };
};