import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaUsers, FaSearch, FaSmile } from 'react-icons/fa';
import SessionManager from '../utils/sessionManager';
import './StudentChat.css';

interface ChatUser {
  id: number;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
  role: 'student' | 'teacher';
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

const StudentChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    loadMockData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMockData = () => {
    // Mock chat rooms
    const mockRooms: ChatRoom[] = [
      {
        id: 1,
        name: 'Mathematics Class',
        type: 'class',
        participants: [],
        lastMessage: {
          id: 1,
          senderId: 2,
          senderName: 'Prof. Johnson',
          message: 'Tomorrow we will cover calculus basics',
          timestamp: new Date(Date.now() - 300000),
          type: 'text'
        },
        unreadCount: 2
      },
      {
        id: 2,
        name: 'Study Group - Physics',
        type: 'group',
        participants: [],
        lastMessage: {
          id: 2,
          senderId: 3,
          senderName: 'Alice',
          message: 'Can someone help with quantum mechanics?',
          timestamp: new Date(Date.now() - 600000),
          type: 'text'
        },
        unreadCount: 0
      },
      {
        id: 3,
        name: 'Emma Wilson',
        type: 'direct',
        participants: [],
        lastMessage: {
          id: 3,
          senderId: 4,
          senderName: 'Emma Wilson',
          message: 'Hey! Did you finish the assignment?',
          timestamp: new Date(Date.now() - 900000),
          type: 'text'
        },
        unreadCount: 1
      }
    ];

    // Mock users
    const mockUsers: ChatUser[] = [
      {
        id: 2,
        name: 'Prof. Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        isOnline: true,
        role: 'teacher'
      },
      {
        id: 3,
        name: 'Alice Smith',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
        isOnline: true,
        role: 'student'
      },
      {
        id: 4,
        name: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        isOnline: false,
        lastSeen: '2 hours ago',
        role: 'student'
      },
      {
        id: 5,
        name: 'Bob Johnson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        isOnline: true,
        role: 'student'
      }
    ];

    setChatRooms(mockRooms);
    setUsers(mockUsers);
  };

  const loadMessages = (roomId: number) => {
    // Mock messages for the selected room
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

    // Update last message in chat room
    setChatRooms(prev => prev.map(room => 
      room.id === selectedRoom.id 
        ? { ...room, lastMessage: newMessage }
        : room
    ));
  };

  const selectRoom = (room: ChatRoom) => {
    setSelectedRoom(room);
    loadMessages(room.id);
    // Mark as read
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

  const totalUnread = chatRooms.reduce((sum, room) => sum + room.unreadCount, 0);

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>💬 Student Chat</h3>
            <button className="close-chat" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>

          <div className="chat-content">
            {!selectedRoom ? (
              <>
                {/* Chat Tabs */}
                <div className="chat-tabs">
                  <button 
                    className={`tab ${activeTab === 'chats' ? 'active' : ''}`}
                    onClick={() => setActiveTab('chats')}
                  >
                    💬 Chats ({chatRooms.length})
                  </button>
                  <button 
                    className={`tab ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                  >
                    👥 People ({users.length})
                  </button>
                </div>

                {/* Search */}
                <div className="search-bar">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Chat List or Users List */}
                <div className="chat-list">
                  {activeTab === 'chats' ? (
                    filteredRooms.map(room => (
                      <div key={room.id} className="chat-item" onClick={() => selectRoom(room)}>
                        <div className="chat-avatar">
                          {room.type === 'class' ? '🏫' : room.type === 'group' ? '👥' : '👤'}
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
                            {user.role === 'teacher' && <span className="teacher-badge">👨‍🏫</span>}
                          </div>
                          <div className="user-status">
                            {user.isOnline ? 'Online' : user.lastSeen}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Chat Header */}
                <div className="active-chat-header">
                  <button className="back-btn" onClick={() => setSelectedRoom(null)}>
                    ←
                  </button>
                  <div className="chat-title">
                    <h4>{selectedRoom.name}</h4>
                    <span className="chat-type">
                      {selectedRoom.type === 'class' ? '🏫 Class Chat' : 
                       selectedRoom.type === 'group' ? '👥 Study Group' : '💬 Direct Message'}
                    </span>
                  </div>
                </div>

                {/* Messages */}
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

                {/* Message Input */}
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
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default StudentChat;