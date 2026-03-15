import React, { useState } from 'react';
import { useLocation } from 'wouter';
import './TeacherRegistration.css';
import SessionManager from '../utils/sessionManager';

interface TeacherFormData {
  // Personal Details
  name: string;
  email: string;
  mobile: string;
  profile_picture: string;
  
  // Educational & Professional
  highest_qualification: string;
  other_certifications: string;
  experience_years: number;
  previous_institutions: string;
  
  // Teaching Details
  boards: string[];
  subjects: string[];
  classes_taught: string[];
  medium_of_instruction: string;
  teaching_mode: string;
  
  // Additional Experience
  specialization: string;
  achievements: string;
  availability: string;
  bio: string;
  
  // Upload Section
  resume_cv: string;
  certificates: string;
  experience_proof: string;
  
  // Advanced Features
  teaching_methodology: string;
  languages_known: string[];
  
  password: string;
  confirmPassword: string;
}

const TeacherRegistration: React.FC = () => {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TeacherFormData>({
    name: '',
    email: '',
    mobile: '',
    profile_picture: '',
    highest_qualification: '',
    other_certifications: '',
    experience_years: 0,
    previous_institutions: '',
    boards: [],
    subjects: [],
    classes_taught: [],
    medium_of_instruction: '',
    teaching_mode: '',
    specialization: '',
    achievements: '',
    availability: '',
    bio: '',
    resume_cv: '',
    certificates: '',
    experience_proof: '',
    teaching_methodology: '',
    languages_known: [],
    password: '',
    confirmPassword: ''
  });

  const boardOptions = ['CBSE', 'ICSE', 'State Board', 'NIOS', 'IB', 'IGCSE'];
  const subjectOptions = ['Math', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Economics', 'Political Science', 'Hindi', 'Sanskrit'];
  const classOptions = ['Pre-Primary', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const languageOptions = ['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Urdu'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (name: keyof TeacherFormData, value: string) => {
    setFormData(prev => {
      const currentArray = prev[name] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [name]: newArray };
    });
  };

  const handleFileUpload = (name: keyof TeacherFormData, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, [name]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.email && formData.mobile && formData.password && formData.confirmPassword);
      case 2:
        return !!(formData.highest_qualification && formData.experience_years > 0);
      case 3:
        return !!(formData.boards.length > 0 && formData.subjects.length > 0 && formData.classes_taught.length > 0);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    } else {
      alert('Please fill all mandatory fields');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Transform the data to match backend expectations
    const transformedData = {
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password,
      profile_picture: formData.profile_picture,
      highest_qualification: formData.highest_qualification,
      other_certifications: formData.other_certifications,
      experience_years: Number(formData.experience_years),
      previous_institutions: formData.previous_institutions,
      boards: formData.boards,
      // Convert subjects and classes_taught to subject_classes format
      subject_classes: formData.subjects.reduce((acc: {[key: string]: string[]}, subject) => {
        acc[subject] = formData.classes_taught;
        return acc;
      }, {}),
      medium_of_instruction: formData.medium_of_instruction,
      teaching_mode: formData.teaching_mode,
      specialization: formData.specialization,
      achievements: formData.achievements,
      availability: formData.availability,
      bio: formData.bio,
      resume_cv: formData.resume_cv,
      certificates: formData.certificates,
      experience_proof: formData.experience_proof,
      teaching_methodology: formData.teaching_methodology,
      languages_known: formData.languages_known
    };

    try {
      const response = await fetch('http://localhost:8001/api/auth/teacher_register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformedData)
      });

      const result = await response.json();

      if (response.ok) {
        if (result.status === 'pending_approval') {
          alert(`Registration successful!\n\nYour Teacher ID is: ${result.data.teacher_id}\n\nYour account is pending admin verification. You will receive an email notification once your account is approved. After approval, you can login using your credentials.\n\nPlease save your Teacher ID for future reference.`);
          navigate('/teacher-login');
        } else {
          alert(`Registration successful!\n\nYour Teacher ID is: ${result.data.teacher_id}\n\nPlease save this ID for login.`);
          if (result.data) {
            SessionManager.saveSession(result.data);
          }
          navigate('/teacher-dashboard');
        }
      } else {
        alert(`Registration failed: ${result.error}`);
      }
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3>Personal Details</h3>
            <div className="form-group">
              <label>Full Name <span className="required">*</span></label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address <span className="required">*</span></label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number <span className="required">*</span></label>
              <input
                type="tel"
                name="mobile"
                placeholder="Enter your phone number"
                value={formData.mobile}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password <span className="required">*</span></label>
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password <span className="required">*</span></label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Profile Picture</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="profile-pic"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('profile_picture', e.target.files[0])}
                  className="file-input"
                />
                <label htmlFor="profile-pic" className="file-label">
                  <span className="file-icon">📷</span>
                  Choose Profile Picture
                </label>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3>Educational & Professional Qualifications</h3>
            <div className="form-group">
              <label>Highest Qualification <span className="required">*</span></label>
              <input
                type="text"
                name="highest_qualification"
                placeholder="e.g., M.Ed, B.Ed, M.Sc, Ph.D"
                value={formData.highest_qualification}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Other Certifications</label>
              <textarea
                name="other_certifications"
                placeholder="List any additional certifications or courses"
                value={formData.other_certifications}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Years of Teaching Experience <span className="required">*</span></label>
              <input
                type="number"
                name="experience_years"
                placeholder="Enter years of experience"
                value={formData.experience_years}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label>Previous Institution(s)</label>
              <textarea
                name="previous_institutions"
                placeholder="List schools/institutions where you have taught"
                value={formData.previous_institutions}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3>Teaching Details</h3>
            <div className="form-group">
              <label>Board(s) You Teach For <span className="required">*</span></label>
              <div className="checkbox-grid">
                {boardOptions.map(board => (
                  <label key={board} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.boards.includes(board)}
                      onChange={() => handleMultiSelect('boards', board)}
                    />
                    <span className="checkmark"></span>
                    {board}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>Subjects You Teach <span className="required">*</span></label>
              <div className="checkbox-grid">
                {subjectOptions.map(subject => (
                  <label key={subject} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.subjects.includes(subject)}
                      onChange={() => handleMultiSelect('subjects', subject)}
                    />
                    <span className="checkmark"></span>
                    {subject}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>Classes/Grades You Teach <span className="required">*</span></label>
              <div className="checkbox-grid">
                {classOptions.map(cls => (
                  <label key={cls} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.classes_taught.includes(cls)}
                      onChange={() => handleMultiSelect('classes_taught', cls)}
                    />
                    <span className="checkmark"></span>
                    Class {cls}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>Medium of Instruction</label>
              <input
                type="text"
                name="medium_of_instruction"
                placeholder="e.g., English, Hindi, Regional Language"
                value={formData.medium_of_instruction}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Preferred Teaching Mode</label>
              <select
                name="teaching_mode"
                value={formData.teaching_mode}
                onChange={handleInputChange}
              >
                <option value="">Select Teaching Mode</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h3>Additional Experience</h3>
            <div className="form-group">
              <label>Specialization/Expertise</label>
              <textarea
                name="specialization"
                placeholder="Describe your areas of specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Achievements/Awards</label>
              <textarea
                name="achievements"
                placeholder="List your achievements and awards"
                value={formData.achievements}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Availability/Timings</label>
              <textarea
                name="availability"
                placeholder="Mention your preferred teaching hours"
                value={formData.availability}
                onChange={handleInputChange}
                rows={2}
              />
            </div>
            <div className="form-group">
              <label>Short Bio/About Me</label>
              <textarea
                name="bio"
                placeholder="Write a brief introduction about yourself"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
            <div className="form-group">
              <label>Teaching Style/Methodology</label>
              <textarea
                name="teaching_methodology"
                placeholder="Describe your teaching approach and methods"
                value={formData.teaching_methodology}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <div className="form-group">
              <label>Languages Known</label>
              <div className="checkbox-grid">
                {languageOptions.map(lang => (
                  <label key={lang} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.languages_known.includes(lang)}
                      onChange={() => handleMultiSelect('languages_known', lang)}
                    />
                    <span className="checkmark"></span>
                    {lang}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <h3>Upload Documents</h3>
            <div className="form-group">
              <label>Resume/CV Upload</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="resume-cv"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('resume_cv', e.target.files[0])}
                  className="file-input"
                />
                <label htmlFor="resume-cv" className="file-label">
                  <span className="file-icon">📄</span>
                  Choose Resume/CV
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label>Certificates Upload</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="certificates"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('certificates', e.target.files[0])}
                  className="file-input"
                />
                <label htmlFor="certificates" className="file-label">
                  <span className="file-icon">🏆</span>
                  Choose Certificates
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label>Teaching Experience Proof</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="experience-proof"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('experience_proof', e.target.files[0])}
                  className="file-input"
                />
                <label htmlFor="experience-proof" className="file-label">
                  <span className="file-icon">📋</span>
                  Choose Experience Proof
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="teacher-registration">
      <div className="registration-container">
        <div className="progress-bar">
          {[1, 2, 3, 4, 5].map(step => (
            <div
              key={step}
              className={`progress-step ${currentStep >= step ? 'active' : ''}`}
            >
              {step}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {renderStep()}
          
          <div className="form-navigation">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="btn-secondary">
                Previous
              </button>
            )}
            
            {currentStep < 5 ? (
              <button type="button" onClick={nextStep} className="btn-primary">
                Next
              </button>
            ) : (
              <button type="submit" className="btn-primary">
                Register
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherRegistration;
