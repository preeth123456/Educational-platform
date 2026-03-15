import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import SessionManager from '../utils/sessionManager';
import './Login.css';

const Login: React.FC = () => {
  const [, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordMinLength, setPasswordMinLength] = useState(6);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [expiredStudentId, setExpiredStudentId] = useState('');
  const [passwordChangeData, setPasswordChangeData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // ✅ Fetch password min length from config on mount (safe)
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('http://localhost:8001/api/admin/config/public/');
        if (!response.ok) {
          console.warn('Config API failed:', response.status);
          return;
        }

        const data = await response.json();
        if (data?.data && Array.isArray(data.data)) {
          const minLengthConfig = data.data.find((item: any) => item.key === 'password_min_length');
          if (minLengthConfig) {
            setPasswordMinLength(parseInt(minLengthConfig.value) || 6);
          }
        }
      } catch (error) {
        console.error('Failed to fetch config:', error);
      }
    };

    fetchConfig();
  }, []);

  // ✅ Unified login form state
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: '',
  });

  // ✅ Registration form state
  const [showRegistration, setShowRegistration] = useState(false);
  const [showTeacherRegistration, setShowTeacherRegistration] = useState(false);

  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    class: '',
    board: '',
    password: '',
    confirmPassword: '',
  });

  const [teacherRegistrationData, setTeacherRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // ✅ FIXED LOGIN HANDLER
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!loginData.identifier || !loginData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      // Determine login type based on identifier format
      let loginEndpoint = '';
      let requestData: any = {};

      if (loginData.identifier === 'admin@eduyata.com' || loginData.identifier === 'admin') {
        loginEndpoint = 'http://localhost:8001/api/admin/login/';
        requestData = {
          email: loginData.identifier === 'admin' ? 'admin@eduyata.com' : loginData.identifier,
          password: loginData.password,
        };
      } else if (loginData.identifier.includes('@')) {
        loginEndpoint = 'http://localhost:8001/api/auth/teacher_login/';
        requestData = {
          email: loginData.identifier,
          password: loginData.password,
        };
      } else if (loginData.identifier.startsWith('TCH')) {
        setError('Please use your email address to login as a teacher');
        setIsLoading(false);
        return;
      } else {
        loginEndpoint = 'http://localhost:8001/api/auth/student_login/';
        requestData = {
          studentId: loginData.identifier,
          password: loginData.password,
        };
      }

      console.log('Attempting login with:', requestData);

      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      let result: any = {};
      try {
        result = await response.json();
      } catch (jsonErr) {
        console.error('Login response is not JSON:', jsonErr);
        setError('Login server error (Invalid response)');
        setIsLoading(false);
        return;
      }

      console.log('🔍 LOGIN RESPONSE:', result);
      console.log('📊 Response status:', response.status);
      console.log('✅ Success field:', result?.success);
      console.log('📦 result.data:', result?.data);
      console.log('👤 data.id:', result?.data?.id);
      console.log('🎭 data.role:', result?.data?.role);
      console.log('🔑 session_token:', result?.session_token);

      // ✅ SUCCESS DETECTION (IMPORTANT FIX)
      // Handle different response formats for different endpoints
      let isBackendSuccess = false;
      let userData = null;
      let sessionToken = null;

      if (loginEndpoint.includes('admin')) {
        // Admin login response format: {status: "success", token: "...", user: {...}}
        isBackendSuccess = result?.status === 'success' && !!result?.token && !!result?.user;
        userData = result?.user;
        sessionToken = result?.token;
      } else {
        // Student/Teacher login response format: {success: true, session_token: "...", data: {...}}
        isBackendSuccess = result?.success === true || (response.ok === true && !!result?.session_token && !!result?.data?.id);
        userData = result?.data;
        sessionToken = result?.session_token;
      }

      if (isBackendSuccess) {
        console.log('✅ LOGIN SUCCESS CONFIRMED');

        // ✅ Save token
        if (sessionToken) {
          localStorage.setItem('session_token', sessionToken);
          if (loginEndpoint.includes('admin')) {
            localStorage.setItem('admin_token', sessionToken);
          }
          if (result.expires_at) localStorage.setItem('session_expires', result.expires_at);
        }

        // ✅ Prepare userData
        const finalUserData = { ...userData, session_token: sessionToken };

        // ✅ Ensure id and role exist
        if (!finalUserData.id) {
          console.warn('Login success but user id missing from backend response!');
        }
        if (!finalUserData.role) {
          console.warn('Login success but role missing from backend response!');
        }

        // ✅ Save session
        SessionManager.saveSession(finalUserData);

        // ✅ Initialize contexts after successful login (safe)
        try {
          await fetch('http://localhost:8001/api/auth/contexts/initialize/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: finalUserData.id,
              user_type: finalUserData.role,
            }),
          });
        } catch (ctxErr) {
          console.error('Failed to initialize contexts:', ctxErr);
        }

        // ✅ Redirect based on endpoint
        if (loginEndpoint.includes('admin')) {
          navigate('/admin-dashboard');
        } else if (loginEndpoint.includes('teacher')) {
          navigate('/teacher-dashboard');
        } else {
          navigate('/dashboard');
        }

        // ✅ Device warning
        if (result?.new_device && result?.warning) {
          alert(result.warning);
        }

        setIsLoading(false);
        return;
      }

      // ❌ FAILED LOGIN
      console.log('❌ LOGIN FAILED');

      // ✅ Handle password expired response
      if (result?.error_code === 'PASSWORD_EXPIRED') {
        const displayDays = Math.min(result.password_age_days || 90, 90);
        setError(`Password expired (${displayDays} days old). Please change your password.`);
        setIsLoading(false);
        return;
      }

      // ✅ Handle lockout style response
      if (result?.error_code === 'ACCOUNT_LOCKED') {
        const remaining = Number(result.lockout_remaining_seconds || 0);
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        setError(
          `Account locked. Try again in ${minutes}:${seconds.toString().padStart(2, '0')} minutes`
        );
        setIsLoading(false);
        return;
      }

      if (result?.error_code === 'INVALID_CREDENTIALS') {
        if (result?.attempts_left !== undefined) {
          setError(`Invalid username or password. Attempts left: ${result.attempts_left}`);
        } else {
          setError(result?.message || 'Invalid credentials');
        }
        setIsLoading(false);
        return;
      }

      // fallback error message
      setError(result?.message || result?.error || 'Invalid credentials');
      setIsLoading(false);
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
      setIsLoading(false);
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (
      !registrationData.name ||
      !registrationData.phone ||
      !registrationData.class ||
      !registrationData.board ||
      !registrationData.password
    ) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (registrationData.password.length < passwordMinLength) {
      setError(`Password must be at least ${passwordMinLength} characters long`);
      setIsLoading(false);
      return;
    }

    if (registrationData.password !== registrationData.confirmPassword) {
      setError('Passwords do not match!');
      setIsLoading(false);
      return;
    }

    try {
      const backendData = {
        name: registrationData.name,
        mobile_self: registrationData.phone,
        class_level: registrationData.class,
        board: registrationData.board,
        password: registrationData.password,
      };

      const response = await fetch('http://localhost:8001/api/auth/student_register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(
          `Registration successful!\n\nYour Student ID is: ${result.student_id}\n\nPlease save this ID for login.`
        );
        if (result.data) {
          SessionManager.saveSession(result.data);
        }
        navigate('/profile-completion');
      } else {
        setError(result.error || result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleRegistrationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegistrationData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleTeacherRegistrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTeacherRegistrationData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordChangeData.newPassword !== passwordChangeData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwordChangeData.newPassword.length < passwordMinLength) {
      setError(`New password must be at least ${passwordMinLength} characters long`);
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8001/api/auth/change_password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: expiredStudentId,
          user_type: 'student',
          old_password: passwordChangeData.oldPassword,
          new_password: passwordChangeData.newPassword
        })
      });
      
      const result = await response.json();
      
      console.log('Password change response:', result); // Debug log
      
      if (result.success) {
        alert('Password changed successfully! Please login with your new password.');
        setShowPasswordChangeModal(false);
        setPasswordChangeData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setError('');
      } else {
        const errorMsg = result.message || 'Failed to change password';
        console.log('Password change error:', errorMsg); // Debug log
        setError(errorMsg);
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordChangeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordChangeData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleTeacherRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (
      !teacherRegistrationData.name ||
      !teacherRegistrationData.email ||
      !teacherRegistrationData.phone ||
      !teacherRegistrationData.password
    ) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (teacherRegistrationData.password !== teacherRegistrationData.confirmPassword) {
      setError('Passwords do not match!');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8001/api/auth/teacher_register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: teacherRegistrationData.name,
          email: teacherRegistrationData.email,
          phone: teacherRegistrationData.phone,
          password: teacherRegistrationData.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Teacher registration successful! Please check your email for verification.');
        setShowTeacherRegistration(false);
      } else {
        setError(result.error || result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Teacher registration error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-bg" />
      <div className={`login-container ${showRegistration ? 'registration-mode' : ''}`}>
        <div className="login-panel login-panel-form login-panel-left active">
          <div className="login-panel-content">
            <h2 className="login-title">
              {showRegistration
                ? 'Student Registration'
                : showTeacherRegistration
                ? 'Teacher Registration'
                : 'Login to Eduyata'}
            </h2>

            {!showRegistration && !showTeacherRegistration ? (
              <form className="login-form" onSubmit={handleLogin}>
                <div className="input-group">
                  <label className="input-label">Email</label>
                  <input
                    type="text"
                    name="identifier"
                    placeholder="Student ID / Teacher Email"
                    className="login-input"
                    value={loginData.identifier}
                    onChange={handleLoginChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Password"
                      className="login-input"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {error && <div className="login-error">{error}</div>}

                <a href="#" className="login-forgot">
                  Forgot your password?
                </a>

                <button type="submit" className="login-btn" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>

                <div className="signup-links">
                  <div className="login-signup-link">
                    Don't have a student account?{' '}
                    <button
                      type="button"
                      className="login-link-btn"
                      onClick={() => setShowRegistration(true)}
                    >
                      Sign up here
                    </button>
                  </div>
                  <div className="teacher-register-link">
                    Teacher?{' '}
                    <button
                      type="button"
                      className="login-link-btn"
                      onClick={() => navigate('/creative-teacher-register')}
                    >
                      Register as Teacher
                    </button>
                  </div>
                </div>
              </form>
            ) : showRegistration ? (
              <form className="login-form" onSubmit={handleRegistration}>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="login-input"
                  value={registrationData.name}
                  onChange={handleRegistrationChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="login-input"
                  value={registrationData.email}
                  onChange={handleRegistrationChange}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className="login-input"
                  value={registrationData.phone}
                  onChange={handleRegistrationChange}
                  required
                />
                <select
                  name="class"
                  className="login-input"
                  value={registrationData.class}
                  onChange={handleRegistrationChange}
                  required
                >
                  <option value="">Select Class</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={String(i + 1)}>
                      Class {i + 1}
                    </option>
                  ))}
                </select>
                <select
                  name="board"
                  className="login-input"
                  value={registrationData.board}
                  onChange={handleRegistrationChange}
                  required
                >
                  <option value="">Select Board</option>
                  <option value="cbse">CBSE</option>
                  <option value="icse">ICSE</option>
                  <option value="state">State Board</option>
                  <option value="igcse">IGCSE</option>
                </select>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="login-input"
                  value={registrationData.password}
                  onChange={handleRegistrationChange}
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="login-input"
                  value={registrationData.confirmPassword}
                  onChange={handleRegistrationChange}
                  required
                />
                {error && <div className="login-error">{error}</div>}
                <button type="submit" className="login-btn" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
                <div className="login-signup-link">
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="login-link-btn"
                    onClick={() => setShowRegistration(false)}
                  >
                    Login here
                  </button>
                </div>
              </form>
            ) : (
              <form className="login-form" onSubmit={handleTeacherRegistration}>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="login-input"
                  value={teacherRegistrationData.name}
                  onChange={handleTeacherRegistrationChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="login-input"
                  value={teacherRegistrationData.email}
                  onChange={handleTeacherRegistrationChange}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className="login-input"
                  value={teacherRegistrationData.phone}
                  onChange={handleTeacherRegistrationChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="login-input"
                  value={teacherRegistrationData.password}
                  onChange={handleTeacherRegistrationChange}
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="login-input"
                  value={teacherRegistrationData.confirmPassword}
                  onChange={handleTeacherRegistrationChange}
                  required
                />
                {error && <div className="login-error">{error}</div>}
                <button type="submit" className="login-btn" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Teacher Account'}
                </button>
                <div className="login-signup-link">
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="login-link-btn"
                    onClick={() => setShowTeacherRegistration(false)}
                  >
                    Login here
                  </button>
                </div>
              </form>
            )}

            <div className="login-help">
              For help, contact <a href="mailto:support@eduyata.com">support@eduyata.com</a>
            </div>
          </div>
        </div>

        <div className="login-panel login-panel-welcome login-panel-right gradient-bg active">
          <div className="login-welcome-panel-content">
            <h2 className="login-welcome">
              {showRegistration
                ? 'Join Eduyata!'
                : showTeacherRegistration
                ? 'Become an Educator!'
                : 'Welcome to Eduyata!'}
            </h2>
            <p className="login-desc">
              {showRegistration
                ? 'Create your student account and start your learning journey with us.'
                : showTeacherRegistration
                ? 'Join our community of educators and share your knowledge with students worldwide.'
                : 'Your unified platform for learning and teaching. Login with your credentials to access your personalized dashboard.'}
            </p>
            <div className="login-features">
              <div className="feature-item">🎓 Students: Interactive Learning</div>
              <div className="feature-item">👨‍🏫 Teachers: Course Management</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Password Change Modal */}
      {showPasswordChangeModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordChangeModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{
            background: 'white',
            padding: '30px',
            borderRadius: '10px',
            width: '400px',
            maxWidth: '90vw'
          }}>
            <div className="modal-header" style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#333' }}>Change Password</h3>
              <button 
                className="modal-close" 
                onClick={() => setShowPasswordChangeModal(false)}
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '15px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >×</button>
            </div>
            
            <form onSubmit={handlePasswordChangeSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Current Password</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordChangeData.oldPassword}
                  onChange={handlePasswordChangeInputChange}
                  className="login-input"
                  required
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordChangeData.newPassword}
                  onChange={handlePasswordChangeInputChange}
                  className="login-input"
                  required
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordChangeData.confirmPassword}
                  onChange={handlePasswordChangeInputChange}
                  className="login-input"
                  required
                />
              </div>
              
              {error && <div className="login-error" style={{ marginBottom: '15px' }}>{error}</div>}
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowPasswordChangeModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #ddd',
                    background: 'white',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  {isLoading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
