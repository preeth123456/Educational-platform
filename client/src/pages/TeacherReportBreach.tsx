// INCIDENT DETECTION FILE - Teacher breach reporting interface
import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { TeacherSidebarDemo } from '@/Teacher/components/TeacherSidebar';
import NewHeader from '@/components/NewHeader';
import SessionManager from '../utils/sessionManager';

// BREACH NOTIFICATION FILES - This file handles teacher breach reporting interface

const TeacherReportBreach = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    description: '',
    data_type: '',
    source_board: '',
    source_class: '',
    target_board: '',
    target_class: '',
    reported_by: 'Teacher'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [boards, setBoards] = useState([]);
  const [sourceClasses, setSourceClasses] = useState([]);
  const [targetClasses, setTargetClasses] = useState([]);

  const dataTypes = [
    'Student phone numbers',
    'Student grades/marks',
    'Student addresses',
    'Parent contact information',
    'Student photos',
    'Academic records',
    'Other personal information'
  ];

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/auth/get_boards/');
      const data = await response.json();
      setBoards(data.boards || ['CBSE', 'ICSE', 'State Board', 'IB']);
    } catch (error) {
      console.error('Error fetching boards:', error);
      setBoards(['CBSE', 'ICSE', 'State Board', 'IB']);
    }
  };

  const fetchClasses = async (board, type) => {
    try {
      const response = await fetch(`http://localhost:8001/api/auth/get_classes/?board=${board}`);
      const data = await response.json();
      const classes = data.classes || ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
      if (type === 'source') {
        setSourceClasses(classes);
      } else {
        setTargetClasses(classes);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      const defaultClasses = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
      if (type === 'source') {
        setSourceClasses(defaultClasses);
      } else {
        setTargetClasses(defaultClasses);
      }
    }
  };

  const handleBoardChange = (e, type) => {
    const board = e.target.value;
    if (type === 'source') {
      setFormData({ ...formData, source_board: board, source_class: '' });
      if (board) fetchClasses(board, 'source');
    } else {
      setFormData({ ...formData, target_board: board, target_class: '' });
      if (board) fetchClasses(board, 'target');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8001/api/breach/create-report/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Breach reported successfully!');
        setFormData({
          
          description: '',
          data_type: '',
          source_board: '',
          source_class: '',
          target_board: '',
          target_class: '',
          reported_by: 'Teacher'
        });
        setSourceClasses([]);
        setTargetClasses([]);
      } else {
        setMessage(`Error: ${data.message || 'Failed to report breach'}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="dashboard-container">
      <TeacherSidebarDemo open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="dashboard-main" style={{ 
        marginLeft: sidebarOpen ? '250px' : '60px',
        transition: 'margin-left 0.3s ease',
        width: `calc(100% - ${sidebarOpen ? '250px' : '60px'})`
      }}>
        <NewHeader 
          avatar="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" 
          name={SessionManager.getSession()?.name || 'Teacher'} 
          role="Teacher" 
          searchPlaceholder="Search..." 
          onSearch={(query) => console.log('Search:', query)} 
        />
        
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <FaExclamationTriangle style={{ color: '#dc2626', fontSize: '24px', marginRight: '10px' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Report Data Breach</h1>
        </div>
        
        {message && (
          <div style={{
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            backgroundColor: message.includes('Error') ? '#fef2f2' : '#f0fdf4',
            color: message.includes('Error') ? '#dc2626' : '#16a34a',
            border: `1px solid ${message.includes('Error') ? '#fecaca' : '#bbf7d0'}`
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              What happened? *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                resize: 'vertical'
              }}
              placeholder="Example: I accidentally sent CBSE Class 2 student phone numbers to ICSE Class 3 parents"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Type of data affected *
            </label>
            <select
              name="data_type"
              value={formData.data_type}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">Select data type</option>
              {dataTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '20px' }}>
            <div style={{ borderLeft: '4px solid #dc2626', paddingLeft: '15px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#dc2626', marginBottom: '15px' }}>
                Source Group (Whose data was leaked)
              </h3>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Board *
                </label>
                <select
                  name="source_board"
                  value={formData.source_board}
                  onChange={(e) => handleBoardChange(e, 'source')}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select board</option>
                  {boards.map(board => (
                    <option key={board} value={board}>{board}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Class *
                </label>
                <select
                  name="source_class"
                  value={formData.source_class}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select class</option>
                  {sourceClasses.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ borderLeft: '4px solid #ea580c', paddingLeft: '15px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ea580c', marginBottom: '15px' }}>
                Target Group (Who received wrong data)
              </h3>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Board *
                </label>
                <select
                  name="target_board"
                  value={formData.target_board}
                  onChange={(e) => handleBoardChange(e, 'target')}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select board</option>
                  {boards.map(board => (
                    <option key={board} value={board}>{board}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Class *
                </label>
                <select
                  name="target_class"
                  value={formData.target_class}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select class</option>
                  {targetClasses.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1
              }}
            >
              {loading ? 'Reporting...' : 'Report Breach'}
            </button>
          </div>
        </form>
      </div>
    </div>
      </div>
    </div>
  );
};

export default TeacherReportBreach;