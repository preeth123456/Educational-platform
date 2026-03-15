// CourseCard.tsx
import React, { useState } from 'react';
import { useLocation } from 'wouter';
import {
  FaStar, FaClock, FaUser, FaGraduationCap, FaArrowRight, FaPlayCircle, FaEye, FaTimes
} from 'react-icons/fa';
import './CourseCard.css';

interface CourseCardProps {
  course: {
    id: number;
    course_id: string;
    title: string;
    description: string;
    category: string;
    level: string;
    duration_hours: number;
    price: number;
    thumbnail_url: string;
    instructor_name: string;
    qualification: string;
    enrollment_count?: number;
    is_enrolled?: boolean;
    rating?: number;
    students_count?: number;
    video_id?: string;
  };
  onEnroll?: (courseId: number) => void;
  showEnrollButton?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  onEnroll, 
  showEnrollButton = true 
}) => {
  const [, setLocation] = useLocation();
  const [showPreview, setShowPreview] = useState(false);

  const handleViewCourse = () => {
    setLocation(`/course/${course.course_id}`);
  };

  const handleEnroll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEnroll) {
      onEnroll(course.id);
    }
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPreview(true);
  };

  const getVideoId = () => {
    if (course.video_id) return course.video_id;
    // Default video IDs based on category
    const defaultVideos: { [key: string]: string } = {
      'Mathematics': 'WUvTyaaNkzM',
      'Computer Science': 'zOjov-2OZ0E', 
      'Science': 'P3RXtoYCW4M',
      'English': 'VrKW58MS12g',
      'Physics': 'ZM8ECpBuQYE',
      'Chemistry': 'bka20Q2OMoQ'
    };
    return defaultVideos[course.category] || 'dQw4w9WgXcQ';
  };

  return (
    <>
      <div 
        className="course-card"
        onClick={handleViewCourse}
      >
        <div className="course-thumbnail" style={{ backgroundImage: `url(${course.thumbnail_url})` }}>
          <div className="course-overlay">
            <div className="course-category">{course.category}</div>
            <button 
              className="preview-btn"
              onClick={handlePreview}
              title="Preview Course"
            >
              <FaEye />
            </button>
          </div>
        </div>
        
        <div className="course-content">
          <div className="course-header">
            <h3 className="course-title">{course.title}</h3>
            <div className="course-rating">
              <FaStar className="star-icon" />
              <span>{course.rating || 4.5}</span>
            </div>
          </div>
          
          <p className="course-instructor">By {course.instructor_name}</p>
          <p className="course-qualification">{course.qualification}</p>
          
          <div className="course-meta">
            <span className="meta-chip">
              <FaClock className="meta-icon" />
              {course.duration_hours}h
            </span>
            <span className="meta-chip">
              <FaGraduationCap className="meta-icon" />
              {course.level}
            </span>
            <span className="meta-chip">
              <FaUser className="meta-icon" />
              {course.students_count || 0} students
            </span>
          </div>
          
          <div className="course-footer">
            <button 
              className="preview-btn-footer"
              onClick={handlePreview}
            >
              <FaEye />
              Preview
            </button>
            {course.is_enrolled ? (
              <button 
                className="continue-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewCourse();
                }}
              >
                <FaPlayCircle />
                Continue
              </button>
            ) : (
              <button 
                className="enroll-btn"
                onClick={handleEnroll}
              >
                <FaArrowRight />
                Enroll Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Video Preview Modal */}
      {showPreview && (
        <div className="video-preview-modal" onClick={() => setShowPreview(false)}>
          <div className="video-preview-content" onClick={(e) => e.stopPropagation()}>
            <div className="video-preview-header">
              <h3>{course.title}</h3>
              <p>By {course.instructor_name} • {course.qualification}</p>
              <button 
                className="close-preview"
                onClick={() => setShowPreview(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="video-preview-player">
              <iframe
                src={`https://www.youtube.com/embed/${getVideoId()}?autoplay=1`}
                title={course.title}
                frameBorder="0"
                allowFullScreen
                allow="autoplay; encrypted-media"
              ></iframe>
            </div>
            <div className="video-preview-footer">
              <button 
                className="enroll-from-preview"
                onClick={() => {
                  setShowPreview(false);
                  if (onEnroll && !course.is_enrolled) {
                    onEnroll(course.id);
                  }
                }}
              >
                {course.is_enrolled ? 'Already Enrolled' : 'Enroll Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseCard;
