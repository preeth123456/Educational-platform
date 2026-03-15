import React, { useState, useEffect } from 'react';
import './PrivacyPolicyModal.css';

const PrivacyPolicyModal = () => {
  const [show, setShow] = useState(false);

  console.log('PrivacyPolicyModal loaded');

  useEffect(() => {
    const checkAcceptance = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('User:', user);
      
      const isStudent = user.role === 'student';
      const isTeacher = user.role === 'teacher';
      const userId = user.student_id || user.teacher_id || user.id;
      
      console.log('isStudent:', isStudent, 'isTeacher:', isTeacher, 'userId:', userId);
      
      if ((!isStudent && !isTeacher) || !userId) {
        console.log('Not student/teacher or no userId');
        return;
      }

      try {
        const url = `http://localhost:8001/api/compliance/check/?user_id=${userId}&rule_id=1`;
        console.log('Checking:', url);
        const res = await fetch(url);
        const data = await res.json();
        console.log('Response:', data);
        
        if (!data.accepted) {
          console.log('Showing popup');
          setShow(true);
        }
      } catch (error) {
        console.error('Error:', error);
        setShow(true);
      }
    };

    checkAcceptance();
  }, []);

  const handleAccept = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.student_id || user.teacher_id || user.id || 0;
    const userType = user.role || 'student';
    
    await fetch('http://localhost:8001/api/compliance/log/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rule_id: 1,
        user_id: userId,
        user_type: userType,
        action: 'Accepted Privacy Policy',
        ip_address: '0.0.0.0'
      })
    });

    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="privacy-modal-overlay">
      <div className="privacy-modal">
        <h2>Privacy Policy</h2>
        <p>We value your privacy. By using Eduyata, you agree to our data collection and usage policies.</p>
        <ul>
          <li>We collect learning progress data</li>
          <li>Your data is encrypted and secure</li>
          <li>We never share your data without consent</li>
        </ul>
        <button onClick={handleAccept}>Accept & Continue</button>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
