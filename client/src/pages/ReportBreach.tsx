import React, { useState } from 'react';
import { useLocation } from 'wouter';
import SessionManager from '../utils/sessionManager';

// BREACH NOTIFICATION FILES - This file handles breach reporting form for teachers

const ReportBreach = () => {
  const [, navigate] = useLocation();
  
  // Check if user is logged in and is a teacher
  const userData = SessionManager.getSession();
  if (!userData) {
    navigate('/login');
    return null;
  }
  
  if (userData.role !== 'teacher') {
    if (userData.role === 'admin') {
      navigate('/admin/view-breaches');
    } else {
      navigate('/dashboard');
    }
    return null;
  }
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
  const [classes, setClasses] = useState([]);

  // Fetch boards from database
  React.useEffect(() => {
    fetch('http://localhost:8001/api/auth/get_boards/')
      .then(res => res.json())
      .then(data => setBoards(data.boards || []))
      .catch(() => setBoards(['CBSE', 'ICSE', 'State Board', 'IB']));
  }, []);
  const dataTypes = [
    'Student phone numbers',
    'Student grades/marks',
    'Student addresses',
    'Parent contact information',
    'Student photos',
    'Academic records',
    'Other personal information'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8001/api/breach/report/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.status === 'success') {
        setMessage(`Breach reported successfully! ${data.total_affected} students affected. ${data.notifications_sent} notifications sent.`);
        setFormData({
          description: '',
          data_type: '',
          source_board: '',
          source_class: '',
          target_board: '',
          target_class: '',
          reported_by: 'Teacher'
        });
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Fetch classes when board changes
    if (name === 'source_board' || name === 'target_board') {
      if (value) {
        fetch(`http://localhost:8001/api/auth/get_classes/?board=${value}`)
          .then(res => res.json())
          .then(data => setClasses(data.classes || []))
          .catch(() => setClasses(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Report Data Breach</h1>
          
          {message && (
            <div className={`p-4 rounded-md mb-6 ${
              message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What happened? *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Example: I accidentally sent CBSE Class 2 student phone numbers to ICSE Class 3 parents"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type of data affected *
              </label>
              <select
                name="data_type"
                value={formData.data_type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select data type</option>
                {dataTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="text-lg font-semibold text-red-700 mb-4">Source Group (Whose data was leaked)</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Board *</label>
                    <select
                      name="source_board"
                      value={formData.source_board}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select board</option>
                      {boards.map(board => (
                        <option key={board} value={board}>{board}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Class *</label>
                    <select
                      name="source_class"
                      value={formData.source_class}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select class</option>
                      {classes.map(cls => (
                        <option key={cls} value={cls}>Class {cls}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-lg font-semibold text-orange-700 mb-4">Target Group (Who received wrong data)</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Board *</label>
                    <select
                      name="target_board"
                      value={formData.target_board}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select board</option>
                      {boards.map(board => (
                        <option key={board} value={board}>{board}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Class *</label>
                    <select
                      name="target_class"
                      value={formData.target_class}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select class</option>
                      {classes.map(cls => (
                        <option key={cls} value={cls}>Class {cls}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reported by
              </label>
              <input
                type="text"
                name="reported_by"
                value={formData.reported_by}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? 'Reporting...' : 'Report Breach'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportBreach;