import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import SessionManager from '../utils/sessionManager';
import { usageTrackingService } from '../services/usageTrackingService';

interface VideoPlayerProps {
  videoUrl: string;
  courseId: number;
  videoId: string;
  onProgressUpdate?: (progress: number) => void;
  onSkipBackward?: () => void;
  onSkipForward?: () => void;
}

export interface VideoPlayerRef {
  pause: () => void;
  play: () => void;
  getCurrentTime: () => number;
  setCurrentTime: (time: number) => void;
}

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(({ videoUrl, courseId, videoId, onProgressUpdate }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [studentSession] = useState(SessionManager.getSession());
  const saveIntervalRef = useRef<NodeJS.Timeout>();
  const usageTrackingIntervalRef = useRef<NodeJS.Timeout>();
  const [savedTime, setSavedTime] = useState<number>(0);
  const [hasResumed, setHasResumed] = useState(false);
  const [isVideoEnded, setIsVideoEnded] = useState(false);

  useEffect(() => {
    if (!studentSession?.id) return;

    // Reset state for new video
    setHasResumed(false);
    setSavedTime(0);
    setIsVideoEnded(false);

    // Small delay to ensure video element is ready
    setTimeout(() => {
      loadVideoProgress();
    }, 500);

    const video = videoRef.current;
    if (video) {
      const handleTimeUpdate = () => {
        if (video.duration > 0) {
          const progress = Math.round((video.currentTime / video.duration) * 100);
          onProgressUpdate?.(progress);
        }
      };

      const handlePlay = () => {
        saveIntervalRef.current = setInterval(() => {
          saveVideoProgress();
        }, 5000);
        
        // Track usage every minute
        usageTrackingIntervalRef.current = setInterval(() => {
          if (studentSession?.id) {
            usageTrackingService.trackUsage({
              userId: studentSession.id,
              userType: 'student',
              action: 'video_watch',
              resourceId: videoId,
              quantity: 1,
              unit: 'minutes',
              metadata: { courseId }
            });
          }
        }, 60000); // Every minute
      };

      const handlePause = () => {
        if (saveIntervalRef.current) {
          clearInterval(saveIntervalRef.current);
        }
        if (usageTrackingIntervalRef.current) {
          clearInterval(usageTrackingIntervalRef.current);
        }
        saveVideoProgress();
      };

      const handleEnded = () => {
        setIsVideoEnded(true);
        if (saveIntervalRef.current) {
          clearInterval(saveIntervalRef.current);
        }
        if (usageTrackingIntervalRef.current) {
          clearInterval(usageTrackingIntervalRef.current);
        }
        saveVideoProgress();
        onProgressUpdate?.(100);
      };

      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('ended', handleEnded);
      video.addEventListener('timeupdate', handleTimeUpdate);

      // Save progress when user leaves the page
      const handleBeforeUnload = () => {
        saveVideoProgress();
      };
      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('ended', handleEnded);
        video.removeEventListener('timeupdate', handleTimeUpdate);
        window.removeEventListener('beforeunload', handleBeforeUnload);
        if (saveIntervalRef.current) {
          clearInterval(saveIntervalRef.current);
        }
        if (usageTrackingIntervalRef.current) {
          clearInterval(usageTrackingIntervalRef.current);
        }
        // Save progress when component unmounts (video changes)
        saveVideoProgress();
      };
    }
  }, [studentSession, courseId, videoId, videoUrl]);

  const loadVideoProgress = async () => {
    try {
      const response = await fetch(
        `http://localhost:8001/api/courses/get_video_progress/?student_id=${studentSession?.id}&course_id=${courseId}&video_id=${videoId}`
      );
      const data = await response.json();

      if (data.status === 'success' && data.data.current_time > 0 && videoRef.current) {
        const video = videoRef.current;
        const savedTime = data.data.current_time;
        const duration = data.data.duration || 0;

        console.log(`Loading video progress: ${savedTime}s / ${duration}s for video: ${videoId}`);

        const setTime = () => {
          try {
            // Make sure the saved time is not greater than the video duration
            const safeTime = Math.min(savedTime, video.duration || duration || savedTime);
            video.currentTime = safeTime;
            setHasResumed(true);
            console.log(`Video resumed at: ${safeTime} seconds for video: ${videoId}`);
          } catch (error) {
            console.error('Error setting video currentTime:', error);
          }
        };

        // If video is already loaded, set time immediately
        if (video.readyState >= 2 && video.duration > 0) {
          setTime();
        } else {
          // Wait for video to be ready
          let attempts = 0;
          const maxAttempts = 100; // 10 seconds max wait

          const trySetTime = () => {
            attempts++;
            if (video.readyState >= 2 && video.duration > 0) {
              setTime();
            } else if (attempts < maxAttempts) {
              setTimeout(trySetTime, 100);
            } else {
              console.warn(`Video failed to load progress within timeout for ${videoId}`);
            }
          };

          // Listen for multiple events that indicate the video is ready
          const handleReady = () => {
            if (video.readyState >= 2 && video.duration > 0) {
              setTime();
            }
          };

          video.addEventListener('loadedmetadata', handleReady, { once: true });
          video.addEventListener('canplay', handleReady, { once: true });
          video.addEventListener('durationchange', handleReady, { once: true });

          // Also try periodically as fallback
          setTimeout(trySetTime, 200);
        }
      } else {
        console.log(`No saved progress found for video: ${videoId}`);
        setHasResumed(true); // Mark as resumed even if no progress to load
      }
    } catch (error) {
      console.error('Failed to load video progress:', error);
      setHasResumed(true); // Mark as resumed on error
    }
  };

  const saveVideoProgress = async () => {
    if (!videoRef.current || !studentSession?.id) return;

    try {
      await fetch('http://localhost:8001/api/courses/save_video_progress/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentSession.id,
          course_id: courseId,
          video_id: videoId,
          current_time: videoRef.current.currentTime,
          duration: videoRef.current.duration
        })
      });
    } catch (error) {
      console.error('Failed to save video progress:', error);
    }
  };

  useImperativeHandle(ref, () => ({
    pause: () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    },
    play: () => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    },
    getCurrentTime: () => {
      return videoRef.current ? videoRef.current.currentTime : 0;
    },
    setCurrentTime: (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    }
  }));

  const handleSkipBackward = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      videoRef.current.currentTime = Math.max(0, currentTime - 10);
    }
  };

  const handleSkipForward = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      videoRef.current.currentTime = Math.min(duration, currentTime + 10);
    }
  };

  const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const videoWidth = rect.width;

    // If click is on the left half, skip backward; right half, skip forward
    if (clickX < videoWidth / 2) {
      handleSkipBackward();
    } else {
      handleSkipForward();
    }
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsVideoEnded(false);
    }
  };

  return (
    <div
      className="video-player"
      style={{ position: 'relative', display: 'inline-block' }}
      onDoubleClick={handleDoubleClick}
    >
      <video
        key={videoUrl}
        ref={videoRef}
        controls
        width="100%"
        style={{ height: '600px', display: 'block' }}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Invisible buttons - functionality moved to double-click */}
      <button
        onClick={handleSkipBackward}
        title="Skip backward 10 seconds"
        style={{
          position: 'absolute',
          left: '25%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          border: 'none',
          padding: '12px',
          cursor: 'pointer',
          borderRadius: '50%',
          fontSize: '16px',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}
      >
        ⏪
      </button>

      <button
        onClick={handleSkipForward}
        title="Skip forward 10 seconds"
        style={{
          position: 'absolute',
          right: '25%',
          top: '50%',
          transform: 'translate(50%, -50%)',
          opacity: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          border: 'none',
          padding: '12px',
          cursor: 'pointer',
          borderRadius: '50%',
          fontSize: '16px',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}
      >
        ⏩
      </button>
      
      {isVideoEnded && (
        <button
          onClick={handleReplay}
          title="Replay video"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.9,
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            border: '2px solid white',
            padding: '15px',
            cursor: 'pointer',
            borderRadius: '50%',
            fontSize: '24px',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px'
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0.9')}
        >
          🔄
        </button>
      )}
    </div>
  );
});

export default VideoPlayer;