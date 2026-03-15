import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaPaperPlane, FaUsers, FaSearch, FaSmile, FaArrowLeft } from 'react-icons/fa';
import StudentLayout from '../components/StudentLayout';
import SessionManager from '../utils/sessionManager';
import './StudentChatPage.css';

interface ChatUser {
  id: number;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
  role: 'student' | 'teacher';
  projectGroup?: string;
  projectTitle?: string;
}

interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
}

interface ChatRoom {
  id: number;
  name: string;
  type: 'direct' | 'group' | 'class';
  participants: ChatUser[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}

const StudentChatPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chats' | 'users'>('chats');
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const session = SessionManager.getSession();
  const currentUser = {
    id: session?.id || 1,
    name: session?.name || 'Student',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
  };

  useEffect(() => {
    loadProjectData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadProjectData = async () => {
    try {
      const response = await fetch(`http://localhost:8001/api/collaboration/student-project-groups-chat/?student_id=${currentUser.id}`);
      const data = await response.json();
      
      if (data.chat_rooms && data.project_members) {
        // Convert API data to ChatRoom format
        const projectRooms: ChatRoom[] = data.chat_rooms.map((room: any) => ({
          id: room.group_id,
          name: room.name,
          type: 'group' as const,
          participants: [],
          unreadCount: 0
        }));
        
        // Convert API data to ChatUser format
        const projectUsers: ChatUser[] = data.project_members.map((member: any) => ({
          id: member.id,
          name: member.name,
          avatar: `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face&sig=${member.id}`,
          isOnline: member.isOnline,
          role: member.role as 'student' | 'teacher',
          projectGroup: member.project_group,
          projectTitle: member.project_title
        }));
        
        setChatRooms(projectRooms);
        setUsers(projectUsers);
      }
    } catch (error) {
      console.error('Error loading project data:', error);
      // Fallback to empty arrays if API fails
      setChatRooms([]);
      setUsers([]);
    }
  };

  const loadMessages = (roomId: number) => {
    const mockMessages: ChatMessage[] = [
      {
        id: 1,
        senderId: 2,
        senderName: 'Prof. Johnson',
        message: 'Good morning everyone! Ready for today\'s lesson?',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text'
      },
      {
        id: 2,
        senderId: currentUser.id,
        senderName: currentUser.name,
        message: 'Yes, I\'m excited to learn!',
        timestamp: new Date(Date.now() - 3500000),
        type: 'text'
      },
      {
        id: 3,
        senderId: 3,
        senderName: 'Alice Smith',
        message: 'I have a question about yesterday\'s homework',
        timestamp: new Date(Date.now() - 3400000),
        type: 'text'
      },
      {
        id: 4,
        senderId: 2,
        senderName: 'Prof. Johnson',
        message: 'Sure Alice, what would you like to know?',
        timestamp: new Date(Date.now() - 3300000),
        type: 'text'
      }
    ];
    setMessages(mockMessages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!message.trim() || !selectedRoom) return;

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      senderId: currentUser.id,
      senderName: currentUser.name,
      message: message.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    setChatRooms(prev => prev.map(room => 
      room.id === selectedRoom.id 
        ? { ...room, lastMessage: newMessage }
        : room
    ));
  };

  const selectRoom = (room: ChatRoom) => {
    setSelectedRoom(room);
    loadMessages(room.id);
    setChatRooms(prev => prev.map(r => 
      r.id === room.id ? { ...r, unreadCount: 0 } : r
    ));
  };

  const startDirectChat = (user: ChatUser) => {
    const existingRoom = chatRooms.find(room => 
      room.type === 'direct' && room.name === user.name
    );

    if (existingRoom) {
      selectRoom(existingRoom);
    } else {
      const newRoom: ChatRoom = {
        id: chatRooms.length + 1,
        name: user.name,
        type: 'direct',
        participants: [user],
        unreadCount: 0
      };
      setChatRooms(prev => [...prev, newRoom]);
      selectRoom(newRoom);
    }
    setActiveTab('chats');
  };

  const filteredRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <StudentLayout>
      <div className="student-chat-page">
        <div className="chat-container">
          <div className="chat-sidebar">
            <div className="chat-header">
              <h2>💬 Student Chat</h2>
            </div>

            <div className="chat-tabs">
              <button 
                className={`tab ${activeTab === 'chats' ? 'active' : ''}`}
                onClick={() => setActiveTab('chats')}
              >
                📚 Project Groups ({chatRooms.length})
              </button>
              <button 
                className={`tab ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                👥 Team Members ({users.length})
              </button>
            </div>

            <div className="search-bar">
              <FaSearch />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="chat-list">
              {activeTab === 'chats' ? (
                filteredRooms.map(room => (
                  <div key={room.id} className="chat-item" onClick={() => selectRoom(room)}>
                    <div className="chat-avatar">
                      📚
                    </div>
                    <div className="chat-info">
                      <div className="chat-name">{room.name}</div>
                      <div className="last-message">
                        {room.lastMessage?.message || 'No messages yet'}
                      </div>
                    </div>
                    <div className="chat-meta">
                      {room.lastMessage && (
                        <div className="timestamp">
                          {room.lastMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                      {room.unreadCount > 0 && (
                        <div className="unread-count">{room.unreadCount}</div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                filteredUsers.map(user => (
                  <div key={user.id} className="user-item" onClick={() => startDirectChat(user)}>
                    <div className="user-avatar">
                      <img src={user.avatar} alt={user.name} />
                      <div className={`status-dot ${user.isOnline ? 'online' : 'offline'}`}></div>
                    </div>
                    <div className="user-info">
                      <div className="user-name">
                        {user.name}
                        {user.role === 'teacher' && <span className="teacher-badge">👨🏫</span>}
                      </div>
                      <div className="user-status">
                        {user.projectGroup ? `${user.projectGroup} • ${user.projectTitle}` : (user.isOnline ? 'Online' : user.lastSeen)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="chat-main">
            {selectedRoom ? (
              <>
                <div className="active-chat-header">
                  <button className="back-btn" onClick={() => setSelectedRoom(null)}>
                    <FaArrowLeft />
                  </button>
                  <div className="chat-title">
                    <h3>{selectedRoom.name}</h3>
                    <span className="chat-type">
                      📚 Project Group
                    </span>
                  </div>
                </div>

                <div className="messages-container">
                  {messages.map(msg => (
                    <div key={msg.id} className={`message ${msg.senderId === currentUser.id ? 'own' : 'other'}`}>
                      {msg.senderId !== currentUser.id && (
                        <div className="message-sender">{msg.senderName}</div>
                      )}
                      <div className="message-content">{msg.message}</div>
                      <div className="message-time">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="message-input">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button className="emoji-btn">
                    <FaSmile />
                  </button>
                  <button className="send-btn" onClick={sendMessage} disabled={!message.trim()}>
                    <FaPaperPlane />
                  </button>
                </div>
              </>
            ) : (
              <div className="no-chat-selected">
                <div className="welcome-message">
                  <FaComments size={64} />
                  <h3>Welcome to Project Chat!</h3>
                  <p>Select a project group from the sidebar to collaborate with your team members on assigned projects.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentChatPage;