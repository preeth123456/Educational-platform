import React, { useEffect, useRef } from 'react';
import { FaStar, FaArrowRight } from 'react-icons/fa';
import './CourseShowcase.css';

// Define Course type
type Instructor = {
  avatar: string;
  name: string;
};

type Course = {
  image: string;
  category: string;
  categoryColor: string;
  rating: number;
  title: string;
  description: string;
  instructor: Instructor;
  price: string;
};

type CourseCardProps = {
  course: Course;
};

// CourseCard Component (typed)
const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (cardRef.current) observer.observe(cardRef.current);

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  return (
    <div ref={cardRef} className="course-card scroll-reveal">
      <img
        src={course.image}
        alt={course.title}
        className="course-image"
      />
      <div className="course-content">
        <div className="course-header">
          <div className={`badge badge-${course.categoryColor}`}>
            {course.category}
          </div>
          <div className="course-rating">
            <FaStar className="star-icon" />
            <span>{course.rating}</span>
          </div>
        </div>
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">{course.description}</p>
        <div className="course-footer">
          <div className="instructor">
            <img
              className="instructor-avatar"
              src={course.instructor.avatar}
              alt={`${course.instructor.name} avatar`}
            />
            <span className="instructor-name">{course.instructor.name}</span>
          </div>
          <span className="course-price">{course.price}</span>
        </div>
      </div>
    </div>
  );
};

// CourseShowcase Component
const CourseShowcase: React.FC = () => {
  const titleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (titleRef.current) observer.observe(titleRef.current);

    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current);
    };
  }, []);

  const courses: Course[] = [
    {
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500',
      category: 'Mathematics',
      categoryColor: 'primary',
      rating: 4.9,
      title: 'Advanced Calculus & Applications',
      description: 'Master calculus concepts from derivatives to integrals with real-world applications.',
      instructor: {
        avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120',
        name: 'Prof. Richard Miller',
      },
      price: '$49',
    },
    {
      image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500',
      category: 'Computer Science',
      categoryColor: 'secondary',
      rating: 4.8,
      title: 'Web Development Bootcamp',
      description: 'Learn full-stack development from HTML and CSS to Node.js and React frameworks.',
      instructor: {
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120',
        name: 'Sarah Johnson',
      },
      price: '$79',
    },
    {
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500',
      category: 'English',
      categoryColor: 'accent',
      rating: 4.7,
      title: 'Creative Writing Masterclass',
      description: 'Develop your creative writing skills across multiple genres with expert feedback.',
      instructor: {
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120',
        name: 'David Thompson',
      },
      price: '$59',
    },
  ];

  return (
    <section id="courses" className="courses-section">
      <div className="container">
        <div ref={titleRef} className="section-header scroll-reveal">
          <h2 className="section-title">Discover Our Popular Courses</h2>
          <p className="section-subtitle">
            Explore a wide range of subjects taught by expert educators
          </p>
        </div>

        <div className="courses-grid">
          {courses.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>

        <div className="view-all-container">
          <button className="btn btn-outline-primary">
            View All Courses <FaArrowRight className="arrow-icon" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CourseShowcase;
