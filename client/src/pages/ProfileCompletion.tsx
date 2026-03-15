import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import SessionManager, { StudentSession } from '../utils/sessionManager';
import './ProfileCompletion.css';

const ProfileCompletion: React.FC = () => {
  const [, navigate] = useLocation();
  const [studentSession, setStudentSession] = useState<StudentSession | null>(null);
  const [profileData, setProfileData] = useState({
    gender: '',
    dateOfBirth: '',
    address: '',
    parentName: '',
    parentPhone: '',
    interests: [] as string[],
    profilePicture: ''
  });

  useEffect(() => {
    const session = SessionManager.getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    // Check if it's a student session
    if ('student_id' in session) {
      setStudentSession(session);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8001/api/auth/complete_profile/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentSession?.id,
          ...profileData
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        // Update session with profile completion status
        const updatedSession = { ...studentSession!, profile_completed: true };
        SessionManager.saveSession(updatedSession);
        navigate('/dashboard');
      } else {
        alert(`Profile update failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Profile completion error:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleSkip = () => {
    // Update session to mark profile as completed (even though skipped) to avoid redirect loop
    const updatedSession = { ...studentSession!, profile_completed: true };
    SessionManager.saveSession(updatedSession);
    
    navigate('/dashboard');
  };

  const interests = [
    'Mathematics', 'Science', 'English', 'History', 'Geography',
    'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Arts',
    'Music', 'Sports', 'Literature', 'Economics', 'Psychology'
  ];

  return (
    <div className="profile-completion-container">
      <div className="profile-completion-card">
        <div className="profile-header">
          <h1>Complete Your Profile</h1>
          <p>Help us personalize your learning experience</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={profileData.gender}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={profileData.dateOfBirth}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
              placeholder="Enter your address"
              className="form-input"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Parent/Guardian Name</label>
              <input
                type="text"
                name="parentName"
                value={profileData.parentName}
                onChange={handleInputChange}
                placeholder="Parent/Guardian name"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Parent/Guardian Phone</label>
              <input
                type="tel"
                name="parentPhone"
                value={profileData.parentPhone}
                onChange={handleInputChange}
                placeholder="Parent/Guardian phone"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Interests (Select multiple)</label>
            <div className="interests-grid">
              {interests.map(interest => (
                <button
                  key={interest}
                  type="button"
                  className={`interest-chip ${profileData.interests.includes(interest) ? 'selected' : ''}`}
                  onClick={() => handleInterestToggle(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleSkip} className="btn-skip">
              Skip for now
            </button>
            <button type="submit" className="btn-complete">
              Complete Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileCompletion;
