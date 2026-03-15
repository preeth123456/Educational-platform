import React, { useState } from 'react';
import './FeedbackModal.css';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string, rating: number) => void;
  videoTitle?: string;
  teacherName?: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  videoTitle = "Video",
  teacherName = "Teacher"
}) => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(feedback, rating);
      setIsSubmitted(true);
      setTimeout(() => {
        setFeedback('');
        setRating(0);
        setIsSubmitted(false);
        onClose();
      }, 2000);
    }
  };

  const handleSkip = () => {
    setFeedback('');
    setRating(0);
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-modal-overlay">
      <div className="feedback-modal">
        <div className="feedback-header">
          <div className="completion-icon">🎉</div>
          <h2>Congratulations!</h2>
          <p>You've completed watching "{videoTitle}"</p>
        </div>

        {!isSubmitted ? (
          <>
            <div className="feedback-content">
              <h3>How was your learning experience?</h3>
              <p>Your feedback helps {teacherName} improve the content</p>

              <div className="rating-section">
                <label>Rate this video:</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star ${star <= (hoveredRating || rating) ? 'active' : ''}`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              <div className="feedback-input-section">
                <label htmlFor="feedback-text">Share your thoughts (optional):</label>
                <textarea
                  id="feedback-text"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="What did you like about this video? Any suggestions for improvement?"
                  rows={4}
                />
              </div>
            </div>

            <div className="feedback-actions">
              <button
                type="button"
                onClick={handleSkip}
                className="skip-btn"
              >
                Skip for now
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="submit-btn"
                disabled={rating === 0}
              >
                Send Feedback
              </button>
            </div>
          </>
        ) : (
          <div className="success-content">
            <div className="success-icon">✅</div>
            <h3>Feedback Sent Successfully!</h3>
            <p>Thank you for your valuable feedback. It helps {teacherName} create better content for you.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;