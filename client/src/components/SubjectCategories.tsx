import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  FaCalculator,
  FaFlask,
  FaBookOpen,
  FaGlobeAmericas,
  FaCode,
  FaPalette
} from 'react-icons/fa';
import './SubjectCategories.css';

// Define icon map
const iconMap: Record<string, React.ElementType> = {
  calculator: FaCalculator,
  flask: FaFlask,
  'book-open': FaBookOpen,
  'globe-americas': FaGlobeAmericas,
  code: FaCode,
  palette: FaPalette,
};

// Define subject type
type Subject = {
  id: number | string;
  name: string;
  description: string;
  grades: string; // JSON string like "[3,4,5]"
  icon: string;
  color_class: string;
  course_count: number;
};

const SubjectCategories: React.FC = () => {
  const { data: subjects, isLoading } = useQuery<Subject[]>({
    queryKey: ['/api/subjects'],
    queryFn: async () => {
      const res = await fetch('/api/subjects');
      if (!res.ok) throw new Error('Failed to fetch subjects');
      return res.json();
    },
  });

  return (
    <section className="subjects-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Explore Subjects by Grade</h2>
          <p className="section-subtitle">
            From Class 3 to 12, discover comprehensive courses designed to make
            learning engaging and effective
          </p>
        </div>

        <div className="subjects-grid">
          {isLoading ? (
            <p className="loading-text">Loading subjects...</p>
          ) : (
            subjects?.map((subject) => {
              const IconComponent = iconMap[subject.icon];
              let grades: number[] = [];

              try {
                grades = JSON.parse(subject.grades);
              } catch {
                console.error('Invalid grades JSON for subject:', subject.name);
              }

              const gradeRange = grades.length
                ? `Class ${Math.min(...grades)}-${Math.max(...grades)}`
                : 'Grades Unknown';

              return (
                <div key={subject.id} className="subject-card-wrapper">
                  <a href={`/subject/${encodeURIComponent(subject.name)}`}>
                    <div className={`subject-card ${subject.color_class}`}>
                      <div className="subject-content">
                        {IconComponent && <IconComponent className="subject-icon" />}
                        <h3 className="subject-title">{subject.name}</h3>
                        <p className="subject-description">{subject.description}</p>
                        <div className="subject-badges">
                          <span className="grade-badge">{gradeRange}</span>
                          <span className="course-count-badge">
                            {subject.course_count}+ Courses
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default SubjectCategories;
