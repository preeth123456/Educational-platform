import React, { useState, useEffect } from 'react';
import StudentLayout from '../components/StudentLayout';
import SessionManager from '../utils/sessionManager';
import { Clock, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';

interface AssessmentResult {
  id: number;
  course_id: number;
  score: number;
  passed: boolean;
  completed_at: string;
}

interface Course {
  id: number;
  title: string;
  category: string;
  assessment_result?: AssessmentResult;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

interface Assessment {
  courseId: number;
  courseTitle: string;
  questions: Question[];
  duration: number;
}

const SkillAssessment = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completedAssessments, setCompletedAssessments] = useState<{[key: number]: AssessmentResult}>({});

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      submitAssessment();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const fetchEnrolledCourses = async () => {
    try {
      const session = SessionManager.getSession();
      if (!session) return;

      const response = await fetch(`http://localhost:8001/api/courses/my_courses/?student_id=${session.id}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        const localResults = JSON.parse(localStorage.getItem(`assessment_results_${session.id}`) || '{}');
        console.log('Local assessment results:', localResults);
        
        const coursesWithResults = await Promise.all(
          data.data.map(async (course: any) => {
            try {
              const resultResponse = await fetch(`http://localhost:8001/api/courses/get_assessment_result/?student_id=${session.id}&course_id=${course.id}`);
              const resultData = await resultResponse.json();
              console.log(`Assessment result for course ${course.id}:`, resultData);
              
              const assessmentResult = resultData.status === 'success' ? resultData.data : localResults[course.id];
              
              return {
                id: course.id,
                title: course.title,
                category: course.category || 'General',
                assessment_result: assessmentResult || null
              };
            } catch {
              return {
                id: course.id,
                title: course.title,
                category: course.category || 'General',
                assessment_result: localResults[course.id] || null
              };
            }
          })
        );
        
        setEnrolledCourses(coursesWithResults);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQuestions = (courseTitle: string, category: string): Question[] => {
    const questionBank: { [key: string]: Question[] } = {
      'Mathematics': [
        { id: 1, question: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correct: 1 },
        { id: 2, question: 'What is the derivative of x²?', options: ['x', '2x', 'x²', '2x²'], correct: 1 },
        { id: 3, question: 'What is √16?', options: ['2', '4', '6', '8'], correct: 1 },
        { id: 4, question: 'What is 5!?', options: ['25', '120', '100', '60'], correct: 1 },
        { id: 5, question: 'What is sin(90°)?', options: ['0', '1', '0.5', '-1'], correct: 1 }
      ],
      'Science': [
        { id: 1, question: 'What is H2O?', options: ['Hydrogen', 'Water', 'Oxygen', 'Carbon'], correct: 1 },
        { id: 2, question: 'Speed of light?', options: ['3×10⁸ m/s', '3×10⁶ m/s', '3×10⁷ m/s', '3×10⁹ m/s'], correct: 0 },
        { id: 3, question: 'Atomic number of Carbon?', options: ['4', '6', '8', '12'], correct: 1 },
        { id: 4, question: 'Force = ?', options: ['m×a', 'm×v', 'm×d', 'a×v'], correct: 0 },
        { id: 5, question: 'DNA stands for?', options: ['Deoxyribonucleic Acid', 'Ribonucleic Acid', 'Amino Acid', 'Nucleic Acid'], correct: 0 }
      ],
      'Computer Science': [
        { id: 1, question: 'What is a variable?', options: ['Function', 'Storage location', 'Loop', 'Class'], correct: 1 },
        { id: 2, question: 'HTML stands for?', options: ['Hypertext Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'], correct: 0 },
        { id: 3, question: 'Which is a programming language?', options: ['HTML', 'CSS', 'JavaScript', 'XML'], correct: 2 },
        { id: 4, question: 'What is an array?', options: ['Single value', 'Collection of values', 'Function', 'Class'], correct: 1 },
        { id: 5, question: 'CSS stands for?', options: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'], correct: 0 }
      ],
      'Web Development Bootcamp': [
        { id: 1, question: 'What does HTML stand for?', options: ['Hypertext Markup Language', 'Home Tool Markup Language', 'Hyperlink Text Markup Language', 'High Tech Modern Language'], correct: 0 },
        { id: 2, question: 'Which CSS property controls text size?', options: ['font-weight', 'font-size', 'text-size', 'font-style'], correct: 1 },
        { id: 3, question: 'What is JavaScript used for?', options: ['Styling', 'Structure', 'Interactivity', 'Database'], correct: 2 },
        { id: 4, question: 'Which HTML tag creates a link?', options: ['<link>', '<a>', '<href>', '<url>'], correct: 1 },
        { id: 5, question: 'What does CSS stand for?', options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'], correct: 1 }
      ],
      'Class 12: Plant Biology': [
        { id: 1, question: 'What is photosynthesis?', options: ['Respiration', 'Light to chemical energy', 'Cell division', 'Protein synthesis'], correct: 1 },
        { id: 2, question: 'Which organelle conducts photosynthesis?', options: ['Mitochondria', 'Chloroplast', 'Nucleus', 'Ribosome'], correct: 1 },
        { id: 3, question: 'What gas do plants absorb during photosynthesis?', options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'], correct: 1 },
        { id: 4, question: 'What is the green pigment in plants?', options: ['Carotene', 'Chlorophyll', 'Anthocyanin', 'Xanthophyll'], correct: 1 },
        { id: 5, question: 'Which part of plant conducts water?', options: ['Phloem', 'Xylem', 'Cambium', 'Cortex'], correct: 1 }
      ]
    };

    return questionBank[courseTitle] || questionBank[category] || questionBank['Computer Science'];
  };

  const startAssessment = (course: Course) => {
    console.log('Starting assessment for course:', course.id, course.title);
    
    const questions = generateQuestions(course.title, course.category);
    const assessment: Assessment = {
      courseId: course.id,
      courseTitle: course.title,
      questions,
      duration: 300
    };
    
    setSelectedAssessment(assessment);
    setAnswers(new Array(questions.length).fill(-1));
    setTimeLeft(assessment.duration);
    setCurrentQuestion(0);
    setIsActive(true);
    setShowResult(false);
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < (selectedAssessment?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitAssessment = async () => {
    if (!selectedAssessment) return;
    
    setIsActive(false);
    let correctAnswers = 0;
    
    selectedAssessment.questions.forEach((question, index) => {
      if (answers[index] === question.correct) {
        correctAnswers++;
      }
    });
    
    const finalScore = Math.round((correctAnswers / selectedAssessment.questions.length) * 100);
    setScore(finalScore);
    
    try {
      const session = SessionManager.getSession();
      if (session) {
        const saveResponse = await fetch('http://localhost:8001/api/courses/save_assessment_result/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            student_id: session.id,
            course_id: selectedAssessment.courseId,
            course_title: selectedAssessment.courseTitle,
            score: finalScore,
            total_questions: selectedAssessment.questions.length,
            correct_answers: correctAnswers,
            time_taken: selectedAssessment.duration - timeLeft,
            passed: finalScore >= 70
          })
        });
        
        const saveResult = await saveResponse.json();
        console.log('Save assessment result:', saveResult);
        
        const newResult = {
          id: Date.now(),
          course_id: selectedAssessment.courseId,
          score: finalScore,
          passed: finalScore >= 70,
          completed_at: new Date().toISOString()
        };
        
        setCompletedAssessments(prev => ({
          ...prev,
          [selectedAssessment.courseId]: newResult
        }));
        
        setEnrolledCourses(prev => prev.map(course => 
          course.id === selectedAssessment.courseId 
            ? { ...course, assessment_result: newResult }
            : course
        ));
        
        const localResults = JSON.parse(localStorage.getItem(`assessment_results_${session.id}`) || '{}');
        localResults[selectedAssessment.courseId] = newResult;
        localStorage.setItem(`assessment_results_${session.id}`, JSON.stringify(localResults));
      }
    } catch (error) {
      console.error('Error saving assessment result:', error);
    }
    
    setShowResult(true);
  };

  const downloadCertificate = (course: Course) => {
    const certificateContent = `
CERTIFICATE OF ACHIEVEMENT

This certifies that you have successfully completed
${course.title}

Score: ${course.assessment_result?.score}%
Date: ${new Date().toLocaleDateString()}

Congratulations!
    `;
    
    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${course.title}_Certificate.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetAssessment = async () => {
    setSelectedAssessment(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setTimeLeft(0);
    setIsActive(false);
    setShowResult(false);
    setScore(0);
    await fetchEnrolledCourses();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <StudentLayout>
        <div style={{ padding: '20px', paddingTop: '100px', textAlign: 'center' }}>
          <p>Loading your courses...</p>
        </div>
      </StudentLayout>
    );
  }

  if (showResult) {
    return (
      <StudentLayout>
        <div style={{ padding: '20px', paddingTop: '100px', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CheckCircle size={64} color={score >= 70 ? '#10b981' : '#ef4444'} style={{ margin: '0 auto 20px' }} />
            <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Assessment Result!</h1>
            <h2 style={{ fontSize: '3rem', color: score >= 70 ? '#10b981' : '#ef4444', marginBottom: '20px' }}>{score}%</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
              Course: {selectedAssessment?.courseTitle}
            </p>
            <p style={{ marginBottom: '30px', color: '#666' }}>
              {score >= 70 ? '🎉 Congratulations! You passed the assessment.' : '📚 Keep studying and try again.'}
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button 
                onClick={resetAssessment}
                style={{ padding: '12px 24px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                Back to Assessments
              </button>
              {score === 100 ? (
                <button 
                  onClick={() => {
                    const certificateContent = `
CERTIFICATE OF ACHIEVEMENT

This certifies that you have successfully completed
${selectedAssessment?.courseTitle}

Score: ${score}%
Date: ${new Date().toLocaleDateString()}

Congratulations!
    `;
                    const blob = new Blob([certificateContent], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedAssessment?.courseTitle}_Certificate.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  style={{ padding: '12px 24px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Download Certificate
                </button>
              ) : (
                <button 
                  onClick={() => startAssessment({ id: selectedAssessment!.courseId, title: selectedAssessment!.courseTitle, category: 'General' })}
                  style={{ padding: '12px 24px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Retake Assessment
                </button>
              )}
            </div>
          </div>
        </div>
      </StudentLayout>
    );
  }

  if (selectedAssessment) {
    const question = selectedAssessment.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedAssessment.questions.length) * 100;

    return (
      <StudentLayout>
        <div style={{ padding: '20px', paddingTop: '100px', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2>{selectedAssessment.courseTitle} Assessment</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fee2e2', padding: '8px 16px', borderRadius: '8px' }}>
                <Clock size={20} color="#dc2626" />
                <span style={{ color: '#dc2626', fontWeight: 'bold' }}>{formatTime(timeLeft)}</span>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Question {currentQuestion + 1} of {selectedAssessment.questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div style={{ background: '#e5e7eb', height: '8px', borderRadius: '4px' }}>
                <div style={{ background: '#6366f1', height: '100%', width: `${progress}%`, borderRadius: '4px', transition: 'width 0.3s' }}></div>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>{question.question}</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => selectAnswer(index)}
                    style={{
                      padding: '15px',
                      textAlign: 'left',
                      border: `2px solid ${answers[currentQuestion] === index ? '#6366f1' : '#e5e7eb'}`,
                      background: answers[currentQuestion] === index ? '#eff6ff' : 'white',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ marginRight: '10px', fontWeight: 'bold' }}>{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                style={{
                  padding: '10px 20px',
                  background: currentQuestion === 0 ? '#e5e7eb' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <ArrowLeft size={16} />
                Previous
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                {selectedAssessment.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    style={{
                      width: '32px',
                      height: '32px',
                      border: 'none',
                      borderRadius: '4px',
                      background: answers[index] !== -1 ? '#10b981' : (index === currentQuestion ? '#6366f1' : '#e5e7eb'),
                      color: answers[index] !== -1 || index === currentQuestion ? 'white' : '#666',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {currentQuestion === selectedAssessment.questions.length - 1 ? (
                <button
                  onClick={submitAssessment}
                  style={{
                    padding: '10px 20px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Submit Assessment
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  style={{
                    padding: '10px 20px',
                    background: '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div style={{ padding: '20px', paddingTop: '100px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px' }}>
            Skill Assessment & Validation
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Test your knowledge in your enrolled courses and earn certificates
          </p>
        </div>

        {enrolledCourses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '12px' }}>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '20px' }}>
              No enrolled courses found
            </p>
            <p style={{ color: '#999' }}>
              Enroll in courses to access skill assessments
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
            {enrolledCourses.map(course => (
              <div key={course.id} style={{ 
                background: 'white', 
                padding: '25px', 
                borderRadius: '12px', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '8px' }}>
                    {course.title}
                  </h3>
                  <span style={{ 
                    background: '#eff6ff', 
                    color: '#1d4ed8', 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '0.85rem',
                    fontWeight: '500'
                  }}>
                    {course.category}
                  </span>
                </div>
                
                <div style={{ marginBottom: '20px', color: '#666' }}>
                  <p style={{ marginBottom: '8px' }}>📝 5 Questions</p>
                  <p style={{ marginBottom: '8px' }}>⏱️ 5 Minutes</p>
                  <p>🏆 Certificate Available</p>
                </div>
                
                {completedAssessments[course.id] || course.assessment_result ? (
                  <div>
                    <div style={{ 
                      background: (completedAssessments[course.id]?.score || course.assessment_result?.score) === 100 ? '#dcfce7' : (completedAssessments[course.id]?.score || course.assessment_result?.score || 0) >= 70 ? '#fef3c7' : '#fee2e2',
                      padding: '15px',
                      borderRadius: '8px',
                      marginBottom: '15px',
                      textAlign: 'center'
                    }}>
                      <p style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 'bold', 
                        color: (completedAssessments[course.id]?.score || course.assessment_result?.score) === 100 ? '#16a34a' : (completedAssessments[course.id]?.score || course.assessment_result?.score || 0) >= 70 ? '#d97706' : '#dc2626',
                        marginBottom: '5px'
                      }}>
                        {completedAssessments[course.id]?.score || course.assessment_result?.score}%
                      </p>
                      <p style={{ fontSize: '0.9rem', color: '#666' }}>
                        {(completedAssessments[course.id]?.score || course.assessment_result?.score) === 100 ? 'Perfect Score!' : (completedAssessments[course.id]?.score || course.assessment_result?.score || 0) >= 70 ? 'Passed' : 'Failed'}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '5px' }}>
                        Completed: {new Date((completedAssessments[course.id]?.completed_at || course.assessment_result?.completed_at || '')).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {(completedAssessments[course.id]?.score || course.assessment_result?.score) === 100 ? (
                        <button 
                          onClick={() => downloadCertificate({...course, assessment_result: completedAssessments[course.id] || course.assessment_result})}
                          style={{
                            flex: 1,
                            padding: '12px',
                            background: '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          Download Certificate
                        </button>
                      ) : (
                        <button 
                          onClick={() => startAssessment(course)}
                          style={{
                            flex: 1,
                            padding: '12px',
                            background: '#f59e0b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          Retake Assessment
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => startAssessment(course)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#6366f1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#4f46e5'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#6366f1'}
                  >
                    Start Assessment
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default SkillAssessment;