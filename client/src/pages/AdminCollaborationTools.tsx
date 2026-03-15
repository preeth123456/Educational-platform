import React, { useState, useRef, useEffect } from 'react';
import { FaDesktop, FaVideo, FaPen, FaComments, FaPlay, FaMicrophone, FaMicrophoneSlash, FaVideo as FaVideoOff, FaVideoSlash, FaCalendarAlt, FaExternalLinkAlt, FaPlus, FaClock, FaUsers, FaPaperPlane, FaCrown, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import '../Dashboard.css';

const AdminCollaborationTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [micEnabled, setMicEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [meetingCode, setMeetingCode] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [selectedTool, setSelectedTool] = useState<'pen' | 'eraser'>('pen');

  // Meeting scheduling state
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduledMeetings, setScheduledMeetings] = useState([
    {
      id: 1,
      title: 'Math Class - Algebra',
      description: 'Weekly algebra session covering quadratic equations',
      scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      duration: 60,
      platform: 'google_meet',
      participants: ['All Students', 'Math Teachers'],
      status: 'scheduled',
      meetingCode: 'MATH001'
    },
    {
      id: 2,
      title: 'Science Lab Session',
      description: 'Hands-on chemistry experiments',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      duration: 90,
      platform: 'zoom',
      participants: ['Science Students', 'Lab Assistants'],
      status: 'scheduled',
      meetingCode: 'SCI001'
    }
  ]);

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      channel: '#General',
      user: 'Admin',
      userType: 'admin',
      message: 'Welcome to the collaboration space! Feel free to discuss and schedule meetings.',
      time: '10:30 AM',
      timestamp: new Date()
    },
    {
      id: 2,
      channel: '#General',
      user: 'Mr. Sharma',
      userType: 'teacher',
      message: 'Hello everyone! I have prepared the lesson plan for tomorrow\'s math class.',
      time: '10:32 AM',
      timestamp: new Date()
    },
    {
      id: 3,
      channel: '#General',
      user: 'Priya S',
      userType: 'student',
      message: 'Thank you sir! I\'m looking forward to the class.',
      time: '10:35 AM',
      timestamp: new Date()
    },
    {
      id: 4,
      channel: '#Design',
      user: 'Ms. Patel',
      userType: 'teacher',
      message: 'Design students, please check the new project requirements posted in the LMS.',
      time: '10:40 AM',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [activeChannel, setActiveChannel] = useState('#General');

  // Meeting form state
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '60',
    platform: 'google_meet',
    participants: 'all'
  });

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaDesktop size={20} /> },
    { id: 'meeting', label: 'Meeting Lobby', icon: <FaVideo size={20} /> },
    { id: 'whiteboard', label: 'Whiteboard', icon: <FaPen size={20} /> },
    { id: 'chat', label: 'Chat', icon: <FaComments size={20} /> }
  ];

  // Mock upcoming meetings
  const upcomingMeetings = [
    { id: 1, title: 'Math Class - Algebra', time: '10:00 AM', date: 'Today' },
    { id: 2, title: 'Science Lab Session', time: '2:00 PM', date: 'Today' },
    { id: 3, title: 'English Literature', time: '4:00 PM', date: 'Tomorrow' }
  ];

  // Webcam and screen sharing functionality
  useEffect(() => {
    if (activeTab === 'meeting') {
      if (screenSharing) {
        startScreenShare();
      } else if (videoEnabled) {
        startWebcam();
      } else {
        stopWebcam();
      }
    } else {
      stopWebcam();
      stopScreenShare();
    }
  }, [activeTab, videoEnabled, screenSharing]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing screen share:', error);
    }
  };

  const stopScreenShare = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Whiteboard functionality
  useEffect(() => {
    if (activeTab === 'whiteboard' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [activeTab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = selectedTool === 'eraser' ? 'white' : brushColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  // Chat functionality
  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        channel: activeChannel,
        user: 'Admin',
        userType: 'admin' as const,
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  // Schedule meeting functionality
  const scheduleMeeting = () => {
    if (!meetingForm.title || !meetingForm.date || !meetingForm.time) {
      alert('Please fill in all required fields');
      return;
    }

    const newMeeting = {
      id: Date.now(),
      title: meetingForm.title,
      description: meetingForm.description,
      scheduledAt: new Date(`${meetingForm.date}T${meetingForm.time}`),
      duration: parseInt(meetingForm.duration),
      platform: meetingForm.platform,
      participants: meetingForm.participants === 'all' ? ['All Users'] : ['Selected Users'],
      status: 'scheduled' as const,
      meetingCode: `MEET${Date.now().toString().slice(-4)}`
    };

    setScheduledMeetings(prev => [...prev, newMeeting]);

    // Reset form
    setMeetingForm({
      title: '',
      description: '',
      date: '',
      time: '',
      duration: '60',
      platform: 'google_meet',
      participants: 'all'
    });

    setShowScheduleForm(false);

    // Add notification to chat
    const notificationMessage = {
      id: Date.now() + 1,
      channel: '#General',
      user: 'System',
      userType: 'system' as const,
      message: `📅 New meeting scheduled: "${newMeeting.title}" on ${newMeeting.scheduledAt.toLocaleDateString()} at ${newMeeting.scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, notificationMessage]);
  };

  // Join meeting functionality
  const joinMeeting = (meeting: any) => {
    if (meeting.platform === 'google_meet') {
      window.open('https://meet.google.com/new', '_blank');
    } else if (meeting.platform === 'zoom') {
      window.open('https://zoom.us/start', '_blank');
    }
  };

  const channels = ['#General', '#Design', '#Support'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="collaboration-dashboard">
            <div className="welcome-banner">
              <div className="welcome-content">
                <h2>Welcome to Collaboration Hub</h2>
                <p>Connect, collaborate, and create together</p>
                <div className="banner-actions">
                  <button className="btn-primary join-meeting-btn">
                    <FaPlay /> Join Next Meeting
                  </button>
                  <button
                    className="btn-secondary schedule-btn"
                    onClick={() => setShowScheduleForm(true)}
                  >
                    <FaPlus /> Schedule Meeting
                  </button>
                </div>
              </div>
            </div>

            {showScheduleForm && (
              <div className="schedule-form-modal">
                <div className="schedule-form">
                  <h3>Schedule New Meeting</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Meeting Title *</label>
                      <input
                        type="text"
                        value={meetingForm.title}
                        onChange={(e) => setMeetingForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter meeting title"
                      />
                    </div>
                    <div className="form-group">
                      <label>Platform</label>
                      <select
                        value={meetingForm.platform}
                        onChange={(e) => setMeetingForm(prev => ({ ...prev, platform: e.target.value }))}
                      >
                        <option value="google_meet">Google Meet</option>
                        <option value="zoom">Zoom</option>
                        <option value="teams">Microsoft Teams</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Date *</label>
                      <input
                        type="date"
                        value={meetingForm.date}
                        onChange={(e) => setMeetingForm(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Time *</label>
                      <input
                        type="time"
                        value={meetingForm.time}
                        onChange={(e) => setMeetingForm(prev => ({ ...prev, time: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Duration (min)</label>
                      <select
                        value={meetingForm.duration}
                        onChange={(e) => setMeetingForm(prev => ({ ...prev, duration: e.target.value }))}
                      >
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="90">1.5 hours</option>
                        <option value="120">2 hours</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={meetingForm.description}
                      onChange={(e) => setMeetingForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Meeting description (optional)"
                      rows={3}
                    />
                  </div>
                  <div className="form-group">
                    <label>Participants</label>
                    <select
                      value={meetingForm.participants}
                      onChange={(e) => setMeetingForm(prev => ({ ...prev, participants: e.target.value }))}
                    >
                      <option value="all">All Users (Students & Teachers)</option>
                      <option value="students">Students Only</option>
                      <option value="teachers">Teachers Only</option>
                    </select>
                  </div>
                  <div className="form-actions">
                    <button className="btn-secondary" onClick={() => setShowScheduleForm(false)}>
                      Cancel
                    </button>
                    <button className="btn-primary" onClick={scheduleMeeting}>
                      <FaCalendarAlt /> Schedule Meeting
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="upcoming-meetings">
              <h3>Scheduled Meetings</h3>
              <div className="meetings-list">
                {scheduledMeetings.map(meeting => (
                  <div key={meeting.id} className="meeting-item">
                    <div className="meeting-info">
                      <h4>{meeting.title}</h4>
                      <p>{meeting.scheduledAt.toLocaleDateString()} at {meeting.scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      <div className="meeting-meta">
                        <span className="duration"><FaClock /> {meeting.duration}min</span>
                        <span className="platform">{meeting.platform === 'google_meet' ? 'Google Meet' : meeting.platform === 'zoom' ? 'Zoom' : 'Teams'}</span>
                        <span className="participants"><FaUsers /> {meeting.participants.join(', ')}</span>
                      </div>
                    </div>
                    <button className="btn-primary" onClick={() => joinMeeting(meeting)}>
                      <FaPlay /> Join
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="quick-launch">
              <h3>Quick Launch</h3>
              <div className="launch-buttons">
                <button
                  className="launch-btn google-meet"
                  onClick={() => window.open('https://meet.google.com/new', '_blank')}
                >
                  <FaVideo /> Google Meet
                  <FaExternalLinkAlt />
                </button>
                <button
                  className="launch-btn zoom"
                  onClick={() => window.open('https://zoom.us/start', '_blank')}
                >
                  <FaVideo /> Zoom
                  <FaExternalLinkAlt />
                </button>
              </div>
            </div>
          </div>
        );

      case 'meeting':
        return (
          <div className="meeting-lobby">
            <div className="webcam-section">
              <div className="webcam-container">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="webcam-preview"
                  style={{ display: videoEnabled ? 'block' : 'none' }}
                />
                {!videoEnabled && !screenSharing && (
                  <div className="webcam-placeholder">
                    <FaVideo size={48} />
                    <p>Camera Off</p>
                  </div>
                )}
              </div>
            </div>

            <div className="meeting-controls">
              <div className="control-buttons">
                <button
                  className={`control-btn ${micEnabled ? 'active' : ''}`}
                  onClick={() => setMicEnabled(!micEnabled)}
                >
                  {micEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
                  {micEnabled ? 'Mute' : 'Unmute'}
                </button>
                <button
                  className={`control-btn ${videoEnabled ? 'active' : ''}`}
                  onClick={() => {
                    if (!videoEnabled) {
                      setScreenSharing(false);
                    }
                    setVideoEnabled(!videoEnabled);
                  }}
                >
                  {videoEnabled ? <FaVideo /> : <FaVideoSlash />}
                  {videoEnabled ? 'Stop Video' : 'Start Video'}
                </button>
                <button
                  className={`control-btn ${screenSharing ? 'active' : ''}`}
                  onClick={() => {
                    if (!screenSharing) {
                      setVideoEnabled(false);
                    }
                    setScreenSharing(!screenSharing);
                  }}
                >
                  <FaDesktop />
                  {screenSharing ? 'Stop Share' : 'Share Screen'}
                </button>
                <button
                  className="control-btn"
                  onClick={() => setActiveTab('chat')}
                >
                  <FaComments />
                  Chat
                </button>
                <button
                  className="control-btn"
                  onClick={() => setActiveTab('whiteboard')}
                >
                  <FaPen />
                  Whiteboard
                </button>
              </div>
            </div>

            <div className="meeting-join">
              <div className="join-form">
                <input
                  type="text"
                  placeholder="Enter meeting code"
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                  className="meeting-code-input"
                />
                <button className="btn-primary join-btn">
                  <FaPlay /> Join Meeting
                </button>
              </div>
            </div>
          </div>
        );

      case 'whiteboard':
        return (
          <div className="whiteboard-section">
            <div className="whiteboard-toolbar">
              <div className="tool-buttons">
                <button
                  className={`tool-btn ${selectedTool === 'pen' ? 'active' : ''}`}
                  onClick={() => setSelectedTool('pen')}
                >
                  <FaPen /> Pen
                </button>
                <button
                  className={`tool-btn ${selectedTool === 'eraser' ? 'active' : ''}`}
                  onClick={() => setSelectedTool('eraser')}
                >
                  Eraser
                </button>
              </div>

              <div className="color-picker">
                {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'].map(color => (
                  <button
                    key={color}
                    className={`color-btn ${brushColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setBrushColor(color)}
                  />
                ))}
              </div>

              <div className="brush-size">
                <label>Size:</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                />
                <span>{brushSize}px</span>
              </div>

              <button className="btn-secondary clear-btn" onClick={clearCanvas}>
                Clear All
              </button>
            </div>

            <div className="whiteboard-canvas">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                style={{ border: '1px solid #ddd', cursor: 'crosshair' }}
              />
            </div>
          </div>
        );

      case 'chat':
        return (
          <div className="chat-section">
            <div className="chat-sidebar">
              <h3>Channels</h3>
              <div className="channels-list">
                {channels.map(channel => (
                  <button
                    key={channel}
                    className={`channel-btn ${activeChannel === channel ? 'active' : ''}`}
                    onClick={() => setActiveChannel(channel)}
                  >
                    {channel}
                  </button>
                ))}
              </div>
              <div className="online-users">
                <h4>Online Users</h4>
                <div className="user-list">
                  <div className="user-item">
                    <FaCrown className="user-icon admin" />
                    <span>Admin</span>
                    <div className="status online"></div>
                  </div>
                  <div className="user-item">
                    <FaChalkboardTeacher className="user-icon teacher" />
                    <span>Mr. Sharma (Teacher)</span>
                    <div className="status online"></div>
                  </div>
                  <div className="user-item">
                    <FaChalkboardTeacher className="user-icon teacher" />
                    <span>Ms. Patel (Teacher)</span>
                    <div className="status online"></div>
                  </div>
                  <div className="user-item">
                    <FaUserGraduate className="user-icon student" />
                    <span>Priya S (Student)</span>
                    <div className="status online"></div>
                  </div>
                  <div className="user-item">
                    <FaUserGraduate className="user-icon student" />
                    <span>Rahul M (Student)</span>
                    <div className="status away"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="chat-main">
              <div className="chat-header">
                <h3>{activeChannel}</h3>
                <span className="channel-description">
                  {activeChannel === '#General' && 'General discussion for all users'}
                  {activeChannel === '#Design' && 'Design and UI/UX discussions'}
                  {activeChannel === '#Support' && 'Technical support and help'}
                </span>
              </div>

              <div className="chat-messages">
                {chatMessages
                  .filter(msg => msg.channel === activeChannel)
                  .map((msg) => (
                    <div key={msg.id} className={`chat-message ${msg.userType}`}>
                      <div className="message-avatar">
                        {msg.userType === 'admin' && <FaCrown />}
                        {msg.userType === 'teacher' && <FaChalkboardTeacher />}
                        {msg.userType === 'student' && <FaUserGraduate />}
                        {msg.userType === 'system' && <FaUsers />}
                      </div>
                      <div className="message-content">
                        <div className="message-header">
                          <span className={`chat-user ${msg.userType}`}>{msg.user}</span>
                          <span className="chat-time">{msg.time}</span>
                        </div>
                        <div className="chat-text">{msg.message}</div>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="chat-input">
                <input
                  type="text"
                  placeholder={`Message ${activeChannel}`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage} className="btn-primary">
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          {/* Header */}
          <div className="hero-welcome">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">Collaboration Tools</h1>
                <p className="hero-subtitle">Connect, collaborate, and create with integrated tools</p>
              </div>
            </div>
          </div>

          <div className="collaboration-container">
            {/* Vertical Tab Navigation */}
            <div className="collaboration-sidebar">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`collaboration-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  <span className="tab-label">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Main Content */}
            <div className="collaboration-content">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCollaborationTools;