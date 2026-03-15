import React, { useState } from 'react';
import { useLocation } from 'wouter';
import './CreativeTeacherRegister.css';
import SessionManager from '../utils/sessionManager';

const CreativeTeacherRegister: React.FC = () => {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  // Subject search state for expertise step
  const [subjectSearch, setSubjectSearch] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    gender: '',
    highest_qualification: '',
    experience_years: 0,
    last_institute: '',
    institutes: [{ name: '', from_year: '', to_year: '' }] as Array<{name: string, from_year: string, to_year: string}>,
    boards: [] as string[],
    subject_classes: {} as Record<string, string[]>,
    bio: '',
    languages_known: [] as string[],
    profile_picture: null as File | null,
    cv_file: null as File | null,
    degree_certificate: null as File | null,
    achievements_file: null as File | null,
    experience_proof_file: null as File | null
  });

  const boardOptions = ['CBSE', 'ICSE', 'State Board', 'NIOS', 'IB', 'IGCSE'];
  
  const subjectClassMapping = {
    'English': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    'Hindi': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    'Mathematics': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    'Science': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    'Physics': ['11', '12'],
    'Chemistry': ['11', '12'],
    'Biology': ['11', '12'],
    'History': ['6', '7', '8', '9', '10', '11', '12'],
    'Geography': ['6', '7', '8', '9', '10', '11', '12'],
    'Political Science': ['11', '12'],
    'Economics': ['11', '12'],
    'Computer Science': ['6', '7', '8', '9', '10', '11', '12'],
    'Physical Education': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    'Art': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    'Music': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    'Sanskrit': ['6', '7', '8', '9', '10', '11', '12'],
    'Social Studies': ['6', '7', '8', '9', '10'],
    'Environmental Science': ['1', '2', '3', '4', '5'],
    'Moral Science': ['1', '2', '3', '4', '5', '6', '7', '8'],
    'General Knowledge': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  };
  
  const languageOptions = ['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Kannada'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInstituteChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      institutes: prev.institutes.map((inst, i) => 
        i === index ? { ...inst, [field]: value } : inst
      )
    }));
  };

  const addInstitute = () => {
    setFormData(prev => ({
      ...prev,
      institutes: [...prev.institutes, { name: '', from_year: '', to_year: '' }]
    }));
  };

  const removeInstitute = (index: number) => {
    if (formData.institutes.length > 1) {
      setFormData(prev => ({
        ...prev,
        institutes: prev.institutes.filter((_, i) => i !== index)
      }));
    }
  };

  const handleMultiSelect = (name: keyof typeof formData, value: string) => {
    setFormData(prev => {
      const currentArray = prev[name] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [name]: newArray };
    });
  };

  const handleSubjectSelect = (subject: string) => {
    setFormData(prev => {
      const currentSubjectClasses = { ...prev.subject_classes };
      if (currentSubjectClasses[subject]) {
        delete currentSubjectClasses[subject];
      } else {
        currentSubjectClasses[subject] = [];
      }
      return { ...prev, subject_classes: currentSubjectClasses };
    });
  };

  const handleClassSelect = (subject: string, selectedClasses: string[]) => {
    setFormData(prev => ({
      ...prev,
      subject_classes: {
        ...prev.subject_classes,
        [subject]: selectedClasses
      }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, [fieldName]: file }));
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email && formData.mobile && formData.password && formData.confirmPassword && formData.gender;
      case 2:
        return formData.highest_qualification;
      case 3:
        return formData.boards.length > 0 && Object.keys(formData.subject_classes).length > 0;
      case 4:
        return formData.profile_picture && formData.cv_file && formData.degree_certificate;
      default:
        return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const formPayload = new FormData();
      // Add all fields except files and confirmPassword
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'confirmPassword') {
          // Skip confirmPassword as backend doesn't expect it
          return;
        }
        if (
          key === 'profile_picture' ||
          key === 'cv_file' ||
          key === 'degree_certificate' ||
          key === 'achievements_file' ||
          key === 'experience_proof_file'
        ) {
          if (value instanceof File) formPayload.append(key, value);
        } else if (typeof value === 'number') {
          formPayload.append(key, value.toString());
        } else if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
          formPayload.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formPayload.append(key, value);
        }
      });

      const response = await fetch('http://localhost:8001/api/teacher/register-files/', {
        method: 'POST',
        body: formPayload,
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Registration successful!\n\nYour Teacher ID is: ${result.data.teacher_id}\n\nWelcome to EduYata!`);
        // Auto-login and redirect to dashboard
        if (result.data) {
          console.log('Saving session data:', result.data);
          SessionManager.saveSession(result.data);
          console.log('Session saved, navigating to dashboard');
        }
        navigate('/teacher-dashboard');
      } else {
        alert(`Registration failed: ${result.error}`);
      }
    } catch (error) {
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-container">
            <div className="step-header">
              <div className="step-icon">👤</div>
              <h3>Personal Information</h3>
              <p>Let's start with your basic details</p>
            </div>
            
            <div className="form-grid">
              <div className="input-group">
                <label>Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="input-group">
                <label>Email Address <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <div className="input-group">
                <label>Phone Number <span className="required">*</span></label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210"
                  required
                />
              </div>
              

              
              <div className="input-group">
                <label>Gender <span className="required">*</span></label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="input-group">
                <label>Password <span className="required">*</span></label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
                  required
                />
              </div>
              
              <div className="input-group">
                <label>Confirm Password <span className="required">*</span></label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-container">
            <div className="step-header">
              <div className="step-icon">🎓</div>
              <h3>Professional Background</h3>
              <p>Tell us about your qualifications and experience</p>
            </div>
            
            <div className="form-grid">
              <div className="input-group">
                <label>Highest Qualification <span className="required">*</span></label>
                <input
                  type="text"
                  name="highest_qualification"
                  value={formData.highest_qualification}
                  onChange={handleInputChange}
                  placeholder="e.g., M.Ed, B.Ed, M.Sc, Ph.D"
                  required
                />
              </div>
              
              <div className="input-group">
                <label>Years of Experience</label>
                <input
                  type="number"
                  name="experience_years"
                  value={formData.experience_years}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="Years of teaching experience"
                />
              </div>
              
              <div className="input-group full-width">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <label>Teaching Experience at Institutes</label>
                  <button
                    type="button"
                    onClick={addInstitute}
                    style={{
                      background: '#6366f1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    + Add Institute
                  </button>
                </div>
                
                {formData.institutes.map((institute, index) => (
                  <div key={index} style={{ 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '12px', 
                    padding: '16px', 
                    marginBottom: '12px',
                    background: '#f8fafc'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 style={{ margin: 0, fontSize: '14px', color: '#2d3748', fontWeight: '600' }}>Institute {index + 1}</h4>
                      {formData.institutes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeInstitute(index)}
                          style={{
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748', marginBottom: '4px', display: 'block' }}>Institute Name</label>
                        <input
                          type="text"
                          value={institute.name}
                          onChange={(e) => handleInstituteChange(index, 'name', e.target.value)}
                          placeholder="Institute name"
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                          required
                        />
                      </div>
                      
                      <div>
                        <label style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748', marginBottom: '4px', display: 'block' }}>From Year</label>
                        <input
                          type="number"
                          value={institute.from_year}
                          onChange={(e) => handleInstituteChange(index, 'from_year', e.target.value)}
                          placeholder="2020"
                          min="1990"
                          max="2024"
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                          required
                        />
                      </div>
                      
                      <div>
                        <label style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748', marginBottom: '4px', display: 'block' }}>To Year</label>
                        <input
                          type="number"
                          value={institute.to_year}
                          onChange={(e) => handleInstituteChange(index, 'to_year', e.target.value)}
                          placeholder="2024"
                          min="1990"
                          max="2024"
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="input-group full-width">
                <label>About You</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about your teaching philosophy and approach..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        const filteredSubjects = Object.entries(subjectClassMapping).filter(([subject]) =>
          subject.toLowerCase().includes(subjectSearch.toLowerCase())
        );
        return (
          <div className="step-container">
            <div className="step-header">
              <div className="step-icon">📚</div>
              <h3>Teaching Expertise</h3>
              <p>Select subjects and classes you teach</p>
            </div>
            <div className="expertise-section">
              <div className="selection-group">
                <label className="section-label">
                  <span className="label-icon">🏫</span>
                  Boards You Teach <span className="required">*</span>
                </label>
                <div className="chip-container">
                  {boardOptions.map(board => (
                    <div
                      key={board}
                      className={`chip modern-chip ${formData.boards.includes(board) ? 'selected' : ''}`}
                      onClick={() => handleMultiSelect('boards', board)}
                    >
                      <span className="chip-text">{board}</span>
                      {formData.boards.includes(board) && <span className="check-icon">✓</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="selection-group">
                <label className="section-label">
                  <span className="label-icon">📚</span>
                  Subject & Classes Mapping <span className="required">*</span>
                </label>
                <p className="help-text">Select subjects and choose which classes you can teach for each subject</p>
                {/* Subject search bar */}
                <input
                  type="text"
                  placeholder="Search subject..."
                  value={subjectSearch}
                  onChange={e => setSubjectSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
                <div className="subjects-grid">
                  {filteredSubjects.map(([subject, availableClasses]) => (
                    <div key={subject} className="subject-card">
                      <div className="subject-header">
                        <label className="subject-toggle">
                          <input
                            type="checkbox"
                            checked={!!formData.subject_classes[subject]}
                            onChange={() => handleSubjectSelect(subject)}
                            className="subject-checkbox-input"
                          />
                          <div className="subject-checkbox-custom">
                            <span className="checkmark">✓</span>
                          </div>
                          <div className="subject-info">
                            <span className="subject-name">{subject}</span>
                            <span className="class-range">Classes {availableClasses[0]}-{availableClasses[availableClasses.length - 1]}</span>
                          </div>
                        </label>
                        {formData.subject_classes[subject] && (
                          <div className="selected-badge">
                            {formData.subject_classes[subject].length}
                          </div>
                        )}
                      </div>
                      {formData.subject_classes[subject] !== undefined && (
                        <div className="class-selection">
                          <div className="class-chips-container">
                            {availableClasses.map(cls => (
                              <div
                                key={cls}
                                className={`class-chip ${
                                  formData.subject_classes[subject].includes(cls) ? 'selected' : ''
                                }`}
                                onClick={() => {
                                  const currentClasses = formData.subject_classes[subject];
                                  const newClasses = currentClasses.includes(cls)
                                    ? currentClasses.filter(c => c !== cls)
                                    : [...currentClasses, cls];
                                  handleClassSelect(subject, newClasses);
                                }}
                              >
                                <span className="class-number">{cls}</span>
                                {formData.subject_classes[subject].includes(cls) && (
                                  <span className="class-check">✓</span>
                                )}
                              </div>
                            ))}
                          </div>
                          <p className="selection-help">Click on class numbers to select/deselect</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="selection-group">
                <label className="section-label">
                  <span className="label-icon">🗣️</span>
                  Languages You Know
                </label>
                <div className="chip-container">
                  {languageOptions.map(lang => (
                    <div
                      key={lang}
                      className={`chip modern-chip language-chip ${formData.languages_known.includes(lang) ? 'selected' : ''}`}
                      onClick={() => handleMultiSelect('languages_known', lang)}
                    >
                      <span className="chip-text">{lang}</span>
                      {formData.languages_known.includes(lang) && <span className="check-icon">✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-container">
            <div className="step-header">
              <div className="step-icon">📄</div>
              <h3>Upload Documents</h3>
              <p>Upload your CV, achievements, and experience proof</p>
            </div>
            
            <div className="upload-section">
              <div className="upload-group">
                <label>Upload Profile Picture <span className="required">*</span></label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'profile_picture')}
                    required
                  />
                  <div className="upload-info">
                    <span className="upload-icon">📷</span>
                    <span>Choose JPG, JPEG, or PNG file</span>
                  </div>
                  {formData.profile_picture && (
                    <div className="file-selected">
                      ✅ {formData.profile_picture.name}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="upload-group">
                <label>Upload Your CV/Resume <span className="required">*</span></label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(e, 'cv_file')}
                    required
                  />
                  <div className="upload-info">
                    <span className="upload-icon">📄</span>
                    <span>Choose PDF, DOC, or DOCX file</span>
                  </div>
                  {formData.cv_file && (
                    <div className="file-selected">
                      ✅ {formData.cv_file.name}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="upload-group">
                <label>Upload Degree Certificate <span className="required">*</span></label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'degree_certificate')}
                    required
                  />
                  <div className="upload-info">
                    <span className="upload-icon">🎓</span>
                    <span>Upload your degree certificate</span>
                  </div>
                  {formData.degree_certificate && (
                    <div className="file-selected">
                      ✅ {formData.degree_certificate.name}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="upload-group">
                <label>Upload Achievements/Certificates</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'achievements_file')}
                  />
                  <div className="upload-info">
                    <span className="upload-icon">🏆</span>
                    <span>Choose PDF or image file</span>
                  </div>
                  {formData.achievements_file && (
                    <div className="file-selected">
                      ✅ {formData.achievements_file.name}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="upload-group">
                <label>Upload Experience Proof</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'experience_proof_file')}
                  />
                  <div className="upload-info">
                    <span className="upload-icon">📋</span>
                    <span>Experience letter or certificate</span>
                  </div>
                  {formData.experience_proof_file && (
                    <div className="file-selected">
                      ✅ {formData.experience_proof_file.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-container">
            <div className="step-header">
              <div className="step-icon">✅</div>
              <h3>Review & Submit</h3>
              <p>Please review your information before submitting</p>
            </div>
            
            <div className="review-section">
              <div className="review-card">
                <h4>Personal Information</h4>
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Phone:</strong> {formData.mobile}</p>

                <p><strong>Gender:</strong> {formData.gender}</p>
              </div>
              
              <div className="review-card">
                <h4>Professional Background</h4>
                <p><strong>Qualification:</strong> {formData.highest_qualification}</p>
                <p><strong>Experience:</strong> {formData.experience_years} years</p>
                <div><strong>Teaching Experience:</strong></div>
                {formData.institutes.map((inst, index) => (
                  <p key={index} style={{marginLeft: '20px'}}>
                    <strong>{inst.name}:</strong> {inst.from_year} - {inst.to_year}
                  </p>
                ))}
              </div>
              
              <div className="review-card">
                <h4>Teaching Expertise</h4>
                <p><strong>Boards:</strong> {formData.boards.join(', ')}</p>
                <div><strong>Subject-Class Mapping:</strong></div>
                {Object.entries(formData.subject_classes).map(([subject, classes]) => (
                  <p key={subject} style={{marginLeft: '20px'}}>
                    <strong>{subject}:</strong> Classes {classes.join(', ')}
                  </p>
                ))}
                <p><strong>Languages:</strong> {formData.languages_known.join(', ') || 'Not specified'}</p>
              </div>
              
              <div className="review-card">
                <h4>Uploaded Documents</h4>
                <p><strong>Profile Picture:</strong> {formData.profile_picture?.name || 'Not uploaded'}</p>
                <p><strong>CV:</strong> {formData.cv_file?.name || 'Not uploaded'}</p>
                <p><strong>Degree Certificate:</strong> {formData.degree_certificate?.name || 'Not uploaded'}</p>
                <p><strong>Achievements:</strong> {formData.achievements_file?.name || 'Not uploaded'}</p>
                <p><strong>Experience Proof:</strong> {formData.experience_proof_file?.name || 'Not uploaded'}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="creative-register">
      <div className="register-container">
        <div className="register-header">
          <div className="logo">
            <span className="logo-icon">🎯</span>
            <span className="logo-text">EduYata</span>
          </div>
          <h1>Join as an Educator</h1>
          <p>Shape the future, one student at a time</p>
        </div>

        <div className="progress-section">
          <div className="progress-bar">
            {[1, 2, 3, 4, 5].map(step => (
              <div
                key={step}
                className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
              >
                <div className="step-number">{step}</div>
                <div className="step-label">
                  {step === 1 && 'Personal'}
                  {step === 2 && 'Professional'}
                  {step === 3 && 'Expertise'}
                  {step === 4 && 'Documents'}
                  {step === 5 && 'Review'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="register-form">
          {renderStep()}
          
          <div className="form-actions">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="btn-secondary">
                <span>←</span> Previous
              </button>
            )}
            
            {currentStep < 5 ? (
              <button 
                type="button" 
                onClick={nextStep} 
                className="btn-primary"
                disabled={!validateStep()}
              >
                Next <span>→</span>
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleSubmit}
                className="btn-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    🚀 Create Account
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="register-footer">
          <p>Already have an account? <button onClick={() => navigate('/login')} className="link-btn">Sign in here</button></p>
        </div>
      </div>
    </div>
  );
};

export default CreativeTeacherRegister;
